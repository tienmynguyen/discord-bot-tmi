const { getAudioUrl } = require("google-tts-api");
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
} = require("@discordjs/voice");
const { Readable } = require("stream");

module.exports = {
    name: "tts",
    category: "voice",
    run: async(client, message, args) => {
        const fetch = (await
            import ("node-fetch")).default;

        const { channel } = message.member.voice;
        if (!args[0]) return message.channel.send("?");
        if (!channel) return message.reply("r noi' o dau??");

        const string = args.join(" ");
        if (string.length > 200)
            return message.channel.send("Viết ngắn ngắn thôi (<200 kí tự)");

        try {
            const audioURL = await getAudioUrl(string, {
                lang: "vi",
                slow: false,
                host: "https://translate.google.com",
                timeout: 10000,
            });

            const response = await fetch(audioURL);
            if (!response.ok) throw new Error("Không thể tải âm thanh từ Google");

            const audioBuffer = await response.buffer();
            const stream = Readable.from(audioBuffer);

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });

            const player = createAudioPlayer();
            const resource = createAudioResource(stream);

            connection.subscribe(player);
            player.play(resource);

            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy();
            });

        } catch (error) {
            console.error("TTS Error:", error);
            message.channel.send("Có lỗi xảy ra khi phát TTS.");
        }
    },
};
