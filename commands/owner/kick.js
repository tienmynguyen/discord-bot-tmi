const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "kick",
  category: "owner",
  run: async (client, message, args) => {
    const member = message.mentions.members.first();

    if (!member) return message.reply(" Kick ai cũng không biết thì kêu nó tự out đi cho nhanh");

    // Nếu người dùng cố kick chính mình
    if (member.id === message.author.id) {
      return message.reply("bị đần hay sao mà muốn tự đá vào đít mình");
    }

    // Nếu người dùng cố kick bot
    if (member.id === client.user.id) {
      return message.reply("có biết tao sắp thống trị thế giới không ?");
    }

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
