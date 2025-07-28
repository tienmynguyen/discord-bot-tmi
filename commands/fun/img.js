const { EmbedBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

module.exports = {
    name: "img sadboi",
    category: "fun",
    run: async(client, message, args) => {
        try {
            var avatarURL = "./an-removebg-preview.png";
            const embed = new EmbedBuilder()
                .setImage(avatarURL)
                .setTitle(`Hình ảnh hiển thị cho sadboi`)
                .setDescription("sad boi dưới cơn mưa tháng 8");

            message.channel.send({ embeds: [embed] });
        } catch (e) {
            message.channel.send("bot đã nhấn nút tự huỷ");
        }
    },
};