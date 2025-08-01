const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "pet",
    aliases: [],
    run: async(client, message, args) => {
        const embed = new EmbedBuilder()
            .setColor("#00ccff")
            .setTitle("🌟 Hướng Dẫn Chơi Thú Nuôi")
            .setThumbnail("https://cdn-icons-png.flaticon.com/512/616/616408.png")
            .setDescription(`
Chào mừng đến với thế giới **Nông trại thiểu năng** 🐾  
Dưới đây là mọi thứ bạn cần để bắt đầu cuộc hành trình huấn luyện pet của mình!
            `)
            .addFields({
                name: "🎮 BẮT ĐẦU",
                value: `Dùng lệnh \`!start\` để nhận một pet thiểu năng ngẫu nhiên và khởi đầu chuyến phiêu lưu.`,
            }, {
                name: "📈 CÁCH LÊN CẤP",
                value: `Pet sẽ nhận được EXP qua các hoạt động. Khi đạt 100 EXP, pet sẽ **lên cấp**!`,
            }, {
                name: "✨ TIẾN HOÁ",
                value: `Khi đạt cấp độ yêu cầu (thường là **Level 5**), pet sẽ **tiến hoá** thành dạng đỡ thiểu năng hơn.`,
            }, {
                name: "📜 CÁC LỆNH CƠ BẢN",
                value: `
\`!start\` → Nhận pet thiểu năng đầu tiên  
\`!stats\` → Xem thông tin pet hiện tại  
\`!battle\` → (nếu có) Tham gia chiến đấu
\'!train\' → Tăng chỉ số cho pet, tối đa 10 lần 1 ngày
                    `
            }, {
                name: "🔎 GỢI Ý",
                value: `- Chọn pet phù hợp với lối chơi của bạn.  
- Theo dõi chỉ số và kỹ năng để sử dụng hiệu quả trong chiến đấu!`
            })
            .setFooter({ text: "🐶 BOT PET | Nông trại thiểu năng", iconURL: "https://cdn-icons-png.flaticon.com/512/616/616408.png" });

        message.reply({ embeds: [embed] });
    }
};