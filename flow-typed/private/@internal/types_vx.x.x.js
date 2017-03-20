declare module '@internal/types' {
  declare type CssAnimatableProperty = (
    'all'|'backdrop-filter'|'background'|'background-color'|'background-position'|
    'background-size'|'border'|'border-bottom'|'border-bottom-color'|'border-bottom-left-radius'|
    'border-bottom-right-radius'|'border-bottom-width'|'border-color'|'border-left'|
    'border-left-color'|'border-left-width'|'border-radius'|'border-right'|'border-right-color'|
    'border-right-width'|'border-top'|'border-top-color'|'border-top-left-radius'|
    'border-top-right-radius'|'border-top-width'|'border-width'|'bottom'|'box-shadow'|
    'caret-color'|'clip'|'clip-path'|'color'|'column-count'|'column-gap'|'column-rule'|
    'column-rule-color'|'column-rule-width'|'column-width'|'columns'|'filter'|'flex'|
    'flex-basis'|'flex-grow'|'flex-shrink'|'font'|'font-size'|'font-size-adjust'|'font-stretch'|
    'font-variation-settings'|'font-weight'|'grid-column-gap'|'grid-gap'|'grid-row-gap'|
    'height'|'left'|'letter-spacing'|'line-height'|'margin'|'margin-bottom'|'margin-left'|
    'margin-right'|'margin-top'|'mask'|'mask-position'|'mask-size'|'max-height'|'max-width'|
    'min-height'|'min-width'|'motion-offset'|'motion-rotation'|'object-position'|'opacity'|
    'order'|'outline'|'outline-color'|'outline-offset'|'outline-width'|'padding'|'padding-bottom'|
    'padding-left'|'padding-right'|'padding-top'|'perspective'|'perspective-origin'|
    'right'|'scroll-snap-coordinate'|'scroll-snap-destination'|'shape-image-threshold'|
    'shape-margin'|'shape-outside'|'tab-size'|'text-decoration'|'text-decoration-color'|
    'text-emphasis'|'text-emphasis-color'|'text-indent'|'text-shadow'|'top'|'transform'|
    'transform-origin'|'vertical-align'|'visibility'|'width'|'word-spacing'|'z-index'
  );

  declare interface OKBlockOptions {
    size?       : number;
    displayTime?: number;
    duration?   : number;
    loop?       : boolean;
    random?     : boolean;
    distinct?   : boolean;
    easing?     : string;
  }

  declare interface OKBlocksGroupOptions extends OKBlockOptions {
    length?: number;
  }

  declare interface OKBlockConstructorOptions extends OKBlockOptions {
    patternName: ?string;
  }

  declare interface OKBlocksGroupConstructorOptions extends OKBlocksGroupOptions {
    patternName: ?string;
  }

  declare type OKBlockReturnOptions = {
    size       : number,
    displayTime: number,
    duration   : number,
    loop       : boolean,
    random     : boolean,
    distinct   : boolean,
    easing     : string
  };

  declare interface OKPatternsDefinition {
    _DEFAULT_OPTIONS: OKBlockOptions;
    _BASE_DOM: HTMLElement;
    _formationTable: OKPatternsFormationTable;
    _TRANSITION_PROPS: OKPatternsTransitionProps;
  }

  declare type OKPatternsFormation = [
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

  declare type OKPatternsFormationItem = string | [string, OKPatternsFormationPos];
  declare type OKPatternsFormationPos = (
    'pos_0_0'|'pos_1_0'|'pos_2_0'|'pos_3_0'|
    'pos_0_1'|'pos_1_1'|'pos_2_1'|'pos_3_1'|
    'pos_0_2'|'pos_1_2'|'pos_2_2'|'pos_3_2'
  );

  declare interface OKPatternsFormationTable {
    [char: string]: OKPatternsFormation;
  }

  declare type OKPatternsTransitionProps = CssAnimatableProperty[];

  declare type OKBlocksGroupReturnOptions = {
    length     : number,
    displayTime: number,
    loop       : boolean,
    random     : boolean,
    size       : number[],
    easing     : string[],
    duration   : number[],
    distinct      : boolean[]
  };

  declare interface TestCase {
    desc: string;
    args: any;
    result: any;
  }
}
