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
        const embeds = [];

        pets.forEach((petData, index) => {
            const pet = Object.assign(new Pet({}), petData);
            const level = pet.level || 1;
            const exp = pet.exp || 0;
            const expToNext = 50 + level * 20;

            const embed = new EmbedBuilder()
                .setTitle(`🐾 Pet ${index + 1}: ${pet.name}`)
                .setColor("#00BFFF")
                .addFields({ name: "🔹 Hệ", value: pet.type || "Không rõ", inline: true }, { name: "🔢 Level", value: `${level}`, inline: true }, { name: "✨ EXP", value: `${exp}/${expToNext}`, inline: true },

                    { name: "❤️ HP", value: `${pet.hp}`, inline: true }, { name: "⚔️ Attack", value: `${pet.attack}`, inline: true }, { name: "🛡️ Defense", value: `${pet.defense}`, inline: true },

                    { name: "⚡ Agility", value: `${pet.agility || 0}`, inline: true }, { name: "🎯 Accuracy", value: `${pet.accuracy}`, inline: true }, { name: "🔋 Energy", value: `${pet.energy || 0}`, inline: true }
                );

            if (pet.skills && pet.skills.length > 0) {
                const skillText = pet.skills
                    .map(skill => `• **${skill.name}** (💥 Damage: ${skill.damage}, ⚡ Cost: ${skill.cost})`)
                    .join("\n");

                embed.addFields({ name: "🧠 Kỹ năng", value: skillText });
            } else {
                embed.addFields({ name: "🧠 Kỹ năng", value: "Pet chưa học kỹ năng nào 😢" });
            }

            if (pet.evolves_to) {
                embed.setFooter({
                    text: `🧬 Có thể tiến hoá thành ${pet.evolves_to} ở level ${pet.evolve_level || "?"}`,
                });
            } else {
                embed.setFooter({ text: "🧬 Pet này không thể tiến hoá." });
            }

            embeds.push(embed);
        });

        for (const embed of embeds) {
            await message.channel.send({ embeds: [embed] });
        }
    },
};