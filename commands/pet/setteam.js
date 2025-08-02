// commands/pet/setteam.js
const fs = require("fs");
const Pet = require("../../petSystem/Pet");
const playerDB = "./data/players.json";

module.exports = {
    name: "setteam",
    aliases: [],
    run: async(client, message, args) => {
        const userId = message.author.id;
        const db = JSON.parse(fs.readFileSync(playerDB, "utf8"));

        if (!db[userId] || !db[userId].pets || db[userId].pets.length === 0) {
            return message.reply("❌ Bạn chưa sở hữu pet nào để thiết lập đội hình!");
        }

        const indexes = args.map(i => parseInt(i) - 1); // Chuyển về index 0-based

        if (indexes.length === 0 || indexes.length > 3) {
            return message.reply("❗ Vui lòng chọn từ 1 đến 3 pet để vào đội hình. Ví dụ: `!setteam 1 2 3`");
        }

        const selectedPets = [];

        for (let idx of indexes) {
            if (isNaN(idx) || idx < 0 || idx >= db[userId].pets.length) {
                return message.reply(`⚠️ Vị trí pet không hợp lệ: ${idx + 1}`);
            }

            const rawPet = db[userId].pets[idx];
            const pet = Object.assign(new Pet({}), rawPet);
            selectedPets.push(pet);
        }

        db[userId].team = selectedPets;
        fs.writeFileSync(playerDB, JSON.stringify(db, null, 2));

        message.reply(`✅ Đội hình đã được cập nhật thành công với ${selectedPets.length} pet!`);
    }
};