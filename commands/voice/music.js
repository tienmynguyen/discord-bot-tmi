const ytdl = require("ytdl-core");

const ytSearch = require("yt-search");

const {
    createAudioPlayer,
    createAudioResource,
    AudioPlayer,
    VoiceConnection,
    joinVoiceChannel,
} = require("@discordjs/voice");
const { VoiceChannel } = require("discord.js");

const player = createAudioPlayer();

module.exports = {
    name: "play",
    description: "Plays video",
    async execute(message, args) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send("deo vao voice duoc");
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT"))
            return message.channel.send("tao k thay m");
        if (!permissions.has("SPEAK"))
            return message.channel.send("t k nghe thay m");
        if (!args.length)
            return message.channel.send("viet ten hoac link bai hat di thg dan`");
        const videoFinder = async(query) => {
            const videoResult = await ytSearch(query);
            return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
        };
        const video = await videoFinder(args.join(" "));
        if (video) {
            const stream = ytdl(video.url, { filter: "audioonly" });
            const resource = createAudioResource(stream, { inlineVolume: true });
            resource.volume.setVolume(0.5);

            player.play(resource);
            await message.reply(`:thumbsup: Now Playing ***${video.title}***`);
        } else {
            message.channel.send(`No video results found`);
        }
    },
};