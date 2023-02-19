import { escapeMarkdown, OAuth2Scopes, PermissionResolvable, SlashCommandSubcommandBuilder } from "discord.js";
import { devDependencies, repository } from "../../../../package.json";
import * as database from "../../../database";
import SlashCommandSubCommand from "../../../structures/SlashCommandSubCommand";
import { getConfig } from "../../../utils/configuration";
import { bytesToReadable } from "../../../utils/conversions";
import { defaultEmbed } from "../../../utils/embeds";
import * as translations from "../../../utils/translations";

const info = translations.getSlashCommandMeta("bot.info", { lang: "default" }) as translations.SlashCommandMeta;
const data = new SlashCommandSubcommandBuilder()
.setName(info.name)
.setDescription(info.description)
.setNameLocalizations(translations.getSlashCommandMeta("bot.info.name", { lang: "all" }))
.setDescriptionLocalizations(translations.getSlashCommandMeta("bot.info.description", { lang: "all" }))

export default new SlashCommandSubCommand({
    parent: translations.getSlashCommandMeta("bot.name", { lang: "default" }),
    data,
    async run(client, interaction) {
        
        const embed = defaultEmbed()
        .setTitle(translations.get("commands.bot.info.title", { lang: interaction.locale }))
        .setDescription(
            (translations.get("commands.bot.info.descriptionFields", {
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
                    databasePing: (await database.ping()).toFixed(2),
                    databaseName: database.connection.getDialect(),
                    inviteLink: client.generateInvite({
                        scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
                        permissions: getConfig().defaults.inviteLinkPermissions as PermissionResolvable
                    }),
                    repositoryLink: repository.url
                }
            }) as string[]).join("\n")
        )
        .setThumbnail(client.user?.avatarURL({ extension: "png", size: 256 }) ?? client.user?.defaultAvatarURL ?? "")

        return await interaction.reply({ embeds: [embed] });

    },
})