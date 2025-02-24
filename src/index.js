import { config } from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';

config();

const TOKEN = process.env.BOT_TOKEN

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// Events

client.on('ready', () =>
{
    console.log(`${client.user.tag} has logged in!`)
})

client.on('messageCreate', (message) =>
{
    console.log(message.content)
    console.log(message.createdAt.toDateString());
    console.log(message.author.tag)
})

client.login(TOKEN)