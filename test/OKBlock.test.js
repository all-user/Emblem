// @flow
declare var describe: (description: string, body: any) => void;
declare var it: (description: string, body: any) => void;

import type { TestCase } from '@all-user/ok-blocks.types';

const assert = require('power-assert');
import OKBlock from '../src/js/OKBlock.js';

describe('OKBlock', () => {
  const BASE_CHAR_LOWER   = 'a';
  const BASE_CHAR_UPPER   = 'A';
  const BASE_CHAR_INVALID = 'あ';

  describe('大文字小文字を区別しない', () => {
    let testCaseSet: TestCase[] = [
      { desc: '大文字で初期化', args: BASE_CHAR_UPPER, result: BASE_CHAR_LOWER },
      { desc: '小文字で初期化', args: BASE_CHAR_LOWER, result: BASE_CHAR_LOWER }
    ];

    testCaseSet.forEach(testCase => {
      it(testCase.desc, done => {
        let okblock = new OKBlock(testCase.args, { patternName: ('Lines': ?string) });
        assert.equal(okblock.char, testCase.result);
        done();
      });
    });
  });

  describe('instanceof OKBlock', () => {
    let testCaseSet: TestCase[] = [
      { desc: '小文字で初期化', args: BASE_CHAR_LOWER, result: OKBlock },
      { desc: 'nullで初期化',  args: null,            result: OKBlock }
    ];

    testCaseSet.forEach(testCase => {
      it(testCase.desc, done => {
        let okblock = new OKBlock(testCase.args, { patternName: ('Lines': ?string) });
        assert.ok(okblock instanceof testCase.result);
        done();
      });
    });
  });

  describe('OKBlock#char', () => {
    let testCaseSet: TestCase[] = [
      { desc: '小文字で初期化', args: BASE_CHAR_LOWER, result: BASE_CHAR_LOWER },
      { desc: 'nullで初期化',  args: null,            result: null }
    ];

    testCaseSet.forEach(testCase => {
      it(testCase.desc, done => {
        let okblock = new OKBlock(testCase.args, { patternName: ('Lines': ?string) });
        assert.equal(okblock.char, testCase.result);
        done();
      });
    });
  });

  describe('OKBlock#to', () => {
    describe('OKBlock#charは常に小文字', () => {
      let testCaseSet: TestCase[] = [
        {
          desc: '小文字で初期化、引数に小文字',
          args: {
            from: BASE_CHAR_LOWER,
            to:   BASE_CHAR_LOWER
          },
          result: BASE_CHAR_LOWER
        },
        {
          desc: '小文字で初期化、引数に大文字',
          args: {
            from: BASE_CHAR_LOWER,
            to:   BASE_CHAR_UPPER
          },
          result: BASE_CHAR_LOWER
        },
        {
          desc: 'nullで初期化、引数に小文字',
          args: {
            from: null,
            to:   BASE_CHAR_LOWER
          },
          result: BASE_CHAR_LOWER
        },
        {
          desc: 'nullで初期化、引数に大文字',
          args: {
            from: null,
            to:   BASE_CHAR_UPPER
          },
          result: BASE_CHAR_LOWER
        }
      ];

      testCaseSet.forEach(testCase => {
        it(testCase.desc, done => {
          let okblock = new OKBlock(testCase.args.from, { patternName: ('Lines': ?string) });
          okblock.to(testCase.args.to);
          assert.equal(okblock.char, testCase.result);
          done();
        });
      });
    });

    describe('OKBlock#pedal有効時、現在の文字と同じ文字を与えるとfalseを返す', () => {
      let testCaseSet: TestCase[] = [
        { desc: '小文字で初期化', args: BASE_CHAR_LOWER, result: false },
        { desc: 'nullで初期化',  args: null,            result: false }
      ];

      testCaseSet.forEach(testCase => {
        it(testCase.desc, done => {
          let okblock = new OKBlock(testCase.args, { patternName: ('Lines': ?string) });
          okblock.to(BASE_CHAR_LOWER);
          let res = okblock.to(BASE_CHAR_LOWER);
          assert.equal(res, testCase.result);
          done();
        });
      });
    });

    describe('OKBlock#無効な文字を与えるとfalseを返す', () => {
      let testCaseSet: TestCase[] = [
        { desc: '小文字で初期化', args: BASE_CHAR_LOWER, result: false },
        { desc: 'nullで初期化',  args: null,            result: false }
      ];

      testCaseSet.forEach(testCase => {
        it(testCase.desc, done => {
          let okblock = new OKBlock(testCase.args, { patternName: ('Lines': ?string) });
          let res = okblock.to(BASE_CHAR_INVALID);
          assert.equal(res, testCase.result);
          done();
        });
      });
    });

    describe('OKBlock#無効な文字を与えてもOKBlock#charは変化しない', () => {
      let testCaseSet: TestCase[] = [
        { desc: '小文字で初期化', args: BASE_CHAR_LOWER, result: null },
        { desc: 'nullで初期化',  args: null,            result: null }
      ];

      testCaseSet.forEach(testCase => {
        it(testCase.desc, done => {
          let okblock = new OKBlock(testCase.args, { patternName: ('Lines': ?string) });
          okblock.to(BASE_CHAR_INVALID);
          assert.equal(okblock.char, testCase.args);
          done();
        });
      });
    });
  });

  describe('OKBlock#optionsにオブジェクトを渡して設定', () => {
    let opt = {
      size:        800,
      displayTime: 3000,
      duration:    1200,
      easing:      'cubic-bezier(.1,.8,.5,.9)',
      loop:        false,
      random:      true,
      distinct:    false
    };

    let testCaseSet: TestCase[] = [
      { desc: '小文字で初期化', args: BASE_CHAR_LOWER, result: opt },
      { desc: 'nullで初期化',  args: null,            result: opt }
    ];

    testCaseSet.forEach(testCase => {
      Object.keys(opt).forEach(paramName => {
        let okblock = new OKBlock(testCase.args, { patternName: ('Lines': ?string) });
        okblock.options = opt;
        it(`${ testCase.desc }: ${ paramName }が正しく設定されている`, done => {
          // $FlowFixMe
          assert.equal(okblock[paramName], opt[paramName]);
          done();
        });
      });

      it(`${ testCase.desc }: OKBlock#optionsが正しいオブジェクトを返す`, done => {
        let okblock = new OKBlock(testCase.args, { patternName: ('Lines': ?string) });
        okblock.options = opt;
        assert.deepEqual(okblock.options, opt);
        done();
      });
    });
  });
});
