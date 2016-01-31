(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	global.fp = factory();
}(this, function () { 'use strict';

	var babelHelpers = {};

	babelHelpers.extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};

	babelHelpers;

	function doc(fn) {
	  return fn[signature];
	}

	var signature = Symbol('signature');

	doc.trace = function (fn) {
	  return trace('doc ' + (fn.name || fn) + ' ' + (doc(fn) || ''), fn);
	};
	// doc.copy = (x, y) => y[signature] = x[signature]
	doc.trace[signature] = doc[signature] = '(* → x) → String|undefined';

	/* global Function: false, console: false */

	function trace(tag, x) {
	  return Function('tag, x', 'tag && console.log(tag); console.dir(x)')(tag, x), x;
	}

	trace[signature] = 'String → x → x';

	function curry(fn) {
		var arity = arguments.length <= 1 || arguments[1] === undefined ? fn.length : arguments[1];

		if (arity <= 1) return fn; // TODO remove shortcut in source, should be done later on
		return function partial() {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			if (args.length >= arity) return fn.apply(this, args);
			var curried = function curried() {
				return partial.apply(this, [].concat(args, Array.prototype.slice.call(arguments)));
			};
			Object.defineProperty(curried, 'length', { value: arity - args.length });
			return curried;
		}();
	}

	curry[signature] = curryDebug[signature] = '(* → x) → (* → x)';

	function curryDebug(fn) {
		var arity = arguments.length <= 1 || arguments[1] === undefined ? fn.length : arguments[1];

		arity = parseInt(arity) || 0;
		if (arity <= 1) return fn; // TODO remove shortcut in source, should be done later on
		Object.defineProperty(curried, 'length', { value: arity });
		/* debug info */curried.toString = function () {
			return '/* Curried */ ' + fn;
		};
		function curried() {
			if (arguments.length >= arity) return fn.apply(this, arguments);
			var partial = curried.bind.apply(curried, [this].concat(Array.prototype.slice.call(arguments))); // bind allow to track info with chrome console trace
			/* debug info */partial.toString = curried.toString;
			return partial;
		}
		return curried;
	}

	function curryN(arity, fn) {
		return curry(fn, parseInt(arity, 10) || 0);
	}

	curryN[signature] = 'Number → ' + curry[signature];

	function compose() {
	  var _this = this;

	  for (var _len = arguments.length, functions = Array(_len), _key = 0; _key < _len; _key++) {
	    functions[_key] = arguments[_key];
	  }

	  return function () {
	    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      args[_key2] = arguments[_key2];
	    }

	    return functions.reduceRight(function (args, fn) {
	      return [fn.apply(_this, args.slice(0, fn.length || undefined))].concat(args.slice(fn.length || 1));
	    }, args).shift();
	  };
	}

	compose[signature] = composeTrace[signature] = '(y → z), …, (x → y) → (x → z)';

	function composeTrace() {
	  for (var _len3 = arguments.length, functions = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	    functions[_key3] = arguments[_key3];
	  }

	  return compose.apply(null, functions.map(function (fn) {
	    return trace('compose', fn);
	  }));
	}

	function concat(array, y) {
	  return array.concat(y);
	}
	concat[signature] = '[x] → [x]|x → [x]';

	function reduce(reducer, accumulator, array) {
	  return array.reduce(reducer, accumulator);
	}
	reduce[signature] = '((x, y) → x) → x → [y] → x';

	function join(glue, array) {
	  return array.join(glue);
	}
	join[signature] = 'String → [x] → String';

	// Filterable f => (x → Boolean) → f x → f x
	function filter(predicate, array) {
	  return array.filter(predicate);
	}
	filter[signature] = '(x → Boolean) → [x] → [x]|undefined';

	// Functor f => (x → y) → f x → f y
	function map(mapper, array) {
	  return array.map(mapper);
	}
	map[signature] = '(x → y) → [x] → [y]';

	var arrayMethods = Object.freeze({
	  concat: concat,
	  reduce: reduce,
	  join: join,
	  filter: filter,
	  map: map
	});

	function upper(string) {
	  return string.toUpperCase();
	}
	function lower(string) {
	  return string.toLowerCase();
	}
	upper[signature] = upper[signature] = 'String → String';

	function split(pattern, string) {
	  return string.split(pattern);
	}
	split[signature] = 'String|RegExp → String → [String]';

	function replace(pattern, replacement, string) {
	  return string.replace(pattern, replacement);
	}
	replace[signature] = 'RegExp|String → String → String → String';

	function match(pattern, string) {
	  return string.match(pattern);
	}
	upper[signature] = 'RegExp → String → [String|undefined]';

	var stringMethods = Object.freeze({
	  upper: upper,
	  lower: lower,
	  split: split,
	  replace: replace,
	  match: match
	});

	curry.debug = curryDebug;
	compose.trace = composeTrace;

	identity[signature] = 'x → x';
	function identity(x) {
		return x;
	}

	// String → String
	head[signature] = '[x] → x|undefined';
	function head(list) {
		return list[0];
	}

	add[signature] = 'Number → Number → Number';
	function add(x, y) {
		return x + y;
	}

	var objectMap = function objectMap(fn, object) {
		return Object.keys(object).reduce(function (target, key) {
			return target[key] = fn(object[key]), target;
		}, {});
	};
	var fp = objectMap(curryDebug, babelHelpers.extends({
		doc: doc, trace: trace,
		compose: compose, curry: curry, curryN: curryN,
		identity: identity, head: head, add: add
	}, stringMethods, arrayMethods));
	var copy = function copy(target, alias) {
		return Object.keys(alias).forEach(function (key) {
			return target[key] = target[alias[key]];
		});
	};
	copy(fp, { first: 'head', id: 'identity' });

	return fp;

}));