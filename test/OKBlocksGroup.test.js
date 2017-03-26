// @flow

import type { TestCase } from '@all-user/ok-blocks.types';

const assert = require('power-assert');
import OKBlocksGroup from '../src/js/OKBlocksGroup.js';

describe('OKBlocksGroup test', () => {
  const TITLE_COPY   = 'title copy';
  const LONG_COPY    = 'long copy ................';
  const SHORT_COPY   = 'short';
  const BLANK_COPY   = '                                                        ';

  const argsVariation = {
    onlyPattern:        [TITLE_COPY, { patternName: ('Lines': ?string) }],
    containLongLength:  [TITLE_COPY, { patternName: ('Lines': ?string), length: LONG_COPY.length }],
    containShortLength: [TITLE_COPY, { patternName: ('Lines': ?string), length: SHORT_COPY.length }]
  };

  describe('インスタンスの生成', () => {
    let testCaseSet: TestCase[] = [
      {
        desc: 'patternNameを指定して初期化',
        args: argsVariation.onlyPattern,
        result: TITLE_COPY
      },
      {
        desc: 'patternName、lengthを指定、与える文字列より長いlengthで初期化',
        args: argsVariation.containLongLength,
        result: (TITLE_COPY + BLANK_COPY).slice(0, LONG_COPY.length)
      },
      {
        desc: 'patternName、lengthを指定、与える文字列より短いlengthで初期化',
        args: argsVariation.containShortLength,
        result: TITLE_COPY.slice(0, SHORT_COPY.length)
      }
    ];

    testCaseSet.forEach(testCase => {
      it(`${ testCase.desc }: 文字列から生成`, done => {
        let group = new OKBlocksGroup(...testCase.args);
        assert.equal(group.toString(), testCase.result);
        done();
      });
    });
  });

  describe('OKBlocksGroup#map', () => {
    let testCaseSet: TestCase[] = [
      {
        desc: 'patternNameを指定して初期化: より長い文字列を引数にする',
        args: {
          params: argsVariation.onlyPattern,
          copy: LONG_COPY
        },
        result: LONG_COPY.slice(0, argsVariation.onlyPattern[0].length)
      },
      {
        desc: 'patternNameを指定して初期化: より短い文字列を引数にする',
        args: {
          params: argsVariation.onlyPattern,
          copy: SHORT_COPY
        },
        result: (SHORT_COPY + BLANK_COPY).slice(0, argsVariation.onlyPattern[0].length)
      },
      {
        desc: 'patternName、lengthを指定、与える文字列より長いlengthで初期化: より長い文字列を引数にする',
        args: {
          params: argsVariation.containLongLength,
          copy: SHORT_COPY + LONG_COPY
        },
        result: (SHORT_COPY + LONG_COPY).slice(0, argsVariation.containLongLength[1].length)
      },
      {
        desc: 'patternName、lengthを指定、与える文字列より長いlengthで初期化: より短い文字列を引数にする',
        args: {
          params: argsVariation.containLongLength,
          copy: SHORT_COPY
        },
        result: (SHORT_COPY + BLANK_COPY).slice(0, argsVariation.containLongLength[1].length)
      },
      {
        desc: 'patternName、lengthを指定、与える文字列より短いlengthで初期化: より長い文字列を引数にする',
        args: {
          params: argsVariation.containShortLength,
          copy: LONG_COPY
        },
        result: LONG_COPY.slice(0, argsVariation.containShortLength[1].length)
      },
      {
        desc: 'patternName、lengthを指定、与える文字列より短いlengthで初期化: より短い文字列を引数にする',
        args: {
          params: argsVariation.containShortLength,
          copy: SHORT_COPY.slice(0, SHORT_COPY.length / 2 | 0)
        },
        result: (SHORT_COPY.slice(0, SHORT_COPY.length / 2 | 0) + BLANK_COPY).slice(0, argsVariation.containShortLength[1].length)
      }
    ];

    testCaseSet.forEach(testCase => {
      it(`${ testCase.desc }`, done => {
        let group = new OKBlocksGroup(...testCase.args.params);
        group.map(testCase.args.copy);
        assert.equal(group.toString(), testCase.result);
        done();
      });
    });
  });

  describe('OKBlocksGroup.optionsにパラメータオブジェクトを渡して設定', () => {
    let testCase = [
      {
        desc: 'patternNameを指定して初期化',
        args: argsVariation.onlyPattern
      },
      {
        desc: 'patternName、lengthを指定、与える文字列より長いlengthで初期化',
        args: argsVariation.containLongLength
      },
      {
        desc: 'patternName、lengthを指定、与える文字列より短いlengthで初期化',
        args: argsVariation.containShortLength
      }
    ];

    let opt = {
      length:      40,
      size:        800,
      displayTime: 3000,
      duration:    1200,
      easing:      'cubic-bezier(.1,.8,.5,.9)',
      loop:        false,
      random:      true,
      distinct:    false
    };

    let singleValueParamNames = ['length', 'displayTime', 'loop', 'random'];
    let returnArrayParamNames = ['size', 'duration', 'easing', 'distinct'];

    testCase.forEach(testCase => {
      singleValueParamNames.forEach(paramName => {
        it(`${ testCase.desc }: Retrun single value: ${ paramName }が正しく設定されているか`, done => {
          let group = new OKBlocksGroup(...argsVariation.onlyPattern);
          group.options = opt;
          // $FlowFixMe
          assert.equal(group[paramName], opt[paramName]);
          done();
        });
      });

      returnArrayParamNames.forEach(paramName => {
        it(`${ testCase.desc }: Retrun Array: ${ paramName }が正しく設定されているか`, done => {
          let group = new OKBlocksGroup(...argsVariation.onlyPattern);
          group.options = opt;
          // $FlowFixMe
          assert.deepEqual(group[paramName], group.blocks.map(e => e[paramName]));
          done();
        });
      });

      it(`${ testCase.desc }: group.optionsが正しいオブジェクトを返す`, done => {
        let group = new OKBlocksGroup(...argsVariation.onlyPattern);
        group.options = opt;
        let obj = {
          length:      opt.length,
          displayTime: opt.displayTime,
          loop:        opt.loop,
          random:      opt.random,
          size:        Array.from({ length: opt.length }, () => opt.size),
          duration:    Array.from({ length: opt.length }, () => opt.duration),
          easing:      Array.from({ length: opt.length }, () => opt.easing),
          distinct:    Array.from({ length: opt.length }, () => opt.distinct)
        };
        assert.deepEqual(group.options, obj);
        done();
      });
    });
  });
});
