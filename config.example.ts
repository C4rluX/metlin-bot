export default {

    // Type: Array<string>
    // Description: Developers/owners Discord IDs. The users listed here have maximum permissions on the bot 
    "developers": [],

    // Type: Array<string>
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
        "translationsLogs": false

    },

    // Type: Object
    // Description: Common default options for several aspects of the bot
    "defaults": {

        // Type: string
        // Description: Default bot language. Must be one of: "en" | "es"
        "lang": "es",

        // Type: Object
        // Description: Default embeds properties
        "embeds": {
            
            // Type: Array<number>
            // Description: By default, bot embeds will have one of the colors listed here (randomly selected)
            "colors": [],

            // Type: string
            // Description: Default embeds footer.
            // Available variables:
            // - "<botname>": Bot username
            "footer": ""

        }

    },
    
    // Type: Object
    // Description: Developer/testing mode utilities in the bot
    "devMode": {

        // Type: boolean
        // Description: Set if the mode is activated
        "activated": false,

        // Type: Array<string>
        // Description: List of channel IDs. When developer mode is activated, commands are going to work only on the channels listed here. When developer mode is disabled, nothing works in these channels
        "channels": [],

        // Type: boolean
        // Description: If this is true, slash commands are going to be registered on the guilds listed on the option below when the bot starts
        "slashCommandsTestingGuildsRegistering": false,
        
        // Type: Array<string>
        // Description: List of guild IDs. When the above option is true, slash commands get registered on the guilds listed here
        "guilds": []

    },

    // Type: Object
    // Description: Bot presence changer settings
    "presence": {
        
        // Type: number
        // Description: Presence change interval in miliseconds
        "updateInterval": 0,

        // Type: Array<PresenceData>
        // Description: List of possible presences. On every presence change/interval one of these will be selected randomly. Every item has to be in the format of a PresenceData (from discord.js): https://discord.js.org/#/docs/discord.js/main/typedef/PresenceData
        // Available variables:
        // - "<serversCount>": Cached (most likely all) servers count
        // - "<usersCount>": Cached users count
        "list": []

    }

}