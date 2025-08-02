const petList = require("./petList.json");
const typeChart = require("./typeChart");

class Pet {
    constructor(data) {
        this.name = data.name;
        this.type = data.type;
        this.level = data.level || 1;
        this.exp = data.exp || 0;

        // Thêm maxHp và sử dụng nó nếu có
        this.maxHp = data.maxHp || data.hp || 100;
        this.hp = data.hp !== undefined ? data.hp : this.maxHp;

        this.attack = data.attack || 10;
        this.defense = data.defense || 5;
        this.agility = data.agility || 5;
        this.accuracy = data.accuracy || 5;
        this.energy = data.energy || 0;
        this.skills = data.skills || [];

        this.evolves_to = data.evolves_to;
        this.evolve_level = data.evolve_level || 0;
    }


    getExpToLevelUp() {
        return 50 + this.level * 20;
    }

    train() {
        const success = Math.random() < 0.75; // 75% thành công
        if (!success) return { success: false };

        const gainedExp = Math.floor(Math.random() * 6) + 10; // 10–15 EXP
        this.exp += gainedExp;

        let leveledUp = false;
        const expToLevelUp = this.getExpToLevelUp();

        if (this.exp >= expToLevelUp) {
            this.level++;
            this.exp -= expToLevelUp;
            leveledUp = true;
            this.checkEvolution();
        }

        // Tăng chỉ số ngẫu nhiên
        const stats = ["hp", "attack", "defense", "agility", "accuracy"];
        const statUps = [];
        const numStats = Math.floor(Math.random() * 2) + 1;

        for (let i = 0; i < numStats; i++) {
            const stat = stats[Math.floor(Math.random() * stats.length)];
            const gain = Math.floor(Math.random() * 3) + 1;

            this[stat] += gain;

            // Nếu tăng hp, tăng luôn maxHp tương ứng
            if (stat === "hp") {
                this.maxHp = (this.maxHp || this.hp) + gain;
            }

            statUps.push({ stat, gain });
        }

        return {
            success: true,
            exp: gainedExp,
            leveledUp,
            expToLevelUp,
            statUps,
        };
    }

    checkEvolution() {
        if (this.evolves_to && this.level >= this.evolve_level) {
            const evolvedData = petList.find(p => p.name === this.evolves_to);
            if (evolvedData) {
                const oldData = {
                    level: this.level,
                    exp: this.exp,
                    maxHp: this.maxHp || this.hp,
                    hp: this.hp,
                    energy: this.energy,
                    skills: this.skills,
                };

                // Gán pet mới và giữ lại các chỉ số cần thiết
                Object.assign(this, new Pet(evolvedData));
                Object.assign(this, oldData);
            }
        }
    }

    isEffectiveAgainst(otherType) {
        const effectiveTypes = typeChart[this.type] || [];
        return effectiveTypes.includes(otherType);
    }

    canUseSkill() {
        return this.skills.length > 0 && this.energy >= 5;
    }

    useSkill(opponent) {
        const skill = this.skills[0]; // lấy skill đầu tiên
        const damage = Math.max(1, Math.floor(skill.power + this.attack - opponent.defense));
        opponent.hp -= damage;
        this.energy = 0;
        return { damage, skillUsed: skill.name };
    }

    basicAttack(opponent) {
        let baseDamage = this.attack - opponent.defense;
        if (this.isEffectiveAgainst(opponent.type)) {
            baseDamage *= 1.5;
        }
        const damage = Math.max(1, Math.floor(baseDamage));
        opponent.hp -= damage;
        this.energy = Math.min(this.energy + 1, 5); // tăng năng lượng sau mỗi đòn đánh
        return { damage };
    }

    battle(opponent, useSkill = false) {
        if (useSkill && this.canUseSkill()) {
            return this.useSkill(opponent);
        } else {
            return this.basicAttack(opponent);
        }
    }
}

module.exports = Pet;