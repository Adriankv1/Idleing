class Game {
    constructor() {
        try {
            console.log('Initializing game...');
            this.points = 0;
            this.basePointsPerClick = 1;
            this.basePointsPerSecond = 0;
            this.prestigeLevel = 0;
            this.prestigeMultiplier = 1;
            this.prestigeCost = 1000;
            this.totalPointsEarned = 0;
            this.totalClicks = 0;
            this.achievements = [
                { id: 'points100', name: '100 Points!', desc: 'Reach 100 points.', unlocked: false, check: (g) => g.points >= 100 },
                { id: 'points1000', name: '1,000 Points!', desc: 'Reach 1,000 points.', unlocked: false, check: (g) => g.points >= 1000 },
                { id: 'points10000', name: '10,000 Points!', desc: 'Reach 10,000 points.', unlocked: false, check: (g) => g.points >= 10000 },
                { id: 'prestige1', name: 'First Prestige!', desc: 'Reach prestige level 1.', unlocked: false, check: (g) => g.prestigeLevel >= 1 },
                { id: 'prestige5', name: 'Prestige V', desc: 'Reach prestige level 5.', unlocked: false, check: (g) => g.prestigeLevel >= 5 },
                { id: 'clicks100', name: 'Clicker!', desc: 'Click 100 times.', unlocked: false, check: (g) => g.totalClicks >= 100 },
                { id: 'clicks1000', name: 'Click Machine!', desc: 'Click 1,000 times.', unlocked: false, check: (g) => g.totalClicks >= 1000 },
                { id: 'upgrade10', name: 'Upgrader!', desc: 'Reach level 10 in any upgrade.', unlocked: false, check: (g) => g.upgrades.some(u => u.level >= 10) }
            ];
            this.upgrades = [
                {
                    id: 'clickUpgrade',
                    name: 'Better Click',
                    description: 'Adds 1 point per click',
                    baseCost: 10,
                    level: 0,
                    effect: () => {
                        this.basePointsPerClick = 1 + this.upgrades[0].level;
                        console.log('Better Click upgraded. New base points per click:', this.basePointsPerClick);
                    }
                },
                {
                    id: 'autoClicker',
                    name: 'Auto Clicker',
                    description: 'Adds 1 point per second',
                    baseCost: 50,
                    level: 0,
                    effect: () => {
                        this.basePointsPerSecond = this.upgrades[1].level;
                        console.log('Auto Clicker upgraded. New base points per second:', this.basePointsPerSecond);
                    }
                },
                {
                    id: 'superClicker',
                    name: 'Super Clicker',
                    description: 'Adds 25% to all point generation',
                    baseCost: 200,
                    level: 0,
                    effect: () => {
                        console.log('Super Clicker upgraded. Level:', this.upgrades[2].level);
                    }
                }
            ];

            this.loadGame();
            this.setupEventListeners();
            this.renderUpgrades();
            this.startGameLoop();
            console.log('Game initialized successfully');
        } catch (error) {
            console.error('Error initializing game:', error);
        }
    }

    getSuperMultiplier() {
        return 1 + (this.upgrades[2].level * 0.25);
    }

    getFinalPointsPerClick() {
        return this.basePointsPerClick * this.getSuperMultiplier() * this.prestigeMultiplier;
    }

    getFinalPointsPerSecond() {
        return this.basePointsPerSecond * this.getSuperMultiplier() * this.prestigeMultiplier;
    }

    loadGame() {
        try {
            console.log('Loading game state...');
            const savedGame = localStorage.getItem('idleGame');
            if (savedGame) {
                const { points, upgrades, prestigeLevel, prestigeMultiplier, prestigeCost, totalPointsEarned, totalClicks, achievements } = JSON.parse(savedGame);
                this.points = points;
                this.upgrades = upgrades;
                this.prestigeLevel = prestigeLevel;
                this.prestigeMultiplier = prestigeMultiplier;
                this.prestigeCost = prestigeCost || 1000;
                this.totalPointsEarned = totalPointsEarned;
                this.totalClicks = totalClicks || 0;
                if (achievements) this.achievements = achievements;
                this.basePointsPerClick = 1 + this.upgrades[0].level;
                this.basePointsPerSecond = this.upgrades[1].level;
                console.log('Game state loaded successfully');
            } else {
                console.log('No saved game found, starting fresh');
            }
            this.updateDisplay();
        } catch (error) {
            console.error('Error loading game:', error);
        }
    }

    saveGame() {
        try {
            const gameState = {
                points: this.points,
                upgrades: this.upgrades,
                prestigeLevel: this.prestigeLevel,
                prestigeMultiplier: this.prestigeMultiplier,
                prestigeCost: this.prestigeCost,
                totalPointsEarned: this.totalPointsEarned,
                totalClicks: this.totalClicks,
                achievements: this.achievements
            };
            localStorage.setItem('idleGame', JSON.stringify(gameState));
            console.log('Game state saved successfully');
        } catch (error) {
            console.error('Error saving game:', error);
        }
    }

    setupEventListeners() {
        try {
            console.log('Setting up event listeners...');
            const clickButton = document.getElementById('clickButton');
            const prestigeButton = document.getElementById('prestigeButton');
            const resetButton = document.getElementById('resetButton');

            if (!clickButton || !prestigeButton || !resetButton) {
                throw new Error('Required buttons not found in DOM');
            }

            clickButton.addEventListener('click', () => this.click());
            prestigeButton.addEventListener('click', () => this.prestige());
            resetButton.addEventListener('click', () => this.hardReset());
            console.log('Event listeners set up successfully');
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    click() {
        try {
            const pointsGained = this.getFinalPointsPerClick();
            this.points += pointsGained;
            this.totalPointsEarned += pointsGained;
            this.totalClicks += 1;
            this.checkAchievements();
            this.updateDisplay();
            this.saveGame();
        } catch (error) {
            console.error('Error in click handler:', error);
        }
    }

    startGameLoop() {
        try {
            console.log('Starting game loop...');
            setInterval(() => {
                const pointsGained = this.getFinalPointsPerSecond();
                if (this.basePointsPerSecond > 0) {
                    this.points += pointsGained;
                    this.totalPointsEarned += pointsGained;
                    console.log(`Auto Clicker: Awarded ${pointsGained} points (base: ${this.basePointsPerSecond}, final: ${this.getFinalPointsPerSecond().toFixed(2)})`);
                }
                this.updateDisplay();
                this.saveGame();
            }, 1000);
            console.log('Game loop started successfully');
        } catch (error) {
            console.error('Error starting game loop:', error);
        }
    }

    updateDisplay() {
        try {
            const pointsElement = document.getElementById('points');
            const prestigeLevelElement = document.getElementById('prestigeLevel');
            const prestigeMultiplierElement = document.getElementById('prestigeMultiplier');
            const prestigeButton = document.getElementById('prestigeButton');

            if (!pointsElement || !prestigeLevelElement || !prestigeMultiplierElement || !prestigeButton) {
                throw new Error('Required display elements not found in DOM');
            }

            pointsElement.textContent = Math.floor(this.points);
            prestigeLevelElement.textContent = this.prestigeLevel;
            prestigeMultiplierElement.textContent = this.prestigeMultiplier.toFixed(1);
            prestigeButton.disabled = this.points < this.prestigeCost;
            prestigeButton.textContent = `Prestige (${this.prestigeCost} points)`;
            this.renderUpgrades();
            this.renderAchievements();
        } catch (error) {
            console.error('Error updating display:', error);
        }
    }

    getUpgradeCost(upgrade) {
        return Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level));
    }

    canAffordUpgrade(upgrade) {
        return this.points >= this.getUpgradeCost(upgrade);
    }

    purchaseUpgrade(upgrade) {
        try {
            const cost = this.getUpgradeCost(upgrade);
            if (this.points >= cost) {
                this.points -= cost;
                upgrade.level++;
                upgrade.effect();
                this.checkAchievements();
                this.updateDisplay();
                this.saveGame();
                console.log('Upgrade purchased:', upgrade.name, 'Level:', upgrade.level);
            }
        } catch (error) {
            console.error('Error purchasing upgrade:', error);
        }
    }

    prestige() {
        try {
            if (this.points >= this.prestigeCost) {
                this.prestigeLevel++;
                this.prestigeMultiplier = 1 + (this.prestigeLevel * 0.5);
                this.points -= this.prestigeCost;
                this.prestigeCost = Math.floor(this.prestigeCost * 2);
                this.upgrades.forEach(upgrade => {
                    upgrade.level = 0;
                });
                this.basePointsPerClick = 1;
                this.basePointsPerSecond = 0;
                this.checkAchievements();
                this.updateDisplay();
                this.saveGame();
                console.log('Prestige successful');
            }
        } catch (error) {
            console.error('Error in prestige:', error);
        }
    }

    hardReset() {
        try {
            if (confirm('Are you sure you want to reset the game? This will delete all progress, including prestige levels.')) {
                console.log('Performing hard reset...');
                this.points = 0;
                this.basePointsPerClick = 1;
                this.basePointsPerSecond = 0;
                this.prestigeLevel = 0;
                this.prestigeMultiplier = 1;
                this.prestigeCost = 1000;
                this.totalPointsEarned = 0;
                this.upgrades.forEach(upgrade => {
                    upgrade.level = 0;
                });
                localStorage.removeItem('idleGame');
                this.updateDisplay();
                console.log('Hard reset completed successfully');
            }
        } catch (error) {
            console.error('Error in hard reset:', error);
        }
    }

    renderUpgrades() {
        try {
            const container = document.getElementById('upgradesContainer');
            if (!container) {
                throw new Error('Upgrades container not found in DOM');
            }

            container.innerHTML = '';

            this.upgrades.forEach((upgrade, idx) => {
                const cost = this.getUpgradeCost(upgrade);
                const canAfford = this.canAffordUpgrade(upgrade);

                // Dynamic descriptions
                let description = '';
                if (upgrade.id === 'clickUpgrade') {
                    description = `Adds 1 point per click (base: ${this.basePointsPerClick}, final: ${this.getFinalPointsPerClick().toFixed(2)} per click)`;
                } else if (upgrade.id === 'autoClicker') {
                    description = `Adds 1 point per second (base: ${this.basePointsPerSecond}, final: ${this.getFinalPointsPerSecond().toFixed(2)} per second)`;
                } else if (upgrade.id === 'superClicker') {
                    const percent = (upgrade.level * 25);
                    description = `Adds 25% to all point generation per level (currently: +${percent}% bonus)`;
                } else {
                    description = upgrade.description;
                }

                const upgradeElement = document.createElement('div');
                upgradeElement.className = 'upgrade-item';
                upgradeElement.innerHTML = `
                    <div class="upgrade-info">
                        <div class="upgrade-name">${upgrade.name} (Level ${upgrade.level})</div>
                        <div class="upgrade-description">${description}</div>
                    </div>
                    <button ${!canAfford ? 'disabled' : ''}>
                        Buy (${cost} points)
                    </button>
                `;

                const button = upgradeElement.querySelector('button');
                button.addEventListener('click', () => this.purchaseUpgrade(upgrade));

                container.appendChild(upgradeElement);
            });
        } catch (error) {
            console.error('Error rendering upgrades:', error);
        }
    }

    checkAchievements() {
        let unlockedAny = false;
        this.achievements.forEach(ach => {
            if (!ach.unlocked && ach.check(this)) {
                ach.unlocked = true;
                unlockedAny = true;
                console.log(`Achievement unlocked: ${ach.name}`);
            }
        });
        if (unlockedAny) this.renderAchievements();
    }

    renderAchievements() {
        const list = document.getElementById('achievementsList');
        if (!list) return;
        list.innerHTML = '';
        this.achievements.forEach(ach => {
            const li = document.createElement('li');
            li.textContent = `${ach.name} - ${ach.desc}`;
            li.style.color = ach.unlocked ? '#34a853' : '#888';
            li.style.fontWeight = ach.unlocked ? 'bold' : 'normal';
            list.appendChild(li);
        });
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    try {
        console.log('Window loaded, starting game...');
        new Game();
    } catch (error) {
        console.error('Error starting game:', error);
    }
}); 