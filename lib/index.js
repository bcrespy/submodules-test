"use strict";

/**
 * Generates a dom element that trigger events 
 * 
 * @param {?number} min The min of the range covered by the slider (=0)
 * @param {?number} max the max of the range covered by the slider (=100)
 * @param {?number} step the step between each ticks of the slider (=0.5)
 * @param {?number} value the original valeu taken by the slider (=10)
 * @param {?function} onChange callback called on property value changing
 * @param {?function} onChangeFinished callback when property value is done changing
 */
function Slider (min, max, step, value, onChange, onChangeFinished) {
  if (min === undefined) min = 0;
  if (max === undefined) max = 100;
  if (step === undefined) step = 0.5;
  if (value === undefined) value = 10;

  this.min = min;
  this.max = max;
  this.step = step;
  this.value = value;

  /**
   * Contains the elements that can be added to the DOM of the document 
   * @type {HTMLElement}
   * @public
   */
  this.dom = null;

  /**
   * Set to true if the element is clicked
   * @type {boolean}
   * @private
   */
  this.clicked = false;

  this.x = 0;
  this.width = 0;
  this.onChange = onChange;
  this.onChangeFinished = onChangeFinished;

  this.container = document.createElement("div");
  this.container.classList.add("creenv-slider-container");

  this.progress = document.createElement("div");
  this.progress.classList.add("creenv-slider-progress");

  this.cursor = document.createElement("div");
  this.cursor.classList.add("creenv-slider-cursor");

  this.container.appendChild(this.progress);
  this.container.appendChild(this.cursor);
  this.dom = this.container;

  var that = this;

  this.updateGraphics();

  this.dom.addEventListener("mousedown", function(event) {
    // small optimisation, we consider that sliders won't move during the slide process
    var rect = that.dom.getBoundingClientRect();
    that.x = rect.x;
    that.width = rect.width;

    that.clicked = true;
    that.updateValue(event.pageX);
  });

  document.addEventListener("mouseup", function() {
    if (that.clicked) {
      that.clicked = false;
      that.onChangeFinished(that.value);
    }
  });

  document.addEventListener("mousemove", function (event) {
    if (that.clicked) {
      that.updateValue(event.pageX);
    }
  });
}

Slider.prototype = {
  updateValue: function (mousePos) {
    var relativePosition = Math.max(Math.min(1,(mousePos-this.x)/this.width),0);
    var relativeValue = relativePosition*(this.max-this.min) + this.min;
    var rounded = Math.round(relativeValue/this.step)*this.step;
    var changed = this.value != rounded;
    this.value = rounded;
    if (changed) {
      this.updateGraphics();
      this.onChange(this.value);
    }
  },

  updateGraphics: function () {
    // we clamp the value jic
    var value = Math.max(Math.min(this.max,(this.value),this.min));
    var width = (this.value-this.min)/(this.max-this.min)*100;
    this.progress.style.width = width+"%";
    this.cursor.style.left = width+"%";
  }
}


let slider = new Slider(20,50,2, 30, function(val){ console.log(val)}, function(val){console.log("finshed"+val)});

document.body.appendChild(slider.dom);
