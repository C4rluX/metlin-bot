import util from "util";
const encoder = new util.TextEncoder();

export function varIntBuffer(num: number) {

    // Direct source:
    // https://github.com/chrisdickinson/varint/blob/master/encode.js

    const msb = 0x80;
    const msball = ~0x7F;
    const int32Length = Math.pow(2, 31);

    if (num > Number.MAX_SAFE_INTEGER) throw new RangeError("Number too big");

    let out = [];
    let offset = 0;

    while (num >= int32Length) {
        out[offset++] = (num & 0xff) | msb;
        num /= 128;
    }

    while (num & msball) {
        out[offset++] = (num & 0xff) | msb;
        num >>>= 7;
    }

    out[offset] = num | 0;

    return Buffer.from(out);

}

export function stringVarIntBuffer(string: string) {
    const data = encoder.encode(string);
    return Buffer.concat([varIntBuffer(data.byteLength), data]);
}

export function uInt16BEBuffer(number: number) {
    const buffer = Buffer.alloc(2);
    buffer.writeUint16BE(number);
    return buffer;
}

export function prefixLength(buffer: Buffer) {
    return Buffer.concat([ varIntBuffer(buffer.byteLength), buffer ]);
}