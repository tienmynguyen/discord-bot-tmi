const fs = require("fs");
const { EmbedBuilder } = require("discord.js");
const Pet = require("../../petSystem/Pet");
const playerDB = "./data/players.json";

module.exports = {
    name: "z",
    aliases: [],
    run: async(client, message, args) => {
        const userId = message.author.id;
        const db = JSON.parse(fs.readFileSync(playerDB, "utf8"));

        if (!db[userId] || !db[userId].pets || db[userId].pets.length === 0) {
            return message.reply("❌ Bạn chưa sở hữu pet nào!");
        }

        const pets = db[userId].pets;

        let petListText = "**# | 🐾 Tên | 🔥 Hệ | 🔢 Lv | ❤️ HP | ⚔️ ATK | 🛡️ DEF | ⚡ AGI | 🎯 ACC | 🔋 ENE**";
        petListText += "\n```";

        pets.forEach((petData, index) => {
            const pet = Object.assign(new Pet({}), petData);
            const line = `${(index + 1).toString().padEnd(2)} | ${pet.name.padEnd(8)} | ${pet.type.padEnd(6)} | ${String(pet.level).padEnd(2)} | ${String(pet.hp).padEnd(3)} | ${String(pet.attack).padEnd(3)} | ${String(pet.defense).padEnd(3)} | ${String(pet.agility || 0).padEnd(3)} | ${String(pet.accuracy).padEnd(3)} | ${String(pet.energy || 0).padEnd(3)}`;
            petListText += line + "\n";
        });

        petListText += "```";

        const embed = new EmbedBuilder()
            .setColor("#00ccff")
            .setTitle("📋 Danh sách Pet bạn đang sở hữu")
            .setDescription(petListText)
            .setFooter({
                text: `🐾 Tổng cộng: ${pets.length} pet`,
                iconURL: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
            });

        message.reply({ embeds: [embed] });
    },
};