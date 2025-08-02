const fs = require("fs");
const Pet = require("../../petSystem/Pet");
const petList = require("../../petSystem/petList.json");
const typeAdvantages = require("../../petSystem/typeChart");
const playerDB = "./data/players.json";

function getTypeMultiplier(attackerType, defenderType) {
    const effective = typeAdvantages[attackerType] || [];
    const defenderEffective = typeAdvantages[defenderType] || [];

    if (effective.includes(defenderType)) return 2;
    if (defenderEffective.includes(attackerType)) return 0.5;
    return 1;
}


function calculateDamage(attacker, defender) {
    const base = attacker.attack - defender.defense / 2;
    const multiplier = getTypeMultiplier(attacker.type, defender.type);
    return Math.max(1, Math.floor(base * multiplier));
}

function generateWildPet() {
    const wildList = petList.filter(p => p.evolves_to && !p.evolves_from); // Có thể tiến hoá, không phải tiến hoá từ
    const data = wildList[Math.floor(Math.random() * wildList.length)];

    const level = Math.floor(Math.random() * 150) + 1;

    const wildPet = new Pet(data);
    wildPet.level = level;
    wildPet.exp = 0;
    wildPet.energy = 0;
    wildPet.hp = wildPet.hp + level * 5;
    wildPet.attack = wildPet.attack + level * 2;
    wildPet.defense = wildPet.defense + level * 2;
    wildPet.maxHp = wildPet.hp;

    return wildPet;
}

module.exports = {
    name: "h",
    aliases: ["hunt"],
    run: async(client, message, args) => {
        const userId = message.author.id;
        const db = JSON.parse(fs.readFileSync(playerDB, "utf8"));

        if (!db[userId] || !db[userId].team || db[userId].team.length === 0) {
            return message.reply("❌ Bạn chưa có đội hình để đi săn!");
        }

        // Gán team và khôi phục máu trước trận
        const playerTeam = db[userId].team.map(petData => {
            const pet = Object.assign(new Pet({}), petData);
            pet.hp = pet.maxHp || pet.hp;
            return pet;
        });

        const wildPet = generateWildPet();

        let round = 0;
        const maxRounds = 20;
        let log = `🌿 Bạn gặp pet hoang dã **${wildPet.name}** cấp ${wildPet.level} hệ **${wildPet.type}**!\n`;

        wildPet.hp = wildPet.maxHp;

        while (wildPet.hp > 0 && playerTeam.some(p => p.hp > 0) && round < maxRounds) {
            for (const pet of playerTeam) {
                if (pet.hp <= 0) continue;
                const dmg = calculateDamage(pet, wildPet);
                wildPet.hp -= dmg;
                wildPet.hp = Math.max(0, wildPet.hp);
                log += `\n⚔️ **${pet.name}** gây ${dmg} sát thương cho **${wildPet.name}** (Còn ${wildPet.hp} HP)`;
                if (wildPet.hp <= 0) break;
            }

            if (wildPet.hp <= 0) break;

            // Wild pet phản công
            const target = playerTeam.find(p => p.hp > 0);
            if (target) {
                const dmg = calculateDamage(wildPet, target);
                target.hp -= dmg;
                target.hp = Math.max(0, target.hp);
                log += `\n💥 **${wildPet.name}** phản công **${target.name}** với ${dmg} sát thương (Còn ${target.hp} HP)`;
            }

            round++;
        }

        if (wildPet.hp <= 0) {
            log += `\n\n✅ Bạn đã đánh bại **${wildPet.name}**!`;

            // Cơ hội bắt dựa vào HP
            const catchRate = 0.3 + ((wildPet.maxHp - 0) / wildPet.maxHp) * 0.4; // 30-70%
            const caught = Math.random() < catchRate;

            if (caught) {
                db[userId].pets.push(wildPet);
                log += `\n🎉 Bạn đã **thu phục thành công** pet hoang dã **${wildPet.name}**!`;
            } else {
                log += `\n😢 Bạn không thu phục được **${wildPet.name}**, nó đã chạy mất.`;
            }


        } else {
            log += `\n❌ Bạn bị **${wildPet.name}** đánh bại sau ${round} lượt chiến đấu.`;
        }

        // Lưu lại HP mới của pet trong team
        db[userId].team = playerTeam;

        fs.writeFileSync(playerDB, JSON.stringify(db, null, 2));
        message.reply(log);
    }
};