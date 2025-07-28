const { getAudioUrl } = require("google-tts-api");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");

module.exports = {
  name: "tts",
  category: "voice",
  run: (client, message, args) => {
    const { channel } = message.member.voice;
    const connection = message.guild.voice && message.guild.voice.connection;

    if (!args[0]) return message.channel.send("?");
    if (!channel) return message.reply("r noi' o dau??");
    const string = args.join(" ");

    if (string.length > 200)
      return message.channel.send("Viết ngắn ngắn thôi (<200 kí tự)");
    const audioURL = getAudioUrl(string, {
      lang: "vi",
      slow: false,
      host: "https://translate.google.com",
      timeout: 10000,
    });

    let VoiceConnection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    const resource = createAudioResource(audioURL);
    const player = createAudioPlayer();
    VoiceConnection.subscribe(player);
    player.play(resource);
  },
};
