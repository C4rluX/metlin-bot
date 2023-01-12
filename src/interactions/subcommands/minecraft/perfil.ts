import { AttachmentBuilder, escapeMarkdown, hyperlink, SlashCommandStringOption, SlashCommandSubcommandBuilder } from "discord.js"
import SlashCommandSubCommand from "../../../structures/SlashCommandSubcommand"
import { testNick } from "../../../utils/minecraft/util";
import { basicProfile, fullProfile } from "../../../utils/minecraft/users/fetch";
import { getFullBody, getHead } from "../../../utils/minecraft/users/skins";
import { defaultEmbed } from "../../../utils/embeds";
import fetch from "node-fetch";
import Logger from "../../../structures/Logger";

export default new SlashCommandSubCommand({
    parent: "minecraft",
    data: new SlashCommandSubcommandBuilder()
        .setName("perfil")
        .setDescription("Ver la información de algún jugador de Minecraft")
        .addStringOption(
            new SlashCommandStringOption()
                .setName("nick")
                .setDescription("Nick del jugador de Minecraft")
                .setRequired(true)
        ),
    run: async (client, interaction) => {

        const nick = interaction.options.getString("nick") || "";

        if (!testNick(nick)) {
            return await interaction.reply({
                content: "El nick de Minecraft especificado es inválido.",
                ephemeral: true
            });
        }

        async function nickFetchError() {
            return await interaction.editReply({
                content: "No se pudo encontrar información de ese jugador."
            });
        }

        await interaction.deferReply();

        try {
            var userId = (await basicProfile(nick)).id;
        } catch (err) { return await nickFetchError(); }

        try {
            var userData = await fullProfile(userId || "");
        } catch (err) { return await nickFetchError(); }

        if (!userId) return await nickFetchError();

        const texturesData = JSON.parse(Buffer.from(userData.properties?.at(0).value, 'base64').toString('utf8'));

        const embed = defaultEmbed()
            .setTitle("Información del jugador:")
            .addFields(
                { name: "Nombre del jugador:", value: escapeMarkdown(userData.name || "abc") },
                { name: "Identificador único (UUID):", value: userData.id || "" },
                {
                    name: "Skin:",
                    value: hyperlink("Enlace de la Skin", texturesData.textures.SKIN.url)
                }
            )

        if (texturesData.textures.CAPE) {
            embed.addFields([{
                name: "Capa:",
                value: hyperlink("Enlace de la Capa", texturesData.textures.CAPE.url)
            }]);
        }

        try {

            const skinBuffer = await (await fetch(texturesData.textures.SKIN.url)).buffer();

            const head = await getHead(skinBuffer, { scale: 32 });
            var headAttach = new AttachmentBuilder(head, { name: `head.png` });
            embed.setThumbnail("attachment://head.png");

            const body = await getFullBody(skinBuffer, { scale: 32 });
            var bodyAttach = new AttachmentBuilder(body, { name: `body.png` });
            embed.setImage("attachment://body.png");

        } catch (err: any) {
            Logger.run(err?.stack, { color: "red" });
            return await interaction.editReply({ content: "Ocurrió un error al procesar las skins de este jugador. Puedes intentar ejecutar el comando nuevamente." });
        }
        
        const files = [headAttach, bodyAttach].filter(e => e);
        return await interaction.editReply({ embeds: [embed], files });

    }
})