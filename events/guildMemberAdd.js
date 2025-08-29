// Guild member add event handler
// Runs when a new member joins the server

const { Events } = require('discord.js');
const channelsConfig = require('../config/channels');
const rolesConfig = require('../config/roles');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const guild = member.guild;
        
        console.log(`👋 New member joined: ${member.user.tag} in ${guild.name}`);
        
        try {
            // Find the welcome channel
            const welcomeChannel = guild.channels.cache.find(
                channel => channel.name === 'welcome' && channel.type === 0 // Text channel
            );
            
            if (welcomeChannel) {
                // Send welcome message
                await welcomeChannel.send(channelsConfig.welcomeMessage);
                console.log(`📝 Welcome message sent for ${member.user.tag}`);
            } else {
                console.log('⚠️ Welcome channel not found');
            }
            
            // Assign default role
            const defaultRoleName = rolesConfig.defaultRole;
            const memberRole = guild.roles.cache.find(role => role.name === defaultRoleName);
            
            if (memberRole) {
                await member.roles.add(memberRole);
                console.log(`🎭 Assigned ${defaultRoleName} role to ${member.user.tag}`);
            } else {
                console.log(`⚠️ ${defaultRoleName} role not found`);
            }
            
        } catch (error) {
            console.error(`❌ Error handling member join for ${member.user.tag}:`, error);
        }
    },
};
