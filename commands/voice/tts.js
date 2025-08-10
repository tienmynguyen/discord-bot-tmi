const { getAudioUrl } = require("google-tts-api");
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    StreamType,
} = require("@discordjs/voice");
const { Readable, PassThrough } = require("stream");

module.exports = {
    name: "t",
    category: "voice",
    run: async(client, message, args) => {
        const fetch = (await
            import ("node-fetch")).default;

        try {
            // Kiểm tra voice channel
            const voice = message.member.voice;
            if (!voice || !voice.channel) {
                return message.reply("r noi' o dau??");
            }

            if (!args[0]) {
                return message.channel.send("?");
            }

            const string = args.join(" ");
            if (string.length > 200) {
                return message.channel.send("Viết ngắn ngắn thôi (<200 kí tự)");
            }

            // Lấy URL TTS từ Google Translate
            const audioURL = await getAudioUrl(string, {
                lang: "vi",
                slow: false,
                host: "https://translate.google.com",
                timeout: 10000,
            });

            const response = await fetch(audioURL);
            if (!response.ok) {
                throw new Error("Không thể tải âm thanh từ Google");
            }

            const audioBuffer = await response.buffer();
            const stream = Readable.from(audioBuffer);
            const passthrough = new PassThrough();
            stream.pipe(passthrough);

            // Kết nối voice
            let connection;
            try {
                connection = joinVoiceChannel({
                    channelId: voice.channel.id,
                    guildId: voice.channel.guild.id,
                    adapterCreator: voice.channel.guild.voiceAdapterCreator,
                });

                // Bắt lỗi kết nối voice (vd: lỗi mã hóa)
                connection.on("error", (err) => {
                    console.error("Voice Connection Error:", err);
                    message.channel.send("Cái voice đấy bị đần rồi tao không nói được.");
                    connection.destroy();
                });

            } catch (connErr) {
                console.error("Lỗi khi join voice channel:", connErr);
                return message.channel.send("Không vào voice được.");
            }

            // Phát audio
            const player = createAudioPlayer();
            const resource = createAudioResource(passthrough, {
                inputType: StreamType.Arbitrary,
            });

            connection.subscribe(player);
            player.play(resource);

            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy();
            });

            player.on("error", (err) => {
                console.error("Audio Player Error:", err);
                message.channel.send("Bây giờ tao bị câm");
                connection.destroy();
            });

        } catch (error) {
            console.error("TTS Error:", error);
            message.channel.send("Hôm nay tao nghỉ phép");
        }
    },
};