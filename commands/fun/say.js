module.exports = {
  name: "say",
  category: "fun",
  run: async (client, message, args) => {
    if (message.deletable) message.delete();

    // Kiểm tra xem có mention kênh nào không
    const mentionedChannel = message.mentions.channels.first();
    let targetChannel = message.channel;
    let content = args.join(" ");

    if (mentionedChannel) {
      targetChannel = mentionedChannel;
      // Xóa phần mention kênh khỏi nội dung
      content = args.slice(1).join(" ");
    }

    if (!content.trim()) {
      return message.channel.send("Bạn chưa nhập nội dung để bot nói!");
    }

    try {
      await targetChannel.send(content);
    } catch (error) {
      console.error(error);
      message.channel.send("Không thể gửi tin nhắn tới kênh được chọn!");
    }
  },
};
