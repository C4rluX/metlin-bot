import { createCanvas, loadImage, Image } from "canvas";
import { randomRange } from "../../number-related";
import * as preloads from "../../preloads";
import { MotdColorCodesHex, MotdColorCodes, MotdFormatCodes } from "../motd";

interface BannerGeneratorOptions {  
    name: string,
    players: {
        max: number,
        online: number
    },
    motd?: string,
    favicon?: Buffer
}

interface MotdPart {
    text: string,
    isColor: boolean,
    code: typeof MotdColorCodes[keyof typeof MotdColorCodes] | typeof MotdFormatCodes[keyof typeof MotdFormatCodes];
}

function parseMotd(motd: string, useAmpersand?: boolean): MotdPart[] {

    const result: MotdPart[] = [];
    `§r${motd}`.split(useAmpersand ? "&" : "§").filter(e => e).forEach((part) => {
        let code: MotdPart["code"] = MotdColorCodes[part[0] as keyof typeof MotdColorCodes];
        let isColor = true;
        if (!code) {
            code = MotdFormatCodes[part[0] as keyof typeof MotdFormatCodes];
            isColor = false;
        }
        result.push({ code, isColor, text: "" })
        part.slice(1).split("").forEach(text => { result.push({ code, isColor, text }); });
    });

    return result;

}

export async function generate(options: BannerGeneratorOptions) {

    // Create canvas
    const canvas = createCanvas(1368, 176);
    const ctx = canvas.getContext("2d");

    // Load favicon
    const favicon = options.favicon ? await loadImage(options.favicon) : preloads.get("default_server_icon");
    if (!favicon) throw new Error("Favicon loading error (Image object was empty while trying to load it).");
    if (favicon instanceof Buffer) throw new Error("Favicon loading error (Image object was a Buffer instance instead of an Image).");

    // Load and draw background
    const background  = preloads.get("server_banner_background");
    if (!background || background instanceof Buffer) throw new Error("Background loading error (Background was an invalid Image instance when it loaded).");
    ctx.drawImage(background, 0, 0);

    // Draw favicon without smoothing
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(favicon, 24, 24, 128, 128);
    ctx.imageSmoothingEnabled = true;
    
    // Set default font
    ctx.font = "40px minecraftia, code2000";

    // Draw max players count
    ctx.textAlign = "right";
    let playersX = 1284;
    ctx.fillStyle = MotdColorCodesHex.gray;
    ctx.fillText(options.players.max.toString(), playersX, 78);
    playersX -= ctx.measureText(options.players.max.toString()).width + 3;

    // Draw slash separator for online and max players
    ctx.fillStyle = MotdColorCodesHex.dark_gray;
    ctx.fillText("/", playersX, 78);
    playersX -= ctx.measureText("/").width + 3;

    // Draw online players count
    ctx.fillStyle = MotdColorCodesHex.gray;
    ctx.fillText(options.players.online.toString(), playersX, 78);

    // Draw server title
    ctx.textAlign = "left";
    ctx.fillStyle = MotdColorCodesHex.white;
    ctx.fillText(options.name, 176, 78);

    // Parse and draw server motd
    const motd = (options.motd || "§7A Minecraft Server").split(/\r?\n/).map(e => parseMotd(e));
    motd.forEach((line, lineIndex) => {

        let x = 176;
        let y = 133 + (lineIndex * 50);
        let styleContext: string[] = [];

        line.forEach((linePart) => {

            const reset = () => {
                ctx.font = "40px minecraftia, code2000";
                styleContext = [];
            }

            if (linePart.isColor) {
                if (linePart.text === " ") reset();
                ctx.fillStyle = MotdColorCodesHex[linePart.code as keyof typeof MotdColorCodesHex];
            } else {
                if (linePart.code === "bold") ctx.font = "bold 40px minecraftia, code2000";
                if (linePart.code === "italic") ctx.font = "italic 40px minecraftia, code2000";
                if (
                    linePart.code === "underlined" ||
                    linePart.code === "strikethrough" ||
                    linePart.code === "obfuscated"
                ) styleContext.push(linePart.code);
                if (
                    linePart.code === "reset" ||
                    linePart.text === " "
                ) reset();
            }
            
            if (!linePart.text) return;

            if (styleContext.includes("obfuscated")) {
                linePart.text = linePart.text.split("").map(char => {
                    if (!char.trim()) return char;
                    return String.fromCharCode(randomRange(33, 127));
                }).join("");
            }

            const { width, actualBoundingBoxDescent } = ctx.measureText(linePart.text);
            const isFallback = actualBoundingBoxDescent > -8;

            if (styleContext.includes("strikethrough")) ctx.fillRect(x, y - 40, width, 4);
            if (styleContext.includes("underlined")) ctx.fillRect(x, y - 21, width, 4);

            ctx.fillText(
                linePart.text,
                (linePart.code === "italic") ? x - (isFallback ? 9 : 6) : x - (isFallback ? 2 : 0),
                isFallback ? y - 29 : y
            );
            
            x += width + (linePart.code === "italic" ? 5 : 0);

        });

    });

    // Return buffer as a promise (to not block the thread)
    return await new Promise<Buffer>((resolve, reject) => {
        canvas.toBuffer((err, buf) => {
            if (err) reject(err);
            resolve(buf);
        }, "image/png")
    });

}