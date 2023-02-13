import { escapeMarkdown, OAuth2Scopes, PermissionResolvable, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../../structures/SlashCommand";
import { bytesToReadable } from "../../../utils/conversions";
import { defaultEmbed } from "../../../utils/embeds";
import * as translations from "../../../utils/translations";
import database from "../../../database";
import databasePing from "../../../database/ping";
import config from "../../../../config";
import { devDependencies } from "../../../../package.json"

const info = translations.getSlashCommandMeta("info", { lang: "default" }) as translations.SlashCommandMeta;
const data = new SlashCommandBuilder()
.setName(info.name)
.setDescription(info.description)
.setNameLocalizations(translations.getSlashCommandMeta("info.name", { lang: "all" }))
.setDescriptionLocalizations(translations.getSlashCommandMeta("info.description", { lang: "all" }))

export default new SlashCommand({
    data,
    async run(client, interaction) {
        
        const embed = defaultEmbed()
        .setTitle(translations.get("commands.info.title", { lang: interaction.locale }))
        .setDescription(
            (translations.get("commands.info.descriptionFields", {
                lang: interaction.locale,
                variables: {
                    botTag: escapeMarkdown(client.user?.tag ?? ""),
                    id: client.user?.id,
                    onwersTags: client.owners.map(e => escapeMarkdown(e.tag)).join(", "),
                    typescriptVersion: devDependencies.typescript.replaceAll("^", ""),
                    nodeVersion: process.versions.node,
                    commandsLength: client.commands.size,
                    memoryUsed: bytesToReadable(process.memoryUsage().heapUsed),
                    uptime: translations.secondsToReadable(Date.now() - client.startedAt, {
                        lang: interaction.locale,
                        usingMiliseconds: true
                    }),
                    discordPing: client.ws.ping,
                    databasePing: (await databasePing()).toFixed(2),
                    databaseName: database.getDialect(),
                    inviteLink: client.generateInvite({
                        scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
                        permissions: config.defaults.inviteLinkPermissions as PermissionResolvable
                    })
                }
            }) as string[]).join("\n")
        )
        
        return await interaction.reply({ embeds: [embed] });

    },
})