(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.ti || (g.ti = {})).dropbox = f()}})(function(){var define,module,exports;return (function e(t,n,r){function o(i,u){if(!n[i]){if(!t[i]){var a=typeof require=="function"&&require;if(!u&&a)return a.length===2?a(i,!0):a(i);if(s&&s.length===2)return s(i,!0);if(s)return s(i);var f=new Error("Cannot find module '"+i+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[i]={exports:{}};t[i][0].call(l.exports,function(e){var n=t[i][1][e];return o(n?n:e)},l,l.exports,e,t,n,r)}return n[i].exports}var i=Array.prototype.slice;Function.prototype.bind||Object.defineProperty(Function.prototype,"bind",{enumerable:!1,configurable:!0,writable:!0,value:function(e){function r(){return t.apply(this instanceof r&&e?this:e,n.concat(i.call(arguments)))}if(typeof this!="function")throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var t=this,n=i.call(arguments,1);return r.prototype=Object.create(t.prototype),r.prototype.contructor=r,r}});var s=typeof require=="function"&&require;for(var u=0;u<r.length;u++)o(r[u]);return o})({1:[function(require,module,exports){

module.exports = (function () { return this; })();

module.exports.location = {};

},{}],2:[function(require,module,exports){
(function (setTimeout){
/* global Ti:true, Titanium:true */

var process = module.exports = {};

process.nextTick = function nextTick(fn) {
  setTimeout(fn, 0);
};

process.title = 'titanium';
process.titanium = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.stdout = {};
process.stderr = {};

process.stdout.write = function (msg) {
  Ti.API.info(msg);
};

process.stderr.write = function (msg) {
  Ti.API.error(msg);
};

'addEventListener removeEventListener removeListener hasEventListener fireEvent emit on off'.split(' ').forEach(function (name) {
  process[ name ] = noop;
});

function noop() {}

}).call(this,require("--timers--").setTimeout)
},{"--timers--":3}],3:[function(require,module,exports){
(function (global){

module.exports.clearInterval = clearInterval;
module.exports.clearTimeout = clearTimeout;
module.exports.setInterval = setInterval;
module.exports.setTimeout = setTimeout;

// See https://html.spec.whatwg.org/multipage/webappapis.html#dom-windowtimers-cleartimeout

function clearInterval(intervalId) {
  try {
    return global.clearInterval(intervalId);
  }
  catch (e) {
    // Do nothing
    return undefined;
  }
}

function clearTimeout(timeoutId) {
  try {
    return global.clearTimeout(timeoutId);
  }
  catch (e) {
    // Do nothing
    return undefined;
  }
}

function setInterval(func, delay) {
  var args = [];
  for (var i = 2, l = arguments.length; i < l; ++i) {
    args[ i - 2 ] = arguments[ i ];
  }

  return global.setInterval(function () {
    func.apply(this, args);
  }, +delay);
}

function setTimeout(func, delay) {
  var args = [];
  for (var i = 2, l = arguments.length; i < l; ++i) {
    args[ i - 2 ] = arguments[ i ];
  }

  return global.setTimeout(function () {
    func.apply(this, args);
  }, +delay);
}

}).call(this,require("--global--"))
},{"--global--":1}],4:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && !isFinite(value)) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b)) {
    return a === b;
  }
  var aIsArgs = isArguments(a),
      bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  var ka = objectKeys(a),
      kb = objectKeys(b),
      key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":7}],5:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],6:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],7:[function(require,module,exports){
(function (process,global,console){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require("--process--"),require("--global--"),require("--console--"))
},{"--console--":9,"--global--":1,"--process--":2,"./support/isBuffer":6,"inherits":5}],8:[function(require,module,exports){
module.exports = now

function now() {
    return new Date().getTime()
}

},{}],9:[function(require,module,exports){
var util = require("util");
var now = require("date-now");

var _console = {};
var times = {};

var functions = [
	['log','info'],
	['info','info'],
	['warn','warn'],
	['error','error']
];

functions.forEach(function(tuple) {
	_console[tuple[0]] = function() {
		Ti.API[tuple[1]](util.format.apply(util, arguments));
	};
});

_console.time = function(label) {
	times[label] = now();
};

_console.timeEnd = function(label) {
	var time = times[label];
	if (!time) {
		throw new Error("No such label: " + label);
	}

	var duration = now() - time;
	_console.log(label + ": " + duration + "ms");
};

_console.trace = function() {
	var err = new Error();
	err.name = "Trace";
	err.message = util.format.apply(null, arguments);
	_console.error(err.stack);
};

_console.dir = function(object) {
	_console.log(util.inspect(object) + "\n");
};

_console.assert = function(expression) {
	if (!expression) {
		var arr = Array.prototype.slice.call(arguments, 1);
		require("assert").ok(false, util.format.apply(null, arr));
	}
};

module.exports = _console;

},{"assert":4,"date-now":8,"util":12}],10:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],11:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],12:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"--console--":9,"--global--":1,"--process--":2,"./support/isBuffer":11,"dup":7,"inherits":10}],13:[function(require,module,exports){
/**
 * this code was inspired by the work done by Adam Płócieniak
 * available at https://github.com/adasq/dropbox-v2-api/blob/master/dist/api.json
 **/

exports.dropboxAPIv2 = {
    "oauth2/authorize": {
        "uri": "https://www.dropbox.com/oauth2/authorize",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "GET",
        "parameters": [{
            "name": "response_type",
            "type": "String",
            "desc": "The grant type requested, either token or code."
        }, {
            "name": "client_id",
            "type": "String",
            "desc": "The app's key, found in the App Console (https://www.dropbox.com/developers/apps)"
        }, {
            "name": "redirect_uri",
            "type": "String",
            "desc": "Where to redirect the user after authorization has completed. This must be the exact URI registered in the App Console; even 'localhost' must be listed if it is used for testing. All redirect URIs must be HTTPS except for localhost URIs. A redirect URI is required for the token flow, but optional for the code flow. If the redirect URI is omitted, the code will be presented directly to the user and they will be invited to enter the information in your app"
        }, {
            "name": "state",
            "type": "String",
            "desc": "Up to 500 bytes of arbitrary data that will be passed back to your redirect URI. This parameter should be used to protect against cross-site request forgery (CSRF). See Sections 4.4.1.8 and 4.4.2.5 of the OAuth 2.0 threat model spec."
        }, {
            "name": "require_role",
            "type": "String",
            "desc": "If this parameter is specified, the user will be asked to authorize with a particular type of Dropbox account, either work for a team account or personal for a personal account. Your app should still verify the type of Dropbox account after authorization since the user could modify or remove the require_role parameter"
        }, {
            "name": "force_reapprove",
            "type": "Boolean",
            "desc": "Whether or not to force the user to approve the app again if they've already done so. If false (default), a user who has already approved the application may be automatically redirected to the URI specified by redirect_uri. If true, the user will not be automatically redirected and will have to approve the app again."
        }, {
            "name": "disable_signup",
            "type": "Boolean",
            "desc": "When true (default is false) users will not be able to sign up for a Dropbox account via the authorization page. Instead, the authorization page will show a link to the Dropbox iOS app in the App Store. This is only intended for use when necessary for compliance with App Store policies."
        }],
        "returnParameters": []
    },
    "auth/token/revoke": {
        "uri": "https://api.dropboxapi.com/2/auth/token/revoke",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "parameters": [],
        "returnParameters": []
    },
    "files/alpha/get_metadata": {
        "uri": "https://api.dropboxapi.com/2/files/alpha/get_metadata",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/Homework/math",
            "include_media_info": false,
            "include_deleted": false,
            "include_has_explicit_shared_members": false
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*|id:.*)|(rev:[0-9a-f]{9,})|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path of a file or folder on Dropbox."
        }, {
            "name": "include_media_info",
            "type": "Boolean",
            "desc": "If true, FileMetadata.media_info is set for photo and video. The default for this field is False."
        }, {
            "name": "include_deleted",
            "type": "Boolean",
            "desc": "If true,   will be returned for deleted file or folder, otherwise LookupError.not_found will be returned. The default for this field is False."
        }, {
            "name": "include_has_explicit_shared_members",
            "type": "Boolean",
            "desc": "If true, the results will include a flag for each file indicating whether or not  that file has any explicit members. The default for this field is False."
        }, {
            "name": "include_property_templates",
            "type": "List of (String(min_length=1, pattern=\"(/|ptid:).*\"), )?",
            "desc": "If true, FileMetadata.property_groups is set for files with custom properties. This field is optional."
        }],
        "returnParameters": []
    },
    "files/alpha/upload": {
        "uri": "https://content.dropboxapi.com/2/files/alpha/upload",
        "requiresAuthHeader": true,
        "requiresReadableStream": true,
        "endpointType": "CONTENT",
        "testParams": {
            "path": "/Homework/math/Matrices.txt",
            "mode": "add",
            "autorename": true,
            "mute": false,
            "property_groups": [{
                "template_id": "ptid:1a5n2i6d3OYEAAAAAAAAAYa",
                "fields": [{
                    "name": "Security Policy",
                    "value": "Confidential"
                }]
            }]
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
            "desc": "Path in the user's Dropbox to save the file."
        }, {
            "name": "mode",
            "type": "WriteMode",
            "desc": "Selects what to do if the file already exists. The default for this union is add.",
            "parameters": [{
                "name": "add",
                "type": "Void",
                "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
            }, {
                "name": "overwrite",
                "type": "Void",
                "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
            }, {
                "name": "update",
                "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
            }]
        }, {
            "name": "add",
            "type": "Void",
            "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
        }, {
            "name": "overwrite",
            "type": "Void",
            "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
        }, {
            "name": "update",
            "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
            "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
        }, {
            "name": "autorename",
            "type": "Boolean",
            "desc": "If there's a conflict, as determined by mode, have the Dropbox server try to autorename the file to avoid conflict. The default for this field is False."
        }, {
            "name": "client_modified",
            "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
            "desc": "The value to store as the client_modified timestamp. Dropbox automatically records the time at which the file was written to the Dropbox servers. It can also record an additional timestamp, provided by Dropbox desktop clients, mobile clients, and API apps of when the file was actually created or modified. This field is optional."
        }, {
            "name": "mute",
            "type": "Boolean",
            "desc": "Normally, users are made aware of any file modifications in their Dropbox account via notifications in the client software. If true, this tells the clients that this modification shouldn't result in a user notification. The default for this field is False."
        }, {
            "name": "property_groups",
            "type": "List of (PropertyGroup, )?",
            "desc": "List of custom properties to add to file. This field is optional.",
            "parameters": [{
                "name": "template_id",
                "type": "String(min_length=1, pattern=\"(/|ptid:).*\")",
                "desc": "A unique identifier for a property template type."
            }, {
                "name": "fields",
                "type": "List of (PropertyField, )",
                "desc": "This is a list of custom properties associated with a file. There can be up to 32 properties for a template.",
                "parameters": [{
                    "name": "name",
                    "type": "String",
                    "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
                }, {
                    "name": "value",
                    "type": "String",
                    "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
                }]
            }, {
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }, {
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }]
        }, {
            "name": "template_id",
            "type": "String(min_length=1, pattern=\"(/|ptid:).*\")",
            "desc": "A unique identifier for a property template type."
        }, {
            "name": "fields",
            "type": "List of (PropertyField, )",
            "desc": "This is a list of custom properties associated with a file. There can be up to 32 properties for a template.",
            "parameters": [{
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }]
        }, {
            "name": "name",
            "type": "String",
            "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
        }, {
            "name": "value",
            "type": "String",
            "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
        }],
        "returnParameters": []
    },
    "files/copy": {
        "uri": "https://api.dropboxapi.com/2/files/copy_v2",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "from_path": "/Homework/math",
            "to_path": "/Homework/algebra",
            "allow_shared_folder": false,
            "autorename": false,
            "allow_ownership_transfer": false
        },
        "parameters": [{
            "name": "from_path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
            "desc": "Path in the user's Dropbox to be copied or moved."
        }, {
            "name": "to_path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
            "desc": "Path in the user's Dropbox that is the destination."
        }, {
            "name": "allow_shared_folder (deprecated)",
            "type": "Boolean",
            "desc": "Field is deprecated. This flag has no effect. The default for this field is False."
        }, {
            "name": "autorename",
            "type": "Boolean",
            "desc": "If there's a conflict, have the Dropbox server try to autorename the file to avoid the conflict. The default for this field is False."
        }, {
            "name": "allow_ownership_transfer",
            "type": "Boolean",
            "desc": "Allow moves by owner even if it would result in an ownership transfer for the content being moved. This does not apply to copies. The default for this field is False."
        }],
        "returnParameters": []
    },
    "files/copy_reference/get": {
        "uri": "https://api.dropboxapi.com/2/files/copy_reference/get",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/video.mp4"
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*|id:.*)|(rev:[0-9a-f]{9,})|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path to the file or folder you want to get a copy reference to."
        }],
        "returnParameters": []
    },
    "files/copy_reference/save": {
        "uri": "https://api.dropboxapi.com/2/files/copy_reference/save",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "copy_reference": "z1X6ATl6aWtzOGq0c3g5Ng",
            "path": "/video.mp4"
        },
        "parameters": [{
            "name": "copy_reference",
            "type": "String",
            "desc": "A copy reference returned by  ."
        }, {
            "name": "path",
            "type": "String(pattern=\"/(.|[\\r\\n])*\")",
            "desc": "Path in the user's Dropbox that is the destination."
        }],
        "returnParameters": []
    },
    "files/create_folder": {
        "uri": "https://api.dropboxapi.com/2/files/create_folder_v2",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/Homework/math",
            "autorename": false
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
            "desc": "Path in the user's Dropbox to create."
        }, {
            "name": "autorename",
            "type": "Boolean",
            "desc": "If there's a conflict, have the Dropbox server try to autorename the folder to avoid the conflict. The default for this field is False."
        }],
        "returnParameters": []
    },
    "files/delete": {
        "uri": "https://api.dropboxapi.com/2/files/delete_v2",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/Homework/math/Prime_Numbers.txt"
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
            "desc": "Path in the user's Dropbox to delete."
        }, {
            "name": "parent_rev",
            "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
            "desc": "Perform delete if given \"rev\" matches the existing file's latest \"rev\". This field does not support deleting a folder. This field is optional."
        }],
        "returnParameters": []
    },
    "files/delete_batch": {
        "uri": "https://api.dropboxapi.com/2/files/delete_batch",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "entries": [
              {
                "path": "/Homework/math/Prime_Numbers.txt"
              }
            ]
        },
        "parameters": [{
            "name": "entries",
            "type": "List of DeleteArg",
            "desc": "",
            "parameters": [{
                "name": "path",
                "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
                "desc": "Path in the user's Dropbox to delete."
              }],
        }],
        "returnParameters": []
    },
    "files/download": {
        "uri": "https://content.dropboxapi.com/2/files/download",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "CONTENT",
        "testParams": {
            "path": "/Homework/math/Prime_Numbers.txt"
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*|id:.*)|(rev:[0-9a-f]{9,})|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path of the file to download."
        }, {
            "name": "rev",
            "type": "String(min_length=9, pattern=\"[0-9a-f]+\")?",
            "desc": "Deprecated. Please specify revision in path instead This field is optional."
        }],
        "returnParameters": []
    },
    "files/get_metadata": {
        "uri": "https://api.dropboxapi.com/2/files/get_metadata",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/Homework/math",
            "include_media_info": false,
            "include_deleted": false,
            "include_has_explicit_shared_members": false
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*|id:.*)|(rev:[0-9a-f]{9,})|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path of a file or folder on Dropbox."
        }, {
            "name": "include_media_info",
            "type": "Boolean",
            "desc": "If true, FileMetadata.media_info is set for photo and video. The default for this field is False."
        }, {
            "name": "include_deleted",
            "type": "Boolean",
            "desc": "If true,   will be returned for deleted file or folder, otherwise LookupError.not_found will be returned. The default for this field is False."
        }, {
            "name": "include_has_explicit_shared_members",
            "type": "Boolean",
            "desc": "If true, the results will include a flag for each file indicating whether or not  that file has any explicit members. The default for this field is False."
        }],
        "returnParameters": []
    },
    "files/get_preview": {
        "uri": "https://content.dropboxapi.com/2/files/get_preview",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "CONTENT",
        "testParams": {
            "path": "/word.docx"
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*|id:.*)|(rev:[0-9a-f]{9,})|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path of the file to preview."
        }, {
            "name": "rev",
            "type": "String(min_length=9, pattern=\"[0-9a-f]+\")?",
            "desc": "Deprecated. Please specify revision in path instead This field is optional."
        }],
        "returnParameters": []
    },
    "files/get_temporary_link": {
        "uri": "https://api.dropboxapi.com/2/files/get_temporary_link",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/video.mp4"
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*|id:.*)|(rev:[0-9a-f]{9,})|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path to the file you want a temporary link to."
        }],
        "returnParameters": []
    },
    "files/get_thumbnail": {
        "uri": "https://content.dropboxapi.com/2/files/get_thumbnail",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "CONTENT",
        "testParams": {
            "path": "/image.jpg",
            "format": "jpeg",
            "size": "w64h64"
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*|id:.*)|(rev:[0-9a-f]{9,})|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path to the image file you want to thumbnail."
        }, {
            "name": "format",
            "type": "ThumbnailFormat",
            "desc": "The format for the thumbnail image, jpeg (default) or png. For  images that are photos, jpeg should be preferred, while png is  better for screenshots and digital arts. The default for this union is jpeg.",
            "parameters": [{
                "name": "jpeg",
                "type": "Void",
                "desc": ""
            }, {
                "name": "png",
                "type": "Void",
                "desc": ""
            }]
        }, {
            "name": "jpeg",
            "type": "Void",
            "desc": ""
        }, {
            "name": "png",
            "type": "Void",
            "desc": ""
        }, {
            "name": "size",
            "type": "ThumbnailSize",
            "desc": "The size for the thumbnail image. The default for this union is w64h64.",
            "parameters": [{
                "name": "w32h32",
                "type": "Void",
                "desc": "32 by 32 px."
            }, {
                "name": "w64h64",
                "type": "Void",
                "desc": "64 by 64 px."
            }, {
                "name": "w128h128",
                "type": "Void",
                "desc": "128 by 128 px."
            }, {
                "name": "w640h480",
                "type": "Void",
                "desc": "640 by 480 px."
            }, {
                "name": "w1024h768",
                "type": "Void",
                "desc": "1024 by 768"
            }]
        }, {
            "name": "w32h32",
            "type": "Void",
            "desc": "32 by 32 px."
        }, {
            "name": "w64h64",
            "type": "Void",
            "desc": "64 by 64 px."
        }, {
            "name": "w128h128",
            "type": "Void",
            "desc": "128 by 128 px."
        }, {
            "name": "w640h480",
            "type": "Void",
            "desc": "640 by 480 px."
        }, {
            "name": "w1024h768",
            "type": "Void",
            "desc": "1024 by 768"
        }],
        "returnParameters": []
    },
    "files/list_folder": {
        "uri": "https://api.dropboxapi.com/2/files/list_folder",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/Homework/math",
            "recursive": false,
            "include_media_info": false,
            "include_deleted": false,
            "include_has_explicit_shared_members": false
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)?|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path to the folder you want to see the contents of."
        }, {
            "name": "recursive",
            "type": "Boolean",
            "desc": "If true, the list folder operation will be applied recursively to all subfolders and the response will contain contents of all subfolders. The default for this field is False."
        }, {
            "name": "include_media_info",
            "type": "Boolean",
            "desc": "If true, FileMetadata.media_info is set for photo and video. The default for this field is False."
        }, {
            "name": "include_deleted",
            "type": "Boolean",
            "desc": "If true, the results will include entries for files and folders that used to exist but were deleted. The default for this field is False."
        }, {
            "name": "include_has_explicit_shared_members",
            "type": "Boolean",
            "desc": "If true, the results will include a flag for each file indicating whether or not  that file has any explicit members. The default for this field is False."
        }],
        "returnParameters": []
    },
    "files/list_folder/continue": {
        "uri": "https://api.dropboxapi.com/2/files/list_folder/continue",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "cursor": "ZtkX9_EHj3x7PMkVuFIhwKYXEpwpLwyxp9vMKomUhllil9q7eWiAu"
        },
        "parameters": [{
            "name": "cursor",
            "type": "String(min_length=1)",
            "desc": "The cursor returned by your last call to   or  ."
        }],
        "returnParameters": []
    },
    "files/list_folder/get_latest_cursor": {
        "uri": "https://api.dropboxapi.com/2/files/list_folder/get_latest_cursor",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/Homework/math",
            "recursive": false,
            "include_media_info": false,
            "include_deleted": false,
            "include_has_explicit_shared_members": false
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)?|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path to the folder you want to see the contents of."
        }, {
            "name": "recursive",
            "type": "Boolean",
            "desc": "If true, the list folder operation will be applied recursively to all subfolders and the response will contain contents of all subfolders. The default for this field is False."
        }, {
            "name": "include_media_info",
            "type": "Boolean",
            "desc": "If true, FileMetadata.media_info is set for photo and video. The default for this field is False."
        }, {
            "name": "include_deleted",
            "type": "Boolean",
            "desc": "If true, the results will include entries for files and folders that used to exist but were deleted. The default for this field is False."
        }, {
            "name": "include_has_explicit_shared_members",
            "type": "Boolean",
            "desc": "If true, the results will include a flag for each file indicating whether or not  that file has any explicit members. The default for this field is False."
        }],
        "returnParameters": []
    },
    "files/list_folder/longpoll": {
        "uri": "https://notify.dropboxapi.com/2/files/list_folder/longpoll",
        "requiresAuthHeader": false,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "cursor": "ZtkX9_EHj3x7PMkVuFIhwKYXEpwpLwyxp9vMKomUhllil9q7eWiAu",
            "timeout": 30
        },
        "parameters": [{
            "name": "cursor",
            "type": "String(min_length=1)",
            "desc": "A cursor as returned by   or  . Cursors retrieved by setting ListFolderArg.include_media_info to true are not supported."
        }, {
            "name": "timeout",
            "type": "UInt64",
            "desc": "A timeout in seconds. The request will block for at most this length of time, plus up to 90 seconds of random jitter added to avoid the thundering herd problem. Care should be taken when using this parameter, as some network infrastructure does not support long timeouts. The default for this field is 30."
        }],
        "returnParameters": []
    },
    "files/list_revisions": {
        "uri": "https://api.dropboxapi.com/2/files/list_revisions",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/root/word.docx",
            "limit": 10
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"/(.|[\\r\\n])*|id:.*|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path to the file you want to see the revisions of."
        }, {
            "name": "limit",
            "type": "UInt64",
            "desc": "The maximum number of revision entries returned. The default for this field is 10."
        }],
        "returnParameters": []
    },
    "files/lock_file_batch": {
        "uri": "https://api.dropboxapi.com/2/files/lock_file_batch",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "entries": [{
                "path": "/John Doe/sample/test.pdf"
            }]
        },
        "parameters": [{
            "name": "entries",
            "type": "List of (LockFileArg)",
            "desc": "The path to the file you want to see the revisions of.",
            "parameters": [{
                "name": "path",
                "type": "String(pattern=\"(/(.|[\r\n])*)|(ns:[0-9]+(/.*)?)|(id:.*)\")",
                "desc": "Path in the user's Dropbox to a file."
            }]
        }],
        "returnParameters": []
    },
    "files/move": {
        "uri": "https://api.dropboxapi.com/2/files/move_v2",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "from_path": "/Homework/math",
            "to_path": "/Homework/algebra",
            "allow_shared_folder": false,
            "autorename": false,
            "allow_ownership_transfer": false
        },
        "parameters": [{
            "name": "from_path",
            "type": "String(pattern=\"(/(.|[\r\n])*)|(ns:[0-9]+(/.*)?)|(id:.*)\")",
            "desc": "Path in the user's Dropbox to be copied or moved."
        }, {
            "name": "to_path",
            "type": "String(pattern=\"(/(.|[\r\n])*)|(ns:[0-9]+(/.*)?)|(id:.*)\")",
            "desc": "Path in the user's Dropbox that is the destination."
        }, {
            "name": "allow_shared_folder (deprecated)",
            "type": "Boolean",
            "desc": "Field is deprecated. This flag has no effect. The default for this field is False."
        }, {
            "name": "autorename",
            "type": "Boolean",
            "desc": "If there's a conflict, have the Dropbox server try to autorename the file to avoid the conflict. The default for this field is False."
        }, {
            "name": "allow_ownership_transfer",
            "type": "Boolean",
            "desc": "Allow moves by owner even if it would result in an ownership transfer for the content being moved. This does not apply to copies. The default for this field is False."
        }],
        "returnParameters": []
    },
    "files/permanently_delete": {
        "uri": "https://api.dropboxapi.com/2/files/permanently_delete",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/Homework/math/Prime_Numbers.txt"
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
            "desc": "Path in the user's Dropbox to delete."
        }],
        "returnParameters": []
    },
    "files/properties/add": {
        "uri": "https://api.dropboxapi.com/2/files/properties/add",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/my_awesome/word.docx",
            "property_groups": [{
                "template_id": "ptid:1a5n2i6d3OYEAAAAAAAAAYa",
                "fields": [{
                    "name": "Security Policy",
                    "value": "Confidential"
                }]
            }]
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"/(.|[\\r\\n])*|id:.*|(ns:[0-9]+(/.*)?)\")",
            "desc": "A unique identifier for the file."
        }, {
            "name": "property_groups",
            "type": "List of (PropertyGroup, )",
            "desc": "Filled custom property templates associated with a file.",
            "parameters": [{
                "name": "template_id",
                "type": "String(min_length=1, pattern=\"(/|ptid:).*\")",
                "desc": "A unique identifier for a property template type."
            }, {
                "name": "fields",
                "type": "List of (PropertyField, )",
                "desc": "This is a list of custom properties associated with a file. There can be up to 32 properties for a template.",
                "parameters": [{
                    "name": "name",
                    "type": "String",
                    "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
                }, {
                    "name": "value",
                    "type": "String",
                    "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
                }]
            }, {
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }, {
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }]
        }, {
            "name": "template_id",
            "type": "String(min_length=1, pattern=\"(/|ptid:).*\")",
            "desc": "A unique identifier for a property template type."
        }, {
            "name": "fields",
            "type": "List of (PropertyField, )",
            "desc": "This is a list of custom properties associated with a file. There can be up to 32 properties for a template.",
            "parameters": [{
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }]
        }, {
            "name": "name",
            "type": "String",
            "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
        }, {
            "name": "value",
            "type": "String",
            "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
        }],
        "returnParameters": []
    },
    "files/properties/overwrite": {
        "uri": "https://api.dropboxapi.com/2/files/properties/overwrite",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/my_awesome/word.docx",
            "property_groups": [{
                "template_id": "ptid:1a5n2i6d3OYEAAAAAAAAAYa",
                "fields": [{
                    "name": "Security Policy",
                    "value": "Confidential"
                }]
            }]
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"/(.|[\\r\\n])*|id:.*|(ns:[0-9]+(/.*)?)\")",
            "desc": "A unique identifier for the file."
        }, {
            "name": "property_groups",
            "type": "List of (PropertyGroup, )",
            "desc": "Filled custom property templates associated with a file.",
            "parameters": [{
                "name": "template_id",
                "type": "String(min_length=1, pattern=\"(/|ptid:).*\")",
                "desc": "A unique identifier for a property template type."
            }, {
                "name": "fields",
                "type": "List of (PropertyField, )",
                "desc": "This is a list of custom properties associated with a file. There can be up to 32 properties for a template.",
                "parameters": [{
                    "name": "name",
                    "type": "String",
                    "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
                }, {
                    "name": "value",
                    "type": "String",
                    "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
                }]
            }, {
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }, {
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }]
        }, {
            "name": "template_id",
            "type": "String(min_length=1, pattern=\"(/|ptid:).*\")",
            "desc": "A unique identifier for a property template type."
        }, {
            "name": "fields",
            "type": "List of (PropertyField, )",
            "desc": "This is a list of custom properties associated with a file. There can be up to 32 properties for a template.",
            "parameters": [{
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }]
        }, {
            "name": "name",
            "type": "String",
            "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
        }, {
            "name": "value",
            "type": "String",
            "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
        }],
        "returnParameters": []
    },
    "files/properties/remove": {
        "uri": "https://api.dropboxapi.com/2/files/properties/remove",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/my_awesome/word.docx",
            "property_template_ids": [
                "ptid:1a5n2i6d3OYEAAAAAAAAAYa"
            ]
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"/(.|[\\r\\n])*|id:.*|(ns:[0-9]+(/.*)?)\")",
            "desc": "A unique identifier for the file."
        }, {
            "name": "property_template_ids",
            "type": "List of (String(min_length=1, pattern=\"(/|ptid:).*\"), )",
            "desc": "A list of identifiers for a property template created by route properties/template/add."
        }],
        "returnParameters": []
    },
    "files/properties/template/get": {
        "uri": "https://api.dropboxapi.com/2/files/properties/template/get",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "template_id": "ptid:1a5n2i6d3OYEAAAAAAAAAYa"
        },
        "parameters": [{
            "name": "template_id",
            "type": "String(min_length=1, pattern=\"(/|ptid:).*\")",
            "desc": "An identifier for property template added by route properties/template/add."
        }],
        "returnParameters": []
    },
    "files/properties/template/list": {
        "uri": "https://api.dropboxapi.com/2/files/properties/template/list",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "parameters": [],
        "returnParameters": []
    },
    "files/properties/update": {
        "uri": "https://api.dropboxapi.com/2/files/properties/update",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/my_awesome/word.docx",
            "update_property_groups": [{
                "template_id": "ptid:1a5n2i6d3OYEAAAAAAAAAYa",
                "add_or_update_fields": [{
                    "name": "Security Policy",
                    "value": "Confidential"
                }],
                "remove_fields": []
            }]
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"/(.|[\\r\\n])*|id:.*|(ns:[0-9]+(/.*)?)\")",
            "desc": "A unique identifier for the file."
        }, {
            "name": "update_property_groups",
            "type": "List of (PropertyGroupUpdate, )",
            "desc": "Filled custom property templates associated with a file.",
            "parameters": [{
                "name": "template_id",
                "type": "String(min_length=1, pattern=\"(/|ptid:).*\")",
                "desc": "A unique identifier for a property template."
            }, {
                "name": "add_or_update_fields",
                "type": "List of (PropertyField, )?",
                "desc": "List of property fields to update if the field already exists. If the field doesn't exist, add the field to the property group. This field is optional.",
                "parameters": [{
                    "name": "name",
                    "type": "String",
                    "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
                }, {
                    "name": "value",
                    "type": "String",
                    "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
                }]
            }, {
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }, {
                "name": "remove_fields",
                "type": "List of (String, )?",
                "desc": "List of property field names to remove from property group if the field exists. This field is optional."
            }, {
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }]
        }, {
            "name": "template_id",
            "type": "String(min_length=1, pattern=\"(/|ptid:).*\")",
            "desc": "A unique identifier for a property template."
        }, {
            "name": "add_or_update_fields",
            "type": "List of (PropertyField, )?",
            "desc": "List of property fields to update if the field already exists. If the field doesn't exist, add the field to the property group. This field is optional.",
            "parameters": [{
                "name": "name",
                "type": "String",
                "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
            }, {
                "name": "value",
                "type": "String",
                "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
            }]
        }, {
            "name": "name",
            "type": "String",
            "desc": "This is the name or key of a custom property in a property template. File property names can be up to 256 bytes."
        }, {
            "name": "value",
            "type": "String",
            "desc": "Value of a custom property attached to a file. Values can be up to 1024 bytes."
        }, {
            "name": "remove_fields",
            "type": "List of (String, )?",
            "desc": "List of property field names to remove from property group if the field exists. This field is optional."
        }],
        "returnParameters": []
    },
    "files/restore": {
        "uri": "https://api.dropboxapi.com/2/files/restore",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/root/word.docx",
            "rev": "a1c10ce0dd78"
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path to the file you want to restore."
        }, {
            "name": "rev",
            "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
            "desc": "The revision to restore for the file."
        }],
        "returnParameters": []
    },
    "files/save_url": {
        "uri": "https://api.dropboxapi.com/2/files/save_url",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/a.txt",
            "url": "http://example.com/a.txt"
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"/(.|[\\r\\n])*\")",
            "desc": "The path in Dropbox where the URL will be saved to."
        }, {
            "name": "url",
            "type": "String",
            "desc": "The URL to be saved."
        }],
        "returnParameters": []
    },
    "files/save_url/check_job_status": {
        "uri": "https://api.dropboxapi.com/2/files/save_url/check_job_status",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "async_job_id": "34g93hh34h04y384084"
        },
        "parameters": [{
            "name": "async_job_id",
            "type": "String(min_length=1)",
            "desc": "Id of the asynchronous job. This is the value of a response returned from the method that launched the job."
        }],
        "returnParameters": []
    },
    "files/search": {
        "uri": "https://api.dropboxapi.com/2/files/search_v2",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "query": "cat",
            "options": {
                "path": "/Folder",
                "max_results": 20,
                "file_status": "active",
                "filename_only": false
            },
            "match_field_options": {
                "include_highlights": false
            }
        },
        "parameters": [{
            "name": "query",
            "type": "String(max_length=1000)",
            "desc": "The string to search for. May match across multiple fields based on the request arguments."
        }, {
            "name": "options",
            "type": "SearchOptions",
            "desc": "Options for more targeted search results. This field is optional.",
            "parameters": [{
                "name": "path",
                "type": "String(pattern=\"(/(.|[\r\n])*)?|id:.*|(ns:[0-9]+(/.*)?)\")?",
                "desc": " Scopes the search to a path in the user's Dropbox. Searches the entire Dropbox if not specified. This field is optional."
            }, {
                "name": "max_results",
                "type": "UInt64(min=1, max=1000)",
                "desc": "The maximum number of search results to return. The default for this field is 100."
            }, {
                "name": "order_by",
                "type": "SearchOrderBy",
                "desc": "Specified property of the order of search results. By default, results are sorted by relevance. This field is optional.",
                "parameters": [{
                    "name": "relevance",
                    "type": "Void",
                    "desc": ""
                }, {
                    "name": "last_modified_time",
                    "type": "Void",
                    "desc": ""
                }]
            }, {
                "name": "file_status",
                "type": "FileStatus",
                "desc": "Restricts search to the given file status. The default for this union is active.",
                "parameters": [{
                    "name": "active",
                    "type": "Void",
                    "desc": ""
                }, {
                    "name": "deleted",
                    "type": "Void",
                    "desc": ""
                }]
            }, {
                "name": "filename_only",
                "type": "Boolean",
                "desc": "Restricts search to only match on filenames. The default for this field is False."
            }, {
                "name": "file_extensions",
                "type": "List of (String)",
                "desc": "Restricts search to only the extensions specified. Only supported for active file search. This field is optional."
            }, {
                "name": "file_categories ",
                "type": "List of (FileCategory)",
                "desc": " Restricts search to only the file categories specified. Only supported for active file search. This field is optional.",
                "parameters": [{
                    "name": "image",
                    "type": "Void",
                    "desc": "jpg, png, gif, and more."
                }, {
                    "name": "document",
                    "type": "Void",
                    "desc": "doc, docx, txt, and more."
                }, {
                    "name": "pdf",
                    "type": "Void",
                    "desc": "pdf"
                }, {
                    "name": "spreadsheet",
                    "type": "Void",
                    "desc": "xlsx, xls, csv, and more."
                }, {
                    "name": "presentation",
                    "type": "Void",
                    "desc": "ppt, pptx, key, and more."
                }, {
                    "name": "audio",
                    "type": "Void",
                    "desc": "mp3, wav, mid, and more."
                }, {
                    "name": "video",
                    "type": "Void",
                    "desc": "mov, wmv, mp4, and more."
                }, {
                    "name": "folder",
                    "type": "Void",
                    "desc": "dropbox folder."
                }, {
                    "name": "paper",
                    "type": "Void",
                    "desc": "dropbox paper doc."
                }, {
                    "name": "others",
                    "type": "Void",
                    "desc": "any file not in one of the categories above."
                }]
            }]
        }, {
            "name": "match_field_options ",
            "type": "SearchMatchFieldOptions",
            "desc": "Options for search results match fields. This field is optional.",
            "parameters": [{
                "name": "include_highlights",
                "type": "Boolean",
                "desc": "Whether to include highlight span from file title. The default for this field is False."
            }]
        }],
        "returnParameters": []
    },
    "files/search/continue": {
        "uri": "https://api.dropboxapi.com/2/files/search/continue_v2",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "cursor": "ZtkX9_EHj3x7PMkVuFIhwKYXEpwpLwyxp9vMKomUhllil9q7eWiAu"
        },
        "parameters": [{
            "name": "cursor",
            "type": "String(min_length=1)",
            "desc": "The cursor returned by your last call to search:2. Used to fetch the next page of results."
        }],
        "returnParameters": []
    },
    "files/unlock_file_batch": {
        "uri": "https://api.dropboxapi.com/2/files/unlock_file_batch",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "entries": [{
                "path": "/John Doe/sample/test.pdf"
            }]
        },
        "parameters": [{
            "name": "entries",
            "type": "List of (UnlockFileArg)",
            "desc": "The path to the file you want to see the revisions of.",
            "parameters": [{
                "name": "path",
                "type": "String(pattern=\"(/(.|[\r\n])*)|(ns:[0-9]+(/.*)?)|(id:.*)\")",
                "desc": "Path in the user's Dropbox to a file."
            }]
        }],
        "returnParameters": []
    },
    "files/upload": {
        "uri": "https://content.dropboxapi.com/2/files/upload",
        "requiresAuthHeader": true,
        "requiresReadableStream": true,
        "endpointType": "CONTENT",
        "testParams": {
            "path": "/Homework/math/Matrices.txt",
            "mode": "add",
            "autorename": true,
            "mute": false
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
            "desc": "Path in the user's Dropbox to save the file."
        }, {
            "name": "mode",
            "type": "WriteMode",
            "desc": "Selects what to do if the file already exists. The default for this union is add.",
            "parameters": [{
                "name": "add",
                "type": "Void",
                "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
            }, {
                "name": "overwrite",
                "type": "Void",
                "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
            }, {
                "name": "update",
                "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
            }]
        }, {
            "name": "add",
            "type": "Void",
            "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
        }, {
            "name": "overwrite",
            "type": "Void",
            "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
        }, {
            "name": "update",
            "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
            "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
        }, {
            "name": "autorename",
            "type": "Boolean",
            "desc": "If there's a conflict, as determined by mode, have the Dropbox server try to autorename the file to avoid conflict. The default for this field is False."
        }, {
            "name": "client_modified",
            "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
            "desc": "The value to store as the client_modified timestamp. Dropbox automatically records the time at which the file was written to the Dropbox servers. It can also record an additional timestamp, provided by Dropbox desktop clients, mobile clients, and API apps of when the file was actually created or modified. This field is optional."
        }, {
            "name": "mute",
            "type": "Boolean",
            "desc": "Normally, users are made aware of any file modifications in their Dropbox account via notifications in the client software. If true, this tells the clients that this modification shouldn't result in a user notification. The default for this field is False."
        }],
        "returnParameters": []
    },
    "files/upload_session/append": {
        "uri": "https://content.dropboxapi.com/2/files/upload_session/append",
        "requiresAuthHeader": true,
        "requiresReadableStream": true,
        "endpointType": "CONTENT",
        "testParams": {
            "session_id": "1234faaf0678bcde",
            "offset": 0
        },
        "parameters": [{
            "name": "session_id",
            "type": "String",
            "desc": "The upload session ID (returned by  )."
        }, {
            "name": "offset",
            "type": "UInt64",
            "desc": "The amount of data that has been uploaded so far. We use this to make sure upload data isn't lost or duplicated in the event of a network error."
        }],
        "returnParameters": []
    },
    "files/upload_session/append_v2": {
        "uri": "https://content.dropboxapi.com/2/files/upload_session/append_v2",
        "requiresAuthHeader": true,
        "requiresReadableStream": true,
        "endpointType": "CONTENT",
        "testParams": {
            "cursor": {
                "session_id": "1234faaf0678bcde",
                "offset": 0
            },
            "close": false
        },
        "parameters": [{
            "name": "cursor",
            "type": "UploadSessionCursor",
            "desc": "Contains the upload session ID and the offset.",
            "parameters": [{
                "name": "session_id",
                "type": "String",
                "desc": "The upload session ID (returned by upload_session/start)."
            }, {
                "name": "offset",
                "type": "UInt64",
                "desc": "Offset in bytes at which data should be appended. We use this to make sure upload data isn't lost or duplicated in the event of a network error."
            }]
        }, {
            "name": "close",
            "type": "Boolean",
            "desc": "If true, the current session will be closed, at which point you won't be able to call   anymore with the current session. The default for this field is False."
        }],
        "returnParameters": []
    },
    "files/upload_session/finish": {
        "uri": "https://content.dropboxapi.com/2/files/upload_session/finish",
        "requiresAuthHeader": true,
        "requiresReadableStream": true,
        "endpointType": "CONTENT",
        "testParams": {
            "cursor": {
                "session_id": "1234faaf0678bcde",
                "offset": 0
            },
            "commit": {
                "path": "/Homework/math/Matrices.txt",
                "mode": "add",
                "autorename": true,
                "mute": false
            }
        },
        "parameters": [{
            "name": "cursor",
            "type": "UploadSessionCursor",
            "desc": "Contains the upload session ID and the offset.",
            "parameters": [{
                "name": "session_id",
                "type": "String",
                "desc": "The upload session ID (returned by  )."
            }, {
                "name": "offset",
                "type": "UInt64",
                "desc": "The amount of data that has been uploaded so far. We use this to make sure upload data isn't lost or duplicated in the event of a network error."
            }]
        }, {
            "name": "session_id",
            "type": "String",
            "desc": "The upload session ID (returned by  )."
        }, {
            "name": "offset",
            "type": "UInt64",
            "desc": "The amount of data that has been uploaded so far. We use this to make sure upload data isn't lost or duplicated in the event of a network error."
        }, {
            "name": "commit",
            "type": "CommitInfo",
            "desc": "Contains the path and other optional modifiers for the commit.",
            "parameters": [{
                "name": "path",
                "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
                "desc": "Path in the user's Dropbox to save the file."
            }, {
                "name": "mode",
                "type": "WriteMode",
                "desc": "Selects what to do if the file already exists. The default for this union is add.",
                "parameters": [{
                    "name": "add",
                    "type": "Void",
                    "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
                }, {
                    "name": "overwrite",
                    "type": "Void",
                    "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
                }, {
                    "name": "update",
                    "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                    "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
                }]
            }, {
                "name": "add",
                "type": "Void",
                "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
            }, {
                "name": "overwrite",
                "type": "Void",
                "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
            }, {
                "name": "update",
                "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
            }, {
                "name": "autorename",
                "type": "Boolean",
                "desc": "If there's a conflict, as determined by mode, have the Dropbox server try to autorename the file to avoid conflict. The default for this field is False."
            }, {
                "name": "client_modified",
                "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
                "desc": "The value to store as the client_modified timestamp. Dropbox automatically records the time at which the file was written to the Dropbox servers. It can also record an additional timestamp, provided by Dropbox desktop clients, mobile clients, and API apps of when the file was actually created or modified. This field is optional."
            }, {
                "name": "mute",
                "type": "Boolean",
                "desc": "Normally, users are made aware of any file modifications in their Dropbox account via notifications in the client software. If true, this tells the clients that this modification shouldn't result in a user notification. The default for this field is False."
            }, {
                "name": "add",
                "type": "Void",
                "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
            }, {
                "name": "overwrite",
                "type": "Void",
                "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
            }, {
                "name": "update",
                "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
            }]
        }, {
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
            "desc": "Path in the user's Dropbox to save the file."
        }, {
            "name": "mode",
            "type": "WriteMode",
            "desc": "Selects what to do if the file already exists. The default for this union is add.",
            "parameters": [{
                "name": "add",
                "type": "Void",
                "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
            }, {
                "name": "overwrite",
                "type": "Void",
                "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
            }, {
                "name": "update",
                "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
            }]
        }, {
            "name": "add",
            "type": "Void",
            "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
        }, {
            "name": "overwrite",
            "type": "Void",
            "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
        }, {
            "name": "update",
            "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
            "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
        }, {
            "name": "autorename",
            "type": "Boolean",
            "desc": "If there's a conflict, as determined by mode, have the Dropbox server try to autorename the file to avoid conflict. The default for this field is False."
        }, {
            "name": "client_modified",
            "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
            "desc": "The value to store as the client_modified timestamp. Dropbox automatically records the time at which the file was written to the Dropbox servers. It can also record an additional timestamp, provided by Dropbox desktop clients, mobile clients, and API apps of when the file was actually created or modified. This field is optional."
        }, {
            "name": "mute",
            "type": "Boolean",
            "desc": "Normally, users are made aware of any file modifications in their Dropbox account via notifications in the client software. If true, this tells the clients that this modification shouldn't result in a user notification. The default for this field is False."
        }],
        "returnParameters": []
    },
    "files/upload_session/finish_batch": {
        "uri": "https://api.dropboxapi.com/2/files/upload_session/finish_batch",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "entries": [{
                "cursor": {
                    "session_id": "1234faaf0678bcde",
                    "offset": 0
                },
                "commit": {
                    "path": "/Homework/math/Matrices.txt",
                    "mode": {
                        ".tag": "add"
                    },
                    "autorename": true,
                    "mute": false
                }
            }]
        },
        "parameters": [{
            "name": "entries",
            "type": "List of (UploadSessionFinishArg, max_items=1000)",
            "desc": "Commit information for each file in the batch.",
            "parameters": [{
                "name": "cursor",
                "type": "UploadSessionCursor",
                "desc": "Contains the upload session ID and the offset.",
                "parameters": [{
                    "name": "session_id",
                    "type": "String",
                    "desc": " The upload session ID (returned by upload_session/start)."
                }, {
                    "name": "offset",
                    "type": "UInt64",
                    "desc": "The amount of data that has been uploaded so far. We use this to make sure upload data isn't lost or duplicated in the event of a network error."
                }]
            }, {
                "name": "session_id",
                "type": "String",
                "desc": " The upload session ID (returned by upload_session/start)."
            }, {
                "name": "offset",
                "type": "UInt64",
                "desc": "The amount of data that has been uploaded so far. We use this to make sure upload data isn't lost or duplicated in the event of a network error."
            }, {
                "name": "commit",
                "type": "CommitInfo",
                "desc": "Contains the path and other optional modifiers for the commit.",
                "parameters": [{
                    "name": "path",
                    "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
                    "desc": "Path in the user's Dropbox to save the file."
                }, {
                    "name": "mode",
                    "type": "WriteMode",
                    "desc": "Selects what to do if the file already exists. The default for this union is add.",
                    "parameters": [{
                        "name": "add",
                        "type": "Void",
                        "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
                    }, {
                        "name": "overwrite",
                        "type": "Void",
                        "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
                    }, {
                        "name": "update",
                        "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                        "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
                    }]
                }, {
                    "name": "add",
                    "type": "Void",
                    "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
                }, {
                    "name": "overwrite",
                    "type": "Void",
                    "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
                }, {
                    "name": "update",
                    "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                    "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
                }, {
                    "name": "autorename",
                    "type": "Boolean",
                    "desc": "If there's a conflict, as determined by mode, have the Dropbox server try to autorename the file to avoid conflict. The default for this field is False."
                }, {
                    "name": "client_modified",
                    "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
                    "desc": "The value to store as the client_modified timestamp. Dropbox automatically records the time at which the file was written to the Dropbox servers. It can also record an additional timestamp, provided by Dropbox desktop clients, mobile clients, and API apps of when the file was actually created or modified. This field is optional."
                }, {
                    "name": "mute",
                    "type": "Boolean",
                    "desc": "Normally, users are made aware of any file modifications in their Dropbox account via notifications in the client software. If true, this tells the clients that this modification shouldn't result in a user notification. The default for this field is False."
                }, {
                    "name": "add",
                    "type": "Void",
                    "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
                }, {
                    "name": "overwrite",
                    "type": "Void",
                    "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
                }, {
                    "name": "update",
                    "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                    "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
                }]
            }, {
                "name": "path",
                "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
                "desc": "Path in the user's Dropbox to save the file."
            }, {
                "name": "mode",
                "type": "WriteMode",
                "desc": "Selects what to do if the file already exists. The default for this union is add.",
                "parameters": [{
                    "name": "add",
                    "type": "Void",
                    "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
                }, {
                    "name": "overwrite",
                    "type": "Void",
                    "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
                }, {
                    "name": "update",
                    "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                    "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
                }]
            }, {
                "name": "add",
                "type": "Void",
                "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
            }, {
                "name": "overwrite",
                "type": "Void",
                "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
            }, {
                "name": "update",
                "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
            }, {
                "name": "autorename",
                "type": "Boolean",
                "desc": "If there's a conflict, as determined by mode, have the Dropbox server try to autorename the file to avoid conflict. The default for this field is False."
            }, {
                "name": "client_modified",
                "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
                "desc": "The value to store as the client_modified timestamp. Dropbox automatically records the time at which the file was written to the Dropbox servers. It can also record an additional timestamp, provided by Dropbox desktop clients, mobile clients, and API apps of when the file was actually created or modified. This field is optional."
            }, {
                "name": "mute",
                "type": "Boolean",
                "desc": "Normally, users are made aware of any file modifications in their Dropbox account via notifications in the client software. If true, this tells the clients that this modification shouldn't result in a user notification. The default for this field is False."
            }, {
                "name": "session_id",
                "type": "String",
                "desc": "The upload session ID (returned by  )."
            }, {
                "name": "offset",
                "type": "UInt64",
                "desc": "The amount of data that has been uploaded so far. We use this to make sure upload data isn't lost or duplicated in the event of a network error."
            }, {
                "name": "path",
                "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
                "desc": "Path in the user's Dropbox to save the file."
            }, {
                "name": "mode",
                "type": "WriteMode",
                "desc": "Selects what to do if the file already exists. The default for this union is add.",
                "parameters": [{
                    "name": "add",
                    "type": "Void",
                    "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
                }, {
                    "name": "overwrite",
                    "type": "Void",
                    "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
                }, {
                    "name": "update",
                    "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                    "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
                }]
            }, {
                "name": "add",
                "type": "Void",
                "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
            }, {
                "name": "overwrite",
                "type": "Void",
                "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
            }, {
                "name": "update",
                "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
            }, {
                "name": "autorename",
                "type": "Boolean",
                "desc": "If there's a conflict, as determined by mode, have the Dropbox server try to autorename the file to avoid conflict. The default for this field is False."
            }, {
                "name": "client_modified",
                "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
                "desc": "The value to store as the client_modified timestamp. Dropbox automatically records the time at which the file was written to the Dropbox servers. It can also record an additional timestamp, provided by Dropbox desktop clients, mobile clients, and API apps of when the file was actually created or modified. This field is optional."
            }, {
                "name": "mute",
                "type": "Boolean",
                "desc": "Normally, users are made aware of any file modifications in their Dropbox account via notifications in the client software. If true, this tells the clients that this modification shouldn't result in a user notification. The default for this field is False."
            }, {
                "name": "add",
                "type": "Void",
                "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
            }, {
                "name": "overwrite",
                "type": "Void",
                "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
            }, {
                "name": "update",
                "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
            }]
        }, {
            "name": "cursor",
            "type": "UploadSessionCursor",
            "desc": "Contains the upload session ID and the offset.",
            "parameters": [{
                "name": "session_id",
                "type": "String",
                "desc": "The upload session ID (returned by  )."
            }, {
                "name": "offset",
                "type": "UInt64",
                "desc": "The amount of data that has been uploaded so far. We use this to make sure upload data isn't lost or duplicated in the event of a network error."
            }]
        }, {
            "name": "session_id",
            "type": "String",
            "desc": "The upload session ID (returned by  )."
        }, {
            "name": "offset",
            "type": "UInt64",
            "desc": "The amount of data that has been uploaded so far. We use this to make sure upload data isn't lost or duplicated in the event of a network error."
        }, {
            "name": "commit",
            "type": "CommitInfo",
            "desc": "Contains the path and other optional modifiers for the commit.",
            "parameters": [{
                "name": "path",
                "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
                "desc": "Path in the user's Dropbox to save the file."
            }, {
                "name": "mode",
                "type": "WriteMode",
                "desc": "Selects what to do if the file already exists. The default for this union is add.",
                "parameters": [{
                    "name": "add",
                    "type": "Void",
                    "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
                }, {
                    "name": "overwrite",
                    "type": "Void",
                    "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
                }, {
                    "name": "update",
                    "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                    "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
                }]
            }, {
                "name": "add",
                "type": "Void",
                "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
            }, {
                "name": "overwrite",
                "type": "Void",
                "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
            }, {
                "name": "update",
                "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
            }, {
                "name": "autorename",
                "type": "Boolean",
                "desc": "If there's a conflict, as determined by mode, have the Dropbox server try to autorename the file to avoid conflict. The default for this field is False."
            }, {
                "name": "client_modified",
                "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
                "desc": "The value to store as the client_modified timestamp. Dropbox automatically records the time at which the file was written to the Dropbox servers. It can also record an additional timestamp, provided by Dropbox desktop clients, mobile clients, and API apps of when the file was actually created or modified. This field is optional."
            }, {
                "name": "mute",
                "type": "Boolean",
                "desc": "Normally, users are made aware of any file modifications in their Dropbox account via notifications in the client software. If true, this tells the clients that this modification shouldn't result in a user notification. The default for this field is False."
            }, {
                "name": "add",
                "type": "Void",
                "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
            }, {
                "name": "overwrite",
                "type": "Void",
                "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
            }, {
                "name": "update",
                "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
            }]
        }, {
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*)|(ns:[0-9]+(/.*)?)\")",
            "desc": "Path in the user's Dropbox to save the file."
        }, {
            "name": "mode",
            "type": "WriteMode",
            "desc": "Selects what to do if the file already exists. The default for this union is add.",
            "parameters": [{
                "name": "add",
                "type": "Void",
                "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
            }, {
                "name": "overwrite",
                "type": "Void",
                "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
            }, {
                "name": "update",
                "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
                "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
            }]
        }, {
            "name": "add",
            "type": "Void",
            "desc": "Never overwrite the existing file. The autorename strategy is to append a number to the file name. For example, \"document.txt\" might become \"document (2).txt\"."
        }, {
            "name": "overwrite",
            "type": "Void",
            "desc": "Always overwrite the existing file. The autorename strategy is the same as it is for add."
        }, {
            "name": "update",
            "type": "String(min_length=9, pattern=\"[0-9a-f]+\")",
            "desc": "Overwrite if the given \"rev\" matches the existing file's \"rev\". The autorename strategy is to append the string \"conflicted copy\" to the file name. For example, \"document.txt\" might become \"document (conflicted copy).txt\" or \"document (Panda's conflicted copy).txt\"."
        }, {
            "name": "autorename",
            "type": "Boolean",
            "desc": "If there's a conflict, as determined by mode, have the Dropbox server try to autorename the file to avoid conflict. The default for this field is False."
        }, {
            "name": "client_modified",
            "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
            "desc": "The value to store as the client_modified timestamp. Dropbox automatically records the time at which the file was written to the Dropbox servers. It can also record an additional timestamp, provided by Dropbox desktop clients, mobile clients, and API apps of when the file was actually created or modified. This field is optional."
        }, {
            "name": "mute",
            "type": "Boolean",
            "desc": "Normally, users are made aware of any file modifications in their Dropbox account via notifications in the client software. If true, this tells the clients that this modification shouldn't result in a user notification. The default for this field is False."
        }],
        "returnParameters": []
    },
    "files/upload_session/finish_batch/check": {
        "uri": "https://api.dropboxapi.com/2/files/upload_session/finish_batch/check",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "async_job_id": "34g93hh34h04y384084"
        },
        "parameters": [{
            "name": "async_job_id",
            "type": "String(min_length=1)",
            "desc": "Id of the asynchronous job. This is the value of a response returned from the method that launched the job."
        }],
        "returnParameters": []
    },
    "files/upload_session/start": {
        "uri": "https://content.dropboxapi.com/2/files/upload_session/start",
        "requiresAuthHeader": true,
        "requiresReadableStream": true,
        "endpointType": "CONTENT",
        "testParams": {
            "close": false
        },
        "parameters": [{
            "name": "close",
            "type": "Boolean",
            "desc": "If true, the current session will be closed, at which point you won't be able to call   anymore with the current session. The default for this field is False."
        }],
        "returnParameters": []
    },
    "sharing/add_file_member": {
        "uri": "https://api.dropboxapi.com/2/sharing/add_file_member",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "file": "id:3kmLmQFnf1AAAAAAAAAAAw",
            "members": [{
                ".tag": "email",
                "email": "justin@example.com"
            }],
            "custom_message": "This is a custom message about ACME.doc",
            "quiet": false,
            "access_level": "viewer",
            "add_message_as_comment": false
        },
        "parameters": [{
            "name": "file",
            "type": "String(min_length=1, pattern=\"((/|id:).*|nspath:[^:]*:[^:]*)\")",
            "desc": "File to which to add members."
        }, {
            "name": "members",
            "type": "List of (MemberSelector, )",
            "desc": "Members to add. Note that even an email address is given, this may result in a user being directy added to the membership if that email is the user's main account email.",
            "parameters": [{
                "name": "dropbox_id",
                "type": "String(min_length=1)",
                "desc": "Dropbox account, team member, or group ID of member."
            }, {
                "name": "email",
                "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
                "desc": "E-mail address of member."
            }]
        }, {
            "name": "dropbox_id",
            "type": "String(min_length=1)",
            "desc": "Dropbox account, team member, or group ID of member."
        }, {
            "name": "email",
            "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
            "desc": "E-mail address of member."
        }, {
            "name": "custom_message",
            "type": "String?",
            "desc": "Message to send to added members in their invitation. This field is optional."
        }, {
            "name": "quiet",
            "type": "Boolean",
            "desc": "Whether added members should be notified via device notifications of their invitation. The default for this field is False."
        }, {
            "name": "access_level",
            "type": "AccessLevel",
            "desc": "AccessLevel union object, describing what access level we want to give new members. The default for this union is viewer.",
            "parameters": [{
                "name": "owner",
                "type": "Void",
                "desc": "The collaborator is the owner of the shared folder. Owners can view and edit the shared folder as well as set the folder's policies using  ."
            }, {
                "name": "editor",
                "type": "Void",
                "desc": "The collaborator can both view and edit the shared folder."
            }, {
                "name": "viewer",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder."
            }, {
                "name": "viewer_no_comment",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder and does not have any access to comments."
            }]
        }, {
            "name": "owner",
            "type": "Void",
            "desc": "The collaborator is the owner of the shared folder. Owners can view and edit the shared folder as well as set the folder's policies using  ."
        }, {
            "name": "editor",
            "type": "Void",
            "desc": "The collaborator can both view and edit the shared folder."
        }, {
            "name": "viewer",
            "type": "Void",
            "desc": "The collaborator can only view the shared folder."
        }, {
            "name": "viewer_no_comment",
            "type": "Void",
            "desc": "The collaborator can only view the shared folder and does not have any access to comments."
        }, {
            "name": "add_message_as_comment",
            "type": "Boolean",
            "desc": "If the custom message should be added as a comment on the file. The default for this field is False."
        }],
        "returnParameters": []
    },
    "sharing/add_folder_member": {
        "uri": "https://api.dropboxapi.com/2/sharing/add_folder_member",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "shared_folder_id": "84528192421",
            "members": [{
                "member": {
                    ".tag": "email",
                    "email": "justin@example.com"
                },
                "access_level": {
                    ".tag": "editor"
                }
            }, {
                "member": {
                    ".tag": "dropbox_id",
                    "dropbox_id": "dbid:AAEufNrMPSPe0dMQijRP0N_aZtBJRm26W4Q"
                },
                "access_level": {
                    ".tag": "viewer"
                }
            }],
            "quiet": false,
            "custom_message": "Documentation for launch day"
        },
        "parameters": [{
            "name": "shared_folder_id",
            "type": "String(pattern=\"[-_0-9a-zA-Z:]+\")",
            "desc": "The ID for the shared folder."
        }, {
            "name": "members",
            "type": "List of (AddMember, )",
            "desc": "The intended list of members to add.  Added members will receive invites to join the shared folder.",
            "parameters": [{
                "name": "member",
                "type": "MemberSelector",
                "desc": "The member to add to the shared folder.",
                "parameters": [{
                    "name": "dropbox_id",
                    "type": "String(min_length=1)",
                    "desc": "Dropbox account, team member, or group ID of member."
                }, {
                    "name": "email",
                    "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
                    "desc": "E-mail address of member."
                }]
            }, {
                "name": "dropbox_id",
                "type": "String(min_length=1)",
                "desc": "Dropbox account, team member, or group ID of member."
            }, {
                "name": "email",
                "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
                "desc": "E-mail address of member."
            }, {
                "name": "access_level",
                "type": "AccessLevel",
                "desc": "The access level to grant member to the shared folder.  AccessLevel.owner is disallowed. The default for this union is viewer.",
                "parameters": [{
                    "name": "owner",
                    "type": "Void",
                    "desc": "The collaborator is the owner of the shared folder. Owners can view and edit the shared folder as well as set the folder's policies using  ."
                }, {
                    "name": "editor",
                    "type": "Void",
                    "desc": "The collaborator can both view and edit the shared folder."
                }, {
                    "name": "viewer",
                    "type": "Void",
                    "desc": "The collaborator can only view the shared folder."
                }, {
                    "name": "viewer_no_comment",
                    "type": "Void",
                    "desc": "The collaborator can only view the shared folder and does not have any access to comments."
                }]
            }, {
                "name": "owner",
                "type": "Void",
                "desc": "The collaborator is the owner of the shared folder. Owners can view and edit the shared folder as well as set the folder's policies using  ."
            }, {
                "name": "editor",
                "type": "Void",
                "desc": "The collaborator can both view and edit the shared folder."
            }, {
                "name": "viewer",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder."
            }, {
                "name": "viewer_no_comment",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder and does not have any access to comments."
            }, {
                "name": "dropbox_id",
                "type": "String(min_length=1)",
                "desc": "Dropbox account, team member, or group ID of member."
            }, {
                "name": "email",
                "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
                "desc": "E-mail address of member."
            }, {
                "name": "owner",
                "type": "Void",
                "desc": "The collaborator is the owner of the shared folder. Owners can view and edit the shared folder as well as set the folder's policies using  ."
            }, {
                "name": "editor",
                "type": "Void",
                "desc": "The collaborator can both view and edit the shared folder."
            }, {
                "name": "viewer",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder."
            }, {
                "name": "viewer_no_comment",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder and does not have any access to comments."
            }]
        }, {
            "name": "member",
            "type": "MemberSelector",
            "desc": "The member to add to the shared folder.",
            "parameters": [{
                "name": "dropbox_id",
                "type": "String(min_length=1)",
                "desc": "Dropbox account, team member, or group ID of member."
            }, {
                "name": "email",
                "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
                "desc": "E-mail address of member."
            }]
        }, {
            "name": "dropbox_id",
            "type": "String(min_length=1)",
            "desc": "Dropbox account, team member, or group ID of member."
        }, {
            "name": "email",
            "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
            "desc": "E-mail address of member."
        }, {
            "name": "access_level",
            "type": "AccessLevel",
            "desc": "The access level to grant member to the shared folder.  AccessLevel.owner is disallowed. The default for this union is viewer.",
            "parameters": [{
                "name": "owner",
                "type": "Void",
                "desc": "The collaborator is the owner of the shared folder. Owners can view and edit the shared folder as well as set the folder's policies using  ."
            }, {
                "name": "editor",
                "type": "Void",
                "desc": "The collaborator can both view and edit the shared folder."
            }, {
                "name": "viewer",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder."
            }, {
                "name": "viewer_no_comment",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder and does not have any access to comments."
            }]
        }, {
            "name": "owner",
            "type": "Void",
            "desc": "The collaborator is the owner of the shared folder. Owners can view and edit the shared folder as well as set the folder's policies using  ."
        }, {
            "name": "editor",
            "type": "Void",
            "desc": "The collaborator can both view and edit the shared folder."
        }, {
            "name": "viewer",
            "type": "Void",
            "desc": "The collaborator can only view the shared folder."
        }, {
            "name": "viewer_no_comment",
            "type": "Void",
            "desc": "The collaborator can only view the shared folder and does not have any access to comments."
        }, {
            "name": "quiet",
            "type": "Boolean",
            "desc": "Whether added members should be notified via email and device notifications of their invite. The default for this field is False."
        }, {
            "name": "custom_message",
            "type": "String(min_length=1)?",
            "desc": "Optional message to display to added members in their invitation. This field is optional."
        }],
        "returnParameters": []
    },
    "sharing/change_file_member_access": {
        "uri": "https://api.dropboxapi.com/2/sharing/change_file_member_access",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "file": "id:3kmLmQFnf1AAAAAAAAAAAw",
            "member": {
                ".tag": "email",
                "email": "justin@example.com"
            },
            "access_level": "viewer_no_comment"
        },
        "parameters": [{
            "name": "file",
            "type": "String(min_length=1, pattern=\"((/|id:).*|nspath:[^:]*:[^:]*)\")",
            "desc": "File for which we are changing a member's access."
        }, {
            "name": "member",
            "type": "MemberSelector",
            "desc": "The member whose access we are changing.",
            "parameters": [{
                "name": "dropbox_id",
                "type": "String(min_length=1)",
                "desc": "Dropbox account, team member, or group ID of member."
            }, {
                "name": "email",
                "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
                "desc": "E-mail address of member."
            }]
        }, {
            "name": "dropbox_id",
            "type": "String(min_length=1)",
            "desc": "Dropbox account, team member, or group ID of member."
        }, {
            "name": "email",
            "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
            "desc": "E-mail address of member."
        }, {
            "name": "access_level",
            "type": "AccessLevel",
            "desc": "The new access level for the member.",
            "parameters": [{
                "name": "owner",
                "type": "Void",
                "desc": "The collaborator is the owner of the shared folder. Owners can view and edit the shared folder as well as set the folder's policies using  ."
            }, {
                "name": "editor",
                "type": "Void",
                "desc": "The collaborator can both view and edit the shared folder."
            }, {
                "name": "viewer",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder."
            }, {
                "name": "viewer_no_comment",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder and does not have any access to comments."
            }]
        }, {
            "name": "owner",
            "type": "Void",
            "desc": "The collaborator is the owner of the shared folder. Owners can view and edit the shared folder as well as set the folder's policies using  ."
        }, {
            "name": "editor",
            "type": "Void",
            "desc": "The collaborator can both view and edit the shared folder."
        }, {
            "name": "viewer",
            "type": "Void",
            "desc": "The collaborator can only view the shared folder."
        }, {
            "name": "viewer_no_comment",
            "type": "Void",
            "desc": "The collaborator can only view the shared folder and does not have any access to comments."
        }],
        "returnParameters": []
    },
    "sharing/check_job_status": {
        "uri": "https://api.dropboxapi.com/2/sharing/check_job_status",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "async_job_id": "34g93hh34h04y384084"
        },
        "parameters": [{
            "name": "async_job_id",
            "type": "String(min_length=1)",
            "desc": "Id of the asynchronous job. This is the value of a response returned from the method that launched the job."
        }],
        "returnParameters": []
    },
    "sharing/check_remove_member_job_status": {
        "uri": "https://api.dropboxapi.com/2/sharing/check_remove_member_job_status",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "async_job_id": "34g93hh34h04y384084"
        },
        "parameters": [{
            "name": "async_job_id",
            "type": "String(min_length=1)",
            "desc": "Id of the asynchronous job. This is the value of a response returned from the method that launched the job."
        }],
        "returnParameters": []
    },
    "sharing/check_share_job_status": {
        "uri": "https://api.dropboxapi.com/2/sharing/check_share_job_status",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "async_job_id": "34g93hh34h04y384084"
        },
        "parameters": [{
            "name": "async_job_id",
            "type": "String(min_length=1)",
            "desc": "Id of the asynchronous job. This is the value of a response returned from the method that launched the job."
        }],
        "returnParameters": []
    },
    "sharing/create_shared_link": {
        "uri": "https://api.dropboxapi.com/2/sharing/create_shared_link",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/Homework/Math/Prime_Numbers.txt",
            "short_url": false
        },
        "parameters": [{
            "name": "path",
            "type": "String",
            "desc": "The path to share."
        }, {
            "name": "short_url",
            "type": "Boolean",
            "desc": "Whether to return a shortened URL. The default for this field is False."
        }, {
            "name": "pending_upload",
            "type": "PendingUploadMode?",
            "desc": "If it's okay to share a path that does not yet exist, set this to either PendingUploadMode.file or PendingUploadMode.folder to indicate whether to assume it's a file or folder. This field is optional.",
            "parameters": [{
                "name": "file",
                "type": "Void",
                "desc": "Assume pending uploads are files."
            }, {
                "name": "folder",
                "type": "Void",
                "desc": "Assume pending uploads are folders."
            }]
        }, {
            "name": "file",
            "type": "Void",
            "desc": "Assume pending uploads are files."
        }, {
            "name": "folder",
            "type": "Void",
            "desc": "Assume pending uploads are folders."
        }],
        "returnParameters": []
    },
    "sharing/create_shared_link_with_settings": {
        "uri": "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/Prime_Numbers.txt",
            "settings": {
                "requested_visibility": "public"
            }
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*|id:.*)|(rev:[0-9a-f]{9,})|(ns:[0-9]+(/.*)?)\")",
            "desc": "The path to be shared by the shared link"
        }, {
            "name": "settings",
            "type": "SharedLinkSettings?",
            "desc": "The requested settings for the newly created shared link This field is optional.",
            "parameters": [{
                "name": "requested_visibility",
                "type": "RequestedVisibility?",
                "desc": "The requested access for this shared link. This field is optional.",
                "parameters": [{
                    "name": "public",
                    "type": "Void",
                    "desc": "Anyone who has received the link can access it. No login required."
                }, {
                    "name": "team_only",
                    "type": "Void",
                    "desc": "Only members of the same team can access the link. Login is required."
                }, {
                    "name": "password",
                    "type": "Void",
                    "desc": "A link-specific password is required to access the link. Login is not required."
                }]
            }, {
                "name": "public",
                "type": "Void",
                "desc": "Anyone who has received the link can access it. No login required."
            }, {
                "name": "team_only",
                "type": "Void",
                "desc": "Only members of the same team can access the link. Login is required."
            }, {
                "name": "password",
                "type": "Void",
                "desc": "A link-specific password is required to access the link. Login is not required."
            }, {
                "name": "link_password",
                "type": "String?",
                "desc": "If requested_visibility is RequestedVisibility.password this is needed to specify the password to access the link. This field is optional."
            }, {
                "name": "expires",
                "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
                "desc": "Expiration time of the shared link. By default the link won't expire. This field is optional."
            }, {
                "name": "public",
                "type": "Void",
                "desc": "Anyone who has received the link can access it. No login required."
            }, {
                "name": "team_only",
                "type": "Void",
                "desc": "Only members of the same team can access the link. Login is required."
            }, {
                "name": "password",
                "type": "Void",
                "desc": "A link-specific password is required to access the link. Login is not required."
            }]
        }, {
            "name": "requested_visibility",
            "type": "RequestedVisibility?",
            "desc": "The requested access for this shared link. This field is optional.",
            "parameters": [{
                "name": "public",
                "type": "Void",
                "desc": "Anyone who has received the link can access it. No login required."
            }, {
                "name": "team_only",
                "type": "Void",
                "desc": "Only members of the same team can access the link. Login is required."
            }, {
                "name": "password",
                "type": "Void",
                "desc": "A link-specific password is required to access the link. Login is not required."
            }]
        }, {
            "name": "public",
            "type": "Void",
            "desc": "Anyone who has received the link can access it. No login required."
        }, {
            "name": "team_only",
            "type": "Void",
            "desc": "Only members of the same team can access the link. Login is required."
        }, {
            "name": "password",
            "type": "Void",
            "desc": "A link-specific password is required to access the link. Login is not required."
        }, {
            "name": "link_password",
            "type": "String?",
            "desc": "If requested_visibility is RequestedVisibility.password this is needed to specify the password to access the link. This field is optional."
        }, {
            "name": "expires",
            "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
            "desc": "Expiration time of the shared link. By default the link won't expire. This field is optional."
        }],
        "returnParameters": []
    },
    "sharing/get_file_metadata": {
        "uri": "https://api.dropboxapi.com/2/sharing/get_file_metadata",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "file": "id:3kmLmQFnf1AAAAAAAAAAAw",
            "actions": []
        },
        "parameters": [{
            "name": "file",
            "type": "String(min_length=1, pattern=\"((/|id:).*|nspath:[^:]*:[^:]*)\")",
            "desc": "The file to query."
        }, {
            "name": "actions",
            "type": "List of (FileAction, )?",
            "desc": "File actions to query. This field is optional.",
            "parameters": [{
                "name": "edit_contents",
                "type": "Void",
                "desc": "Change or edit contents of the file."
            }, {
                "name": "invite_viewer",
                "type": "Void",
                "desc": "Add a member with view permissions."
            }, {
                "name": "invite_viewer_no_comment",
                "type": "Void",
                "desc": "Add a member with view permissions but no comment permissions."
            }, {
                "name": "unshare",
                "type": "Void",
                "desc": "Stop sharing this file."
            }, {
                "name": "relinquish_membership",
                "type": "Void",
                "desc": "Relinquish one's own membership to the file."
            }, {
                "name": "share_link",
                "type": "Void",
                "desc": "Create a shared link to the file."
            }]
        }, {
            "name": "edit_contents",
            "type": "Void",
            "desc": "Change or edit contents of the file."
        }, {
            "name": "invite_viewer",
            "type": "Void",
            "desc": "Add a member with view permissions."
        }, {
            "name": "invite_viewer_no_comment",
            "type": "Void",
            "desc": "Add a member with view permissions but no comment permissions."
        }, {
            "name": "unshare",
            "type": "Void",
            "desc": "Stop sharing this file."
        }, {
            "name": "relinquish_membership",
            "type": "Void",
            "desc": "Relinquish one's own membership to the file."
        }, {
            "name": "share_link",
            "type": "Void",
            "desc": "Create a shared link to the file."
        }],
        "returnParameters": []
    },
    "sharing/get_file_metadata/batch": {
        "uri": "https://api.dropboxapi.com/2/sharing/get_file_metadata/batch",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "files": [
                "id:3kmLmQFnf1AAAAAAAAAAAw",
                "id:VvTaJu2VZzAAAAAAAAAADQ"
            ],
            "actions": []
        },
        "parameters": [{
            "name": "files",
            "type": "List of (String(min_length=1, pattern=\"((/|id:).*|nspath:[^:]*:[^:]*)\"), max_items=100)",
            "desc": "The files to query."
        }, {
            "name": "actions",
            "type": "List of (FileAction, )?",
            "desc": "File actions to query. This field is optional.",
            "parameters": [{
                "name": "edit_contents",
                "type": "Void",
                "desc": "Change or edit contents of the file."
            }, {
                "name": "invite_viewer",
                "type": "Void",
                "desc": "Add a member with view permissions."
            }, {
                "name": "invite_viewer_no_comment",
                "type": "Void",
                "desc": "Add a member with view permissions but no comment permissions."
            }, {
                "name": "unshare",
                "type": "Void",
                "desc": "Stop sharing this file."
            }, {
                "name": "relinquish_membership",
                "type": "Void",
                "desc": "Relinquish one's own membership to the file."
            }, {
                "name": "share_link",
                "type": "Void",
                "desc": "Create a shared link to the file."
            }]
        }, {
            "name": "edit_contents",
            "type": "Void",
            "desc": "Change or edit contents of the file."
        }, {
            "name": "invite_viewer",
            "type": "Void",
            "desc": "Add a member with view permissions."
        }, {
            "name": "invite_viewer_no_comment",
            "type": "Void",
            "desc": "Add a member with view permissions but no comment permissions."
        }, {
            "name": "unshare",
            "type": "Void",
            "desc": "Stop sharing this file."
        }, {
            "name": "relinquish_membership",
            "type": "Void",
            "desc": "Relinquish one's own membership to the file."
        }, {
            "name": "share_link",
            "type": "Void",
            "desc": "Create a shared link to the file."
        }],
        "returnParameters": []
    },
    "sharing/get_folder_metadata": {
        "uri": "https://api.dropboxapi.com/2/sharing/get_folder_metadata",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "shared_folder_id": "84528192421",
            "actions": []
        },
        "parameters": [{
            "name": "shared_folder_id",
            "type": "String(pattern=\"[-_0-9a-zA-Z:]+\")",
            "desc": "The ID for the shared folder."
        }, {
            "name": "actions",
            "type": "List of (FolderAction, )?",
            "desc": "This is a list indicating whether the returned folder data will include a boolean value  FolderPermission.allow that describes whether the current user can perform the  FolderAction on the folder. This field is optional.",
            "parameters": [{
                "name": "change_options",
                "type": "Void",
                "desc": "Change folder options, such as who can be invited to join the folder."
            }, {
                "name": "edit_contents",
                "type": "Void",
                "desc": "Change or edit contents of the folder."
            }, {
                "name": "invite_editor",
                "type": "Void",
                "desc": "Invite a user or group to join the folder with read and write permission."
            }, {
                "name": "invite_viewer",
                "type": "Void",
                "desc": "Invite a user or group to join the folder with read permission."
            }, {
                "name": "invite_viewer_no_comment",
                "type": "Void",
                "desc": "Invite a user or group to join the folder with read permission but no comment permissions."
            }, {
                "name": "relinquish_membership",
                "type": "Void",
                "desc": "Relinquish one's own membership in the folder."
            }, {
                "name": "unmount",
                "type": "Void",
                "desc": "Unmount the folder."
            }, {
                "name": "unshare",
                "type": "Void",
                "desc": "Stop sharing this folder."
            }, {
                "name": "leave_a_copy",
                "type": "Void",
                "desc": "Keep a copy of the contents upon leaving or being kicked from the folder."
            }, {
                "name": "share_link",
                "type": "Void",
                "desc": "Create a shared link for folder."
            }]
        }, {
            "name": "change_options",
            "type": "Void",
            "desc": "Change folder options, such as who can be invited to join the folder."
        }, {
            "name": "edit_contents",
            "type": "Void",
            "desc": "Change or edit contents of the folder."
        }, {
            "name": "invite_editor",
            "type": "Void",
            "desc": "Invite a user or group to join the folder with read and write permission."
        }, {
            "name": "invite_viewer",
            "type": "Void",
            "desc": "Invite a user or group to join the folder with read permission."
        }, {
            "name": "invite_viewer_no_comment",
            "type": "Void",
            "desc": "Invite a user or group to join the folder with read permission but no comment permissions."
        }, {
            "name": "relinquish_membership",
            "type": "Void",
            "desc": "Relinquish one's own membership in the folder."
        }, {
            "name": "unmount",
            "type": "Void",
            "desc": "Unmount the folder."
        }, {
            "name": "unshare",
            "type": "Void",
            "desc": "Stop sharing this folder."
        }, {
            "name": "leave_a_copy",
            "type": "Void",
            "desc": "Keep a copy of the contents upon leaving or being kicked from the folder."
        }, {
            "name": "share_link",
            "type": "Void",
            "desc": "Create a shared link for folder."
        }],
        "returnParameters": []
    },
    "sharing/get_shared_link_file": {
        "uri": "https://content.dropboxapi.com/2/sharing/get_shared_link_file",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "CONTENT",
        "testParams": {
            "url": "https://www.dropbox.com/s/2sn712vy1ovegw8/Prime_Numbers.txt?dl=0",
            "path": "/Prime_Numbers.txt"
        },
        "parameters": [{
            "name": "url",
            "type": "String",
            "desc": "URL of the shared link."
        }, {
            "name": "path",
            "type": "String(pattern=\"/(.|[\\r\\n])*\")?",
            "desc": "If the shared link is to a folder, this parameter can be used to retrieve the metadata for a specific file or sub-folder in this folder. A relative path should be used. This field is optional."
        }, {
            "name": "link_password",
            "type": "String?",
            "desc": "If the shared link has a password, this parameter can be used. This field is optional."
        }],
        "returnParameters": []
    },
    "sharing/get_shared_link_metadata": {
        "uri": "https://api.dropboxapi.com/2/sharing/get_shared_link_metadata",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "url": "https://www.dropbox.com/s/2sn712vy1ovegw8/Prime_Numbers.txt?dl=0",
            "path": "/Prime_Numbers.txt"
        },
        "parameters": [{
            "name": "url",
            "type": "String",
            "desc": "URL of the shared link."
        }, {
            "name": "path",
            "type": "String(pattern=\"/(.|[\\r\\n])*\")?",
            "desc": "If the shared link is to a folder, this parameter can be used to retrieve the metadata for a specific file or sub-folder in this folder. A relative path should be used. This field is optional."
        }, {
            "name": "link_password",
            "type": "String?",
            "desc": "If the shared link has a password, this parameter can be used. This field is optional."
        }],
        "returnParameters": []
    },
    "sharing/get_shared_links": {
        "uri": "https://api.dropboxapi.com/2/sharing/get_shared_links",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": ""
        },
        "parameters": [{
            "name": "path",
            "type": "String?",
            "desc": "See   description. This field is optional."
        }],
        "returnParameters": []
    },
    "sharing/list_file_members": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_file_members",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "file": "id:3kmLmQFnf1AAAAAAAAAAAw",
            "include_inherited": true,
            "limit": 100
        },
        "parameters": [{
            "name": "file",
            "type": "String(min_length=1, pattern=\"((/|id:).*|nspath:[^:]*:[^:]*)\")",
            "desc": "The file for which you want to see members."
        }, {
            "name": "actions",
            "type": "List of (MemberAction, )?",
            "desc": "The actions for which to return permissions on a member This field is optional.",
            "parameters": [{
                "name": "leave_a_copy",
                "type": "Void",
                "desc": "Allow the member to keep a copy of the folder when removing."
            }, {
                "name": "make_editor",
                "type": "Void",
                "desc": "Make the member an editor of the folder."
            }, {
                "name": "make_owner",
                "type": "Void",
                "desc": "Make the member an owner of the folder."
            }, {
                "name": "make_viewer",
                "type": "Void",
                "desc": "Make the member a viewer of the folder."
            }, {
                "name": "make_viewer_no_comment",
                "type": "Void",
                "desc": "Make the member a viewer of the folder without commenting permissions."
            }, {
                "name": "remove",
                "type": "Void",
                "desc": "Remove the member from the folder."
            }]
        }, {
            "name": "leave_a_copy",
            "type": "Void",
            "desc": "Allow the member to keep a copy of the folder when removing."
        }, {
            "name": "make_editor",
            "type": "Void",
            "desc": "Make the member an editor of the folder."
        }, {
            "name": "make_owner",
            "type": "Void",
            "desc": "Make the member an owner of the folder."
        }, {
            "name": "make_viewer",
            "type": "Void",
            "desc": "Make the member a viewer of the folder."
        }, {
            "name": "make_viewer_no_comment",
            "type": "Void",
            "desc": "Make the member a viewer of the folder without commenting permissions."
        }, {
            "name": "remove",
            "type": "Void",
            "desc": "Remove the member from the folder."
        }, {
            "name": "include_inherited",
            "type": "Boolean",
            "desc": "Whether to include members who only have access from a parent shared folder. The default for this field is True."
        }, {
            "name": "limit",
            "type": "UInt32",
            "desc": "Number of members to return max per query. Defaults to 100 if no limit is specified. The default for this field is 100."
        }],
        "returnParameters": []
    },
    "sharing/list_file_members/batch": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_file_members/batch",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "files": [
                "id:3kmLmQFnf1AAAAAAAAAAAw",
                "id:VvTaJu2VZzAAAAAAAAAADQ"
            ],
            "limit": 10
        },
        "parameters": [{
            "name": "files",
            "type": "List of (String(min_length=1, pattern=\"((/|id:).*|nspath:[^:]*:[^:]*)\"), max_items=100)",
            "desc": "Files for which to return members."
        }, {
            "name": "limit",
            "type": "UInt32",
            "desc": "Number of members to return max per query. Defaults to 10 if no limit is specified. The default for this field is 10."
        }],
        "returnParameters": []
    },
    "sharing/list_file_members/continue": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_file_members/continue",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "cursor": "ZtkX9_EHj3x7PMkVuFIhwKYXEpwpLwyxp9vMKomUhllil9q7eWiAu"
        },
        "parameters": [{
            "name": "cursor",
            "type": "String",
            "desc": "The cursor returned by your last call to  list_file_members or list_file_members/batch."
        }],
        "returnParameters": []
    },
    "sharing/list_folder_members": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_folder_members",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "shared_folder_id": "84528192421",
            "actions": [],
            "limit": 10
        },
        "parameters": [{
            "name": "shared_folder_id",
            "type": "String(pattern=\"[-_0-9a-zA-Z:]+\")",
            "desc": "The ID for the shared folder."
        }, {
            "name": "actions",
            "type": "List of (MemberAction, )?",
            "desc": "This is a list indicating whether each returned member will include a boolean value MemberPermission.allow that describes whether the current user can perform the MemberAction on the member. This field is optional.",
            "parameters": [{
                "name": "leave_a_copy",
                "type": "Void",
                "desc": "Allow the member to keep a copy of the folder when removing."
            }, {
                "name": "make_editor",
                "type": "Void",
                "desc": "Make the member an editor of the folder."
            }, {
                "name": "make_owner",
                "type": "Void",
                "desc": "Make the member an owner of the folder."
            }, {
                "name": "make_viewer",
                "type": "Void",
                "desc": "Make the member a viewer of the folder."
            }, {
                "name": "make_viewer_no_comment",
                "type": "Void",
                "desc": "Make the member a viewer of the folder without commenting permissions."
            }, {
                "name": "remove",
                "type": "Void",
                "desc": "Remove the member from the folder."
            }]
        }, {
            "name": "leave_a_copy",
            "type": "Void",
            "desc": "Allow the member to keep a copy of the folder when removing."
        }, {
            "name": "make_editor",
            "type": "Void",
            "desc": "Make the member an editor of the folder."
        }, {
            "name": "make_owner",
            "type": "Void",
            "desc": "Make the member an owner of the folder."
        }, {
            "name": "make_viewer",
            "type": "Void",
            "desc": "Make the member a viewer of the folder."
        }, {
            "name": "make_viewer_no_comment",
            "type": "Void",
            "desc": "Make the member a viewer of the folder without commenting permissions."
        }, {
            "name": "remove",
            "type": "Void",
            "desc": "Remove the member from the folder."
        }, {
            "name": "limit",
            "type": "UInt32",
            "desc": "The maximum number of results that include members, groups and invitees to return per request. The default for this field is 1000."
        }],
        "returnParameters": []
    },
    "sharing/list_folder_members/continue": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_folder_members/continue",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "cursor": "ZtkX9_EHj3x7PMkVuFIhwKYXEpwpLwyxp9vMKomUhllil9q7eWiAu"
        },
        "parameters": [{
            "name": "cursor",
            "type": "String",
            "desc": "The cursor returned by your last call to list_folder_members."
        }],
        "returnParameters": []
    },
    "sharing/list_folders": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_folders",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "limit": 100,
            "actions": []
        },
        "parameters": [{
            "name": "limit",
            "type": "UInt32",
            "desc": "The maximum number of results to return per request. The default for this field is 1000."
        }, {
            "name": "actions",
            "type": "List of (FolderAction, )?",
            "desc": "This is a list indicating whether each returned folder data entry will include a boolean field FolderPermission.allow that describes whether the current user can perform the `FolderAction` on the folder. This field is optional.",
            "parameters": [{
                "name": "change_options",
                "type": "Void",
                "desc": "Change folder options, such as who can be invited to join the folder."
            }, {
                "name": "edit_contents",
                "type": "Void",
                "desc": "Change or edit contents of the folder."
            }, {
                "name": "invite_editor",
                "type": "Void",
                "desc": "Invite a user or group to join the folder with read and write permission."
            }, {
                "name": "invite_viewer",
                "type": "Void",
                "desc": "Invite a user or group to join the folder with read permission."
            }, {
                "name": "invite_viewer_no_comment",
                "type": "Void",
                "desc": "Invite a user or group to join the folder with read permission but no comment permissions."
            }, {
                "name": "relinquish_membership",
                "type": "Void",
                "desc": "Relinquish one's own membership in the folder."
            }, {
                "name": "unmount",
                "type": "Void",
                "desc": "Unmount the folder."
            }, {
                "name": "unshare",
                "type": "Void",
                "desc": "Stop sharing this folder."
            }, {
                "name": "leave_a_copy",
                "type": "Void",
                "desc": "Keep a copy of the contents upon leaving or being kicked from the folder."
            }, {
                "name": "share_link",
                "type": "Void",
                "desc": "Create a shared link for folder."
            }]
        }, {
            "name": "change_options",
            "type": "Void",
            "desc": "Change folder options, such as who can be invited to join the folder."
        }, {
            "name": "edit_contents",
            "type": "Void",
            "desc": "Change or edit contents of the folder."
        }, {
            "name": "invite_editor",
            "type": "Void",
            "desc": "Invite a user or group to join the folder with read and write permission."
        }, {
            "name": "invite_viewer",
            "type": "Void",
            "desc": "Invite a user or group to join the folder with read permission."
        }, {
            "name": "invite_viewer_no_comment",
            "type": "Void",
            "desc": "Invite a user or group to join the folder with read permission but no comment permissions."
        }, {
            "name": "relinquish_membership",
            "type": "Void",
            "desc": "Relinquish one's own membership in the folder."
        }, {
            "name": "unmount",
            "type": "Void",
            "desc": "Unmount the folder."
        }, {
            "name": "unshare",
            "type": "Void",
            "desc": "Stop sharing this folder."
        }, {
            "name": "leave_a_copy",
            "type": "Void",
            "desc": "Keep a copy of the contents upon leaving or being kicked from the folder."
        }, {
            "name": "share_link",
            "type": "Void",
            "desc": "Create a shared link for folder."
        }],
        "returnParameters": []
    },
    "sharing/list_folders/continue": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_folders/continue",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "cursor": "ZtkX9_EHj3x7PMkVuFIhwKYXEpwpLwyxp9vMKomUhllil9q7eWiAu"
        },
        "parameters": [{
            "name": "cursor",
            "type": "String",
            "desc": "The cursor returned by the previous API call specified in the endpoint description."
        }],
        "returnParameters": []
    },
    "sharing/list_mountable_folders": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_mountable_folders",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "limit": 100,
            "actions": []
        },
        "parameters": [{
            "name": "limit",
            "type": "UInt32",
            "desc": "The maximum number of results to return per request. The default for this field is 1000."
        }, {
            "name": "actions",
            "type": "List of (FolderAction, )?",
            "desc": "This is a list indicating whether each returned folder data entry will include a boolean field FolderPermission.allow that describes whether the current user can perform the `FolderAction` on the folder. This field is optional.",
            "parameters": [{
                "name": "change_options",
                "type": "Void",
                "desc": "Change folder options, such as who can be invited to join the folder."
            }, {
                "name": "edit_contents",
                "type": "Void",
                "desc": "Change or edit contents of the folder."
            }, {
                "name": "invite_editor",
                "type": "Void",
                "desc": "Invite a user or group to join the folder with read and write permission."
            }, {
                "name": "invite_viewer",
                "type": "Void",
                "desc": "Invite a user or group to join the folder with read permission."
            }, {
                "name": "invite_viewer_no_comment",
                "type": "Void",
                "desc": "Invite a user or group to join the folder with read permission but no comment permissions."
            }, {
                "name": "relinquish_membership",
                "type": "Void",
                "desc": "Relinquish one's own membership in the folder."
            }, {
                "name": "unmount",
                "type": "Void",
                "desc": "Unmount the folder."
            }, {
                "name": "unshare",
                "type": "Void",
                "desc": "Stop sharing this folder."
            }, {
                "name": "leave_a_copy",
                "type": "Void",
                "desc": "Keep a copy of the contents upon leaving or being kicked from the folder."
            }, {
                "name": "share_link",
                "type": "Void",
                "desc": "Create a shared link for folder."
            }]
        }, {
            "name": "change_options",
            "type": "Void",
            "desc": "Change folder options, such as who can be invited to join the folder."
        }, {
            "name": "edit_contents",
            "type": "Void",
            "desc": "Change or edit contents of the folder."
        }, {
            "name": "invite_editor",
            "type": "Void",
            "desc": "Invite a user or group to join the folder with read and write permission."
        }, {
            "name": "invite_viewer",
            "type": "Void",
            "desc": "Invite a user or group to join the folder with read permission."
        }, {
            "name": "invite_viewer_no_comment",
            "type": "Void",
            "desc": "Invite a user or group to join the folder with read permission but no comment permissions."
        }, {
            "name": "relinquish_membership",
            "type": "Void",
            "desc": "Relinquish one's own membership in the folder."
        }, {
            "name": "unmount",
            "type": "Void",
            "desc": "Unmount the folder."
        }, {
            "name": "unshare",
            "type": "Void",
            "desc": "Stop sharing this folder."
        }, {
            "name": "leave_a_copy",
            "type": "Void",
            "desc": "Keep a copy of the contents upon leaving or being kicked from the folder."
        }, {
            "name": "share_link",
            "type": "Void",
            "desc": "Create a shared link for folder."
        }],
        "returnParameters": []
    },
    "sharing/list_mountable_folders/continue": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_mountable_folders/continue",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "cursor": "ZtkX9_EHj3x7PMkVuFIhwKYXEpwpLwyxp9vMKomUhllil9q7eWiAu"
        },
        "parameters": [{
            "name": "cursor",
            "type": "String",
            "desc": "The cursor returned by the previous API call specified in the endpoint description."
        }],
        "returnParameters": []
    },
    "sharing/list_received_files": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_received_files",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "limit": 100,
            "actions": []
        },
        "parameters": [{
            "name": "limit",
            "type": "UInt32",
            "desc": "Number of files to return max per query. Defaults to 100 if no limit is specified. The default for this field is 100."
        }, {
            "name": "actions",
            "type": "List of (FileAction, )?",
            "desc": "File actions to query. This field is optional.",
            "parameters": [{
                "name": "edit_contents",
                "type": "Void",
                "desc": "Change or edit contents of the file."
            }, {
                "name": "invite_viewer",
                "type": "Void",
                "desc": "Add a member with view permissions."
            }, {
                "name": "invite_viewer_no_comment",
                "type": "Void",
                "desc": "Add a member with view permissions but no comment permissions."
            }, {
                "name": "unshare",
                "type": "Void",
                "desc": "Stop sharing this file."
            }, {
                "name": "relinquish_membership",
                "type": "Void",
                "desc": "Relinquish one's own membership to the file."
            }, {
                "name": "share_link",
                "type": "Void",
                "desc": "Create a shared link to the file."
            }]
        }, {
            "name": "edit_contents",
            "type": "Void",
            "desc": "Change or edit contents of the file."
        }, {
            "name": "invite_viewer",
            "type": "Void",
            "desc": "Add a member with view permissions."
        }, {
            "name": "invite_viewer_no_comment",
            "type": "Void",
            "desc": "Add a member with view permissions but no comment permissions."
        }, {
            "name": "unshare",
            "type": "Void",
            "desc": "Stop sharing this file."
        }, {
            "name": "relinquish_membership",
            "type": "Void",
            "desc": "Relinquish one's own membership to the file."
        }, {
            "name": "share_link",
            "type": "Void",
            "desc": "Create a shared link to the file."
        }],
        "returnParameters": []
    },
    "sharing/list_received_files/continue": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_received_files/continue",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "cursor": "AzJJbGlzdF90eXBdofe9c3RPbGlzdGFyZ3NfYnlfZ2lkMRhcbric7Rdog9emfGRlc2MCRWxpbWl0BGRId"
        },
        "parameters": [{
            "name": "cursor",
            "type": "String",
            "desc": "Cursor in ListFilesResult.cursor"
        }],
        "returnParameters": []
    },
    "sharing/list_shared_links": {
        "uri": "https://api.dropboxapi.com/2/sharing/list_shared_links",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams":

        {
            "cursor": "ZtkX9_EHj3x7PMkVuFIhwKYXEpwpLwyxp9vMKomUhllil9q7eWiAu"
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"(/(.|[\\r\\n])*|id:.*)|(rev:[0-9a-f]{9,})|(ns:[0-9]+(/.*)?)\")?",
            "desc": "See   description. This field is optional."
        }, {
            "name": "cursor",
            "type": "String?",
            "desc": "The cursor returned by your last call to  . This field is optional."
        }, {
            "name": "direct_only",
            "type": "Boolean?",
            "desc": "See   description. This field is optional."
        }],
        "returnParameters": []
    },
    "sharing/modify_shared_link_settings": {
        "uri": "https://api.dropboxapi.com/2/sharing/modify_shared_link_settings",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "url": "https://www.dropbox.com/s/2sn712vy1ovegw8/Prime_Numbers.txt?dl=0",
            "settings": {
                "requested_visibility": "public"
            },
            "remove_expiration": false
        },
        "parameters": [{
            "name": "url",
            "type": "String",
            "desc": "URL of the shared link to change its settings"
        }, {
            "name": "settings",
            "type": "SharedLinkSettings",
            "desc": "Set of settings for the shared link.",
            "parameters": [{
                "name": "requested_visibility",
                "type": "RequestedVisibility?",
                "desc": "The requested access for this shared link. This field is optional.",
                "parameters": [{
                    "name": "public",
                    "type": "Void",
                    "desc": "Anyone who has received the link can access it. No login required."
                }, {
                    "name": "team_only",
                    "type": "Void",
                    "desc": "Only members of the same team can access the link. Login is required."
                }, {
                    "name": "password",
                    "type": "Void",
                    "desc": "A link-specific password is required to access the link. Login is not required."
                }]
            }, {
                "name": "public",
                "type": "Void",
                "desc": "Anyone who has received the link can access it. No login required."
            }, {
                "name": "team_only",
                "type": "Void",
                "desc": "Only members of the same team can access the link. Login is required."
            }, {
                "name": "password",
                "type": "Void",
                "desc": "A link-specific password is required to access the link. Login is not required."
            }, {
                "name": "link_password",
                "type": "String?",
                "desc": "If requested_visibility is RequestedVisibility.password this is needed to specify the password to access the link. This field is optional."
            }, {
                "name": "expires",
                "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
                "desc": "Expiration time of the shared link. By default the link won't expire. This field is optional."
            }, {
                "name": "public",
                "type": "Void",
                "desc": "Anyone who has received the link can access it. No login required."
            }, {
                "name": "team_only",
                "type": "Void",
                "desc": "Only members of the same team can access the link. Login is required."
            }, {
                "name": "password",
                "type": "Void",
                "desc": "A link-specific password is required to access the link. Login is not required."
            }]
        }, {
            "name": "requested_visibility",
            "type": "RequestedVisibility?",
            "desc": "The requested access for this shared link. This field is optional.",
            "parameters": [{
                "name": "public",
                "type": "Void",
                "desc": "Anyone who has received the link can access it. No login required."
            }, {
                "name": "team_only",
                "type": "Void",
                "desc": "Only members of the same team can access the link. Login is required."
            }, {
                "name": "password",
                "type": "Void",
                "desc": "A link-specific password is required to access the link. Login is not required."
            }]
        }, {
            "name": "public",
            "type": "Void",
            "desc": "Anyone who has received the link can access it. No login required."
        }, {
            "name": "team_only",
            "type": "Void",
            "desc": "Only members of the same team can access the link. Login is required."
        }, {
            "name": "password",
            "type": "Void",
            "desc": "A link-specific password is required to access the link. Login is not required."
        }, {
            "name": "link_password",
            "type": "String?",
            "desc": "If requested_visibility is RequestedVisibility.password this is needed to specify the password to access the link. This field is optional."
        }, {
            "name": "expires",
            "type": "Timestamp(format=\"%Y-%m-%dT%H:%M:%SZ\")?",
            "desc": "Expiration time of the shared link. By default the link won't expire. This field is optional."
        }, {
            "name": "remove_expiration",
            "type": "Boolean",
            "desc": "If set to true, removes the expiration of the shared link. The default for this field is False."
        }],
        "returnParameters": []
    },
    "sharing/mount_folder": {
        "uri": "https://api.dropboxapi.com/2/sharing/mount_folder",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "shared_folder_id": "84528192421"
        },
        "parameters": [{
            "name": "shared_folder_id",
            "type": "String(pattern=\"[-_0-9a-zA-Z:]+\")",
            "desc": "The ID of the shared folder to mount."
        }],
        "returnParameters": []
    },
    "sharing/relinquish_file_membership": {
        "uri": "https://api.dropboxapi.com/2/sharing/relinquish_file_membership",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "file": "id:3kmLmQFnf1AAAAAAAAAAAw"
        },
        "parameters": [{
            "name": "file",
            "type": "String(min_length=1, pattern=\"((/|id:).*|nspath:[^:]*:[^:]*)\")",
            "desc": "The path or id for the file."
        }],
        "returnParameters": []
    },
    "sharing/relinquish_folder_membership": {
        "uri": "https://api.dropboxapi.com/2/sharing/relinquish_folder_membership",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "shared_folder_id": "84528192421",
            "leave_a_copy": false
        },
        "parameters": [{
            "name": "shared_folder_id",
            "type": "String(pattern=\"[-_0-9a-zA-Z:]+\")",
            "desc": "The ID for the shared folder."
        }, {
            "name": "leave_a_copy",
            "type": "Boolean",
            "desc": "Keep a copy of the folder's contents upon relinquishing membership. The default for this field is False."
        }],
        "returnParameters": []
    },
    "sharing/remove_file_member": {
        "uri": "https://api.dropboxapi.com/2/sharing/remove_file_member",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "file": "id:3kmLmQFnf1AAAAAAAAAAAw",
            "member": {
                ".tag": "email",
                "email": "justin@example.com"
            }
        },
        "parameters": [{
            "name": "file",
            "type": "String(min_length=1, pattern=\"((/|id:).*|nspath:[^:]*:[^:]*)\")",
            "desc": "File from which to remove members."
        }, {
            "name": "member",
            "type": "MemberSelector",
            "desc": "Member to remove from this file. Note that even if an email is specified, it may result in the removal of a user (not an invitee) if the user's main account corresponds to that email address.",
            "parameters": [{
                "name": "dropbox_id",
                "type": "String(min_length=1)",
                "desc": "Dropbox account, team member, or group ID of member."
            }, {
                "name": "email",
                "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
                "desc": "E-mail address of member."
            }]
        }, {
            "name": "dropbox_id",
            "type": "String(min_length=1)",
            "desc": "Dropbox account, team member, or group ID of member."
        }, {
            "name": "email",
            "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
            "desc": "E-mail address of member."
        }],
        "returnParameters": []
    },
    "sharing/remove_file_member_2": {
        "uri": "https://api.dropboxapi.com/2/sharing/remove_file_member_2",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "file": "id:3kmLmQFnf1AAAAAAAAAAAw",
            "member": {
                ".tag": "email",
                "email": "justin@example.com"
            }
        },
        "parameters": [{
            "name": "file",
            "type": "String(min_length=1, pattern=\"((/|id:).*|nspath:[^:]*:[^:]*)\")",
            "desc": "File from which to remove members."
        }, {
            "name": "member",
            "type": "MemberSelector",
            "desc": "Member to remove from this file. Note that even if an email is specified, it may result in the removal of a user (not an invitee) if the user's main account corresponds to that email address.",
            "parameters": [{
                "name": "dropbox_id",
                "type": "String(min_length=1)",
                "desc": "Dropbox account, team member, or group ID of member."
            }, {
                "name": "email",
                "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
                "desc": "E-mail address of member."
            }]
        }, {
            "name": "dropbox_id",
            "type": "String(min_length=1)",
            "desc": "Dropbox account, team member, or group ID of member."
        }, {
            "name": "email",
            "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
            "desc": "E-mail address of member."
        }],
        "returnParameters": []
    },
    "sharing/remove_folder_member": {
        "uri": "https://api.dropboxapi.com/2/sharing/remove_folder_member",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "shared_folder_id": "84528192421",
            "member": {
                ".tag": "email",
                "email": "justin@example.com"
            },
            "leave_a_copy": false
        },
        "parameters": [{
            "name": "shared_folder_id",
            "type": "String(pattern=\"[-_0-9a-zA-Z:]+\")",
            "desc": "The ID for the shared folder."
        }, {
            "name": "member",
            "type": "MemberSelector",
            "desc": "The member to remove from the folder.",
            "parameters": [{
                "name": "dropbox_id",
                "type": "String(min_length=1)",
                "desc": "Dropbox account, team member, or group ID of member."
            }, {
                "name": "email",
                "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
                "desc": "E-mail address of member."
            }]
        }, {
            "name": "dropbox_id",
            "type": "String(min_length=1)",
            "desc": "Dropbox account, team member, or group ID of member."
        }, {
            "name": "email",
            "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
            "desc": "E-mail address of member."
        }, {
            "name": "leave_a_copy",
            "type": "Boolean",
            "desc": "If true, the removed user will keep their copy of the folder after it's unshared, assuming it was mounted. Otherwise, it will be removed from their Dropbox. Also, this must be set to false when kicking a group."
        }],
        "returnParameters": []
    },
    "sharing/revoke_shared_link": {
        "uri": "https://api.dropboxapi.com/2/sharing/revoke_shared_link",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "url": "https://www.dropbox.com/s/2sn712vy1ovegw8/Prime_Numbers.txt?dl=0"
        },
        "parameters": [{
            "name": "url",
            "type": "String",
            "desc": "URL of the shared link."
        }],
        "returnParameters": []
    },
    "sharing/share_folder": {
        "uri": "https://api.dropboxapi.com/2/sharing/share_folder",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "path": "/example/workspace",
            "member_policy": "team",
            "acl_update_policy": "editors",
            "shared_link_policy": "members",
            "force_async": false
        },
        "parameters": [{
            "name": "path",
            "type": "String(pattern=\"/(.|[\\r\\n])*\")",
            "desc": "The path to the folder to share. If it does not exist, then a new one is created."
        }, {
            "name": "member_policy",
            "type": "MemberPolicy",
            "desc": "Who can be a member of this shared folder. Only applicable if the current user is on a team. The default for this union is anyone.",
            "parameters": [{
                "name": "team",
                "type": "Void",
                "desc": "Only a teammate can become a member."
            }, {
                "name": "anyone",
                "type": "Void",
                "desc": "Anyone can become a member."
            }]
        }, {
            "name": "team",
            "type": "Void",
            "desc": "Only a teammate can become a member."
        }, {
            "name": "anyone",
            "type": "Void",
            "desc": "Anyone can become a member."
        }, {
            "name": "acl_update_policy",
            "type": "AclUpdatePolicy",
            "desc": "Who can add and remove members of this shared folder. The default for this union is owner.",
            "parameters": [{
                "name": "owner",
                "type": "Void",
                "desc": "Only the owner can update the ACL."
            }, {
                "name": "editors",
                "type": "Void",
                "desc": "Any editor can update the ACL. This may be further restricted to editors on the same team."
            }]
        }, {
            "name": "owner",
            "type": "Void",
            "desc": "Only the owner can update the ACL."
        }, {
            "name": "editors",
            "type": "Void",
            "desc": "Any editor can update the ACL. This may be further restricted to editors on the same team."
        }, {
            "name": "shared_link_policy",
            "type": "SharedLinkPolicy",
            "desc": "The policy to apply to shared links created for content inside this shared folder.  The current user must be on a team to set this policy to SharedLinkPolicy.members. The default for this union is anyone.",
            "parameters": [{
                "name": "anyone",
                "type": "Void",
                "desc": "Links can be shared with anyone."
            }, {
                "name": "members",
                "type": "Void",
                "desc": "Links can only be shared among members of the shared folder."
            }]
        }, {
            "name": "anyone",
            "type": "Void",
            "desc": "Links can be shared with anyone."
        }, {
            "name": "members",
            "type": "Void",
            "desc": "Links can only be shared among members of the shared folder."
        }, {
            "name": "force_async",
            "type": "Boolean",
            "desc": "Whether to force the share to happen asynchronously. The default for this field is False."
        }],
        "returnParameters": []
    },
    "sharing/transfer_folder": {
        "uri": "https://api.dropboxapi.com/2/sharing/transfer_folder",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "parameters": [{
            "name": "shared_folder_id",
            "type": "String(pattern=\"[-_0-9a-zA-Z:]+\")",
            "desc": "The ID for the shared folder."
        }, {
            "name": "to_dropbox_id",
            "type": "String(min_length=1)",
            "desc": "A account or team member ID to transfer ownership to."
        }],
        "returnParameters": []
    },
    "sharing/unmount_folder": {
        "uri": "https://api.dropboxapi.com/2/sharing/unmount_folder",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "shared_folder_id": "84528192421",
            "to_dropbox_id": "dbid:AAEufNrMPSPe0dMQijRP0N_aZtBJRm26W4Q"
        },
        "parameters": [{
            "name": "shared_folder_id",
            "type": "String(pattern=\"[-_0-9a-zA-Z:]+\")",
            "desc": "The ID for the shared folder."
        }],
        "returnParameters": []
    },
    "sharing/unshare_file": {
        "uri": "https://api.dropboxapi.com/2/sharing/unshare_file",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "file": "id:3kmLmQFnf1AAAAAAAAAAAw"
        },
        "parameters": [{
            "name": "file",
            "type": "String(min_length=1, pattern=\"((/|id:).*|nspath:[^:]*:[^:]*)\")",
            "desc": "The file to unshare."
        }],
        "returnParameters": []
    },
    "sharing/unshare_folder": {
        "uri": "https://api.dropboxapi.com/2/sharing/unshare_folder",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "shared_folder_id": "84528192421",
            "leave_a_copy": false
        },
        "parameters": [{
            "name": "shared_folder_id",
            "type": "String(pattern=\"[-_0-9a-zA-Z:]+\")",
            "desc": "The ID for the shared folder."
        }, {
            "name": "leave_a_copy",
            "type": "Boolean",
            "desc": "If true, members of this shared folder will get a copy of this folder after it's unshared. Otherwise, it will be removed from their Dropbox. The current user, who is an owner, will always retain their copy. The default for this field is False."
        }],
        "returnParameters": []
    },
    "sharing/update_folder_member": {
        "uri": "https://api.dropboxapi.com/2/sharing/update_folder_member",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "shared_folder_id": "84528192421",
            "member": {
                ".tag": "email",
                "email": "justin@example.com"
            },
            "access_level": "editor"
        },
        "parameters": [{
            "name": "shared_folder_id",
            "type": "String(pattern=\"[-_0-9a-zA-Z:]+\")",
            "desc": "The ID for the shared folder."
        }, {
            "name": "member",
            "type": "MemberSelector",
            "desc": "The member of the shared folder to update.  Only the MemberSelector.dropbox_id may be set at this time.",
            "parameters": [{
                "name": "dropbox_id",
                "type": "String(min_length=1)",
                "desc": "Dropbox account, team member, or group ID of member."
            }, {
                "name": "email",
                "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
                "desc": "E-mail address of member."
            }]
        }, {
            "name": "dropbox_id",
            "type": "String(min_length=1)",
            "desc": "Dropbox account, team member, or group ID of member."
        }, {
            "name": "email",
            "type": "String(max_length=255, pattern=\"^['&A-Za-z0-9._%+-]+@[A-Za-z0-9-][A-Za-z0-9.-]*.[A-Za-z]{2,15}$\")",
            "desc": "E-mail address of member."
        }, {
            "name": "access_level",
            "type": "AccessLevel",
            "desc": "The new access level for member. AccessLevel.owner is disallowed.",
            "parameters": [{
                "name": "owner",
                "type": "Void",
                "desc": "The collaborator is the owner of the shared folder. Owners can view and edit the shared folder as well as set the folder's policies using  ."
            }, {
                "name": "editor",
                "type": "Void",
                "desc": "The collaborator can both view and edit the shared folder."
            }, {
                "name": "viewer",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder."
            }, {
                "name": "viewer_no_comment",
                "type": "Void",
                "desc": "The collaborator can only view the shared folder and does not have any access to comments."
            }]
        }, {
            "name": "owner",
            "type": "Void",
            "desc": "The collaborator is the owner of the shared folder. Owners can view and edit the shared folder as well as set the folder's policies using  ."
        }, {
            "name": "editor",
            "type": "Void",
            "desc": "The collaborator can both view and edit the shared folder."
        }, {
            "name": "viewer",
            "type": "Void",
            "desc": "The collaborator can only view the shared folder."
        }, {
            "name": "viewer_no_comment",
            "type": "Void",
            "desc": "The collaborator can only view the shared folder and does not have any access to comments."
        }],
        "returnParameters": []
    },
    "sharing/update_folder_policy": {
        "uri": "https://api.dropboxapi.com/2/sharing/update_folder_policy",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "shared_folder_id": "84528192421",
            "member_policy": "team",
            "acl_update_policy": "owner",
            "shared_link_policy": "members"
        },
        "parameters": [{
            "name": "shared_folder_id",
            "type": "String(pattern=\"[-_0-9a-zA-Z:]+\")",
            "desc": "The ID for the shared folder."
        }, {
            "name": "member_policy",
            "type": "MemberPolicy?",
            "desc": "Who can be a member of this shared folder. Only applicable if the current user is on a team. This field is optional.",
            "parameters": [{
                "name": "team",
                "type": "Void",
                "desc": "Only a teammate can become a member."
            }, {
                "name": "anyone",
                "type": "Void",
                "desc": "Anyone can become a member."
            }]
        }, {
            "name": "team",
            "type": "Void",
            "desc": "Only a teammate can become a member."
        }, {
            "name": "anyone",
            "type": "Void",
            "desc": "Anyone can become a member."
        }, {
            "name": "acl_update_policy",
            "type": "AclUpdatePolicy?",
            "desc": "Who can add and remove members of this shared folder. This field is optional.",
            "parameters": [{
                "name": "owner",
                "type": "Void",
                "desc": "Only the owner can update the ACL."
            }, {
                "name": "editors",
                "type": "Void",
                "desc": "Any editor can update the ACL. This may be further restricted to editors on the same team."
            }]
        }, {
            "name": "owner",
            "type": "Void",
            "desc": "Only the owner can update the ACL."
        }, {
            "name": "editors",
            "type": "Void",
            "desc": "Any editor can update the ACL. This may be further restricted to editors on the same team."
        }, {
            "name": "shared_link_policy",
            "type": "SharedLinkPolicy?",
            "desc": "The policy to apply to shared links created for content inside this shared folder. The current user must be on a team to set this policy to SharedLinkPolicy.members. This field is optional.",
            "parameters": [{
                "name": "anyone",
                "type": "Void",
                "desc": "Links can be shared with anyone."
            }, {
                "name": "members",
                "type": "Void",
                "desc": "Links can only be shared among members of the shared folder."
            }]
        }, {
            "name": "anyone",
            "type": "Void",
            "desc": "Links can be shared with anyone."
        }, {
            "name": "members",
            "type": "Void",
            "desc": "Links can only be shared among members of the shared folder."
        }],
        "returnParameters": []
    },
    "users/get_account": {
        "uri": "https://api.dropboxapi.com/2/users/get_account",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "account_id": "dbid:AAH4f99T0taONIb-OurWxbNQ6ywGRopQngc"
        },
        "parameters": [{
            "name": "account_id",
            "type": "String(min_length=40, max_length=40)",
            "desc": "A user's account identifier."
        }],
        "returnParameters": []
    },
    "users/get_account_batch": {
        "uri": "https://api.dropboxapi.com/2/users/get_account_batch",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "testParams": {
            "account_ids": [
                "dbid:AAH4f99T0taONIb-OurWxbNQ6ywGRopQngc",
                "dbid:AAH1Vcz-DVoRDeixtr_OA8oUGgiqhs4XPOQ"
            ]
        },
        "parameters": [{
            "name": "account_ids",
            "type": "List of (String(min_length=40, max_length=40), min_items=1)",
            "desc": "List of user account identifiers.  Should not contain any duplicate account IDs."
        }],
        "returnParameters": []
    },
    "users/get_current_account": {
        "uri": "https://api.dropboxapi.com/2/users/get_current_account",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "parameters": [],
        "returnParameters": []
    },
    "users/get_space_usage": {
        "uri": "https://api.dropboxapi.com/2/users/get_space_usage",
        "requiresAuthHeader": true,
        "requiresReadableStream": false,
        "endpointType": "RPC",
        "parameters": [],
        "returnParameters": []
    }
}

},{}],14:[function(require,module,exports){
(function (console,setTimeout){
/**
 *
 * this code was inspired by the work done by David Riccitelli
 * and Aaron K. Saunders, Clearly Innovative Inc
 *
 * Copyright 2016 Vittorio Sorbera, astrovicApps
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     <a href="http://www.apache.org/licenses/LICENSE-2.0">http://www.apache.org/licenses/LICENSE-2.0</a>
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var TiDropbox = {};

(function() {

    var webView, Deeply;
    var dropboxAPIv2 = require("../lib/dropboxAPIv2").dropboxAPIv2;
    var OS_IOS = (Ti.Platform.osname != "android");
    var OS_ANDROID = !OS_IOS;
    if (OS_ANDROID) {
        Deeply = require('ti.deeply');
        Deeply.setCallback(function (e) {
            Ti.API.debug('Deep link called');            
            androidDeepLink(e);
        });
    }

    TiDropbox.init = function(params) {
        TiDropbox.APP_KEY = params.APP_KEY;
        TiDropbox.APP_SECRET = params.APP_SECRET;
        TiDropbox.redirectUri = params.redirectUri;
        TiDropbox.response_type = params.response_type || "code"; // "token" or "code"
        TiDropbox.app_mime_scheme = params.app_mime_scheme;
        TiDropbox.ACCESS_TOKEN = Ti.App.Properties.getString('DROPBOX_TOKENS',null);
        TiDropbox.ACCESS_REFRESH_TOKEN = Ti.App.Properties.getString('DROPBOX_REFRESH_TOKENS', null);
        TiDropbox.xhr = null;
        TiDropbox.API_URL = "https://api.dropboxapi.com/2/";
    };

    TiDropbox.revokeAccessToken = function(revokeAuth_callback) {
        TiDropbox.callMethod({
            methodStr: "auth/token/revoke",
            paramsObj: null,
            fileBin: null,
            onSuccessCallback: onSuccess_self,
            onErrorCallback: onFailed_self
        });

        Ti.App.Properties.setString('DROPBOX_TOKENS', null);
        Ti.App.Properties.setString('DROPBOX_REFRESH_TOKENS', null);

        function onSuccess_self() {
            /*Titanium.UI.createAlertDialog({
                title: "auth/token/revoke",
                message: "LOGOUT SUCCESS",
                buttonNames: ['OK']
            }).show();*/           
            revokeAuth_callback({
                access_token: null,
                success : true,
                msg: "Access token successfully revoked"
            });
        };

        function onFailed_self(e) {
            /*Titanium.UI.createAlertDialog({
                title: "auth/token/revoke",
                message: JSON.stringify(e),
                buttonNames: ['OK']
            }).show();*/            
            revokeAuth_callback({
                access_token: null,
                success : false,
                msg: "Invalid or expired access token"
            });
        };

        // Remove cookies
        if(OS_IOS){
      		var path = Titanium.Filesystem.applicationDataDirectory;
      		var searchKey = path.search('Documents');
      		path = path.substring(0, searchKey);
      		path = path + 'Library/Cookies/';
            //path = path + 'SystemData/com.apple.SafariViewService/Library/Cookies';// + Ti.App.id;
      		var f = Ti.Filesystem.getFile(path);
      		Ti.API.debug("cookie path ---> " + path);
      		Ti.API.debug("cookie path exists() ---> " + f.exists());
      		if(f.exists()){
      			f.deleteDirectory(true);
      		};
      		f=null;            
      	}else if(OS_ANDROID){
      		Ti.Network.removeAllSystemCookies();
      	};
    };
    /**
     * displays the familiar web login dialog we all know and love
     *
     * @params auth_callback method called when successful
     *
     */
    TiDropbox.generateAuthUrl = function(auth_callback) {

        if (auth_callback != undefined) {
            TiDropbox.auth_callback = auth_callback;
        }

        if(!Ti.Network.online){
          if (TiDropbox.auth_callback != undefined) {
              TiDropbox.auth_callback({
                  access_token: null,
                  success : false,
                  msg : "No internet connection"
              });
          }
          return;
        };

        var url;
        if (TiDropbox.response_type === "code") {
            url = 'https://www.dropbox.com/oauth2/authorize?response_type=code&token_access_type=offline&client_id=%s&redirect_uri=%s&force_reauthentication=true';
        } else {
            url = 'https://www.dropbox.com/oauth2/authorize?response_type=token&client_id=%s&redirect_uri=%s&force_reauthentication=true';
        }
        showAuthorizeUI(
            String.format(
                url,
                TiDropbox.APP_KEY,
                TiDropbox.redirectUri)
        );
        return;
    };


    TiDropbox.callMethod = function(params) {

        var methodStr, paramsObj, fileBin, onSuccess_callback, onError_callback, callMethodXhrObj_callback;
        methodStr = params.methodStr;
        paramsObj = params.paramsObj;
        fileBin = params.fileBin;
        onSuccess_callback = params.onSuccessCallback;
        onError_callback = params.onErrorCallback;
        callMethodXhrObj_callback = params.callMethodXhrObjCallback;
        
        var urlEndpoint = dropboxAPIv2[methodStr].uri + "?reject_cors_preflight=true"; //&authorization=Bearer%20"+TiDropbox.ACCESS_TOKEN;
        //urlEndpoint = "https://api.dropboxapi.com/2/files/list_folder?authorization=Bearer%20"+TiDropbox.ACCESS_TOKEN+"&args=%7B%0A%20%20%22path%22%3A%20%22%22%2C%0A%20%20%22recursive%22%3A%20false%2C%0A%20%20%22include_media_info%22%3A%20false%2C%0A%20%20%22include_deleted%22%3A%20false%2C%0A%20%20%22include_has_explicit_shared_members%22%3A%20false%0A%7D&reject_cors_preflight=true";
        Ti.API.debug("\n\n******\ncallMethod: methodStr--> " + methodStr);
        Ti.API.debug("callMethod: urlEndpoint--> " + urlEndpoint);
        Ti.API.debug("TiDropbox.ACCESS_TOKEN --> " + TiDropbox.ACCESS_TOKEN);
        try {

            //if (TiDropbox.xhr == null) {
                TiDropbox.xhr = Titanium.Network.createHTTPClient();
                TiDropbox.xhr.timeout = 10000;
            //}

            TiDropbox.xhr.onerror = function(e) {
                Ti.API.error("TiDropbox ERROR " + e.error);
                Ti.API.error("TiDropbox ERROR " + TiDropbox.xhr.location);
                Ti.API.error("TiDropbox ERROR " + JSON.stringify(e));
                Ti.API.error(JSON.stringify(TiDropbox.xhr.responseText));
                Ti.API.error(JSON.stringify(TiDropbox.xhr.responseData));
                var errorMsg = TiDropbox.xhr.statusText + "\n" + e;
                
                if (e.code === 401) {
                     Ti.API.error("TiDropbox ERROR: token expired, try refresh it");
                     TiDropbox.refreshOauth2Token(function(e){
                        if (e.success) {                            
                            TiDropbox.callMethod({
                                methodStr: "auth/token/revoke",
                                paramsObj: null,
                                fileBin: null,
                                onSuccessCallback: onSuccess_self,
                                onErrorCallback: onFailed_self,
                                callMethodXhrObjCallback: callMethodXhrObj_callback
                            });                            
                        } else {
                            if (TiDropbox.xhr.responseText) {
                                errorMsg = TiDropbox.xhr.responseText.replace(/\"/g, "'").replace(/\\/g, "'");
                                //errorMsg = TiDropbox.xhr.statusText + "\n" + errorMsg;
                            } else if (TiDropbox.xhr.responseData) {
                                errorMsg = TiDropbox.xhr.responseData;
                            };
                            if (onError_callback) {
                                onError_callback(errorMsg);
                            }
                        }
                     })
                } else {
                    if (TiDropbox.xhr.responseText) {
                        errorMsg = TiDropbox.xhr.responseText.replace(/\"/g, "'").replace(/\\/g, "'");
                        //errorMsg = TiDropbox.xhr.statusText + "\n" + errorMsg;
                    } else if (TiDropbox.xhr.responseData) {
                        errorMsg = TiDropbox.xhr.responseData;
                    };
                    if (onError_callback) {
                        onError_callback(errorMsg);
                    }
                }                
            };

            TiDropbox.xhr.onload = function(_xhr) {
                Ti.API.debug("TiDropbox response: " + TiDropbox.xhr.responseText);
                if (onSuccess_callback) {
                    onSuccess_callback(TiDropbox.xhr);
                }
            };

            // return directly the current callMethod xhr object, so you can invoke all xhr methods you need: abort, onload, onsendstream, ecc..
            if(callMethodXhrObj_callback){
              callMethodXhrObj_callback(TiDropbox.xhr);
            };

            TiDropbox.xhr.open("POST", urlEndpoint);
            // Check required Headers
            if(dropboxAPIv2[methodStr].requiresAuthHeader){
              Ti.API.debug('TiDropbox.xhr.setRequestHeader("Authorization", "Bearer '+ TiDropbox.ACCESS_TOKEN+'");');
              TiDropbox.xhr.setRequestHeader("Authorization", "Bearer " + TiDropbox.ACCESS_TOKEN);
            };
            //if(paramsObj){
              switch(dropboxAPIv2[methodStr].endpointType){
                case "RPC":
                  if(paramsObj){
                    Ti.API.debug('TiDropbox.xhr.setRequestHeader("Content-Type",'+(OS_IOS ? '"application/json"' : '"text/plain; charset=dropbox-cors-hack"')+');');
                    TiDropbox.xhr.setRequestHeader("Content-Type", OS_IOS ? "application/json" : "text/plain; charset=dropbox-cors-hack");
                  }else if(OS_ANDROID){
                    Ti.API.debug('TiDropbox.xhr.setRequestHeader("Content-Type", "");');
                    TiDropbox.xhr.setRequestHeader("Content-Type", '');
                  };
                  break;
                case "CONTENT":
                  Ti.API.debug('TiDropbox.xhr.setRequestHeader("Dropbox-API-Arg", '+JSON.stringify(paramsObj)+');');
                  TiDropbox.xhr.setRequestHeader("Dropbox-API-Arg", JSON.stringify(paramsObj));
                  if(methodStr.indexOf("upload")!=-1){
                    Ti.API.debug('TiDropbox.xhr.setRequestHeader("Dropbox-API-Arg", '+(OS_IOS ? '"application/octet-stream"' : '"text/plain; charset=dropbox-cors-hack"')+');');
                    TiDropbox.xhr.setRequestHeader("Content-Type", OS_IOS ? "application/octet-stream" : "text/plain; charset=dropbox-cors-hack");
                    if(dropboxAPIv2[methodStr].requiresReadableStream && fileBin){
                      Ti.API.debug('TiDropbox.xhr.send(fileBin);');
                      TiDropbox.xhr.send(fileBin);
                      return;
                    };
                  }else if(methodStr.indexOf("download")!=-1){
                    //Ti.API.debug('TiDropbox.xhr.setRequestHeader("Content-Type", "text/plain; charset=dropbox-cors-hack");');
                    //TiDropbox.xhr.setRequestHeader("Content-Type", "text/plain; charset=dropbox-cors-hack");
                    if(OS_ANDROID){
                      Ti.API.debug('TiDropbox.xhr.setRequestHeader("Content-Type", "");');
                      TiDropbox.xhr.setRequestHeader("Content-Type", '');
                    };
                    TiDropbox.xhr.send();
                    return;
                  }else if(methodStr.indexOf("files/get_")!=-1){
                    //Ti.API.debug('TiDropbox.xhr.setRequestHeader("Content-Type", "text/plain; charset=dropbox-cors-hack");');
                    //TiDropbox.xhr.setRequestHeader("Content-Type", "text/plain; charset=dropbox-cors-hack");
                    //TiDropbox.xhr.setRequestHeader("Content-Type", "application/octet-stream");
                    if(OS_ANDROID){
                      Ti.API.debug('TiDropbox.xhr.setRequestHeader("Content-Type", "");');
                      TiDropbox.xhr.setRequestHeader("Content-Type", '');
                    };
                    TiDropbox.xhr.send();
                    return;
                  };
                  break;
              };
            //};
            if(paramsObj){
              Ti.API.debug('TiDropbox.xhr.send('+JSON.stringify(paramsObj)+');');
              TiDropbox.xhr.send(JSON.stringify(paramsObj));
            }else if(OS_ANDROID){
              var _paramsObj = {
                body: null
              };
              Ti.API.debug('TiDropbox.xhr.send('+""+');');
              TiDropbox.xhr.send();
            }else{
              Ti.API.debug('TiDropbox.xhr.send();');
              TiDropbox.xhr.send();
            };
        } catch (err) {
            Titanium.UI.createAlertDialog({
                title: "Error",
                message: String(err),
                buttonNames: ['OK']
            }).show();
        }
    };

    TiDropbox.generateOauth2Token = function (code,generateOauth2Token_callback) {
        console.log("TiDropbox.generateOauth2Token!!!");
        var xhr = Titanium.Network.createHTTPClient();
        var urlEndpoint = "https://api.dropbox.com/oauth2/token?code=" + code +
                            "&grant_type=authorization_code&redirect_uri=" + TiDropbox.redirectUri + 
                            "&client_id=" + TiDropbox.APP_KEY + "&client_secret=" + TiDropbox.APP_SECRET;
        xhr.timeout = 10000;
        
        xhr.onload = function (e) {
            Ti.API.debug("TiDropbox.generateOauth2Token: " + xhr.responseText);
            var response = JSON.parse(xhr.responseText);
            var token = response.access_token;
            var refresh_token = response.refresh_token;
            
            TiDropbox.ACCESS_TOKEN = token;
            Ti.App.Properties.setString('DROPBOX_TOKENS', TiDropbox.ACCESS_TOKEN);
            Ti.App.Properties.setString('DROPBOX_REFRESH_TOKENS', refresh_token);
            Ti.API.debug('tidropbox_token: ' + token);
            Ti.API.debug('tidropbox_refresh_token: ' + refresh_token);
            console.log(response)
            if (TiDropbox.auth_callback != undefined) {
                TiDropbox.auth_callback({
                    access_token: token,
                    success: true,
                    msg: "Ok, you have an access token"
                });
            }

            destroyAuthorizeUI();
        };
        
        xhr.onerror = function (e) {
            console.log(e);
            Ti.API.error("TiDropbox.generateOauth2Token: " + xhr.responseText);            
            generateOauth2Token_callback({
                access_token: null,
                success: false,
                msg: "Invalid or expired access token"
            });
        };

        console.log(urlEndpoint);
        xhr.open("POST", urlEndpoint);        
        
        var base64encodeString = Ti.Utils.base64encode(TiDropbox.APP_KEY + ":" + TiDropbox.APP_SECRET).toString();
        console.log(base64encodeString);
        /*xhr.setRequestHeader(
            "Authorization",
            "Basic " + base64encodeString
        );*/
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send();        
    };

    TiDropbox.refreshOauth2Token = function (refreshOauth2Token_callback) {
        console.log("TiDropbox.refreshOauth2Token!!!");
        var refresh_token = Ti.App.Properties.getString('DROPBOX_REFRESH_TOKENS',"");
        var xhr = Titanium.Network.createHTTPClient();
        var urlEndpoint = "https://api.dropbox.com/oauth2/token?" +
            "grant_type=refresh_token&refresh_token=" + refresh_token +
            "&client_id=" + TiDropbox.APP_KEY + "&client_secret=" + TiDropbox.APP_SECRET;
        xhr.timeout = 10000;

        xhr.onload = function (e) {
            Ti.API.debug("TiDropbox.refreshOauth2Token: " + xhr.responseText);
            var response = JSON.parse(xhr.responseText);
            var token = response.access_token;

            TiDropbox.ACCESS_TOKEN = token;
            Ti.App.Properties.setString('DROPBOX_TOKENS', TiDropbox.ACCESS_TOKEN);
            Ti.API.debug('tidropbox_token: ' + token);
            refreshOauth2Token_callback({
                success: true,
                msg: "Ok, you have an access token"
            });
            if (TiDropbox.auth_callback != undefined) {
                TiDropbox.auth_callback({
                    access_token: token,
                    success: true,
                    msg: "Ok, you have an access token"
                });
            }            
        };

        xhr.onerror = function (e) {
            console.log(e);
            Ti.API.error("TiDropbox.refreshOauth2Token: " + xhr.responseText);

            // Can't refresh token, so try login again
            TiDropbox.generateAuthUrl(function (e) {
                Ti.API.debug("generateAuthUrl checkins response-> " + JSON.stringify(e));
                if (e.success) {
                    refreshOauth2Token_callback({
                        success: true,
                        msg: "Ok, you have an access token"
                    });
                } else {
                    Ti.App.Properties.setString('DROPBOX_TOKENS', null);
                    Ti.App.Properties.setString('DROPBOX_REFRESH_TOKENS', null);
                    refreshOauth2Token_callback({
                        success: false,
                        msg: "Invalid or expired access token"
                    });
                }
            });
        };

        console.log(urlEndpoint);
        xhr.open("POST", urlEndpoint);

        /*xhr.setRequestHeader(
            "Authorization",
            "Basic " + Ti.Utils.base64encode(TiDropbox.APP_KEY + ":" + TiDropbox.APP_SECRET)
        );*/
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send();
    };


    /**
     * code to display the familiar web login dialog we all know and love
     */
    function showAuthorizeUI(pUrl) {
        /*window = Ti.UI.createWindow({
            top: (OS_IOS) ? "20dp" : "0dp",
            //modal: true,
            //fullscreen: true,
            width: '100%',
            backgroundColor: "rgb(255,255,255,0.5)",
            navBarHidden : true
        });
        var transform = Ti.UI.createMatrix2D().scale(0);
        view = Ti.UI.createView({
            top: "50dp",
            left: "5dp",
            right: "5dp",
            bottom: "5dp",
            border: 5,
            backgroundColor: '#fff',
            borderColor: "#0bb1d5",
            borderRadius: 20,
            borderWidth: 5,
            zIndex: -1,
            transform: transform
        });
        closeLabel = Ti.UI.createLabel({
            textAlign: 'center',
            font: {
                fontWeight: 'bold',
                fontSize: '20sp'
            },
            text: 'X',
            top: "5dp",
            right: "5dp",
            width: "40dp",
            height: "40dp",
            backgroundColor: '#fff',
            borderColor: "#0bb1d5",
            borderRadius: 20,
            borderWidth: 5,
            color: "#0bb1d5"
        });
        window.open();

        webView = Ti.UI.createWebView({
            top: "5dp",
            right: "5dp",
            bottom: "5dp",
            left: "5dp",
            url: pUrl,
            autoDetect: [Ti.UI.AUTODETECT_NONE],
            ignoreSslError : true
        });
        
        Ti.API.debug('Setting:[' + Ti.UI.AUTODETECT_NONE + ']');
        webView.addEventListener('beforeload',
            function(e) {
                if (e.url.indexOf(TiDropbox.redirectUri) != -1 || e.url.indexOf('https://www.dropbox.com/') != -1) {
                    Titanium.API.debug(e);
                    authorizeUICallback(e);
                    webView.stopLoading = true;
                }
            });
        if (OS_IOS) {
            webView.addEventListener('load', authorizeUICallback);
        } else {
            webView.addEventListener('open', authorizeUICallback);
        }
        webView.addEventListener('close', closeAuthorizeUI);
        view.add(webView);                
        
        closeLabel.addEventListener('click', closeAuthorizeUI);
        window.add(closeLabel);

        window.add(view);

        var animation = Ti.UI.createAnimation();
        animation.transform = Ti.UI.createMatrix2D();
        animation.duration = 500;
        setTimeout(function(){
          view.animate(animation);
        },OS_IOS ? 10 : 1000);*/

        webView = require('ti.webdialog');
        if (OS_IOS) {

            webView.open({
                url: pUrl + "&callbackURL=" + TiDropbox.app_mime_scheme + "://", //'https://example.com/oauth?callbackURL=myapp://'
            });

            Ti.App.iOS.addEventListener('handleurl', handleurl);
            webView.addEventListener('close', iOSwebViewOnCloseCallback);
            return;

            var authSession = webView.createAuthenticationSession({
                url: pUrl + "&callbackURL=" + TiDropbox.app_mime_scheme + "://", //'https://example.com/oauth?callbackURL=myapp://',
                scheme: TiDropbox.app_mime_scheme
            });

            authSession.addEventListener('callback', function (e) {
                console.log("authSession callback");
                console.log(e);
                if (!e.success) {
                    Ti.API.error('Error authenticating: ' + e.error);
                    closeAuthorizeUI();
                    return;
                }
                Ti.API.info('Callback URL: ' + e.callbackURL);

                if (TiDropbox.response_type === "code") {
                    var code = e.callbackURL.match(/dropbox_token\?([^&]*)/)[1];
                    //  Adesso dovrei richiedere il token con l'api /oauth2/token
                    TiDropbox.generateOauth2Token(code, function (e) {
                        console.log("TiDropbox.generateOauth2Token callback");
                        console.log(e);
                        if (!e.success) {
                            Ti.API.error('Error authenticating: ' + e.error);
                            closeAuthorizeUI();
                            return;
                        } else {
                            authorizeUICallback({
                                url: e.callbackURL
                            })
                        }
                    })
                } else {
                    authorizeUICallback({
                        url: e.callbackURL
                    })
                }
            });

            authSession.start(); // Or cancel() to cancel it manually.
        } else {
            webView.open({
                url: pUrl + "&callbackURL=" + TiDropbox.app_mime_scheme
            });

            //Ti.App.addEventListener("resumed", androidDeepLink);
            webView.addEventListener('close', androidWebViewOnCloseCallback);
        }
    };

    function iOSwebViewOnCloseCallback() {
        Ti.API.debug("TiDropbox iOSwebViewOnCloseCallback");
        Ti.App.iOS.fireEvent('handleurl');
    };

    function androidWebViewOnCloseCallback() {
        Ti.API.debug("TiDropbox androidWebViewOnCloseCallback");
        //Ti.App.addEventListener("resumed", resumed);
    };

    var handleurlCalled = false;   
    function handleurl(e) {       
        // check if it's alredy trigged to avoid double call
        if (handleurlCalled) {
            console.warn("TiDropbox: handleurl already trigged!")  
            return;
        }
        handleurlCalled =  true;
        setTimeout(() => {
            handleurlCalled = false;
        }, 1000);

        Ti.API.debug('handleurl');
        console.log(e);

        if (webView.isOpen()) {
            webView.close();
        }

        var callbackURL;
        try {
            callbackURL = e.launchOptions.url;
        } catch (error) {
            callbackURL = null;
        }

        if (!callbackURL) {
            Ti.API.error('Error handleurl: no callbackURL');
            closeAuthorizeUI();
            return;
        }
        Ti.API.info('Callback URL: ' + callbackURL);
        useCallbackURL(callbackURL);
    }

    function useCallbackURL(callbackURL) {
        if (TiDropbox.response_type === "code") {
            var code = callbackURL.match(/dropbox_token\?([^&]*)/)[1];
            //  Adesso dovrei richiedere il token con l'api /oauth2/token
            TiDropbox.generateOauth2Token(code, function (e) {
                console.log("TiDropbox.generateOauth2Token callback");
                console.log(e);
                if (!e.success) {
                    Ti.API.error('Error authenticating: ' + e.error);
                    closeAuthorizeUI();
                    return;
                } else {
                    authorizeUICallback({
                        url: callbackURL
                    })
                }
            })
        } else {
            authorizeUICallback({
                url: callbackURL
            })
        }
    }

    function closeAuthorizeUI() {
        if (TiDropbox.auth_callback != undefined) {
            TiDropbox.auth_callback({
                access_token: null,
                success: false,
                msg: "No access token... try again"
            });
        }
        destroyAuthorizeUI();
    }

    function androidDeepLink(e) {
        console.log("androidDeepLink intent data --->");
        console.log(e);
        console.log("<--- androidDeepLink intent data");
        var callbackURL = e.data;

        
       
        if (callbackURL && callbackURL.indexOf(TiDropbox.app_mime_scheme) > -1) {
            useCallbackURL(callbackURL);
            return;
            var currIntent = Titanium.Android.currentActivity.intent;
            if (currIntent.hasExtra("dropbox_token")) {
                console.log('currIntent.hasExtras("data")');
                //var notifData = currIntent.getStringExtra("fcm_data");
                currIntent.putExtra("data", null);
            } else {
                console.log('currIntent has NOT Extras ("data")');
            }
            Titanium.Android.currentActivity.intent.data = null;
        } else {
            Ti.API.error('Error androidDeepLink: no callbackURL');
            closeAuthorizeUI();
            return;
        }
    }

    /**
     * unloads the UI used to have the user authorize the application
     */
    function destroyAuthorizeUI() {
        Ti.API.debug('destroyAuthorizeUI');        
        // remove the UI
        try {
            Ti.API.debug('destroyAuthorizeUI: webView.removeEventListener');
            if (OS_IOS) {
                Ti.API.debug('destroyAuthorizeUI: Ti.App.iOS.handleurl.removeEventListener');
                Ti.App.iOS.removeEventListener('handleurl', handleurl);
                webView.removeEventListener('close', iOSwebViewOnCloseCallback);
            } else {  
                Ti.API.debug('destroyAuthorizeUI: Ti.App.removeEventListener resumed');
                //Ti.App.removeEventListener("resumed", androidDeepLink);
                webView.removeEventListener('close', androidWebViewOnCloseCallback);
            }
            //Ti.API.debug('destroyAuthorizeUI: window.close()');
            //window.close();
            if (webView.isOpen()) {
                webView.close();
            }            
        } catch (ex) {
            console.error(ex);
            Ti.API.debug('Cannot destroy the authorize UI. Ignoring.');
        }
    };


    /**
     * fires event when login fails
     * <code>tidropbox_access_denied</code>
     *
     * fires event when login successful
     * <code>tidropbox_token</code>
     *
     * executes callback if specified when creating object
     */
    function authorizeUICallback(e) {
        Ti.API.debug('authorizeUILoaded ' + e.url);
        Titanium.API.debug(e);


        if (e.url.indexOf('access_token') != -1) {
            var token;
            try {
                token = e.url.match(/[?&]access_token=([^&]*)/)[1];
            } catch (error) {
                try {
                    token = e.url.match(/[?#]access_token=([^&]*)/)[1];
                } catch (error) {
                    token = e.url.match(/access_token=([^&]*)/)[1];
                }
            }
            TiDropbox.ACCESS_TOKEN = token;
            Ti.App.Properties.setString('DROPBOX_TOKENS',TiDropbox.ACCESS_TOKEN);
            Ti.API.debug('tidropbox_token: ' + token);
            if (TiDropbox.auth_callback != undefined) {
                TiDropbox.auth_callback({
                    access_token: token,
                    success : true,
                    msg : "Ok, you have an access token"
                });
            }

            destroyAuthorizeUI();

        } else if ('https://www.dropbox.com/' == e.url) {
            Ti.API.debug('tidropbox_logout');
            if (TiDropbox.auth_callback != undefined) {
                TiDropbox.auth_callback({
                    access_token: null,
                    success : false,
                    msg : "No access token... try again"
                });
            }
            destroyAuthorizeUI();
        } else if (e.url.indexOf('error=access_denied') != -1) {
            Ti.API.debug('tidropbox_access_denied, you need a new token');
            if (TiDropbox.auth_callback != undefined) {
                TiDropbox.auth_callback({
                    access_token: null,
                    success : false,
                    msg : 'Access denied, you need a new token'
                });
            }
            destroyAuthorizeUI();
        }
    };

})();

exports.TiDropbox = TiDropbox;
}).call(this,require("--console--"),require("--timers--").setTimeout)
},{"--console--":9,"--timers--":3,"../lib/dropboxAPIv2":13}]},{},[14])(14)
});
