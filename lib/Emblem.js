'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _xtend = require('xtend');

var _xtend2 = _interopRequireDefault(_xtend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _PATTERN_NAME_PROP = Symbol();
var _PATTERN_PROP = Symbol();
var _CHAR_PROP = Symbol();
var _DOM_PROP = Symbol();
var _DISPLAY_TIME_PROP = Symbol();
var _DURATION_PROP = Symbol();
var _EASING_PROP = Symbol();
var _IS_ANIMATING_PROP = Symbol();
var _RESUME_PROP = Symbol();
var _LOOP_PROP = Symbol();
var _RANDOM_PROP = Symbol();
var _PEDAL_PROP = Symbol();
var _CANSELLER_PROP = Symbol();

var patterns = {}; // initialized in Emblem.define

var Emblem = (function () {
    function Emblem(c) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, Emblem);

        if (options.pattern == null) {
            console.error('options.pattern is not set.');
        };
        if (patterns[options.pattern] == null) {
            console.error(options.pattern + ' pattern is undefined.');return;
        }

        this[_PATTERN_NAME_PROP] = options.pattern;
        this[_PATTERN_PROP] = patterns[options.pattern];
        this[_IS_ANIMATING_PROP] = false;
        this[_RESUME_PROP] = null;
        this[_CHAR_PROP] = null;
        this[_DOM_PROP] = _createDom.call(this);
        this[_CANSELLER_PROP] = function () {};

        options = (0, _xtend2.default)(this[_PATTERN_PROP]._DEFAULT_OPTIONS, options);
        var _options = options;
        var pattern = _options.pattern;
        var size = _options.size;
        var displayTime = _options.displayTime;
        var duration = _options.duration;
        var easing = _options.easing;
        var loop = _options.loop;
        var random = _options.random;
        var pedal = _options.pedal;

        // --- options ---

        this.displayTime = displayTime;
        this.duration = duration;
        this.loop = loop;
        this.random = random;
        this.easing = easing || 'cubic-bezier(.26,.92,.41,.98)';
        this.pedal = pedal;

        if (typeof size === 'number' && size >= 0) {
            this.size = size;
        } else {
            this.size = 100;
        }

        this.to(c);
    }

    _createClass(Emblem, [{
        key: 'to',
        value: function to(c) {
            var _c = c && c.toLowerCase && c.toLowerCase();
            if (!this[_PATTERN_PROP]._formationTable[_c]) {
                return false;
            }
            if (this[_CHAR_PROP] === _c) {
                return false;
            }
            _changeStyle.call(this, _c);
            this[_CHAR_PROP] = _c;
            return true;
        }
    }, {
        key: 'appendTo',
        value: function appendTo(parent) {
            parent.appendChild(this[_DOM_PROP]);
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

            this[_IS_ANIMATING_PROP] = true;
            this[_RESUME_PROP] = null;
            this.options = opt;

            [].reduce.call(str, function (p, c, idx) {
                // p = Promise.resolve(); c = str[idx];
                var isLast = idx === str.length - 1;
                return p.then(function () {
                    return new Promise(function (resolve, reject) {
                        _this[_CANSELLER_PROP] = reject;
                        if (_this[_RANDOM_PROP]) {
                            var _c = str[Math.random() * str.length | 0];
                            _this.to(_c);
                        } else {
                            _this.to(c);
                        }
                        if (isLast) {
                            if (_this[_LOOP_PROP]) {
                                setTimeout(function () {
                                    _this.animateFromString.call(_this, str);
                                    resolve();
                                }, _this[_DISPLAY_TIME_PROP]);
                                return;
                            } else {
                                setTimeout(reject, _this[_DISPLAY_TIME_PROP]);
                                return;
                            }
                        }
                        if (!_this[_IS_ANIMATING_PROP]) {
                            _this[_RESUME_PROP] = resolve;
                        } else {
                            setTimeout(resolve, _this[_DISPLAY_TIME_PROP]);
                        }
                    });
                });
            }, Promise.resolve()).catch(function () {
                _this[_IS_ANIMATING_PROP] = false;
            });
        }

        /**
         * Setter and Getter
         */

        // --- options ---

    }, {
        key: 'options',
        set: function set() {
            var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var size = _ref.size;
            var displayTime = _ref.displayTime;
            var duration = _ref.duration;
            var loop = _ref.loop;
            var random = _ref.random;
            var pedal = _ref.pedal;
            var easing = _ref.easing;

            this.size = size;
            this.displayTime = displayTime;
            this.duration = duration;
            this.easing = easing;
            this.loop = loop;
            this.random = random;
            this.pedal = pedal;
        },
        get: function get() {
            return {
                size: this.size,
                displayTime: this.displayTime,
                duration: this.duration,
                easing: this.easing,
                loop: this.loop,
                random: this.random,
                pedal: this.pedal
            };
        }

        // --- size ---

    }, {
        key: 'size',
        set: function set(size) {
            if (size == null) {
                return;
            }
            if (typeof size === 'number' && size >= 0) {
                var domStyle = this[_DOM_PROP].style;
                domStyle.width = size + 'px';
                domStyle.height = size + 'px';
            } else {
                console.error('Emblem.size should be type of zero or positive number.');
            }
        },
        get: function get() {
            return +this[_DOM_PROP].style.width.replace('px', '');
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
                console.error('Emblem.displayTime should be type of positive number.');
            }
        },
        get: function get() {
            return this[_DISPLAY_TIME_PROP];
        }

        // --- duration ---

    }, {
        key: 'duration',
        set: function set(time) {
            if (time == null) {
                return;
            }
            if (typeof time === 'number' && time >= 0) {
                this[_DURATION_PROP] = time;
                _updateTransitionConfig.call(this);
            } else {
                console.error('Emblem.duration should be type of zero or positive number.');
            }
        },
        get: function get() {
            return this[_DURATION_PROP];
        }

        // --- easing ---

    }, {
        key: 'easing',
        set: function set(val) {
            if (val == null) {
                return;
            }
            this[_EASING_PROP] = val;
            _updateTransitionConfig.call(this);
        },
        get: function get() {
            return this[_EASING_PROP];
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

        // --- pedal ---

    }, {
        key: 'pedal',
        set: function set(bool) {
            if (bool == null) {
                return;
            }
            this[_PEDAL_PROP] = bool;
        },
        get: function get() {
            return this[_PEDAL_PROP];
        }

        // --- pattern ---

    }, {
        key: 'pattern',
        get: function get() {
            return this[_PATTERN_NAME_PROP];
        }

        // --- dom ---

    }, {
        key: 'dom',
        get: function get() {
            return this[_DOM_PROP];
        }

        // --- char ---

    }, {
        key: 'char',
        get: function get() {
            return this[_CHAR_PROP];
        }

        // --- isAnimating ---

    }, {
        key: 'isAnimating',
        get: function get() {
            return this[_IS_ANIMATING_PROP];
        }

        // --- allValidChars ---

    }, {
        key: 'allValidChars',
        get: function get() {
            return Object.keys(this[_PATTERN_PROP]._formationTable);
        }
    }], [{
        key: 'define',
        value: function define(name, obj) {
            if (!('_DEFAULT_OPTIONS' in obj) || !('_BASE_DOM' in obj) || !('_TRANSITION_PROPS' in obj) || !('_formationTable' in obj)) {
                console.error('Pattern is invalid.');
            }
            patterns[name] = obj;
        }
    }]);

    return Emblem;
})();

function _createDom() {
    return this[_PATTERN_PROP]._BASE_DOM.cloneNode(true);
}

function _changeStyle(c) {
    // @bind this
    var oldC = this[_CHAR_PROP];
    var oldFormation = this[_PATTERN_PROP]._formationTable[oldC];
    var newFormation = this[_PATTERN_PROP]._formationTable[c];
    if (!newFormation) {
        return;
    }
    var diffFormation = undefined;
    if (oldC) {
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
    [].forEach.call(this[_DOM_PROP].childNodes, function (node, idx) {
        var formation = diffFormation[idx];
        var specifyPos = Array.isArray(formation);
        if (!formation) {
            return;
        }
        var pos = undefined;
        if (specifyPos) {
            pos = formation[1];
        } else {
            pos = 'pos_' + idx % 3 + '_' + (idx / 3 | 0);
        }
        node.className = (specifyPos ? formation[0] : formation) + ' ' + pos;
        if (node.classList.contains('rotate-default')) {
            return;
        }
        node.classList.add(_ROTATE_TABLE[Math.random() * 4 | 0]);
    });
}

function _updateTransitionConfig() {
    var _this2 = this;

    // @bind this
    var val = this[_PATTERN_PROP]._TRANSITION_PROPS.reduce(function (str, prop, idx) {
        return '' + str + (idx ? ',' : '') + ' ' + prop + ' ' + _this2[_DURATION_PROP] + 'ms ' + _this2[_EASING_PROP];
    }, '');

    _updateStyle(this[_DOM_PROP].childNodes);

    function _updateStyle(list) {
        [].forEach.call(list, function (node) {
            node.style.transition = val;
            if (node.firstChild) {
                _updateStyle(node.childNodes);
            }
        });
    }
}

var _ROTATE_TABLE = ['rotate0', 'rotate90', 'rotate180', 'rotate270'];

exports.default = Emblem;