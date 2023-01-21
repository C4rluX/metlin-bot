import Logger from "../structures/Logger";

export default function uncacheModule(path: string) {
    try {
        delete require.cache[require.resolve(path)];
    } catch (err: any) {
        Logger.run(err?.stack, { color: "red" });
    }
}