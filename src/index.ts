import { Client, Events, GatewayIntentBits, REST, Routes } from 'discord.js'
import * as ENV from 'dotenv'
import { NSCommands } from './core/Commands';
import './core/Core'

//import mongoose from 'mongoose';
import { pEventManager } from './pts/event/pEvent';
import { SQCore } from './database/sqlite/Core';

ENV.config();

const client = new Client( { intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages ] } )

client.once(Events.ClientReady, async () => {
    pEventManager.invoke('onClientReady', client);

    try {
        const rest = new REST( { version: '10' } ).setToken(process.env.DISCORD_TOKEN!);

        console.log("\nRegistering Slash Command ...");
        const body = NSCommands.commands.map( _cmd => _cmd.toJSON() );
        const _appCMD = Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!);
        await rest.put( _appCMD, { body } );

        pEventManager.invoke('onEveryThingReady', client);
        console.log("\nRegistered success ...");

    } catch ( _err ) {
        console.error("❌ Error while registering Slash CMD:", _err);
    }
});

(async () => {
    SQCore.prepare();
    pEventManager.invoke('onMongoReady')
    await client.login(process.env.DISCORD_TOKEN!);
    pEventManager.invoke('onClientLogin', client)
})()

//mongoose.connect(process.env.MONGO_URL).then( async () => {
//    pEventManager.invoke('onMongoReady')
//    await client.login(process.env.DISCORD_TOKEN!);
//    pEventManager.invoke('onClientLogin', client)
//} )
