import assert from 'power-assert'
import appendCSS from 'append-css'

describe('OKBlock', () => {
    const BASE_CHAR_LOWER   = 'a';
    const BASE_CHAR_UPPER   = 'A';
    const BASE_CHAR_INVALID = 'あ';
    const ALL_VALID_CHARS   = "abcdefghijklmnopqrstuvwxyz1234567890!.':;/_";
    const CSS_PATHS         = [
        'node_modules/@all-user/ok-patterns-lines/dist/bundle.css',
        'node_modules/@all-user/ok-patterns-olympic2020/dist/bundle.css'
    ];
    const DISPLAY_TIME      = 1000;
    const EMBLEM_SIZE       = 90;
    const GOLD      = 'rgb(180, 145, 70)';
    const SILVER    = 'rgb(180, 180, 180)';
    const DARK_GRAY = 'rgb(55, 55, 55)';
    const SUN_RED   = 'rgb(230, 3, 20)';
    const BLANK     = 'rgba(0, 0, 0, 0)';

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


    describe('DOM', () => {
        let testField = document.createElement('div');
        testField.id = 'emblem-test-field';
        appendCSS(`
            #emblem-test-field {
              width:    100%;
              display:  block;
              position: relative;
              margin:   0;
              padding:  0;
            }
        `);
        appendCSS(`
            #emblem-test-field > div {
              margin: ${ EMBLEM_SIZE / 3 }px;
              float: left;
            }
        `);

        before('DOMContentLoaded待ち', done => {
            let link    = document.createElement('link');
            let docFrag = document.createDocumentFragment();

            CSS_PATHS.forEach(path => {
                let _link = link.cloneNode();
                _link.setAttribute('rel',  'stylesheet');
                _link.setAttribute('href', path);
                docFrag.appendChild(_link);
            });

            new Promise((resolve, reject) => {
                let readyState = document.readyState;

                if (readyState === 'interactive' || readyState === 'complete') {
                    resolve();
                } else {
                    window.onload = resolve;
                }
            }).then(() => {
                document.head.appendChild(docFrag);
                document.body.appendChild(testField);
                done();
            });
        });


        describe('aの文字を表示', () => {
            let olm = new OKBlock('a', { size: EMBLEM_SIZE, pattern: 'Olympic2020' });
            olm.appendTo(testField);


            it('サイズが指定通りになっているか', done => {
                var recentStyle = getComputedStyle(olm.dom);
                assert.equal(olm.size, EMBLEM_SIZE);
                assert.equal(recentStyle.width,  `${ EMBLEM_SIZE }px`);
                assert.equal(recentStyle.height, `${ EMBLEM_SIZE }px`);
                done();
            });


            it('文字のスタイルが正しく設定されているか', done => {
                setTimeout(() => {
                    var recentStyles = [].map.call(olm.dom.childNodes, (node) => {
                        return getComputedStyle(node);
                    });
                    const A_STYLES = [
                        [GOLD],      [DARK_GRAY], [GOLD],
                        [SILVER],    [SUN_RED],   [SILVER],
                        [DARK_GRAY], [BLANK],     [DARK_GRAY]
                    ];
                    recentStyles.forEach((recentStyle, idx) => {
                        assert.equal(recentStyle.backgroundColor, A_STYLES[idx][0]);
                    });
                    done();
                }, DISPLAY_TIME);
            });

        });

        describe('/の文字を表示', () => {
            let olm = new OKBlock('/', { pattern: 'Olympic2020' });
            testField.appendChild(olm.dom);

            it('サイズが指定通りになっているか', done => {
                olm.size = EMBLEM_SIZE;
                let recentStyle = getComputedStyle(olm.dom);
                assert.equal(recentStyle.width,  `${ EMBLEM_SIZE }px`);
                assert.equal(recentStyle.height, `${ EMBLEM_SIZE }px`);
                setTimeout(done, DISPLAY_TIME);
            });

            it('文字のスタイルが正しく設定されているか', done => {
                let recentStyles = [].map.call(olm.dom.childNodes, (node) => {
                    return getComputedStyle(node);
                });
                const SLASH_STYLES = [
                    [GOLD],   [BLANK],  [SILVER],
                    [BLANK],  [SILVER], [GOLD],
                    [SILVER], [GOLD],   [BLANK]
                ];
                recentStyles.forEach((recentStyle, idx) => {
                    assert.equal(recentStyle.backgroundColor, SLASH_STYLES[idx][0]);
                });
                done();
            });
        });

        describe('aの文字を表示後toでzに変換',() => {
            let olm = new OKBlock('a', { pattern: 'Olympic2020' });
            testField.appendChild(olm.dom);

            before('aを表示', done => {
                olm.size = EMBLEM_SIZE;
                olm.to('z');
                setTimeout(done, DISPLAY_TIME);
            });

            it('サイズが指定通りになっているか', done => {
                let recentStyle = getComputedStyle(olm.dom);
                assert.equal(recentStyle.width,  `${ EMBLEM_SIZE }px`);
                assert.equal(recentStyle.height, `${ EMBLEM_SIZE }px`);
                done();
            });

            it('文字のスタイルが正しく設定されているか', done => {
                setTimeout(() => {
                    let recentStyles = [].map.call(olm.dom.childNodes, (node) => {
                        return getComputedStyle(node);
                    });
                    const A_STYLES = [
                        [GOLD],   [DARK_GRAY], [SILVER],
                        [BLANK],  [SUN_RED],   [BLANK],
                        [SILVER], [DARK_GRAY], [SILVER]
                    ];
                    recentStyles.forEach((recentStyle, idx) => {
                        assert.equal(recentStyle.backgroundColor, A_STYLES[idx][0]);
                    });
                    done();
                }, DISPLAY_TIME);
            });

        });

        describe('文字列に沿って順番に変化させる', () => {
            let olm = new OKBlock('a', { pattern: 'Olympic2020', size : 500 });
            testField.appendChild(olm.dom);
            olm.dom.addEventListener('click', () => {
                if (olm.isAnimating) {
                    olm.stopAnimate.call(olm);
                } else {
                    olm.resumeAnimate.call(olm);
                }
            });
            olm.animateFromString(ALL_VALID_CHARS, { loop: true });

            it('変化の様子を観察');
        });

        describe('グローバルにインスタンスを配置', () => {
            let olm = new OKBlock('t', { pattern: 'Lines' });
            testField.appendChild(olm.dom);
            window.emblem = olm;
            olm.size = EMBLEM_SIZE;

            it('コンソールからテスト');
        });

    });

});
