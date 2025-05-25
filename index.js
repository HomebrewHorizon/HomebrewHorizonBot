const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const TOKEN = 'DISCORD_BOT_TOKEN';
const LICENSE_FILE = 'licensed_apps.json';

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    const args = message.content.split(' ');
    const command = args[0];

    if (command === '/license' && args[1]) {
        const appId = args[1];
        let data = JSON.parse(fs.readFileSync(LICENSE_FILE, 'utf8'));
        if (!data.apps[appId]) {
            data.apps[appId] = { licensed: true };
            fs.writeFileSync(LICENSE_FILE, JSON.stringify(data, null, 2));
            message.channel.send(`✅ Licensed Wii homebrew app with ID: ${appId}`);
        } else {
            message.channel.send(`⚠️ App ID ${appId} is already licensed.`);
        }
    }

    else if (command === '/reg' && args[1]) {
        const appName = args[1];
        const appId = Math.random().toString(36).substr(2, 8); // Generate a random app ID
        let data = JSON.parse(fs.readFileSync(LICENSE_FILE, 'utf8'));
        data.apps[appId] = { name: appName };
        fs.writeFileSync(LICENSE_FILE, JSON.stringify(data, null, 2));
        message.channel.send(`✅ Registered ${appName} with App ID: ${appId}`);
    }

    else if (command === '/applist') {
        let data = JSON.parse(fs.readFileSync(LICENSE_FILE, 'utf8'));
        let appList = Object.keys(data.apps).map(id => `${id} - ${data.apps[id].name || "Unknown"}`).join("\n");
        message.channel.send(`📜 **Licensed Apps:**\n${appList}`);
    }
});

client.login(TOKEN);
