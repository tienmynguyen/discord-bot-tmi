const { getAudioUrl } = require("google-tts-api");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  entersState,
  VoiceConnectionStatus,
} = require("@discordjs/voice");

module.exports = {
  name: "tts",
  category: "voice",
  run: async (client, message, args) => {
    const channel = message.member.voice?.channel;

    if (!args[0]) return message.reply("Bạn chưa nhập nội dung!");
    if (!channel) return message.reply("Bạn phải tham gia kênh voice trước!");

    const string = args.join(" ");

    if (string.length > 200)
      return message.channel.send("Viết ngắn thôi (<200 ký tự).");

    try {
      // Lấy URL âm thanh
      const audioURL = await getAudioUrl(string, {
        lang: "vi",
        slow: false,
        host: "https://translate.google.com",
        timeout: 10000,
      });

      // Kết nối voice
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });

      await entersState(connection, VoiceConnectionStatus.Ready, 5_000);

      // Phát âm thanh
      const player = createAudioPlayer();
      const resource = createAudioResource(audioURL);
      player.play(resource);
      connection.subscribe(player);

      // Sau khi phát xong thì rời khỏi kênh
      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
      });

    } catch (error) {
      console.error("TTS Error:", error);
      message.channel.send("Có lỗi xảy ra khi phát TTS.");
    }
  },
};
