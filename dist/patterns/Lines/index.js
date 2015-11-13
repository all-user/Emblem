(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":3}],2:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":4}],3:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function defineProperty(it, key, desc){
  return $.setDesc(it, key, desc);
};
},{"../../modules/$":22}],4:[function(require,module,exports){
require('../../modules/es6.symbol');
require('../../modules/es6.object.to-string');
module.exports = require('../../modules/$.core').Symbol;
},{"../../modules/$.core":8,"../../modules/es6.object.to-string":32,"../../modules/es6.symbol":33}],5:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],6:[function(require,module,exports){
var isObject = require('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":21}],7:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],8:[function(require,module,exports){
var core = module.exports = {version: '1.2.6'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],9:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./$.a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./$.a-function":5}],10:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],11:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":14}],12:[function(require,module,exports){
// all enumerable object keys, includes symbols
var $ = require('./$');
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getSymbols = $.getSymbols;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = $.isEnum
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
  }
  return keys;
};
},{"./$":22}],13:[function(require,module,exports){
var global    = require('./$.global')
  , core      = require('./$.core')
  , ctx       = require('./$.ctx')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
// type bitmap
$export.F = 1;  // forced
$export.G = 2;  // global
$export.S = 4;  // static
$export.P = 8;  // proto
$export.B = 16; // bind
$export.W = 32; // wrap
module.exports = $export;
},{"./$.core":8,"./$.ctx":9,"./$.global":16}],14:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],15:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./$.to-iobject')
  , getNames  = require('./$').getNames
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames(toIObject(it));
};
},{"./$":22,"./$.to-iobject":29}],16:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],17:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],18:[function(require,module,exports){
var $          = require('./$')
  , createDesc = require('./$.property-desc');
module.exports = require('./$.descriptors') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":22,"./$.descriptors":11,"./$.property-desc":25}],19:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./$.cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":7}],20:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./$.cof');
module.exports = Array.isArray || function(arg){
  return cof(arg) == 'Array';
};
},{"./$.cof":7}],21:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],22:[function(require,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],23:[function(require,module,exports){
var $         = require('./$')
  , toIObject = require('./$.to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./$":22,"./$.to-iobject":29}],24:[function(require,module,exports){
module.exports = true;
},{}],25:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],26:[function(require,module,exports){
module.exports = require('./$.hide');
},{"./$.hide":18}],27:[function(require,module,exports){
var def = require('./$').setDesc
  , has = require('./$.has')
  , TAG = require('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./$":22,"./$.has":17,"./$.wks":31}],28:[function(require,module,exports){
var global = require('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":16}],29:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./$.iobject')
  , defined = require('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":10,"./$.iobject":19}],30:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],31:[function(require,module,exports){
var store  = require('./$.shared')('wks')
  , uid    = require('./$.uid')
  , Symbol = require('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
};
},{"./$.global":16,"./$.shared":28,"./$.uid":30}],32:[function(require,module,exports){

},{}],33:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $              = require('./$')
  , global         = require('./$.global')
  , has            = require('./$.has')
  , DESCRIPTORS    = require('./$.descriptors')
  , $export        = require('./$.export')
  , redefine       = require('./$.redefine')
  , $fails         = require('./$.fails')
  , shared         = require('./$.shared')
  , setToStringTag = require('./$.set-to-string-tag')
  , uid            = require('./$.uid')
  , wks            = require('./$.wks')
  , keyOf          = require('./$.keyof')
  , $names         = require('./$.get-names')
  , enumKeys       = require('./$.enum-keys')
  , isArray        = require('./$.is-array')
  , anObject       = require('./$.an-object')
  , toIObject      = require('./$.to-iobject')
  , createDesc     = require('./$.property-desc')
  , getDesc        = $.getDesc
  , setDesc        = $.setDesc
  , _create        = $.create
  , getNames       = $names.get
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , setter         = false
  , HIDDEN         = wks('_hidden')
  , isEnum         = $.isEnum
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , useNative      = typeof $Symbol == 'function'
  , ObjectProto    = Object.prototype;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(setDesc({}, 'a', {
    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = getDesc(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  setDesc(it, key, D);
  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
} : setDesc;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol.prototype);
  sym._k = tag;
  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    }
  });
  return sym;
};

var isSymbol = function(it){
  return typeof it == 'symbol';
};

var $defineProperty = function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return setDesc(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key);
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
    ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toIObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
};
var $stringify = function stringify(it){
  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
  var args = [it]
    , i    = 1
    , $$   = arguments
    , replacer, $replacer;
  while($$.length > i)args.push($$[i++]);
  replacer = args[1];
  if(typeof replacer == 'function')$replacer = replacer;
  if($replacer || !isArray(replacer))replacer = function(key, value){
    if($replacer)value = $replacer.call(this, key, value);
    if(!isSymbol(value))return value;
  };
  args[1] = replacer;
  return _stringify.apply($JSON, args);
};
var buggyJSON = $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
});

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
  };
  redefine($Symbol.prototype, 'toString', function toString(){
    return this._k;
  });

  isSymbol = function(it){
    return it instanceof $Symbol;
  };

  $.create     = $create;
  $.isEnum     = $propertyIsEnumerable;
  $.getDesc    = $getOwnPropertyDescriptor;
  $.setDesc    = $defineProperty;
  $.setDescs   = $defineProperties;
  $.getNames   = $names.get = $getOwnPropertyNames;
  $.getSymbols = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require('./$.library')){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }
}

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call((
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
  'species,split,toPrimitive,toStringTag,unscopables'
).split(','), function(it){
  var sym = wks(it);
  symbolStatics[it] = useNative ? sym : wrap(sym);
});

setter = true;

$export($export.G + $export.W, {Symbol: $Symbol});

$export($export.S, 'Symbol', symbolStatics);

$export($export.S + $export.F * !useNative, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"./$":22,"./$.an-object":6,"./$.descriptors":11,"./$.enum-keys":12,"./$.export":13,"./$.fails":14,"./$.get-names":15,"./$.global":16,"./$.has":17,"./$.is-array":20,"./$.keyof":23,"./$.library":24,"./$.property-desc":25,"./$.redefine":26,"./$.set-to-string-tag":27,"./$.shared":28,"./$.to-iobject":29,"./$.uid":30,"./$.wks":31}],34:[function(require,module,exports){
/*
 * default options
 */

'use strict';

var _Symbol = require('babel-runtime/core-js/symbol')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _DEFAULT_OPTIONS = {
    displayTime: 1500,
    duration: 200,
    loop: false,
    random: false,
    pedal: true
};

/*
 * DOM in instance of Emblem.
 */
var _BASE_DOM = (function () {
    var wrapper = document.createElement('div');
    var part = document.createElement('div');
    var whiteBoxWrapper = document.createElement('div');
    var whiteBoxBase = document.createElement('div');
    var docFrag = document.createDocumentFragment();

    wrapper.className = 'lines-emblem weight_3';
    part.className = 'part';
    whiteBoxWrapper.className = 'whitebox-wrapper';

    // in emmet syntax.
    // div.whitebox-wrapper > div.whitebox * 4
    var _arr = [0, 1, 2, 3];
    for (var _i = 0; _i < _arr.length; _i++) {
        var i = _arr[_i];
        var whiteBox = whiteBoxBase.cloneNode();
        whiteBox.className = 'whitebox pos_' + i;
        whiteBoxWrapper.appendChild(whiteBox);
    }

    part.appendChild(whiteBoxWrapper);

    // in emmet syntax.
    // div.wrapper > div.part * 9
    for (var i = 0; i < 9; i++) {
        var _part = part.cloneNode(true);
        _part.classList.add('pos_' + i % 3 + '_' + (i / 3 | 0));
        docFrag.appendChild(_part);
    }
    wrapper.appendChild(docFrag);

    return wrapper;
})();

/*
 * Parts className table.
 */
var _I_R0 = "part i-shaped rotate0 rotate-default";
var _I_R90 = "part i-shaped rotate90 rotate-default";
var _L_R0 = "part l-shaped rotate0 rotate-default";
var _L_R90 = "part l-shaped rotate90 rotate-default";
var _L_R180 = "part l-shaped rotate180 rotate-default";
var _L_R270 = "part l-shaped rotate270 rotate-default";
var _L_RD_R0 = "part l-shaped-radius rotate0 rotate-default";
var _L_RD_R90 = "part l-shaped-radius rotate90 rotate-default";
var _L_RD_R180 = "part l-shaped-radius rotate180 rotate-default";
var _L_RD_R270 = "part l-shaped-radius rotate270 rotate-default";
var _T_R0 = "part t-shaped rotate0 rotate-default";
var _T_R90 = "part t-shaped rotate90 rotate-default";
var _T_R180 = "part t-shaped rotate180 rotate-default";
var _T_R270 = "part t-shaped rotate270 rotate-default";
var _T_RD_R0 = "part t-shaped-radius rotate0 rotate-default";
var _T_RD_R90 = "part t-shaped-radius rotate90 rotate-default";
var _T_RD_R180 = "part t-shaped-radius rotate180 rotate-default";
var _T_RD_R270 = "part t-shaped-radius rotate270 rotate-default";
var _T_LRD_R0 = "part t-shaped-l-radius rotate0 rotate-default";
var _T_LRD_R90 = "part t-shaped-l-radius rotate90 rotate-default";
var _T_LRD_R180 = "part t-shaped-l-radius rotate180 rotate-default";
var _T_LRD_R270 = "part t-shaped-l-radius rotate270 rotate-default";
var _T_RRD_R0 = "part t-shaped-r-radius rotate0 rotate-default";
var _T_RRD_R90 = "part t-shaped-r-radius rotate90 rotate-default";
var _T_RRD_R180 = "part t-shaped-r-radius rotate180 rotate-default";
var _T_RRD_R270 = "part t-shaped-r-radius rotate270 rotate-default";
var _D_R0 = "part dash-shaped rotate0 rotate-default";
var _D_R90 = "part dash-shaped rotate90 rotate-default";
var _D_R180 = "part dash-shaped rotate180 rotate-default";
var _D_R270 = "part dash-shaped rotate270 rotate-default";
var _C_R0 = "part cross-shaped rotate0 rotate-default";
var _C_RD_R0 = "part cross-shaped-radius rotate0 rotate-default";
var _C_3RD_R0 = "part cross-shaped-3-radius rotate0 rotate-default";
var _C_3RD_R90 = "part cross-shaped-3-radius rotate90 rotate-default";
var _C_3RD_R180 = "part cross-shaped-3-radius rotate180 rotate-default";
var _C_3RD_R270 = "part cross-shaped-3-radius rotate270 rotate-default";
var _C_1RD_R0 = "part cross-shaped-1-radius rotate0 rotate-default";
var _C_1RD_R90 = "part cross-shaped-1-radius rotate90 rotate-default";
var _C_1RD_R180 = "part cross-shaped-1-radius rotate180 rotate-default";
var _C_1RD_R270 = "part cross-shaped-1-radius rotate270 rotate-default";
var _C_2RD_R0 = "part cross-shaped-2-radius rotate0 rotate-default";
var _C_2RD_R90 = "part cross-shaped-2-radius rotate90 rotate-default";
var _C_2RD_R180 = "part cross-shaped-2-radius rotate180 rotate-default";
var _C_2RD_R270 = "part cross-shaped-2-radius rotate270 rotate-default";
var _C_DRD_R0 = "part cross-shaped-diagonal-radius rotate0 rotate-default";
var _C_DRD_R90 = "part cross-shaped-diagonal-radius rotate90 rotate-default";
var _BL = "part blank";

/*
 * Formation settings of all characters.
 */
var _formationTable = {
    "a": [_L_R90, _I_R90, _L_R180, _T_R270, _I_R90, _T_R90, _D_R0, _BL, _D_R0],
    "b": [_L_R90, _I_R90, _L_RD_R180, _T_R270, _I_R90, _T_RD_R90, _L_R0, _I_R90, _L_RD_R270],
    "c": [_L_RD_R90, _I_R90, _D_R270, _I_R0, _BL, _BL, _L_RD_R0, _I_R90, _D_R270],
    "d": [_L_R90, _I_R90, _L_RD_R180, _I_R0, _BL, _I_R0, _L_R0, _I_R90, _L_RD_R270],
    "e": [_L_R90, _I_R90, _D_R270, _T_R270, _I_R90, _BL, _L_R0, _I_R90, _D_R270],
    "f": [_L_R90, _I_R90, _D_R270, _T_R270, _I_R90, _BL, _D_R0, _BL, _BL],
    "g": [_L_R90, _I_R90, _D_R270, _I_R0, _BL, _L_RD_R180, _L_RD_R0, _I_R90, _L_R270],
    "h": [_D_R180, _BL, _D_R180, _T_R270, _I_R90, _T_R90, _D_R0, _BL, _D_R0],
    "i": [_BL, _D_R180, _BL, _BL, _I_R0, _BL, _BL, _D_R0, _BL],
    "j": [_BL, _BL, _D_R180, _BL, _BL, _I_R0, _L_RD_R0, _I_R90, _L_RD_R270],
    "k": [_D_R180, _L_RD_R90, _D_R270, _T_R270, _T_RD_R90, _BL, _D_R0, _L_RD_R0, _D_R270],
    "l": [_D_R180, _BL, _BL, _I_R0, _BL, _BL, _L_R0, _I_R90, _D_R270],
    "m": [_L_R90, _T_R0, _L_RD_R180, _I_R0, _D_R0, _I_R0, _D_R0, _BL, _D_R0],
    "n": [_L_R90, _I_R90, _L_RD_R180, _I_R0, _BL, _I_R0, _D_R0, _BL, _D_R0],
    "o": [_L_R90, _I_R90, _L_R180, _I_R0, _BL, _I_R0, _L_R0, _I_R90, _L_R270],
    "p": [_L_R90, _I_R90, _L_RD_R180, _T_R270, _I_R90, _L_RD_R270, _D_R0, _BL, _BL],
    "q": [_L_R90, _I_R90, _L_R180, _I_R0, _BL, _I_R0, _L_R0, _I_R90, _T_RRD_R90],
    "r": [_L_R90, _I_R90, _L_RD_R180, _T_R270, _I_R90, _T_RD_R90, _D_R0, _BL, _D_R0],
    "s": [_L_RD_R90, _I_R90, _D_R270, _L_RD_R0, _I_R90, _L_R180, _D_R90, _I_R90, _L_R270],
    "t": [_D_R90, _T_R0, _D_R270, _BL, _I_R0, _BL, _BL, _D_R0, _BL],
    "u": [_D_R180, _BL, _D_R180, _I_R0, _BL, _I_R0, _L_RD_R0, _I_R90, _L_RD_R270],
    "v": [_D_R180, _BL, _D_R180, _I_R0, _BL, _I_R0, _T_LRD_R270, _I_R90, _L_RD_R270],
    "w": [_D_R180, _BL, _D_R180, _I_R0, _I_R0, _I_R0, _T_LRD_R270, _C_DRD_R0, _L_RD_R270],
    "x": [_D_R90, _T_RD_R0, _D_R270, _BL, _I_R0, _BL, _D_R90, _T_RD_R180, _D_R270],
    "y": [_D_R180, _BL, _D_R180, _L_RD_R0, _T_R0, _L_R270, _BL, _D_R0, _BL],
    "z": [_D_R90, _I_R90, _L_R180, _L_RD_R90, _C_DRD_R90, _L_RD_R270, _L_R0, _I_R90, _D_R270],
    "1": [_BL, _BL, _BL, _BL, _T_LRD_R90, _BL, _BL, _D_R0, _BL],
    "2": [_D_R90, _I_R90, _L_RD_R180, _L_RD_R90, _I_R90, _L_RD_R270, _L_R0, _I_R90, _D_R270],
    "3": [_D_R90, _I_R90, _L_RD_R180, _BL, _I_R90, _T_RD_R90, _D_R90, _I_R90, _L_RD_R270],
    "4": [_D_R180, _BL, _D_R180, _L_RD_R0, _I_R90, _C_R0, _BL, _BL, _D_R0],
    "5": [_L_R90, _I_R90, _D_R270, _L_R0, _I_R90, _L_RD_R180, _L_RD_R0, _I_R90, _L_RD_R270],
    "6": [_L_RD_R90, _I_R90, _D_R270, _T_LRD_R270, _I_R90, _L_RD_R180, _L_RD_R0, _I_R90, _L_RD_R270],
    "7": [_L_RD_R90, _I_R90, _L_R180, _BL, _BL, _I_R0, _BL, _BL, _D_R0],
    "8": [_L_RD_R90, _I_R90, _L_RD_R180, _T_RD_R270, _I_R90, _T_RD_R90, _L_RD_R0, _I_R90, _L_RD_R270],
    "9": [_L_RD_R90, _I_R90, _L_RD_R180, _L_RD_R0, _I_R90, _T_RD_R90, _D_R90, _I_R90, _L_RD_R270],
    "0": [_L_RD_R90, _I_R90, _L_RD_R180, _I_R0, _BL, _I_R0, _L_RD_R0, _I_R90, _L_RD_R270],
    "+": [_BL, _D_R180, _BL, _D_R90, _C_R0, _D_R270, _BL, _D_R0, _BL],
    "-": [_BL, _BL, _BL, _D_R90, _I_R90, _D_R270, _BL, _BL, _BL],
    "*": [_BL, _BL, _BL, _BL, _C_RD_R0, _BL, _BL, _BL, _BL],
    "%": [_D_R180, _L_RD_R90, _BL, _BL, _I_R0, _BL, _BL, _L_RD_R270, _D_R0],
    ".": [_BL, _BL, _BL, _BL, _BL, _BL, _BL, _D_R0, _BL],
    ",": [_BL, _BL, _BL, _BL, _BL, _BL, _BL, _T_RD_R90, _BL],
    ":": [_BL, _D_R180, _BL, _BL, _BL, _BL, _BL, _D_R0, _BL],
    ";": [_BL, _D_R180, _BL, _BL, _BL, _BL, _BL, _T_RD_R90, _BL],
    "/": [_BL, _L_RD_R90, _BL, _BL, _I_R0, _BL, _BL, _L_RD_R270, _BL],
    "\\": [_BL, _L_RD_R180, _BL, _BL, _I_R0, _BL, _BL, _L_RD_R0, _BL],
    "{": [_BL, _L_RD_R90, _BL, _BL, _T_RD_R90, _BL, _BL, _L_RD_R0, _BL],
    "}": [_BL, _L_RD_R180, _BL, _BL, _T_RD_R270, _BL, _BL, _L_RD_R270, _BL],
    "[": [_BL, _L_R90, _BL, _BL, _I_R0, _BL, _BL, _L_R0, _BL],
    "]": [_BL, _L_R180, _BL, _BL, _I_R0, _BL, _BL, _L_R270, _BL],
    "#": [_BL, _BL, _BL, _C_R0, _C_R0, _BL, _C_R0, _C_R0, _BL],
    "(": [_BL, _L_RD_R90, _BL, _BL, _I_R0, _BL, _BL, _L_RD_R0, _BL],
    ")": [_BL, _L_RD_R180, _BL, _BL, _I_R0, _BL, _BL, _L_RD_R270, _BL],
    "!": [_BL, _D_R180, _BL, _BL, _I_R0, _BL, _BL, _D_R180, _BL],
    "?": [_L_RD_R90, _I_R90, _L_RD_R180, _BL, _L_RD_R90, _L_RD_R270, _BL, _D_R180, _BL],
    "'": [_BL, _L_RD_R270, _BL, _BL, _BL, _BL, _BL, _BL, _BL],
    '"': [_L_RD_R270, _L_RD_R270, _BL, _BL, _BL, _BL, _BL, _BL, _BL],
    "$": [_L_RD_R90, _C_2RD_R0, _L_RD_R180, _L_RD_R0, _C_RD_R0, _L_RD_R180, _L_RD_R0, _C_2RD_R180, _L_RD_R270],
    "&": [_BL, _L_RD_R90, _L_RD_R180, _L_RD_R90, _T_RD_R180, _T_RD_R90, _L_RD_R0, _I_R90, _C_R0],
    "=": [_BL, _BL, _BL, _D_R90, _I_R90, _D_R270, _D_R90, _I_R90, _D_R270],
    "_": [_BL, _BL, _BL, _BL, _BL, _BL, _D_R90, _I_R90, _D_R270],
    "^": [_L_R90, _T_RD_R180, _L_R180, _D_R0, _BL, _D_R0, _BL, _BL, _BL],
    "|": [_BL, _I_R0, _BL, _BL, _I_R0, _BL, _BL, _I_R0, _BL],
    "`": [_BL, _L_RD_R180, _BL, _BL, _BL, _BL, _BL, _BL, _BL],
    "~": [_L_RD_R90, _L_RD_R180, _D_R180, _D_R0, _L_RD_R0, _L_RD_R270, _BL, _BL, _BL],
    "<": [_L_RD_R90, _I_R90, _D_R270, _T_RD_R90, _BL, _BL, _L_RD_R0, _I_R90, _D_R270],
    ">": [_D_R90, _I_R90, _L_RD_R180, _BL, _BL, _T_RD_R270, _D_R90, _I_R90, _L_RD_R270],
    "@": [_L_RD_R90, _I_R90, _L_RD_R180, _L_RD_R90, _L_RD_R180, _I_R0, _L_RD_R0, _T_LRD_R180, _L_RD_R270],
    " ": [_BL, _BL, _BL, _BL, _BL, _BL, _BL, _BL, _BL]
};

/*
 * Transition settings.
 */
var _TRANSITION_PROPS = ['width', 'height', 'background-color', 'border-radius'];

Emblem.define('Lines', { _DEFAULT_OPTIONS: _DEFAULT_OPTIONS, _BASE_DOM: _BASE_DOM, _TRANSITION_PROPS: _TRANSITION_PROPS, _formationTable: _formationTable });

/*
 * advanced properties
 */

var WEIGHT_PROP = _Symbol();
var WEIGHT_LIMIT_PROP = _Symbol();

Object.defineProperty(Emblem.prototype, 'weight', {
    get: function get() {
        return this[WEIGHT_PROP];
    },
    set: function set(n) {
        if (n > this[WEIGHT_LIMIT_PROP] || n < 0) {
            return;
        }
        this.dom.classList.add('weight_' + n);
        this.dom.classList.remove('weight_' + this[WEIGHT_PROP]);
        this[WEIGHT_PROP] = n;
    }
});

Emblem.prototype.bolder = function () {
    this.weight = this[WEIGHT_PROP] + 1;
};

Emblem.prototype.lighter = function () {
    this.weight = this[WEIGHT_PROP] - 1;
};

Emblem.prototype[WEIGHT_PROP] = 3;

_Object$defineProperty(Emblem.prototype, WEIGHT_LIMIT_PROP, {
    value: 6
});

},{"babel-runtime/core-js/object/define-property":1,"babel-runtime/core-js/symbol":2}]},{},[34]);
