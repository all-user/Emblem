# SquarePatterner

Generate emblem composed of 3x3 elements.

## Usage

```shell
npm i minimas
```

```html
<head>
    <script src="path/to/square-patterner/dist/bundle.js"></script>
    <link rel="stylesheet" href="path/to/square-patterner/dist/bundle.css">
</head>
<body>
    <script>
        var { Emblem, EmblemGroup } = SquarePatterner;
        var emb = Emblem('a', { size: 300 }); // initial charactor and size in px.

        document.addEventListener('DOMContentLoaded', function() {

            emb.appendTo(document.body);
            // or other way.
            // document.body.appendChild(emb.dom);
            // emb.dom is instance of DOMElement.

            emb.to('z'); // change to another charactor.

            emb.animateFromString("abc123!'.:;/_"); // animate from string.

            // grouping
            var group = new EmblemGroup('from any message.');

            group.appendTo(document.body);
        });
    </script>
</body>
```

## Documentation

- [__`Emblem`__]()
- [__`EmblemGroup`__]()
