//var decloration
let mineSilicon = document.getElementById("mineSilicon");
let siliconCount = document.getElementById("siliconCount");
let siliconPerSec = document.getElementById("siliconPerSec");
let autoMiners = 1;
let clickPower = 1;
let resources = {
    silicon: 0,
    wafers: 0,
    chips: 0,
    money: 0
}

siliconPerSec.textContent = autoMiners

function giveSilicon(amount) {
    resources.silicon += amount;
    siliconCount.textContent = resources.silicon;
}

mineSilicon.addEventListener("click", function() {
    giveSilicon(clickPower);
})

function tick() {
    giveSilicon(autoMiners);
    console.log("ticked");
}

setInterval(tick, 1000)

/*testing
console.log(resources.silicon);
giveSilicon(1);
console.log(resources.silicon);
*/