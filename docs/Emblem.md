# `Emblem` class

エンブレム１文字を表現するクラス。

## Usage

```javascript
var olm = Emblem('t', { size: 300 }); // initial charactor and size in px.

document.addEventListener('DOMContentLoaded', e => {

    olm.appendTo(document.body);
    // or other way.
    // document.body.appendChild(olm.dom);
    // olm.dom is instance of DOMElement.

    olm.to('z'); // change to another charactor.

    olm.animateFromString('tokyo olympic 2020'); // animate from string.
});
```

------------------------------
#### `Emblem Constructor`
- [constructor](https://github.com/all-user/olympic2020/blob/master/docs/Emblem.md#olympic2020-constructor-1)

#### `Emblem Instance Methods`
- [to](https://github.com/all-user/olympic2020/blob/master/docs/Emblem.md#olympic2020prototypetoc)
- [appendTo](https://github.com/all-user/olympic2020/blob/master/docs/Emblem.md#olympic2020prototypeappendtoparent)
- [animateFromString](https://github.com/all-user/olympic2020/blob/master/docs/Emblem.md#olympic2020prototypeanimatefromstringstr-opt)
- [stopAnimate](https://github.com/all-user/olympic2020/blob/master/docs/Emblem.md#olympic2020prototypestopanimate)
- [resumeAnimate](https://github.com/all-user/olympic2020/blob/master/docs/Emblem.md#olympic2020prototyperesumeanimate)

#### `Emblem Instance Properties`
- [options](https://github.com/all-user/olympic2020/blob/master/docs/Emblem.md#options)
- [size](https://github.com/all-user/olympic2020/blob/master/docs/Emblem.md#size)
- [displayTime](https://github.com/all-user/olympic2020/blob/master/docs/Emblem.md#displaytime)
- [duration](https://github.com/all-user/olympic2020/blob/master/docs/Emblem.md#duration)
- [easing](https://github.com/all-user/olympic2020/blob/master/docs/Emblem.md#easing)
- [loop](https://github.com/all-user/olympic2020/blob/master/docs/Emblem.md#loop)
- [random](https://github.com/all-user/olympic2020/blob/master/docs/Emblem.md#random)
- [pedal](https://github.com/all-user/olympic2020/blob/master/docs/Emblem.md#pedal)

#### `Emblem Class Getter Properties`
- [allValidChars](https://github.com/all-user/olympic2020/blob/master/docs/Emblem.md#allvalidchars)

#### `Emblem Instance Getter Properties`
- [dom](https://github.com/all-user/olympic2020/blob/master/docs/Emblem.md#dom)
- [char](https://github.com/all-user/olympic2020/blob/master/docs/Emblem.md#char)
- [isAnimating](https://github.com/all-user/olympic2020/blob/master/docs/Emblem.md#isanimating)

------------------------------

## _Emblem Constructor_

### `Emblem(c, opt)`

`Emblem`のインスタンスを生成する。

#### Arguments

1. __`[c]`__ _(string|null=null)_ : エンブレムが表す文字の初期値。
2. __`[opt]`__ _(Object)_ : その他のオプション。
  - __`[opt.size]`__ _(number=100)_ : エンブレムの大きさ、単位はpx。
  - __`[opt.displayTime]`__ _(number=1500)_ : アニメーション時、opt.durationの時間を含めて一文字が表示され続けている時間。
  - __`[opt.duration]`__ _(number=1000)_ : アニメーション時、次の文字に変化するのに掛かる時間。
  - __`[opt.loop]`__ _(boolean=false)_ : animateFromString実行時、アニメーションをループさせるかどうか。
  - __`[opt.random]`__ _(boolean=false)_ : animateFromString実行時、受け取った文字列から次に変化する文字をランダムで選ぶ。
  - __`[opt.pedal]`__ _(boolean=true)_ : エンブレムに文字が設定された際、その文字が現在と同じ場合何もしない。
  - __`[opt.easing]`__ _(string='cubic-bezier(.26,.92,.41,.98)')_ : 次の文字に変化するアニメーションのイージング、CSS3timing-function。

------------------------------

## _Emblem Instance Methods_

### `Emblem.prototype.to(c)`

エンブレムを別の文字に変化させる。

#### Arguments

1. __`c`__ _(stirng)_ : 変化させる文字。

#### Returns

_(boolean)_ : 受け取った文字に変化した場合はtrue、文字が不正もしくは変化しない場合falseを返す。

------------------------------

### `Emblem.prototype.appendTo(parent)`

引数として受け取った要素にエンブレムを追加する。

#### Arguments

1. __`parent`__ _(ParentNode)_ : エンブレムを追加する親要素。

------------------------------

### `Emblem.prototype.animateFromString(str, opt)`

受け取った文字列に沿って順に文字を変化せていく。

#### Arguments

1. __`str`__ _(string)_ : アニメーションの元になる文字列、この文字列の先頭から順にエンブレムを変化させていく。
2. __`[opt]`__ _(Object)_ : その他のオプション。
  - __`[opt.size]`__ _(number)_ : エンブレムの大きさ、単位はpx。
  - __`[opt.displayTime]`__ _(number)_ : アニメーション時、opt.durationの時間を含めて一文字が表示され続けている時間。
  - __`[opt.duration]`__ _(number)_ : アニメーション時、次の文字に変化するのに掛かる時間。
  - __`[opt.loop]`__ _(boolean)_ : animateFromString実行時、アニメーションをループさせるかどうか。
  - __`[opt.random]`__ _(boolean)_ : animateFromString実行時、受け取った文字列から次に変化する文字をランダムで選ぶ
  - __`[opt.pedal]`__ _(boolean)_ : エンブレムに文字が設定された際、その文字が現在と同じ場合何もしない。
  - __`[opt.easing]`__ _(string)_ : 次の文字に変化するアニメーションのイージング、CSS3timing-function。

------------------------------

### `Emblem.prototype.stopAnimate()`

`Emblem.prototype.animateFromString()`の実行を中断する。

------------------------------

### `Emblem.prototype.resumeAnimate()`

`Emblem.prototype.stopAnimate()`で中断したアニメーションを再開する。

------------------------------

## _Emblem Instance Properties_


### `options`

オブジェクトを代入することでオプションをまとめて設定出来る。<br>
また、参照することでオプション設定をオブジェクトで取得出来る。

#### Type

_(Object)_

#### Example
```javascript
let olm = new Emblem('a' , { size: 5000, displayTime: 12000 });
console.log(olm.options);
// {
//     size       : 5000,
//     displayTime: 12000,
//     duration   : 1000,
//     loop       : false,
//     random     : false,
//     pedal      : true,
//     easing     : 'cubic-bezier(.26,.92,.41,.98)'
// }

olm.opttion = { loop: true, random: true };
console.log(olm.options);
// {
//     size       : 5000,
//     displayTime: 12000,
//     duration   : 1000,
//     loop       : true,
//     random     : true,
//     pedal      : true,
//     easing     : 'cubic-bezier(.26,.92,.41,.98)'
// }
```

------------------------------

### `size`

エンブレムの大きさ。<br>
単位はpx。

#### Type

_(number)_

------------------------------

### `displayTime`

アニメーション時、durationの時間を含めて一文字が表示され続けている時間。<br>
単位は1/1000秒。

#### Type

_(number)_

------------------------------

### `duration`

次の文字に変化するアニメーションの時間。<br>
単位は1/1000秒。

#### Type

_(number)_

------------------------------

### `easing`

次の文字に変化するアニメーションの動き・イージング。<br>
フォーマットはCSS3timing-functionに準拠した文字列。

#### Type

_(string)_

------------------------------

### `loop`

`Emblem.prototype.animateFromString`実行時、アニメーションをループさせるかどうか。

#### Type

_(boolean)_

------------------------------

### `random`

このオプションが有効の時`Emblem.prototype.animateFromString`を実行すると、受け取った文字列から次に変化する文字をランダムで選ぶようになる。

#### Type

_(boolean)_

------------------------------

### `pedal`

このオプションが有効の時、次にエンブレムに設定された文字が現在と同じなら何もしない。

#### Type

_(boolean)_

------------------------------

## _Emblem Class Getter Properties_

### `allValidChars`

現在エンブレムが変更可能な全ての文字の配列。

#### Type

_(`Array`)_


------------------------------

## _Emblem Instance Getter Properties_

### `dom`

エンブレムを構成するDOMエレメント。

#### Type

_(HTMLDivElement)_

------------------------------

### `char`

現在のエンブレムの文字、未定義の場合はnull。

#### Type

_(string|null)_

------------------------------

### `isAnimating`

現在`Emblem.prototype.animateFromString`が実行中かどうか。

#### Type

_(boolean)_
