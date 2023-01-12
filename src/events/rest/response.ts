import Event from "../../structures/Event";
import Logger from "../../structures/Logger";

export default new Event({
    name: "response",
    once: false,
    run: (client, response) => {
        // Logger.run(response);
    }
})