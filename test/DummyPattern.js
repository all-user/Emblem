// @flow
import type {
  OKPatternsDefinition,
  OKBlockOptions,
  OKPatternsFormationTable,
  OKPatternsTransitionProps,
  OKBlock
} from '../src/index.js';

/*
 * default options
 */

const _DEFAULT_OPTIONS: OKBlockOptions = {
  displayTime: 1500,
  duration:    200,
  loop:        false,
  random:      false,
  pedal:       true
};

/*
 * DOM in instance of OKBlock.
 */
const _BASE_DOM = document.createElement('div');

/*
 * Formation settings of all characters.
 */
var _formationTable: OKPatternsFormationTable = {
  'a':['','','','','','','','',''],
  'b':['','','','','','','','',''],
  'c':['','','','','','','','',''],
  'd':['','','','','','','','',''],
  'e':['','','','','','','','',''],
  'f':['','','','','','','','',''],
  'g':['','','','','','','','',''],
  'h':['','','','','','','','',''],
  'i':['','','','','','','','',''],
  'j':['','','','','','','','',''],
  'k':['','','','','','','','',''],
  'l':['','','','','','','','',''],
  'm':['','','','','','','','',''],
  'n':['','','','','','','','',''],
  'o':['','','','','','','','',''],
  'p':['','','','','','','','',''],
  'q':['','','','','','','','',''],
  'r':['','','','','','','','',''],
  's':['','','','','','','','',''],
  't':['','','','','','','','',''],
  'u':['','','','','','','','',''],
  'v':['','','','','','','','',''],
  'w':['','','','','','','','',''],
  'x':['','','','','','','','',''],
  'y':['','','','','','','','',''],
  'z':['','','','','','','','',''],
  ' ':['','','','','','','','',''],
  '.':['','','','','','','','','']
};

/*
 * Transition settings.
 */
const _TRANSITION_PROPS: OKPatternsTransitionProps = [];

module.exports = (OKBlockBase: Class<OKBlock>) => {
  class DummyPattern extends OKBlockBase {}
  const definition: OKPatternsDefinition = { _DEFAULT_OPTIONS, _BASE_DOM, _TRANSITION_PROPS, _formationTable, _Class: DummyPattern };
  OKBlockBase.define('Dummy', definition);
  return DummyPattern;
};
