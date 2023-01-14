import Logger from "../structures/Logger";

export default () => {

    const ignoredErrors = (stack: any): boolean => {

        if (stack.toString().includes("Unknown interaction")) {
            Logger.run(`Laggy interaction (Unknown interaction)\n`, {
                color: "yellow", stringBefore: "\n", category: "Ignored Errors"
            });
            return true;
        }

        return false;
    
    }
    
    process.on('uncaughtException', (err: Error) => {
        if (ignoredErrors(err.stack)) return;
        Logger.run(`:\n${err.stack}\n`, {
            color: "red", stringBefore: "\n", category: "Uncaught Exception"
        });
    });
    
    process.on('unhandledRejection', (reason: any) => {
        if (ignoredErrors(reason.stack)) return;
        Logger.run(`:\n${reason.stack ? reason.stack : reason}\n`, {
            color: "red", stringBefore: "\n", category: "Unhandled Rejection"
        });
    });

}