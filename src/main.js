var Slider = require("../lib/index");


let slider = new Slider(20,50,2, 30);
let slider2 = new Slider(0,1000,0.1, 10);

document.body.appendChild(slider.dom);
document.body.appendChild(slider2.dom);