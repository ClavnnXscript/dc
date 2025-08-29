// Role configuration for ClavnnX Community
// Defines roles, permissions, and colors

const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    roles: [
        {
            name: 'Dev',
            color: '#ff6b6b', // Red color for developers
            permissions: [
                PermissionFlagsBits.Administrator
            ],
            hoist: true, // Display separately in member list
            mentionable: true,
            reason: 'Developer/Administrator role for ClavnnX Community'
        },
        {
            name: 'Member',
            color: '#4ecdc4', // Teal color for members
            permissions: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.Connect,
                PermissionFlagsBits.Speak,
                PermissionFlagsBits.UseVAD,
                PermissionFlagsBits.ChangeNickname
            ],
            hoist: false,
            mentionable: true,
            reason: 'Default member role for ClavnnX Community'
        }
    ],

    // Default role assigned to new members
    defaultRole: 'Member'
};
