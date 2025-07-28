const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = {
    name: "pt",
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
                    const cleanedContent = msg.content.replace("mipt", "");

                    if (msg.content.startsWith("!")) return;
                    if (msg.author.id !== client.user.id && msg.author.bot) return;

                    if (msg.author.id === client.user.id) {
                        conversationLog.push({
                            role: "assistant",
                            content: cleanedContent,
                            name: msg.author.username.replace(/\s+/g, "_").replace(/[^\w\s]/gi, ""),
                        });
                    }

                    if (msg.author.id === message.author.id) {
                        conversationLog.push({
                            role: "user",
                            content: cleanedContent,
                            name: message.author.username.replace(/\s+/g, "_").replace(/[^\w\s]/gi, ""),
                        });
                    }
                } catch (innerError) {
                    console.error(`Lỗi khi xử lý message: ${innerError}`);
                }
            });

            const result = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: conversationLog,
            });

            if (!result || !result.data || !result.data.choices || !result.data.choices[0]) {
                return message.reply("❌ Không nhận được phản hồi từ OpenAI.");
            }

            message.reply(result.data.choices[0].message.content);
        } catch (error) {
            console.error(`❌ Lỗi tổng thể: ${error}`);
            message.reply("❌ Có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại sau.");
        }
    },
};