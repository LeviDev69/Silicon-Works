//var decloration
let siliconCountElement = document.getElementById("siliconCount");
let siliconPerSecElement = document.getElementById("siliconPerSec");
let mineSiliconElement = document.getElementById("mineSilicon");
let wafersCountElement = document.getElementById("wafersCount");
let chipsCountElement = document.getElementById("chipCount");
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
//crafting
let craftWaferElement = document.getElementById("craftWafer");
let craftChipElement = document.getElementById("craftChip");
//auto miner
let buyAutoMinerElement = document.getElementById("buyAutoMiner");
let autoMinerPriceElement = document.getElementById("autoMinerPrice");
let autoMinerCountElement = document.getElementById("autoMinerCount");
//silicon harvester
let buySiliconHarvesterElement = document.getElementById("buySiliconHarvester");
let siliconHarvesterPriceElement = document.getElementById("siliconHarvesterPrice");
let siliconHarvesterCountElement = document.getElementById("siliconHarvesterCount");

const itemPrices = {
    silicon: 1,
    wafers: 20,
    chips: 150
}

const recipes = {
    wafer: {
        name: "Wafer",
        input: {silicon: 15},
        output: {wafers: 1}
    },
    chip: {
        name: "Chip",
        input: {wafers: 5},
        output: {chips: 1}
    }
}

const buildings = {
    autoMiner: {
        owned: 0,
        baseCost: 15,
        costScale: 1.15,
        production: {silicon: 1}
    },
    siliconHarvester: {
        owned: 0,
        baseCost: 100,
        costScale: 1.15,
        production: {silicon: 5}
    }
}

const buildingUi = {
    autoMiner: {countEl: autoMinerCountElement, priceEl: autoMinerPriceElement},
    siliconHarvester: {countEl: siliconHarvesterCountElement, priceEl: siliconHarvesterPriceElement}
}

const resourceUi = {
    silicon: {countEl: siliconCountElement},
    wafers: {countEl: wafersCountElement},
    chips: {countEl: chipsCountElement},
    money: {countEl: moneyCountElement}
}

let resources = {
    silicon: 0,
    wafers: 0,
    chips: 0,
    money: 0
}

let clickPower = 1;

//functions
function giveSilicon(amount) {
    resources.silicon += amount;
}

function getSiliconPerSecond() {
    let total = 0;
    for (let key in buildings) {
        let building = buildings[key];
        total += building.owned * (building.production?.silicon || 0);
    }
    return total;
}

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
    giveSilicon(getSiliconPerSecond());
}

function guiTick() {
    siliconPerSecElement.textContent = getSiliconPerSecond();
    
    for (let key in resourceUi) {
        resourceUi[key].countEl.textContent = Math.floor(resources[key]);
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
            resources[resource] -= recipe.input[resource];
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

craftWaferElement.addEventListener("click", function() {
    craft("wafer");
})

craftChipElement.addEventListener("click", function() {
    craft("chip");
})

sellOneSiliconElement.addEventListener("click", function() {
    sell("silicon", 1)
})

sellTenSiliconElement.addEventListener("click", function() {
    sell("silicon", 10)
})

sellOneHundredSiliconElement.addEventListener("click", function() {
    sell("silicon", 100)
})

sellOneWaferElement.addEventListener("click", function() {
    sell("wafers", 1)
})

sellTenWaferElement.addEventListener("click", function() {
    sell("wafers", 10)
})

sellOneHundredWaferElement.addEventListener("click", function() {
    sell("wafers", 100)
})

sellOneChipElement.addEventListener("click", function() {
    sell("chips", 1)
})

sellTenChipElement.addEventListener("click", function() {
    sell("chips", 10)
})

sellOneHundredChipElement.addEventListener("click", function() {
    sell("chips", 100)
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
    if (data.resources) resources = data.resources;
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