const fs = require("fs");
const path = require("path");
const Pet = require("../../petSystem/Pet");

const petListPath = path.join(__dirname, "../../petSystem/petList.json");
const playerDB = "./data/players.json";

function calculateDamage(attacker, defender) {
    let base = attacker.attack - defender.defense;
    if (attacker.isEffectiveAgainst(defender.type)) base *= 1.5;
    return base > 0 ? Math.floor(base) : 1;
}

module.exports = {
    name: "pvp",
    aliases: [],
    run: async(client, message, args) => {
        const opponentUser = message.mentions.users.first();
        if (!opponentUser || opponentUser.bot) return message.reply("❌ Bạn phải tag 1 người chơi khác!");

        const db = JSON.parse(fs.readFileSync(playerDB, "utf8"));
        const user1 = message.author;
        const user2 = opponentUser;

        if (!db[user1.id] || !db[user2.id]) return message.reply("❌ Cả hai người chơi phải có pet!");

        const pet1 = Object.assign(new Pet({}), db[user1.id].pet);
        const pet2 = Object.assign(new Pet({}), db[user2.id].pet);

        pet1.hp = 100;
        pet2.hp = 100;
        pet1.energy = 0;
        pet2.energy = 0;

        const players = [
            { id: user1.id, user: user1, pet: pet1 },
            { id: user2.id, user: user2, pet: pet2 }
        ];

        message.channel.send(`⚔️ Trận đấu bắt đầu giữa **${pet1.name}** (<@${user1.id}>) và **${pet2.name}** (<@${user2.id}>)!`);

        let current = 0;
        while (pet1.hp > 0 && pet2.hp > 0) {
            const player = players[current];
            const opponent = players[1 - current];

            const actionMsg = await message.channel.send(
                `🎮 Đến lượt <@${player.id}>!
❤️ HP: ${player.pet.hp} | 🔋 Năng lượng: ${player.pet.energy}
🗡️ = Đánh thường | 💥 = Skill | ❌ = Bỏ lượt`
            );

            await actionMsg.react("🗡️");
            await actionMsg.react("💥");
            await actionMsg.react("❌");

            const filter = (reaction, user) => ["🗡️", "💥", "❌"].includes(reaction.emoji.name) && user.id === player.id;

            let collectedReaction;
            try {
                const collected = await actionMsg.awaitReactions({
                    filter,
                    max: 1,
                    time: 20000,
                    errors: ["time"],
                });
                collectedReaction = collected.first().emoji.name;
            } catch (e) {
                collectedReaction = "❌";
            }

            if (collectedReaction === "🗡️") {
                const dmg = calculateDamage(player.pet, opponent.pet);
                opponent.pet.hp -= dmg;
                message.channel.send(`🗡️ <@${player.id}> gây ${dmg} sát thương lên ${opponent.pet.name}!`);
            } else if (collectedReaction === "💥") {
                const skill = player.pet.skills[0];
                if (!skill) {
                    message.channel.send("❌ Pet không có kỹ năng.");
                } else if (player.pet.energy < skill.cost) {
                    message.channel.send("⚠️ Không đủ năng lượng!");
                } else {
                    opponent.pet.hp -= skill.damage;
                    player.pet.energy -= skill.cost;
                    message.channel.send(`💥 <@${player.id}> dùng kỹ năng **${skill.name}** gây ${skill.damage} sát thương!`);
                }
            } else {
                message.channel.send(`😐 <@${player.id}> bỏ lượt.`);
            }

            // Tăng năng lượng mỗi lượt
            player.pet.energy = Math.min(player.pet.energy + 1, 10);

            // Kiểm tra nếu đối thủ chết
            if (opponent.pet.hp <= 0) {
                message.channel.send(`🏆 <@${player.id}> đã chiến thắng!`);
                break;
            }

            current = 1 - current;
            await new Promise(r => setTimeout(r, 1500));
        }

        // Lưu lại trạng thái nếu cần
        db[user1.id].pet = pet1;
        db[user2.id].pet = pet2;
        fs.writeFileSync(playerDB, JSON.stringify(db, null, 2));
    }
};