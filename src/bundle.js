(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/array/from"), __esModule: true };
},{"core-js/library/fn/array/from":9}],2:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":10}],3:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":11}],4:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/promise"), __esModule: true };
},{"core-js/library/fn/promise":12}],5:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":13}],6:[function(require,module,exports){
"use strict";

exports["default"] = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

exports.__esModule = true;
},{}],7:[function(require,module,exports){
"use strict";

var _Object$defineProperty = require("babel-runtime/core-js/object/define-property")["default"];

exports["default"] = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;

      _Object$defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

exports.__esModule = true;
},{"babel-runtime/core-js/object/define-property":2}],8:[function(require,module,exports){
"use strict";

exports["default"] = function (obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
};

exports.__esModule = true;
},{}],9:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/$.core').Array.from;
},{"../../modules/$.core":18,"../../modules/es6.array.from":66,"../../modules/es6.string.iterator":71}],10:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function defineProperty(it, key, desc){
  return $.setDesc(it, key, desc);
};
},{"../../modules/$":41}],11:[function(require,module,exports){
require('../../modules/es6.object.keys');
module.exports = require('../../modules/$.core').Object.keys;
},{"../../modules/$.core":18,"../../modules/es6.object.keys":68}],12:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.promise');
module.exports = require('../modules/$.core').Promise;
},{"../modules/$.core":18,"../modules/es6.object.to-string":69,"../modules/es6.promise":70,"../modules/es6.string.iterator":71,"../modules/web.dom.iterable":73}],13:[function(require,module,exports){
require('../../modules/es6.symbol');
module.exports = require('../../modules/$.core').Symbol;
},{"../../modules/$.core":18,"../../modules/es6.symbol":72}],14:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],15:[function(require,module,exports){
var isObject = require('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":34}],16:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./$.cof')
  , TAG = require('./$.wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./$.cof":17,"./$.wks":64}],17:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],18:[function(require,module,exports){
var core = module.exports = {};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],19:[function(require,module,exports){
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
  } return function(/* ...args */){
      return fn.apply(that, arguments);
    };
};
},{"./$.a-function":14}],20:[function(require,module,exports){
var global    = require('./$.global')
  , core      = require('./$.core')
  , PROTOTYPE = 'prototype';
var ctx = function(fn, that){
  return function(){
    return fn.apply(that, arguments);
  };
};
var $def = function(type, name, source){
  var key, own, out, exp
    , isGlobal = type & $def.G
    , isProto  = type & $def.P
    , target   = isGlobal ? global : type & $def.S
        ? global[name] : (global[name] || {})[PROTOTYPE]
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // contains in native
    own = !(type & $def.F) && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    if(isGlobal && typeof target[key] != 'function')exp = source[key];
    // bind timers to global for call from export context
    else if(type & $def.B && own)exp = ctx(out, global);
    // wrap global constructors for prevent change them in library
    else if(type & $def.W && target[key] == out)!function(C){
      exp = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      exp[PROTOTYPE] = C[PROTOTYPE];
    }(out);
    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export
    exports[key] = exp;
    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
// type bitmap
$def.F = 1;  // forced
$def.G = 2;  // global
$def.S = 4;  // static
$def.P = 8;  // proto
$def.B = 16; // bind
$def.W = 32; // wrap
module.exports = $def;
},{"./$.core":18,"./$.global":27}],21:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],22:[function(require,module,exports){
var isObject = require('./$.is-object')
  , document = require('./$.global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./$.global":27,"./$.is-object":34}],23:[function(require,module,exports){
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
},{"./$":41}],24:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],25:[function(require,module,exports){
var ctx         = require('./$.ctx')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , anObject    = require('./$.an-object')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
module.exports = function(iterable, entries, fn, that){
  var iterFn = getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};
},{"./$.an-object":15,"./$.ctx":19,"./$.is-array-iter":33,"./$.iter-call":35,"./$.to-length":60,"./core.get-iterator-method":65}],26:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toString  = {}.toString
  , toIObject = require('./$.to-iobject')
  , getNames  = require('./$').getNames;

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
},{"./$":41,"./$.to-iobject":59}],27:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var UNDEFINED = 'undefined';
var global = module.exports = typeof window != UNDEFINED && window.Math == Math
  ? window : typeof self != UNDEFINED && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],28:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],29:[function(require,module,exports){
var $          = require('./$')
  , createDesc = require('./$.property-desc');
module.exports = require('./$.support-desc') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":41,"./$.property-desc":47,"./$.support-desc":55}],30:[function(require,module,exports){
module.exports = require('./$.global').document && document.documentElement;
},{"./$.global":27}],31:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],32:[function(require,module,exports){
// indexed object, fallback for non-array-like ES3 strings
var cof = require('./$.cof');
module.exports = 0 in Object('z') ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":17}],33:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./$.iterators')
  , ITERATOR  = require('./$.wks')('iterator');
module.exports = function(it){
  return (Iterators.Array || Array.prototype[ITERATOR]) === it;
};
},{"./$.iterators":40,"./$.wks":64}],34:[function(require,module,exports){
// http://jsperf.com/core-js-isobject
module.exports = function(it){
  return it !== null && (typeof it == 'object' || typeof it == 'function');
};
},{}],35:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./$.an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./$.an-object":15}],36:[function(require,module,exports){
'use strict';
var $ = require('./$')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./$.hide')(IteratorPrototype, require('./$.wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: require('./$.property-desc')(1,next)});
  require('./$.tag')(Constructor, NAME + ' Iterator');
};
},{"./$":41,"./$.hide":29,"./$.property-desc":47,"./$.tag":56,"./$.wks":64}],37:[function(require,module,exports){
'use strict';
var LIBRARY         = require('./$.library')
  , $def            = require('./$.def')
  , $redef          = require('./$.redef')
  , hide            = require('./$.hide')
  , has             = require('./$.has')
  , SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , Iterators       = require('./$.iterators')
  , BUGGY           = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR     = '@@iterator'
  , KEYS            = 'keys'
  , VALUES          = 'values';
var returnThis = function(){ return this; };
module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
  require('./$.iter-create')(Constructor, NAME, next);
  var createMethod = function(kind){
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG      = NAME + ' Iterator'
    , proto    = Base.prototype
    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , _default = _native || createMethod(DEFAULT)
    , methods, key;
  // Fix native
  if(_native){
    var IteratorPrototype = require('./$').getProto(_default.call(new Base));
    // Set @@toStringTag to native iterators
    require('./$.tag')(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, SYMBOL_ITERATOR, returnThis);
  }
  // Define iterator
  if(!LIBRARY || FORCE)hide(proto, SYMBOL_ITERATOR, _default);
  // Plug for library
  Iterators[NAME] = _default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      keys:    IS_SET            ? _default : createMethod(KEYS),
      values:  DEFAULT == VALUES ? _default : createMethod(VALUES),
      entries: DEFAULT != VALUES ? _default : createMethod('entries')
    };
    if(FORCE)for(key in methods){
      if(!(key in proto))$redef(proto, key, methods[key]);
    } else $def($def.P + $def.F * BUGGY, NAME, methods);
  }
};
},{"./$":41,"./$.def":20,"./$.has":28,"./$.hide":29,"./$.iter-create":36,"./$.iterators":40,"./$.library":43,"./$.redef":48,"./$.tag":56,"./$.wks":64}],38:[function(require,module,exports){
var SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , SAFE_CLOSING    = false;
try {
  var riter = [7][SYMBOL_ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }
module.exports = function(exec){
  if(!SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[SYMBOL_ITERATOR]();
    iter.next = function(){ safe = true; };
    arr[SYMBOL_ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./$.wks":64}],39:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],40:[function(require,module,exports){
module.exports = {};
},{}],41:[function(require,module,exports){
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
},{}],42:[function(require,module,exports){
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
},{"./$":41,"./$.to-iobject":59}],43:[function(require,module,exports){
module.exports = true;
},{}],44:[function(require,module,exports){
var global    = require('./$.global')
  , macrotask = require('./$.task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , isNode    = require('./$.cof')(process) == 'process'
  , head, last, notify;

var flush = function(){
  var parent, domain;
  if(isNode && (parent = process.domain)){
    process.domain = null;
    parent.exit();
  }
  while(head){
    domain = head.domain;
    if(domain)domain.enter();
    head.fn.call(); // <- currently we use it only for Promise - try / catch not required
    if(domain)domain.exit();
    head = head.next;
  } last = undefined;
  if(parent)parent.enter();
}

// Node.js
if(isNode){
  notify = function(){
    process.nextTick(flush);
  };
// browsers with MutationObserver
} else if(Observer){
  var toggle = 1
    , node   = document.createTextNode('');
  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
  notify = function(){
    node.data = toggle = -toggle;
  };
// for other environments - macrotask based on:
// - setImmediate
// - MessageChannel
// - window.postMessag
// - onreadystatechange
// - setTimeout
} else {
  notify = function(){
    // strange IE + webpack dev server bug - use .call(global)
    macrotask.call(global, flush);
  };
}

module.exports = function asap(fn){
  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
  if(last)last.next = task;
  if(!head){
    head = task;
    notify();
  } last = task;
};
},{"./$.cof":17,"./$.global":27,"./$.task":57}],45:[function(require,module,exports){
var $redef = require('./$.redef');
module.exports = function(target, src){
  for(var key in src)$redef(target, key, src[key]);
  return target;
};
},{"./$.redef":48}],46:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
module.exports = function(KEY, exec){
  var $def = require('./$.def')
    , fn   = (require('./$.core').Object || {})[KEY] || Object[KEY]
    , exp  = {};
  exp[KEY] = exec(fn);
  $def($def.S + $def.F * require('./$.fails')(function(){ fn(1); }), 'Object', exp);
};
},{"./$.core":18,"./$.def":20,"./$.fails":24}],47:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],48:[function(require,module,exports){
module.exports = require('./$.hide');
},{"./$.hide":29}],49:[function(require,module,exports){
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],50:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = require('./$').getDesc
  , isObject = require('./$.is-object')
  , anObject = require('./$.an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} // eslint-disable-line
    ? function(buggy, set){
        try {
          set = require('./$.ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
          set({}, []);
        } catch(e){ buggy = true; }
        return function setPrototypeOf(O, proto){
          check(O, proto);
          if(buggy)O.__proto__ = proto;
          else set(O, proto);
          return O;
        };
      }()
    : undefined),
  check: check
};
},{"./$":41,"./$.an-object":15,"./$.ctx":19,"./$.is-object":34}],51:[function(require,module,exports){
var global = require('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":27}],52:[function(require,module,exports){
'use strict';
var $       = require('./$')
  , SPECIES = require('./$.wks')('species');
module.exports = function(C){
  if(require('./$.support-desc') && !(SPECIES in C))$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./$":41,"./$.support-desc":55,"./$.wks":64}],53:[function(require,module,exports){
module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
},{}],54:[function(require,module,exports){
// true  -> String#at
// false -> String#codePointAt
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l
      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./$.defined":21,"./$.to-integer":58}],55:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":24}],56:[function(require,module,exports){
var has  = require('./$.has')
  , hide = require('./$.hide')
  , TAG  = require('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))hide(it, TAG, tag);
};
},{"./$.has":28,"./$.hide":29,"./$.wks":64}],57:[function(require,module,exports){
'use strict';
var ctx                = require('./$.ctx')
  , invoke             = require('./$.invoke')
  , html               = require('./$.html')
  , cel                = require('./$.dom-create')
  , global             = require('./$.global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listner = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require('./$.cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScript){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listner, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./$.cof":17,"./$.ctx":19,"./$.dom-create":22,"./$.global":27,"./$.html":30,"./$.invoke":31}],58:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],59:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./$.iobject')
  , defined = require('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":21,"./$.iobject":32}],60:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./$.to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./$.to-integer":58}],61:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./$.defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./$.defined":21}],62:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],63:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],64:[function(require,module,exports){
var store  = require('./$.shared')('wks')
  , Symbol = require('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || require('./$.uid'))('Symbol.' + name));
};
},{"./$.global":27,"./$.shared":51,"./$.uid":62}],65:[function(require,module,exports){
var classof   = require('./$.classof')
  , ITERATOR  = require('./$.wks')('iterator')
  , Iterators = require('./$.iterators');
module.exports = require('./$.core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
};
},{"./$.classof":16,"./$.core":18,"./$.iterators":40,"./$.wks":64}],66:[function(require,module,exports){
'use strict';
var ctx         = require('./$.ctx')
  , $def        = require('./$.def')
  , toObject    = require('./$.to-object')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
$def($def.S + $def.F * !require('./$.iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , mapfn   = arguments[1]
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, arguments[2], 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
      }
    } else {
      for(result = new C(length = toLength(O.length)); length > index; index++){
        result[index] = mapping ? mapfn(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});
},{"./$.ctx":19,"./$.def":20,"./$.is-array-iter":33,"./$.iter-call":35,"./$.iter-detect":38,"./$.to-length":60,"./$.to-object":61,"./core.get-iterator-method":65}],67:[function(require,module,exports){
'use strict';
var setUnscope = require('./$.unscope')
  , step       = require('./$.iter-step')
  , Iterators  = require('./$.iterators')
  , toIObject  = require('./$.to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
require('./$.iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

setUnscope('keys');
setUnscope('values');
setUnscope('entries');
},{"./$.iter-define":37,"./$.iter-step":39,"./$.iterators":40,"./$.to-iobject":59,"./$.unscope":63}],68:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./$.to-object');

require('./$.object-sap')('keys', function($keys){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./$.object-sap":46,"./$.to-object":61}],69:[function(require,module,exports){

},{}],70:[function(require,module,exports){
'use strict';
var $          = require('./$')
  , LIBRARY    = require('./$.library')
  , global     = require('./$.global')
  , ctx        = require('./$.ctx')
  , classof    = require('./$.classof')
  , $def       = require('./$.def')
  , isObject   = require('./$.is-object')
  , anObject   = require('./$.an-object')
  , aFunction  = require('./$.a-function')
  , strictNew  = require('./$.strict-new')
  , forOf      = require('./$.for-of')
  , setProto   = require('./$.set-proto').set
  , same       = require('./$.same')
  , species    = require('./$.species')
  , SPECIES    = require('./$.wks')('species')
  , RECORD     = require('./$.uid')('record')
  , asap       = require('./$.microtask')
  , PROMISE    = 'Promise'
  , process    = global.process
  , isNode     = classof(process) == 'process'
  , P          = global[PROMISE]
  , Wrapper;

var testResolve = function(sub){
  var test = new P(function(){});
  if(sub)test.constructor = Object;
  return P.resolve(test) === test;
};

var useNative = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = P && P.resolve && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && require('./$.support-desc')){
      var thenableThenGotten = false;
      P.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
var isPromise = function(it){
  return isObject(it) && (useNative ? classof(it) == 'Promise' : RECORD in it);
};
var sameConstructor = function(a, b){
  // library wrapper special case
  if(LIBRARY && a === P && b === Wrapper)return true;
  return same(a, b);
};
var getConstructor = function(C){
  var S = anObject(C)[SPECIES];
  return S != undefined ? S : C;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function(record, isReject){
  if(record.n)return;
  record.n = true;
  var chain = record.c;
  asap(function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    var run = function(react){
      var cb = ok ? react.ok : react.fail
        , ret, then;
      try {
        if(cb){
          if(!ok)record.h = true;
          ret = cb === true ? value : cb(value);
          if(ret === react.P){
            react.rej(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(ret)){
            then.call(ret, react.res, react.rej);
          } else react.res(ret);
        } else react.rej(value);
      } catch(err){
        react.rej(err);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    chain.length = 0;
    record.n = false;
    if(isReject)setTimeout(function(){
      if(isUnhandled(record.p)){
        if(isNode){
          process.emit('unhandledRejection', value, record.p);
        } else if(global.console && console.error){
          console.error('Unhandled promise rejection', value);
        }
      } record.a = undefined;
    }, 1);
  });
};
var isUnhandled = function(promise){
  var record = promise[RECORD]
    , chain  = record.a || record.c
    , i      = 0
    , react;
  if(record.h)return false;
  while(chain.length > i){
    react = chain[i++];
    if(react.fail || !isUnhandled(react.P))return false;
  } return true;
};
var $reject = function(value){
  var record = this;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  notify(record, true);
};
var $resolve = function(value){
  var record = this
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(then = isThenable(value)){
      asap(function(){
        var wrapper = {r: record, d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      record.v = value;
      record.s = 1;
      notify(record, false);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
  }
};

// constructor polyfill
if(!useNative){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    aFunction(executor);
    var record = {
      p: strictNew(this, P, PROMISE),         // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false,                               // <- handled rejection
      n: false                                // <- notify
    };
    this[RECORD] = record;
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  require('./$.mix')(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var S = anObject(anObject(this).constructor)[SPECIES];
      var react = {
        ok:   typeof onFulfilled == 'function' ? onFulfilled : true,
        fail: typeof onRejected == 'function'  ? onRejected  : false
      };
      var promise = react.P = new (S != undefined ? S : P)(function(res, rej){
        react.res = aFunction(res);
        react.rej = aFunction(rej);
      });
      var record = this[RECORD];
      record.c.push(react);
      if(record.a)record.a.push(react);
      if(record.s)notify(record, false);
      return promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}

// export
$def($def.G + $def.W + $def.F * !useNative, {Promise: P});
require('./$.tag')(P, PROMISE);
species(P);
species(Wrapper = require('./$.core')[PROMISE]);

// statics
$def($def.S + $def.F * !useNative, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    return new this(function(res, rej){ rej(r); });
  }
});
$def($def.S + $def.F * (!useNative || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    return isPromise(x) && sameConstructor(x.constructor, this)
      ? x : new this(function(res){ res(x); });
  }
});
$def($def.S + $def.F * !(useNative && require('./$.iter-detect')(function(iter){
  P.all(iter)['catch'](function(){});
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C      = getConstructor(this)
      , values = [];
    return new C(function(res, rej){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        C.resolve(promise).then(function(value){
          results[index] = value;
          --remaining || res(results);
        }, rej);
      });
      else res(results);
    });
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C = getConstructor(this);
    return new C(function(res, rej){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(res, rej);
      });
    });
  }
});
},{"./$":41,"./$.a-function":14,"./$.an-object":15,"./$.classof":16,"./$.core":18,"./$.ctx":19,"./$.def":20,"./$.for-of":25,"./$.global":27,"./$.is-object":34,"./$.iter-detect":38,"./$.library":43,"./$.microtask":44,"./$.mix":45,"./$.same":49,"./$.set-proto":50,"./$.species":52,"./$.strict-new":53,"./$.support-desc":55,"./$.tag":56,"./$.uid":62,"./$.wks":64}],71:[function(require,module,exports){
'use strict';
var $at  = require('./$.string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./$.iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./$.iter-define":37,"./$.string-at":54}],72:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $              = require('./$')
  , global         = require('./$.global')
  , has            = require('./$.has')
  , SUPPORT_DESC   = require('./$.support-desc')
  , $def           = require('./$.def')
  , $redef         = require('./$.redef')
  , shared         = require('./$.shared')
  , setTag         = require('./$.tag')
  , uid            = require('./$.uid')
  , wks            = require('./$.wks')
  , keyOf          = require('./$.keyof')
  , $names         = require('./$.get-names')
  , enumKeys       = require('./$.enum-keys')
  , isObject       = require('./$.is-object')
  , anObject       = require('./$.an-object')
  , toIObject      = require('./$.to-iobject')
  , createDesc     = require('./$.property-desc')
  , getDesc        = $.getDesc
  , setDesc        = $.setDesc
  , _create        = $.create
  , getNames       = $names.get
  , $Symbol        = global.Symbol
  , setter         = false
  , HIDDEN         = wks('_hidden')
  , isEnum         = $.isEnum
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , useNative      = typeof $Symbol == 'function'
  , ObjectProto    = Object.prototype;

var setSymbolDesc = SUPPORT_DESC ? function(){ // fallback for old Android
  try {
    return _create(setDesc({}, HIDDEN, {
      get: function(){
        return setDesc(this, HIDDEN, {value: false})[HIDDEN];
      }
    }))[HIDDEN] || setDesc;
  } catch(e){
    return function(it, key, D){
      var protoDesc = getDesc(ObjectProto, key);
      if(protoDesc)delete ObjectProto[key];
      setDesc(it, key, D);
      if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
    };
  }
}() : setDesc;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol.prototype);
  sym._k = tag;
  SUPPORT_DESC && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    }
  });
  return sym;
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

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments[0]));
  };
  $redef($Symbol.prototype, 'toString', function toString(){
    return this._k;
  });

  $.create     = $create;
  $.isEnum     = $propertyIsEnumerable;
  $.getDesc    = $getOwnPropertyDescriptor;
  $.setDesc    = $defineProperty;
  $.setDescs   = $defineProperties;
  $.getNames   = $names.get = $getOwnPropertyNames;
  $.getSymbols = $getOwnPropertySymbols;

  if(SUPPORT_DESC && !require('./$.library')){
    $redef(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }
}

// MS Edge converts symbol values to JSON as {}
// WebKit converts symbol values in objects to JSON as null
if(!useNative || require('./$.fails')(function(){
  return JSON.stringify([{a: $Symbol()}, [$Symbol()]]) != '[{},[null]]';
}))$redef($Symbol.prototype, 'toJSON', function toJSON(){
  if(useNative && isObject(this))return this;
});

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
  }
);

setter = true;

$def($def.G + $def.W, {Symbol: $Symbol});

$def($def.S, 'Symbol', symbolStatics);

$def($def.S + $def.F * !useNative, 'Object', {
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

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setTag(global.JSON, 'JSON', true);
},{"./$":41,"./$.an-object":15,"./$.def":20,"./$.enum-keys":23,"./$.fails":24,"./$.get-names":26,"./$.global":27,"./$.has":28,"./$.is-object":34,"./$.keyof":42,"./$.library":43,"./$.property-desc":47,"./$.redef":48,"./$.shared":51,"./$.support-desc":55,"./$.tag":56,"./$.to-iobject":59,"./$.uid":62,"./$.wks":64}],73:[function(require,module,exports){
require('./es6.array.iterator');
var Iterators = require('./$.iterators');
Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
},{"./$.iterators":40,"./es6.array.iterator":67}],74:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Symbol = require('babel-runtime/core-js/symbol')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});
var _CHAR_PROP = _Symbol();
var _DOM_PROP = _Symbol();
var _DISPLAY_TIME_PROP = _Symbol();
var _DURATION_PROP = _Symbol();
var _EASING_PROP = _Symbol();
var _IS_ANIMATING_PROP = _Symbol();
var _RESUME_PROP = _Symbol();
var _LOOP_PROP = _Symbol();
var _RANDOM_PROP = _Symbol();
var _PEDAL_PROP = _Symbol();
var _CANSELLER_PROP = _Symbol();

var Emblem = (function () {
    function Emblem(c) {
        var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var size = _ref.size;
        var displayTime = _ref.displayTime;
        var _ref$duration = _ref.duration;
        var duration = _ref$duration === undefined ? 1000 : _ref$duration;
        var easing = _ref.easing;
        var _ref$loop = _ref.loop;
        var loop = _ref$loop === undefined ? false : _ref$loop;
        var _ref$random = _ref.random;
        var random = _ref$random === undefined ? false : _ref$random;
        var _ref$pedal = _ref.pedal;
        var pedal = _ref$pedal === undefined ? true : _ref$pedal;

        _classCallCheck(this, Emblem);

        this[_IS_ANIMATING_PROP] = false;
        this[_RESUME_PROP] = null;
        this[_CHAR_PROP] = null;
        this[_DOM_PROP] = _createDom();
        this[_CANSELLER_PROP] = function () {};

        // --- options ---
        this.displayTime = displayTime | 0 || 1500;
        this.duration = duration;
        this.loop = loop;
        this.random = random;
        this.easing = easing || 'cubic-bezier(.26,.92,.41,.98)';
        this.pedal = pedal;

        if (typeof size === 'number' && size >= 0) {
            this.size = size;
        } else {
            this.size = 100;
        }

        this.to(c);
    }

    _createClass(Emblem, [{
        key: 'to',
        value: function to(c) {
            var _c = c && c.toLowerCase && c.toLowerCase();
            if (!_formationTable[_c]) {
                return false;
            }
            if (this[_CHAR_PROP] === _c) {
                return false;
            }
            _changeStyle.call(this, _c);
            this[_CHAR_PROP] = _c;
            return true;
        }
    }, {
        key: 'appendTo',
        value: function appendTo(parent) {
            parent.appendChild(this[_DOM_PROP]);
        }
    }, {
        key: 'stopAnimate',
        value: function stopAnimate() {
            this[_IS_ANIMATING_PROP] = false;
        }
    }, {
        key: 'resumeAnimate',
        value: function resumeAnimate() {
            this[_IS_ANIMATING_PROP] = true;
            this[_RESUME_PROP]();
        }
    }, {
        key: 'animateFromString',
        value: function animateFromString(str, opt) {
            var _this = this;

            this[_IS_ANIMATING_PROP] = true;
            this[_RESUME_PROP] = null;
            this.options = opt;

            [].reduce.call(str, function (p, c, idx) {
                // p = Promise.resolve(); c = str[idx];
                var isLast = idx === str.length - 1;
                return p.then(function () {
                    return new _Promise(function (resolve, reject) {
                        _this[_CANSELLER_PROP] = reject;
                        if (_this[_RANDOM_PROP]) {
                            var _c = str[Math.random() * str.length | 0];
                            _this.to(_c);
                        } else {
                            _this.to(c);
                        }
                        if (isLast) {
                            if (_this[_LOOP_PROP]) {
                                setTimeout(function () {
                                    _this.animateFromString.call(_this, str);
                                    resolve();
                                }, _this[_DISPLAY_TIME_PROP]);
                                return;
                            } else {
                                setTimeout(reject, _this[_DISPLAY_TIME_PROP]);
                                return;
                            }
                        }
                        if (!_this[_IS_ANIMATING_PROP]) {
                            _this[_RESUME_PROP] = resolve;
                        } else {
                            setTimeout(resolve, _this[_DISPLAY_TIME_PROP]);
                        }
                    });
                });
            }, _Promise.resolve())['catch'](function () {
                _this[_IS_ANIMATING_PROP] = false;
            });
        }

        /**
         * Setter and Getter
         */

        // --- options ---
    }, {
        key: 'options',
        set: function set() {
            var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var size = _ref2.size;
            var displayTime = _ref2.displayTime;
            var duration = _ref2.duration;
            var loop = _ref2.loop;
            var random = _ref2.random;
            var pedal = _ref2.pedal;
            var easing = _ref2.easing;

            this.size = size;
            this.displayTime = displayTime;
            this.duration = duration;
            this.easing = easing;
            this.loop = loop;
            this.random = random;
            this.pedal = pedal;
        },
        get: function get() {
            return {
                size: this.size,
                displayTime: this.displayTime,
                duration: this.duration,
                easing: this.easing,
                loop: this.loop,
                random: this.random,
                pedal: this.pedal
            };
        }

        // --- size ---
    }, {
        key: 'size',
        set: function set(size) {
            if (size == null) {
                return;
            }
            if (typeof size === 'number' && size >= 0) {
                var domStyle = this[_DOM_PROP].style;
                domStyle.width = size + 'px';
                domStyle.height = size + 'px';
            } else {
                console.error('Emblem.size should be type of zero or positive number.');
            }
        },
        get: function get() {
            return +this[_DOM_PROP].style.width.replace('px', '');
        }

        // --- displayTime ---
    }, {
        key: 'displayTime',
        set: function set(time) {
            if (time == null) {
                return;
            }
            if (typeof time === 'number' && time > 0) {
                this[_DISPLAY_TIME_PROP] = time;
            } else {
                console.error('Emblem.displayTime should be type of positive number.');
            }
        },
        get: function get() {
            return this[_DISPLAY_TIME_PROP];
        }

        // --- duration ---
    }, {
        key: 'duration',
        set: function set(time) {
            if (time == null) {
                return;
            }
            if (typeof time === 'number' && time >= 0) {
                this[_DURATION_PROP] = time;
                _updateTransitionConfig.call(this);
            } else {
                console.error('Emblem.duration should be type of zero or positive number.');
            }
        },
        get: function get() {
            return this[_DURATION_PROP];
        }

        // --- easing ---
    }, {
        key: 'easing',
        set: function set(val) {
            if (val == null) {
                return;
            }
            this[_EASING_PROP] = val;
            _updateTransitionConfig.call(this);
        },
        get: function get() {
            return this[_EASING_PROP];
        }

        // --- loop ---
    }, {
        key: 'loop',
        set: function set(bool) {
            if (bool == null) {
                return;
            }
            this[_LOOP_PROP] = bool;
        },
        get: function get() {
            return this[_LOOP_PROP];
        }

        // --- random ---
    }, {
        key: 'random',
        set: function set(bool) {
            if (bool == null) {
                return;
            }
            this[_RANDOM_PROP] = bool;
        },
        get: function get() {
            return this[_RANDOM_PROP];
        }

        // --- pedal ---
    }, {
        key: 'pedal',
        set: function set(bool) {
            if (bool == null) {
                return;
            }
            this[_PEDAL_PROP] = bool;
        },
        get: function get() {
            return this[_PEDAL_PROP];
        }

        // --- dom ---
    }, {
        key: 'dom',
        get: function get() {
            return this[_DOM_PROP];
        }

        // --- char ---
    }, {
        key: 'char',
        get: function get() {
            return this[_CHAR_PROP];
        }

        // --- isAnimating ---
    }, {
        key: 'isAnimating',
        get: function get() {
            return this[_IS_ANIMATING_PROP];
        }

        // --- allValidChars ---
    }], [{
        key: 'allValidChars',
        get: function get() {
            return _Object$keys(_formationTable);
        }
    }]);

    return Emblem;
})();

function _createDom() {
    return _BASE_DOM.cloneNode(true);
}

function _changeStyle(c) {
    // @bind this
    var oldC = this[_CHAR_PROP];
    var oldFormation = _formationTable[oldC];
    var newFormation = _formationTable[c];
    if (!newFormation) {
        return;
    }
    var diffFormation = undefined;
    if (oldC) {
        diffFormation = newFormation.map(function (newStr, idx) {
            var oldStr = oldFormation[idx];
            return newStr !== oldStr ? newStr : false;
        });
    } else {
        diffFormation = newFormation;
    }
    [].forEach.call(this[_DOM_PROP].childNodes, function (node, idx) {
        if (!diffFormation[idx]) {
            return;
        }
        var pos = undefined;
        // fix for '/'
        if (c === '/' && idx === 0) {
            pos = 'pos_3_0';
        } else {
            pos = 'pos_' + idx % 3 + '_' + (idx / 3 | 0);
        }
        node.className = diffFormation[idx] + ' ' + pos;
        if (node.classList.contains('arc')) {
            return;
        }
        node.classList.add(_ROTATE_TABLE[Math.random() * 4 | 0]);
    });
}

function _updateTransitionConfig() {
    var _this2 = this;

    // @bind this
    var val = _TRANSITION_PROPS.reduce(function (str, prop, idx) {
        return '' + str + (idx ? ',' : '') + ' ' + prop + ' ' + _this2[_DURATION_PROP] + 'ms ' + _this2[_EASING_PROP];
    }, '');

    _updateStyle(this[_DOM_PROP].childNodes);

    function _updateStyle(list) {
        [].forEach.call(list, function (node) {
            node.style.transition = val;
            if (node.firstChild) {
                _updateStyle(node.childNodes);
            }
        });
    }
}

/*
 * DOM in instance of Emblem.
 */
var _BASE_DOM = (function () {
    var wrapper = document.createElement('div');
    var part = document.createElement('div');
    var whiteCircleW = document.createElement('div');
    var whiteCircle = document.createElement('div');
    var docFrag = document.createDocumentFragment();

    wrapper.className = 'olympic-emblem';
    part.className = 'part';
    whiteCircleW.className = 'white_circle_wrapper';
    whiteCircle.className = 'white_circle';

    whiteCircleW.appendChild(whiteCircle);
    part.appendChild(whiteCircleW);

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

var _ROTATE_TABLE = ['rotate0', 'rotate90', 'rotate180', 'rotate270'];

/*
 * Parts className table.
 */
var _G_R0 = "part arc gold rotate0";
var _G_R90 = "part arc gold rotate90";
var _G_R180 = "part arc gold rotate180";
var _G_R270 = "part arc gold rotate270";
var _S_R0 = "part arc silver rotate0";
var _S_R90 = "part arc silver rotate90";
var _S_R180 = "part arc silver rotate180";
var _S_R270 = "part arc silver rotate270";
var _P1 = "part pole1 gray";
var _P2_V = "part pole2_v gray";
var _P2_H = "part pole2_h gray";
var _P3_V = "part pole3_v gray";
var _P3_H = "part pole3_h gray";
var _C_S = "part circle_s red";
var _C_L = "part circle_l red";
var _BL = "part blank";

/*
 * Formation settings of all characters.
 */
var _formationTable = {
    "a": [_G_R180, _P1, _G_R270, _S_R0, _C_S, _S_R90, _P1, _BL, _P1],
    "b": [_BL, _P3_V, _G_R90, _BL, _BL, _S_R90, _BL, _BL, _S_R180],
    "c": [_S_R180, _P1, _G_R90, _P1, _BL, _BL, _G_R90, _P1, _S_R180],
    "d": [_P3_V, _S_R90, _G_R270, _BL, _BL, _P1, _BL, _G_R180, _S_R0],
    "e": [_BL, _P3_V, _G_R90, _BL, _BL, _C_S, _BL, _BL, _S_R180],
    "f": [_BL, _P3_V, _S_R90, _BL, _BL, _C_S, _BL, _BL, _BL],
    "g": [_P3_V, _G_R0, _BL, _BL, _BL, _S_R90, _BL, _C_S, _G_R180],
    "h": [_P3_V, _BL, _P3_V, _BL, _C_S, _BL, _BL, _BL, _BL],
    "i": [_BL, _C_S, _BL, _BL, _P2_V, _BL, _BL, _BL, _BL],
    "j": [_BL, _BL, _P2_V, _BL, _BL, _BL, _S_R90, _C_S, _G_R180],
    "k": [_P3_V, _BL, _G_R0, _BL, _C_S, _BL, _BL, _BL, _S_R270],
    "l": [_P3_V, _BL, _BL, _BL, _BL, _BL, _BL, _C_S, _G_R180],
    "m": [_G_R270, _BL, _S_R180, _P2_V, _C_S, _P2_V, _BL, _BL, _BL],
    "n": [_P3_V, _G_R270, _P3_V, _BL, _C_S, _BL, _BL, _S_R90, _BL],
    "o": [_S_R180, _P1, _G_R270, _P1, _BL, _P1, _G_R90, _P1, _S_R0],
    "p": [_P3_V, _C_S, _G_R90, _BL, _S_R270, _BL, _BL, _BL, _BL],
    "q": [_S_R180, _P1, _G_R270, _P1, _BL, _P1, _G_R90, _P1, _C_S],
    "r": [_P3_V, _C_S, _S_R90, _BL, _P1, _S_R180, _BL, _BL, _G_R270],
    "s": [_G_R180, _P3_V, _S_R90, _S_R90, _BL, _BL, _G_R270, _BL, _C_S],
    "t": [_G_R0, _P3_V, _C_S, _BL, _BL, _BL, _BL, _BL, _S_R180],
    "u": [_P2_V, _BL, _C_S, _P1, _BL, _P1, _G_R90, _P1, _S_R0],
    "v": [_S_R270, _BL, _S_R180, _G_R90, _BL, _G_R0, _BL, _P1, _BL],
    "w": [_S_R270, _BL, _G_R180, _S_R270, _P1, _G_R180, _G_R90, _BL, _S_R0],
    "x": [_G_R90, _BL, _S_R0, _BL, _P1, _BL, _S_R180, _BL, _G_R270],
    "y": [_G_R270, _BL, _S_R180, _BL, _C_S, _BL, _BL, _P1, _BL],
    "z": [_G_R0, _P1, _S_R0, _BL, _C_S, _BL, _S_R180, _P1, _S_R180],
    "1": [_G_R180, _P3_V, _BL, _BL, _BL, _BL, _BL, _BL, _BL],
    "2": [_S_R0, _P3_V, _G_R270, _BL, _BL, _S_R0, _C_S, _BL, _G_R180],
    "3": [_G_R0, _P1, _G_R270, _BL, _C_S, _BL, _S_R270, _P1, _S_R0],
    "4": [_BL, _S_R180, _BL, _G_R180, _C_S, _P1, _BL, _P1, _BL],
    "5": [_BL, _P1, _S_R0, _BL, _G_R90, _P1, _BL, _C_S, _S_R180],
    "6": [_BL, _S_R0, _BL, _BL, _P2_V, _G_R90, _BL, _BL, _S_R180],
    "7": [_G_R0, _C_S, _P3_V, _BL, _BL, _BL, _BL, _BL, _BL],
    "8": [_S_R0, _C_S, _S_R90, _G_R0, _BL, _G_R90, _S_R270, _BL, _S_R180],
    "9": [_G_R0, _P2_V, _BL, _S_R270, _BL, _BL, _BL, _G_R180, _BL],
    "0": [_C_L, _BL, _BL, _BL, _BL, _BL, _BL, _BL, _BL],
    "!": [_P2_V, _BL, _BL, _BL, _BL, _BL, _C_S, _BL, _BL],
    ".": [_BL, _BL, _BL, _BL, _BL, _BL, _P1, _BL, _BL],
    "'": [_P1, _BL, _BL, _G_R0, _BL, _BL, _BL, _BL, _BL],
    ":": [_P1, _BL, _BL, _BL, _BL, _BL, _P1, _BL, _BL],
    ";": [_P1, _BL, _BL, _BL, _BL, _BL, _C_S, _BL, _BL],
    "/": [_G_R0, _BL, _S_R180, _BL, _S_R180, _G_R0, _S_R180, _G_R0, _BL],
    "_": [_BL, _BL, _BL, _BL, _BL, _BL, _P2_H, _BL, _BL],
    " ": [_BL, _BL, _BL, _BL, _BL, _BL, _BL, _BL, _BL]
};

/*
 * Transition settings.
 */
var _TRANSITION_PROPS = ['top', 'left', 'background-color', 'border-radius'];

exports['default'] = Emblem;
module.exports = exports['default'];

},{"babel-runtime/core-js/object/keys":3,"babel-runtime/core-js/promise":4,"babel-runtime/core-js/symbol":5,"babel-runtime/helpers/class-call-check":6,"babel-runtime/helpers/create-class":7}],75:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Symbol = require('babel-runtime/core-js/symbol')['default'];

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _EmblemJs = require('./Emblem.js');

var _EmblemJs2 = _interopRequireDefault(_EmblemJs);

var _EMBLEMS_PROP = _Symbol();
var _DISPLAY_TIME_PROP = _Symbol();
var _IS_ANIMATING_PROP = _Symbol();
var _RESUME_PROP = _Symbol();
var _LOOP_PROP = _Symbol();
var _RANDOM_PROP = _Symbol();
var _CANSELLER_PROP = _Symbol();

var EmblemGroup = (function () {
    function EmblemGroup(chars) {
        var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var length = _ref.length;
        var displayTime = _ref.displayTime;
        var _ref$loop = _ref.loop;
        var loop = _ref$loop === undefined ? false : _ref$loop;
        var _ref$random = _ref.random;
        var random = _ref$random === undefined ? false : _ref$random;
        var size = _ref.size;
        var duration = _ref.duration;
        var easing = _ref.easing;
        var _ref$pedal = _ref.pedal;
        var pedal = _ref$pedal === undefined ? true : _ref$pedal;

        _classCallCheck(this, EmblemGroup);

        this[_IS_ANIMATING_PROP] = false;
        this[_RESUME_PROP] = null;
        this[_CANSELLER_PROP] = function () {};

        // --- options ---
        this.displayTime = displayTime | 0 || 1500;
        this.loop = loop;
        this.random = random;

        if (typeof chars === 'string') {
            if (typeof length !== 'number' || chars.length < length) {
                for (var i = chars.length; i < length; i++) {
                    chars += ' ';
                }
            } else if (length != null && chars.length > length) {
                chars = chars.slice(0, length);
            }
        } else {
            console.error('EmblemGroup constructor first argument should be string.');
        }

        var emblems = _transfromToEmblemArray(chars, { size: size, duration: duration, easing: easing, pedal: pedal });

        if (emblems) {
            this[_EMBLEMS_PROP] = emblems;
        } else {
            throw new Error('EmblemGroup arguments expect string or array of Emblem.');
        }
    }

    _createClass(EmblemGroup, [{
        key: 'toString',
        value: function toString() {
            return this.emblems.map(function (e) {
                return e.char;
            }).join('');
        }
    }, {
        key: 'map',
        value: function map(str) {
            this.emblems.forEach(function (emblem, idx) {
                var c = str[idx];
                if (!c) {
                    c = ' ';
                }
                emblem.to(c);
            });
        }
    }, {
        key: 'appendTo',
        value: function appendTo(parent) {
            var frag = this.emblems.reduce(function (f, e) {
                f.appendChild(e.dom);
                return f;
            }, document.createDocumentFragment());
            parent.appendChild(frag);
        }
    }, {
        key: 'stopAnimate',
        value: function stopAnimate() {
            this[_IS_ANIMATING_PROP] = false;
        }
    }, {
        key: 'resumeAnimate',
        value: function resumeAnimate() {
            this[_IS_ANIMATING_PROP] = true;
            this[_RESUME_PROP]();
        }
    }, {
        key: 'animateFromString',
        value: function animateFromString(str, opt) {
            var _this = this;

            var strArr = undefined;
            if (typeof str === 'string') {
                (function () {
                    var len = _this.emblems.length;
                    strArr = [].reduce.call(str, function (arr, s, idx) {
                        if (idx % len === 0) {
                            arr.push('');
                        }
                        arr[idx / len | 0] += s;
                        return arr;
                    }, []);
                })();
            } else if (Array.isArray(str) && str.every(function (s) {
                return typeof s === 'string';
            })) {
                strArr = str;
            } else {
                console.error('EmblemGroup#animateFromString first argument should be string or array of string.');
            }

            _animateFromStringArray.call(this, strArr, opt);
        }
    }, {
        key: 'animateFromStringArray',
        value: function animateFromStringArray(strArr, opt) {
            _animateFromStringArray.call(this, strArr, opt);
        }

        /*
         * Setter and Getter
         */

        // --- options ---
    }, {
        key: 'options',
        set: function set() {
            var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var length = _ref2.length;
            var displayTime = _ref2.displayTime;
            var loop = _ref2.loop;
            var random = _ref2.random;
            var size = _ref2.size;
            var duration = _ref2.duration;
            var easing = _ref2.easing;
            var pedal = _ref2.pedal;

            this.length = length;
            this.displayTime = displayTime;
            this.loop = loop;
            this.random = random;

            // change emblems options
            this.size = size;
            this.duration = duration;
            this.easing = easing;
            this.pedal = pedal;
        },
        get: function get() {
            return {
                length: this.length,
                displayTime: this.displayTime,
                loop: this.loop,
                random: this.random,

                // emblems options
                size: this.size,
                duration: this.duration,
                easing: this.easing,
                pedal: this.pedal
            };
        }

        // --- length ---
    }, {
        key: 'length',
        set: function set(lenNew) {
            if (lenNew == null) {
                return;
            }
            var emblems = this[_EMBLEMS_PROP];
            var lenOld = emblems.length;

            if (lenNew > lenOld) {
                var blankArr = _Array$from({ length: lenNew - lenOld }, function () {
                    return new _EmblemJs2['default'](' ');
                });
                this[_EMBLEMS_PROP] = emblems.concat(blankArr);
            } else if (lenNew < lenOld) {
                this[_EMBLEMS_PROP] = emblems.slice(0, lenNew);
            }
        },
        get: function get() {
            return this[_EMBLEMS_PROP].length;
        }

        // --- displayTime ---
    }, {
        key: 'displayTime',
        set: function set(time) {
            if (time == null) {
                return;
            }
            if (typeof time === 'number' && time > 0) {
                this[_DISPLAY_TIME_PROP] = time;
            } else {
                console.error('EmblemGroup.displayTime should be type of positive number.');
            }
        },
        get: function get() {
            return this[_DISPLAY_TIME_PROP];
        }

        // --- loop ---
    }, {
        key: 'loop',
        set: function set(bool) {
            if (bool == null) {
                return;
            }
            this[_LOOP_PROP] = bool;
        },
        get: function get() {
            return this[_LOOP_PROP];
        }

        // --- random ---
    }, {
        key: 'random',
        set: function set(bool) {
            if (bool == null) {
                return;
            }
            this[_RANDOM_PROP] = bool;
        },
        get: function get() {
            return this[_RANDOM_PROP];
        }

        // --- size ---
    }, {
        key: 'size',
        set: function set(size) {
            this[_EMBLEMS_PROP].forEach(function (emb) {
                return emb.size = size;
            });
        },
        get: function get() {
            return this[_EMBLEMS_PROP].map(function (emb) {
                return emb.size;
            });
        }

        // --- duration ---
    }, {
        key: 'duration',
        set: function set(time) {
            this[_EMBLEMS_PROP].forEach(function (emb) {
                return emb.duration = time;
            });
        },
        get: function get() {
            return this[_EMBLEMS_PROP].map(function (emb) {
                return emb.duration;
            });
        }

        // --- easing ---
    }, {
        key: 'easing',
        set: function set(val) {
            this[_EMBLEMS_PROP].forEach(function (emb) {
                return emb.easing = val;
            });
        },
        get: function get() {
            return this[_EMBLEMS_PROP].map(function (emb) {
                return emb.easing;
            });
        }

        // --- pedal ---
    }, {
        key: 'pedal',
        set: function set(val) {
            this[_EMBLEMS_PROP].forEach(function (emb) {
                return emb.pedal = val;
            });
        },
        get: function get() {
            return this[_EMBLEMS_PROP].map(function (emb) {
                return emb.pedal;
            });
        }

        // --- emblems ---
    }, {
        key: 'emblems',
        get: function get() {
            return this[_EMBLEMS_PROP];
        }

        // --- isAnimating ---
    }, {
        key: 'isAnimating',
        get: function get() {
            return this[_IS_ANIMATING_PROP];
        }
    }]);

    return EmblemGroup;
})();

function _transfromToEmblemArray(arg, opt) {
    // (string | [Emblem]) => [Emblem] | false

    var res = undefined;
    switch (typeof arg) {
        case 'string':
            res = [].map.call(arg, function (c) {
                return new _EmblemJs2['default'](c, opt);
            });
            break;
        case 'object':
            if (Array.isArray(arg) && arg.every(function (o) {
                return o instanceof _EmblemJs2['default'];
            })) {
                res = arg;
            } else {
                res = false;
            };
            break;
        default:
            res = false;
    }

    return res;
}

function _animateFromStringArray(strArr, opt) {
    var _this2 = this;

    this[_CANSELLER_PROP](); // cansel before animation.

    this[_IS_ANIMATING_PROP] = true;
    this[_RESUME_PROP] = null;
    this.options = opt;

    strArr.reduce(function (p, s, idx) {
        var isLast = idx === strArr.length - 1;
        return p.then(function () {
            return new _Promise(function (resolve, reject) {
                _this2[_CANSELLER_PROP] = reject;
                if (_this2[_RANDOM_PROP]) {
                    var _s = strArr[Math.random() * strArr.length | 0];
                    _this2.map(_s);
                } else {
                    _this2.map(s);
                }
                if (isLast) {
                    if (_this2.loop) {
                        setTimeout(function () {
                            _animateFromStringArray.call(_this2, strArr);
                            resolve();
                        }, _this2.displayTime);
                        return;
                    } else {
                        _this2[_IS_ANIMATING_PROP] = false;
                        return;
                    }
                }
                if (!_this2[_IS_ANIMATING_PROP]) {
                    _this2[_RESUME_PROP] = resolve;
                } else {
                    setTimeout(resolve, _this2.displayTime);
                }
            });
        });
    }, _Promise.resolve())['catch'](function () {
        console.log('cansel before animation.');
    });
}

exports['default'] = EmblemGroup;
module.exports = exports['default'];

},{"./Emblem.js":74,"babel-runtime/core-js/array/from":1,"babel-runtime/core-js/promise":4,"babel-runtime/core-js/symbol":5,"babel-runtime/helpers/class-call-check":6,"babel-runtime/helpers/create-class":7,"babel-runtime/helpers/interop-require-default":8}],76:[function(require,module,exports){
'use strict';

// require('es6-promise').polyfill();
// require('babelify/polyfill');

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _EmblemJs = require('./Emblem.js');

var _EmblemJs2 = _interopRequireDefault(_EmblemJs);

var _EmblemGroupJs = require('./EmblemGroup.js');

var _EmblemGroupJs2 = _interopRequireDefault(_EmblemGroupJs);

window.Emblem = _EmblemJs2['default'];
window.EmblemGroup = _EmblemGroupJs2['default'];

},{"./Emblem.js":74,"./EmblemGroup.js":75,"babel-runtime/helpers/interop-require-default":8}]},{},[76])
//# sourceMappingURL=bundle.js.map
