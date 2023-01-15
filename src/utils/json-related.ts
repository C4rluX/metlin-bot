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