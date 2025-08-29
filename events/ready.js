// Ready event handler
// Runs when the bot successfully connects to Discord

const { Events } = require('discord.js');
const serverSetup = require('../utils/serverSetup');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`✅ Bot is online! Logged in as ${client.user.tag}`);
        console.log(`🤖 Serving ${client.guilds.cache.size} server(s)`);
        console.log(`👥 Total users: ${client.users.cache.size}`);
        
        // Set bot status
        client.user.setActivity('ClavnnX Community', { type: 'WATCHING' });
        
        // Setup server for each guild the bot is in
        for (const guild of client.guilds.cache.values()) {
            try {
                console.log(`🔧 Setting up server: ${guild.name}`);
                await serverSetup.setupServer(guild);
                console.log(`✅ Server setup completed for: ${guild.name}`);
            } catch (error) {
                console.error(`❌ Failed to setup server ${guild.name}:`, error);
            }
        }
        
        console.log(`🎉 ClavnnX Community Bot is fully operational!`);
    },
};
