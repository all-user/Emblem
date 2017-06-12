'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _OKBlock = require('./OKBlock.js');

var _OKBlock2 = _interopRequireDefault(_OKBlock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OKBlocksGroup = function () {
  function OKBlocksGroup(chars, options) {
    _classCallCheck(this, OKBlocksGroup);

    var length = options.length,
        displayTime = options.displayTime,
        _options$loop = options.loop,
        loop = _options$loop === undefined ? false : _options$loop,
        _options$random = options.random,
        random = _options$random === undefined ? false : _options$random;

    this.isAnimating = false;
    this.resumeAnimation = null;
    this.cancelAnimation = function () {};

    // --- options ---
    if (displayTime && typeof displayTime === 'number') {
      this.displayTime = displayTime | 0;
    } else {
      this.displayTime = 1500;
    }
    this.loop = loop;
    this.random = random;

    if (typeof chars === 'string') {
      if (typeof length === 'number') {
        if (chars.length < length) {
          for (var i = chars.length; i < length; i++) {
            chars += ' ';
          }
        } else if (chars.length > length) {
          chars = chars.slice(0, length);
        }
      }
    } else {
      throw new Error('OKBlocksGroup constructor first argument should be string.');
    }

    delete options.loop;
    delete options.displayTime;
    delete options.random;

    var blocks = _transformToOKBlockArray(chars, options);

    if (blocks) {
      this.blocks = blocks;
    } else {
      throw new Error('OKBlocksGroup arguments expect string or array of OKBlock.');
    }
  }

  _createClass(OKBlocksGroup, [{
    key: 'toString',
    value: function toString() {
      return this.blocks.map(function (e) {
        return e.char;
      }).join('');
    }
  }, {
    key: 'map',
    value: function map(str) {
      this.blocks.forEach(function (emblem, idx) {
        var c = str[idx];
        if (!c) {
          c = ' ';
        }
        emblem.to(c);
      });
    }
  }, {
    key: 'appendTo',
    value: function appendTo(parent) {
      var frag = this.blocks.reduce(function (f, e) {
        f.appendChild(e.dom);
        return f;
      }, document.createDocumentFragment());
      parent.appendChild(frag);
    }
  }, {
    key: 'stopAnimate',
    value: function stopAnimate() {
      this.isAnimating = false;
    }
  }, {
    key: 'resumeAnimate',
    value: function resumeAnimate() {
      if (typeof this.resumeAnimation === 'function') {
        this.isAnimating = true;
        this.resumeAnimation();
      }
    }
  }, {
    key: 'animateFromString',
    value: function animateFromString(str, opt) {
      var strArr = void 0;
      if (typeof str === 'string') {
        var len = this.blocks.length;
        strArr = [].concat(_toConsumableArray(str)).reduce(function (arr, s, idx) {
          if (idx % len === 0) {
            arr.push('');
          }
          arr[idx / len | 0] += s;
          return arr;
        }, []);
      } else if (Array.isArray(str) && str.every(function (s) {
        return typeof s === 'string';
      })) {
        strArr = str;
      } else {
        console.error('OKBlocksGroup#animateFromString first argument should be string or array of string.');
        return;
      }

      _animateFromStringArray.call(this, strArr, opt);
    }
  }, {
    key: 'animateFromStringArray',
    value: function animateFromStringArray(strArr, opt) {
      _animateFromStringArray.call(this, strArr, opt);
    }

    /*
     * Setter and Getter
     */

    // --- options ---

  }, {
    key: 'options',
    set: function set() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var length = options.length,
          size = options.size,
          displayTime = options.displayTime,
          duration = options.duration,
          easing = options.easing,
          loop = options.loop,
          random = options.random,
          distinct = options.distinct;

      if (length != null) {
        this.length = length;
      }
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
      var length = this.length,
          displayTime = this.displayTime,
          loop = this.loop,
          random = this.random,
          size = this.size,
          duration = this.duration,
          easing = this.easing,
          distinct = this.distinct;

      return { length: length, displayTime: displayTime, loop: loop, random: random, size: size, duration: duration, easing: easing, distinct: distinct };
    }

    // --- length ---

  }, {
    key: 'length',
    set: function set(lenNew) {
      if (lenNew == null) {
        return;
      }
      var blocks = this.blocks;
      var lenOld = blocks.length;

      if (lenNew > lenOld) {
        var blankArr = Array.from({ length: lenNew - lenOld }, function () {
          return _OKBlock2.default.factory(' ', { pattern: blocks.slice(-1)[0].pattern });
        });
        this.blocks = blocks.concat(blankArr);
      } else if (lenNew < lenOld) {
        this.blocks = blocks.slice(0, lenNew);
      }
    },
    get: function get() {
      return this.blocks.length;
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
        console.error('OKBlocksGroup.displayTime should be positive number.');
      }
    },
    get: function get() {
      return this._displayTime;
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

    // --- size ---

  }, {
    key: 'size',
    set: function set(size) {
      this.blocks.forEach(function (emb) {
        return emb.size = size;
      });
    },
    get: function get() {
      return this.blocks.map(function (emb) {
        return emb.size;
      });
    }

    // --- duration ---

  }, {
    key: 'duration',
    set: function set(time) {
      this.blocks.forEach(function (emb) {
        return emb.duration = time;
      });
    },
    get: function get() {
      return this.blocks.map(function (emb) {
        return emb.duration;
      });
    }

    // --- easing ---

  }, {
    key: 'easing',
    set: function set(val) {
      this.blocks.forEach(function (emb) {
        return emb.easing = val;
      });
    },
    get: function get() {
      return this.blocks.map(function (emb) {
        return emb.easing;
      });
    }

    // --- distinct ---

  }, {
    key: 'distinct',
    set: function set(val) {
      this.blocks.forEach(function (emb) {
        return emb.distinct = val;
      });
    },
    get: function get() {
      return this.blocks.map(function (emb) {
        return emb.distinct;
      });
    }
  }]);

  return OKBlocksGroup;
}();

function _transformToOKBlockArray(arg, opt) {

  var res = void 0;
  switch (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) {
    case 'string':
      res = [].concat(_toConsumableArray(arg)).map(function (c) {
        return _OKBlock2.default.factory(c, opt);
      });
      break;
    case 'object':
      if (Array.isArray(arg) && arg.every(function (o) {
        return o instanceof _OKBlock2.default;
      })) {
        res = arg;
      } else {
        res = false;
      }
      break;
    default:
      res = false;
  }

  return res;
}

function _animateFromStringArray(strArr) {
  var _this = this;

  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  this.cancelAnimation(); // cansel before animation.

  this.isAnimating = true;
  this.resumeAnimation = null;
  this.options = opt;

  strArr.reduce(function (p, s, idx) {
    var isLast = idx === strArr.length - 1;
    return p.then(function () {
      return new Promise(function (resolve, reject) {
        _this.cancelAnimation = reject;
        if (_this.random) {
          var _s = strArr[Math.random() * strArr.length | 0];
          _this.map(_s);
        } else {
          _this.map(s);
        }
        if (isLast) {
          if (_this.loop) {
            setTimeout(function () {
              resolve();
              _animateFromStringArray.call(_this, strArr);
            }, _this.displayTime);
          } else {
            _this.isAnimating = false;
          }
          return;
        }
        if (!_this.isAnimating) {
          _this.resumeAnimation = resolve;
        } else {
          setTimeout(resolve, _this.displayTime);
        }
      });
    });
  }, Promise.resolve()).catch(function (err) {
    _this.isAnimating = false;
    console.log('OKBlocksGroup: cansel before animation.');
    console.log(err);
  });
}

exports.default = OKBlocksGroup;