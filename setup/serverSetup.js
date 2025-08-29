// Server setup utility
// Handles automatic creation of roles, channels, categories, and permissions

const { ChannelType, PermissionFlagsBits } = require('discord.js');
const channelsConfig = require('../config/channels');
const rolesConfig = require('../config/roles');

class ServerSetup {
    
    /**
     * Main setup function - creates complete server structure
     * @param {Guild} guild - Discord guild object
     */
    async setupServer(guild) {
        console.log(`🔧 Starting server setup for: ${guild.name}`);
        
        try {
            // Step 1: Create roles
            await this.createRoles(guild);
            
            // Step 2: Create categories and channels
            await this.createChannelStructure(guild);
            
            console.log(`✅ Server setup completed for: ${guild.name}`);
        } catch (error) {
            console.error(`❌ Server setup failed for ${guild.name}:`, error);
            throw error;
        }
    }
    
    /**
     * Creates all necessary roles
     * @param {Guild} guild - Discord guild object
     */
    async createRoles(guild) {
        console.log('🎭 Creating roles...');
        
        for (const roleConfig of rolesConfig.roles) {
            try {
                // Check if role already exists
                const existingRole = guild.roles.cache.find(role => role.name === roleConfig.name);
                
                if (!existingRole) {
                    const role = await guild.roles.create({
                        name: roleConfig.name,
                        color: roleConfig.color,
                        permissions: roleConfig.permissions,
                        hoist: roleConfig.hoist,
                        mentionable: roleConfig.mentionable,
                        reason: roleConfig.reason
                    });
                    
                    console.log(`✅ Created role: ${role.name}`);
                } else {
                    console.log(`⚠️ Role already exists: ${roleConfig.name}`);
                }
            } catch (error) {
                console.error(`❌ Failed to create role ${roleConfig.name}:`, error);
            }
        }
    }
    
    /**
     * Creates the complete channel structure with categories
     * @param {Guild} guild - Discord guild object
     */
    async createChannelStructure(guild) {
        console.log('📁 Creating channel structure...');
        
        for (const categoryConfig of channelsConfig.categories) {
            try {
                // Create or find category
                let category = guild.channels.cache.find(
                    channel => channel.name === categoryConfig.name && channel.type === ChannelType.GuildCategory
                );
                
                if (!category) {
                    category = await guild.channels.create({
                        name: categoryConfig.name,
                        type: ChannelType.GuildCategory,
                        reason: `ClavnnX Community setup - ${categoryConfig.name} category`
                    });
                    console.log(`✅ Created category: ${category.name}`);
                } else {
                    console.log(`⚠️ Category already exists: ${categoryConfig.name}`);
                }
                
                // Create channels in this category
                await this.createChannelsInCategory(guild, category, categoryConfig.channels);
                
            } catch (error) {
                console.error(`❌ Failed to create category ${categoryConfig.name}:`, error);
            }
        }
    }
    
    /**
     * Creates channels within a specific category
     * @param {Guild} guild - Discord guild object
     * @param {CategoryChannel} category - Parent category channel
     * @param {Array} channelConfigs - Array of channel configurations
     */
    async createChannelsInCategory(guild, category, channelConfigs) {
        for (const channelConfig of channelConfigs) {
            try {
                // Check if channel already exists
                const existingChannel = guild.channels.cache.find(
                    channel => channel.name === channelConfig.name && channel.parentId === category.id
                );
                
                let channel = existingChannel;
                
                if (!existingChannel) {
                    // Determine channel type
                    const channelType = channelConfig.type === 'voice' ? ChannelType.GuildVoice : ChannelType.GuildText;
                    
                    // Create channel
                    channel = await guild.channels.create({
                        name: channelConfig.name,
                        type: channelType,
                        parent: category.id,
                        topic: channelConfig.topic || null,
                        reason: `ClavnnX Community setup - ${channelConfig.name} channel`
                    });
                    
                    console.log(`✅ Created channel: #${channel.name}`);
                    
                    // Send auto message if configured
                    if (channelConfig.autoMessage && channelType === ChannelType.GuildText) {
                        await channel.send(channelConfig.autoMessage.content);
                        console.log(`📝 Sent auto message to #${channel.name}`);
                    }
                    
                    // Pin message if configured
                    if (channelConfig.pinnedMessage && channelType === ChannelType.GuildText) {
                        const pinnedMsg = await channel.send(channelConfig.pinnedMessage.content);
                        await pinnedMsg.pin();
                        console.log(`📌 Pinned message in #${channel.name}`);
                    }
                } else {
                    console.log(`⚠️ Channel already exists: #${channelConfig.name} - updating permissions`);
                }
                
                // Always set/update permissions for all channels
                await this.setChannelPermissions(guild, channel, channelConfig.permissions);
                
            } catch (error) {
                console.error(`❌ Failed to create channel ${channelConfig.name}:`, error);
            }
        }
    }
    
    /**
     * Sets permissions for a channel based on roles
     * @param {Guild} guild - Discord guild object
     * @param {Channel} channel - Target channel
     * @param {Object} permissions - Permission configuration
     */
    async setChannelPermissions(guild, channel, permissions) {
        if (!permissions) return;
        
        try {
            // Get @everyone role
            const everyoneRole = guild.roles.everyone;
            
            // Get Dev role
            const devRole = guild.roles.cache.find(role => role.name === 'Dev');
            
            // Clear existing permissions and set new ones
            const permissionOverwrites = [];
            
            // Set @everyone permissions
            if (permissions.everyone) {
                const everyonePerms = this.convertPermissions(permissions.everyone);
                permissionOverwrites.push({
                    id: everyoneRole.id,
                    allow: everyonePerms.allow,
                    deny: everyonePerms.deny
                });
            }
            
            // Set Dev role permissions
            if (permissions.dev && devRole) {
                const devPerms = this.convertPermissions(permissions.dev);
                permissionOverwrites.push({
                    id: devRole.id,
                    allow: devPerms.allow,
                    deny: devPerms.deny
                });
            }
            
            // Apply permissions
            await channel.permissionOverwrites.set(permissionOverwrites);
            console.log(`🔒 Set permissions for #${channel.name}`);
            
        } catch (error) {
            console.error(`❌ Failed to set permissions for #${channel.name}:`, error);
        }
    }
    
    /**
     * Converts permission strings to Discord.js permission flags
     * @param {Array} permissionList - Array of permission strings
     * @returns {Object} Object with allow and deny permission flags
     */
    convertPermissions(permissionList) {
        const allowPerms = [];
        const denyPerms = [];
        
        // All possible permissions that might be denied by default
        const allPerms = [
            'VIEW_CHANNEL',
            'SEND_MESSAGES',
            'READ_MESSAGE_HISTORY',
            'MANAGE_MESSAGES',
            'CONNECT',
            'SPEAK',
            'MUTE_MEMBERS',
            'DEAFEN_MEMBERS'
        ];
        
        // Add allowed permissions
        for (const perm of permissionList) {
            if (perm === 'VIEW_CHANNEL') allowPerms.push(PermissionFlagsBits.ViewChannel);
            else if (perm === 'SEND_MESSAGES') allowPerms.push(PermissionFlagsBits.SendMessages);
            else if (perm === 'READ_MESSAGE_HISTORY') allowPerms.push(PermissionFlagsBits.ReadMessageHistory);
            else if (perm === 'MANAGE_MESSAGES') allowPerms.push(PermissionFlagsBits.ManageMessages);
            else if (perm === 'CONNECT') allowPerms.push(PermissionFlagsBits.Connect);
            else if (perm === 'SPEAK') allowPerms.push(PermissionFlagsBits.Speak);
            else if (perm === 'MUTE_MEMBERS') allowPerms.push(PermissionFlagsBits.MuteMembers);
            else if (perm === 'DEAFEN_MEMBERS') allowPerms.push(PermissionFlagsBits.DeafenMembers);
        }
        
        // Add denied permissions (permissions not in the allowed list)
        for (const perm of allPerms) {
            if (!permissionList.includes(perm)) {
                if (perm === 'SEND_MESSAGES') denyPerms.push(PermissionFlagsBits.SendMessages);
                else if (perm === 'MANAGE_MESSAGES') denyPerms.push(PermissionFlagsBits.ManageMessages);
                else if (perm === 'CONNECT') denyPerms.push(PermissionFlagsBits.Connect);
                else if (perm === 'SPEAK') denyPerms.push(PermissionFlagsBits.Speak);
                else if (perm === 'MUTE_MEMBERS') denyPerms.push(PermissionFlagsBits.MuteMembers);
                else if (perm === 'DEAFEN_MEMBERS') denyPerms.push(PermissionFlagsBits.DeafenMembers);
            }
        }
        
        return {
            allow: allowPerms,
            deny: denyPerms
        };
    }
}

module.exports = new ServerSetup();
