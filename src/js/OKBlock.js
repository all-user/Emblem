/* @flow */
class OKBlock {
  static patterns: {
    [patternName: string]: OKPatternsDefinition
  };
  _PATTERN_NAME_PROP: string;
  _PATTERN_PROP: OKPatternsDefinition;
  _IS_ANIMATING_PROP: boolean;
  _RESUME_PROP: ?Function;
  _CHAR_PROP: ?string;
  _DOM_PROP: HTMLElement;
  _CANSELLER_PROP: Function;
  _DISPLAY_TIME_PROP: number;
  _DURATION_PROP: number;
  _EASING_PROP: string;
  _LOOP_PROP: boolean;
  _RANDOM_PROP: boolean;
  _PEDAL_PROP: boolean;

  constructor(c: string, options: OKBlockConstructorOptions = { pattern: null }) {

    if (options.pattern == null) { console.error('options.pattern is not set.'); return; }
    if (this.constructor.patterns[options.pattern] == null) { console.error(`${ options.pattern } pattern is undefined.`); return; }

    this._PATTERN_NAME_PROP  =   options.pattern;
    this._PATTERN_PROP       =   this.constructor.patterns[options.pattern];
    this._IS_ANIMATING_PROP  =   false;
    this._RESUME_PROP        =   null;
    this._CHAR_PROP          =   null;
    this._DOM_PROP           =   _createDom.call(this);
    this._CANSELLER_PROP     =   () => {};

    options = Object.assign({}, this._PATTERN_PROP._DEFAULT_OPTIONS, options);
    let { size, displayTime, duration, easing, loop, random, pedal } = options;

    // --- options ---
    this.displayTime          =   +displayTime;
    this.duration             =   +duration;
    this.loop                 =   !!loop;
    this.random               =   !!random;
    this.easing               =   easing || 'cubic-bezier(.26,.92,.41,.98)';
    this.pedal                =   !!pedal;

    if (typeof size === 'number' && size >= 0) {
      this.size = size;
    } else {
      this.size = 100;
    }

    this.to(c);
  }

  to(c: string) {
    let _c = c && c.toLowerCase && c.toLowerCase();
    if (!this._PATTERN_PROP._formationTable[_c]) { return false; }
    if (this._CHAR_PROP === _c) { return false; }
    _changeStyle.call(this, _c);
    this._CHAR_PROP = _c;
    return true;
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this._DOM_PROP);
  }

  stopAnimate() {
    this._IS_ANIMATING_PROP = false;
  }

  resumeAnimate() {
    if (this._RESUME_PROP == null) { return; }
    this._IS_ANIMATING_PROP = true;
    this._RESUME_PROP();
  }

  animateFromString(str: string, opt: OKBlockOptions = {}) {

    this._IS_ANIMATING_PROP = true;
    this._RESUME_PROP       = null;
    this.options            = opt;

    [...str].reduce((p, c, idx) => {  // p = Promise.resolve(); c = str[idx];
      let isLast = idx === str.length - 1;
      return p.then(() => {
        return new Promise((resolve, reject) => {
          this._CANSELLER_PROP = reject;
          if (this._RANDOM_PROP) {
            let _c = str[Math.random() * str.length | 0];
            this.to(_c);
          } else {
            this.to(c);
          }
          if (isLast) {
            if (this._LOOP_PROP) {
              setTimeout(() => {
                resolve();
                this.animateFromString.call(this, str);
              }, this._DISPLAY_TIME_PROP);
            } else {
              setTimeout(reject, this._DISPLAY_TIME_PROP);
            }
            return;
          }
          if (!this._IS_ANIMATING_PROP) {
            this._RESUME_PROP = resolve;
          } else {
            setTimeout(resolve, this._DISPLAY_TIME_PROP);
          }
        });
      });
    }, Promise.resolve()).catch(err => {
      this._IS_ANIMATING_PROP = false;
      console.log('OKBlock: cansel before animation.');
      console.log(err);
    });
  }


  /**
   * Setter and Getter
   */

  // --- options ---
  set options(options: OKBlockOptions = {}) {
    Object.assign(this, options);
  }
  get options(): OKBlockReturnOptions {
    let { size, displayTime, duration, easing, loop, random, pedal } = this;
    return { size, displayTime, duration, easing, loop, random, pedal };
  }

  // --- size ---
  set size(size: number) {
    if (size == null) { return; }
    if (typeof size === 'number' && size >= 0) {
      let domStyle = this._DOM_PROP.style;
      domStyle.width  = `${ size }px`;
      domStyle.height = `${ size }px`;
    } else {
      console.error('OKBlock.size should zero or positive number.');
    }
  }
  get size(): number { return +this._DOM_PROP.style.width.replace('px', ''); }


  // --- displayTime ---
  set displayTime(time: number) {
    if (time == null) { return; }
    if (typeof time === 'number' && time > 0) {
      this._DISPLAY_TIME_PROP = time;
    } else {
      console.error('OKBlock.displayTime should be positive number.');
    }
  }
  get displayTime(): number { return this._DISPLAY_TIME_PROP; }


  // --- duration ---
  set duration(time: number) {
    if (time == null) { return; }
    if (typeof time === 'number' && time >= 0) {
      this._DURATION_PROP = time;
      _updateTransitionConfig.call(this);
    } else {
      console.error('OKBlock.duration should be zero or positive number.', time);
    }
  }
  get duration(): number { return this._DURATION_PROP; }


  // --- easing ---
  set easing(val: string) {
    if (val == null) { return; }
    this._EASING_PROP = val;
    _updateTransitionConfig.call(this);
  }
  get easing(): string { return this._EASING_PROP; }


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


  // --- pedal ---
  set pedal(bool: boolean) {
    if (bool == null) { return; }
    this._PEDAL_PROP = bool;
  }
  get pedal(): boolean { return this._PEDAL_PROP; }


  // --- pattern ---
  get pattern(): string { return this._PATTERN_NAME_PROP; }


  // --- dom ---
  get dom(): HTMLElement { return this._DOM_PROP; }


  // --- char ---
  get char(): ?string { return this._CHAR_PROP; }


  // --- isAnimating ---
  get isAnimating(): boolean { return this._IS_ANIMATING_PROP; }


  // --- allValidChars ---
  get allValidChars(): string[] { return Object.keys(this._PATTERN_PROP._formationTable); }

  static define(name, obj) {
    if (!('_DEFAULT_OPTIONS' in obj) || !('_BASE_DOM' in obj) || !('_TRANSITION_PROPS' in obj) || !('_formationTable' in obj)) {
      console.error('Pattern is invalid.');
    }
    this.patterns[name] = obj;
  }
}


function _createDom() {
  return this._PATTERN_PROP._BASE_DOM.cloneNode(true);
}

function _changeStyle(c) { // @bind this
  let oldC         = this._CHAR_PROP;
  let newFormation = this._PATTERN_PROP._formationTable[c];
  if (!newFormation) { return; }
  let diffFormation;
  if (oldC) {
    const oldFormation = this._PATTERN_PROP._formationTable[oldC];
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
  [...this._DOM_PROP.childNodes].forEach((node: Node, idx) => {
    if (!(node instanceof HTMLElement)) { return; }
    let formation  = diffFormation[idx];
    if (!formation) { return; }
    let pos: OKPatternsFormationPos;
    if (Array.isArray(formation)) {
      pos = formation[1];
      const _formation = formation[0];
      node.className = `${ _formation } ${ pos }`;
    } else {
      pos = _FORMATION_POS_TABLE[idx % 3 + (idx / 3 | 0)];
      node.className = `${ formation } ${ pos }`;
    }
    if (node.classList.contains('rotate-default')) { return; }
    node.classList.add(_ROTATE_TABLE[Math.random() * 4 | 0]);
  });
}

function _updateTransitionConfig() { // @bind this
  // let val = this._PATTERN_PROP._TRANSITION_PROPS.reduce((str, prop, idx) => {
  //   return `${ str }${ idx ? ',' : '' } ${ prop } ${ this._DURATION_PROP }ms ${ this._EASING_PROP }`;
  // }, '');
  const val = this._PATTERN_PROP._TRANSITION_PROPS
  .map(prop => `${prop} ${this._DURATION_PROP}ms ${this._EASING_PROP}`)
  .join(',');

  _updateStyle(this._DOM_PROP.childNodes);

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

module.exports = OKBlock;

export type OKPatternsDefinition = {
  _DEFAULT_OPTIONS: OKBlockOptions,
  _BASE_DOM: HTMLElement,
  _formationTable: OKPatternsFormationTable,
  _TRANSITION_PROPS: OKPatternsTransitionProps
};

export type OKPatternsTransitionProps = CssAnimatableProperty[];
export type CssAnimatableProperty =
'all'|
'backdrop-filter'|
'background'|
'background-color'|
'background-position'|
'background-size'|
'border'|
'border-bottom'|
'border-bottom-color'|
'border-bottom-left-radius'|
'border-bottom-right-radius'|
'border-bottom-width'|
'border-color'|
'border-left'|
'border-left-color'|
'border-left-width'|
'border-radius'|
'border-right'|
'border-right-color'|
'border-right-width'|
'border-top'|
'border-top-color'|
'border-top-left-radius'|
'border-top-right-radius'|
'border-top-width'|
'border-width'|
'bottom'|
'box-shadow'|
'caret-color'|
'clip'|
'clip-path'|
'color'|
'column-count'|
'column-gap'|
'column-rule'|
'column-rule-color'|
'column-rule-width'|
'column-width'|
'columns'|
'filter'|
'flex'|
'flex-basis'|
'flex-grow'|
'flex-shrink'|
'font'|
'font-size'|
'font-size-adjust'|
'font-stretch'|
'font-variation-settings'|
'font-weight'|
'grid-column-gap'|
'grid-gap'|
'grid-row-gap'|
'height'|
'left'|
'letter-spacing'|
'line-height'|
'margin'|
'margin-bottom'|
'margin-left'|
'margin-right'|
'margin-top'|
'mask'|
'mask-position'|
'mask-size'|
'max-height'|
'max-width'|
'min-height'|
'min-width'|
'motion-offset'|
'motion-rotation'|
'object-position'|
'opacity'|
'order'|
'outline'|
'outline-color'|
'outline-offset'|
'outline-width'|
'padding'|
'padding-bottom'|
'padding-left'|
'padding-right'|
'padding-top'|
'perspective'|
'perspective-origin'|
'right'|
'scroll-snap-coordinate'|
'scroll-snap-destination'|
'shape-image-threshold'|
'shape-margin'|
'shape-outside'|
'tab-size'|
'text-decoration'|
'text-decoration-color'|
'text-emphasis'|
'text-emphasis-color'|
'text-indent'|
'text-shadow'|
'top'|
'transform'|
'transform-origin'|
'vertical-align'|
'visibility'|
'width'|
'word-spacing'|
'z-index';

export type OKPatternsFormationTable = {
  [char: string]: OKPatternsFormation
};

export type OKPatternsFormation = [
  OKPatternsFormationItem,
  OKPatternsFormationItem,
  OKPatternsFormationItem,
  OKPatternsFormationItem,
  OKPatternsFormationItem,
  OKPatternsFormationItem,
  OKPatternsFormationItem,
  OKPatternsFormationItem,
  OKPatternsFormationItem
];

export type OKPatternsFormationItem = string | [string, OKPatternsFormationPos];
export type OKPatternsFormationPos =
'pos_0_0'|
'pos_1_0'|
'pos_2_0'|
'pos_3_0'|
'pos_0_1'|
'pos_1_1'|
'pos_2_1'|
'pos_3_1'|
'pos_0_2'|
'pos_1_2'|
'pos_2_2'|
'pos_3_2';

export type OKBlockOptions = {
  size?       : number,
  displayTime?: number,
  duration?   : number,
  loop?       : boolean,
  random?     : boolean,
  pedal?      : boolean,
  easing?     : string
};

export type OKBlockConstructorOptions = {
  pattern: ?string
} & OKBlockOptions;

export type OKBlockReturnOptions = {
  size       : number,
  displayTime: number,
  duration   : number,
  loop       : boolean,
  random     : boolean,
  pedal      : boolean,
  easing     : string
};

export type OKPattern = any;
