'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OKBlock = function () {
  function OKBlock(c) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { patternName: null };

    _classCallCheck(this, OKBlock);

    if (options.patternName == null) {
      console.error('options.patternName is not set.');return;
    }
    if (this.constructor.patterns[options.patternName] == null) {
      console.error(options.patternName + ' patternName is undefined.');return;
    }

    this.patternName = options.patternName;
    this.patternDefinition = this.constructor.patterns[this.patternName];
    this.isAnimating = false;
    this.resumeAnimate = null;
    this.char = null;
    this.dom = _createDom.call(this);
    this.cancelAnimation = function () {};

    var _options = Object.assign({}, this.patternDefinition._DEFAULT_OPTIONS, options);
    var size = _options.size,
        displayTime = _options.displayTime,
        duration = _options.duration,
        easing = _options.easing,
        loop = _options.loop,
        random = _options.random,
        distinct = _options.distinct;

    // --- options ---

    this.displayTime = +displayTime;
    this.duration = +duration;
    this.loop = !!loop;
    this.random = !!random;
    this.easing = easing || 'cubic-bezier(.26,.92,.41,.98)';
    this.distinct = !!distinct;

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
      if (!this.patternDefinition._formationTable[_c]) {
        return false;
      }
      if (this.char === _c) {
        return false;
      }
      _changeStyle.call(this, _c);
      this.char = _c;
      return true;
    }
  }, {
    key: 'appendTo',
    value: function appendTo(parent) {
      parent.appendChild(this.dom);
    }
  }, {
    key: 'stopAnimate',
    value: function stopAnimate() {
      this.isAnimating = false;
    }
  }, {
    key: 'resumeAnimate',
    value: function resumeAnimate() {
      if (typeof this.resumeAnimate === 'function') {
        this.isAnimating = true;
        this.resumeAnimate();
      }
    }
  }, {
    key: 'animateFromString',
    value: function animateFromString(str) {
      var _this = this;

      var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


      this.isAnimating = true;
      this.resumeAnimate = null;
      this.options = opt;

      [].concat(_toConsumableArray(str)).reduce(function (p, c, idx) {
        // p = Promise.resolve(); c = str[idx];
        var isLast = idx === str.length - 1;
        return p.then(function () {
          return new Promise(function (resolve, reject) {
            _this.cancelAnimation = reject;
            if (_this._random) {
              var _c = str[Math.random() * str.length | 0];
              _this.to(_c);
            } else {
              _this.to(c);
            }
            if (isLast) {
              if (_this._loop) {
                setTimeout(function () {
                  resolve();
                  _this.animateFromString.call(_this, str);
                }, _this._displayTime);
              } else {
                setTimeout(reject, _this._displayTime);
              }
              return;
            }
            if (!_this.isAnimating) {
              _this.resumeAnimate = resolve;
            } else {
              setTimeout(resolve, _this._displayTime);
            }
          });
        });
      }, Promise.resolve()).catch(function (err) {
        _this.isAnimating = false;
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
      var size = options.size,
          displayTime = options.displayTime,
          duration = options.duration,
          easing = options.easing,
          loop = options.loop,
          random = options.random,
          distinct = options.distinct;

      if (size != null) {
        this.size = size;
      }
      if (displayTime != null) {
        this.displayTime = displayTime;
      }
      if (duration != null) {
        this.duration = duration;
      }
      if (easing != null) {
        this.easing = easing;
      }
      if (loop != null) {
        this.loop = loop;
      }
      if (random != null) {
        this.random = random;
      }
      if (distinct != null) {
        this.distinct = distinct;
      }
    },
    get: function get() {
      var size = this.size,
          displayTime = this.displayTime,
          duration = this.duration,
          easing = this.easing,
          loop = this.loop,
          random = this.random,
          distinct = this.distinct;

      return { size: size, displayTime: displayTime, duration: duration, easing: easing, loop: loop, random: random, distinct: distinct };
    }

    // --- size ---

  }, {
    key: 'size',
    set: function set(size) {
      if (size == null) {
        return;
      }
      if (typeof size === 'number' && size >= 0) {
        var domStyle = this.dom.style;
        domStyle.width = size + 'px';
        domStyle.height = size + 'px';
      } else {
        console.error('OKBlock.size should zero or positive number.');
      }
    },
    get: function get() {
      return +this.dom.style.width.replace('px', '');
    }

    // --- displayTime ---

  }, {
    key: 'displayTime',
    set: function set(time) {
      if (time == null) {
        return;
      }
      if (typeof time === 'number' && time > 0) {
        this._displayTime = time;
      } else {
        console.error('OKBlock.displayTime should be positive number.');
      }
    },
    get: function get() {
      return this._displayTime;
    }

    // --- duration ---

  }, {
    key: 'duration',
    set: function set(time) {
      if (time == null) {
        return;
      }
      if (typeof time === 'number' && time >= 0) {
        this._duration = time;
        _updateTransitionConfig.call(this);
      } else {
        console.error('OKBlock.duration should be zero or positive number.', time);
      }
    },
    get: function get() {
      return this._duration;
    }

    // --- easing ---

  }, {
    key: 'easing',
    set: function set(val) {
      if (val == null) {
        return;
      }
      this._eaasing = val;
      _updateTransitionConfig.call(this);
    },
    get: function get() {
      return this._eaasing;
    }

    // --- loop ---

  }, {
    key: 'loop',
    set: function set(bool) {
      if (bool == null) {
        return;
      }
      this._loop = bool;
    },
    get: function get() {
      return this._loop;
    }

    // --- random ---

  }, {
    key: 'random',
    set: function set(bool) {
      if (bool == null) {
        return;
      }
      this._random = bool;
    },
    get: function get() {
      return this._random;
    }

    // --- distinct ---

  }, {
    key: 'distinct',
    set: function set(bool) {
      if (bool == null) {
        return;
      }
      this._distinct = bool;
    },
    get: function get() {
      return this._distinct;
    }

    // --- allValidChars ---

  }, {
    key: 'allValidChars',
    get: function get() {
      return Object.keys(this.patternDefinition._formationTable);
    }
  }], [{
    key: 'define',
    value: function define(name, patternDefinition) {
      if (!('_DEFAULT_OPTIONS' in patternDefinition) || !('_BASE_DOM' in patternDefinition) || !('_TRANSITION_PROPS' in patternDefinition) || !('_formationTable' in patternDefinition)) {
        console.error('Pattern is invalid.');
      }
      this.patterns[name] = patternDefinition;
    }
  }]);

  return OKBlock;
}();

function _createDom() {
  return this.patternDefinition._BASE_DOM.cloneNode(true);
}

function _changeStyle(c) {
  // @bind this
  var oldC = this.char;
  var newFormation = this.patternDefinition._formationTable[c];
  if (!newFormation) {
    return;
  }
  var diffFormation = void 0;
  if (oldC) {
    var oldFormation = this.patternDefinition._formationTable[oldC];
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
  [].concat(_toConsumableArray(this.dom.childNodes)).forEach(function (node, idx) {
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
  var val = this.patternDefinition._TRANSITION_PROPS.map(function (prop) {
    return prop + ' ' + _this2._duration + 'ms ' + _this2._eaasing;
  }).join(',');

  _updateStyle(this.dom.childNodes);

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

exports.default = OKBlock;