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
                value: `Pet sẽ nhận được EXP qua các hoạt động. Khi đạt đủ EXP, pet sẽ **lên cấp**!`,
            }, {
                name: "✨ TIẾN HOÁ",
                value: `Khi đạt cấp độ yêu cầu (thường là **Level 5**), pet sẽ **tiến hoá** thành dạng mạnh hơn.`,
            }, {
                name: "📜 CÁC LỆNH CƠ BẢN",
                value: `
\`mistart\` → Nhận pet đầu tiên  
\`miz\` → Xem thông tin pet  
\`misetteam\` → Tạo team từ chỉ số thứ tự (VD: \`misetteam 1 2 3\`)  
\`miteam\` → Xem thông tin team hiện tại  
\`mih\` → Săn pet hoang  
\`mipvp\` → PvP với người khác bằng cách tag  
\`mitrain\` → Tăng chỉ số cho pet, tối đa 10 lần/ngày
                    `,
            }, {
                name: "🧪 BẢNG KHẮC HỆ",
                value: `
**🔥 Fire** > Grass, Ice, Bug, Steel  
**🌿 Grass** > Water, Rock, Ground  
**💧 Water** > Fire, Rock, Ground  
**⚡ Electric** > Water, Flying  
**🪨 Rock** > Fire, Flying, Bug, Ice  
**👻 Ghost** > Normal, Psychic  
**🐉 Dragon** > Dragon  
**❄️ Ice** > Grass, Ground, Flying, Dragon  
**☠️ Poison** > Grass, Fairy  
**🐛 Bug** > Grass, Psychic, Dark  
**✨ Fairy** > Dragon, Fighting, Dark  
**🔩 Steel** > Ice, Rock, Fairy
                    `
            }, {
                name: "🔎 GỢI Ý",
                value: `- Chọn pet phù hợp với lối chơi của bạn.  
- Theo dõi chỉ số và kỹ năng để sử dụng hiệu quả trong chiến đấu!`,
            })
            .setFooter({
                text: "🐶 BOT PET | Nông trại thiểu năng",
                iconURL: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
            });

        message.reply({ embeds: [embed] });
    }
};