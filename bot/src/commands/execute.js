const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendToBackend } = require('../utils/api');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('execute')
        .setDescription('Execute Luau code on the Roblox server')
        .addStringOption(opt => opt.setName('code').setDescription('Luau code').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const code = interaction.options.getString('code');
        const userId = interaction.user.id;

        const res = await sendToBackend('/action', {
            userId, action: 'Execute', target: 'server', data: { code }
        });

        if (res.success) {
            await interaction.editReply('✅ Code queued for execution.');
            // Log to mod-log channel
            const logChannel = interaction.client.channels.cache.get(process.env.MOD_LOG_CHANNEL);
            if(logChannel) logChannel.send(`⚠️ **Execute Used**\nUser: ${interaction.user.tag}\nCode: \`\`\`lua\n${code.slice(0, 100)}...\n\`\`\``);
        } else {
            await interaction.editReply(`❌ ${res.reason || 'Execution failed.'}`);
        }
    }
};
