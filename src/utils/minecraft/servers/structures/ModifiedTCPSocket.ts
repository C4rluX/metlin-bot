import { Socket, createConnection } from "node:net";
import { EventEmitter } from "node:events";

import util from "util";
const decoder = new util.TextDecoder();

interface ModifiedTCPSocketOptions {
    host: string,
    port: number,
    timeout: number
}

export default class ModifiedTCPSocket extends EventEmitter {

    public host: string;
    public port: number;
    public timeout: number;

    private data: Buffer = Buffer.alloc(0);

    public socket: Socket | null = null;

    constructor(options: ModifiedTCPSocketOptions) {
        super();
        this.host = options.host;
        this.port = options.port;
        this.timeout = options.timeout;
    }

    public init() {

        if (this.port < 0 || this.port > 65536 || isNaN(this.port)) {
            this.emit("error", "Port out of range");
            return;
        }

        this.socket = createConnection({ 
            host: this.host,
            port: this.port,
            timeout: this.timeout
        });

        this.socket.on("data", (chunk) => {
            this.data = Buffer.concat([this.data, chunk]);
        });
    
        this.socket.on("close", () => {
            this.end();
            this.emit("error", "Socket closed");
        });
    
        this.socket.on("error", (err) => {
            this.end();
            this.emit("error", err);
        });

    }

    public async waitUntilDataIsAvailable(length: number): Promise<void> {
        return await new Promise((resolve) => {
            if (this.data.byteLength >= length) return resolve();
            const dataListener = () => {
                if (this.data.byteLength >= length) {
                    this.socket?.removeListener("data", dataListener);
                    resolve();
                }
            }
            this.socket?.on("data", dataListener);
        });
    }

    public async readVarInt(readByte: () => Promise<number>) {

        // Direct source:
        // https://github.com/PassTheMayo/minecraft-server-util/blob/master/src/util/varint.ts

        let reads = 0;
        let result = 0;
        let read = 0;
        let value = 0;

        do {

            if (reads > 4) throw new Error();

            read = await readByte();
            value = (read & 0b01111111);
            result |= (value << (7 * reads));
            reads++;

            if (reads > 5) throw new Error();

        } while ((read & 0b10000000) != 0);

        return result;

    }

    public async readUInt8() {
        await this.waitUntilDataIsAvailable(1);
        const int = this.data.readUint8(0);
        this.data = this.data.subarray(1);
        return int;
    }

    public async readStringVarInt() {
        const length = await this.readVarInt(() => this.readUInt8());
        await this.waitUntilDataIsAvailable(length);
        const string = this.data.subarray(0, length);
        this.data = this.data.subarray(length);
        return decoder.decode(string);
    }

    public end() {
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.end();
            this.socket.destroy();
        }
    }

}