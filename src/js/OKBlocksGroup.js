// @flow
import type {
  OKBlocksGroupOptions,
  OKBlocksGroupConstructorOptions,
  OKBlocksGroupReturnOptions
} from '@internal/types';

import OKBlock from './OKBlock.js';

class OKBlocksGroup {
  isAnimating: boolean;
  resumeAnimation: ?Function;
  cancelAnimation: Function;
  blocks: OKBlock[];
  _displayTime: number;
  _loop: boolean;
  _random: boolean;


  constructor(chars: string, options: OKBlocksGroupConstructorOptions = { patternName: (null: ?string) }) {
    let { length, displayTime, loop = false, random = false } = options;
    this.isAnimating     = false;
    this.resumeAnimation = null;
    this.cancelAnimation = () => {};

    // --- options ---
    if (displayTime && typeof displayTime === 'number') {
      this.displayTime = displayTime | 0;
    } else {
      this.displayTime = 1500;
    }
    this.loop   = loop;
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
      console.error('OKBlocksGroup constructor first argument should be string.');
    }

    delete options.loop;
    delete options.displayTime;
    delete options.random;

    let blocks = _transformToOKBlockArray(chars, options);

    if (blocks) {
      this.blocks = blocks;
    } else {
      throw new Error('OKBlocksGroup arguments expect string or array of OKBlock.');
    }
  }

  toString() {
    return this.blocks.map(e => e.char).join('');
  }

  map(str: string) {
    this.blocks.forEach((emblem, idx) => {
      let c = str[idx];
      if (!c) { c = ' '; }
      emblem.to(c);
    });
  }

  appendTo(parent: HTMLElement) {
    var frag = this.blocks.reduce((f, e) => {
      f.appendChild(e.dom);
      return f;
    }, document.createDocumentFragment());
    parent.appendChild(frag);
  }

  stopAnimate() {
    this.isAnimating = false;
  }

  resumeAnimate() {
    if (typeof this.resumeAnimation === 'function') {
      this.isAnimating = true;
      this.resumeAnimation();
    }
  }

  animateFromString(str: string | string[], opt: OKBlocksGroupOptions) {
    let strArr;
    if (typeof str === 'string') {
      let len = this.blocks.length;
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

  animateFromStringArray(strArr: string[], opt: OKBlocksGroupOptions) {
    _animateFromStringArray.call(this, strArr, opt);
  }

  /*
   * Setter and Getter
   */

  // --- options ---
  set options(options: OKBlocksGroupOptions = {}) {
    const { length, size, displayTime, duration, easing, loop, random, distinct } = options;
    if (length != null) { this.length = length; }
    if (size != null) { this.size = size; }
    if (displayTime != null) { this.displayTime = displayTime; }
    if (duration != null) { this.duration = duration; }
    if (easing != null) { this.easing = easing; }
    if (loop != null) { this.loop = loop; }
    if (random != null) { this.random = random; }
    if (distinct != null) { this.distinct = distinct; }
  }
  get options(): OKBlocksGroupReturnOptions {
    let { length, displayTime, loop, random, size, duration, easing, distinct } = this;
    return { length, displayTime, loop, random, size, duration, easing, distinct };
  }

  // --- length ---
  set length(lenNew: number) {
    if (lenNew == null) { return; }
    let blocks = this.blocks;
    let lenOld = blocks.length;

    if (lenNew > lenOld) {
      let blankArr = Array.from({ length: lenNew - lenOld }, () => new OKBlock(' ', { patternName: blocks.slice(-1)[0].patternName }));
      this.blocks = blocks.concat(blankArr);
    } else if (lenNew < lenOld) {
      this.blocks = blocks.slice(0, lenNew);
    }
  }
  get length(): number { return this.blocks.length; }

  // --- displayTime ---
  set displayTime(time: number) {
    if (time == null) { return; }
    if (typeof time === 'number' && time > 0) {
      this._displayTime = time;
    } else {
      console.error('OKBlocksGroup.displayTime should be positive number.');
    }
  }
  get displayTime(): number { return this._displayTime; }

  // --- loop ---
  set loop(bool: ?boolean) {
    if (bool == null) { return; }
    this._loop = bool;
  }
  get loop(): boolean { return this._loop; }

  // --- random ---
  set random(bool: ?boolean) {
    if (bool == null) { return; }
    this._random = bool;
  }
  get random(): boolean { return this._random; }

  // --- size ---
  set size(size: number) { this.blocks.forEach(emb => emb.size = size); }
  get size(): number[]   { return this.blocks.map(emb => emb.size); }

  // --- duration ---
  set duration(time: number) { this.blocks.forEach(emb => emb.duration = time); }
  get duration(): number[]   { return this.blocks.map(emb => emb.duration); }

  // --- easing ---
  set easing(val: string ) { this.blocks.forEach(emb => emb.easing = val); }
  get easing(): string[]   { return this.blocks.map(emb => emb.easing); }

  // --- distinct ---
  set distinct(val: boolean)     { this.blocks.forEach(emb => emb.distinct = val); }
  get distinct(): boolean[]      { return this.blocks.map(emb => emb.distinct); }
}

function _transformToOKBlockArray(arg: string | OKBlock[], opt: OKBlocksGroupConstructorOptions) { // (string | [OKBlock], object) => [OKBlock] | false

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

function _animateFromStringArray(strArr: string[], opt: OKBlocksGroupOptions = {}) {
  this.cancelAnimation(); // cansel before animation.

  this.isAnimating = true;
  this.resumeAnimation       = null;
  this.options            = opt;

  strArr.reduce((p, s, idx) => {
    let isLast = idx === strArr.length - 1;
    return p.then(() => {
      return new Promise((resolve, reject) => {
        this.cancelAnimation = reject;
        if (this.random) {
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
            this.isAnimating = false;
          }
          return;
        }
        if (!this.isAnimating) {
          this.resumeAnimation = resolve;
        } else {
          setTimeout(resolve, this.displayTime);
        }
      });
    });
  }, Promise.resolve()).catch((err: void | Error | string) => {
    this.isAnimating = false;
    console.log('OKBlocksGroup: cansel before animation.');
    console.log(err);
  });
}


export default OKBlocksGroup;
