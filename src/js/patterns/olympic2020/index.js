/*
 * default options
 */

const _DEFAULT_OPTIONS = {
    displayTime: 1500,
    duration:    1000,
    loop:        false,
    random:      false,
    pedal:       true
}

/*
 * Base of DOM, use to clone into instance of Emblem.
 */
const _BASE_DOM = (() => {
    let wrapper      = document.createElement('div');
    let part         = document.createElement('div');
    let whiteCircleW = document.createElement('div');
    let whiteCircle  = document.createElement('div');
    let docFrag      = document.createDocumentFragment();

    wrapper.className      = 'olympic-emblem';
    part.className         = 'part';
    whiteCircleW.className = 'white_circle_wrapper';
    whiteCircle.className  = 'white_circle';

    whiteCircleW.appendChild(whiteCircle);
    part.appendChild(whiteCircleW);

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
const _G_R0   = "part arc gold rotate0 rotate-default";
const _G_R90  = "part arc gold rotate90 rotate-default";
const _G_R180 = "part arc gold rotate180 rotate-default";
const _G_R270 = "part arc gold rotate270 rotate-default";
const _S_R0   = "part arc silver rotate0 rotate-default";
const _S_R90  = "part arc silver rotate90 rotate-default";
const _S_R180 = "part arc silver rotate180 rotate-default";
const _S_R270 = "part arc silver rotate270 rotate-default";
const _P1     = "part pole1 gray";
const _P2_V   = "part pole2_v gray";
const _P2_H   = "part pole2_h gray";
const _P3_V   = "part pole3_v gray";
const _P3_H   = "part pole3_h gray";
const _C_S    = "part circle_s red";
const _C_L    = "part circle_l red";
const _BL     = "part blank";

/*
 * Formation settings of all characters.
 */
let _formationTable = {
    "a": [
        _G_R180, _P1,     _G_R270,
        _S_R0,   _C_S,    _S_R90,
        _P1,     _BL,     _P1
    ],
    "b": [
        _BL,     _P3_V,   _G_R90,
        _BL,     _BL,     _S_R90,
        _BL,     _BL,     _S_R180
    ],
    "c": [
        _S_R180, _P1,     _G_R90,
        _P1,     _BL,     _BL,
        _G_R90,  _P1,     _S_R180
    ],
    "d": [
        _P3_V,   _S_R90,  _G_R270,
        _BL,     _BL,     _P1,
        _BL,     _G_R180, _S_R0
    ],
    "e": [
        _BL,     _P3_V,   _G_R90,
        _BL,     _BL,     _C_S,
        _BL,     _BL,     _S_R180
    ],
    "f": [
        _BL,     _P3_V,   _S_R90,
        _BL,     _BL,     _C_S,
        _BL,     _BL,     _BL
    ],
    "g": [
        _P3_V,   _G_R0,   _BL,
        _BL,     _BL,     _S_R90,
        _BL,     _C_S,    _G_R180
    ],
    "h": [
        _P3_V,   _BL,     _P3_V,
        _BL,     _C_S,    _BL,
        _BL,     _BL,     _BL
    ],
    "i": [
        _BL,     _C_S,    _BL,
        _BL,     _P2_V,   _BL,
        _BL,     _BL,     _BL
    ],
    "j": [
        _BL,     _BL,     _P2_V,
        _BL,     _BL,     _BL,
        _S_R90,  _C_S,    _G_R180
    ],
    "k": [
        _P3_V,   _BL,     _G_R0,
        _BL,     _C_S,    _BL,
        _BL,     _BL,     _S_R270
    ],
    "l": [
        _P3_V,   _BL,     _BL,
        _BL,     _BL,     _BL,
        _BL,     _C_S,    _G_R180
    ],
    "m": [
        _G_R270, _BL,     _S_R180,
        _P2_V,   _C_S,    _P2_V,
        _BL,     _BL,     _BL
    ],
    "n": [
        _P3_V,   _G_R270, _P3_V,
        _BL,     _C_S,    _BL,
        _BL,     _S_R90,  _BL
    ],
    "o": [
        _S_R180, _P1,     _G_R270,
        _P1,     _BL,     _P1,
        _G_R90,  _P1,     _S_R0
    ],
    "p": [
        _P3_V,   _C_S,    _G_R90,
        _BL,     _S_R270, _BL,
        _BL,     _BL,     _BL
    ],
    "q": [
        _S_R180, _P1,     _G_R270,
        _P1,     _BL,     _P1,
        _G_R90,  _P1,     _C_S
    ],
    "r": [
        _P3_V,   _C_S,    _S_R90,
        _BL,     _P1,     _S_R180,
        _BL,     _BL,     _G_R270
    ],
    "s": [
        _G_R180, _P3_V,   _S_R90,
        _S_R90,  _BL,     _BL,
        _G_R270, _BL,     _C_S
    ],
    "t": [
        _G_R0,   _P3_V,   _C_S,
        _BL,     _BL,     _BL,
        _BL,     _BL,     _S_R180
    ],
    "u":  [
        _P2_V,   _BL,     _C_S,
        _P1,     _BL,     _P1,
        _G_R90,  _P1,     _S_R0
    ],
    "v": [
        _S_R270, _BL,     _S_R180,
        _G_R90,  _BL,     _G_R0,
        _BL,     _P1,     _BL
    ],
    "w": [
        _S_R270, _BL,     _G_R180,
        _S_R270, _P1,     _G_R180,
        _G_R90,  _BL,     _S_R0
    ],
    "x": [
        _G_R90,  _BL,     _S_R0,
        _BL,     _P1,     _BL,
        _S_R180, _BL,     _G_R270
    ],
    "y": [
        _G_R270, _BL,     _S_R180,
        _BL,     _C_S,    _BL,
        _BL,     _P1,     _BL
    ],
    "z": [
        _G_R0,   _P1,     _S_R0,
        _BL,     _C_S,    _BL,
        _S_R180, _P1,     _S_R180
    ],
    "1": [
        _G_R180, _P3_V,   _BL,
        _BL,     _BL,     _BL,
        _BL,     _BL,     _BL
    ],
    "2": [
        _S_R0,   _P3_V,   _G_R270,
        _BL,     _BL,     _S_R0,
        _C_S,    _BL,     _G_R180
    ],
    "3": [
        _G_R0,   _P1,     _G_R270,
        _BL,     _C_S,    _BL,
        _S_R270, _P1,     _S_R0
    ],
    "4": [
        _BL,     _S_R180, _BL,
        _G_R180, _C_S,    _P1,
        _BL,     _P1,     _BL
    ],
    "5": [
        _BL,     _P1,     _S_R0,
        _BL,     _G_R90,  _P1,
        _BL,     _C_S,    _S_R180
    ],
    "6": [
        _BL,     _S_R0,   _BL,
        _BL,     _P2_V,   _G_R90,
        _BL,     _BL,     _S_R180
    ],
    "7": [
        _G_R0,   _C_S,    _P3_V,
        _BL,     _BL,     _BL,
        _BL,     _BL,     _BL
    ],
    "8": [
        _S_R0,   _C_S,    _S_R90,
        _G_R0,   _BL,     _G_R90,
        _S_R270, _BL,     _S_R180
    ],
    "9": [
        _G_R0,   _P2_V,   _BL,
        _S_R270, _BL,     _BL,
        _BL,     _G_R180, _BL
    ],
    "0": [
        _C_L,    _BL,     _BL,
        _BL,     _BL,     _BL,
        _BL,     _BL,     _BL
    ],
    "!": [
        _P2_V,   _BL,     _BL,
        _BL,     _BL,     _BL,
        _C_S,    _BL,     _BL
    ],
    ".": [
        _BL,     _BL,     _BL,
        _BL,     _BL,     _BL,
        _P1,     _BL,     _BL
    ],
    "'": [
        _P1,     _BL,     _BL,
        _G_R0,   _BL,     _BL,
        _BL,     _BL,     _BL
    ],
    ":": [
        _P1,     _BL,     _BL,
        _BL,     _BL,     _BL,
        _P1,     _BL,     _BL
    ],
    ";": [
        _P1,     _BL,     _BL,
        _BL,     _BL,     _BL,
        _C_S,    _BL,     _BL
    ],
    "/": [
        [_G_R0, 'pos_3_0'], _BL, _S_R180,
        _BL,     _S_R180, _G_R0,
        _S_R180, _G_R0,   _BL
    ],
    "_": [
        _BL,     _BL,     _BL,
        _BL,     _BL,     _BL,
        _P2_H,   _BL,     _BL
    ],
    " ": [
        _BL,     _BL,     _BL,
        _BL,     _BL,     _BL,
        _BL,     _BL,     _BL
    ],
};


/*
 * Transition settings.
 */
const _TRANSITION_PROPS = [
    'top',
    'left',
    'background-color',
    'border-radius',
];

Emblem.define('Olympic2020', { _DEFAULT_OPTIONS, _BASE_DOM, _TRANSITION_PROPS, _formationTable });
