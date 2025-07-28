const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "kick",
    category: "owner",
    run: (client, message, args) => {
        const member = message.mentions.members.first();

        // Check nếu người dùng không có quyền
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply("Bạn không có quyền để đuổi người khác!");
        }

        // Check nếu bot không có quyền
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply("Bot không có quyền để kick người!");
        }

        if (!member) return message.reply("Bạn cần mention người cần kick!");

        try {
            member.kick();
            message.channel.send("hơi thở của staff thức thứ 1, búng tay");
        } catch (error) {
            console.error(error);
            message.channel.send("Không thể kick người này. Có thể họ mạnh quá 🫡");
        }
    },
};
