'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OKBlock = function () {
  function OKBlock(c) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { pattern: null };

    _classCallCheck(this, OKBlock);

    if (options.pattern == null) {
      console.error('options.pattern is not set.');return;
    }
    if (this.constructor.patterns[options.pattern] == null) {
      console.error(options.pattern + ' pattern is undefined.');return;
    }

    this._PATTERN_NAME_PROP = options.pattern;
    this._PATTERN_PROP = this.constructor.patterns[options.pattern];
    this._IS_ANIMATING_PROP = false;
    this._RESUME_PROP = null;
    this._CHAR_PROP = null;
    this._DOM_PROP = _createDom.call(this);
    this._CANSELLER_PROP = function () {};

    options = Object.assign({}, this._PATTERN_PROP._DEFAULT_OPTIONS, options);
    var _options = options,
        size = _options.size,
        displayTime = _options.displayTime,
        duration = _options.duration,
        easing = _options.easing,
        loop = _options.loop,
        random = _options.random,
        pedal = _options.pedal;

    // --- options ---

    this.displayTime = +displayTime;
    this.duration = +duration;
    this.loop = !!loop;
    this.random = !!random;
    this.easing = easing || 'cubic-bezier(.26,.92,.41,.98)';
    this.pedal = !!pedal;

    if (typeof size === 'number' && size >= 0) {
      this.size = size;
    } else {
      this.size = 100;
    }

    this.to(c);
  }

  _createClass(OKBlock, [{
    key: 'to',
    value: function to(c) {
      var _c = c && c.toLowerCase && c.toLowerCase();
      if (!this._PATTERN_PROP._formationTable[_c]) {
        return false;
      }
      if (this._CHAR_PROP === _c) {
        return false;
      }
      _changeStyle.call(this, _c);
      this._CHAR_PROP = _c;
      return true;
    }
  }, {
    key: 'appendTo',
    value: function appendTo(parent) {
      parent.appendChild(this._DOM_PROP);
    }
  }, {
    key: 'stopAnimate',
    value: function stopAnimate() {
      this._IS_ANIMATING_PROP = false;
    }
  }, {
    key: 'resumeAnimate',
    value: function resumeAnimate() {
      if (this._RESUME_PROP == null) {
        return;
      }
      this._IS_ANIMATING_PROP = true;
      this._RESUME_PROP();
    }
  }, {
    key: 'animateFromString',
    value: function animateFromString(str) {
      var _this = this;

      var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


      this._IS_ANIMATING_PROP = true;
      this._RESUME_PROP = null;
      this.options = opt;

      [].concat(_toConsumableArray(str)).reduce(function (p, c, idx) {
        // p = Promise.resolve(); c = str[idx];
        var isLast = idx === str.length - 1;
        return p.then(function () {
          return new Promise(function (resolve, reject) {
            _this._CANSELLER_PROP = reject;
            if (_this._RANDOM_PROP) {
              var _c = str[Math.random() * str.length | 0];
              _this.to(_c);
            } else {
              _this.to(c);
            }
            if (isLast) {
              if (_this._LOOP_PROP) {
                setTimeout(function () {
                  resolve();
                  _this.animateFromString.call(_this, str);
                }, _this._DISPLAY_TIME_PROP);
              } else {
                setTimeout(reject, _this._DISPLAY_TIME_PROP);
              }
              return;
            }
            if (!_this._IS_ANIMATING_PROP) {
              _this._RESUME_PROP = resolve;
            } else {
              setTimeout(resolve, _this._DISPLAY_TIME_PROP);
            }
          });
        });
      }, Promise.resolve()).catch(function (err) {
        _this._IS_ANIMATING_PROP = false;
        console.log('OKBlock: cansel before animation.');
        console.log(err);
      });
    }

    /**
     * Setter and Getter
     */

    // --- options ---

  }, {
    key: 'options',
    set: function set() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      Object.assign(this, options);
    },
    get: function get() {
      var size = this.size,
          displayTime = this.displayTime,
          duration = this.duration,
          easing = this.easing,
          loop = this.loop,
          random = this.random,
          pedal = this.pedal;

      return { size: size, displayTime: displayTime, duration: duration, easing: easing, loop: loop, random: random, pedal: pedal };
    }

    // --- size ---

  }, {
    key: 'size',
    set: function set(size) {
      if (size == null) {
        return;
      }
      if (typeof size === 'number' && size >= 0) {
        var domStyle = this._DOM_PROP.style;
        domStyle.width = size + 'px';
        domStyle.height = size + 'px';
      } else {
        console.error('OKBlock.size should zero or positive number.');
      }
    },
    get: function get() {
      return +this._DOM_PROP.style.width.replace('px', '');
    }

    // --- displayTime ---

  }, {
    key: 'displayTime',
    set: function set(time) {
      if (time == null) {
        return;
      }
      if (typeof time === 'number' && time > 0) {
        this._DISPLAY_TIME_PROP = time;
      } else {
        console.error('OKBlock.displayTime should be positive number.');
      }
    },
    get: function get() {
      return this._DISPLAY_TIME_PROP;
    }

    // --- duration ---

  }, {
    key: 'duration',
    set: function set(time) {
      if (time == null) {
        return;
      }
      if (typeof time === 'number' && time >= 0) {
        this._DURATION_PROP = time;
        _updateTransitionConfig.call(this);
      } else {
        console.error('OKBlock.duration should be zero or positive number.', time);
      }
    },
    get: function get() {
      return this._DURATION_PROP;
    }

    // --- easing ---

  }, {
    key: 'easing',
    set: function set(val) {
      if (val == null) {
        return;
      }
      this._EASING_PROP = val;
      _updateTransitionConfig.call(this);
    },
    get: function get() {
      return this._EASING_PROP;
    }

    // --- loop ---

  }, {
    key: 'loop',
    set: function set(bool) {
      if (bool == null) {
        return;
      }
      this._LOOP_PROP = bool;
    },
    get: function get() {
      return this._LOOP_PROP;
    }

    // --- random ---

  }, {
    key: 'random',
    set: function set(bool) {
      if (bool == null) {
        return;
      }
      this._RANDOM_PROP = bool;
    },
    get: function get() {
      return this._RANDOM_PROP;
    }

    // --- pedal ---

  }, {
    key: 'pedal',
    set: function set(bool) {
      if (bool == null) {
        return;
      }
      this._PEDAL_PROP = bool;
    },
    get: function get() {
      return this._PEDAL_PROP;
    }

    // --- pattern ---

  }, {
    key: 'pattern',
    get: function get() {
      return this._PATTERN_NAME_PROP;
    }

    // --- dom ---

  }, {
    key: 'dom',
    get: function get() {
      return this._DOM_PROP;
    }

    // --- char ---

  }, {
    key: 'char',
    get: function get() {
      return this._CHAR_PROP;
    }

    // --- isAnimating ---

  }, {
    key: 'isAnimating',
    get: function get() {
      return this._IS_ANIMATING_PROP;
    }

    // --- allValidChars ---

  }, {
    key: 'allValidChars',
    get: function get() {
      return Object.keys(this._PATTERN_PROP._formationTable);
    }
  }], [{
    key: 'define',
    value: function define(name, obj) {
      if (!('_DEFAULT_OPTIONS' in obj) || !('_BASE_DOM' in obj) || !('_TRANSITION_PROPS' in obj) || !('_formationTable' in obj)) {
        console.error('Pattern is invalid.');
      }
      this.patterns[name] = obj;
    }
  }]);

  return OKBlock;
}();

function _createDom() {
  return this._PATTERN_PROP._BASE_DOM.cloneNode(true);
}

function _changeStyle(c) {
  // @bind this
  var oldC = this._CHAR_PROP;
  var newFormation = this._PATTERN_PROP._formationTable[c];
  if (!newFormation) {
    return;
  }
  var diffFormation = void 0;
  if (oldC) {
    var oldFormation = this._PATTERN_PROP._formationTable[oldC];
    diffFormation = newFormation.map(function (newStr, idx) {
      var oldStr = oldFormation[idx];
      var newStrIsArr = Array.isArray(newStr);
      var oldStrIsArr = Array.isArray(oldStr);
      if (newStrIsArr && oldStrIsArr) {
        var strIsNotEq = newStr[0] !== oldStr[0];
        var posIsNotEq = newStr[1] !== oldStr[1];
        return strIsNotEq || posIsNotEq ? newStr : false;
      } else {
        if (newStrIsArr || oldStrIsArr) {
          return newStr;
        }
        return newStr !== oldStr ? newStr : false;
      }
    });
  } else {
    diffFormation = newFormation;
  }
  [].concat(_toConsumableArray(this._DOM_PROP.childNodes)).forEach(function (node, idx) {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    var formation = diffFormation[idx];
    if (!formation) {
      return;
    }
    var pos = void 0;
    if (Array.isArray(formation)) {
      pos = formation[1];
      var _formation = formation[0];
      node.className = _formation + ' ' + pos;
    } else {
      pos = _FORMATION_POS_TABLE[idx % 3 + (idx / 3 | 0)];
      node.className = formation + ' ' + pos;
    }
    if (node.classList.contains('rotate-default')) {
      return;
    }
    node.classList.add(_ROTATE_TABLE[Math.random() * 4 | 0]);
  });
}

function _updateTransitionConfig() {
  var _this2 = this;

  // @bind this
  // let val = this._PATTERN_PROP._TRANSITION_PROPS.reduce((str, prop, idx) => {
  //   return `${ str }${ idx ? ',' : '' } ${ prop } ${ this._DURATION_PROP }ms ${ this._EASING_PROP }`;
  // }, '');
  var val = this._PATTERN_PROP._TRANSITION_PROPS.map(function (prop) {
    return prop + ' ' + _this2._DURATION_PROP + 'ms ' + _this2._EASING_PROP;
  }).join(',');

  _updateStyle(this._DOM_PROP.childNodes);

  function _updateStyle(list) {
    [].concat(_toConsumableArray(list)).forEach(function (node) {
      if (node instanceof HTMLElement) {
        node.style.transition = val;
        if (node.firstChild) {
          _updateStyle(node.childNodes);
        }
      } else {
        // $FlowFixMe
        console.error('node must be HTMLElement. ' + node);
      }
    });
  }
}

OKBlock.patterns = {}; // initialized in OKBlock.define


var _ROTATE_TABLE = ['rotate0', 'rotate90', 'rotate180', 'rotate270'];
var _FORMATION_POS_TABLE = ['pos_0_0', 'pos_1_0', 'pos_2_0', 'pos_3_0', 'pos_0_1', 'pos_1_1', 'pos_2_1', 'pos_3_1', 'pos_0_2', 'pos_1_2', 'pos_2_2', 'pos_3_2'];

module.exports = OKBlock;