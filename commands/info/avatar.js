const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "avatar",
  category: "fun",
  aliases: ["avt"],
  run: (client, message, args) => {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;

    const avatarURL = member.displayAvatarURL({
      format: "png",
      size: 4096,
      dynamic: true,
    });
    var randomnumber = Math.floor(Math.random() * 10);
    var des = "a";
    switch (randomnumber) {
      case 0:
        des = "nhìn cũng tạm";
        break;
      case 1:
        des = "10 điểm, không có nhưng";
        break;
      case 2:
        des = "cũm dễ thưn";
        break;
      case 3:
        des = "không có gì để chê";
        break;
      case 4:
        des = "cũm dễ thưn";
        break;
      case 5:
        des = "tinh xảo";
        break;
      case 6:
        des = "cũm dễ thưn";
        break;
      case 7:
        des = "lấp lánh";
        break;
      case 8:
        des = "cũm dễ thưn";
        break;
      case 9:
        des = "nhìn như..";
        break;
      default:
        des = " không có nhận xét";
    }
    const embed = new EmbedBuilder()
      .setImage(avatarURL)
      .setTitle(`Avatar của ${member.displayName}`)
      .setDescription(des);

    message.channel.send({ embeds: [embed] });
  },
};
