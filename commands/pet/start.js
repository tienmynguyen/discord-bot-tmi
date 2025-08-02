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

        if (!db[userId]) {
            db[userId] = { pets: [] };
        }

        // ❌ Không cho nhận nếu đã có ít nhất 1 pet
        if (db[userId].pets.length > 0) {
            return message.reply("❌ Bạn đã có pet rồi! Không thể nhận thêm.");
        }

        // Chọn ngẫu nhiên 1 pet gốc
        const basicPets = petList.filter(p => p.evolves_to && !p.evolves_from);
        const chosenData = basicPets[Math.floor(Math.random() * basicPets.length)];

        const pet = new Pet(chosenData);
        pet.level = 1;
        pet.exp = 0;
        pet.energy = 0;

        db[userId].pets.push(pet);
        fs.writeFileSync(playerDB, JSON.stringify(db, null, 2));

        const firstSkill = (pet.skills && pet.skills.length > 0 && pet.skills[0].name) ?
            pet.skills[0].name :
            "Không có kỹ năng";

        message.reply(
            `🎁 Bạn nhận được pet **${pet.name}** hệ **${pet.type}** với kỹ năng **${firstSkill}**!`
        );
    },
};