//var decloration
let siliconCountElement = document.getElementById("siliconCount");
let siliconPerSecElement = document.getElementById("siliconPerSec");
let mineSiliconElement = document.getElementById("mineSilicon");
let wafersCountElement = document.getElementById("wafersCount");
let chipsCountElement = document.getElementById("chipCount");
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

const ui = {
    autoMiner: {countEl: autoMinerCountElement, priceEl: autoMinerPriceElement},
    siliconHarvester: {countEl: siliconHarvesterCountElement, priceEl: siliconHarvesterPriceElement}
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
    if (resources.silicon >= buildingCost) {
        resources.silicon -= buildingCost;
        buildings[key].owned++;
    }
}

function buildingtick() {
    giveSilicon(getSiliconPerSecond());
}

function guiTick() {
    siliconCountElement.textContent = Math.floor(resources.silicon);
    siliconPerSecElement.textContent = getSiliconPerSecond();
    wafersCountElement.textContent = Math.floor(resources.wafers);
    chipsCountElement.textContent = Math.floor(resources.chips);

    for (let key in ui) {
        ui[key].countEl.textContent = buildings[key].owned;
        ui[key].priceEl.textContent = getBuildingCost(key);
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