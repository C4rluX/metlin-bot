import * as strings from "./string-related";

export function escapeVariablesObject(obj: any) {
    const object = { ...obj };
    Object.keys(object).forEach(key => {
        object[key] = strings.escapeForJSON(object[key]);
    });
    return object;
}

export function parseVariables(json: any, variables: any) {
    if (!variables || !Object.keys(variables).length) return json;
    const string = JSON.stringify(json);
    return JSON.parse(strings.parseVariables(string, escapeVariablesObject(variables)));
}

export function accessByString(properties: string, object: any): any {

    try {

        const keys = properties.split(".");
        let next = {};

        keys.forEach((key) => {
            if (!Object.keys(next).length) {
                next = object[key as keyof typeof object];
            } else {
                next = next[key as keyof typeof next];
            }
        });

        return next;
        
    } catch (err) {
        return null;
    }

}