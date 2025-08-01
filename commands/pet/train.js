const fs = require("fs");
const Pet = require("../../petSystem/Pet");
const playerDB = "./data/players.json";

const getToday = () => new Date().toISOString().split("T")[0];

module.exports = {
    name: "train",
    aliases: [],
    run: async(client, message, args) => {
        const userId = message.author.id;
        const db = JSON.parse(fs.readFileSync(playerDB, "utf8"));

        if (!db[userId]) return message.reply("❌ Bạn chưa có pet!");

        const today = getToday();
        const trainData = db[userId].train || { count: 0, last: today };

        // Reset lượt train nếu qua ngày mới
        if (trainData.last !== today) {
            trainData.count = 0;
            trainData.last = today;
        }

        if (trainData.count >= 10) {
            return message.reply("⚠️ Bạn đã train tối đa **10 lần hôm nay**. Hãy quay lại vào ngày mai!");
        }

        const pet = Object.assign(new Pet({}), db[userId].pet);
        const result = pet.train();

        trainData.count++;
        db[userId].train = trainData;

        if (!result.success) {
            fs.writeFileSync(playerDB, JSON.stringify(db, null, 2));
            return message.reply(`😓 Huấn luyện thất bại! Pet không nhận được gì.\n📊 Đã train ${trainData.count}/10 lần hôm nay.`);
        }

        db[userId].pet = pet;
        fs.writeFileSync(playerDB, JSON.stringify(db, null, 2));

        let msg = `✅ Pet **${pet.name}** nhận được **${result.exp} EXP**. (${pet.exp}/${result.expToLevelUp})`;

        if (result.leveledUp) msg += `\n🎉 Lên level **${pet.level}**!`;

        if (result.statUps && result.statUps.length > 0) {
            const statsGained = result.statUps
                .map(s => `+${s.gain} ${s.stat}`)
                .join(", ");
            msg += `\n📈 Chỉ số tăng: ${statsGained}`;
        }


        msg += `\n📊 Bạn đã train ${trainData.count}/10 lần hôm nay.`;

        message.reply(msg);
    }
};