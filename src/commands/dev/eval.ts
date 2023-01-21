import { escapeMarkdown, codeBlock, EmbedBuilder } from "discord.js";
import Command from "../../structures/Command";
import Logger from "../../structures/Logger";
import { stringifyAny } from "../../utils/string-related";

export default new Command({
    name: "eval",
    alias: [],
    developersOnly: true,
    run: async (client, message, args) => {

        const code = message.content.replace(args[0], "").trim();

        try {
            var result = eval(code);
        } catch (err: any) {
            return await message.reply({ content: `Error:\n\n**${escapeMarkdown(err.stack)}**` })
        }

        const readableResult = stringifyAny(result);
        const resultCodeBlock = codeBlock("js", readableResult ? readableResult.replaceAll(client.token || "", "<token>") : " ");
        
        const embed = new EmbedBuilder()
        .setFields([
            {
                name: "Result:",
                value: resultCodeBlock.length > 1024 ? codeBlock("The result is way too long.\nLogged in the console.") : resultCodeBlock
            },
            {
                name: "Datatype:",
                value: codeBlock("js", typeof result)
            }
        ])
        .setColor(39129)

        if (readableResult.length > 1024) {
            Logger.run(`Result\n${readableResult}\n`, {
                color: "blue", stringBefore: "\n", category: "Eval"
            });
        }

        return await message.reply({ embeds: [embed] });

    }
})