import { config } from 'dotenv';
config()

// import { Client, GatewayIntentBits, Routes } from 'discord.js';
import
{
	Client,
	GatewayIntentBits,
	Routes,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	SlashCommandBuilder,
	ChannelType
} from 'discord.js';
import { getVoiceConnections, joinVoiceChannel } from '@discordjs/voice';

import { REST } from '@discordjs/rest';

const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const ROLES = {
	BLUE: '1343798916151509012',
	RED: '1343799082426306582',
	GREEN: '1343799271656394802',
	PURPLE: '1343799508018135092',
	PINK: '1343799601970548788',
};

// const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers, // REQUIRED for role management
		GatewayIntentBits.GuildVoiceStates // REQUIRED for voiceStateUpdate event
	]
});
const rest = new REST({ version: '10' }).setToken(TOKEN);

const commands = [
	new SlashCommandBuilder()
		.setName('join')
		.setDescription('Joins a Voice Channel')
		.addChannelOption((option) =>
			option
				.setName('channel').setDescription('The channel to join').setRequired(true).addChannelTypes(ChannelType.GuildVoice)).toJSON(),

];

client.on('ready', async () =>
{
	console.log('Bot is online'); 
});



// This event will trigger when a member's voice state changes (like joining or leaving a voice channel)
client.on('voiceStateUpdate', async (oldState, newState) =>
{
	const member = newState.member;

	// When a member joins a voice channel
	if (!oldState.channel && newState.channel)
	{
		const role = newState.guild.roles.cache.get(ROLES.GREEN); // Adjust to the role you want to assign
		if (role && member)
		{
			try
			{
				await member.roles.add(role);
				console.log(`Assigned the role ${role.name} to ${member.user.tag}`);
			} catch (err)
			{
				console.error('Failed to assign role:', err);
			}
		}
	}

	// When a member leaves a voice channel
	if (oldState.channel && !newState.channel)
	{
		const role = oldState.guild.roles.cache.get(ROLES.GREEN); // Adjust to the role you want to remove
		if (role && member)
		{
			try
			{
				await member.roles.remove(role);
				console.log(`Removed the role ${role.name} from ${member.user.tag}`);
			} catch (err)
			{
				console.error('Failed to remove role:', err);
			}
		}
	}
});


client.on('interactionCreate', async (interaction) =>
{
	if (interaction.isChatInputCommand())
	{
		if (interaction.commandName === 'join')
		{
			const voiceChannel = interaction.options.getChannel('channel');
			const voiceConnection = joinVoiceChannel({
				channelId: voiceChannel.id,
				guildId: interaction.guildId,
				adapterCreator: interaction.guild.voiceAdapterCreator

			});


			console.log(getVoiceConnections())

		}
	}

});

async function main()
{

	try
	{
		await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
			body: commands,
		});
		client.login(TOKEN);
	} catch (err)
	{
		console.log(err);
	}


}

main()
