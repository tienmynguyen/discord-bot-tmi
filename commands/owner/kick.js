const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "kick",
  category: "owner",
  run: (client, message, args) => {
    const member = message.mentions.members.first();

    try {
      if (member) {
        const memberTaget = message.guild.members.cache.get(member.id);
        memberTaget.kick();
        message.channel.send("hơi thở của staff thức thứ 1, búng tay");
      } else {
        message.channel.send("bạn í mạnh hơn mình :/");
      }
    } catch (error) {
      message.channel.send("bạn í mạnh hơn mình :/");
    }
  },
};
