// Guild member remove event handler
// Runs when a member leaves the server

const { Events } = require('discord.js');
const channelsConfig = require('../config/channels');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        const guild = member.guild;
        
        console.log(`👋 Member left: ${member.user.tag} from ${guild.name}`);
        
        try {
            // Find the welcome channel
            const welcomeChannel = guild.channels.cache.find(
                channel => channel.name === 'welcome' && channel.type === 0 // Text channel
            );
            
            if (welcomeChannel) {
                // Send leave message
                await welcomeChannel.send(channelsConfig.leaveMessage);
                console.log(`📝 Leave message sent for ${member.user.tag}`);
            } else {
                console.log('⚠️ Welcome channel not found');
            }
            
        } catch (error) {
            console.error(`❌ Error handling member leave for ${member.user.tag}:`, error);
        }
    },
};
