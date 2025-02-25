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
	// const channel = client.channels.fetch('1343747589383786546');
	const channel = client.channels.cache.get('1343747589383786546');
	console.log(channel);
	channel.send({
		content: 'Select your role by clicking on a button',
		components: [new ActionRowBuilder().setComponents(
			new ButtonBuilder().setCustomId('blue').setLabel('Blue').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setCustomId('red').setLabel('Red').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setCustomId('green').setLabel('Green').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setCustomId('pink').setLabel('Pink').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setCustomId('purple').setLabel('Purple').setStyle(ButtonStyle.Primary)
		)],
	})
});

client.on('voiceStateUpdate', async (oldState, newState) => 
{
	console.log("\n\n\n\nI AM HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
	console.log(`User: ${newState.member.user.tag}`);
	console.log(`Old Channel: ${oldState.channel ? oldState.channel.name : "None"}`);
	console.log(`New Channel: ${newState.channel ? newState.channel.name : "None"}`);
	console.log("I AM HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n\n\n");
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



	// if (!interaction.isButton()) return;
	if (interaction.isButton())
	{

		const role = interaction.guild.roles.cache.get(ROLES[interaction.customId.toUpperCase()]);

		if (!role)
		{
			return interaction.reply({ content: 'Role not found', ephemeral: true });
		}

		if (!interaction.member)
		{
			return interaction.reply({ content: 'Could not find member.', ephemeral: true });
		}

		try
		{
			await interaction.member.roles.add(role);
			await interaction.reply({
				content: `The ${role.name} role was added to you, ${interaction.member.displayName}.`,
				ephemeral: true
			});
		} catch (err)
		{
			console.error('Failed to add role:', err);
			return interaction.reply({
				content: `Something went wrong. The ${role.name} role was not added.`,
				ephemeral: true
			});
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
