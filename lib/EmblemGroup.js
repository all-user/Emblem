'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _OKBlock = require('./OKBlock.js');

var _OKBlock2 = _interopRequireDefault(_OKBlock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _EMBLEMS_PROP = Symbol();
var _DISPLAY_TIME_PROP = Symbol();
var _IS_ANIMATING_PROP = Symbol();
var _RESUME_PROP = Symbol();
var _LOOP_PROP = Symbol();
var _RANDOM_PROP = Symbol();
var _CANSELLER_PROP = Symbol();

var OKBlocksGroup = (function () {
    function OKBlocksGroup(chars) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, OKBlocksGroup);

        var pattern = options.pattern;
        var length = options.length;
        var displayTime = options.displayTime;
        var _options$loop = options.loop;
        var loop = _options$loop === undefined ? false : _options$loop;
        var _options$random = options.random;
        var random = _options$random === undefined ? false : _options$random;
        var size = options.size;
        var duration = options.duration;
        var easing = options.easing;
        var _options$pedal = options.pedal;
        var pedal = _options$pedal === undefined ? true : _options$pedal;

        this[_IS_ANIMATING_PROP] = false;
        this[_RESUME_PROP] = null;
        this[_CANSELLER_PROP] = function () {};

        // --- options ---
        this.displayTime = displayTime | 0 || 1500;
        this.loop = loop;
        this.random = random;

        if (typeof chars === 'string') {
            if (typeof length !== 'number' || chars.length < length) {
                for (var i = chars.length; i < length; i++) {
                    chars += ' ';
                }
            } else if (length != null && chars.length > length) {
                chars = chars.slice(0, length);
            }
        } else {
            console.error('OKBlocksGroup constructor first argument should be string.');
        }

        delete options.loop;
        delete options.displayTime;
        delete options.random;

        var emblems = _transformToOKBlockArray(chars, options);

        if (emblems) {
            this[_EMBLEMS_PROP] = emblems;
        } else {
            throw new Error('OKBlocksGroup arguments expect string or array of OKBlock.');
        }
    }

    _createClass(OKBlocksGroup, [{
        key: 'toString',
        value: function toString() {
            return this.emblems.map(function (e) {
                return e.char;
            }).join('');
        }
    }, {
        key: 'map',
        value: function map(str) {
            this.emblems.forEach(function (emblem, idx) {
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
            var frag = this.emblems.reduce(function (f, e) {
                f.appendChild(e.dom);
                return f;
            }, document.createDocumentFragment());
            parent.appendChild(frag);
        }
    }, {
        key: 'stopAnimate',
        value: function stopAnimate() {
            this[_IS_ANIMATING_PROP] = false;
        }
    }, {
        key: 'resumeAnimate',
        value: function resumeAnimate() {
            this[_IS_ANIMATING_PROP] = true;
            this[_RESUME_PROP]();
        }
    }, {
        key: 'animateFromString',
        value: function animateFromString(str, opt) {
            var _this = this;

            var strArr = undefined;
            if (typeof str === 'string') {
                (function () {
                    var len = _this.emblems.length;
                    strArr = [].reduce.call(str, function (arr, s, idx) {
                        if (idx % len === 0) {
                            arr.push('');
                        }
                        arr[idx / len | 0] += s;
                        return arr;
                    }, []);
                })();
            } else if (Array.isArray(str) && str.every(function (s) {
                return typeof s === 'string';
            })) {
                strArr = str;
            } else {
                console.error('OKBlocksGroup#animateFromString first argument should be string or array of string.');
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
            var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var length = _ref.length;
            var displayTime = _ref.displayTime;
            var loop = _ref.loop;
            var random = _ref.random;
            var size = _ref.size;
            var duration = _ref.duration;
            var easing = _ref.easing;
            var pedal = _ref.pedal;

            this.length = length;
            this.displayTime = displayTime;
            this.loop = loop;
            this.random = random;

            // change emblems options
            this.size = size;
            this.duration = duration;
            this.easing = easing;
            this.pedal = pedal;
        },
        get: function get() {
            return {
                length: this.length,
                displayTime: this.displayTime,
                loop: this.loop,
                random: this.random,

                // emblems options
                size: this.size,
                duration: this.duration,
                easing: this.easing,
                pedal: this.pedal
            };
        }

        // --- length ---

    }, {
        key: 'length',
        set: function set(lenNew) {
            if (lenNew == null) {
                return;
            }
            var emblems = this[_EMBLEMS_PROP];
            var lenOld = emblems.length;

            if (lenNew > lenOld) {
                var blankArr = Array.from({ length: lenNew - lenOld }, function () {
                    return new _OKBlock2.default(' ', { pattern: emblems.slice(-1)[0].pattern });
                });
                this[_EMBLEMS_PROP] = emblems.concat(blankArr);
            } else if (lenNew < lenOld) {
                this[_EMBLEMS_PROP] = emblems.slice(0, lenNew);
            }
        },
        get: function get() {
            return this[_EMBLEMS_PROP].length;
        }

        // --- displayTime ---

    }, {
        key: 'displayTime',
        set: function set(time) {
            if (time == null) {
                return;
            }
            if (typeof time === 'number' && time > 0) {
                this[_DISPLAY_TIME_PROP] = time;
            } else {
                console.error('OKBlocksGroup.displayTime should be type of positive number.');
            }
        },
        get: function get() {
            return this[_DISPLAY_TIME_PROP];
        }

        // --- loop ---

    }, {
        key: 'loop',
        set: function set(bool) {
            if (bool == null) {
                return;
            }
            this[_LOOP_PROP] = bool;
        },
        get: function get() {
            return this[_LOOP_PROP];
        }

        // --- random ---

    }, {
        key: 'random',
        set: function set(bool) {
            if (bool == null) {
                return;
            }
            this[_RANDOM_PROP] = bool;
        },
        get: function get() {
            return this[_RANDOM_PROP];
        }

        // --- size ---

    }, {
        key: 'size',
        set: function set(size) {
            this[_EMBLEMS_PROP].forEach(function (emb) {
                return emb.size = size;
            });
        },
        get: function get() {
            return this[_EMBLEMS_PROP].map(function (emb) {
                return emb.size;
            });
        }

        // --- duration ---

    }, {
        key: 'duration',
        set: function set(time) {
            this[_EMBLEMS_PROP].forEach(function (emb) {
                return emb.duration = time;
            });
        },
        get: function get() {
            return this[_EMBLEMS_PROP].map(function (emb) {
                return emb.duration;
            });
        }

        // --- easing ---

    }, {
        key: 'easing',
        set: function set(val) {
            this[_EMBLEMS_PROP].forEach(function (emb) {
                return emb.easing = val;
            });
        },
        get: function get() {
            return this[_EMBLEMS_PROP].map(function (emb) {
                return emb.easing;
            });
        }

        // --- pedal ---

    }, {
        key: 'pedal',
        set: function set(val) {
            this[_EMBLEMS_PROP].forEach(function (emb) {
                return emb.pedal = val;
            });
        },
        get: function get() {
            return this[_EMBLEMS_PROP].map(function (emb) {
                return emb.pedal;
            });
        }

        // --- emblems ---

    }, {
        key: 'emblems',
        get: function get() {
            return this[_EMBLEMS_PROP];
        }

        // --- isAnimating ---

    }, {
        key: 'isAnimating',
        get: function get() {
            return this[_IS_ANIMATING_PROP];
        }
    }]);

    return OKBlocksGroup;
})();

function _transformToOKBlockArray(arg, opt) {
    // (string | [OKBlock], object) => [OKBlock] | false

    var res = undefined;
    switch (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) {
        case 'string':
            res = [].map.call(arg, function (c) {
                return new _OKBlock2.default(c, opt);
            });
            break;
        case 'object':
            if (Array.isArray(arg) && arg.every(function (o) {
                return o instanceof _OKBlock2.default;
            })) {
                res = arg;
            } else {
                res = false;
            };
            break;
        default:
            res = false;
    }

    return res;
}

function _animateFromStringArray(strArr, opt) {
    var _this2 = this;

    this[_CANSELLER_PROP](); // cansel before animation.

    this[_IS_ANIMATING_PROP] = true;
    this[_RESUME_PROP] = null;
    this.options = opt;

    strArr.reduce(function (p, s, idx) {
        var isLast = idx === strArr.length - 1;
        return p.then(function () {
            return new Promise(function (resolve, reject) {
                _this2[_CANSELLER_PROP] = reject;
                if (_this2[_RANDOM_PROP]) {
                    var _s = strArr[Math.random() * strArr.length | 0];
                    _this2.map(_s);
                } else {
                    _this2.map(s);
                }
                if (isLast) {
                    if (_this2.loop) {
                        setTimeout(function () {
                            _animateFromStringArray.call(_this2, strArr);
                            resolve();
                        }, _this2.displayTime);
                        return;
                    } else {
                        _this2[_IS_ANIMATING_PROP] = false;
                        return;
                    }
                }
                if (!_this2[_IS_ANIMATING_PROP]) {
                    _this2[_RESUME_PROP] = resolve;
                } else {
                    setTimeout(resolve, _this2.displayTime);
                }
            });
        });
    }, Promise.resolve()).catch(function () {
        console.log('cansel before animation.');
    });
}

exports.default = OKBlocksGroup;