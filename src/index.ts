import { ButtonInteraction, Client, CommandInteraction, Events, GatewayIntentBits, REST, Routes } from 'discord.js'
import * as ENV from 'dotenv'
import { TCommand } from './config/Constant';
import { NSCommands } from './core/Commands';
import { pDice } from './games/Dice';
import mongoose from 'mongoose';

ENV.config();

export const client = new Client( { intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages ] } )

client.once(Events.ClientReady, async () => {
    console.log(`🟢 Logged in as ${client.user?.tag}`);

    try {
        const rest = new REST( { version: '10' } ).setToken(process.env.DISCORD_TOKEN!);

        console.log("\nRegistering Slash Command ...");
        const body = NSCommands.commands.map( _cmd => _cmd.toJSON() );
        const _appCMD = Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!);
        await rest.put( _appCMD, { body } );
        console.log("\nRegistered success ...");
    } catch ( _err ) {
        console.error("❌ Error while registering Slash CMD:", _err);
    }
})

client.on(Events.InteractionCreate, async _interaction => {
    _interaction.isCommand() && await onCommand(_interaction);
    _interaction.isButton() && await onButton(_interaction);
});

var _selector = ""
async function onCommand(_interaction: CommandInteraction) {

    _selector = _interaction.commandName;
    switch(_interaction.commandName as TCommand) {
        case 'dice': {
            pDice.start(10, _interaction);
            break;
        }
        case 'test': {
            break;
        }
    }
}

async function onButton(_interaction: ButtonInteraction) {
    if(_selector === "dice") {
        pDice.handler(_interaction);
        return
    }
}

//mongoose.connect(process.env.MONGO_URI!).then( () => {
//    console.log("🟢 Connected to MongoDB");
//    client.login(process.env.DISCORD_TOKEN!);
//} )
