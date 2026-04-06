const TOTAL_POKEMON = 251;
const SHINY_ODDS = 50;
const ENCOUNTER_DELAY = 3000;

const rarityMap = {
    common: [
        1,2,3,4,5,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,29,30,32,33,35,36,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,102,104,106,107,108,109,110,111,112,114,115,116,117,118,119,120,121,123,129,130,133,
        152,153,155,156,158,159,161,162,163,164,165,166,167,168,170,171,172,173,174,175,177,178,179,180,183,184,187,188,189,190,191,192,193,194,195,198,200,202,203,204,205,206,207,209,210,211,213,214,215,216,217,218,219,220,221,222,223,224,225,227,228,231,232,234,235,236,238,239,240,241,246,247
    ],
    uncommon: [
        6,7,8,9,27,28,31,34,37,38,58,59,101,103,105,113,122,124,125,126,127,128,131,132,134,135,136,137,138,139,140,141,142,143,
        154,157,160,169,176,181,182,185,186,196,197,199,201,208,212,229,230,233,237,242,248,249,250
    ],
    rare: [
        147,148,149
    ],
    legendary: [
        144,145,146,150,151,
        243,244,245,249,250,251
    ]
};

let currentGenerationFilter = 'gen1';

function resetAllTimers() {
    if (encounterTimer) {
        clearTimeout(encounterTimer);
        encounterTimer = null;
    }
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    if (catchTimerInterval) {
        clearInterval(catchTimerInterval);
        catchTimerInterval = null;
    }
    console.log('All timers reset');
}

function getPokemonRarity(id) {
    if (rarityMap.legendary.includes(id)) return { name: 'legendary', escapeChance: 0.9 };
    if (rarityMap.rare.includes(id)) return { name: 'rare', escapeChance: 0.7 };
    if (rarityMap.uncommon.includes(id)) return { name: 'uncommon', escapeChance: 0.5 };
    return { name: 'common', escapeChance: 0.3 };
}

const pokemonNames = [
    "Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard",
    "Squirtle", "Wartortle", "Blastoise", "Caterpie", "Metapod", "Butterfree",
    "Weedle", "Kakuna", "Beedrill", "Pidgey", "Pidgeotto", "Pidgeot",
    "Rattata", "Raticate", "Spearow", "Fearow", "Ekans", "Arbok",
    "Pikachu", "Raichu", "Sandshrew", "Sandslash", "Nidoran♀", "Nidorina",
    "Nidoqueen", "Nidoran♂", "Nidorino", "Nidoking", "Clefairy", "Clefable",
    "Vulpix", "Ninetales", "Jigglypuff", "Wigglytuff", "Zubat", "Golbat",
    "Oddish", "Gloom", "Vileplume", "Paras", "Parasect", "Venonat",
    "Venomoth", "Diglett", "Dugtrio", "Meowth", "Persian", "Psyduck",
    "Golduck", "Mankey", "Primeape", "Growlithe", "Arcanine", "Poliwag",
    "Poliwhirl", "Poliwrath", "Abra", "Kadabra", "Alakazam", "Machop",
    "Machoke", "Machamp", "Bellsprout", "Weepinbell", "Victreebel", "Tentacool",
    "Tentacruel", "Geodude", "Graveler", "Golem", "Ponyta", "Rapidash",
    "Slowpoke", "Slowbro", "Magnemite", "Magneton", "Farfetch'd", "Doduo",
    "Dodrio", "Seel", "Dewgong", "Grimer", "Muk", "Shellder", "Cloyster",
    "Gastly", "Haunter", "Gengar", "Onix", "Drowzee", "Hypno", "Krabby",
    "Kingler", "Voltorb", "Electrode", "Exeggcute", "Exeggutor", "Cubone",
    "Marowak", "Hitmonlee", "Hitmonchan", "Lickitung", "Koffing", "Weezing",
    "Rhyhorn", "Rhydon", "Chansey", "Tangela", "Kangaskhan", "Horsea",
    "Seadra", "Goldeen", "Seaking", "Staryu", "Starmie", "Mr. Mime",
    "Scyther", "Jynx", "Electabuzz", "Magmar", "Pinsir", "Tauros",
    "Magikarp", "Gyarados", "Lapras", "Ditto", "Eevee", "Vaporeon",
    "Jolteon", "Flareon", "Porygon", "Omanyte", "Omastar", "Kabuto",
    "Kabutops", "Aerodactyl", "Snorlax", "Articuno", "Zapdos", "Moltres",
    "Dratini", "Dragonair", "Dragonite", "Mewtwo", "Mew",
    
    "Chikorita", "Bayleef", "Meganium", "Cyndaquil", "Quilava", "Typhlosion",
    "Totodile", "Croconaw", "Feraligatr", "Sentret", "Furret", "Hoothoot",
    "Noctowl", "Ledyba", "Ledian", "Spinarak", "Ariados", "Crobat",
    "Chinchou", "Lanturn", "Pichu", "Cleffa", "Igglybuff", "Togepi",
    "Togetic", "Natu", "Xatu", "Mareep", "Flaaffy", "Ampharos",
    "Bellossom", "Marill", "Azumarill", "Sudowoodo", "Politoed", "Hoppip",
    "Skiploom", "Jumpluff", "Aipom", "Sunkern", "Sunflora", "Yanma",
    "Wooper", "Quagsire", "Espeon", "Umbreon", "Murkrow", "Slowking",
    "Misdreavus", "Unown", "Wobbuffet", "Girafarig", "Pineco", "Forretress",
    "Dunsparce", "Gligar", "Steelix", "Snubbull", "Granbull", "Qwilfish",
    "Scizor", "Shuckle", "Heracross", "Sneasel", "Teddiursa", "Ursaring",
    "Slugma", "Magcargo", "Swinub", "Piloswine", "Corsola", "Remoraid",
    "Octillery", "Delibird", "Mantine", "Skarmory", "Houndour", "Houndoom",
    "Kingdra", "Phanpy", "Donphan", "Porygon2", "Stantler", "Smeargle",
    "Tyrogue", "Hitmontop", "Smoochum", "Elekid", "Magby", "Miltank",
    "Blissey", "Raikou", "Entei", "Suicune", "Larvitar", "Pupitar",
    "Tyranitar", "Lugia", "Ho-Oh", "Celebi"
];

function getPokemonName(id) {
    return pokemonNames[id - 1];
}

let caughtPokemon = [];
let currentPokemon = null;
let caughtCount = 0;
let shinyCount = 0;
let uniqueSet = new Set();

let encounterTimer = null;
let countdownInterval = null;
let isWaitingForEncounter = false;
let waitingTimeRemaining = 0;
let catchTimerInterval = null;
let currentCatchTimeLeft = 7;
let canCatch = true;

let currentSpeed = 80;

let achievements = {
    bugCatcher: false,
    fisherman: false,
    shinyHunter: false,
    master: false,
    rookie: false,
    collector: false,
    enthusiast: false,
    legendCatcher: false,
    fossilHunter: false,
    eeveelutionMaster: false,
    starterMaster: false,
    pseudoLegend: false,
    electricType: false,
    fireType: false,
    waterType: false,
    grassType: false,
    psychicType: false,
    dragonTamer: false,
    ghostBuster: false,
    steelWorker: false,
    darkType: false,
    fightingType: false,
    flyingType: false,
    poisonType: false,
    groundType: false,
    rockType: false,
    iceType: false,
    bugMaster: false,
    normalType: false,
    gen1Master: false,
    gen2Master: false,
    livingDex: false,
    shinyCollector: false
};

const galleryItems = [
    { id: 1, name: "Venusaur!", milestone: 10, gifUrl: "venusaur.gif", milestoneText: "Catch 10 Pokémon" },
    { id: 2, name: "Dragonite!", milestone: 25, gifUrl: "dragonite.gif", milestoneText: "Catch 25 Pokémon" },
    { id: 3, name: "Lugia!", milestone: 50, gifUrl: "lugia.gif", milestoneText: "Catch 50 Pokémon" },
    { id: 4, name: "Espeon!", milestone: 75, gifUrl: "espeon.gif", milestoneText: "Catch 75 Pokémon" },
    { id: 5, name: "Sylveon!", milestone: 100, gifUrl: "sylveon.gif", milestoneText: "Catch 100 Pokémon" },
    { id: 6, name: "Umbreon!", milestone: 150, gifUrl: "umbreon.gif", milestoneText: "Catch 150 Pokémon" },
    { id: 7, name: "M.Latias!", milestone: 200, gifUrl: "latias.gif", milestoneText: "Catch 200 Pokémon" },
    { id: 8, name: "M.Gengar!", milestone: 5, gifUrl: "gengar.gif", milestoneText: "Catch 5 Shinies", isShinyMilestone: true },
    { id: 9, name: "M.Dragonite!", milestone: 251, gifUrl: "mdragonite.gif", milestoneText: "Complete Pokédex!" }
];

let unlockedGallery = [];
function playCry(id) {
    try {
        const audio = new Audio(`https://play.pokemonshowdown.com/audio/cries/${id}.mp3`);
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Audio play failed'));
    } catch(e) {}
}

// BATTLE SYSTEM - CLEAN UI
let battleActive = false;
let selectedBattlePokemon = null;
let battleOpponent = null;

function openBattle() {
    renderBattleUI();
    document.getElementById("battleModal").style.display = "flex";
}

function closeBattle() {
    document.getElementById("battleModal").style.display = "none";
    battleActive = false;
    selectedBattlePokemon = null;
    battleOpponent = null;
    
    // Re-enable any disabled elements for next battle
    const select = document.getElementById("battlePokemonSelect");
    const startBtn = document.getElementById("startBattleBtn");
    if (select) select.disabled = false;
    if (startBtn) startBtn.disabled = false;
}

function renderBattleUI() {
    const battleContent = document.getElementById("battleContent");
    if (!battleContent) return;
    
    const caughtPokemonList = caughtPokemon;
    
    if (caughtPokemonList.length === 0) {
        battleContent.innerHTML = `
            <div class="battle-empty">
                <div class="battle-empty-icon">😢</div>
                <div>You need at least one caught Pokémon to battle!</div>
                <button class="battle-close-btn" onclick="closeBattle()">Close</button>
            </div>
        `;
        return;
    }
    
    const uncaughtIds = [];
    for (let i = 1; i <= TOTAL_POKEMON; i++) {
        if (!uniqueSet.has(i)) uncaughtIds.push(i);
    }
    
    if (uncaughtIds.length === 0) {
        battleContent.innerHTML = `
            <div class="battle-empty">
                <div class="battle-empty-icon">🏆</div>
                <div>You've caught all Pokémon! You're the Champion!</div>
                <button class="battle-close-btn" onclick="closeBattle()">Close</button>
            </div>
        `;
        return;
    }
    
    const firstPokemon = caughtPokemonList[0];
    const firstIsShiny = firstPokemon.shiny;
    const firstSpriteType = firstIsShiny ? 'shiny' : 'normal';
    
    battleContent.innerHTML = `
        <div class="battle-two-columns">
            <!-- Left Column: Selection -->
            <div class="battle-left-column">
                <div class="battle-selector-title">🔥 CHOOSE YOUR FIGHTER</div>
                <select id="battlePokemonSelect" class="battle-pokemon-dropdown">
                    ${caughtPokemonList.map(p => `<option value="${p.id}" data-shiny="${p.shiny}">${p.shiny ? '✨ ' : ''}${getPokemonName(p.id)}${p.shiny ? ' ✨' : ''}</option>`).join('')}
                </select>
                <div class="battle-pokemon-preview">
                    <img id="yourPokemonPreview" src="https://img.pokemondb.net/sprites/black-white/anim/${firstSpriteType}/${firstPokemon.id}.gif">
                    <div class="battle-pokemon-preview-name" id="yourPokemonName">${firstPokemon.shiny ? '✨ ' : ''}${getPokemonName(firstPokemon.id)}${firstPokemon.shiny ? ' ✨' : ''}</div>
                </div>
                <div class="battle-warning-box">
                    <div class="warning-text">⚠️ HIGH RISK ⚠️</div>
                    <div class="warning-text" style="font-size: 0.6rem;">WIN = Catch opponent | LOSE = Lose your Pokémon</div>
                </div>
            </div>
            
            <!-- Right Column: Battle Arena -->
            <div class="battle-right-column">
                <div class="battle-arena-header">⚔️ BATTLE ARENA ⚔️</div>
                <div id="battleArena">
                    <div class="battle-fighters-container">
                        <div class="battle-fighter-card">
                            <div class="battle-fighter-label">YOU</div>
                            <img id="rightFighterImg" src="https://img.pokemondb.net/sprites/black-white/anim/${firstSpriteType}/${firstPokemon.id}.gif" 
                                 onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${firstIsShiny ? 'shiny/' : ''}${firstPokemon.id}.gif'">
                            <div class="battle-fighter-card-name" id="rightFighterName">${firstPokemon.shiny ? '✨ ' : ''}${getPokemonName(firstPokemon.id)}${firstPokemon.shiny ? ' ✨' : ''}</div>
                        </div>
                        <div class="battle-vs">VS</div>
                        <div class="battle-fighter-card">
                            <div class="battle-fighter-label">WILD</div>
                            <div class="wild-placeholder">❓</div>
                            <div class="battle-fighter-card-name">???</div>
                        </div>
                    </div>
                </div>
                <button id="startBattleBtn" class="start-battle-btn">⚔️ START BATTLE ⚔️</button>
            </div>
        </div>
    `;
    
    // Update preview when dropdown changes
    const select = document.getElementById("battlePokemonSelect");
    if (select) {
        select.onchange = () => {
            const id = parseInt(select.value);
            const selectedOption = select.options[select.selectedIndex];
            const isShiny = selectedOption.getAttribute('data-shiny') === 'true';
            const spriteType = isShiny ? 'shiny' : 'normal';
            const pokemonName = getPokemonName(id);
            const displayName = isShiny ? `✨ ${pokemonName} ✨` : pokemonName;
            
            // Update left column preview
            const previewImg = document.getElementById("yourPokemonPreview");
            const previewName = document.getElementById("yourPokemonName");
            if (previewImg) {
                previewImg.src = `https://img.pokemondb.net/sprites/black-white/anim/${spriteType}/${id}.gif`;
                previewImg.onerror = () => {
                    previewImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${isShiny ? 'shiny/' : ''}${id}.gif`;
                };
            }
            if (previewName) previewName.innerText = displayName;
            
            // Update right column battle arena preview
            const rightFighterImg = document.getElementById("rightFighterImg");
            const rightFighterName = document.getElementById("rightFighterName");
            if (rightFighterImg) {
                rightFighterImg.src = `https://img.pokemondb.net/sprites/black-white/anim/${spriteType}/${id}.gif`;
                rightFighterImg.onerror = () => {
                    rightFighterImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${isShiny ? 'shiny/' : ''}${id}.gif`;
                };
            }
            if (rightFighterName) rightFighterName.innerText = displayName;
        };
        
        // Trigger onchange to sync everything with default selection
        const event = new Event('change');
        select.dispatchEvent(event);
    }
    
    const startBtn = document.getElementById("startBattleBtn");
    if (startBtn) {
        startBtn.onclick = () => startBattle();
    }
}

function startBattle() {
    const select = document.getElementById("battlePokemonSelect");
    if (!select) return;
    
    // Disable the dropdown and start button
    select.disabled = true;
    const startBtn = document.getElementById("startBattleBtn");
    if (startBtn) startBtn.disabled = true;
    
    const selectedId = parseInt(select.value);
    const selectedOption = select.options[select.selectedIndex];
    const isShiny = selectedOption.getAttribute('data-shiny') === 'true';
    
    // Get the selected Pokémon
    selectedBattlePokemon = caughtPokemon.find(p => p.id === selectedId && p.shiny === isShiny);
    
    if (!selectedBattlePokemon) {
        showNotification("Select a valid Pokémon!", false);
        select.disabled = false;
        if (startBtn) startBtn.disabled = false;
        return;
    }
    
    // Find random uncaught Pokémon
    const uncaughtIds = [];
    for (let i = 1; i <= TOTAL_POKEMON; i++) {
        if (!uniqueSet.has(i)) uncaughtIds.push(i);
    }
    
    if (uncaughtIds.length === 0) {
        showNotification("You've caught all Pokémon!", false);
        select.disabled = false;
        if (startBtn) startBtn.disabled = false;
        return;
    }
    
    const opponentId = uncaughtIds[Math.floor(Math.random() * uncaughtIds.length)];
    battleOpponent = { id: opponentId, name: getPokemonName(opponentId) };
    
    // Get sprite URLs
    const yourSpriteType = isShiny ? 'shiny' : 'normal';
    const yourSpriteUrl = `https://img.pokemondb.net/sprites/black-white/anim/${yourSpriteType}/${selectedId}.gif`;
    const yourFallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${isShiny ? 'shiny/' : ''}${selectedId}.gif`;
    
    const opponentSpriteUrl = `https://img.pokemondb.net/sprites/black-white/anim/normal/${opponentId}.gif`;
    const opponentFallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${opponentId}.gif`;
    
    // Update the existing battle arena content
    const battleArena = document.getElementById("battleArena");
    if (battleArena) {
        battleArena.innerHTML = `
            <div class="battle-fighters-container">
                <div class="battle-fighter-card">
                    <div class="battle-fighter-label">YOU</div>
                    <img id="battleYourImg" src="${yourSpriteUrl}" onerror="this.src='${yourFallbackUrl}'">
                    <div class="battle-fighter-card-name">${isShiny ? '✨ ' : ''}${getPokemonName(selectedId)}${isShiny ? ' ✨' : ''}</div>
                </div>
                <div class="battle-vs">VS</div>
                <div class="battle-fighter-card">
                    <div class="battle-fighter-label">WILD</div>
                    <img id="battleOpponentImg" src="${opponentSpriteUrl}" onerror="this.src='${opponentFallbackUrl}'">
                    <div class="battle-fighter-card-name">${battleOpponent.name}</div>
                    <div style="font-size: 0.6rem; margin-top: 4px; opacity: 0.8;">WIN TO CATCH!</div>
                </div>
            </div>
        `;
    }
    
    // Show RPS choices
    const battleContent = document.getElementById("battleContent");
    battleContent.innerHTML += `
        <div class="battle-choices">
            <button class="battle-choice-btn" data-choice="rock">✊</button>
            <button class="battle-choice-btn" data-choice="paper">✋</button>
            <button class="battle-choice-btn" data-choice="scissors">✌️</button>
        </div>
        <div id="battleResult" class="battle-result"></div>
    `;
    
    document.querySelectorAll('[data-choice]').forEach(btn => {
        btn.onclick = () => resolveBattle(btn.dataset.choice);
    });
}

function resolveBattle(playerChoice) {
    const choices = ['rock', 'paper', 'scissors'];
    const aiChoice = choices[Math.floor(Math.random() * 3)];
    
    const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
    const names = { rock: 'Rock', paper: 'Paper', scissors: 'Scissors' };
    
    let win = null;
    let resultMessage = '';
    let resultDetail = '';
    
    // Determine winner
    if (playerChoice === aiChoice) {
        win = null;
        resultMessage = "It's a TIE!";
        resultDetail = `Both chose ${names[playerChoice]}. No change.`;
    } else if (
        (playerChoice === 'rock' && aiChoice === 'scissors') ||
        (playerChoice === 'paper' && aiChoice === 'rock') ||
        (playerChoice === 'scissors' && aiChoice === 'paper')
    ) {
        win = true;
        resultMessage = "VICTORY!";
        resultDetail = `${names[playerChoice]} beats ${names[aiChoice]}!`;
    } else {
        win = false;
        resultMessage = "DEFEAT!";
        resultDetail = `${names[aiChoice]} beats ${names[playerChoice]}!`;
    }
    
    // Process win/loss result
    let additionalMessage = '';
    let resultType = '';
    
    if (win === true) {
        // WIN - Catch opponent
        caughtPokemon.push({ id: battleOpponent.id, shiny: false });
        caughtCount++;
        if (!uniqueSet.has(battleOpponent.id)) uniqueSet.add(battleOpponent.id);
        
        updateStatsUI();
        updateAchievements();
        saveProgress();
        
        additionalMessage = `✨ You caught ${battleOpponent.name}! ✨`;
        resultType = 'win';
        
    } else if (win === false) {
        // LOSE - Remove chosen Pokémon
        const index = caughtPokemon.findIndex(p => p.id === selectedBattlePokemon.id && p.shiny === selectedBattlePokemon.shiny);
        if (index !== -1) {
            const lostName = getPokemonName(selectedBattlePokemon.id);
            caughtPokemon.splice(index, 1);
            caughtCount--;
            
            const stillHasPokemon = caughtPokemon.some(p => p.id === selectedBattlePokemon.id);
            if (!stillHasPokemon) {
                uniqueSet.delete(selectedBattlePokemon.id);
            }
            
            updateStatsUI();
            updateAchievements();
            saveProgress();
            
            additionalMessage = `💔 You lost ${lostName} from your collection! 💔`;
            resultType = 'lose';
        }
    } else {
        // TIE - No change
        additionalMessage = `No Pokémon were gained or lost.`;
        resultType = 'tie';
    }
    
    // Get icon based on result
    let icon = '';
    if (win === true) icon = '🏆✨';
    else if (win === false) icon = '💀💔';
    else icon = '🤝';
    
    // Create popup
    const popup = document.createElement('div');
    popup.className = 'battle-result-popup';
    popup.innerHTML = `
        <div class="battle-result-popup-content ${resultType}">
            <div class="battle-result-icon">${icon}</div>
            <div class="battle-result-title">${resultMessage}</div>
            <div class="battle-result-message">${resultDetail}</div>
            <div class="battle-result-detail">${additionalMessage}</div>
            <button class="battle-result-ok-btn" id="battleResultOkBtn">OK</button>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Add OK button handler
    const okBtn = document.getElementById('battleResultOkBtn');
    if (okBtn) {
        okBtn.onclick = () => {
            popup.remove();
            closeBattle();
            
            // Re-render Pokédex if it's open
            const pokedexModal = document.getElementById("pokedexModal");
            if (pokedexModal && pokedexModal.style.display === "flex") {
                renderPokedex();
            }
        };
    }
    
    // Disable RPS buttons
    document.querySelectorAll('[data-choice]').forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
    });
}

let currentErrorMsg = null;

// Internet Connection Monitor
let connectionMonitorInterval = null;
let disconnectPopupActive = false;

function startConnectionMonitor() {
    if (connectionMonitorInterval) clearInterval(connectionMonitorInterval);
    
    connectionMonitorInterval = setInterval(() => {
        // Only check if game is active (not in loading screen)
        const mainGame = document.getElementById('mainGame');
        if (mainGame && mainGame.style.display === 'flex') {
            checkConnectionSilent();
        }
    }, 10000); // Check every 10 seconds
}

function checkConnectionSilent() {
    fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
    })
    .then(() => {
        // Connected - remove popup if exists
        if (disconnectPopupActive) {
            removeDisconnectPopup();
        }
    })
    .catch(() => {
        // Disconnected - show popup
        if (!disconnectPopupActive) {
            showDisconnectPopup();
        }
    });
}

function showDisconnectPopup() {
    disconnectPopupActive = true;
    
    // Pause the game
    if (encounterTimer) {
        clearTimeout(encounterTimer);
        encounterTimer = null;
    }
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    if (catchTimerInterval) {
        clearInterval(catchTimerInterval);
        catchTimerInterval = null;
    }
    
    const catchBtn = document.getElementById("catchBtn");
    if (catchBtn) catchBtn.disabled = true;
    
    const popup = document.createElement('div');
    popup.id = 'disconnectPopup';
    popup.innerHTML = `
        <div class="disconnect-overlay">
            <div class="disconnect-popup">
                <div class="disconnect-icon">📡</div>
                <h2>Connection Lost!</h2>
                <p>Your internet connection has been interrupted.</p>
                <div class="disconnect-buttons">
                    <button id="disconnectRetryBtn" class="disconnect-btn retry">⟳ Retry Connection</button>
                    <button id="disconnectTrainerBtn" class="disconnect-btn trainer">📋 Go to Pokemon Album</button>
                </div>
                <div class="disconnect-note">Game will pause until connection is restored</div>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
    
    const style = document.createElement('style');
    style.textContent = `
        .disconnect-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            z-index: 30000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }
        
        .disconnect-popup {
            background: linear-gradient(145deg, #fef5e7, #f5e6d3);
            border-radius: 60px;
            padding: 30px 40px;
            text-align: center;
            max-width: 400px;
            width: 85%;
            border: 3px solid #ef4444;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            animation: popIn 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
        }
        
        .disconnect-icon {
            font-size: 60px;
            margin-bottom: 15px;
        }
        
        .disconnect-popup h2 {
            color: #ef4444;
            margin-bottom: 15px;
            font-size: 1.5rem;
        }
        
        .disconnect-popup p {
            color: #2c3e2f;
            margin-bottom: 10px;
            font-size: 0.9rem;
        }
        
        .disconnect-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin: 25px 0 15px;
            flex-wrap: wrap;
        }
        
        .disconnect-btn {
            padding: 12px 24px;
            border-radius: 50px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
            border: none;
        }
        
        .disconnect-btn.retry {
            background: #f7d44a;
            color: #2c3e2f;
        }
        
        .disconnect-btn.retry:hover {
            background: #ffecb3;
            transform: scale(1.02);
        }
        
        .disconnect-btn.trainer {
            background: #2c5a2e;
            color: white;
        }
        
        .disconnect-btn.trainer:hover {
            background: #3e7a40;
            transform: scale(1.02);
        }
        
        .disconnect-note {
            font-size: 0.7rem;
            color: #ef4444;
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #d4a373;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes popIn {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add button handlers
    const retryBtn = document.getElementById('disconnectRetryBtn');
    const trainerBtn = document.getElementById('disconnectTrainerBtn');
    
    if (retryBtn) {
        retryBtn.onclick = () => {
            checkConnectionAndResume();
        };
    }
    
    if (trainerBtn) {
        trainerBtn.onclick = () => {
            // Save progress before leaving
            saveProgress();
            window.location.href = 'trainer.html';
        };
    }
}

function removeDisconnectPopup() {
    const popup = document.getElementById('disconnectPopup');
    if (popup) {
        popup.remove();
        disconnectPopupActive = false;
    }
}

function checkConnectionAndResume() {
    fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
    })
    .then(() => {
        // Connection restored
        removeDisconnectPopup();
        
        // Resume the game
        if (!currentPokemon && !isWaitingForEncounter && !window.gamePaused) {
            startEncounterTimer();
        }
        
        showNotification('✅ Connection restored! Resuming game...', false);
    })
    .catch(() => {
        // Still disconnected
        showNotification('❌ Still no connection. Please check your Wi-Fi.', false);
    });
}

function stopConnectionMonitor() {
    if (connectionMonitorInterval) {
        clearInterval(connectionMonitorInterval);
        connectionMonitorInterval = null;
    }
}

function checkConnection() {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainGame = document.getElementById('mainGame');
    const connectionStatus = document.getElementById('connectionStatus');
    const retryButton = document.getElementById('retryButton');
    
    if (!loadingScreen || !mainGame) return;
    
    if (currentErrorMsg && currentErrorMsg.parentNode) {
        currentErrorMsg.remove();
        currentErrorMsg = null;
    }
    
    connectionStatus.innerHTML = '<span style="color: #f7d44a;">🔍 Checking connection...</span>';
    if (retryButton) retryButton.style.display = 'none';
    
    let completed = false;
    let timeoutId = null;
    
    const loadingBarContainer = document.createElement('div');
    loadingBarContainer.style.width = '200px';
    loadingBarContainer.style.height = '6px';
    loadingBarContainer.style.background = 'rgba(255,255,255,0.2)';
    loadingBarContainer.style.borderRadius = '3px';
    loadingBarContainer.style.margin = '20px auto 0 auto';
    loadingBarContainer.style.overflow = 'hidden';
    
    const loadingBarFill = document.createElement('div');
    loadingBarFill.style.width = '0%';
    loadingBarFill.style.height = '100%';
    loadingBarFill.style.background = '#f7d44a';
    loadingBarFill.style.borderRadius = '3px';
    loadingBarFill.style.transition = 'width 0.1s linear';
    
    loadingBarContainer.appendChild(loadingBarFill);
    connectionStatus.parentNode.appendChild(loadingBarContainer);
    
    let progress = 0;
    const loadingInterval = setInterval(() => {
        if (progress < 90) {
            progress += Math.random() * 10;
            if (progress > 90) progress = 90;
            loadingBarFill.style.width = progress + '%';
        }
    }, 200);
    
    const fadeToGame = () => {
        if (completed) return;
        completed = true;
        clearInterval(loadingInterval);
        if (timeoutId) clearTimeout(timeoutId);
        
        loadingBarFill.style.width = '100%';
        
        setTimeout(() => {
            loadingScreen.style.transition = 'opacity 0.5s';
            loadingScreen.style.opacity = '0';
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                mainGame.style.display = 'flex';
                mainGame.style.opacity = '0';
                mainGame.style.transition = 'opacity 0.5s';
                
                setTimeout(() => {
                    mainGame.style.opacity = '1';
                    
                    setTimeout(() => {
                        if (!window.gameStarted) {
                            window.gameStarted = true;
                            console.log('FADE TO GAME - Starting encounter timer');
                            console.log('timerDisplay element:', document.getElementById('timerDisplay'));
                            console.log('waitingMessage element:', document.getElementById('waitingMessage'));
                            startEncounterTimer();
                            startConnectionMonitor();
                        }
                    }, 500);
                    
                }, 50);
            }, 500);
        }, 300);
    };
    
    const showReadyButton = () => {
        if (completed) return;
        clearInterval(loadingInterval);
        
        loadingBarFill.style.width = '100%';
        
        setTimeout(() => {
            connectionStatus.innerHTML = '<span style="color: #aaffaa;">Internet Connected!</span>';
            if (loadingBarContainer.parentNode) {
                loadingBarContainer.remove();
            }
            
            currentErrorMsg = document.createElement('div');
            currentErrorMsg.style.marginTop = '20px';
            currentErrorMsg.style.textAlign = 'center';
            currentErrorMsg.innerHTML = `
                <button id="readyButton" style="background: #f7d44a; color: #2c3e2f; border: none; padding: 12px 35px; border-radius: 50px; font-weight: bold; font-size: 1.1rem; cursor: pointer; transition: transform 0.2s;">▶ READY!</button>
            `;
            connectionStatus.parentNode.appendChild(currentErrorMsg);
            const readyBtn = document.getElementById('readyButton');
            if (readyBtn) {
                readyBtn.onmouseover = () => readyBtn.style.transform = 'scale(1.05)';
                readyBtn.onmouseout = () => readyBtn.style.transform = 'scale(1)';
                readyBtn.onclick = () => {
                    if (typeof window.startMusic === 'function') {
                        window.startMusic();
                    }
                    fadeToGame();
                };
            }
        }, 500);
    };
    
    const showNoInternet = () => {
        if (completed) return;
        completed = true;
        clearInterval(loadingInterval);
        
        connectionStatus.innerHTML = '<span style="color: #ff8888;">No Internet Connection!</span>';
        
        if (loadingBarContainer.parentNode) {
            loadingBarContainer.remove();
        }
        
        if (currentErrorMsg && currentErrorMsg.parentNode) {
            currentErrorMsg.remove();
        }
        
        currentErrorMsg = document.createElement('div');
        currentErrorMsg.style.marginTop = '20px';
        currentErrorMsg.style.textAlign = 'center';
        currentErrorMsg.innerHTML = `
            <a href="trainer.html" style="display: inline-block; background: #f7d44a; color: #2c3e2f; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: bold; margin-bottom: 15px;">📋 GO TO TRAINER MANAGEMENT</a>
            <div>
                <button onclick="checkConnection()" style="background: #6c757d; color: white; border: none; padding: 10px 25px; border-radius: 40px; font-weight: bold; cursor: pointer;">⟳ RETRY CONNECTION</button>
            </div>
        `;
        connectionStatus.parentNode.appendChild(currentErrorMsg);
    };
    
    const controller = new AbortController();
    timeoutId = setTimeout(() => {
        controller.abort();
        showNoInternet();
        completed = true;
    }, 8000);
    
    fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
    })
    .then(() => {
        clearTimeout(timeoutId);
        if (!completed) {
            setTimeout(() => {
                if (!completed) showReadyButton();
            }, 2000);
        }
    })
    .catch(() => {
        clearTimeout(timeoutId);
        if (!completed) {
            setTimeout(() => {
                if (!completed) showNoInternet();
            }, 2000);
        }
    });
}

window.addEventListener('load', () => {
    const mainGame = document.getElementById('mainGame');
    if (mainGame) mainGame.style.display = 'none';
    checkConnection();
});

function createSparkles(isShiny = false) {
    const bigSparkle = document.createElement('div');
    bigSparkle.className = 'big-sparkle';
    if (isShiny) {
        bigSparkle.innerHTML = `<img src="big-emoji.gif" style="width: 80px; height: 80px;">`;
    } else {
        bigSparkle.innerHTML = `<img src="pipsqueak.gif" style="width: 80px; height: 80px;">`;
    }
    document.body.appendChild(bigSparkle);
    setTimeout(() => bigSparkle.remove(), 800);
    
    const container = document.createElement('div');
    container.className = 'sparkle-container';
    document.body.appendChild(container);
    
    for (let i = 0; i < 30; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * window.innerWidth + 'px';
        sparkle.style.top = Math.random() * window.innerHeight + 'px';
        sparkle.style.animationDelay = Math.random() * 0.3 + 's';
        sparkle.style.width = Math.random() * 12 + 4 + 'px';
        sparkle.style.height = sparkle.style.width;
        if (isShiny) {
            sparkle.style.background = 'radial-gradient(circle, gold, #ffaa00, #ff6600)';
        }
        container.appendChild(sparkle);
    }
    
    setTimeout(() => container.remove(), 1000);
}

function updateGalleryProgress() {
    const totalUnique = uniqueSet.size;
    const totalShinies = shinyCount;
    
    galleryItems.forEach(item => {
        let isUnlocked = false;
        if (item.isShinyMilestone) {
            isUnlocked = totalShinies >= item.milestone;
        } else {
            isUnlocked = totalUnique >= item.milestone;
        }
        
        if (isUnlocked && !unlockedGallery.includes(item.id)) {
            unlockedGallery.push(item.id);
            showNotification(`🎨 NEW GALLERY ITEM UNLOCKED: ${item.name}! 🎨`, false);
        }
    });
    saveGalleryProgress();
    
    const galleryModal = document.getElementById("galleryModal");
    if (galleryModal && galleryModal.style.display === "flex") {
        renderGallery();
    }
    
    const progressSpan = document.getElementById("galleryProgress");
    if (progressSpan) {
        progressSpan.innerText = unlockedGallery.length;
    }
}

function saveGalleryProgress() {
    localStorage.setItem('pokemonGameGallery', JSON.stringify(unlockedGallery));
}

function loadGalleryProgress() {
    const savedGallery = localStorage.getItem('pokemonGameGallery');
    if (savedGallery) {
        unlockedGallery = JSON.parse(savedGallery);
    } else {
        unlockedGallery = [];
    }
}

function renderGallery() {
    const grid = document.getElementById("galleryGrid");
    if (!grid) return;
    
    grid.innerHTML = "";
    
    galleryItems.forEach(item => {
        const isUnlocked = unlockedGallery.includes(item.id);
        const card = document.createElement("div");
        card.className = `gallery-item ${isUnlocked ? 'unlocked' : 'locked'}`;
        const preview = document.createElement("div");
        preview.className = "gallery-preview";
        const img = document.createElement("img");
        img.src = item.gifUrl;
        img.alt = item.name;
        img.onerror = function() {
            this.src = "https://via.placeholder.com/150?text=" + item.name;
        };
        preview.appendChild(img);
        
        if (isUnlocked) {
            const downloadOverlay = document.createElement("div");
            downloadOverlay.className = "download-overlay";
            const downloadBtn = document.createElement("button");
            downloadBtn.className = "download-btn-overlay";
            downloadBtn.innerHTML = "📥 DOWNLOAD";
            downloadBtn.onclick = (e) => {
                e.stopPropagation();
                downloadGIF(item.gifUrl, item.name);
            };
            downloadOverlay.appendChild(downloadBtn);
            preview.appendChild(downloadOverlay);
        } else {
            const lockDiv = document.createElement("div");
            lockDiv.className = "lock-overlay";
            lockDiv.innerHTML = `
                <div class="question-mark">?</div>
                <div class="milestone-text">${item.milestoneText}</div>
            `;
            preview.appendChild(lockDiv);
        }
        
        card.appendChild(preview);
        grid.appendChild(card);
    });
}

function downloadGIF(url, filename) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${filename.replace(/[^a-z0-9]/gi, '_')}.gif`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            showNotification(`📥 Downloaded: ${filename}`, false);
        })
        .catch(error => {
            console.error('Download failed:', error);
            showNotification(`Failed to download ${filename}`, false);
        });
}

function openGallery() {
    renderGallery();
    document.getElementById("galleryModal").style.display = "flex";
}

function closeGallery() {
    document.getElementById("galleryModal").style.display = "none";
}

function updateAchievements() {
    const bugIds = [10,11,12,13,14,15,46,47,48,49,123,127,165,166,167,168,193,204,205,207,212,213,214];
    const waterIds = [7,8,9,54,55,60,61,62,72,73,86,87,90,91,98,99,116,117,118,119,120,121,129,130,131,134,158,159,160,170,171,183,184,186,194,195,211,222,223,224,226,230,245];
    const fireIds = [4,5,6,37,38,58,59,126,136,146,155,156,157,218,219,228,229,244,250];
    const grassIds = [1,2,3,43,44,45,69,70,71,102,103,114,152,153,154,182,187,188,189,191,192];
    const electricIds = [25,26,81,82,100,101,125,135,145,172,179,180,181,243];
    const psychicIds = [63,64,65,96,97,122,150,151,177,178,196,199,201,203];
    const ghostIds = [92,93,94,200,202,353,354,355,356,477];
    const dragonIds = [147,148,149,230,334,371,372,373,380,381,384];
    const steelIds = [81,82,208,212,227,304,305,306,374,375,376,379];
    const darkIds = [197,198,215,228,229,248,261,262,274,275,318,319,332,342,359];
    const fightingIds = [56,57,66,67,68,106,107,236,237,296,297,307,308];
    const flyingIds = [6,12,15,16,17,18,21,22,41,42,83,84,85,123,130,142,144,145,146,149,163,164,169,176,177,178,198,225,226,227,249,250];
    const poisonIds = [1,2,3,13,14,15,23,24,29,30,31,32,33,34,41,42,43,44,45,48,49,69,70,71,72,73,88,89,92,93,94,109,110];
    const groundIds = [27,28,31,34,50,51,104,105,111,112];
    const rockIds = [74,75,76,95,138,139,140,141,142,246,247,248];
    const iceIds = [86,87,91,124,144,220,221,225,238];
    const normalIds = [16,17,18,19,20,21,22,39,40,52,53,83,84,85,108,113,115,128,132,133,137,143,161,162,173,174,175,190,206,209,210,216,217,234,235,241];
    
    const bugCaught = caughtPokemon.filter(p => bugIds.includes(p.id)).length;
    const waterCaught = caughtPokemon.filter(p => waterIds.includes(p.id)).length;
    const fireCaught = caughtPokemon.filter(p => fireIds.includes(p.id)).length;
    const grassCaught = caughtPokemon.filter(p => grassIds.includes(p.id)).length;
    const electricCaught = caughtPokemon.filter(p => electricIds.includes(p.id)).length;
    const psychicCaught = caughtPokemon.filter(p => psychicIds.includes(p.id)).length;
    const ghostCaught = caughtPokemon.filter(p => ghostIds.includes(p.id)).length;
    const dragonCaught = caughtPokemon.filter(p => dragonIds.includes(p.id)).length;
    const steelCaught = caughtPokemon.filter(p => steelIds.includes(p.id)).length;
    const darkCaught = caughtPokemon.filter(p => darkIds.includes(p.id)).length;
    const fightingCaught = caughtPokemon.filter(p => fightingIds.includes(p.id)).length;
    const flyingCaught = caughtPokemon.filter(p => flyingIds.includes(p.id)).length;
    const poisonCaught = caughtPokemon.filter(p => poisonIds.includes(p.id)).length;
    const groundCaught = caughtPokemon.filter(p => groundIds.includes(p.id)).length;
    const rockCaught = caughtPokemon.filter(p => rockIds.includes(p.id)).length;
    const iceCaught = caughtPokemon.filter(p => iceIds.includes(p.id)).length;
    const normalCaught = caughtPokemon.filter(p => normalIds.includes(p.id)).length;

    const fossilIds = [138,139,140,141,142];
    const eeveelutions = [133,134,135,136,196,197];
    const starters = [1,4,7,152,155,158];
    const pseudoLegendIds = [147,148,149,246,247,248];
    const legendaries = [...rarityMap.legendary];
    
    const fossilCaught = caughtPokemon.filter(p => fossilIds.includes(p.id)).length;
    const eeveelutionCaught = caughtPokemon.filter(p => eeveelutions.includes(p.id)).length;
    const starterCaught = caughtPokemon.filter(p => starters.includes(p.id)).length;
    const pseudoCaught = caughtPokemon.filter(p => pseudoLegendIds.includes(p.id)).length;
    const legendaryCaught = caughtPokemon.filter(p => legendaries.includes(p.id)).length;
    
    const totalCaught = uniqueSet.size;
    const gen1Caught = caughtPokemon.filter(p => p.id <= 151).length;
    const gen2Caught = caughtPokemon.filter(p => p.id >= 152 && p.id <= 251).length;
    
    if (!achievements.bugCatcher && bugCaught >= 10) {
        achievements.bugCatcher = true;
        showNotification("🏆 Achievement: Bug Catcher! (10 Bug types)", false);
    }
    if (!achievements.fisherman && waterCaught >= 15) {
        achievements.fisherman = true;
        showNotification("🏆 Achievement: Fisherman! (15 Water types)", false);
    }
    if (!achievements.shinyHunter && shinyCount >= 3) {
        achievements.shinyHunter = true;
        showNotification("🏆 Achievement: Shiny Hunter! (3 Shinies)", true);
    }
    if (!achievements.master && totalCaught === TOTAL_POKEMON) {
        achievements.master = true;
        showNotification("🏆 Achievement: Pokémon Master! (Complete Pokédex)", false);
    }

    if (!achievements.rookie && totalCaught >= 10) {
        achievements.rookie = true;
        showNotification("🏆 Achievement: Rookie Trainer! (10 Pokémon caught)", false);
    }
    if (!achievements.collector && totalCaught >= 50) {
        achievements.collector = true;
        showNotification("🏆 Achievement: Collector! (50 Pokémon caught)", false);
    }
    if (!achievements.enthusiast && totalCaught >= 100) {
        achievements.enthusiast = true;
        showNotification("🏆 Achievement: Enthusiast! (100 Pokémon caught)", false);
    }
    
    if (!achievements.fireType && fireCaught >= 10) {
        achievements.fireType = true;
        showNotification("🏆 Achievement: Fire Type Master! (10 Fire types)", false);
    }
    if (!achievements.waterType && waterCaught >= 15) {
        achievements.waterType = true;
        showNotification("🏆 Achievement: Water Type Master! (15 Water types)", false);
    }
    if (!achievements.grassType && grassCaught >= 10) {
        achievements.grassType = true;
        showNotification("🏆 Achievement: Grass Type Master! (10 Grass types)", false);
    }
    if (!achievements.electricType && electricCaught >= 8) {
        achievements.electricType = true;
        showNotification("🏆 Achievement: Electric Type Master! (8 Electric types)", false);
    }
    if (!achievements.psychicType && psychicCaught >= 8) {
        achievements.psychicType = true;
        showNotification("🏆 Achievement: Psychic Type Master! (8 Psychic types)", false);
    }
    if (!achievements.ghostBuster && ghostCaught >= 5) {
        achievements.ghostBuster = true;
        showNotification("🏆 Achievement: Ghost Buster! (5 Ghost types)", false);
    }
    if (!achievements.dragonTamer && dragonCaught >= 3) {
        achievements.dragonTamer = true;
        showNotification("🏆 Achievement: Dragon Tamer! (3 Dragon types)", false);
    }
    if (!achievements.steelWorker && steelCaught >= 5) {
        achievements.steelWorker = true;
        showNotification("🏆 Achievement: Steel Worker! (5 Steel types)", false);
    }
    if (!achievements.darkType && darkCaught >= 8) {
        achievements.darkType = true;
        showNotification("🏆 Achievement: Dark Type Master! (8 Dark types)", false);
    }
    if (!achievements.fightingType && fightingCaught >= 8) {
        achievements.fightingType = true;
        showNotification("🏆 Achievement: Fighting Type Master! (8 Fighting types)", false);
    }
    if (!achievements.flyingType && flyingCaught >= 15) {
        achievements.flyingType = true;
        showNotification("🏆 Achievement: Flying Type Master! (15 Flying types)", false);
    }
    if (!achievements.poisonType && poisonCaught >= 15) {
        achievements.poisonType = true;
        showNotification("🏆 Achievement: Poison Type Master! (15 Poison types)", false);
    }
    if (!achievements.groundType && groundCaught >= 8) {
        achievements.groundType = true;
        showNotification("🏆 Achievement: Ground Type Master! (8 Ground types)", false);
    }
    if (!achievements.rockType && rockCaught >= 8) {
        achievements.rockType = true;
        showNotification("🏆 Achievement: Rock Type Master! (8 Rock types)", false);
    }
    if (!achievements.iceType && iceCaught >= 6) {
        achievements.iceType = true;
        showNotification("🏆 Achievement: Ice Type Master! (6 Ice types)", false);
    }
    if (!achievements.bugMaster && bugCaught >= 12) {
        achievements.bugMaster = true;
        showNotification("🏆 Achievement: Bug Master! (12 Bug types)", false);
    }
    if (!achievements.normalType && normalCaught >= 20) {
        achievements.normalType = true;
        showNotification("🏆 Achievement: Normal Type Master! (20 Normal types)", false);
    }
    
    if (!achievements.fossilHunter && fossilCaught === fossilIds.length) {
        achievements.fossilHunter = true;
        showNotification("🏆 Achievement: Fossil Hunter! (All Fossil Pokémon)", false);
    }
    if (!achievements.eeveelutionMaster && eeveelutionCaught === eeveelutions.length) {
        achievements.eeveelutionMaster = true;
        showNotification("🏆 Achievement: Eeveelution Master! (All Eeveelutions)", false);
    }
    if (!achievements.starterMaster && starterCaught === starters.length) {
        achievements.starterMaster = true;
        showNotification("🏆 Achievement: Starter Master! (All Starter Pokémon)", false);
    }
    if (!achievements.pseudoLegend && pseudoCaught === pseudoLegendIds.length) {
        achievements.pseudoLegend = true;
        showNotification("🏆 Achievement: Pseudo-Legendary Trainer! (All Pseudo-Legendaries)", false);
    }
    if (!achievements.legendCatcher && legendaryCaught >= 8) {
        achievements.legendCatcher = true;
        showNotification("🏆 Achievement: Legendary Catcher! (8 Legendary Pokémon)", false);
    }
    
    if (!achievements.gen1Master && gen1Caught === 151) {
        achievements.gen1Master = true;
        showNotification("🏆 Achievement: Kanto Master! (Complete Gen 1 Pokédex)", false);
    }
    if (!achievements.gen2Master && gen2Caught === 100) {
        achievements.gen2Master = true;
        showNotification("🏆 Achievement: Johto Master! (Complete Gen 2 Pokédex)", false);
    }
    
    if (!achievements.shinyCollector && shinyCount >= 10) {
        achievements.shinyCollector = true;
        showNotification("🏆 Achievement: Shiny Collector! (10 Shinies)", true);
    }
    
    if (!achievements.livingDex && caughtPokemon.length >= 251) {
        achievements.livingDex = true;
        showNotification("🏆 Achievement: Living Pokédex! (One of each Pokémon)", false);
    }
    
    renderAchievements();
    updateGalleryProgress();
}

function createBadge(achievement) {
    const badge = document.createElement('div');
    badge.className = 'achievement-badge';
    
    if (achievements[achievement.key]) {
        badge.classList.add('earned');
    }
    
    badge.title = achievement.description;
    badge.innerHTML = `${achievement.icon} ${achievement.name}`;
    return badge;
}

function updateAnimationSpeed() {
    const marqueeContent = document.getElementById('achievementsMarquee');
    if (marqueeContent) {
        marqueeContent.style.animation = `scrollMarquee ${currentSpeed}s linear infinite`;
    }
}

function renderAchievements() {
    const container = document.getElementById('achievementsMarquee');
    if (!container) return;

    const allAchievements = [
        { key: 'rookie', icon: '🌟', name: 'Rookie', description: 'Catch 10 Pokémon' },
        { key: 'collector', icon: '📦', name: 'Collector', description: 'Catch 50 Pokémon' },
        { key: 'enthusiast', icon: '🎯', name: 'Enthusiast', description: 'Catch 100 Pokémon' },
        { key: 'bugCatcher', icon: '🐛', name: 'Bug Catcher', description: 'Catch 10 Bug types' },
        { key: 'fisherman', icon: '🎣', name: 'Fisherman', description: 'Catch 15 Water types' },
        { key: 'fireType', icon: '🔥', name: 'Fire', description: 'Catch 10 Fire types' },
        { key: 'waterType', icon: '💧', name: 'Water', description: 'Catch 15 Water types' },
        { key: 'grassType', icon: '🌿', name: 'Grass', description: 'Catch 10 Grass types' },
        { key: 'electricType', icon: '⚡', name: 'Electric', description: 'Catch 8 Electric types' },
        { key: 'psychicType', icon: '🔮', name: 'Psychic', description: 'Catch 8 Psychic types' },
        { key: 'ghostBuster', icon: '👻', name: 'Ghost', description: 'Catch 5 Ghost types' },
        { key: 'dragonTamer', icon: '🐉', name: 'Dragon', description: 'Catch 3 Dragon types' },
        { key: 'steelWorker', icon: '⚙️', name: 'Steel', description: 'Catch 5 Steel types' },
        { key: 'darkType', icon: '🌙', name: 'Dark', description: 'Catch 8 Dark types' },
        { key: 'fightingType', icon: '🥊', name: 'Fighting', description: 'Catch 8 Fighting types' },
        { key: 'flyingType', icon: '🕊️', name: 'Flying', description: 'Catch 15 Flying types' },
        { key: 'poisonType', icon: '☠️', name: 'Poison', description: 'Catch 15 Poison types' },
        { key: 'groundType', icon: '⛰️', name: 'Ground', description: 'Catch 8 Ground types' },
        { key: 'rockType', icon: '🪨', name: 'Rock', description: 'Catch 8 Rock types' },
        { key: 'iceType', icon: '❄️', name: 'Ice', description: 'Catch 6 Ice types' },
        { key: 'bugMaster', icon: '🐞', name: 'Bug Master', description: 'Catch 12 Bug types' },
        { key: 'normalType', icon: '📄', name: 'Normal', description: 'Catch 20 Normal types' },
        { key: 'fossilHunter', icon: '🦴', name: 'Fossil Hunter', description: 'All Fossil Pokémon' },
        { key: 'eeveelutionMaster', icon: '🌈', name: 'Eeveelution', description: 'All Eeveelutions' },
        { key: 'starterMaster', icon: '🍃', name: 'Starter Master', description: 'All Starters' },
        { key: 'pseudoLegend', icon: '💪', name: 'Pseudo-Legend', description: 'All Pseudo-Legendaries' },
        { key: 'legendCatcher', icon: '👑', name: 'Legend Catcher', description: '8 Legendaries' },
        { key: 'gen1Master', icon: '🎮', name: 'Kanto Master', description: 'Complete Gen 1' },
        { key: 'gen2Master', icon: '⭐', name: 'Johto Master', description: 'Complete Gen 2' },
        { key: 'shinyHunter', icon: '✨', name: 'Shiny Hunter', description: '3 Shinies' },
        { key: 'shinyCollector', icon: '💎', name: 'Shiny Collector', description: '10 Shinies' },
        { key: 'livingDex', icon: '📚', name: 'Living Dex', description: 'One of each' },
        { key: 'master', icon: '👑', name: 'Master', description: 'Complete Pokédex' }
    ];
    
    container.innerHTML = '';
    
    allAchievements.forEach(achievement => {
        const badge = createBadge(achievement);
        container.appendChild(badge);
    });
    
    allAchievements.forEach(achievement => {
        const badge = createBadge(achievement);
        container.appendChild(badge.cloneNode(true));
    });
    
    updateAnimationSpeed();
}

let deferredPrompt;
const installPromptDiv = document.createElement('div');
installPromptDiv.className = 'install-prompt';
installPromptDiv.style.display = 'none';
installPromptDiv.innerHTML = `
    <span>📱 Install as App for better experience!</span>
    <div>
        <button class="install-btn-pwa" id="installBtnPWA">Install</button>
        <button class="close-install" id="closeInstallBtn">✕</button>
    </div>
`;
document.body.appendChild(installPromptDiv);

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installPromptDiv.style.display = 'flex';
});

document.getElementById('installBtnPWA')?.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            installPromptDiv.style.display = 'none';
        }
        deferredPrompt = null;
    }
});

document.getElementById('closeInstallBtn')?.addEventListener('click', () => {
    installPromptDiv.style.display = 'none';
});

function saveProgress() {
    const saveData = {
        caughtPokemon: caughtPokemon,
        caughtCount: caughtCount,
        shinyCount: shinyCount,
        uniqueSet: Array.from(uniqueSet),
        achievements: achievements
    };
    localStorage.setItem('pokemonGameSave', JSON.stringify(saveData));
}

function loadProgress() {
    const savedData = localStorage.getItem('pokemonGameSave');
    if (savedData) {
        const data = JSON.parse(savedData);
        caughtPokemon = data.caughtPokemon;
        caughtCount = data.caughtCount;
        shinyCount = data.shinyCount;
        uniqueSet = new Set(data.uniqueSet);
        if (data.achievements) achievements = data.achievements;
        updateStatsUI();
        renderAchievements();
    }
}

function showNotification(message, isShiny = false) {
    const notification = document.createElement('div');
    notification.className = 'notification' + (isShiny ? ' shiny' : '');
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification && notification.remove) {
            notification.remove();
        }
    }, 2000);
}

function updateStatsUI() {
    document.getElementById("caughtCount").innerText = caughtCount;
    document.getElementById("shinyCount").innerText = shinyCount;
}

function isShiny() {
    return Math.floor(Math.random() * SHINY_ODDS) === 0;
}

function getWeightedPokemon() {
    const rand = Math.random();
    let pool;
    if (rand < 0.6) pool = rarityMap.common;
    else if (rand < 0.85) pool = rarityMap.uncommon;
    else if (rand < 0.95) pool = rarityMap.rare;
    else pool = rarityMap.legendary;
    return pool[Math.floor(Math.random() * pool.length)];
}

function showPokemon() {
    console.log('showPokemon called');
    
    const newId = getWeightedPokemon();
    const shiny = isShiny();
    currentPokemon = { id: newId, isShiny: shiny };
    canCatch = true;
    
    const rarity = getPokemonRarity(newId);
    const spriteType = shiny ? "shiny" : "normal";
    let spriteUrl = `https://img.pokemondb.net/sprites/black-white/anim/${spriteType}/${newId}.gif`;
    
    const img = document.getElementById("pokemonSprite");
    img.src = spriteUrl;
    img.onerror = function() {
        this.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${shiny ? 'shiny/' : ''}${newId}.gif`;
    };
    
    document.getElementById("pokemonName").innerText = getPokemonName(newId);
    document.getElementById("pokemonId").innerHTML = `#${newId.toString().padStart(3, '0')} | ${rarity.name.toUpperCase()}`;
    
    const shinyTag = document.getElementById("shinyTag");
    if (shiny) {
        shinyTag.innerHTML = '<div class="shiny-indicator">✨ SHINY ENCOUNTER! ✨</div>';
        showNotification(`✨ SHINY ${getPokemonName(newId).toUpperCase()} APPEARED! ✨`, true);
    } else {
        shinyTag.innerHTML = '';
    }
    
    const catchBtn = document.getElementById("catchBtn");
    catchBtn.disabled = false;
    
    playCry(newId);
    startCatchTimer();
    
    console.log('Pokemon shown, catch timer started');
}

function clearPokemon() {
    currentPokemon = null;
    document.getElementById("pokemonSprite").src = "";
    document.getElementById("pokemonName").innerText = "Waiting for encounter...";
    document.getElementById("pokemonId").innerText = "#---";
    document.getElementById("shinyTag").innerHTML = '';
    document.getElementById("catchBtn").disabled = true;
    
    if (catchTimerInterval) {
        clearInterval(catchTimerInterval);
        catchTimerInterval = null;
    }
}

function animateCatch() {
    return new Promise((resolve) => {
        const ball = document.createElement('div');
        ball.className = 'pokeball-animation';
        document.body.appendChild(ball);
        setTimeout(() => ball.remove(), 400);
        
        const spriteWrapper = document.getElementById('spriteWrapper');
        spriteWrapper.classList.add('shake-realistic');
        
        setTimeout(() => {
            spriteWrapper.classList.remove('shake-realistic');
            resolve();
        }, 1800);
    });
}

function startEncounterTimer() {
    console.log('=== START ENCOUNTER TIMER CALLED ===');
    resetAllTimers();
    
    isWaitingForEncounter = true;
    waitingTimeRemaining = 3;
    
    const waitingMessage = document.getElementById("waitingMessage");
    const timerDisplay = document.getElementById("timerDisplay");
    
    if (!waitingMessage || !timerDisplay) {
        console.error('Elements missing!');
        return;
    }
    
    waitingMessage.style.display = "block";
    timerDisplay.innerText = waitingTimeRemaining;
    
    console.log('Initial timer value:', waitingTimeRemaining);
    
    countdownInterval = setInterval(function() {
        console.log('Interval running, current time:', waitingTimeRemaining);
        
        if (waitingTimeRemaining > 0) {
            waitingTimeRemaining--;
            timerDisplay.innerText = waitingTimeRemaining;
            console.log('Timer updated to:', waitingTimeRemaining);
        }
        
        if (waitingTimeRemaining <= 0) {
            console.log('Timer reached 0, clearing interval');
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
    }, 1000);
    
    encounterTimer = setTimeout(function() {
        console.log('TIMEOUT FIRED - Showing Pokemon');
        
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        
        waitingMessage.style.display = "none";
        isWaitingForEncounter = false;
        
        showPokemon();
        
    }, 3000);
    
    console.log('Timer setup complete');
}

function startCatchTimer() {
    console.log('startCatchTimer called');
    
    if (catchTimerInterval) {
        clearInterval(catchTimerInterval);
        catchTimerInterval = null;
    }
    
    currentCatchTimeLeft = 7;
    const timerDisplay = document.getElementById("timerDisplay");
    
    if (timerDisplay) {
        timerDisplay.innerText = currentCatchTimeLeft;
    }
    
    catchTimerInterval = setInterval(() => {
        if (currentCatchTimeLeft > 0 && currentPokemon !== null) {
            currentCatchTimeLeft--;
            if (timerDisplay) {
                timerDisplay.innerText = currentCatchTimeLeft;
            }
            console.log('Catch timer:', currentCatchTimeLeft);
        } else if (currentCatchTimeLeft === 0 && currentPokemon !== null) {
            console.log('Pokemon ran away');
            clearInterval(catchTimerInterval);
            catchTimerInterval = null;
            pokemonRanAway();
        }
    }, 1000);
}

function pokemonRanAway() {
    if (!currentPokemon) return;
    showNotification(`${getPokemonName(currentPokemon.id)} ran away!`, false);
    clearPokemon();
    startEncounterTimer();
}

async function catchPokemon() {
    if (!currentPokemon || !canCatch) return;
    canCatch = false;
    document.getElementById("catchBtn").disabled = true;
    
    await animateCatch();
    
    const { id, isShiny } = currentPokemon;
    const rarity = getPokemonRarity(id);
    const catchSuccess = Math.random() > rarity.escapeChance;
    
    if (!catchSuccess) {
        showNotification(`${getPokemonName(id)} broke free!`, false);
        clearPokemon();
        startEncounterTimer();
        return;
    }
    
    createSparkles(isShiny);
    
    const spriteWrapper = document.getElementById('spriteWrapper');
    spriteWrapper.classList.add('bounce-catch');
    setTimeout(() => spriteWrapper.classList.remove('bounce-catch'), 300);
    
    const alreadyOwned = caughtPokemon.some(p => p.id === id && p.shiny === isShiny);
    const pokemonName = getPokemonName(id);
    
    if (!alreadyOwned) {
        caughtPokemon.push({ id, shiny: isShiny });
        caughtCount++;
        if (isShiny) {
            shinyCount++;
            showNotification(`✨✨✨ CAUGHT SHINY ${pokemonName.toUpperCase()}! ✨✨✨`, true);
        } else {
            showNotification(`✨ Caught ${pokemonName}! ✨`, false);
        }
        if (!uniqueSet.has(id)) uniqueSet.add(id);
        updateStatsUI();
        updateAchievements();
        saveProgress();
    } else {
        showNotification(`${isShiny ? 'SHINY ' : ''}${pokemonName} already caught! It escaped...`);
    }
    
    clearPokemon();
    
    if (catchTimerInterval) {
        clearInterval(catchTimerInterval);
        catchTimerInterval = null;
    }
    
    startEncounterTimer();
}

function releasePokemon(pokemonId, isShiny) {
    const index = caughtPokemon.findIndex(p => p.id === pokemonId && p.shiny === isShiny);
    if (index !== -1) {
        const pokemonName = getPokemonName(pokemonId);
        
        caughtPokemon.splice(index, 1);
        caughtCount--;
        if (isShiny) shinyCount--;
        
        const stillHasPokemon = caughtPokemon.some(p => p.id === pokemonId);
        if (!stillHasPokemon) {
            uniqueSet.delete(pokemonId);
        }
        
        updateStatsUI();
        updateAchievements();
        saveProgress();
        showNotification(`Released ${isShiny ? 'SHINY ' : ''}${pokemonName}`, false);
        renderPokedex();
    }
}

function renderPokedex() {
    const grid = document.getElementById("pokedexGrid");
    grid.innerHTML = "";
    
    let startId = 1;
    let endId = TOTAL_POKEMON;
    
    if (currentGenerationFilter === 'gen1') {
        endId = 151;
    } else if (currentGenerationFilter === 'gen2') {
        startId = 152;
    }
    
    for (let i = startId; i <= endId; i++) {
        const caughtVariants = caughtPokemon.filter(p => p.id === i);
        const hasNormal = caughtVariants.some(p => !p.shiny);
        const hasShiny = caughtVariants.some(p => p.shiny);
        
        const card = document.createElement("div");
        card.className = "pokedex-card";
        
        if (hasNormal || hasShiny) {
            card.classList.add("caught");
            if (hasShiny) card.classList.add("shiny-card");
        } else {
            card.classList.add("not-caught");
        }
        
        let spriteUrl;
        if (hasShiny) {
            spriteUrl = `https://img.pokemondb.net/sprites/black-white/anim/shiny/${i}.gif`;
        } else {
            spriteUrl = `https://img.pokemondb.net/sprites/black-white/anim/normal/${i}.gif`;
        }
        
        let caughtText = "";
        if (hasNormal && hasShiny) {
            caughtText = '<div style="font-size:9px; color:gold;">✨ SHINY & NORMAL ✨</div>';
        } else if (hasShiny) {
            caughtText = '<div style="font-size:9px; color:gold;">⭐ SHINY CAUGHT ⭐</div>';
        } else if (hasNormal) {
            caughtText = '<div style="font-size:9px; color:#aaffaa;">✓ NORMAL</div>';
        } else {
            caughtText = '<div style="font-size:9px; color:#999;">❌ NOT CAUGHT</div>';
        }
        
        card.innerHTML = `
            <img class="pokedex-sprite" src="${spriteUrl}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${hasShiny ? 'shiny/' : ''}${i}.gif'">
            <div class="pokedex-name">#${i}<br>${getPokemonName(i)}</div>
            ${caughtText}
        `;
        
        if (hasNormal || hasShiny) {
            card.style.cursor = "pointer";
            card.addEventListener("click", (e) => {
                e.stopPropagation();
                showReleaseOptions(i, hasNormal, hasShiny);
            });
        }
        
        grid.appendChild(card);
    }
}

function showReleaseOptions(pokemonId, hasNormal, hasShiny) {
    const pokemonName = getPokemonName(pokemonId);
    let message = `Release ${pokemonName}?\n\n`;
    
    if (hasNormal && hasShiny) {
        message += "1 - Release NORMAL version\n2 - Release SHINY version\nCancel - Keep both";
        const choice = prompt(message, "1");
        if (choice === "1") {
            releasePokemon(pokemonId, false);
        } else if (choice === "2") {
            releasePokemon(pokemonId, true);
        }
    } else if (hasNormal) {
        message += "Release this NORMAL Pokémon?";
        if (confirm(message)) {
            releasePokemon(pokemonId, false);
        }
    } else if (hasShiny) {
        message += "Release this SHINY Pokémon?";
        if (confirm(message)) {
            releasePokemon(pokemonId, true);
        }
    }
}

function openPokedex() {
    renderPokedex();
    document.getElementById("pokedexModal").style.display = "flex";
}

function closePokedex() {
    document.getElementById("pokedexModal").style.display = "none";
}

function setGenerationFilter(filter) {
    currentGenerationFilter = filter;
    renderPokedex();
    
    document.querySelectorAll('.gen-filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    const grid = document.getElementById("pokedexGrid");
    if (grid) {
        grid.scrollTop = 0;
    }
}

function initGame() {
    loadProgress();
    loadGalleryProgress();
    
    document.getElementById("catchBtn").addEventListener("click", () => catchPokemon());
    document.getElementById("pcBtn").addEventListener("click", () => openPokedex());
    document.getElementById("closeModalBtn").addEventListener("click", () => closePokedex());
    document.getElementById("galleryBtn").addEventListener("click", () => openGallery());
    document.getElementById("closeGalleryBtn").addEventListener("click", () => closeGallery());
    document.getElementById("battleBtn").addEventListener("click", () => openBattle());
    document.getElementById("closeBattleBtn").addEventListener("click", () => closeBattle());
    
    window.addEventListener("click", (e) => {
        const modal = document.getElementById("pokedexModal");
        const galleryModal = document.getElementById("galleryModal");
        const battleModal = document.getElementById("battleModal");
        if (e.target === modal) {
            closePokedex();
        }
        if (e.target === galleryModal) {
            closeGallery();
        }
        if (e.target === battleModal) {
            closeBattle();
        }
    });
    
    renderAchievements();
    updateGalleryProgress();
    startConnectionMonitor();
}

function startInfiniteScroll() {
    const container = document.getElementById('achievementsRow');
    if (!container) return;
    
    if (container.scrollWidth > container.clientWidth) {
        if (scrollInterval) clearInterval(scrollInterval);
        
        scrollInterval = setInterval(() => {
            if (!isPaused && container) {
                container.scrollLeft += scrollSpeed;
                
                if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
                    container.scrollLeft = 0;
                }
                else if (container.scrollLeft <= 0 && scrollSpeed < 0) {
                    container.scrollLeft = container.scrollWidth - container.clientWidth;
                }
            }
        }, 16);
    }
}

function stopInfiniteScroll() {
    if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
}

function setupAchievementInteractions() {
    const container = document.getElementById('achievementsRow');
    if (!container) return;
    
    container.addEventListener('mouseenter', () => {
        isPaused = true;
    });
    
    container.addEventListener('mouseleave', () => {
        isPaused = false;
    });
    
    container.addEventListener('touchstart', () => {
        isPaused = true;
    });
    
    container.addEventListener('touchend', () => {
        setTimeout(() => { isPaused = false; }, 100);
    });
    
    container.addEventListener('wheel', () => {
        isPaused = true;
        setTimeout(() => { isPaused = false; }, 2000);
    });
    
    container.addEventListener('scroll', () => {
        isPaused = true;
        setTimeout(() => { isPaused = false; }, 2000);
    });
}

initGame();