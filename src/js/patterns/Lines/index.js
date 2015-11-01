/*
 * default options
 */

const _DEFAULT_OPTIONS = {
    displayTime: 1500,
    duration:    200,
    loop:        false,
    random:      false,
    pedal:       true
}

/*
 * DOM in instance of Emblem.
 */
const _BASE_DOM = (() => {
    let wrapper         = document.createElement('div');
    let part            = document.createElement('div');
    let whiteBoxWrapper = document.createElement('div');
    let whiteBoxBase    = document.createElement('div');
    let docFrag         = document.createDocumentFragment();

    wrapper.className         = 'lines-emblem weight_3';
    part.className            = 'part';
    whiteBoxWrapper.className = 'whitebox-wrapper';

    // in emmet syntax.
    // div.whitebox-wrapper > div.whitebox * 4
    for (let i of [0, 1, 2, 3]) {
        let whiteBox = whiteBoxBase.cloneNode();
        whiteBox.className = `whitebox pos_${ i }`;
        whiteBoxWrapper.appendChild(whiteBox);
    }

    part.appendChild(whiteBoxWrapper);

    // in emmet syntax.
    // div.wrapper > div.part * 9
    for (let i = 0; i < 9; i++) {
        let _part = part.cloneNode(true);
        _part.classList.add(`pos_${ i % 3 }_${ i / 3 | 0 }`);
        docFrag.appendChild(_part);
    }
    wrapper.appendChild(docFrag);

    return wrapper;
})();

/*
 * Parts className table.
 */
const _I_R0       = "part i-shaped rotate0 rotate-default";
const _I_R90      = "part i-shaped rotate90 rotate-default";
const _L_R0       = "part l-shaped rotate0 rotate-default";
const _L_R90      = "part l-shaped rotate90 rotate-default";
const _L_R180     = "part l-shaped rotate180 rotate-default";
const _L_R270     = "part l-shaped rotate270 rotate-default";
const _L_RD_R0    = "part l-shaped-radius rotate0 rotate-default";
const _L_RD_R90   = "part l-shaped-radius rotate90 rotate-default";
const _L_RD_R180  = "part l-shaped-radius rotate180 rotate-default";
const _L_RD_R270  = "part l-shaped-radius rotate270 rotate-default";
const _T_R0       = "part t-shaped rotate0 rotate-default";
const _T_R90      = "part t-shaped rotate90 rotate-default";
const _T_R180     = "part t-shaped rotate180 rotate-default";
const _T_R270     = "part t-shaped rotate270 rotate-default";
const _T_RD_R0    = "part t-shaped-radius rotate0 rotate-default";
const _T_RD_R90   = "part t-shaped-radius rotate90 rotate-default";
const _T_RD_R180  = "part t-shaped-radius rotate180 rotate-default";
const _T_RD_R270  = "part t-shaped-radius rotate270 rotate-default";
const _T_LRD_R0   = "part t-shaped-l-radius rotate0 rotate-default";
const _T_LRD_R90  = "part t-shaped-l-radius rotate90 rotate-default";
const _T_LRD_R180 = "part t-shaped-l-radius rotate180 rotate-default";
const _T_LRD_R270 = "part t-shaped-l-radius rotate270 rotate-default";
const _T_RRD_R0   = "part t-shaped-r-radius rotate0 rotate-default";
const _T_RRD_R90  = "part t-shaped-r-radius rotate90 rotate-default";
const _T_RRD_R180 = "part t-shaped-r-radius rotate180 rotate-default";
const _T_RRD_R270 = "part t-shaped-r-radius rotate270 rotate-default";
const _D_R0       = "part dash-shaped rotate0 rotate-default";
const _D_R90      = "part dash-shaped rotate90 rotate-default";
const _D_R180     = "part dash-shaped rotate180 rotate-default";
const _D_R270     = "part dash-shaped rotate270 rotate-default";
const _C_R0       = "part cross-shaped rotate0 rotate-default";
const _C_RD_R0    = "part cross-shaped-radius rotate0 rotate-default";
const _C_3RD_R0   = "part cross-shaped-3-radius rotate0 rotate-default";
const _C_3RD_R90  = "part cross-shaped-3-radius rotate90 rotate-default";
const _C_3RD_R180 = "part cross-shaped-3-radius rotate180 rotate-default";
const _C_3RD_R270 = "part cross-shaped-3-radius rotate270 rotate-default";
const _C_1RD_R0   = "part cross-shaped-1-radius rotate0 rotate-default";
const _C_1RD_R90  = "part cross-shaped-1-radius rotate90 rotate-default";
const _C_1RD_R180 = "part cross-shaped-1-radius rotate180 rotate-default";
const _C_1RD_R270 = "part cross-shaped-1-radius rotate270 rotate-default";
const _C_2RD_R0   = "part cross-shaped-2-radius rotate0 rotate-default";
const _C_2RD_R90  = "part cross-shaped-2-radius rotate90 rotate-default";
const _C_2RD_R180 = "part cross-shaped-2-radius rotate180 rotate-default";
const _C_2RD_R270 = "part cross-shaped-2-radius rotate270 rotate-default";
const _C_DRD_R0   = "part cross-shaped-diagonal-radius rotate0 rotate-default";
const _C_DRD_R90  = "part cross-shaped-diagonal-radius rotate90 rotate-default";
const _BL         = "part blank";

/*
 * Formation settings of all characters.
 */
var _formationTable = {
    "a": [
        _L_R90,       _I_R90,     _L_R180,
        _T_R270,      _I_R90,     _T_R90,
        _D_R0,        _BL,        _D_R0
    ],
    "b": [
        _L_R90,       _I_R90,     _L_RD_R180,
        _T_R270,      _I_R90,     _T_RD_R90,
        _L_R0,        _I_R90,     _L_RD_R270
    ],
    "c": [
        _L_RD_R90,   _I_R90,      _D_R270,
        _I_R0,       _BL,         _BL,
        _L_RD_R0,    _I_R90,      _D_R270
    ],
    "d": [
        _L_R90,      _I_R90,      _L_RD_R180,
        _I_R0,       _BL,         _I_R0,
        _L_R0,       _I_R90,      _L_RD_R270
    ],
    "e": [
        _L_R90,      _I_R90,      _D_R270,
        _T_R270,     _I_R90,      _BL,
        _L_R0,       _I_R90,      _D_R270
    ],
    "f": [
        _L_R90,      _I_R90,      _D_R270,
        _T_R270,     _I_R90,      _BL,
        _D_R0,       _BL,         _BL
    ],
    "g": [
        _L_R90,      _I_R90,      _D_R270,
        _I_R0,       _BL,         _L_RD_R180,
        _L_RD_R0,    _I_R90,      _L_R270
    ],
    "h": [
        _D_R180,     _BL,         _D_R180,
        _T_R270,     _I_R90,      _T_R90,
        _D_R0,       _BL,         _D_R0
    ],
    "i": [
        _BL,         _D_R180,     _BL,
        _BL,         _I_R0,       _BL,
        _BL,         _D_R0,       _BL
    ],
    "j": [
        _BL,         _BL,         _D_R180,
        _BL,         _BL,         _I_R0,
        _L_RD_R0,    _I_R90,      _L_RD_R270
    ],
    "k": [
        _D_R180,     _L_RD_R90,   _D_R270,
        _T_R270,     _T_RD_R90,   _BL,
        _D_R0,       _L_RD_R0,    _D_R270
    ],
    "l": [
        _D_R180,     _BL,         _BL,
        _I_R0,       _BL,         _BL,
        _L_R0,       _I_R90,      _D_R270
    ],
    "m": [
        _L_R90,      _T_R0,       _L_RD_R180,
        _I_R0,       _D_R0,       _I_R0,
        _D_R0,       _BL,         _D_R0
    ],
    "n": [
        _L_R90,      _I_R90,      _L_RD_R180,
        _I_R0,       _BL,         _I_R0,
        _D_R0,       _BL,         _D_R0
    ],
    "o": [
        _L_R90,      _I_R90,      _L_R180,
        _I_R0,       _BL,         _I_R0,
        _L_R0,       _I_R90,      _L_R270
    ],
    "p": [
        _L_R90,      _I_R90,      _L_RD_R180,
        _T_R270,     _I_R90,      _L_RD_R270,
        _D_R0,       _BL,         _BL
    ],
    "q": [
        _L_R90,      _I_R90,      _L_R180,
        _I_R0,       _BL,         _I_R0,
        _L_R0,       _I_R90,      _T_RRD_R90
    ],
    "r": [
        _L_R90,      _I_R90,      _L_RD_R180,
        _T_R270,     _I_R90,      _T_RD_R90,
        _D_R0,       _BL,         _D_R0
    ],
    "s": [
        _L_RD_R90,   _I_R90,      _D_R270,
        _L_RD_R0,    _I_R90,      _L_R180,
        _D_R90,      _I_R90,      _L_R270
    ],
    "t": [
        _D_R90,      _T_R0,       _D_R270,
        _BL,         _I_R0,       _BL,
        _BL,         _D_R0,       _BL
    ],
    "u":  [
        _D_R180,     _BL,         _D_R180,
        _I_R0,       _BL,         _I_R0,
        _L_RD_R0,    _I_R90,      _L_RD_R270
    ],
    "v": [
        _D_R180,     _BL,         _D_R180,
        _I_R0,       _BL,         _I_R0,
        _T_LRD_R270, _I_R90,      _L_RD_R270
    ],
    "w": [
        _D_R180,     _BL,         _D_R180,
        _I_R0,       _I_R0,       _I_R0,
        _T_LRD_R270, _C_DRD_R0,   _L_RD_R270
    ],
    "x": [
        _D_R90,      _T_RD_R0,    _D_R270,
        _BL,         _I_R0,       _BL,
        _D_R90,      _T_RD_R180,  _D_R270
    ],
    "y": [
        _D_R180,     _BL,         _D_R180,
        _L_RD_R0,    _T_R0,       _L_R270,
        _BL,         _D_R0,       _BL
    ],
    "z": [
        _D_R90,      _I_R90,      _L_R180,
        _L_RD_R90,   _C_DRD_R90,  _L_RD_R270,
        _L_R0,       _I_R90,      _D_R270
    ],
    "1": [
        _BL,         _BL,         _BL,
        _BL,         _T_LRD_R90,  _BL,
        _BL,         _D_R0,       _BL
    ],
    "2": [
        _D_R90,      _I_R90,      _L_RD_R180,
        _L_RD_R90,   _I_R90,      _L_RD_R270,
        _L_R0,       _I_R90,      _D_R270
    ],
    "3": [
        _D_R90,      _I_R90,      _L_RD_R180,
        _BL,         _I_R90,      _T_RD_R90,
        _D_R90,      _I_R90,      _L_RD_R270
    ],
    "4": [
        _D_R180,     _BL, _D_R180,
        _L_RD_R0,    _I_R90,      _C_R0,
        _BL,         _BL,         _D_R0
    ],
    "5": [
        _L_R90,      _I_R90,      _D_R270,
        _L_R0,       _I_R90,      _L_RD_R180,
        _L_RD_R0,    _I_R90,      _L_RD_R270
    ],
    "6": [
        _L_RD_R90,   _I_R90,      _D_R270,
        _T_LRD_R270, _I_R90,      _L_RD_R180,
        _L_RD_R0,    _I_R90,      _L_RD_R270
    ],
    "7": [
        _L_RD_R90,   _I_R90,      _L_R180,
        _BL,         _BL,         _I_R0,
        _BL,         _BL,         _D_R0
    ],
    "8": [
        _L_RD_R90,   _I_R90,      _L_RD_R180,
        _T_RD_R270,  _I_R90,      _T_RD_R90,
        _L_RD_R0,    _I_R90,      _L_RD_R270
    ],
    "9": [
        _L_RD_R90,   _I_R90,      _L_RD_R180,
        _L_RD_R0,    _I_R90,      _T_RD_R90,
        _D_R90,      _I_R90,      _L_RD_R270
    ],
    "0": [
        _L_RD_R90,   _I_R90,      _L_RD_R180,
        _I_R0,       _BL,         _I_R0,
        _L_RD_R0,    _I_R90,      _L_RD_R270
    ],
    "+": [
        _BL,         _D_R180,     _BL,
        _D_R90,      _C_R0,       _D_R270,
        _BL,         _D_R0,       _BL
    ],
    "-": [
        _BL,         _BL,         _BL,
        _D_R90,      _I_R90,      _D_R270,
        _BL,         _BL,         _BL
    ],
    "*": [
        _BL,         _BL,         _BL,
        _BL,         _C_RD_R0,    _BL,
        _BL,         _BL,         _BL
    ],
    "%": [
        _D_R180,     _L_RD_R90,   _BL,
        _BL,         _I_R0,       _BL,
        _BL,         _L_RD_R270,  _D_R0
    ],
    ".": [
        _BL,         _BL,         _BL,
        _BL,         _BL,         _BL,
        _BL,         _D_R0,       _BL
    ],
    ",": [
        _BL,         _BL,         _BL,
        _BL,         _BL,         _BL,
        _BL,         _T_RD_R90,   _BL
    ],
    ":": [
        _BL,         _D_R180,     _BL,
        _BL,         _BL,         _BL,
        _BL,         _D_R0,       _BL
    ],
    ";": [
        _BL,         _D_R180,     _BL,
        _BL,         _BL,         _BL,
        _BL,         _T_RD_R90,   _BL
    ],
    "/": [
        _BL,         _L_RD_R90,   _BL,
        _BL,         _I_R0,       _BL,
        _BL,         _L_RD_R270,  _BL
    ],
    "\\": [
        _BL,         _L_RD_R180,  _BL,
        _BL,         _I_R0,       _BL,
        _BL,         _L_RD_R0,    _BL
    ],
    "{": [
        _BL,         _L_RD_R90,   _BL,
        _BL,         _T_RD_R90,   _BL,
        _BL,         _L_RD_R0,    _BL
    ],
    "}": [
        _BL,         _L_RD_R180,  _BL,
        _BL,         _T_RD_R270,  _BL,
        _BL,         _L_RD_R270,  _BL
    ],
    "[": [
        _BL,         _L_R90,      _BL,
        _BL,         _I_R0,       _BL,
        _BL,         _L_R0,       _BL
    ],
    "]": [
        _BL,         _L_R180,     _BL,
        _BL,         _I_R0,       _BL,
        _BL,         _L_R270,     _BL
    ],
    "#": [
        _BL,         _BL,         _BL,
        _C_R0,       _C_R0,       _BL,
        _C_R0,       _C_R0,       _BL
    ],
    "(": [
        _BL,         _L_RD_R90,   _BL,
        _BL,         _I_R0,       _BL,
        _BL,         _L_RD_R0,    _BL
    ],
    ")": [
        _BL,         _L_RD_R180,  _BL,
        _BL,         _I_R0,       _BL,
        _BL,         _L_RD_R270,  _BL
    ],
    "!": [
        _BL,         _D_R180,     _BL,
        _BL,         _I_R0,       _BL,
        _BL,         _D_R180,     _BL
    ],
    "?": [
        _L_RD_R90,   _I_R90,      _L_RD_R180,
        _BL,         _L_RD_R90,   _L_RD_R270,
        _BL,         _D_R180,     _BL
    ],
    "'": [
        _BL,         _L_RD_R270,  _BL,
        _BL,         _BL,         _BL,
        _BL,         _BL,         _BL
    ],
    '"': [
        _L_RD_R270,  _L_RD_R270,  _BL,
        _BL,         _BL,         _BL,
        _BL,         _BL,         _BL
    ],
    "$": [
        _L_RD_R90,   _C_2RD_R0,   _L_RD_R180,
        _L_RD_R0,    _C_RD_R0,    _L_RD_R180,
        _L_RD_R0,    _C_2RD_R180, _L_RD_R270
    ],
    "&": [
        _BL,         _L_RD_R90,   _L_RD_R180,
        _L_RD_R90,   _T_RD_R180,  _T_RD_R90,
        _L_RD_R0,    _I_R90,      _C_R0
    ],
    "=": [
        _BL,         _BL,         _BL,
        _D_R90,      _I_R90,      _D_R270,
        _D_R90,      _I_R90,      _D_R270
    ],
    "_": [
        _BL,         _BL,         _BL,
        _BL,         _BL,         _BL,
        _D_R90,      _I_R90,      _D_R270
    ],
    "^": [
        _L_R90,      _T_RD_R180,  _L_R180,
        _D_R0,       _BL,         _D_R0,
        _BL,         _BL,         _BL
    ],
    "|": [
        _BL,         _I_R0,       _BL,
        _BL,         _I_R0,       _BL,
        _BL,         _I_R0,       _BL
    ],
    "`": [
        _BL,         _L_RD_R180,  _BL,
        _BL,         _BL,         _BL,
        _BL,         _BL,         _BL
    ],
    "~": [
        _L_RD_R90,   _L_RD_R180,  _D_R180,
        _D_R0,       _L_RD_R0,    _L_RD_R270,
        _BL,         _BL,         _BL
    ],
    "<": [
        _L_RD_R90,   _I_R90,      _D_R270,
        _T_RD_R90,   _BL,         _BL,
        _L_RD_R0,    _I_R90,      _D_R270
    ],
    ">": [
        _D_R90,      _I_R90,      _L_RD_R180,
        _BL,         _BL,         _T_RD_R270,
        _D_R90,      _I_R90,      _L_RD_R270
    ],
    "@": [
        _L_RD_R90,   _I_R90,      _L_RD_R180,
        _L_RD_R90,   _L_RD_R180,  _I_R0,
        _L_RD_R0,    _T_LRD_R180, _L_RD_R270
    ],
    " ": [
        _BL,         _BL,         _BL,
        _BL,         _BL,         _BL,
        _BL,         _BL,         _BL
    ],
};


/*
 * Transition settings.
 */
const _TRANSITION_PROPS = [
    'width',
    'height',
    'background-color',
    'border-radius'
];

Emblem.define('Lines', { _DEFAULT_OPTIONS, _BASE_DOM, _TRANSITION_PROPS, _formationTable });

/*
 * advanced properties
 */

const WEIGHT_PROP       = Symbol();
const WEIGHT_LIMIT_PROP = Symbol();

Object.defineProperty(Emblem.prototype, 'weight', {
    get: function() {
        return this[WEIGHT_PROP];
    },
    set: function(n) {
        if (n > this[WEIGHT_LIMIT_PROP] || n < 0) { return; }
        this.dom.classList.add(`weight_${ n }`);
        this.dom.classList.remove(`weight_${ this[WEIGHT_PROP] }`);
        this[WEIGHT_PROP] = n;
    }
});

Emblem.prototype.bolder = function () {
    this.weight = this[WEIGHT_PROP] + 1;
};

Emblem.prototype.lighter = function () {
    this.weight = this[WEIGHT_PROP] - 1;
};

Emblem.prototype[WEIGHT_PROP] = 3;

Object.defineProperty(Emblem.prototype, WEIGHT_LIMIT_PROP, {
    value: 6
});
