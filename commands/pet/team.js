// commands/pet/team.js
const fs = require("fs");
const { EmbedBuilder } = require("discord.js");
const Pet = require("../../petSystem/Pet");
const playerDB = "./data/players.json";

module.exports = {
    name: "team",
    aliases: [],
    run: async(client, message, args) => {
        const userId = message.author.id;
        const db = JSON.parse(fs.readFileSync(playerDB, "utf8"));

        if (!db[userId] || !db[userId].team || db[userId].team.length === 0) {
            return message.reply("❌ Bạn chưa thiết lập đội hình!");
        }

        const embeds = db[userId].team.map((petData, index) => {
            const pet = Object.assign(new Pet({}), petData);
            const level = pet.level || 1;
            const exp = pet.exp || 0;
            const expToNext = 50 + level * 20;

            const embed = new EmbedBuilder()
                .setTitle(`🔰 Vị trí ${index + 1}: ${pet.name}`)
                .setColor("#FFD700")
                .addFields({ name: "🔹 Hệ", value: pet.type, inline: true }, { name: "🔢 Level", value: `${level}`, inline: true }, { name: "✨ EXP", value: `${exp}/${expToNext}`, inline: true }, { name: "⚔️ ATK", value: `${pet.attack}`, inline: true }, { name: "🛡️ DEF", value: `${pet.defense}`, inline: true }, { name: "❤️ HP", value: `${pet.hp}`, inline: true }, { name: "Skill: " + `${pet.skills[0].name}`, value: `${pet.skills[0].cost}`, inline: true });

            return embed;
        });

        for (const embed of embeds) {
            await message.channel.send({ embeds: [embed] });
        }
    }
};