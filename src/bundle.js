(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   2.3.0
 */

(function() {
    "use strict";
    function lib$es6$promise$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$es6$promise$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$es6$promise$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$es6$promise$utils$$_isArray;
    if (!Array.isArray) {
      lib$es6$promise$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$es6$promise$utils$$_isArray = Array.isArray;
    }

    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
    var lib$es6$promise$asap$$len = 0;
    var lib$es6$promise$asap$$toString = {}.toString;
    var lib$es6$promise$asap$$vertxNext;
    var lib$es6$promise$asap$$customSchedulerFn;

    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
      lib$es6$promise$asap$$len += 2;
      if (lib$es6$promise$asap$$len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (lib$es6$promise$asap$$customSchedulerFn) {
          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
        } else {
          lib$es6$promise$asap$$scheduleFlush();
        }
      }
    }

    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
    }

    function lib$es6$promise$asap$$setAsap(asapFn) {
      lib$es6$promise$asap$$asap = asapFn;
    }

    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$es6$promise$asap$$useNextTick() {
      var nextTick = process.nextTick;
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // setImmediate should be used instead instead
      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
      if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
        nextTick = setImmediate;
      }
      return function() {
        nextTick(lib$es6$promise$asap$$flush);
      };
    }

    // vertx
    function lib$es6$promise$asap$$useVertxTimer() {
      return function() {
        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
      };
    }

    function lib$es6$promise$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$es6$promise$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$es6$promise$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$es6$promise$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$es6$promise$asap$$flush, 1);
      };
    }

    var lib$es6$promise$asap$$queue = new Array(1000);
    function lib$es6$promise$asap$$flush() {
      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
        var callback = lib$es6$promise$asap$$queue[i];
        var arg = lib$es6$promise$asap$$queue[i+1];

        callback(arg);

        lib$es6$promise$asap$$queue[i] = undefined;
        lib$es6$promise$asap$$queue[i+1] = undefined;
      }

      lib$es6$promise$asap$$len = 0;
    }

    function lib$es6$promise$asap$$attemptVertex() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$es6$promise$asap$$useVertxTimer();
      } catch(e) {
        return lib$es6$promise$asap$$useSetTimeout();
      }
    }

    var lib$es6$promise$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$es6$promise$asap$$isNode) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
    } else if (lib$es6$promise$asap$$isWorker) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
    } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertex();
    } else {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
    }

    function lib$es6$promise$$internal$$noop() {}

    var lib$es6$promise$$internal$$PENDING   = void 0;
    var lib$es6$promise$$internal$$FULFILLED = 1;
    var lib$es6$promise$$internal$$REJECTED  = 2;

    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$selfFullfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function lib$es6$promise$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$es6$promise$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
        return lib$es6$promise$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
       lib$es6$promise$asap$$asap(function(promise) {
        var sealed = false;
        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$es6$promise$$internal$$resolve(promise, value);
          } else {
            lib$es6$promise$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$es6$promise$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$es6$promise$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, thenable._result);
      } else {
        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = lib$es6$promise$$internal$$getThen(maybeThenable);

        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$es6$promise$utils$$isFunction(then)) {
          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$es6$promise$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFullfillment());
      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
        lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
      } else {
        lib$es6$promise$$internal$$fulfill(promise, value);
      }
    }

    function lib$es6$promise$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      lib$es6$promise$$internal$$publish(promise);
    }

    function lib$es6$promise$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$es6$promise$$internal$$FULFILLED;

      if (promise._subscribers.length !== 0) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
      }
    }

    function lib$es6$promise$$internal$$reject(promise, reason) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
      promise._state = lib$es6$promise$$internal$$REJECTED;
      promise._result = reason;

      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
    }

    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
      }
    }

    function lib$es6$promise$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$es6$promise$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$es6$promise$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$es6$promise$$internal$$reject(promise, error);
      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, value);
      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, value);
      }
    }

    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$es6$promise$$internal$$reject(promise, e);
      }
    }

    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
      var enumerator = this;

      enumerator._instanceConstructor = Constructor;
      enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (enumerator._validateInput(input)) {
        enumerator._input     = input;
        enumerator.length     = input.length;
        enumerator._remaining = input.length;

        enumerator._init();

        if (enumerator.length === 0) {
          lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
        } else {
          enumerator.length = enumerator.length || 0;
          enumerator._enumerate();
          if (enumerator._remaining === 0) {
            lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
          }
        }
      } else {
        lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
      }
    }

    lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return lib$es6$promise$utils$$isArray(input);
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;

    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
      var enumerator = this;

      var length  = enumerator.length;
      var promise = enumerator.promise;
      var input   = enumerator._input;

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        enumerator._eachEntry(input[i], i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var enumerator = this;
      var c = enumerator._instanceConstructor;

      if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING) {
          entry._onerror = null;
          enumerator._settledAt(entry._state, i, entry._result);
        } else {
          enumerator._willSettleAt(c.resolve(entry), i);
        }
      } else {
        enumerator._remaining--;
        enumerator._result[i] = entry;
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var enumerator = this;
      var promise = enumerator.promise;

      if (promise._state === lib$es6$promise$$internal$$PENDING) {
        enumerator._remaining--;

        if (state === lib$es6$promise$$internal$$REJECTED) {
          lib$es6$promise$$internal$$reject(promise, value);
        } else {
          enumerator._result[i] = value;
        }
      }

      if (enumerator._remaining === 0) {
        lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
      });
    };
    function lib$es6$promise$promise$all$$all(entries) {
      return new lib$es6$promise$enumerator$$default(this, entries).promise;
    }
    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
    function lib$es6$promise$promise$race$$race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (!lib$es6$promise$utils$$isArray(entries)) {
        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$es6$promise$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$es6$promise$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
    function lib$es6$promise$promise$resolve$$resolve(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
    function lib$es6$promise$promise$reject$$reject(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

    var lib$es6$promise$promise$$counter = 0;

    function lib$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise's eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function lib$es6$promise$promise$$Promise(resolver) {
      this._id = lib$es6$promise$promise$$counter++;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if (lib$es6$promise$$internal$$noop !== resolver) {
        if (!lib$es6$promise$utils$$isFunction(resolver)) {
          lib$es6$promise$promise$$needsResolver();
        }

        if (!(this instanceof lib$es6$promise$promise$$Promise)) {
          lib$es6$promise$promise$$needsNew();
        }

        lib$es6$promise$$internal$$initializePromise(this, resolver);
      }
    }

    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;

    lib$es6$promise$promise$$Promise.prototype = {
      constructor: lib$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection) {
        var parent = this;
        var state = parent._state;

        if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
          return this;
        }

        var child = new this.constructor(lib$es6$promise$$internal$$noop);
        var result = parent._result;

        if (state) {
          var callback = arguments[state - 1];
          lib$es6$promise$asap$$asap(function(){
            lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };
    function lib$es6$promise$polyfill$$polyfill() {
      var local;

      if (typeof global !== 'undefined') {
          local = global;
      } else if (typeof self !== 'undefined') {
          local = self;
      } else {
          try {
              local = Function('return this')();
          } catch (e) {
              throw new Error('polyfill failed because global object is unavailable in this environment');
          }
      }

      var P = local.Promise;

      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
        return;
      }

      local.Promise = lib$es6$promise$promise$$default;
    }
    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

    var lib$es6$promise$umd$$ES6Promise = {
      'Promise': lib$es6$promise$promise$$default,
      'polyfill': lib$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
    }

    lib$es6$promise$polyfill$$default();
}).call(this);


}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Olympic2020Js = require('./Olympic2020.js');

var _Olympic2020Js2 = _interopRequireDefault(_Olympic2020Js);

var EmblemGroup = (function () {
    function EmblemGroup(chars, opt) {
        _classCallCheck(this, EmblemGroup);

        if (typeof opt === 'object') {
            var length = opt.length;
            var size = opt.size;
            var displayTime = opt.displayTime;
        }
        this._isAnimating = false;
        this._resume = null;
        this._displayTime = displayTime || 1000;
        if (chars.length < length) {
            for (var i = chars.length; i < length; i++) {
                chars += ' ';
            }
        } else if (length != null && chars.length > length) {
            chars = chars.slice(0, length);
        }

        var emblems = _transfromToOlympic2020Array(chars, size);

        if (emblems) {
            this.emblems = emblems;
        } else {
            throw new Error('EmblemGroup arguments expect string or array of Olympic2020.');
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
            this._isAnimating = false;
        }
    }, {
        key: 'resumeAnimate',
        value: function resumeAnimate() {
            this._isAnimating = true;
            this._resume();
        }
    }, {
        key: 'animateFromString',
        value: function animateFromString(str, opt) {
            var _this = this;

            this._isAnimating = true;
            this._resume = null;
            _asignOption.call(this, opt);

            var strArr = undefined;
            if (Array.isArray(str) && str.every(function (c) {
                return typeof c === 'string';
            })) {
                strArr = str;
            } else {
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
            }

            _animateFromStringArray.call(this, strArr);
        }
    }, {
        key: 'animateFromStringArray',
        value: function animateFromStringArray(strArr, opt) {
            this._isAnimating = true;
            this._resume = null;
            _asignOption.call(this, opt);
            _animateFromStringArray.call(this, strArr);
        }

        /*
         * seter and geter of propertys
         */
    }, {
        key: 'displayTime',
        set: function set(time) {
            this._displayTime = time;
        },
        get: function get() {
            return this._displayTime;
        }
    }, {
        key: 'isAnimating',
        get: function get() {
            return this._isAnimating;
        }
    }]);

    return EmblemGroup;
})();

function _transfromToOlympic2020Array(arg, size) {
    // (string | [Olympic2020]) => [Olympic2020] | false

    var res = undefined;
    switch (typeof arg) {
        case 'string':
            res = [].map.call(arg, function (c) {
                return new _Olympic2020Js2['default'](c, size);
            });
            break;
        case 'object':
            if (Array.isArray(arg) && arg.every(function (o) {
                return o instanceof _Olympic2020Js2['default'];
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

function _asignOption(opt) {
    if (typeof opt === 'object') {
        var displayTime = opt.displayTime;
        var loop = opt.loop;
    }
    if (loop != null) {
        this._loop = loop;
    }
    if (typeof displayTime === 'number' && displayTime > 0) {
        this._displayTime = displayTime;
    } else {
        displayTime = this._displayTime;
    }
}

function _animateFromStringArray(strArr) {
    var _this2 = this;

    strArr.reduce(function (p, s, idx) {
        var isLast = idx === strArr.length - 1;
        return p.then(function () {
            return new Promise(function (resolve, reject) {
                if (!_this2._isAnimating) {
                    _this2._resume = resolve;
                    return;
                }
                _this2.map(s);
                if (isLast) {
                    if (_this2._loop) {
                        setTimeout(function () {
                            _animateFromStringArray.call(_this2, strArr);
                            resolve();
                        }, _this2._displayTime);
                        return;
                    } else {
                        setTimeout(reject, _this2._displayTime);
                        return;
                    }
                }
                setTimeout(resolve, _this2._displayTime);
            });
        });
    }, Promise.resolve())['catch'](function () {
        _this2._isAnimating = false;
    });
}

exports['default'] = EmblemGroup;
module.exports = exports['default'];

},{"./Olympic2020.js":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Olympic2020 = (function () {
    function Olympic2020(c, opt) {
        _classCallCheck(this, Olympic2020);

        if (typeof opt === 'object') {
            var size = opt.size;
            var displayTime = opt.displayTime;
            var duration = opt.duration;
            var easing = opt.easing;
            var roop = opt.roop;
            var random = opt.random;
        }
        this.char = null;
        this.dom = _createDom();
        this._displayTime = displayTime || 1000;
        this._duration = duration || 800;
        this._easing = easing || 'cubic-bezier(.26,.92,.41,.98)';
        this._isAnimating = false;
        this._resume = null;
        this._loop = roop || false;
        this._random = random || false;

        _updateTransitionConfig.call(this);
        if (typeof size === 'number' && size > 0) {
            this.size = size;
        } else {
            this.size = 100;
        }
        this.to(c);
    }

    _createClass(Olympic2020, [{
        key: 'to',
        value: function to(c) {
            var _c = c && c.toLowerCase && c.toLowerCase();
            if (FORMATION_TABLE[_c]) {
                _changeStyle.call(this, _c);
                this.char = _c;
                return true;
            }
            return false;
        }
    }, {
        key: 'appendTo',
        value: function appendTo(parent) {
            parent.appendChild(this.dom);
        }
    }, {
        key: 'stopAnimate',
        value: function stopAnimate() {
            this._isAnimating = false;
        }
    }, {
        key: 'resumeAnimate',
        value: function resumeAnimate() {
            this._isAnimating = true;
            this._resume();
        }
    }, {
        key: 'animateFromString',
        value: function animateFromString(str, opt) {
            var _this = this;

            if (typeof opt === 'object') {
                var displayTime = opt.displayTime;
                var loop = opt.loop;
                var random = opt.random;
            }
            this._isAnimating = true;
            this._resume = null;
            if (loop != null) {
                this._loop = loop;
            }
            if (random != null) {
                this._random = random;
            }
            if (typeof displayTime === 'number' && displayTime > 0) {
                this._displayTime = displayTime;
            } else {
                displayTime = this._displayTime;
            }

            [].reduce.call(str, function (p, c, idx) {
                var isLast = idx === str.length - 1;
                return p.then(function () {
                    return new Promise(function (resolve, reject) {
                        if (!_this._isAnimating) {
                            _this._resume = resolve;
                            return;
                        }
                        if (_this._random) {
                            var _c = str[Math.random() * str.length | 0];
                            _this.to(_c);
                        } else {
                            _this.to(c);
                        }
                        if (isLast) {
                            if (_this._loop) {
                                setTimeout(function () {
                                    _this.animateFromString.call(_this, str);
                                    resolve();
                                }, _this._displayTime);
                                return;
                            } else {
                                setTimeout(reject, _this._displayTime);
                                return;
                            }
                        }
                        setTimeout(resolve, _this._displayTime);
                    });
                });
            }, Promise.resolve())['catch'](function () {
                _this._isAnimating = false;
            });
        }

        /*
         * seter and geter of propertys
         */
    }, {
        key: 'size',
        set: function set(size) {
            var domStyle = this.dom.style;
            domStyle.width = size + 'px';
            domStyle.height = size + 'px';
        }
    }, {
        key: 'displayTime',
        set: function set(time) {
            this._displayTime = time;
        },
        get: function get() {
            return this._displayTime;
        }
    }, {
        key: 'duration',
        set: function set(time) {
            this._duration = time;
            _updateTransitionConfig.call(this);
        },
        get: function get() {
            return this._duration;
        }
    }, {
        key: 'easing',
        set: function set(val) {
            this._easing = val;
            _updateTransitionConfig.call(this);
        },
        get: function get() {
            return this._easing;
        }
    }, {
        key: 'isAnimating',
        get: function get() {
            return this._isAnimating;
        }
    }, {
        key: 'loop',
        set: function set(bool) {
            this._loop = bool;
        },
        get: function get() {
            return this._loop;
        }
    }, {
        key: 'random',
        set: function set(bool) {
            this._random = bool;
        },
        get: function get() {
            return this._random;
        }
    }], [{
        key: 'ALL_VALID_CHARS',
        get: function get() {
            return Object.keys(FORMATION_TABLE);
        }
    }]);

    return Olympic2020;
})();

function _createDom() {
    return baseDom.cloneNode(true);
}

function _changeStyle(c) {
    // @bind this
    var classTable = FORMATION_TABLE[c];
    [].forEach.call(this.dom.childNodes, function (node, idx) {
        var pos = undefined;
        // fix for '/'
        if (c === '/' && idx === 0) {
            pos = 'pos_3_0';
        } else {
            pos = 'pos_' + idx % 3 + '_' + (idx / 3 | 0);
        }
        node.className = classTable[idx] + ' ' + pos;
        if ([].some.call(node.classList, function (c) {
            return ROTATE_TABLE.indexOf(c) !== -1;
        })) {
            return;
        }
        node.classList.add(ROTATE_TABLE[Math.random() * 4 | 0]);
    });
}

function _updateTransitionConfig() {
    var _this2 = this;

    // @bind this
    var val = TRANSITION_PROPS.reduce(function (str, prop, idx) {
        return '' + str + (idx ? ',' : '') + ' ' + prop + ' ' + _this2._duration + 'ms ' + _this2._easing;
    }, '');

    _updateStyle(this.dom.childNodes);

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
 * original of emblem dom.
 */
var baseDom = (function () {
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

    // div.wrapper > div.part * 9 (emmet syntax)
    for (var i = 0; i < 9; i++) {
        var _part = part.cloneNode(true);
        _part.classList.add('pos_' + i % 3 + '_' + (i / 3 | 0));
        docFrag.appendChild(_part);
    }
    wrapper.appendChild(docFrag);

    return wrapper;
})();

var ROTATE_TABLE = ['rotate0', 'rotate90', 'rotate180', 'rotate270'];

/*
 * parts className table.
 */
var G_R0 = "part arc gold rotate0";
var G_R90 = "part arc gold rotate90";
var G_R180 = "part arc gold rotate180";
var G_R270 = "part arc gold rotate270";
var S_R0 = "part arc silver rotate0";
var S_R90 = "part arc silver rotate90";
var S_R180 = "part arc silver rotate180";
var S_R270 = "part arc silver rotate270";
var P1 = "part pole1 gray";
var P2_V = "part pole2_v gray";
var P2_H = "part pole2_h gray";
var P3_V = "part pole3_v gray";
var P3_H = "part pole3_h gray";
var C_S = "part circle_s red";
var C_L = "part circle_l red";
var BL = "part blank";

/*
 * formation settings of all characters.
 */
var FORMATION_TABLE = {
    "a": [G_R180, P1, G_R270, S_R0, C_S, S_R90, P1, BL, P1],
    "b": [BL, P3_V, G_R90, BL, BL, S_R90, BL, BL, S_R180],
    "c": [S_R180, P1, G_R90, P1, BL, BL, G_R90, P1, S_R180],
    "d": [P3_V, S_R90, G_R270, BL, BL, P1, BL, G_R180, S_R0],
    "e": [BL, P3_V, G_R90, BL, BL, C_S, BL, BL, S_R180],
    "f": [BL, P3_V, S_R90, BL, BL, C_S, BL, BL, BL],
    "g": [P3_V, G_R0, BL, BL, BL, S_R90, BL, C_S, G_R180],
    "h": [P3_V, BL, P3_V, BL, C_S, BL, BL, BL, BL],
    "i": [BL, C_S, BL, BL, P2_V, BL, BL, BL, BL],
    "j": [BL, BL, P2_V, BL, BL, BL, S_R90, C_S, G_R180],
    "k": [P3_V, BL, G_R0, BL, C_S, BL, BL, BL, S_R270],
    "l": [P3_V, BL, BL, BL, BL, BL, BL, C_S, G_R180],
    "m": [G_R270, BL, S_R180, P2_V, C_S, P2_V, BL, BL, BL],
    "n": [P3_V, G_R270, P3_V, BL, C_S, BL, BL, S_R90, BL],
    "o": [S_R180, P1, G_R270, P1, BL, P1, G_R90, P1, S_R0],
    "p": [P3_V, C_S, G_R90, BL, S_R270, BL, BL, BL, BL],
    "q": [S_R180, P1, G_R270, P1, BL, P1, G_R90, P1, C_S],
    "r": [P3_V, C_S, S_R90, BL, P1, S_R180, BL, BL, G_R270],
    "s": [G_R180, P3_V, S_R90, S_R90, BL, BL, G_R270, BL, C_S],
    "t": [G_R0, P3_V, C_S, BL, BL, BL, BL, BL, S_R180],
    "u": [P2_V, BL, C_S, P1, BL, P1, G_R90, P1, S_R0],
    "v": [S_R270, BL, S_R180, G_R90, BL, G_R0, BL, P1, BL],
    "w": [S_R270, BL, G_R180, S_R270, P1, G_R180, G_R90, BL, S_R0],
    "x": [G_R90, BL, S_R0, BL, P1, BL, S_R180, BL, G_R270],
    "y": [G_R270, BL, S_R180, BL, C_S, BL, BL, P1, BL],
    "z": [G_R0, P1, S_R0, BL, C_S, BL, S_R180, P1, S_R180],
    "1": [G_R180, P3_V, BL, BL, BL, BL, BL, BL, BL],
    "2": [S_R0, P3_V, G_R270, BL, BL, S_R0, C_S, BL, G_R180],
    "3": [G_R0, P1, G_R270, BL, C_S, BL, S_R270, P1, S_R0],
    "4": [BL, S_R180, BL, G_R180, C_S, P1, BL, P1, BL],
    "5": [BL, P1, S_R0, BL, G_R90, P1, BL, C_S, S_R180],
    "6": [BL, S_R0, BL, BL, P2_V, G_R90, BL, BL, S_R180],
    "7": [G_R0, C_S, P3_V, BL, BL, BL, BL, BL, BL],
    "8": [S_R0, C_S, S_R90, G_R0, BL, G_R90, S_R270, BL, S_R180],
    "9": [G_R0, P2_V, BL, S_R270, BL, BL, BL, G_R180, BL],
    "0": [C_L, BL, BL, BL, BL, BL, BL, BL, BL],
    "!": [P2_V, BL, BL, BL, BL, BL, C_S, BL, BL],
    ".": [BL, BL, BL, BL, BL, BL, P1, BL, BL],
    "'": [P1, BL, BL, G_R0, BL, BL, BL, BL, BL],
    ":": [P1, BL, BL, BL, BL, BL, P1, BL, BL],
    ";": [P1, BL, BL, BL, BL, BL, C_S, BL, BL],
    "/": [G_R0, BL, S_R180, BL, S_R180, G_R0, S_R180, G_R0, BL],
    "_": [BL, BL, BL, BL, BL, BL, P2_H, BL, BL],
    " ": [BL, BL, BL, BL, BL, BL, BL, BL, BL]
};

/*
 * transition settings.
 */
var TRANSITION_PROPS = ['top', 'left', 'background-color', 'border-radius'];

exports['default'] = Olympic2020;
module.exports = exports['default'];

},{}],5:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Olympic2020Js = require('./Olympic2020.js');

var _Olympic2020Js2 = _interopRequireDefault(_Olympic2020Js);

var _EmblemGroupJs = require('./EmblemGroup.js');

var _EmblemGroupJs2 = _interopRequireDefault(_EmblemGroupJs);

require('es6-promise').polyfill();

window.Olympic2020 = _Olympic2020Js2['default'];
window.EmblemGroup = _EmblemGroupJs2['default'];

},{"./EmblemGroup.js":3,"./Olympic2020.js":4,"es6-promise":2}]},{},[5])
//# sourceMappingURL=bundle.js.map
