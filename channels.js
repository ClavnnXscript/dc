// Channel configuration for ClavnnX Community
// Defines the complete server structure with categories, channels, and messages

module.exports = {
    categories: [
        {
            name: '📌 Info',
            channels: [
                {
                    name: 'welcome',
                    type: 'text',
                    topic: 'Welcome new members and farewell messages',
                    permissions: {
                        everyone: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
                        dev: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES']
                    }
                },
                {
                    name: 'announcement',
                    type: 'text',
                    topic: 'Important server announcements and updates',
                    permissions: {
                        everyone: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
                        dev: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES']
                    },
                    pinnedMessage: {
                        content: '📢 **Announcements**\nStay tuned for important updates, events, and news from the Dev team here!'
                    }
                },
                {
                    name: 'key',
                    type: 'text',
                    topic: 'Get your access keys here',
                    permissions: {
                        everyone: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
                        dev: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES']
                    },
                    autoMessage: {
                        content: '🔑 **Get Your Key Here**\nhttps://get-key-61pf-cdxr8we7g-clavvs-projects-bb280e9d.vercel.app/'
                    }
                },
                {
                    name: 'support',
                    type: 'text',
                    topic: 'Support the developer and community',
                    permissions: {
                        everyone: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
                        dev: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES']
                    },
                    pinnedMessage: {
                        content: '❤️ **Support the Developer**\nIf you want to support the development of this community and its projects:\nhttps://saweria.co/ClavnnX'
                    }
                }
            ]
        },
        {
            name: '💬 Community',
            channels: [
                {
                    name: 'chat',
                    type: 'text',
                    topic: 'General community chat and discussions',
                    permissions: {
                        everyone: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                        dev: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES']
                    },
                    autoMessage: {
                        content: '💬 **Community Chat**\nFeel free to chat, share ideas, and interact with other members here!'
                    }
                },
                {
                    name: 'script',
                    type: 'text',
                    topic: 'Scripts and development updates from the Dev team',
                    permissions: {
                        everyone: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
                        dev: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES']
                    },
                    pinnedMessage: {
                        content: '📜 **Scripts & Dev Notes**\nThis channel is for updates and script releases.\nOnly the Dev team can send messages here, but members can read all posts.'
                    }
                }
            ]
        },
        {
            name: '🎙 Voice',
            channels: [
                {
                    name: '🔊 General Voice',
                    type: 'voice',
                    permissions: {
                        everyone: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'],
                        dev: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS']
                    }
                }
            ]
        }
    ],

    // Welcome messages configuration
    welcomeMessage: '👋 Welcome to **ClavnnX Community**!\nWe\'re happy to have you here.\nPlease check the #rules (if available) and have fun chatting!',
    
    // Leave messages configuration
    leaveMessage: '😢 A member has left the server.\nGoodbye, and we hope to see you again!'
};
