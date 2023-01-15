import { formatToRaw } from "../motd";
import Socket from "./structures/ModifiedTCPSocket";
import { prefixLength, stringVarIntBuffer, uInt16BEBuffer, varIntBuffer } from "./util";

interface JavaStatusOptions {
    host: string,
    port?: number,
    timeout?: number
}

interface JavaStatusResponse {
    version: {
        protocol: number,
        name: string,
    },
    players: {
        max: number,
        online: number,
        sample?: Array<{
            name: string,
            id: string
        }>
    },
    motd: string,
    favicon: {
        buffer: Buffer,
        mimeType: string
    } | null
}

export default async function query(options: JavaStatusOptions): Promise<JavaStatusResponse> {

    return await new Promise<JavaStatusResponse>(async (resolve, reject) => {

        // Parse arguments
        options.port = options.port ?? 25565;
        options.timeout = options.timeout ?? 30_000;

        // Start connection
        const connection = new Socket({
            host: options.host,
            port: options.port,
            timeout: options.timeout
        });
        connection.init();
        
        const timeout = setTimeout(() => {
            connection.end();
            reject("Timeout");
        }, options.timeout);

        connection.on("error", (error) => {
            clearTimeout(timeout);
            reject(error);
        });

        // Handshake packet
        const handshakePacket = Buffer.concat([
            varIntBuffer(0x00), // packet id
            varIntBuffer(47), // protocol version
            stringVarIntBuffer(options.host), // host
            uInt16BEBuffer(options.port), // port
            varIntBuffer(1) // 1 for status, 2 for login
        ]);
        await new Promise<void>((resolve, reject) => {
            connection.socket?.write(prefixLength(handshakePacket), (error) => {
                if (error) {
                    clearTimeout(timeout);
                    reject(error);
                }
                resolve();
            })
        });

        // Request packet
        const requestPacket = Buffer.concat([ varIntBuffer(0x00) ]);
        await new Promise<void>((resolve, reject) => {
            connection.socket?.write(prefixLength(requestPacket), (error) => {
                if (error) {
                    clearTimeout(timeout);
                    reject(error);
                }
                resolve();
            })
        });

        // Getting packet length, trimming the rest of the buffer and waiting for the full packet
        const packetLength = await connection.readVarInt(() => connection.readUInt8());
        await connection.waitUntilDataIsAvailable(packetLength);

        // Getting packet ID/type, that should be 0x00 always
        const type = await connection.readVarInt(() => connection.readUInt8());
        if (type !== 0x00) {
            clearTimeout(timeout);
            reject("Invalid server response");
        }

        // Parsing the JSON response, disconnect socket and return final object
        const response = JSON.parse(await connection.readStringVarInt());
        connection.end();
        clearTimeout(timeout);
        
        const result = { ...response, favicon: null };
        delete result.description;
        result.motd = formatToRaw(response.description);

        if (response.favicon) {
            const parts: Array<string> = response.favicon.split(",");
            result.favicon = {
                buffer: Buffer.from(parts[1], "base64"),
                mimeType: parts[0].split(";")[0].replace("data:", "")
            }
        }

        resolve(result);

    });

}