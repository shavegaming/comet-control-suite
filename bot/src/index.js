const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Comet Bot is alive!'));
app.listen(process.env.PORT || 3000, () => console.log('Bot web server running'));
require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const commands = [];
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands = new Map();
    client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
    console.log(`🤖 Bot online as ${client.user.tag}`);
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (command) await command.execute(interaction);
});

client.login(process.env.DISCORD_TOKEN);
