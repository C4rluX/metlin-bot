export function stringifyAny(object: any): string {
    if (object === undefined) return "undefined";
    if (object === null) return "null";
    return typeof object === 'object' ?
        (Object.keys(object).length ? JSON.stringify(object, null, 4) : object.toString())
    : object.toString();
}

export function upperCaseByIndexes(string: string, indexes: [number]) {
    if (!string) return string;
    return string.split("").map((letter, index) => {
       if (!indexes.includes(index)) return letter;
       return letter.toUpperCase();
    }).join("");
}

export function lowerCaseByIndexes(string: string, indexes: [number]) {
    if (!string) return string;
    return string.split("").map((letter, index) => {
       if (!indexes.includes(index)) return letter;
       return letter.toLowerCase();
    }).join("");
}

export function joinArrayWithLastChar(array: Array<string>, char: string, lastChar: string) {
    if (array.length < 2) { return array.join(""); }
    else {
        const last = array.pop();
        return array.join(char) + lastChar + last;
    }
}

export function cut(string: string, maxLength: number, end: string = "...") {
    return (string.length > maxLength) ? string.substring(0, maxLength) + end : string;
}