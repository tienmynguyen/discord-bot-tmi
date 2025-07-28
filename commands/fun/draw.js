const { Configuration, OpenAIApi } = require("openai");
const { EmbedBuilder } = require("discord.js");

const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
    name: "draw",
    category: "fun",
    run: async(client, message, args) => {
        let conversationLog = [
            { role: "system", content: "You are a friendly chatbot." },
        ];

        try {
            await message.channel.sendTyping();

            let prevMessages = await message.channel.messages.fetch({ limit: 15 });
            prevMessages.reverse();

            prevMessages.forEach((msg) => {
                try {
                    msg.content = msg.content.replace("midraw", "");

                    if (msg.content.startsWith("!")) return;
                    if (msg.author.id !== client.user.id && msg.author.bot) return;

                    if (msg.author.id === client.user.id) {
                        conversationLog.push({
                            role: "assistant",
                            content: msg.content,
                            name: msg.author.username
                                .replace(/\s+/g, "_")
                                .replace(/[^\w\s]/gi, ""),
                        });
                    }

                    if (msg.author.id === message.author.id) {
                        conversationLog.push({
                            role: "user",
                            content: msg.content,
                            name: message.author.username
                                .replace(/\s+/g, "_")
                                .replace(/[^\w\s]/gi, ""),
                        });
                    }
                } catch (msgErr) {
                    console.error(`Lỗi xử lý message: ${msgErr}`);
                }
            });

            let response;
            try {
                response = await openai.createImage({
                    prompt: message.content,
                    n: 1,
                    size: "1024x1024",
                });
            } catch (apiErr) {
                console.error(`❌ Lỗi OpenAI Image API: ${apiErr}`);
                return message.reply("❌ Có lỗi xảy ra khi tạo ảnh từ OpenAI.");
            }

            if (!response ||
                !response.data ||
                !response.data.data ||
                !response.data.data[0] ||
                !response.data.data[0].url
            ) {
                return message.reply("❌ Không nhận được ảnh từ OpenAI.");
            }

            const image = response.data.data[0].url;

            const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle(`Tuyệt tác về: ${message.content}`)
                .setImage(image)
                .setFooter({ text: "100 điểm" });

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(`❌ Lỗi tổng thể: ${error}`);
            await message.channel.send("❌ Có lỗi xảy ra. Bot sẽ ngủ một chút 💤");
        }
    },
};