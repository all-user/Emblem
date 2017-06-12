// @flow

import type {
  OKPatternsDefinition,
  OKBlockConstructorOptions,
  OKBlockReturnOptions,
  OKBlockOptions,
  OKPatternsFormationPos
} from './index.js';

class OKBlock {
  static patterns: {
    [pattern: string]: OKPatternsDefinition
  };
  pattern: string;
  patternDefinition: OKPatternsDefinition;
  isAnimating: boolean;
  resumeAnimate: ?Function;
  char: ?string;
  dom: HTMLElement;
  cancelAnimation: Function;
  _displayTime: number;
  _duration: number;
  _eaasing: string;
  _loop: boolean;
  _random: boolean;
  _distinct: boolean;

  static factory(c: string, options: OKBlockConstructorOptions): OKBlock {
    if (options.pattern == null) { throw new Error('options.pattern is not set.'); }
    if (this.patterns[options.pattern] == null) { throw new Error(`${ options.pattern } pattern is undefined.`); }
    return new this.patterns[options.pattern]._Class(c, options);
  }

  constructor(c: string, options: OKBlockConstructorOptions) {

    if (options.pattern == null) { throw new Error('options.pattern is not set.'); }
    if (this.constructor.patterns[options.pattern] == null) { throw new Error(`${ options.pattern } pattern is undefined.`); }

    this.pattern           = options.pattern;
    this.patternDefinition = this.constructor.patterns[this.pattern];
    this.isAnimating       = false;
    this.resumeAnimate     = null;
    this.char              = null;
    this.dom               = _createDom.call(this);
    this.cancelAnimation   = () => {};

    const _options = Object.assign({}, this.patternDefinition._DEFAULT_OPTIONS, options);
    let { size, displayTime, duration, easing, loop, random, distinct } = _options;

    // --- options ---
    this.displayTime = +displayTime;
    this.duration    = +duration;
    this.loop        = !!loop;
    this.random      = !!random;
    this.easing      = easing || 'cubic-bezier(.26,.92,.41,.98)';
    this.distinct    = !!distinct;

    if (typeof size === 'number' && size >= 0) {
      this.size = size;
    } else {
      this.size = 100;
    }

    this.to(c);
  }

  to(c: string) {
    let _c = c && c.toLowerCase && c.toLowerCase();
    if (!this.patternDefinition._formationTable[_c]) { return false; }
    if (this.char === _c) { return false; }
    _changeStyle.call(this, _c);
    this.char = _c;
    return true;
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.dom);
  }

  stopAnimate() {
    this.isAnimating = false;
  }

  resumeAnimate() {
    if (typeof this.resumeAnimate === 'function') {
      this.isAnimating = true;
      this.resumeAnimate();
    }
  }

  animateFromString(str: string | string[], opt: OKBlockOptions = {}) {

    this.isAnimating = true;
    this.resumeAnimate       = null;
    this.options            = opt;

    [...str].reduce((p, c, idx) => {  // p = Promise.resolve(); c = str[idx];
      let isLast = idx === str.length - 1;
      return p.then(() => {
        return new Promise((resolve, reject) => {
          this.cancelAnimation = reject;
          if (this._random) {
            let _c = str[Math.random() * str.length | 0];
            this.to(_c);
          } else {
            this.to(c);
          }
          if (isLast) {
            if (this._loop) {
              setTimeout(() => {
                resolve();
                this.animateFromString.call(this, str);
              }, this._displayTime);
            } else {
              setTimeout(reject, this._displayTime);
            }
            return;
          }
          if (!this.isAnimating) {
            this.resumeAnimate = resolve;
          } else {
            setTimeout(resolve, this._displayTime);
          }
        });
      });
    }, Promise.resolve()).catch((err: void | Error | string) => {
      this.isAnimating = false;
      console.log('OKBlock: cansel before animation.');
      console.log(err);
    });
  }


  /**
   * Setter and Getter
   */

  // --- options ---
  set options(options: OKBlockOptions = {}) {
    const { size, displayTime, duration, easing, loop, random, distinct } = options;
    if (size != null) { this.size = size; }
    if (displayTime != null) { this.displayTime = displayTime; }
    if (duration != null) { this.duration = duration; }
    if (easing != null) { this.easing = easing; }
    if (loop != null) { this.loop = loop; }
    if (random != null) { this.random = random; }
    if (distinct != null) { this.distinct = distinct; }
  }
  get options(): OKBlockReturnOptions {
    let { size, displayTime, duration, easing, loop, random, distinct } = this;
    return { size, displayTime, duration, easing, loop, random, distinct };
  }

  // --- size ---
  set size(size: number) {
    if (size == null) { return; }
    if (typeof size === 'number' && size >= 0) {
      let domStyle = this.dom.style;
      domStyle.width  = `${ size }px`;
      domStyle.height = `${ size }px`;
    } else {
      console.error('OKBlock.size should zero or positive number.');
    }
  }
  get size(): number { return +this.dom.style.width.replace('px', ''); }


  // --- displayTime ---
  set displayTime(time: number) {
    if (time == null) { return; }
    if (typeof time === 'number' && time > 0) {
      this._displayTime = time;
    } else {
      console.error('OKBlock.displayTime should be positive number.');
    }
  }
  get displayTime(): number { return this._displayTime; }


  // --- duration ---
  set duration(time: number) {
    if (time == null) { return; }
    if (typeof time === 'number' && time >= 0) {
      this._duration = time;
      _updateTransitionConfig.call(this);
    } else {
      console.error('OKBlock.duration should be zero or positive number.', time);
    }
  }
  get duration(): number { return this._duration; }


  // --- easing ---
  set easing(val: string) {
    if (val == null) { return; }
    this._eaasing = val;
    _updateTransitionConfig.call(this);
  }
  get easing(): string { return this._eaasing; }


  // --- loop ---
  set loop(bool: boolean) {
    if (bool == null) { return; }
    this._loop = bool;
  }
  get loop(): boolean { return this._loop; }


  // --- random ---
  set random(bool: boolean) {
    if (bool == null) { return; }
    this._random = bool;
  }
  get random(): boolean { return this._random; }


  // --- distinct ---
  set distinct(bool: boolean) {
    if (bool == null) { return; }
    this._distinct = bool;
  }
  get distinct(): boolean { return this._distinct; }

  // --- allValidChars ---
  get allValidChars(): string[] { return Object.keys(this.patternDefinition._formationTable); }

  static define(name: string, patternDefinition: OKPatternsDefinition) {
    if (!('_DEFAULT_OPTIONS' in patternDefinition) || !('_BASE_DOM' in patternDefinition) || !('_TRANSITION_PROPS' in patternDefinition) || !('_formationTable' in patternDefinition) || !('_Class' in patternDefinition)) {
      console.error('Pattern is invalid.');
    }
    this.patterns[name] = patternDefinition;
  }
}


function _createDom() {
  return this.patternDefinition._BASE_DOM.cloneNode(true);
}

function _changeStyle(c) { // @bind this
  let oldC         = this.char;
  let newFormation = this.patternDefinition._formationTable[c];
  if (!newFormation) { return; }
  let diffFormation;
  if (oldC) {
    const oldFormation = this.patternDefinition._formationTable[oldC];
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
  [...this.dom.childNodes].forEach((node: Node, idx) => {
    if (!(node instanceof HTMLElement)) { return; }
    let formation  = diffFormation[idx];
    if (!formation) { return; }
    let pos: OKPatternsFormationPos;
    if (Array.isArray(formation)) {
      pos = formation[1];
      const _formation = formation[0];
      node.className = `${ _formation } ${ pos }`;
    } else {
      pos = _FORMATION_POS_TABLE[idx + (idx / 3 | 0)];
      node.className = `${ formation } ${ pos }`;
    }
    if (node.classList.contains('rotate-default')) { return; }
    node.classList.add(_ROTATE_TABLE[Math.random() * 4 | 0]);
  });
}

function _updateTransitionConfig() { // @bind this
  const val = this.patternDefinition._TRANSITION_PROPS
  .map(prop => `${prop} ${this._duration}ms ${this._eaasing}`)
  .join(',');

  _updateStyle(this.dom.childNodes);

  function _updateStyle(list) {
    [...list].forEach(node => {
      if (node instanceof HTMLElement) {
        node.style.transition = val;
        if (node.firstChild) { _updateStyle(node.childNodes); }
      } else {
        // $FlowFixMe
        console.error(`node must be HTMLElement. ${ node }`);
      }
    });
  }
}

OKBlock.patterns = {}; // initialized in OKBlock.define


const _ROTATE_TABLE = ['rotate0', 'rotate90', 'rotate180', 'rotate270'];
const _FORMATION_POS_TABLE: OKPatternsFormationPos[] = [
  'pos_0_0',
  'pos_1_0',
  'pos_2_0',
  'pos_3_0',
  'pos_0_1',
  'pos_1_1',
  'pos_2_1',
  'pos_3_1',
  'pos_0_2',
  'pos_1_2',
  'pos_2_2',
  'pos_3_2'
];

export default OKBlock;
