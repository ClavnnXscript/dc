// ClavnnX Community Discord Bot
// Main entry point for the Discord bot

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create Discord client with necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Load event handlers
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
    process.exit(1);
});

// Login to Discord
const token = process.env.DISCORD_BOT_TOKEN;
if (!token) {
    console.error('❌ Error: DISCORD_BOT_TOKEN not found in environment variables!');
    console.error('Please add your bot token to the .env file');
    process.exit(1);
}

client.login(token).catch(error => {
    console.error('❌ Failed to login to Discord:', error);
    process.exit(1);
});

// Keep the bot alive for 24/7 uptime on Replit
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('ClavnnX Community Bot is running! 🤖');
});

app.listen(port, () => {
    console.log(`🌐 Web server running on port ${port} for uptime monitoring`);
});

module.exports = client;
