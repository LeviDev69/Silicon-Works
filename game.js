//var decloration
let siliconCountElement = document.getElementById("siliconCount");
let siliconPerSecElement = document.getElementById("siliconPerSec");
let mineSiliconElement = document.getElementById("mineSilicon");
let wafersCountElement = document.getElementById("wafersCount");
let wafersPerSecElement = document.getElementById("wafersPerSec");
let chipsCountElement = document.getElementById("chipCount");
let transistorCountElement = document.getElementById("transistorCount");
let moneyCountElement = document.getElementById("moneyCount");
//selling
let sellOneSiliconElement = document.getElementById("sellOneSilicon");
let sellTenSiliconElement = document.getElementById("sellTenSilicon");
let sellOneHundredSiliconElement = document.getElementById("sellOneHundredSilicon");
let sellOneWaferElement = document.getElementById("sellOneWafer");
let sellTenWaferElement = document.getElementById("sellTenWafer");
let sellOneHundredWaferElement = document.getElementById("sellOneHundredWafer");
let sellOneChipElement = document.getElementById("sellOneChip");
let sellTenChipElement = document.getElementById("sellTenChip");
let sellOneHundredChipElement = document.getElementById("sellOneHundredChip");
let sellOneTransistorsElement = document.getElementById("sellOneTransistors");
let sellTenTransistorsElement = document.getElementById("sellTenTransistors");
let sellOneHundredTransistorsElement = document.getElementById("sellOneHundredTransistors");
//crafting
let craftWaferElement = document.getElementById("craftWafer");
let craftChipElement = document.getElementById("craftChip");
let craftTransistorsElement = document.getElementById("craftTransistors");
//auto miner
let buyAutoMinerElement = document.getElementById("buyAutoMiner");
let autoMinerPriceElement = document.getElementById("autoMinerPrice");
let autoMinerCountElement = document.getElementById("autoMinerCount");
//silicon harvester
let buySiliconHarvesterElement = document.getElementById("buySiliconHarvester");
let siliconHarvesterPriceElement = document.getElementById("siliconHarvesterPrice");
let siliconHarvesterCountElement = document.getElementById("siliconHarvesterCount");
//WafersFabricator
let buyWafersFabricatorElement = document.getElementById("buyWafersFabricator");
let wafersFabricatorPriceElement = document.getElementById("wafersFabricatorPrice");
let wafersFabricatorCountElement = document.getElementById("wafersFabricatorCount");

const itemPrices = {
    silicon: 1,
    wafers: 20,
    chips: 150,
    transistors: 1000
}

const recipes = {
    wafers: {
        name: "Wafer",
        input: {silicon: 15},
        output: {wafers: 1}
    },
    chip: {
        name: "Chip",
        input: {wafers: 5},
        output: {chips: 1}
    },
    transistors: {
        name: "Transistor",
        input: {chips: 5, silicon: 10},
        output: {transistors: 1}
    }
}

const buildings = {
    autoMiner: {
        owned: 0,
        baseCost: 15,
        costScale: 1.15,
        production: {output: {silicon: 1}}
    },
    siliconHarvester: {
        owned: 0,
        baseCost: 100,
        costScale: 1.15,
        production: {output: {silicon: 5}}
    },
    wafersFabricator: {
        owned: 0,
        baseCost: 600,
        costScale: 1.17,
        production: {input: {silicon: 15}, output: {wafers: 1}}
    }
}

const buildingUi = {
    autoMiner: {countEl: autoMinerCountElement, priceEl: autoMinerPriceElement},
    siliconHarvester: {countEl: siliconHarvesterCountElement, priceEl: siliconHarvesterPriceElement},
    wafersFabricator: {countEl: wafersFabricatorCountElement, priceEl: wafersFabricatorPriceElement}
}

const resourceUi = {
    silicon: {countEl: siliconCountElement, perSecEl: siliconPerSecElement},
    wafers: {countEl: wafersCountElement, perSecEl: wafersPerSecElement},
    chips: {countEl: chipsCountElement},
    transistors: {countEl: transistorCountElement},
    money: {countEl: moneyCountElement}
}

let resources = {
    silicon: 0,
    wafers: 0,
    chips: 0,
    transistors: 0,
    money: 0
}

let lastDelta = resourcePerSecondCalc();
let clickPower = 1;

//functions
function giveSilicon(amount) {
    resources.silicon += amount;
}

function giveWafers(amount) {
    resources.wafers += amount;
}

function giveChips(amount) {
    resources.chips += amount;
}

function giveTransistors(amount) {
    resources.transistors += amount
}

/*
legacy
function getSiliconPerSecond() {
    let total = 0;
    for (let key in buildings) {
        let building = buildings[key];
        total += building.owned * (building.production?.output.silicon || 0);
    }
    return total;
}
*/

function getBuildingCost(key) {
    return Math.round(buildings[key].baseCost * (buildings[key].costScale**buildings[key].owned));
}

function buyBuilding(key) {
    let buildingCost = getBuildingCost(key);
    if (resources.money >= buildingCost) {
        resources.money -= buildingCost;
        buildings[key].owned++;
    }
}

function buildingtick() {
    const delta = resourcePerSecondCalc();

    for (let r in delta.input) {
        resources[r] -= delta.input[r];
    }

    for (let r in delta.output) {
        resources[r] = (resources[r] || 0) + delta.output[r];
    }

    lastDelta = delta;
}


function guiTick() {
    const delta = lastDelta;
    
    for (let key in resourceUi) {
        resourceUi[key].countEl.textContent = Math.floor(resources[key]);
        if(resourceUi[key].perSecEl) {
            resourceUi[key].perSecEl.textContent = (delta.output[key] || 0) - (delta.input[key] || 0);
        }
    }

    for (let key in buildingUi) {
        buildingUi[key].countEl.textContent = buildings[key].owned;
        buildingUi[key].priceEl.textContent = getBuildingCost(key);
    }
}

function sell(key, amount) {
    if ((resources[key] || 0) >= amount) {
        resources[key] -= amount;
        resources.money += (itemPrices[key]*amount);
    }
}

function resourcePerSecondCalc() {
    let input = {};
    let output = {};

    for (let key in buildings) {
        const b = buildings[key];
        const prod = b.production;

        const inMap = prod.input || {};
        const outMap = prod.output || {};

        let cycles = b.owned;

        for (let r in inMap) {
            const req = inMap[r];
            const available = resources[r] || 0;
            const possible = Math.floor(available / req);
            cycles = Math.min(cycles, possible);
        }

        if (cycles <= 0) continue;

        for (let r in inMap) {
            input[r] = (input[r] || 0) + inMap[r] * cycles;
        }

        for (let r in outMap) {
            output[r] = (output[r] || 0) + outMap[r] * cycles;
        }
    }

    return { input, output };
}


//crafting
function canCraft(recipeKey) {
    let recipe = recipes[recipeKey];
    for (const resource in recipe.input) {
        if (recipe.input[resource] > (resources[resource]||0)) {
            return false;
        }
        
        
    }
    return true;
}

function craft(recipeKey) {
    let recipe = recipes[recipeKey];
    if (canCraft(recipeKey)) {
        for (const resource in recipe.input) {
            resources[resource] = (resources[resource] || 0) - recipe.input[resource];
        }
        for (const resource in recipe.output) {
            resources[resource] = (resources[resource] || 0) + recipe.output[resource];
        }
    }
}

//butons
mineSiliconElement.addEventListener("click", function() {
    giveSilicon(clickPower);
})

buyAutoMinerElement.addEventListener("click", function() {
    buyBuilding("autoMiner");
})

buySiliconHarvesterElement.addEventListener("click", function() {
    buyBuilding("siliconHarvester");
})

buyWafersFabricatorElement.addEventListener("click", function() {
    buyBuilding("wafersFabricator");
})

craftWaferElement.addEventListener("click", function() {
    craft("wafers");
})

craftChipElement.addEventListener("click", function() {
    craft("chip");
})

craftTransistorsElement.addEventListener("click", function() {
    craft("transistors");
})

sellOneSiliconElement.addEventListener("click", function() {
    sell("silicon", 1);
})

sellTenSiliconElement.addEventListener("click", function() {
    sell("silicon", 10);
})

sellOneHundredSiliconElement.addEventListener("click", function() {
    sell("silicon", 100);
})

sellOneWaferElement.addEventListener("click", function() {
    sell("wafers", 1);
})
sellTenWaferElement.addEventListener("click", function() {
    sell("wafers", 10);
})

sellOneHundredWaferElement.addEventListener("click", function() {
    sell("wafers", 100);
})

sellOneChipElement.addEventListener("click", function() {
    sell("chips", 1);
})

sellTenChipElement.addEventListener("click", function() {
    sell("chips", 10);
})

sellOneHundredChipElement.addEventListener("click", function() {
    sell("chips", 100);
})

sellOneTransistorsElement.addEventListener("click", function() {
    sell("transistors", 1);
})

sellTenTransistorsElement.addEventListener("click", function() {
    sell("transistors", 10);
})

sellOneHundredTransistorsElement.addEventListener("click", function() {
    sell("transistors", 100);
})


//saving
const SAVE_KEY = "siliconWorksSave_v1"

function saveGame() {
    const saveData = {
        resources,
        buildings
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
}
function loadGame() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.resources) {
        for(const key in resources) {
            if(key in data.resources) {
                resources[key] = data.resources[key] ?? resources[key];
            }
        }
    }
    if (data.buildings) {
        for (const key in buildings) {
            if (data.buildings[key]) {
                buildings[key].owned = data.buildings[key].owned ?? buildings[key].owned;
            }
        }
    }
}

loadGame();
guiTick();

//tick/sec
setInterval(saveGame, 5000);
setInterval(buildingtick, 1000);
setInterval(guiTick, 100);

//dev commands:
function resetInventory() {
    for (let key in resources) {
        resources[key] = 0;
    }
}

function resetBuildings() {
    for (let key in buildings) {
        buildings[key].owned = 0;
    }
}

function reset() {
    resetInventory();
    resetBuildings();
    guiTick();
    saveGame();
}