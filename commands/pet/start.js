const fs = require("fs");
const Pet = require("../../petSystem/Pet");
const petList = require("../../petSystem/petList.json");
const playerDB = "./data/players.json";

module.exports = {
    name: "start",
    aliases: [],
    run: async(client, message, args) => {
        const userId = message.author.id;
        const db = JSON.parse(fs.readFileSync(playerDB, "utf8"));

        if (db[userId]) return message.reply("Bạn đã có pet rồi!");

        // Lọc chỉ những pet gốc (chưa tiến hoá) => có evolves_to nhưng không có evolves_from
        const basicPets = petList.filter(p => p.evolves_to && !p.evolves_from);
        const chosenData = basicPets[Math.floor(Math.random() * basicPets.length)];

        // Tạo pet mới từ dữ liệu gốc
        const pet = new Pet(chosenData);

        // Thiết lập level & exp ban đầu nếu chưa có
        pet.level = 1;
        pet.exp = 0;
        pet.energy = 0;

        // Gán pet vào dữ liệu người chơi
        db[userId] = { pet };
        fs.writeFileSync(playerDB, JSON.stringify(db, null, 2));

        // Lấy kỹ năng đầu tiên (nếu có)
        const firstSkill = pet.skills && pet.skills.length > 0 && pet.skills[0].name ?
            pet.skills[0].name :
            "Không có kỹ năng";

        // Thông báo
        message.reply(`🎁 Bạn nhận được pet **${pet.name}** hệ **${pet.type}** với kỹ năng **${firstSkill}**!`);
    }
};