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
let sellResourceElements = {
    silicon: {
        sellOne: document.getElementById("sellOneSilicon"),
        sellTen: document.getElementById("sellTenSilicon"),
        sellOneHundred: document.getElementById("sellOneHundredSilicon"),
        sellAll: {buttonEl: document.getElementById("sellAllSilicon"), textEl: document.getElementById("sellAllSiliconText")}
    },
    wafers: {
        sellOne: document.getElementById("sellOneWafer"),
        sellTen: document.getElementById("sellTenWafer"),
        sellOneHundred: document.getElementById("sellOneHundredWafer"),
        sellAll: {buttonEl: document.getElementById("sellAllWafer"), textEl: document.getElementById("sellAllWaferText")}
    },
    chips: {
        sellOne: document.getElementById("sellOneChip"),
        sellTen: document.getElementById("sellTenChip"),
        sellOneHundred: document.getElementById("sellOneHundredChip"),
        sellAll: {buttonEl: document.getElementById("sellAllChip"), textEl: document.getElementById("sellAllChipText")}
    },
    transistors: {
        sellOne: document.getElementById("sellOneTransistors"),
        sellTen: document.getElementById("sellTenTransistors"),
        sellOneHundred: document.getElementById("sellOneHundredTransistors"),
        sellAll: {buttonEl: document.getElementById("sellAllTransistors"), textEl: document.getElementById("sellAllTransistorsText")}
    }
}

//crafting
let craftingElements = {
    wafers: document.getElementById("craftWafer"),
    chips: document.getElementById("craftChip"),
    transistors: document.getElementById("craftTransistors")
}

let buildingElements = {
    autoMiner: {
        buyEl: document.getElementById("buyAutoMiner"),
        priceEl: document.getElementById("autoMinerPrice"),
        countEl: document.getElementById("autoMinerCount")
    },
    siliconHarvester: {
        buyEl: document.getElementById("buySiliconHarvester"),
        priceEl: document.getElementById("siliconHarvesterPrice"),
        countEl: document.getElementById("siliconHarvesterCount")
    },
    wafersFabricator: {
        buyEl: document.getElementById("buyWafersFabricator"),
        priceEl: document.getElementById("wafersFabricatorPrice"),
        countEl: document.getElementById("wafersFabricatorCount")
    },
    czFurnace: {
        buyEl: document.getElementById("buyCzFurnace"),
        priceEl: document.getElementById("czFurnacePrice"),
        countEl: document.getElementById("czFurnaceCount")
    }
    chipsAssembler: {
        buyEl: document.getElementById("buyChipsAssembler"),
        priceEl: document.getElementById("chipsAssemblerPrice"),
        countEl: document.getElementById("chipsAssemblerCount")
    },
    transistorsAssembler: {
        buyEl: document.getElementById("buyTransistorsAssembler"),
        priceEl: document.getElementById("transistorsAssemblerPrice"),
        countEl: document.getElementById("transistorsAssemblerCount")
    }
}

const itemPrices = {
    silicon: 1,
    wafers: 20,
    chips: 150,
    transistors: 1500
}

const recipes = {
    wafers: {
        name: "Wafer",
        input: {silicon: 15},
        output: {wafers: 1}
    },
    chips: {
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
        costScale: 1.10,
        production: {output: {silicon: 1}}
    },
    siliconHarvester: {
        owned: 0,
        baseCost: 100,
        costScale: 1.10,
        production: {output: {silicon: 5}}
    },
    wafersFabricator: {
        owned: 0,
        baseCost: 10000,
        costScale: 1.20,
        production: {input: {silicon: 15}, output: {wafers: 1}}
    },
    czFurnace: {
        owned: 0,
        baseCost: 75000,
        costScale: 1.20,
        production: {input(silicon: 75), output: {wafers: 5}}
    },
    chipsAssembler: {
        owned: 0,
        baseCost: 50000,
        costScale: 1.20,
        production: {input: {wafers: 5}, output: {chips: 1}}
    },
    transistorsAssembler: {
        owned: 0,
        baseCost: 500000,
        costScale: 1.17,
        production: {input: {chips: 5, silicon: 10}, output: {transistors: 1}}
    }
}


const resourceUi = {
    silicon: {countEl: siliconCountElement, perSecEl: siliconPerSecElement},
    wafers: {countEl: wafersCountElement, perSecEl: wafersPerSecElement},
    chips: {countEl: chipsCountElement, perSecEl: chipsPerSecElement},
    transistors: {countEl: transistorCountElement, perSecEl: transistorsPerSecElement},
    money: {countEl: moneyCountElement}
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

function getSellTier(resourceKey) {
    let have = resources[resourceKey] || 0;
    let returnVal = {one: false, ten: false, oneHundred: false, all: false};
    if(have>=1) returnVal.one = true;
    if(have>=10) returnVal.ten = true;
    if(have>=100) returnVal.oneHundred = true;
    if(have>0) returnVal.all = true;
    return returnVal;
}

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
    for (let resource in sellResourceElements) {
        let sellTier = getSellTier(resource);
        sellResourceElements[resource].sellOne.disabled = !sellTier.one
        sellResourceElements[resource].sellTen.disabled = !sellTier.ten
        sellResourceElements[resource].sellOneHundred.disabled = !sellTier.oneHundred
        sellResourceElements[resource].sellAll.buttonEl.disabled = !sellTier.all
    }

    let sellModeText = (sellMode ? "Sell" : "Buy");
    for (let element of sellModeTextClass) {
        element.textContent = sellModeText;
    }

    for (let button in craftingElements) {
        if (!canCraft(button)) {
            craftingElements[button].disabled = true;
        } else {
            craftingElements[button].disabled = false;
        }
    }

    for (let key in buildingElements) {
        if (resources.money < getBuildingCost(key) && (!sellMode)) {
            buildingElements[key].buyEl.disabled = true;
        } else if (sellMode) {
            if(buildings[key].owned<=0) {
                buildingElements[key].buyEl.disabled = true;
            } else {
                buildingElements[key].buyEl.disabled = false;
            }
        } else {
            buildingElements[key].buyEl.disabled = false;
        }
    }

    for (let element in sellResourceElements) {
        sellResourceElements[element].sellAll.textEl.textContent = getResourceSellPrice(element, resources[element]);
    }

    const delta = lastDelta;
    
    for (let key in resourceUi) {
        resourceUi[key].countEl.textContent = Math.floor(resources[key]);
        if(resourceUi[key].perSecEl) {
            resourceUi[key].perSecEl.textContent = (delta.output[key] || 0) - (delta.input[key] || 0);
        }
    }

    for (let key in buildingElements) {
        buildingElements[key].countEl.textContent = buildings[key].owned;
        if (sellMode) {
            buildingElements[key].priceEl.textContent = getBuildingSellPrice(key);
        } else {
            buildingElements[key].priceEl.textContent = getBuildingCost(key);
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

buildingElements.autoMiner.buyEl.addEventListener("click", function() {
    buyButton("autoMiner");
})

buildingElements.siliconHarvester.buyEl.addEventListener("click", function() {
    buyButton("siliconHarvester");
})

buildingElements.wafersFabricator.buyEl.addEventListener("click", function() {
    buyButton("wafersFabricator");
})
buidingElements.czFurnace.buyEl.addEventListener("click", function() {
    buyButton("czFurnace");
})

buildingElements.chipsAssembler.buyEl.addEventListener("click", function() {
    buyButton("chipsAssembler");
})

buildingElements.transistorsAssembler.buyEl.addEventListener("click", function() {
    buyButton("transistorsAssembler");
})

craftingElements.wafers.addEventListener("click", function() {
    craft("wafers");
})

craftingElements.chips.addEventListener("click", function() {
    craft("chips");
})

craftingElements.transistors.addEventListener("click", function() {
    craft("transistors");
})

sellResourceElements.silicon.sellAll.buttonEl.addEventListener("click", function() {
    sellResource("silicon", 0)
})

sellResourceElements.silicon.sellOne.addEventListener("click", function() {
    sellResource("silicon", 1);
})

sellResourceElements.silicon.sellTen.addEventListener("click", function() {
    sellResource("silicon", 10);
})

sellResourceElements.silicon.sellOneHundred.addEventListener("click", function() {
    sellResource("silicon", 100);
})

sellResourceElements.wafers.sellAll.buttonEl.addEventListener("click", function(){
    sellResource("wafers", 0)
})

sellResourceElements.wafers.sellOne.addEventListener("click", function() {
    sellResource("wafers", 1);
})
sellResourceElements.wafers.sellTen.addEventListener("click", function() {
    sellResource("wafers", 10);
})

sellResourceElements.wafers.sellOneHundred.addEventListener("click", function() {
    sellResource("wafers", 100);
})

sellResourceElements.chips.sellAll.buttonEl.addEventListener("click", function() {
    sellResource("chips", 0)
})

sellResourceElements.chips.sellOne.addEventListener("click", function() {
    sellResource("chips", 1);
})

sellResourceElements.chips.sellTen.addEventListener("click", function() {
    sellResource("chips", 10);
})

sellResourceElements.chips.sellOneHundred.addEventListener("click", function() {
    sellResource("chips", 100);
})

sellResourceElements.transistors.sellAll.buttonEl.addEventListener("click", function() {
    sellResource("transistors", 0)
})

sellResourceElements.transistors.sellOne.addEventListener("click", function() {
    sellResource("transistors", 1);
})

sellResourceElements.transistors.sellTen.addEventListener("click", function() {
    sellResource("transistors", 10);
})

sellResourceElements.transistors.sellOneHundred.addEventListener("click", function() {
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
