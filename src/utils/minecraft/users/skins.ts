import { createCanvas, loadImage, Image } from "canvas";
import * as preloads from "../../preloads";

interface SkinImageOptions {
    scale?: number,
    layers?: boolean
}

function checkSlim(skin: Image) {

    // Utility function that checks if a skin is slim (Alex based skins, 3px arms)
    // This checks if exactly the pixel located at x=55 and y=20 is empty
    // This pixel usually in classic skins has something because is near the arms textures

    const canvas = createCanvas(64, 64);
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(skin, 0, 0);
    return ctx.getImageData(55, 20, 1, 1).data.every(e => e === 0);

}

async function fullBodySkin32(image: Image, options: SkinImageOptions) {

    options.scale = options.scale ?? 1;

    // Load image stuff
    const canvas = createCanvas(16 * options.scale, 32 * options.scale);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Draw right leg (left leg from third person)
    ctx.drawImage(image, 4, 20, 4, 12, 4 * options.scale, 20 * options.scale, 4 * options.scale, 12 * options.scale);

    // Draw left leg (right leg from third person) - In 1.7 skins this leg is the same as the right one, but flipped
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(image, 4, 20, 4, 12, -12 * options.scale, 20 * options.scale, 4 * options.scale, 12 * options.scale);
    ctx.restore();

    // Draw right arm (left arm from third person)
    ctx.drawImage(image, 44, 20, 4, 12, 0, 8 * options.scale, 4 * options.scale, 12 * options.scale);

    // Draw left arm (right arm from third person) - In 1.7 skins this arm is the same as the right one, but flipped
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(image, 44, 20, 4, 12, -16 * options.scale, 8 * options.scale, 4 * options.scale, 12 * options.scale);
    ctx.restore();

    // Draw head
    ctx.drawImage(image, 8, 8, 8, 8, 4 * options.scale, 0, 8 * options.scale, 8 * options.scale); 
    if (options.layers) ctx.drawImage(image, 40, 8, 8, 8, 4 * options.scale, 0, 8 * options.scale, 8 * options.scale);

    // Draw chest
    ctx.drawImage(image, 20, 20, 8, 12, 4 * options.scale, 8 * options.scale, 8 * options.scale, 12 * options.scale);

    // Return buffer as a promise (to not block the thread)
    return await new Promise<Buffer>((resolve, reject) => {
        canvas.toBuffer((err, buf) => {
            if (err) reject(err);
            resolve(buf);
        }, "image/png")
    });

}

async function fullBodySkin64(image: Image, options: SkinImageOptions) {

    options.scale = options.scale ?? 1;

    // Load image stuff
    const canvas = createCanvas(16 * options.scale, 32 * options.scale);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Draw head
    ctx.drawImage(image, 8, 8, 8, 8, 4 * options.scale, 0, 8 * options.scale, 8 * options.scale); 
    if (options.layers) ctx.drawImage(image, 40, 8, 8, 8, 4 * options.scale, 0, 8 * options.scale, 8 * options.scale);

    // Draw chest
    ctx.drawImage(image, 20, 20, 8, 12, 4 * options.scale, 8 * options.scale, 8 * options.scale, 12 * options.scale);
    if (options.layers) ctx.drawImage(image, 20, 36, 8, 12, 4 * options.scale, 8 * options.scale, 8 * options.scale, 12 * options.scale);

    if (checkSlim(image)) {

        // Draw right arm (left arm from third person)
        ctx.drawImage(image, 44, 20, 3, 12, 1 * options.scale, 8 * options.scale, 3 * options.scale, 12 * options.scale);
        if (options.layers) ctx.drawImage(image, 44, 36, 3, 12, 1 * options.scale, 8 * options.scale, 3 * options.scale, 12 * options.scale);

        // Draw left arm (right arm from third person)
        ctx.drawImage(image, 36, 52, 3, 12, 12  * options.scale, 8 * options.scale, 3 * options.scale, 12 * options.scale);
        if (options.layers) ctx.drawImage(image, 52, 52, 3, 12, 12  * options.scale, 8 * options.scale, 3 * options.scale, 12 * options.scale);

    } else {

        // Draw right arm (left arm from third person)
        ctx.drawImage(image, 44, 20, 4, 12, 0, 8 * options.scale, 4 * options.scale, 12 * options.scale);
        if (options.layers) ctx.drawImage(image, 44, 36, 4, 12, 0, 8 * options.scale, 4 * options.scale, 12 * options.scale);

        // Draw left arm (right arm from third person)
        ctx.drawImage(image, 36, 52, 4, 12, 12 * options.scale, 8 * options.scale, 4 * options.scale, 12 * options.scale);
        if (options.layers) ctx.drawImage(image, 52, 52, 4, 12, 12 * options.scale, 8 * options.scale, 4 * options.scale, 12 * options.scale);

    }

    // Draw left leg (right leg from third person)
    ctx.drawImage(image, 20, 52, 4, 12, 8 * options.scale, 20 * options.scale, 4 * options.scale, 12 * options.scale);
    if (options.layers) ctx.drawImage(image, 4, 52, 4, 12, 8 * options.scale, 20 * options.scale, 4 * options.scale, 12 * options.scale);

    // Draw right leg (left leg from third person)
    ctx.drawImage(image, 4, 20, 4, 12, 4 * options.scale, 20 * options.scale, 4 * options.scale, 12 * options.scale);
    if (options.layers) ctx.drawImage(image, 4, 36, 4, 12, 4 * options.scale, 20 * options.scale, 4 * options.scale, 12 * options.scale);
    
    // Return buffer as a promise (to not block the thread)
    return await new Promise<Buffer>((resolve, reject) => {
        canvas.toBuffer((err, buf) => {
            if (err) reject(err);
            resolve(buf);
        }, "image/png")
    });

}

export async function getFullBody(skin: Buffer | "steve" | "alex", options: SkinImageOptions): Promise<Buffer> {
        
    // Parse arguments
    options.scale = options.scale ?? 1;
    
    // Load image stuff
    const image = typeof skin === "string" ? preloads.get(`${skin}_skin`) : await loadImage(skin);
    if (!image) throw new Error("Skin rendering error (Image object was empty while trying to load it).");
    if (image instanceof Buffer) throw new Error("Skin rendering error (Image object was a Buffer instance instead of an Image).");

    // Autodetects if the skin has a height of 32px (old skins before 1.8) or a height of 64px (actual modern skin format)
    if (image.height < 64) return await fullBodySkin32(image, options);
    return await fullBodySkin64(image, options);

}

export async function getHead(skin: Buffer | "steve" | "alex", options: SkinImageOptions) {

    // Parse arguments
    options.scale = options.scale ?? 1;

    // Load image stuff
    const canvas = createCanvas(8 * options.scale, 8 * options.scale);
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false;

    const image = typeof skin === "string" ? preloads.get(`${skin}_skin`) : await loadImage(skin);
    if (!image) throw new Error("Skin rendering error (Image object was empty while trying to load it).");
    if (image instanceof Buffer) throw new Error("Skin rendering error (Image object was a Buffer instance instead of an Image).");

    // Draw head
    ctx.drawImage(image, 8, 8, 8, 8, 0, 0, 8 * options.scale, 8 * options.scale);
    if (options.layers) ctx.drawImage(image, 40, 8, 8, 8, 0, 0, 8 * options.scale, 8 * options.scale);

    // Return buffer as a promise (to not block the thread)
    return await new Promise<Buffer>((resolve, reject) => {
        canvas.toBuffer((err, buf) => {
            if (err) reject(err);
            resolve(buf);
        }, "image/png")
    });

}