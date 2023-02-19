import { GuildMember, PermissionsBitField, SlashCommandChannelOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, TextChannel } from "discord.js";
import SlashCommandSubCommand from "../../../structures/SlashSubCommand";
import { hasRoleHereOrEveryoneMention } from "../../../utils/discord-related";
import * as translations from "../../../utils/translations";

const info = translations.getSlashCommandMeta("message.say", { lang: "default" }) as translations.SlashCommandMeta;
const data = new SlashCommandSubcommandBuilder()
.addStringOption(
    new SlashCommandStringOption()
    .setName(info.options.message.name)
    .setDescription(info.options.message.description)
    .setNameLocalizations(translations.getSlashCommandMeta("message.say.options.message.name", { lang: "all" }))
    .setDescriptionLocalizations(translations.getSlashCommandMeta("message.say.options.message.description", { lang: "all" }))
    .setRequired(true)
)
.addChannelOption(
    new SlashCommandChannelOption()
    .setName(info.options.channel.name)
    .setDescription(info.options.channel.description)
    .setNameLocalizations(translations.getSlashCommandMeta("message.say.options.channel.name", { lang: "all" }))
    .setDescriptionLocalizations(translations.getSlashCommandMeta("message.say.options.channel.description", { lang: "all" }))
    .setRequired(false)
)
.setName(info.name)
.setDescription(info.description)
.setNameLocalizations(translations.getSlashCommandMeta("message.say.name", { lang: "all" }))
.setDescriptionLocalizations(translations.getSlashCommandMeta("message.say.description", { lang: "all" }))

export default new SlashCommandSubCommand({
    parent: translations.getSlashCommandMeta("message.name", { lang: "default" }),
    data,
    async run(client, interaction) {
        
        await interaction.deferReply({ ephemeral: true });
        const content = interaction.options.getString(info.options.message.name, true);
        const channel = (interaction.options.getChannel(info.options.channel.name) ?? interaction.channel) as TextChannel;

        const permissions = {
            bot: channel.permissionsFor(interaction.guild?.members.me as GuildMember),
            user: channel.permissionsFor(interaction.member as GuildMember)
        }

        if (
            !permissions.bot.has([
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages
            ])
        ) {
            return await interaction.editReply({
                content: translations.get("commands.message.channelMissingPermissions.bot", {
                    lang: interaction.locale,
                    variables: {
                        permissions: translations.getPermissionsNames(
                            ["SendMessages", "ViewChannel"], 
                            { lang: interaction.locale }
                        ).join(", ")
                    }
                })
            });
        }

        if (
            !permissions.user.has([
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages
            ])
        ) {
            return await interaction.editReply({
                content: translations.get("commands.message.channelMissingPermissions.user", {
                    lang: interaction.locale,
                    variables: {
                        permissions: translations.getPermissionsNames(
                            ["SendMessages", "ViewChannel"], 
                            { lang: interaction.locale }
                        ).join(", ")
                    }
                })
            });
        }

        if (hasRoleHereOrEveryoneMention(content)) {
            return await interaction.editReply({
                content: translations.get("commands.message.send.hasMentions", {
                    lang: interaction.locale
                }),
                allowedMentions: { parse: [] },
            })
        }
        
        await channel.send({ content });

        return await interaction.editReply({
            content: translations.get("commands.message.send.success", {
                lang: interaction.locale,
                variables: { channel: channel.toString() }
            }),
            allowedMentions: { parse: [] },
        });

    },
})