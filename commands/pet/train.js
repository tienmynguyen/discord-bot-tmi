const fs = require("fs");
const Pet = require("../../petSystem/Pet");
const playerDB = "./data/players.json";

// Hàm lấy ngày hôm nay theo ISO yyyy-mm-dd
const getToday = () => new Date().toISOString().split("T")[0];

module.exports = {
    name: "train",
    aliases: [],
    run: async(client, message, args) => {
        const userId = message.author.id;
        const db = JSON.parse(fs.readFileSync(playerDB, "utf8"));

        // Kiểm tra người chơi có đội hình chưa
        if (!db[userId] || !Array.isArray(db[userId].team) || db[userId].team.length === 0) {
            return message.reply("❌ Bạn chưa thiết lập đội hình để huấn luyện!");
        }

        const today = getToday();
        const trainData = db[userId].train || { count: 0, last: today };

        // Reset lượt train nếu qua ngày mới
        if (trainData.last !== today) {
            trainData.count = 0;
            trainData.last = today;
        }

        // Giới hạn số lượt train mỗi ngày
        if (trainData.count >= 10) {
            return message.reply("⚠️ Bạn đã train tối đa **10 lần hôm nay**. Hãy quay lại vào ngày mai!");
        }

        let msg = `📚 **Kết quả huấn luyện:**\n`;

        // Duyệt qua từng pet trong team để huấn luyện
        for (let i = 0; i < db[userId].team.length; i++) {
            let petData = db[userId].team[i];

            // Khởi tạo lại đối tượng Pet từ dữ liệu
            let pet = Object.assign(new Pet({}), petData);

            const result = pet.train(); // Gọi hàm huấn luyện từ class Pet

            // Cập nhật lại dữ liệu pet
            db[userId].team[i] = pet;

            // Ghi log kết quả huấn luyện
            msg += `\n🔹 **${pet.name}** nhận **${result.exp} EXP** (${pet.exp}/${result.expToLevelUp})`;

            if (result.leveledUp) msg += ` 🎉 Lên level **${pet.level}**`;

            if (result.statUps && result.statUps.length > 0) {
                const stats = result.statUps.map(s => `+${s.gain} ${s.stat}`).join(", ");
                msg += `\n📈 ${stats}`;
            }
        }

        trainData.count++;
        db[userId].train = trainData;

        // Lưu dữ liệu lại vào file
        fs.writeFileSync(playerDB, JSON.stringify(db, null, 2));

        return message.reply(`${msg}\n\n📊 Đã train ${trainData.count}/10 lần hôm nay.`);
    }
};