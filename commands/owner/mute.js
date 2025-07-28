const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "mute",
    category: "owner",
    run: (client, message, args) => {
        const member = message.mentions.members.first();
        const user = message.mentions.users.first();
        if (!user) return message.reply("mute ai cũng đéo biết thì mày tự bịt mồm lại đi");
        if (user.id === message.author.id)
            return message.reply("tự lấy băng dính dán miệng đi");

        const reason = args.slice(1).join(" ");
        const banmessage = new EmbedBuilder()
            .setColor("#00aaaa")
            .setDescription(
                `${user} tao không biết cách mute nên tạm thời mày giả vờ nín đi nhá **${
          reason != "" ? reason : "-"
        }**`
            );
        message.channel.send({ embeds: [banmessage] });
    },
};