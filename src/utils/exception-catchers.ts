import Logger from "../structures/Logger";

export default () => {

    const ignoredErrors = (stack: any): boolean => {

        if (stack.toString().includes("Unknown interaction")) {
            Logger.run(`[Ignored Errors]: Laggy interaction (Unknown interaction)\n`, { color: "yellow", stringBefore: "\n" });
            return true;
        }

        return false;
    
    }
    
    process.on('uncaughtException', (err: Error) => {
        if (ignoredErrors(err.stack)) return;
        Logger.run(`[Uncaught Exception]:\n${err.stack}\n`, { color: "red", stringBefore: "\n" });
    });
    
    process.on('unhandledRejection', (reason: any) => {
        if (ignoredErrors(reason.stack)) return;
        Logger.run(`[Unhandled Rejection]:\n${reason.stack ? reason.stack : reason}\n`, { color: "red", stringBefore: "\n" })
    });

}