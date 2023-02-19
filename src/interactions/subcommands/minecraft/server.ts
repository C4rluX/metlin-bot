import { AttachmentBuilder, escapeMarkdown, SlashCommandStringOption, SlashCommandSubcommandBuilder } from "discord.js"
import SlashCommandSubCommand from "../../../structures/SlashSubCommand"
import { defaultEmbed } from "../../../utils/embeds";
import * as banners from "../../../utils/minecraft/servers/banners";
import queryServerStatus from "../../../utils/minecraft/servers/status-java";
import { removeColorCodes } from "../../../utils/minecraft/util";
import * as translations from "../../../utils/translations";

const info = translations.getSlashCommandMeta("minecraft.server", { lang: "default" }) as translations.SlashCommandMeta;
const data = new SlashCommandSubcommandBuilder()
.setName(info.name)
.setDescription(info.description)
.setNameLocalizations(translations.getSlashCommandMeta("minecraft.server.name", { lang: "all" }))
.setDescriptionLocalizations(translations.getSlashCommandMeta("minecraft.server.description", { lang: "all" }))
.addStringOption(
    new SlashCommandStringOption()
    .setName(info.options.ip.name)
    .setDescription(info.options.ip.name)
    .setNameLocalizations(translations.getSlashCommandMeta("minecraft.server.options.ip.name", { lang: "all" }))
    .setDescriptionLocalizations(translations.getSlashCommandMeta("minecraft.server.options.ip.description", { lang: "all" }))
    .setRequired(true)
)

export default new SlashCommandSubCommand({
    parent: translations.getSlashCommandMeta("minecraft.name", { lang: "default" }),
    data,
    async run(client, interaction) {

        await interaction.deferReply();

        const ip = interaction.options.getString(info.options.ip.name, true).toLowerCase();
        const [host, port] = ip.split(":");
        
        try {

            if (ip.startsWith("localhost") || ip.startsWith("127.0.0.1")) throw new Error("No localhost, please");

            const portNumber = parseInt(port);
            if (port && (isNaN(portNumber) || portNumber < 0 || portNumber > 65536)) throw new Error("Invalid port");
            var serverInfo = await queryServerStatus({ host, port: port ? portNumber : undefined })

        } catch (err: any) {
            return await interaction.editReply({
                content: translations.get("commands.minecraft.server.error", { lang: interaction.locale }),
            });
        }

        const embed = defaultEmbed()
        .setTitle(translations.get("commands.minecraft.server.javaTitle", { lang: interaction.locale }))
        .setDescription(
            [
                translations.get("commands.minecraft.server.ipField", {
                    lang: interaction.locale,
                    variables: { ip: escapeMarkdown(host) }
                }),
                translations.get("commands.minecraft.server.playersField", {
                    lang: interaction.locale,
                    variables: { online: serverInfo.players.online, max: serverInfo.players.max }
                }),
                translations.get("commands.minecraft.server.versions", {
                    lang: interaction.locale,
                    variables: { versions: escapeMarkdown(removeColorCodes(serverInfo.version.name)) }
                })
            ].join("\n")
        )
        .setImage("attachment://banner.png");

        const files: AttachmentBuilder[] = [];

        if (serverInfo.favicon) {
            const icon = new AttachmentBuilder(serverInfo.favicon.buffer, { name: "icon.png" })
            files.push(icon);
            embed.setThumbnail("attachment://icon.png");
        }

        try {
            const bannerBuffer = await banners.generate({
                name: ip,
                players: serverInfo.players,
                motd: serverInfo.motd,
                favicon: serverInfo.favicon?.buffer
            });
            const banner = new AttachmentBuilder(bannerBuffer, { name: "banner.png" });
            files.push(banner);
        } catch (err) {
            return await interaction.editReply({
                content: translations.get("commands.minecraft.server.error", { lang: interaction.locale }),
            });
        }

        return await interaction.editReply({ embeds: [embed], files });

    }
});