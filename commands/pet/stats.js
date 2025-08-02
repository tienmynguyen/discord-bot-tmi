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

        // Tiêu đề bảng
        let table = "```md\n";
        table += "#  Tên        Lv  Hệ     HP   ATK  DEF  AGI  ACC  ENE\n";

        pets.forEach((petData, index) => {
            const pet = Object.assign(new Pet({}), petData);
            const line =
                `${String(index + 1).padEnd(2)} ` +
                `${pet.name.slice(0, 10).padEnd(10)} ` +
                `${String(pet.level).padStart(2)}  ` +
                `${pet.type.padEnd(6).slice(0, 6)} ` +
                `${String(pet.hp).padStart(4)} ` +
                `${String(pet.attack).padStart(4)} ` +
                `${String(pet.defense).padStart(4)} ` +
                `${String(pet.agility || 0).padStart(4)} ` +
                `${String(pet.accuracy).padStart(4)} ` +
                `${String(pet.energy || 0).padStart(4)}\n`;

            table += line;
        });

        table += "```";

        const embed = new EmbedBuilder()
            .setColor("#00ccff")
            .setTitle("📋 Danh sách Pet của bạn")
            .setDescription(table)
            .setFooter({
                text: `🐾 Tổng cộng: ${pets.length} pet`,
                iconURL: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
            });

        message.reply({ embeds: [embed] });
    },
};