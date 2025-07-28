const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ban",
    category: "owner",
    run: (client, message, args) => {
        const member = message.mentions.members.first();

        if (!message.member.permissions.has("BAN_MEMBERS"))
            return message.reply("bình tĩnh nào, đừng nóng");
        const user = message.mentions.users.first();
        if (!user) return message.reply("ban ai?");
        if (user.id === message.author.id)
            return message.reply("tính tự huỷ à đồ đần");
        if (
            message.guild.members.cache.get(message.author.id).roles.highest
            .position <= member.roles.highest.position
        )
            return message.reply("mạnh quá chơi không lại");

        const reason = args.slice(1).join(" ");
        message.guild.members.cache
            .get(user.id)
            .ban({ reason: reason })
            .catch((e) => {
                message.reply("bình tĩnh nào");
            });

        const banmessage = new EmbedBuilder()
            .setColor("#00aaaa")
            .setDescription(
                `${user} đã bị bay màu, 1 phút mặc liệm bắt đầu: **${
          reason != "" ? reason : "-"
        }**`
            );
        message.channel.send({ embeds: [banmessage] });
    },
};