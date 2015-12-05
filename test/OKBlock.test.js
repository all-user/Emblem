import assert from 'power-assert';

describe('OKBlock', () => {
    const BASE_CHAR_LOWER   = 'a';
    const BASE_CHAR_UPPER   = 'A';
    const BASE_CHAR_INVALID = 'あ';

    describe('大文字小文字を区別しない', () => {
        let testCasess = [
            { desc: '大文字で初期化', args: BASE_CHAR_UPPER, result: BASE_CHAR_LOWER },
            { desc: '小文字で初期化', args: BASE_CHAR_LOWER, result: BASE_CHAR_LOWER }
        ];

        testCasess.forEach(testCases => {
            it(testCases.desc, done => {
                let okblock = new OKBlock(testCases.args, { pattern: 'Lines' });
                assert.equal(okblock.char, testCases.result);
                done();
            });
        });
    });

    describe('instanceof OKBlock', () => {
        let testCasess = [
            { desc: '小文字で初期化', args: BASE_CHAR_LOWER, result: OKBlock },
            { desc: 'nullで初期化',  args: null,            result: OKBlock }
        ];

        testCasess.forEach(testCases => {
            it(testCases.desc, done => {
                let okblock = new OKBlock(testCases.args, { pattern: 'Lines' });
                assert.ok(okblock instanceof testCases.result);
                done();
            });
        });
    });

    describe('OKBlock#char', () => {
        let testCasess = [
            { desc: '小文字で初期化', args: BASE_CHAR_LOWER, result: BASE_CHAR_LOWER },
            { desc: 'nullで初期化',  args: null,            result: null }
        ];

        testCasess.forEach(testCases => {
            it(testCases.desc, done => {
                let okblock = new OKBlock(testCases.args, { pattern: 'Lines' });
                assert.equal(okblock.char, testCases.result);
                done();
            });
        });
    });

    describe('OKBlock#to', () => {
        describe('OKBlock#charは常に小文字', () => {
            let testCasess = [
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

            testCasess.forEach(testCases => {
                it(testCases.desc, done => {
                    let okblock = new OKBlock(testCases.args.from, { pattern: 'Lines' });
                    okblock.to(testCases.args.to);
                    assert.equal(okblock.char, testCases.result);
                    done();
                });
            });
        });

        describe('OKBlock#pedal有効時、現在の文字と同じ文字を与えるとfalseを返す', () => {
            let testCasess = [
                { desc: '小文字で初期化', args: BASE_CHAR_LOWER, result: false },
                { desc: 'nullで初期化',  args: null,            result: false }
            ];

            testCasess.forEach(testCases => {
                it(testCases.desc, done => {
                    let okblock = new OKBlock(testCases.args, { pattern: 'Lines' });
                    okblock.to(BASE_CHAR_LOWER);
                    let res = okblock.to(BASE_CHAR_LOWER);
                    assert.equal(res, testCases.result);
                    done();
                });
            });
        });
        
        describe('OKBlock#無効な文字を与えるとfalseを返す', () => {
            let testCasess = [
                { desc: '小文字で初期化', args: BASE_CHAR_LOWER, result: false },
                { desc: 'nullで初期化',  args: null,            result: false }
            ];

            testCasess.forEach(testCases => {
                it(testCases.desc, done => {
                    let okblock = new OKBlock(testCases.args, { pattern: 'Lines' });
                    let res = okblock.to(BASE_CHAR_INVALID);
                    assert.equal(res, testCases.result);
                    done();
                });
            });
        });
        
        describe('OKBlock#無効な文字を与えてもOKBlock#charは変化しない', () => {
            let testCasess = [
                { desc: '小文字で初期化', args: BASE_CHAR_LOWER, result: null },
                { desc: 'nullで初期化',  args: null,            result: null }
            ];

            testCasess.forEach(testCases => {
                it(testCases.desc, done => {
                    let okblock = new OKBlock(testCases.args, { pattern: 'Lines' });
                    okblock.to(BASE_CHAR_INVALID);
                    assert.equal(okblock.char, testCases.args);
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
            pedal:       false
        };

        let testCasess = [
            { desc: '小文字で初期化', args: BASE_CHAR_LOWER, result: opt },
            { desc: 'nullで初期化',  args: null,            result: opt }
        ];

        testCasess.forEach(testCases => {
            Object.keys(opt).forEach(paramName => {
                let okblock = new OKBlock(testCases.args, { pattern: 'Lines' });
                okblock.options = opt;
                it(`${ testCases.desc }: ${ paramName }が正しく設定されている`, done => {
                    assert.equal(okblock[paramName], opt[paramName]);
                    done();
                });
            });

            it(`${ testCases.desc }: OKBlock#optionsが正しいオブジェクトを返す`, done => {
                let okblock = new OKBlock(testCases.args, { pattern: 'Lines' });
                okblock.options = opt;
                assert.deepEqual(okblock.options, opt);
                done();
            });
        });
    });
});
