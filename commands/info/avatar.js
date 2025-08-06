const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "avatar",
    category: "fun",
    aliases: ["avt"],
    run: (client, message, args) => {
        // Lấy member được mention, ID, hoặc chính người gửi
        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.member;

        // Lấy avatar URL chất lượng cao nhất, giữ định dạng gốc (gif nếu có)
        const avatarURL = member.displayAvatarURL({
            dynamic: true,
            size: 4096,
        });

        // Tạo mô tả ngẫu nhiên
        const descriptions = [
            "nhìn cũng tạm",
            "10 điểm, không có nhưng",
            "cũm dễ thưn",
            "không có gì để chê",
            "cũm dễ thưn",
            "tinh xảo",
            "cũm dễ thưn",
            "lấp lánh",
            "cũm dễ thưn",
            "nhìn như.."
        ];
        const randomIndex = Math.floor(Math.random() * descriptions.length);
        const description = `${descriptions[randomIndex]}\n[👉 Tải ảnh gốc](${avatarURL})`;

        // Tạo embed
        const embed = new EmbedBuilder()
            .setTitle(`Avatar của ${member.displayName}`)
            .setImage(avatarURL)
            .setDescription(description);

        // Gửi embed
        message.channel.send({ embeds: [embed] });
    },
};