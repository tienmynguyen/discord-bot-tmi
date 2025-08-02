const fs = require("fs");
const Pet = require("../../petSystem/Pet");
const typeAdvantages = require("../../petSystem/typeChart");
const playerDB = "./data/players.json";

const numberEmojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];

function calculateDamage(attacker, defender) {
    let base = attacker.attack - defender.defense;
    let multiplier = 1;

    const strongAgainst = typeAdvantages[attacker.type] || [];
    if (strongAgainst.includes(defender.type)) {
        multiplier = 1.5;
    }

    const damage = Math.max(1, Math.floor(base * multiplier));
    return { damage, effectiveness: multiplier };
}

module.exports = {
    name: "pvp",
    aliases: [],
    run: async(client, message, args) => {
        const opponentUser = message.mentions.users.first();
        if (!opponentUser || opponentUser.bot) return message.reply("❌ Bạn phải tag người chơi hợp lệ.");

        const db = JSON.parse(fs.readFileSync(playerDB, "utf8"));
        const user1 = message.author;
        const user2 = opponentUser;

        if (!db[user1.id] || !db[user1.id].team || !db[user2.id] || !db[user2.id].team) {
            return message.reply("❌ Cả hai người chơi cần có đội hình để chiến đấu.");
        }


        const team1 = db[user1.id].team.map(p => Object.assign(new Pet({}), p));
        const team2 = db[user2.id].team.map(p => Object.assign(new Pet({}), p));

        for (let pet of[...team1, ...team2]) {
            pet.hp = pet.maxHp;
            pet.energy = 0;
        }

        const players = [
            { id: user1.id, user: user1, team: team1 },
            { id: user2.id, user: user2, team: team2 }
        ];

        await message.channel.send(`⚔️ Trận đấu giữa <@${user1.id}> và <@${user2.id}> bắt đầu!`);

        let current = 0;

        while (team1.some(p => p.hp > 0) && team2.some(p => p.hp > 0)) {
            const attacker = players[current];
            const defender = players[1 - current];

            const aliveAttackers = attacker.team.filter(p => p.hp > 0);
            const aliveDefenders = defender.team.filter(p => p.hp > 0);

            if (aliveAttackers.length === 0 || aliveDefenders.length === 0) break;

            // Chọn pet tấn công
            let atkMsg = `🎮 <@${attacker.id}> chọn pet để tấn công:\n`;
            aliveAttackers.forEach((p, i) => {
                atkMsg += `${numberEmojis[i]} ${p.name} (HP: ${p.hp}, NL: ${p.energy})\n`;
            });

            const petSelectMsg = await message.channel.send(atkMsg);
            for (let i = 0; i < aliveAttackers.length; i++) {
                await petSelectMsg.react(numberEmojis[i]);
            }

            let atkIdx = 0;
            try {
                const filter = (reaction, user) => numberEmojis.includes(reaction.emoji.name) && user.id === attacker.id;
                const collected = await petSelectMsg.awaitReactions({ filter, max: 1, time: 30000, errors: ["time"] });
                const emoji = collected.first().emoji.name;
                atkIdx = numberEmojis.indexOf(emoji);
            } catch {
                await message.channel.send("⏰ Không chọn pet, bỏ lượt.");
                current = 1 - current;
                continue;
            }

            const atkPet = aliveAttackers[atkIdx];

            // Chọn mục tiêu
            let defMsg = `🎯 <@${attacker.id}> chọn mục tiêu:\n`;
            aliveDefenders.forEach((p, i) => {
                defMsg += `${numberEmojis[i]} ${p.name} (HP: ${p.hp})\n`;
            });

            const defSelectMsg = await message.channel.send(defMsg);
            for (let i = 0; i < aliveDefenders.length; i++) {
                await defSelectMsg.react(numberEmojis[i]);
            }

            let defIdx = 0;
            try {
                const filter = (reaction, user) => numberEmojis.includes(reaction.emoji.name) && user.id === attacker.id;
                const collected = await defSelectMsg.awaitReactions({ filter, max: 1, time: 30000, errors: ["time"] });
                const emoji = collected.first().emoji.name;
                defIdx = numberEmojis.indexOf(emoji);
            } catch {
                await message.channel.send("⏰ Không chọn mục tiêu, bỏ lượt.");
                current = 1 - current;
                continue;
            }

            const defPet = aliveDefenders[defIdx];

            // Hành động
            const actionEmojis = ["🔪", "💥", "⏭️", "🏳️"];
            const actionMsg = await message.channel.send(
                `⚔️ <@${attacker.id}> chọn hành động cho **${atkPet.name}** đối với **${defPet.name}**:\n` +
                `🔪 Đánh thường\n💥 Dùng kỹ năng\n⏭️ Bỏ lượt\n🏳️ Bỏ cuộc`
            );
            for (const emoji of actionEmojis) await actionMsg.react(emoji);

            try {
                const filter = (reaction, user) => actionEmojis.includes(reaction.emoji.name) && user.id === attacker.id;
                const collected = await actionMsg.awaitReactions({ filter, max: 1, time: 30000, errors: ["time"] });
                const emoji = collected.first().emoji.name;

                if (emoji === "🔪") {
                    const { damage, effectiveness } = calculateDamage(atkPet, defPet);
                    defPet.hp -= damage;
                    let result = `🗡️ ${atkPet.name} gây **${damage}** sát thương lên ${defPet.name}!`;
                    if (effectiveness === 1.5) result += " 🔥 **Siêu hiệu quả!**";
                    await message.channel.send(result);

                } else if (emoji === "💥") {
                    const skill = (atkPet.skills && atkPet.skills.length > 0) ? atkPet.skills[0] : null;

                    if (!skill) {
                        await message.channel.send("❌ Pet này không có kỹ năng.");
                    } else if (atkPet.energy < skill.cost) {
                        await message.channel.send("⚠️ Không đủ năng lượng.");
                    } else {
                        defPet.hp -= skill.damage;
                        atkPet.energy -= skill.cost;
                        await message.channel.send(`💥 ${atkPet.name} dùng **${skill.name}** gây **${skill.damage}** sát thương!`);
                    }

                } else if (emoji === "🏳️") {
                    await message.channel.send(`🏳️ <@${attacker.id}> đã **bỏ cuộc**!`);
                    return message.channel.send(`🏆 Chiến thắng thuộc về <@${defender.id}>!`);

                } else {
                    await message.channel.send("⏭️ Bỏ lượt.");
                }
            } catch {
                await message.channel.send("⏰ Không chọn hành động, tự động bỏ lượt.");
            }

            atkPet.energy = Math.min((atkPet.energy || 0) + 1, 10);
            current = 1 - current;
            await new Promise(r => setTimeout(r, 1000));
        }

        const winner = team1.some(p => p.hp > 0) ? user1 : user2;
        await message.channel.send(`🏆 Chiến thắng thuộc về <@${winner.id}>!`);
    }
};