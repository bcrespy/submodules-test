/**
 * [https://en.wikipedia.org/wiki/HSL_and_HSV]
 * HSL and HSV
 *
 * [http://www.tannerhelland.com/3643/grayscale-image-algorithm-vb6/] 
 * Seven grayscale conversion algorithms (with pseudocode and VB6 source code)
 * Tanner Helland
 * 
 * [https://www.w3.org/TR/WCAG20]
 * Web Content Accessibility Guidelines (WCAG) 2.0
 * Ben Caldwell, Trace R&D Center, University of Wisconsin-Madison
 * Michael Cooper, W3C
 * Loretta Guarino Reid, Google, Inc.
 * Gregg Vanderheiden, Trace R&D Center, University of Wisconsin-Madison
 *
 */



"use strict";


/**
 * Creates a color given the 3 components, which values are in range [0;255],
 * and an optional alpha paramater in range [0;1]
 * 
 * @param {number} red red component 
 * @param {number} green green component
 * @param {number} blue blue component
 * @param {number} alpha the alpha component
 */
function Color (red, green, blue, alpha) {
  if( !(this instanceof Color) ) {
    return new Color.apply(null, arguments);
  }

  /**
   * the red channel value, from 0 to 255
   * @type {number} 
   * @public
   */
  this.r = 0;

  /**
   * the green channel value, from 0 to 255
   * @type {number} 
   * @public
   */
  this.g = 0;

  /**
   * the blue channel value, from 0 to 255
   * @type {number} 
   * @public
   */
  this.b = 0;

  /**
   * the alpha channel value, from 0 to 1
   * @type {number} 
   * @public
   */
  this.a = 0;

  /**
   * an array which stores the color channels, used to fasten some operations
   * @type {Array.<number>}
   * @public
   */
  this.colors = new Array(4);

  if (arguments.length === 3 || arguments.length === 4) {
    this.r = red;
    this.g = green;
    this.b = blue;
    this.a = (alpha === undefined) ? 1 : alpha;
  } else if (arguments.length === 1) {
    return Color.fromHex(red);
  } else {
    return new Color(0,0,0);
  }

  this.colors = [ this.r, this.g, this.b, this.a ];
}


/**
 * Convert a 6 digits string of an hexadecimal color to Color
 * 
 * @param {string} hexString 6 digits string to convert, with or without #
 * @return {Color}
 * @static
 */
Color.fromHex = function (hexString) {
  let matches = hexString.replace(/#/,'').match(/.{1,2}/g);
  return new Color( parseInt(matches[0],16), parseInt(matches[1],16), parseInt(matches[2],16) );
}

/**
 * Creates a Color class from a [h;s;l] array hue saturation luminosity
 * [https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSL]
 * 
 * @param {number} h hue in [0;360] range
 * @param {number} s saturation in [0;1] range
 * @param {number} l luminosty in [0;1] range
 * @return {Color}
 * @static
 */
Color.fromHSL = function (h, s, l) {
  let c = (1 - Math.abs(2*l-1)) * s;
  let hp = h/60;
  let x = c * (1-Math.abs((hp%2)-1));
  let colors;

  if( 0 <= hp && hp < 1 )  colors = [c, x, 0];
  else if( 1 <= hp && hp < 2 ) colors = [x, c, 0];
  else if( 2 <= hp && hp < 3 ) colors = [0, c, x];
  else if( 3 <= hp && hp < 4 ) colors = [0, x, c]; 
  else if( 4 <= hp && hp < 5 ) colors = [x, 0, c];
  else if( 5 <= hp && hp <= 6 ) colors = [c, 0, x];

  let m = l - c / 2;
  return new Color( colors[0], colors[1], colors[2] ).apply(c => (c+m)*255);
}

/**
 * Creates a Color class from hue saturation value
 * [https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV]
 * 
 * @param {number} h hue in [0;360] range
 * @param {number} s saturation in [0;1] range
 * @param {number} v value in [0;1] range
 * @return {Color}
 * @static
 */
Color.fromHSV = function (h, s, v) {
  let c = v * s;
  let hp = h / 60;
  let x = c * (1-Math.abs((hp%2)-1));
  let colors;

  if (0 <= hp && hp < 1)  colors = [c, x, 0];
  else if (1 <= hp && hp < 2) colors = [x, c, 0];
  else if (2 <= hp && hp < 3) colors = [0, c, x];
  else if (3 <= hp && hp < 4) colors = [0, x, c]; 
  else if (4 <= hp && hp < 5) colors = [x, 0, c];
  else if (5 <= hp && hp <= 6) colors = [c, 0, x];

  let m = v-c;
  return new Color( colors[0], colors[1], colors[2] ).apply(c => (c+m)*255);
}

/**
 * Creates a color from an array of 3/4 components [red, green, blue, ?alpha]
 * 
 * @param {Array} colorsArray 3 or 4 components color array
 * @return {Color} the color object which components are those in the array
 * @static
 */
Color.fromArray = function (colorsArray) {
  return new Color( colorsArray[0], colorsArray[1], colorsArray[2], colorsArray[3] );
}


Color.prototype = {

  /**
   * @return {string} a css-valid rgb string
   
  get rgb() {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  },

  /**
   * @return {string} a css-valid rgba string

  get rgba() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  },

  /**
   * @return {string} a css-valid hexadecimal string 
   
  get hex() {
    return `#${this.r.toString(16)}${this.g.toString(16)}${this.b.toString(16)}`;
  },

  /**
   * @returns {Array.<number>} a length-4 array with color components [r,g,b,a]
   */
  toArray: function() {
    return this.colors;
  },

  /**
   * @returns {{r: number, g: number, b: number, a: number}} an object with the color data
   */
  toObject: function() {
    return {
      r: this.r, g: this.g, b: this.b, a: this.a
    };
  },

  /**
   * @return {Color} color with rounded components
   */
  rounded: function() {
    return this.convert(Color, Math.round);
  },

  /**
   * Applies a function func to each of the components of the Color. If alpha is set
   * to true, the function will also be applied to the alpha channel 
   * 
   * @param {function} func the function to apply to each channel
   * @param {?boolean} alpha if the function will be applied to the alpha channel, default false
   * @return {Color} the modified color object
   */
  apply: function (func, alpha) {
    if( alpha === undefined ) alpha = false;

    this.r = func(this.r);
    this.g = func(this.g);
    this.b = func(this.b);
    if( alpha ) this.a = func(this.a);

    return this;
  },

  /**
   * @template T
   * @param {T} Class a class with a 3 params constructor
   * @param {function(number)?} func a function which will be applied to all params
   * @return {T} 
   */
  convert: function (Class, func = x => x) {
    return new Class( func(this.r), func(this.g), func(this.b), func(this.a) );
  },

  /**
   * @param {Color} endColor the color to interpolate with
   * @param {number} t [0;1] interpolate factor
   * @return {Color} the resulting color of the interpolation between this and endColor
   */
  interpolateWith: function (endColor, t) {
    let newColor = [0,0,0];
    for( let i = 0; i < 3; i++ ) {
      newColor[i] = this.colors[i] + (endColor.colors[i] - this.colors[i]) * t;
    }
    this.rgb = newColor;

    return this;
  },

  /**
   * @return {Color} the modified Color, which values are inverted
   */
  invert: function () {
    this.r = 255-this.r;
    this.g = 255-this.g;
    this.b = 255-this.b;
    return this;
  },

  /**
   * Computes the average grayscale value (red+green+blue)/3
   * @return {Color} the grayscale resulting color
   */
  grayscale: function () {
    let gray = (this.r+this.g+this.b)/3;
    this.rgb = [gray, gray, gray];
    return this;
  },

  /**
   * Computes the grayscale value fo the color, using the grayscale luminance formula
   * grayscale = (Red * 0.2126 + Green * 0.7152 + Blue * 0.0722)
   * 
   * @return {Color} the grayscale resulting color
   */
  grayscaleLuminance: function () {
    let gray = this.r * 0.2126 + this.g * 0.7152 + this.b * 0.0722;
    this.rgb = [gray, gray, gray];
    return this;
  },

  /**
   * Green channel only is used to determine the grayscale value innacurate but fast,
   * can work with real images
   * 
   * @return {Color} the grayscale resulting color
   */
  grayscaleFastest: function () {
    this.rgb = [this.g, this.g, this.g];
    return this;
  },

  /**
   * Computes the relative luminance of the color
   * [https://www.w3.org/TR/WCAG20/#relativeluminancedef]
   * 
   * @return {number} the relative luminance of the color
   */
  relativeLuminance: function () {
    let ret = [];
    for( let i = 0; i < 3; i++ ) {
      let component = this.colors[i];
      ret[i] = component <= 10.0164 ? component / 12.92 : Math.pow( (component+14.025)/268.025, 2.4 );
    }
    return ret;
  },

  /**
   * Computes the contrast with the other color
   * [https://www.w3.org/TR/WCAG20/#contrast-ratiodef]
   * 
   * @param {Color} color the other color 
   * @return {number} contrast between the 2 colors 
   */
  contrastWith: function (color) {
    return (this.relativeLuminance()+0.05) / (color.relativeLuminance()+0.05);
  }
}


Object.defineProperties(Color.prototype, {
  rgb: {
    /**
     * @return {string} a css-valid rgb string
     */
    get: function () {
      return `rgb(${this.r}, ${this.g}, ${this.b})`;
    },

    /**
     * @param {Array.<number>} channels a 3d array [r;g;b]
     */
    set: function (channels) {
      this.r = channels[0];
      this.g = channels[1];
      this.b = channels[2];
    }
  },

  rgba: {
    /**
     * @return {string} a css-valid rgba string
     */
    get: function () {
      return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    },

    /**
     * @param {Array.<number>} channels a 4d array [r;g;b;a]
     */
    set: function (channels) {
      this.r = channels[0];
      this.g = channels[1];
      this.b = channels[2];
      this.a = channels[3];
    }
  },

  hex: {
    get: function () {
      return `#${this.r.toString(16)}${this.g.toString(16)}${this.b.toString(16)}`;
    },

    set: function (hex) {
      this.rgb = Color.fromHex(hex).rgb;
    }
  }
});


module.exports = Color;