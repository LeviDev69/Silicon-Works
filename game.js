//var decloration
let siliconCountElement = document.getElementById("siliconCount");
let siliconPerSecElement = document.getElementById("siliconPerSec");
let mineSiliconElement = document.getElementById("mineSilicon");
let wafersCountElement = document.getElementById("wafersCount");
let wafersPerSecElement = document.getElementById("wafersPerSec");
let chipsCountElement = document.getElementById("chipCount");
let chipsPerSecElement = document.getElementById("chipsPerSec");
let transistorCountElement = document.getElementById("transistorCount");
let transistorsPerSecElement = document.getElementById("transistorsPerSec");
let moneyCountElement = document.getElementById("moneyCount");
let sellModeToggleElement = document.getElementById("buyModeToggle");
let sellModeTextClass = document.querySelectorAll(".sellModeText");
//selling
let sellOneSiliconElement = document.getElementById("sellOneSilicon");
let sellTenSiliconElement = document.getElementById("sellTenSilicon");
let sellOneHundredSiliconElement = document.getElementById("sellOneHundredSilicon");
let sellAllSiliconElement = document.getElementById("sellAllSilicon");
let sellAllSiliconTextElement = document.getElementById("sellAllSiliconText");

let sellOneWaferElement = document.getElementById("sellOneWafer");
let sellTenWaferElement = document.getElementById("sellTenWafer");
let sellOneHundredWaferElement = document.getElementById("sellOneHundredWafer");
let sellAllWaferElement = document.getElementById("sellAllWafer");
let sellAllWaferTextElement = document.getElementById("sellAllWaferText");

let sellOneChipElement = document.getElementById("sellOneChip");
let sellTenChipElement = document.getElementById("sellTenChip");
let sellOneHundredChipElement = document.getElementById("sellOneHundredChip");
let sellAllChipElement = document.getElementById("sellAllChip");
let sellAllChipTextElement = document.getElementById("sellAllChipText");

let sellOneTransistorsElement = document.getElementById("sellOneTransistors");
let sellTenTransistorsElement = document.getElementById("sellTenTransistors");
let sellOneHundredTransistorsElement = document.getElementById("sellOneHundredTransistors");
let sellAllTransistorsElement = document.getElementById("sellAllTransistors");
let sellAllTransistorsTextElement = document.getElementById("sellAllTransistorsText");
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
//chipsAssembler
let buyChipsAssemblerElement = document.getElementById("buyChipsAssembler");
let chipsAssemblerPriceElement = document.getElementById("chipsAssemblerPrice");
let chipsAssemblerCountElement = document.getElementById("chipsAssemblerCount");
//transistorsAssembler
let buyTransistorsAssemblerElement = document.getElementById("buyTransistorsAssembler");
let transistorsAssemblerPriceElement = document.getElementById("transistorsAssemblerPrice");
let transistorsAssemblerCountElement = document.getElementById("transistorsAssemblerCount");

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
    },
    chipsAssembler: {
        owned: 0,
        baseCost: 4000,
        costScale: 1.17,
        production: {input: {wafers: 5}, output: {chips: 1}}
    },
    transistorsAssembler: {
        owned: 0,
        baseCost: 20000,
        costScale: 1.17,
        production: {input: {chips: 5, silicon: 10}, output: {transistors: 1}}
    }
}

const buildingUi = {
    autoMiner: {countEl: autoMinerCountElement, priceEl: autoMinerPriceElement},
    siliconHarvester: {countEl: siliconHarvesterCountElement, priceEl: siliconHarvesterPriceElement},
    wafersFabricator: {countEl: wafersFabricatorCountElement, priceEl: wafersFabricatorPriceElement},
    chipsAssembler: {countEl: chipsAssemblerCountElement, priceEl: chipsAssemblerPriceElement},
    transistorsAssembler: {countEl: transistorsAssemblerCountElement, priceEl: transistorsAssemblerPriceElement}
}

const resourceUi = {
    silicon: {countEl: siliconCountElement, perSecEl: siliconPerSecElement},
    wafers: {countEl: wafersCountElement, perSecEl: wafersPerSecElement},
    chips: {countEl: chipsCountElement, perSecEl: chipsPerSecElement},
    transistors: {countEl: transistorCountElement, perSecEl: transistorsPerSecElement},
    money: {countEl: moneyCountElement}
}

const sellAllResourceUi = {
    silicon: {priceEl: sellAllSiliconTextElement, buttonEl: sellAllSiliconElement},
    wafers: {priceEl: sellAllWaferTextElement, buttonEl: sellAllWaferElement},
    chips: {priceEl: sellAllChipTextElement, buttonEl: sellAllChipElement},
    transistors: {priceEl: sellAllTransistorsTextElement, buttonEl: sellAllTransistorsElement}
}

let resources = {
    silicon: 0,
    wafers: 0,
    chips: 0,
    transistors: 0,
    money: 0
}

let sellMode = false;
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

function getBuildingSellPrice(key) {
    if ((buildings[key].owned || 0) > 0) {
        return Math.floor(0.5*(buildings[key].baseCost * (buildings[key].costScale ** (buildings[key].owned -1))));
    } else return 0;
    
}

function buyBuilding(key) {
    if (key in buildings) {
        let buildingCost = getBuildingCost(key);
        if (resources.money >= buildingCost) {
            resources.money -= buildingCost;
            buildings[key].owned++;
        }
    }
}

function sellBuilding(key) {
    let buildingPrice = getBuildingSellPrice(key);
    if (buildingPrice !== 0) {
        buildings[key].owned--;
        resources.money += buildingPrice;
    }
}

function buyButton(key) {
    if (sellMode) {
        sellBuilding(key);
    } else {
        buyBuilding(key);
    }
}

function getResourceSellPrice(key, amount) {
  return (itemPrices[key] || 0) * amount;
}

function sellResource(key, amount) {
  if (!(key in resources)) return; 
  amount = Math.floor(amount);

  if (amount === 0) {
    const sellAmount = resources[key] || 0;
    if (sellAmount <= 0) return;
    resources.money += getResourceSellPrice(key, sellAmount);
    resources[key] = 0;
    return;
  }

  if (amount < 0) return; 

  const have = resources[key] || 0;
  if (have >= amount) {
    resources[key] = have - amount;
    resources.money += getResourceSellPrice(key, amount);
  }
} 



function buildingtick() {
    const delta = resourcePerSecondCalc();

    for (let resource in delta.input) {
        resources[resource] = (resources[resource] || 0) - delta.input[resource];
    }

    for (let resource in delta.output) {
        resources[resource] = (resources[resource] || 0) + delta.output[resource];
    }

    lastDelta = delta;
}


function guiTick() {
    let sellModeText = (sellMode ? "Sell" : "Buy");

    for (let element of sellModeTextClass) {
        element.textContent = sellModeText;
    }

    for (let element in sellAllResourceUi) {
        sellAllResourceUi[element].priceEl.textContent = getResourceSellPrice(element, resources[element]);
    }

    const delta = lastDelta;
    
    for (let key in resourceUi) {
        resourceUi[key].countEl.textContent = Math.floor(resources[key]);
        if(resourceUi[key].perSecEl) {
            resourceUi[key].perSecEl.textContent = (delta.output[key] || 0) - (delta.input[key] || 0);
        }
    }

    for (let key in buildingUi) {
        buildingUi[key].countEl.textContent = buildings[key].owned;
        if (sellMode) {
            buildingUi[key].priceEl.textContent = getBuildingSellPrice(key);
        } else {
            buildingUi[key].priceEl.textContent = getBuildingCost(key);
        }
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
    buyButton("autoMiner");
})

buySiliconHarvesterElement.addEventListener("click", function() {
    buyButton("siliconHarvester");
})

buyWafersFabricatorElement.addEventListener("click", function() {
    buyButton("wafersFabricator");
})
buyChipsAssemblerElement.addEventListener("click", function() {
    buyButton("chipsAssembler");
})

buyTransistorsAssemblerElement.addEventListener("click", function() {
    buyButton("transistorsAssembler");
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

sellAllResourceUi.silicon.buttonEl.addEventListener("click", function() {
    sellResource("silicon", 0)
})

sellOneSiliconElement.addEventListener("click", function() {
    sellResource("silicon", 1);
})

sellTenSiliconElement.addEventListener("click", function() {
    sellResource("silicon", 10);
})

sellOneHundredSiliconElement.addEventListener("click", function() {
    sellResource("silicon", 100);
})

sellAllResourceUi.wafers.buttonEl.addEventListener("click", function(){
    sellResource("wafers", 0)
})

sellOneWaferElement.addEventListener("click", function() {
    sellResource("wafers", 1);
})
sellTenWaferElement.addEventListener("click", function() {
    sellResource("wafers", 10);
})

sellOneHundredWaferElement.addEventListener("click", function() {
    sellResource("wafers", 100);
})

sellAllResourceUi.chips.buttonEl.addEventListener("click", function() {
    sellResource("chips", 0)
})

sellOneChipElement.addEventListener("click", function() {
    sellResource("chips", 1);
})

sellTenChipElement.addEventListener("click", function() {
    sellResource("chips", 10);
})

sellOneHundredChipElement.addEventListener("click", function() {
    sellResource("chips", 100);
})

sellAllResourceUi.transistors.buttonEl.addEventListener("click", function() {
    sellResource("transistors", 0)
})

sellOneTransistorsElement.addEventListener("click", function() {
    sellResource("transistors", 1);
})

sellTenTransistorsElement.addEventListener("click", function() {
    sellResource("transistors", 10);
})

sellOneHundredTransistorsElement.addEventListener("click", function() {
    sellResource("transistors", 100);
})

sellModeToggleElement.addEventListener("change", function() {
    sellMode = sellModeToggleElement.checked;
});

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