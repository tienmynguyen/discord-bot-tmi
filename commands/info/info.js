// const { EmbedBuilder } = require("discord.js");

// module.exports = {
//   name: "info",
//   category: "fun",
//   aliases: ["info"],
//   run: (client, message, args) => {
//     const member =
//       message.mentions.members.first() ||
//       message.guild.members.cache.get(args[0]) ||
//       message.member;

//     const avatarURL = member.displayAvatarURL({
//       format: "png",
//       size: 4096,
//       dynamic: true,
//     });
//     var des = "";
//     const embed = new EmbedBuilder()
//       .setImage(avatarURL)
//       .setTitle(`Thông tin về ${member.displayName}`)
//       .setDescription(des);

//     message.channel.send({ embeds: [embed] });
//   },
// };
