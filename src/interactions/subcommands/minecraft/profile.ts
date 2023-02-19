import { AttachmentBuilder, escapeMarkdown, hyperlink, SlashCommandStringOption, SlashCommandSubcommandBuilder } from "discord.js";
import * as translations from "../../../utils/translations";
import Logger from "../../../structures/Logger";
import SlashCommandSubCommand from "../../../structures/SlashSubCommand";
import { defaultEmbed } from "../../../utils/embeds";
import { basicProfile, fullProfile } from "../../../utils/minecraft/users/fetch";
import { getFullBody, getHead } from "../../../utils/minecraft/users/skins";
import { testNick } from "../../../utils/minecraft/util";

const info = translations.getSlashCommandMeta("minecraft.profile", { lang: "default" }) as translations.SlashCommandMeta;
const data = new SlashCommandSubcommandBuilder()
.setName(info.name)
.setDescription(info.description)
.setNameLocalizations(translations.getSlashCommandMeta("minecraft.profile.name", { lang: "all" }))
.setDescriptionLocalizations(translations.getSlashCommandMeta("minecraft.profile.description", { lang: "all" }))
.addStringOption(
    new SlashCommandStringOption()
    .setName(info.options.nick.name)
    .setDescription(info.options.nick.description)
    .setNameLocalizations(translations.getSlashCommandMeta("minecraft.profile.options.nick.name", { lang: "all" }))
    .setDescriptionLocalizations(translations.getSlashCommandMeta("minecraft.profile.options.nick.description", { lang: "all" }))
    .setRequired(true)
)

export default new SlashCommandSubCommand({
    parent: translations.getSlashCommandMeta("minecraft.name", { lang: "default" }),
    data,
    run: async (client, interaction) => {

        const nick = interaction.options.getString(info.options.nick.name, true);

        if (!testNick(nick)) {
            return await interaction.reply({
                content: translations.get("commands.invalidNick", { lang: interaction.locale }),
                ephemeral: true
            });
        }

        async function nickFetchError() {
            return await interaction.editReply({
                content: translations.get("commands.minecraft.profile.notFound", { lang: interaction.locale }),
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
            .setTitle(translations.get("commands.minecraft.profile.title", { lang: interaction.locale }))
            .addFields(
                {
                    name: translations.get("commands.minecraft.profile.nameField", { lang: interaction.locale }),
                    value: escapeMarkdown(userData.name || "")
                },
                {
                    name: translations.get("commands.minecraft.profile.uuidField", { lang: interaction.locale }),
                    value: userData.id || ""
                },
                {
                    name: translations.get("commands.minecraft.profile.skinField", { lang: interaction.locale }),
                    value: hyperlink( 
                        translations.get("commands.minecraft.profile.skinLink", { lang: interaction.locale }),
                        texturesData.textures.SKIN.url
                    )
                }
            )

        if (texturesData.textures.CAPE) {
            embed.addFields([{
                name: translations.get("commands.minecraft.profile.capeField", { lang: interaction.locale }),
                value: hyperlink(
                    translations.get("commands.minecraft.profile.capeLink", { lang: interaction.locale }),
                    texturesData.textures.CAPE.url
                )
            }]);
        }

        try {

            const skinBuffer = Buffer.from(
                await (await fetch(texturesData.textures.SKIN.url)).arrayBuffer()
            )

            const head = await getHead(skinBuffer, { scale: 32 });
            var headAttach = new AttachmentBuilder(head, { name: `head.png` });
            embed.setThumbnail("attachment://head.png");

            const body = await getFullBody(skinBuffer, { scale: 32 });
            var bodyAttach = new AttachmentBuilder(body, { name: `body.png` });
            embed.setImage("attachment://body.png");

        } catch (err: any) {
            Logger.run(err?.stack, { color: "red" });
            return await interaction.editReply({
                content: translations.get("commands.minecraft.profile.skinsError", { lang: interaction.locale }),
            });
        }
        
        const files = [headAttach, bodyAttach].filter(e => e);
        return await interaction.editReply({ embeds: [embed], files });

    }
})