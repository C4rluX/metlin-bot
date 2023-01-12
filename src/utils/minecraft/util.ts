export const nickRegex = /[a-zA-Z0-9_]/g;

export function testNick(nick: string) {

    if (!nick) return false;
    if (nick.length < 3 || nick.length > 16) return false;
    if (nick.includes("\n")) return false;
    if (nick.length !== [...nick.matchAll(nickRegex)].length) return false;
    return true;

}

export function removeColorCodes(text: string) {
    return text.replaceAll(/§./g, "").trim(); 
}