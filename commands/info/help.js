const { EmbedBuilder } = require("discord.js");
module.exports = {
    name: "help",
    category: "info",
    run: (client, message, args) => {
        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.member;
        var des =
            "**FUN:** \nmisay🗣️:     \nmipt💡: chat with a friendly chatbot<🐧 het tien mua API key nen tam thoi bao tri`🐧>     \nmidraw🎨: draw whatever you want<🐧cai nay cung the🥲>\n\n**INFO:** \nmiavt🥰: see anyone's avatar\n\n**VOICE:** \nmitts🥰: text to speech\n\n**MODERATOR:** \nmiban🚷   \nmikick🦵  \nmimute🤐";
        const embed = new EmbedBuilder()
            .setTitle(` Đọc rồi nhớ kỹ vào đồ con lợn ${member.displayName}`)
            .setDescription(des);
        message.channel.send({ embeds: [embed] });
    },
};