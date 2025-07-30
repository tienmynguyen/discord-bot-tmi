const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "kick",
  category: "owner",
  run: async (client, message, args) => {
    const member = message.mentions.members.first();

    if (!member) return message.reply("Bạn cần mention người cần kick!");

    // Người gọi lệnh không có quyền
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply("Mày là ai mà ra lệnh cho tao ??");
    }

    // Bot không có quyền
    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply("Đưa khẩu súng đây đã");
    }

    // Kiểm tra role của bot so với người bị kick
    if (member.roles.highest.position >= message.guild.members.me.roles.highest.position) {
      return message.reply("Thằng này đàn em tao, tao không kick");
    }

    try {
      await member.kick();
      message.channel.send("hơi thở của staff thức thứ 1, búng tay 👋");
    } catch (error) {
      console.error(error);
      message.channel.send("Thằng này mạnh quá tao chơi không lại");
    }
  },
};
