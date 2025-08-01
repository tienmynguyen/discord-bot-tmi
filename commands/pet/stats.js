// commands/pet/stats.js
const fs = require("fs");
const { EmbedBuilder } = require("discord.js");
const Pet = require("../../petSystem/Pet");
const playerDB = "./data/players.json";

module.exports = {
    name: "stats",
    aliases: [],
    run: async(client, message, args) => {
        const userId = message.author.id;
        const db = JSON.parse(fs.readFileSync(playerDB, "utf8"));

        if (!db[userId]) return message.reply("❌ Bạn chưa có pet!");

        const pet = Object.assign(new Pet({}), db[userId].pet);
        const level = pet.level || 1;
        const exp = pet.exp || 0;
        const expToNext = 50 + level * 20;

        const embed = new EmbedBuilder()
            .setTitle(`📊 Thông tin pet: ${pet.name}`)
            .setColor("#00BFFF")
            .addFields({ name: "🔹 Loại", value: pet.type, inline: true }, { name: "🔢 Level", value: `${level}`, inline: true }, { name: "✨ EXP", value: `${exp}/${expToNext}`, inline: true },

                { name: "❤️ HP", value: `${pet.hp}`, inline: true }, { name: "⚔️ Attack", value: `${pet.attack}`, inline: true }, { name: "🛡️ Defense", value: `${pet.defense}`, inline: true },

                { name: "⚡ Agility", value: `${pet.agility || pet.speed || 0}`, inline: true }, { name: "🎯 Accuracy", value: `${pet.accuracy}`, inline: true }, { name: "🔋 Energy", value: `${pet.energy || 0}`, inline: true }
            );

        if (pet.skills && pet.skills.length > 0) {
            const skillDescriptions = pet.skills
                .map(skill => `• **${skill.name}** (💥 Damage: ${skill.damage}, ⚡ Cost: ${skill.cost})`)
                .join("\n");

            embed.addFields({
                name: "🧠 Kỹ năng",
                value: skillDescriptions,
            });
        } else {
            embed.addFields({
                name: "🧠 Kỹ năng",
                value: "Pet chưa học kỹ năng nào 😢",
            });
        }

        if (pet.evolves_to) {
            embed.setFooter({
                text: `🧬 Có thể tiến hoá thành ${pet.evolves_to} khi đạt level ${pet.evolve_level}`,
            });
        } else {
            embed.setFooter({
                text: "🧬 Pet này không thể tiến hoá.",
            });
        }

        message.reply({ embeds: [embed] });
    }
};