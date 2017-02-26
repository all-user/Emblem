/* @flow */
import type {
  OKBlockOptions
} from './OKBlock.js';

export type OKBlocksGroupOptions = {
  length?: number
} & OKBlockOptions;

export type OKBlocksGroupConstructorOptions = {
  pattern: ?string
} & OKBlocksGroupOptions;

export type OKBlocksGroupReturnOptions = {
  length     : number,
  displayTime: number,
  loop       : boolean,
  random     : boolean,
  size       : number[],
  easing     : string[],
  duration   : number[],
  pedal      : boolean[]
};


let OKBlock = require('./OKBlock.js');

class OKBlocksGroup {
  _IS_ANIMATING_PROP: boolean;
  _RESUME_PROP: ?Function;
  _CANSELLER_PROP: Function;
  _EMBLEMS_PROP: OKBlock[];
  _DISPLAY_TIME_PROP: number;
  _LOOP_PROP: boolean;
  _RANDOM_PROP: boolean;


  constructor(chars: string, options: OKBlocksGroupConstructorOptions = { pattern: null }) {
    let { length, displayTime, loop = false, random = false } = options;
    this._IS_ANIMATING_PROP  =   false;
    this._RESUME_PROP        =   null;
    this._CANSELLER_PROP     =   () => {};

    // --- options ---
    if (displayTime && typeof displayTime === 'number') {
      this.displayTime = displayTime | 0;
    } else {
      this.displayTime = 1500;
    }
    this.loop                 =   loop;
    this.random               =   random;

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
      console.error('OKBlocksGroup constructor first argument should be string.');
    }

    delete options.loop;
    delete options.displayTime;
    delete options.random;

    let emblems = _transformToOKBlockArray(chars, options);

    if (emblems) {
      this._EMBLEMS_PROP = emblems;
    } else {
      throw new Error('OKBlocksGroup arguments expect string or array of OKBlock.');
    }
  }

  toString() {
    return this.emblems.map(e => e.char).join('');
  }

  map(str: string) {
    this.emblems.forEach((emblem, idx) => {
      let c = str[idx];
      if (!c) { c = ' '; }
      emblem.to(c);
    });
  }

  appendTo(parent: HTMLElement) {
    var frag = this.emblems.reduce((f, e) => {
      f.appendChild(e.dom);
      return f;
    }, document.createDocumentFragment());
    parent.appendChild(frag);
  }

  stopAnimate() {
    this._IS_ANIMATING_PROP = false;
  }

  resumeAnimate() {
    if (this._RESUME_PROP) {
      this._IS_ANIMATING_PROP = true;
      this._RESUME_PROP();
    }
  }

  animateFromString(str: string, opt: OKBlockOptions) {
    let strArr;
    if (typeof str === 'string') {
      let len = this.emblems.length;
      strArr = [...str].reduce((arr, s, idx) => {
        if (idx % len === 0) { arr.push(''); }
        arr[idx / len | 0] += s;
        return arr;
      }, []);
    } else if (Array.isArray(str) && str.every(s => typeof s === 'string')) {
      strArr = str;
    } else {
      console.error('OKBlocksGroup#animateFromString first argument should be string or array of string.');
      return;
    }

    _animateFromStringArray.call(this, strArr, opt);
  }

  animateFromStringArray(strArr: string[], opt: OKBlockOptions) {
    _animateFromStringArray.call(this, strArr, opt);
  }

  /*
   * Setter and Getter
   */

  // --- options ---
  set options(options: OKBlockOptions = {}) {
    Object.assign(this, options);
  }
  get options(): OKBlocksGroupReturnOptions {
    let { length, displayTime, loop, random, size, duration, easing, pedal } = this;
    return { length, displayTime, loop, random, size, duration, easing, pedal };
  }

  // --- length ---
  set length(lenNew: number) {
    if (lenNew == null) { return; }
    let emblems = this._EMBLEMS_PROP;
    let lenOld  = emblems.length;

    if (lenNew > lenOld) {
      let blankArr = Array.from({ length: lenNew - lenOld }, () => new OKBlock(' ', { pattern: emblems.slice(-1)[0].pattern }));
      this._EMBLEMS_PROP = emblems.concat(blankArr);
    } else if (lenNew < lenOld) {
      this._EMBLEMS_PROP = emblems.slice(0, lenNew);
    }
  }
  get length(): number { return this._EMBLEMS_PROP.length; }

  // --- displayTime ---
  set displayTime(time: number) {
    if (time == null) { return; }
    if (typeof time === 'number' && time > 0) {
      this._DISPLAY_TIME_PROP = time;
    } else {
      console.error('OKBlocksGroup.displayTime should be positive number.');
    }
  }
  get displayTime(): number { return this._DISPLAY_TIME_PROP; }

  // --- loop ---
  set loop(bool: boolean) {
    if (bool == null) { return; }
    this._LOOP_PROP = bool;
  }
  get loop(): boolean { return this._LOOP_PROP; }

  // --- random ---
  set random(bool: boolean) {
    if (bool == null) { return; }
    this._RANDOM_PROP = bool;
  }
  get random(): boolean { return this._RANDOM_PROP; }

  // --- size ---
  set size(size: number) { this._EMBLEMS_PROP.forEach(emb => emb.size = size); }
  get size(): number[]   { return this._EMBLEMS_PROP.map(emb => emb.size); }

  // --- duration ---
  set duration(time: number) { this._EMBLEMS_PROP.forEach(emb => emb.duration = time); }
  get duration(): number[]   { return this._EMBLEMS_PROP.map(emb => emb.duration); }

  // --- easing ---
  set easing(val: string ) { this._EMBLEMS_PROP.forEach(emb => emb.easing = val); }
  get easing(): string[]   { return this._EMBLEMS_PROP.map(emb => emb.easing); }

  // --- pedal ---
  set pedal(val: boolean)     { this._EMBLEMS_PROP.forEach(emb => emb.pedal = val); }
  get pedal(): boolean[]      { return this._EMBLEMS_PROP.map(emb => emb.pedal); }

  // --- emblems ---
  get emblems(): OKBlock[] { return this._EMBLEMS_PROP; }

  // --- isAnimating ---
  get isAnimating(): boolean { return this._IS_ANIMATING_PROP; }
}

function _transformToOKBlockArray(arg, opt: OKBlocksGroupConstructorOptions) { // (string | [OKBlock], object) => [OKBlock] | false

  let res;
  switch (typeof arg) {
  case 'string':
    res = [...arg].map(c => new OKBlock(c, opt));
    break;
  case 'object':
    if (Array.isArray(arg) && arg.every(o => o instanceof OKBlock)) {
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

function _animateFromStringArray(strArr: string[], opt: OKBlockOptions = {}) {
  this._CANSELLER_PROP(); // cansel before animation.

  this._IS_ANIMATING_PROP = true;
  this._RESUME_PROP       = null;
  this.options            = opt;

  strArr.reduce((p, s, idx) => {
    let isLast = idx === strArr.length - 1;
    return p.then(() => {
      return new Promise((resolve, reject) => {
        this._CANSELLER_PROP = reject;
        if (this._RANDOM_PROP) {
          let _s = strArr[Math.random() * strArr.length | 0];
          this.map(_s);
        } else {
          this.map(s);
        }
        if (isLast) {
          if (this.loop) {
            setTimeout(() => {
              resolve();
              _animateFromStringArray.call(this, strArr);
            }, this.displayTime);
          } else {
            this._IS_ANIMATING_PROP = false;
          }
          return;
        }
        if (!this._IS_ANIMATING_PROP) {
          this._RESUME_PROP = resolve;
        } else {
          setTimeout(resolve, this.displayTime);
        }
      });
    });
  }, Promise.resolve()).catch(err => {
    this._IS_ANIMATING_PROP = false;
    console.log('OKBlocksGroup: cansel before animation.');
    console.log(err);
  });
}


module.exports = OKBlocksGroup;
