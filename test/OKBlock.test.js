import assert from 'power-assert'

describe('OKBlock', () => {
    const BASE_CHAR_LOWER   = 'a';
    const BASE_CHAR_UPPER   = 'A';
    const BASE_CHAR_INVALID = 'あ';
    const ALL_VALID_CHARS   = new OKBlock(BASE_CHAR_LOWER, { pattern: 'Lines' }).allValidChars;
    const CSS_PATHS         = [
        'node_modules/@all-user/ok-patterns-lines/dist/bundle.css'
    ];
    const DISPLAY_TIME      = 1000;
    const EMBLEM_SIZE       = 90;

    describe('大文字小文字を区別しない', () => {
        let runCases = [
            {desc: '大文字で初期化', args: [BASE_CHAR_UPPER], result: BASE_CHAR_LOWER},
            {desc: '小文字で初期化', args: [BASE_CHAR_LOWER], result: BASE_CHAR_LOWER}
        ];

        runCases.forEach((runCase, i) => {
            it(runCase.desc, done => {
                let okblock = new OKBlock(...runCase.args, { pattern: 'Lines' });
                assert.equal(okblock.char, runCase.result);
                done();
            });
        });
    });

    describe('instanceof OKBlock', () => {
        let runCases = [
            {desc: 'lower', args: [BASE_CHAR_LOWER], result: OKBlock},
            {desc: 'null',  args: [null],            result: OKBlock}
        ];

        runCases.forEach((runCase, i) => {
            it(runCase.desc, done => {
                let okblock = new OKBlock(...runCase.args, { pattern: 'Lines' });
                assert.ok(okblock instanceof runCase.result);
                done();
            });
        });
    });

    describe('OKBlock#char', () => {
        let runCases = [
            {desc: '小文字で初期化', args: [BASE_CHAR_LOWER], result: BASE_CHAR_LOWER},
            {desc: 'nullで初期化',  args: [null],            result: null}
        ];

        runCases.forEach((runCase, i) => {
            it(runCase.desc, done => {
                let okblock = new OKBlock(...runCase.args, { pattern: 'Lines' });
                assert.equal(okblock.char, runCase.result);
                done();
            });
        });
    });

    describe('OKBlock#to', () => {
        describe('OKBlock#charは常に小文字', () => {
            let runCases = [
                { desc: '小文字で初期化、引数に小文字', args: [BASE_CHAR_LOWER, BASE_CHAR_LOWER], result: BASE_CHAR_LOWER },
                { desc: '小文字で初期化、引数に大文字', args: [BASE_CHAR_LOWER, BASE_CHAR_UPPER], result: BASE_CHAR_LOWER },
                { desc: 'nullで初期化、引数に小文字',  args: [null,            BASE_CHAR_LOWER], result: BASE_CHAR_LOWER },
                { desc: 'nullで初期化、引数に大文字',  args: [null,            BASE_CHAR_UPPER], result: BASE_CHAR_LOWER }
            ];

            runCases.forEach((runCase, i) => {
                it(runCase.desc, done => {
                    let okblock = new OKBlock(runCase.args[0], { pattern: 'Lines' });
                    let res = okblock.to(runCase.args[1]);
                    assert.equal(okblock.char, runCase.result[0]);
                    done();
                });
            });
        });

        describe('OKBlock#pedal有効時、現在の文字と同じ文字を与えるとfalseを返す', () => {
            let runCases = [
                {desc: '小文字で初期化', args: [BASE_CHAR_LOWER], result: false},
                {desc: 'nullで初期化',  args: [null],            result: false}
            ];

            runCases.forEach((runCase, i) => {
                it(runCase.desc, done => {
                    let okblock = new OKBlock(...runCase.args, { pattern: 'Lines' });
                    okblock.to(BASE_CHAR_LOWER);
                    let res = okblock.to(BASE_CHAR_LOWER);
                    assert.equal(res, runCase.result);
                    done();
                });
            });
        });
        
        describe('OKBlock#無効な文字を与えるとfalseを返す', () => {
            let runCases = [
                {desc: '小文字で初期化', args: [BASE_CHAR_LOWER], result: false},
                {desc: 'nullで初期化',  args: [null],            result: false}
            ];

            runCases.forEach((runCase, i) => {
                it(runCase.desc, done => {
                    let okblock = new OKBlock(...runCase.args, { pattern: 'Lines' });
                    let res = okblock.to(BASE_CHAR_INVALID);
                    assert.equal(res, runCase.result);
                    done();
                });
            });
        });
        
        describe('OKBlock#無効な文字を与えてもOKBlock#charは変化しない', () => {
            let runCases = [
                {desc: '小文字で初期化', args: [BASE_CHAR_LOWER], result: null},
                {desc: 'nullで初期化',  args: [null],            result: null}
            ];

            runCases.forEach((runCase, i) => {
                it(runCase.desc, done => {
                    let okblock = new OKBlock(...runCase.args, { pattern: 'Lines' });
                    okblock.to(BASE_CHAR_INVALID);
                    assert.equal(okblock.char, runCase.args[0]);
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
            pedal:       false,
        };

        let runCases = [
            {desc: '小文字で初期化', args: [BASE_CHAR_LOWER], result: opt},
            {desc: 'nullで初期化',  args: [null],            result: opt}
        ];

        runCases.forEach((runCase, i) => {
            it(`${ runCase.desc }: 個別のパラメータ`, done => {
                let okblock = new OKBlock(...runCase.args, { pattern: 'Lines' })
                okblock.options = opt;
                assert.equal(okblock.displayTime, opt.displayTime);
                assert.equal(okblock.duration,    opt.duration);
                assert.equal(okblock.easing,      opt.easing);
                assert.equal(okblock.loop,        opt.loop);
                assert.equal(okblock.random,      opt.random);
                assert.equal(okblock.pedal,       opt.pedal);
                done();
            });

            it(`${ runCase.desc }: OKBlock#optionsが返すオブジェクト`, done => {
                let okblock = new OKBlock(...runCase.args, { pattern: 'Lines' })
                okblock.options = opt;
                assert.deepEqual(okblock.options, opt);
                done();
            });
        });
    });
});
