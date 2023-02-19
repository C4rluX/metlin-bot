export default {

    // Type: string[]
    // Description: Developers/owners Discord IDs. The users listed here have maximum permissions on the bot 
    "developers": [],

    // Type: string[]
    // Description: Prefixes for message based commands (located in src/commands)
    "prefixes": [],

    // Type: Object
    // Description: List of things that can be enabled/disabled in the bot
    "enable": {

        // Type: boolean
        // Description: Register global slash commands when the bot starts
        "slashCommandsGlobalRegistering": false,

        // Type: boolean
        // Description: Log preloaded files like images or fonts (located in src/resources)
        "preloadsLogs": false,

        // Type: boolean
        // Description: Log when a user executes a message based command
        "commandsLogs": false,

        // Type: boolean
        // Description: Log when the bot is reloaded
        "slashCommandsLogs": false,

        // Type: boolean
        // Description: Log when a user executes a slash command
        "reloadLogs": false,

        // Type: boolean
        // Description: Log Discord API requests made by the bot
        "discordApiRequestsLogs": false,

        // Type: boolean
        // Description: Log database connection information
        "databaseLogs": false,

        // Type: boolean
        // Description: Activate bot presences
        "presence": false,

        // Type: boolean
        // Description: Log when the presence changes to another index from the property: presence > list
        "presenceLogs": false,

        // Type: boolean
        // Description: Log translation loaded files and not found translations
        "translationsLogs": false,

        // Type: boolean
        // Description: Log information related to logs channels
        "logsChannelsLogs": false

    },

    // Type: Object
    // Description: Common default options for several aspects of the bot
    "defaults": {

        // Type: string
        // Description: Default bot language. Must be one of: "en" | "es"
        "lang": "",

        // Type: Object
        // Description: Default embeds properties
        "embeds": {
            
            // Type: number[]
            // Description: By default, bot embeds will have one of the colors listed here (randomly selected)
            "colors": [],

            // Type: string
            // Description: Default embeds footer.
            // Available variables:
            // - "<botname>": Bot username
            "footer": ""

        },

        // Type: PermissionResolvable
        // Description: Permissions of bot-generated invite links. This has to be a PermissionResolvable (from discord.js): https://discord.js.org/#/docs/discord.js/main/typedef/PermissionResolvable
        "inviteLinkPermissions": []

    },
    
    // Type: Object
    // Description: Developer/testing mode utilities in the bot
    "devMode": {

        // Type: boolean
        // Description: Set if the mode is activated
        "activated": false,

        // Type: string[]
        // Description: List of channel IDs. When developer mode is activated, interactions and messages are ONLY going to be listened on the channels listed here. When developer mode is disabled, nothing works in these channels
        "channels": [],

        // Type: boolean
        // Description: If this is true, slash commands are going to be registered on the guilds listed on the option below when the bot starts
        "slashCommandsTestingGuildsRegistering": false,
        
        // Type: string[]
        // Description: List of guild IDs. When the above option is true, slash commands get registered on the guilds listed here
        "guilds": []

    },

    // Type: Object
    // Description: Bot presence changer settings
    "presence": {
        
        // Type: number
        // Description: Presence change interval in miliseconds
        "updateInterval": 0,

        // Type: PresenceData[]
        // Description: List of possible presences. On every presence change/interval one of these will be selected randomly. Every item has to be in the format of a PresenceData (from discord.js): https://discord.js.org/#/docs/discord.js/main/typedef/PresenceData
        // Available variables:
        // - "<serversCount>": Cached (most likely all) servers count
        // - "<usersCount>": Cached users count
        "list": []

    },

    // Type: Object
    // Description: General colors used in bot embeds and others
    "colors": {

        // Type: number
        // Description: General red color
        "red": 0,

        // Type: number
        // Description: General green color
        "green": 0,

    },

    // Type: Object
    // Description: List of logs channels IDs. If the bot tries to access one of them, and its empty, it's only going to show a warning in the console (if you enabled the property: enable > logsChannelsLogs)
    "logsChannels": {

        // Type: String | null
        // Description: New entered guilds logs channel ID
        "enteredGuilds": "",

        // Type: String | null
        // Description: Left guilds logs channel ID
        "leftGuilds": "",

        // Type: String | null
        // Description: Bot reports logs channel ID
        "botReports": "",

        // Type: String | null
        // Description: Bot suggestions logs channel ID
        "botSuggestions": ""

    }

}