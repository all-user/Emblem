import assert from 'power-assert'
import appendCSS from 'append-css'

describe('OKBlocksGroup test', () => {
    const TITLE_COPY   = 'title copy';
    const LONG_COPY    = 'long copy ................';
    const SHORT_COPY   = 'short';
    const BLANK_COPY   = '                                                        ';

    describe('インスタンスの生成', () => {
        let group = new OKBlocksGroup(TITLE_COPY, { pattern: 'Lines' });

        it('文字列から生成', done => {
            assert.equal(group.toString(), TITLE_COPY);
            done();
        });

        it('長い文字列を与えて変換', done => {
            group.map(LONG_COPY);
            assert.equal(group.toString(), LONG_COPY.slice(0, TITLE_COPY.length));
            done();
        });

        it('短い文字列を与えて変換', done => {
            group.map(SHORT_COPY);
            assert.equal(group.toString(), (SHORT_COPY + BLANK_COPY).slice(0, TITLE_COPY.length));
            done();
        });

        describe('emblemGroup.optionsにオブジェクトを渡して設定', () => {
            let opt = {
                length:      40,
                size:        800,
                displayTime: 3000,
                duration:    1200,
                easing:      'cubic-bezier(.1,.8,.5,.9)',
                loop:        false,
                random:      true,
                pedal:       false,
            };

            it('オプションの各パラメータが正しく設定されているか', done => {
                group.options = opt;
                assert.equal(group.length,      opt.length);
                assert.equal(group.displayTime, opt.displayTime);
                assert.equal(group.loop,        opt.loop);
                assert.equal(group.random,      opt.random);

                assert.deepEqual(group.size,     group.emblems.map(emb => emb.size));
                assert.deepEqual(group.duration, group.emblems.map(emb => emb.duration));
                assert.deepEqual(group.easing,   group.emblems.map(emb => emb.easing));
                assert.deepEqual(group.pedal,    group.emblems.map(emb => emb.pedal));
                done();
            });

            it('group.optionsが返すオブジェクトが正しいか', done => {
                let obj = {
                    length:      opt.length,
                    displayTime: opt.displayTime,
                    loop:        opt.loop,
                    random:      opt.random,
                    size:        Array.from({ length: opt.length }, () => opt.size),
                    duration:    Array.from({ length: opt.length }, () => opt.duration),
                    easing:      Array.from({ length: opt.length }, () => opt.easing),
                    pedal:       Array.from({ length: opt.length }, () => opt.pedal),
                };
                assert.deepEqual(group.options, obj);
                done();
            });
        });
    });

    describe('長さを指定してインスタンスの生成', () => {

        describe('与える文字列より長い長さを指定', () => {
            let group = new OKBlocksGroup(TITLE_COPY, { pattern: 'Lines', length: LONG_COPY.length });

            it('文字列から生成', done => {
                assert.equal(group.toString(), (TITLE_COPY + BLANK_COPY).slice(0, LONG_COPY.length));
                done();
            });

            it('長い文字列を与えて変換', done => {
                group.map(LONG_COPY);
                assert.equal(group.toString(), LONG_COPY);
                done();
            });

            it('短い文字列を与えて変換', done => {
                group.map(SHORT_COPY);
                assert.equal(group.toString(), (SHORT_COPY + BLANK_COPY).slice(0, LONG_COPY.length));
                done();
            });
        })

        describe('与える文字列より短い長さを指定', () => {
            let group = new OKBlocksGroup(TITLE_COPY, { pattern: 'Lines', length: SHORT_COPY.length });

            it('文字列から生成', done => {
                assert.equal(group.toString(), TITLE_COPY.slice(0, SHORT_COPY.length));
                done();
            });

            it('長い文字列を与えて変換', done => {
                group.map(LONG_COPY);
                assert.equal(group.toString(), LONG_COPY.slice(0, SHORT_COPY.length));
                done();
            });

            it('短い文字列を与えて変換', done => {
                group.map(SHORT_COPY);
                assert.equal(group.toString(), SHORT_COPY);
                done();
            });
        })

        describe('サイズを指定', () => {
            let group = new OKBlocksGroup(TITLE_COPY, { pattern: 'Lines', length: SHORT_COPY.length });

            it('文字列から生成', done => {
                assert.equal(group.toString(), TITLE_COPY.slice(0, SHORT_COPY.length));
                done();
            });

            it('長い文字列を与えて変換', done => {
                group.map(LONG_COPY);
                assert.equal(group.toString(), LONG_COPY.slice(0, SHORT_COPY.length));
                done();
            });

            it('短い文字列を与えて変換', done => {
                group.map(SHORT_COPY);
                assert.equal(group.toString(), SHORT_COPY);
                done();
            });

        })

        describe('emblemGroup.optionsにオブジェクトを渡して設定', () => {
            let group = new OKBlocksGroup(TITLE_COPY, { pattern: 'Lines', length: SHORT_COPY.length });
            let opt = {
                length:      40,
                size:        800,
                displayTime: 3000,
                duration:    1200,
                easing:      'cubic-bezier(.1,.8,.5,.9)',
                loop:        false,
                random:      true,
                pedal:       false,
            };

            it('オプションの各パラメータが正しく設定されているか', done => {
                group.options = opt;
                assert.equal(group.length,      opt.length);
                assert.equal(group.displayTime, opt.displayTime);
                assert.equal(group.loop,        opt.loop);
                assert.equal(group.random,      opt.random);

                assert.deepEqual(group.size,     group.emblems.map(emb => emb.size));
                assert.deepEqual(group.duration, group.emblems.map(emb => emb.duration));
                assert.deepEqual(group.easing,   group.emblems.map(emb => emb.easing));
                assert.deepEqual(group.pedal,    group.emblems.map(emb => emb.pedal));
                done();
            });

            it('group.optionsが返すオブジェクトが正しいか', done => {
                let obj = {
                    length:      opt.length,
                    displayTime: opt.displayTime,
                    loop:        opt.loop,
                    random:      opt.random,
                    size:        Array.from({ length: opt.length }, () => opt.size),
                    duration:    Array.from({ length: opt.length }, () => opt.duration),
                    easing:      Array.from({ length: opt.length }, () => opt.easing),
                    pedal:       Array.from({ length: opt.length }, () => opt.pedal),
                };
                assert.deepEqual(group.options, obj);
                done();
            });
        });

    });
});
