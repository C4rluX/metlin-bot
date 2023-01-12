import { AttachmentBuilder, escapeMarkdown, hyperlink, SlashCommandStringOption, SlashCommandSubcommandBuilder } from "discord.js"
import SlashCommandSubCommand from "../../../structures/SlashCommandSubcommand"
import { defaultEmbed } from "../../../utils/embeds";
import * as banners from "../../../utils/minecraft/servers/banners";
import queryServerStatus from "../../../utils/minecraft/servers/query-java";
import { removeColorCodes } from "../../../utils/minecraft/util";

export default new SlashCommandSubCommand({
    parent: "minecraft",
    data: new SlashCommandSubcommandBuilder()
    .setName("servidor")
    .setDescription("Te permite ver la información de algún servidor de Minecraft.")
    .addStringOption(
        new SlashCommandStringOption()
        .setName("ip")
        .setDescription("IP (o dirección) del servidor de Minecraft")
        .setRequired(true)
    ),
    async run(client, interaction) {

        await interaction.deferReply();

        const ip = interaction.options.getString("ip", true).toLowerCase();
        const [host, port] = ip.split(":");
        
        try {

            if (ip.startsWith("localhost") || ip.startsWith("127.0.0.1")) throw new Error("No localhost, please");

            const portNumber = parseInt(port);
            if (port && (isNaN(portNumber) || portNumber < 0 || portNumber > 65536)) throw new Error("Invalid port");
            var serverInfo = await queryServerStatus({ host, port: port ? portNumber : undefined })

        } catch (err: any) {
            return await interaction.editReply({
                content: "No se pudo obtener información del servidor de Minecraft especificado. Puedes intentar nuevamente con otro servidor.",
            });
        }

        const embed = defaultEmbed()
        .setTitle(`Información del servidor (Minecraft Java):`)
        .setDescription(
            [
                `**IP del servidor:** ${escapeMarkdown(host)}`,
                `**Jugadores:** ${serverInfo.players.online}/${serverInfo.players.max}`,
                `**Versiones:** ${escapeMarkdown(removeColorCodes(serverInfo.version.name))}`
            ].join("\n")
        )
        .setImage("attachment://banner.png");

        const files: AttachmentBuilder[] = [];

        if (serverInfo.favicon) {
            const icon = new AttachmentBuilder(serverInfo.favicon.buffer, { name: "icon.png" })
            files.push(icon);
            embed.setThumbnail("attachment://icon.png");
        }

        const bannerBuffer = await banners.generate({
            name: ip,
            players: serverInfo.players,
            motd: serverInfo.motd,
            favicon: serverInfo.favicon?.buffer
        });
        const banner = new AttachmentBuilder(bannerBuffer, { name: "banner.png" });
        files.push(banner);

        return await interaction.editReply({ embeds: [embed], files });

    }
});