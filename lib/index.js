"use strict";

var injectCss = require('@creenv/inject-css');

function ___noop() {}

var ___styleId = "creenv-slider-style";
var ___css = '.creenv-slider-container {\
  position: relative;\
  width: 100%;\
  height: 23px;\
  background: black;\
  cursor: e-resize;\
  border-radius: 30px;\
  user-select: none;\
}\
\
.creenv-slider-progress {\
  position: absolute;\
  width: 0;\
  height: 100%;\
  top: 0; left: 0;\
  background: #c0d6e0;\
  border-radius: 30px;\
  z-index: 10\
}\
\
.creenv-slider-cursor {\
  position: absolute;\
  width: 30px; height: 30px;\
  background: white;\
  left: 30%; top: 50%;\
  transform: translate(-50%,-50%);\
  border-radius: 30px;\
  z-index: 20;\
}';


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

  // we first inject the css into the dom
  injectCss(___css, ___styleId);

  /**
   * Callback function called when slider value changes
   * @type {function} 
   * @public
   */
  this.onChange = onChange;

  /**
   * Callback function called when user releases the click after changing the 
   * slider value 
   * @type {function} 
   * @public
   */
  this.onChangeFinished = onChangeFinished;

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

  /**
   * Left offset in pixels of the slide container 
   * @type {number}
   * @private
   */
  this.x = 0;

  /**
   * Width of the slider container, in px
   * @type {number}
   * @private
   */
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
      (that.onChangeFinished || ___noop)(that.value);
    }
  });

  document.addEventListener("mousemove", function (event) {
    if (that.clicked) {
      that.updateValue(event.pageX);
    }
  });
}

Slider.prototype = {
  /**
   * Updates the value of the slider given the mouse position
   * @param {number} mousePos x position of the mouse relative to the page
   * @private 
   */
  updateValue: function (mousePos) {
    var relativePosition = (mousePos-this.x)/this.width;
    var relativeValue = relativePosition*(this.max-this.min) + this.min;
    var rounded = Math.max(Math.min(this.max, Math.round(relativeValue/this.step)*this.step), this.min);
    var changed = this.value != rounded;
    this.value = rounded;
    if (changed) {
      this.updateGraphics();
      (this.onChange || ___noop)(this.value);
    }
  },

  /**
   * Updates the graphics of the slider given the current value - called
   * after updateValue() is called and a change is detected 
   * @private
   */
  updateGraphics: function () {
    // we clamp the value jic
    var value = Math.max(Math.min(this.max,(this.value),this.min));
    var width = (this.value-this.min)/(this.max-this.min)*100;
    this.progress.style.width = width+"%";
    this.cursor.style.left = width+"%";
  }
}


module.exports = Slider;
