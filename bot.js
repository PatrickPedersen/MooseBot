const { CommandoClient } = require('discord.js-commando');
const fs = require("fs").promises;
const path = require('path');
const settings = require('./settings.json');
const winston = require('winston');
const MooseBotSettingsProvider = require('./util/settingprovider');
const { collectDefaultMetrics } = require('prom-client');
const register = require('prom-client').register
const express = require('express');
const server = express()
require('dotenv').config();

collectDefaultMetrics();
const token = process.env.BOT_TOKEN;

// Settings.json checks
if (!settings.owners.length){
    console.log('You have to enter at least one owner in the settings.json');
    process.exit(42);
}

if (!token){
    console.log('You forgot to enter your Discord super secret token! You can get this token from the following page: https://discordapp.com/developers/applications/');
    process.exit(42);
}

if (!settings.prefix){
    console.log('You can\'t start the bot without setting a standard prefix');
    process.exit(42);
}

// Coming later for Opserv verification, Or, that depends
/*if (!settings.keychannel){
    console.log('You have to set the channel in which premium keys are sent');
    process.exit(42);
}*/

// Coming later for website statistics
/*if (!settings.websiteport || isNaN(settings.websiteport)){
    console.log('You have to set a port for the website to listen to.');
    process.exit(42);
}*/

if (!settings.DB_NAME || !settings.DB_USER || !settings.DB_PASS || !settings.DB_HOST || !settings.DB_PORT){
    console.log('You need to enter your db (database) credentials before starting the bot.');
    process.exit(42);
}

if (!settings.botMainDiscordServer){
    console.log('You have to set the main Discord server id');
    process.exit(42);
}

const client = new CommandoClient({
    commandPrefix: settings.prefix,
    owner: settings.owners,
    fetchAllMembers: true,
    messageCacheMaxSize: 2000,
    partials: ["GUILD_MEMBER","MESSAGE","REACTION","USER"],
    presence: {
        activity: {
            name: 'A Moose Fight!',
            type: "WATCHING"
        },
        status: "online"
    }
})

/* Custom Client Properties */
//client.settings = settings;
/* End Custom Client Properties */

// Logger:
client.logger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: 'log.log' })
    ],
    format: winston.format.printf((log) => `[${new Date().toLocaleString()}] - [${log.level.toUpperCase()}] - ${log.message}`)
});

if (settings.NODE_ENV !== 'production') {
    client.logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

async function registerEvents(client, dir) {
    let files = await fs.readdir(path.join(__dirname, dir));
    // Loop through each file.
    for(let file of files) {
        let stat = await fs.lstat(path.join(__dirname, dir, file));
        if(stat.isDirectory()) // If file is a directory, recursive call recurDir
            await registerEvents(client, path.join(dir, file));
        else {
            // Check if file is a .js file.
            if(file.endsWith(".js")) {
                let eventName = file.substring(0, file.indexOf(".js"));
                try {
                    let eventModule = require(path.join(__dirname, dir, file));
                    client.on(eventName, eventModule.bind(null, client));
                    client.logger.info('Event loaded: ' + eventName);
                }
                catch(err) {
                    client.logger.error(err.stack);
                }
            }
        }
    }
}
registerEvents(client, './events')
    .catch(e => client.logger.error(e.stack));

server.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (er) {
        res.status(500).end(er);
    }
})

const port = process.env.PORT || 4001;
console.log(`Server listening to ${port}, metrics exposed on /metrics endpoint`);
server.listen(port)

client.login(process.env.BOT_TOKEN)
    .catch(err => client.logger.error(err))
client.setProvider(new MooseBotSettingsProvider())
    .catch(err => client.logger.error(err));


client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['owner', 'Owner'],
        ['developer', 'Developer'],
        ['administrator', 'Administrator'],
        ['moderator', 'Moderator'],
        ['util', 'Utility'],
        ['misc', 'Miscellaneous']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands({
        help: false,
        ping: false,
        eval: false,
        unknownCommand: false
    })
    .registerCommandsIn(path.join(__dirname, 'commands'))