'use strict';

import extend from 'xtend';

const _PATTERN_NAME_PROP = Symbol();
const _PATTERN_PROP      = Symbol();
const _CHAR_PROP         = Symbol();
const _DOM_PROP          = Symbol();
const _DISPLAY_TIME_PROP = Symbol();
const _DURATION_PROP     = Symbol();
const _EASING_PROP       = Symbol();
const _IS_ANIMATING_PROP = Symbol();
const _RESUME_PROP       = Symbol();
const _LOOP_PROP         = Symbol();
const _RANDOM_PROP       = Symbol();
const _PEDAL_PROP        = Symbol();
const _CANSELLER_PROP    = Symbol();

let patterns = {}; // initialized in OKBlock.define

class OKBlock {
    constructor(c, options = {}) {

        if (options.pattern == null) { console.error('options.pattern is not set.'); };
        if (patterns[options.pattern] == null) { console.error(`${ options.pattern } pattern is undefined.`); return; }

        this[_PATTERN_NAME_PROP]  =   options.pattern;
        this[_PATTERN_PROP]       =   patterns[options.pattern];
        this[_IS_ANIMATING_PROP]  =   false;
        this[_RESUME_PROP]        =   null;
        this[_CHAR_PROP]          =   null;
        this[_DOM_PROP]           =   _createDom.call(this);
        this[_CANSELLER_PROP]     =   () => {};

        options = extend(this[_PATTERN_PROP]._DEFAULT_OPTIONS, options);
        let { pattern, size, displayTime, duration, easing, loop, random, pedal } = options;

        // --- options ---
        this.displayTime          =   displayTime;
        this.duration             =   duration;
        this.loop                 =   loop;
        this.random               =   random;
        this.easing               =   easing            || 'cubic-bezier(.26,.92,.41,.98)';
        this.pedal                =   pedal;

        if (typeof size === 'number' && size >= 0) {
            this.size = size;
        } else {
            this.size = 100;
        }

        this.to(c);
    }

    to(c) {
        let _c = c && c.toLowerCase && c.toLowerCase();
        if (!this[_PATTERN_PROP]._formationTable[_c]) { return false; }
        if (this[_CHAR_PROP] === _c) { return false; }
        _changeStyle.call(this, _c);
        this[_CHAR_PROP] = _c;
        return true;
    }

    appendTo(parent) {
        parent.appendChild(this[_DOM_PROP]);
    }

    stopAnimate() {
        this[_IS_ANIMATING_PROP] = false;
    }

    resumeAnimate() {
        this[_IS_ANIMATING_PROP] = true;
        this[_RESUME_PROP]();
    }

    animateFromString(str, opt) {

        this[_IS_ANIMATING_PROP] = true;
        this[_RESUME_PROP]       = null;
        this.options             = opt;

        [].reduce.call(str, (p, c, idx) => {  // p = Promise.resolve(); c = str[idx];
            let isLast = idx === str.length - 1;
            return p.then(() => {
                return new Promise((resolve, reject) => {
                    this[_CANSELLER_PROP] = reject;
                    if (this[_RANDOM_PROP]) {
                        let _c = str[Math.random() * str.length | 0];
                        this.to(_c);
                    } else {
                        this.to(c);
                    }
                    if (isLast) {
                        if (this[_LOOP_PROP]) {
                            setTimeout(() => {
                                this.animateFromString.call(this, str);
                                resolve();
                            }, this[_DISPLAY_TIME_PROP]);
                            return;
                        } else {
                            setTimeout(reject, this[_DISPLAY_TIME_PROP]);
                            return;
                        }
                    }
                    if (!this[_IS_ANIMATING_PROP]) {
                        this[_RESUME_PROP] = resolve;
                    } else {
                        setTimeout(resolve, this[_DISPLAY_TIME_PROP]);
                    }
                });
            });
        }, Promise.resolve()).catch(() => { this[_IS_ANIMATING_PROP] = false; });
    }


    /**
     * Setter and Getter
     */

    // --- options ---
    set options({ size, displayTime, duration, loop, random, pedal, easing } = {}) {
        this.size        = size;
        this.displayTime = displayTime;
        this.duration    = duration;
        this.easing      = easing;
        this.loop        = loop;
        this.random      = random;
        this.pedal       = pedal;
    }
    get options() {
        return {
            size:        this.size,
            displayTime: this.displayTime,
            duration:    this.duration,
            easing:      this.easing,
            loop:        this.loop,
            random:      this.random,
            pedal:       this.pedal,
        }
    }

    // --- size ---
    set size(size) {
        if (size == null) { return; }
        if (typeof size === 'number' && size >= 0) {
            let domStyle = this[_DOM_PROP].style;
            domStyle.width  = `${ size }px`;
            domStyle.height = `${ size }px`;
        } else {
            console.error('OKBlock.size should be type of zero or positive number.');
        }
    }
    get size() { return +this[_DOM_PROP].style.width.replace('px', ''); }


    // --- displayTime ---
    set displayTime(time) {
        if (time == null) { return; }
        if (typeof time === 'number' && time > 0) {
            this[_DISPLAY_TIME_PROP] = time;
        } else {
            console.error('OKBlock.displayTime should be type of positive number.');
        }
    }
    get displayTime() { return this[_DISPLAY_TIME_PROP]; }


    // --- duration ---
    set duration(time) {
        if (time == null) { return; }
        if (typeof time === 'number' && time >= 0) {
            this[_DURATION_PROP] = time;
            _updateTransitionConfig.call(this);
        } else {
            console.error('OKBlock.duration should be type of zero or positive number.');
        }
    }
    get duration() { return this[_DURATION_PROP]; }


    // --- easing ---
    set easing(val) {
        if (val == null) { return; }
        this[_EASING_PROP] = val;
        _updateTransitionConfig.call(this);
    }
    get easing() { return this[_EASING_PROP]; }


    // --- loop ---
    set loop(bool) {
        if (bool == null) { return; }
        this[_LOOP_PROP] = bool;
    }
    get loop() { return this[_LOOP_PROP]; }


    // --- random ---
    set random(bool) {
        if (bool == null) { return; }
        this[_RANDOM_PROP] = bool;
    }
    get random() { return this[_RANDOM_PROP]; }


    // --- pedal ---
    set pedal(bool) {
        if (bool == null) { return; }
        this[_PEDAL_PROP] = bool;
    }
    get pedal() { return this[_PEDAL_PROP]; }


    // --- pattern ---
    get pattern() { return this[_PATTERN_NAME_PROP]; }


    // --- dom ---
    get dom() { return this[_DOM_PROP]; }


    // --- char ---
    get char() { return this[_CHAR_PROP]; }


    // --- isAnimating ---
    get isAnimating() { return this[_IS_ANIMATING_PROP]; }


    // --- allValidChars ---
    get allValidChars() { return Object.keys(this[_PATTERN_PROP]._formationTable); }

    static define(name, obj) {
        if (!('_DEFAULT_OPTIONS' in obj) || !('_BASE_DOM' in obj) || !('_TRANSITION_PROPS' in obj) || !('_formationTable' in obj)) {
            console.error('Pattern is invalid.')
        }
        patterns[name] = obj;
    }

}


function _createDom() {
    return this[_PATTERN_PROP]._BASE_DOM.cloneNode(true);
}

function _changeStyle(c) { // @bind this
    let oldC         = this[_CHAR_PROP];
    let oldFormation = this[_PATTERN_PROP]._formationTable[oldC];
    let newFormation = this[_PATTERN_PROP]._formationTable[c];
    if (!newFormation) { return; }
    let diffFormation;
    if (oldC) {
        diffFormation = newFormation.map((newStr, idx) => {
            let oldStr = oldFormation[idx];
            let newStrIsArr = Array.isArray(newStr);
            let oldStrIsArr = Array.isArray(oldStr);
            if (newStrIsArr && oldStrIsArr) {
                let strIsNotEq = newStr[0] !== oldStr[0];
                let posIsNotEq = newStr[1] !== oldStr[1];
                return strIsNotEq || posIsNotEq ? newStr : false;
            } else {
                if (newStrIsArr || oldStrIsArr) { return newStr; }
                return newStr !== oldStr ? newStr : false;
            }
        });
    } else {
        diffFormation = newFormation;
    }
    [].forEach.call(this[_DOM_PROP].childNodes, (node, idx) => {
        let formation  = diffFormation[idx];
        let specifyPos = Array.isArray(formation);
        if (!formation) { return; }
        let pos;
        if (specifyPos) {
            pos = formation[1];
        } else {
            pos = `pos_${ idx % 3 }_${ idx / 3 | 0 }`;
        }
        node.className = `${ specifyPos ? formation[0] : formation } ${ pos }`;
        if (node.classList.contains('rotate-default')) { return; }
        node.classList.add(_ROTATE_TABLE[Math.random() * 4 | 0]);
    });
}

function _updateTransitionConfig() { // @bind this
    let val = this[_PATTERN_PROP]._TRANSITION_PROPS.reduce((str, prop, idx) => {
        return `${ str }${ idx ? ',' : '' } ${ prop } ${ this[_DURATION_PROP] }ms ${ this[_EASING_PROP] }`;
    }, '');

    _updateStyle(this[_DOM_PROP].childNodes);

    function _updateStyle(list) {
        [].forEach.call(list, node => {
            node.style.transition = val;
            if (node.firstChild) { _updateStyle(node.childNodes); }
        });
    }
}

const _ROTATE_TABLE = ['rotate0', 'rotate90', 'rotate180', 'rotate270'];

export default OKBlock;
