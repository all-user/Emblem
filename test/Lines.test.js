import assert from 'power-assert'

describe('Lines Patterns Test', () => {
    const BASE_CHAR_LOWER   = 'a';
    const BASE_CHAR_UPPER   = 'A';
    const BASE_CHAR_INVALID = 'あ';
    const ALL_VALID_CHARS   = "abcdefghijklmnopqrstuvwxyz1234567890!.':;/_";
    const CSS_PATHS         = [
        'src/patterns/Lines/bundle.css',
        'src/patterns/Olympic2020/bundle.css'
    ];
    const DISPLAY_TIME      = 1000;
    const EMBLEM_SIZE       = 90;
    const DEFAULT_WEIGHT    = 3;
    const WEIGHT_LIMIT      = 6;

    let emb;

    beforeEach('インスタンス生成', done => {
        emb = new Emblem(BASE_CHAR_LOWER, { patttern: 'Lines', displayTime: DISPLAY_TIME, size: EMBLEM_SIZE });
        done();
    });

    describe('Emblem#weight', () => {

        it('Emblem.weightはweight = nで設定した値を返す', done => {
            emb.weight = 5;
            assert.equal(emb.weight, 5);
            done();
        });

        it('weight(n)の時Emblem.dom.classListは"lines-emblem"と"weight_n"を含む', done => {
            emb.weight = 5;

            assert(emb.dom.classList.contains('lines-emblem'));
            assert(emb.dom.classList.contains('weight_5'))

            done();
        });

        it('weight(n)の時Emblem.dom.classNameは"lines-emblem weight_n"を返す', done => {
            emb.weight = 5;
            assert.equal(emb.dom.className, 'lines-emblem weight_5')

            done();
        });

    });

    describe('Emblem#bolder', () => {
        it('this.weight + 1を返す', done => {
            emb.bolder();
            assert.equal(emb.weight, DEFAULT_WEIGHT + 1);

            done();
        });

        it('一番太い状態の時はそれ以上太くならない', done => {
            emb.weight = WEIGHT_LIMIT;
            emb.bolder();
            assert.equal(emb.weight, WEIGHT_LIMIT);

            done();
        });

    });

    describe('Emblem#lighter', () => {
        it('this.weight - 1を返す', done => {
            emb.bolder();
            assert.equal(emb.weight, DEFAULT_WEIGHT + 1);

            done();
        });

        it('0より細くならない', done => {
            emb.weight = 0;
            emb.lighter();
            assert.equal(emb.weight, 0);

            done();
        });
    });
});
