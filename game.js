//var decloration
let siliconCountElement = document.getElementById("siliconCount");
let siliconPerSecElement = document.getElementById("siliconPerSec");
let mineSiliconElement = document.getElementById("mineSilicon");
//auto miner
let buyAutoMinerElement = document.getElementById("buyAutoMiner");
let autoMinerPriceElement = document.getElementById("autoMinerPrice");
let autoMinerCountElement = document.getElementById("autoMinerCount");
//silicon harvester
let buySiliconHarvesterElement = document.getElementById("buySiliconHarvester");
let siliconHarvesterPriceElement = document.getElementById("siliconHarvesterPrice");
let siliconHarvesterCountElement = document.getElementById("siliconHarvesterCount");

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
    autoMiner: {countEl: autoMinerCountElement.textContent, priceEl: autoMinerPriceElement.textContent},
    siliconHarvester: {countEl: siliconCountElement.textContent, priceEl: siliconHarvesterPriceElement.textContent}
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

    for (let key in ui) {
        ui[key].countEl = buildings[key].owned;
        ui[key].priceEl = getBuildingCost(key);
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