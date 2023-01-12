import Bot from "./Bot";

interface EventData {
    name: string,
    once: boolean,
    run: (client: Bot, ...args: any[]) => void
}

export default class Event {

    public name: EventData["name"];
    public once: EventData["once"];
    public run: EventData["run"]

    constructor(data: EventData) {
        this.name = data.name;
        this.once = data.once;
        this.run = data.run;
    }
    
}