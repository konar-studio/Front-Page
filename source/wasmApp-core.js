(function () {
  'use strict';

  /*!
   * Vue.js v2.6.11
   * (c) 2014-2019 Evan You
   * Released under the MIT License.
   */
  /*  */

  var emptyObject = Object.freeze({});

  // These helpers produce better VM code in JS engines due to their
  // explicitness and function inlining.
  function isUndef (v) {
    return v === undefined || v === null
  }

  function isDef (v) {
    return v !== undefined && v !== null
  }

  function isTrue (v) {
    return v === true
  }

  function isFalse (v) {
    return v === false
  }

  /**
   * Check if value is primitive.
   */
  function isPrimitive (value) {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      // $flow-disable-line
      typeof value === 'symbol' ||
      typeof value === 'boolean'
    )
  }

  /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   */
  function isObject (obj) {
    return obj !== null && typeof obj === 'object'
  }

  /**
   * Get the raw type string of a value, e.g., [object Object].
   */
  var _toString = Object.prototype.toString;

  function toRawType (value) {
    return _toString.call(value).slice(8, -1)
  }

  /**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   */
  function isPlainObject (obj) {
    return _toString.call(obj) === '[object Object]'
  }

  function isRegExp (v) {
    return _toString.call(v) === '[object RegExp]'
  }

  /**
   * Check if val is a valid array index.
   */
  function isValidArrayIndex (val) {
    var n = parseFloat(String(val));
    return n >= 0 && Math.floor(n) === n && isFinite(val)
  }

  function isPromise (val) {
    return (
      isDef(val) &&
      typeof val.then === 'function' &&
      typeof val.catch === 'function'
    )
  }

  /**
   * Convert a value to a string that is actually rendered.
   */
  function toString (val) {
    return val == null
      ? ''
      : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
        ? JSON.stringify(val, null, 2)
        : String(val)
  }

  /**
   * Convert an input value to a number for persistence.
   * If the conversion fails, return original string.
   */
  function toNumber (val) {
    var n = parseFloat(val);
    return isNaN(n) ? val : n
  }

  /**
   * Make a map and return a function for checking if a key
   * is in that map.
   */
  function makeMap (
    str,
    expectsLowerCase
  ) {
    var map = Object.create(null);
    var list = str.split(',');
    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }
    return expectsLowerCase
      ? function (val) { return map[val.toLowerCase()]; }
      : function (val) { return map[val]; }
  }

  /**
   * Check if a tag is a built-in tag.
   */
  var isBuiltInTag = makeMap('slot,component', true);

  /**
   * Check if an attribute is a reserved attribute.
   */
  var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

  /**
   * Remove an item from an array.
   */
  function remove (arr, item) {
    if (arr.length) {
      var index = arr.indexOf(item);
      if (index > -1) {
        return arr.splice(index, 1)
      }
    }
  }

  /**
   * Check whether an object has the property.
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key)
  }

  /**
   * Create a cached version of a pure function.
   */
  function cached (fn) {
    var cache = Object.create(null);
    return (function cachedFn (str) {
      var hit = cache[str];
      return hit || (cache[str] = fn(str))
    })
  }

  /**
   * Camelize a hyphen-delimited string.
   */
  var camelizeRE = /-(\w)/g;
  var camelize = cached(function (str) {
    return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
  });

  /**
   * Capitalize a string.
   */
  var capitalize = cached(function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  });

  /**
   * Hyphenate a camelCase string.
   */
  var hyphenateRE = /\B([A-Z])/g;
  var hyphenate = cached(function (str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase()
  });

  /**
   * Simple bind polyfill for environments that do not support it,
   * e.g., PhantomJS 1.x. Technically, we don't need this anymore
   * since native bind is now performant enough in most browsers.
   * But removing it would mean breaking code that was able to run in
   * PhantomJS 1.x, so this must be kept for backward compatibility.
   */

  /* istanbul ignore next */
  function polyfillBind (fn, ctx) {
    function boundFn (a) {
      var l = arguments.length;
      return l
        ? l > 1
          ? fn.apply(ctx, arguments)
          : fn.call(ctx, a)
        : fn.call(ctx)
    }

    boundFn._length = fn.length;
    return boundFn
  }

  function nativeBind (fn, ctx) {
    return fn.bind(ctx)
  }

  var bind = Function.prototype.bind
    ? nativeBind
    : polyfillBind;

  /**
   * Convert an Array-like object to a real Array.
   */
  function toArray (list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
      ret[i] = list[i + start];
    }
    return ret
  }

  /**
   * Mix properties into target object.
   */
  function extend (to, _from) {
    for (var key in _from) {
      to[key] = _from[key];
    }
    return to
  }

  /**
   * Merge an Array of Objects into a single Object.
   */
  function toObject (arr) {
    var res = {};
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        extend(res, arr[i]);
      }
    }
    return res
  }

  /* eslint-disable no-unused-vars */

  /**
   * Perform no operation.
   * Stubbing args to make Flow happy without leaving useless transpiled code
   * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
   */
  function noop (a, b, c) {}

  /**
   * Always return false.
   */
  var no = function (a, b, c) { return false; };

  /* eslint-enable no-unused-vars */

  /**
   * Return the same value.
   */
  var identity = function (_) { return _; };

  /**
   * Check if two values are loosely equal - that is,
   * if they are plain objects, do they have the same shape?
   */
  function looseEqual (a, b) {
    if (a === b) { return true }
    var isObjectA = isObject(a);
    var isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
      try {
        var isArrayA = Array.isArray(a);
        var isArrayB = Array.isArray(b);
        if (isArrayA && isArrayB) {
          return a.length === b.length && a.every(function (e, i) {
            return looseEqual(e, b[i])
          })
        } else if (a instanceof Date && b instanceof Date) {
          return a.getTime() === b.getTime()
        } else if (!isArrayA && !isArrayB) {
          var keysA = Object.keys(a);
          var keysB = Object.keys(b);
          return keysA.length === keysB.length && keysA.every(function (key) {
            return looseEqual(a[key], b[key])
          })
        } else {
          /* istanbul ignore next */
          return false
        }
      } catch (e) {
        /* istanbul ignore next */
        return false
      }
    } else if (!isObjectA && !isObjectB) {
      return String(a) === String(b)
    } else {
      return false
    }
  }

  /**
   * Return the first index at which a loosely equal value can be
   * found in the array (if value is a plain object, the array must
   * contain an object of the same shape), or -1 if it is not present.
   */
  function looseIndexOf (arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (looseEqual(arr[i], val)) { return i }
    }
    return -1
  }

  /**
   * Ensure a function is called only once.
   */
  function once (fn) {
    var called = false;
    return function () {
      if (!called) {
        called = true;
        fn.apply(this, arguments);
      }
    }
  }

  var SSR_ATTR = 'data-server-rendered';

  var ASSET_TYPES = [
    'component',
    'directive',
    'filter'
  ];

  var LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured',
    'serverPrefetch'
  ];

  /*  */



  var config = ({
    /**
     * Option merge strategies (used in core/util/options)
     */
    // $flow-disable-line
    optionMergeStrategies: Object.create(null),

    /**
     * Whether to suppress warnings.
     */
    silent: false,

    /**
     * Show production mode tip message on boot?
     */
    productionTip: "production" !== 'production',

    /**
     * Whether to enable devtools
     */
    devtools: "production" !== 'production',

    /**
     * Whether to record perf
     */
    performance: false,

    /**
     * Error handler for watcher errors
     */
    errorHandler: null,

    /**
     * Warn handler for watcher warns
     */
    warnHandler: null,

    /**
     * Ignore certain custom elements
     */
    ignoredElements: [],

    /**
     * Custom user key aliases for v-on
     */
    // $flow-disable-line
    keyCodes: Object.create(null),

    /**
     * Check if a tag is reserved so that it cannot be registered as a
     * component. This is platform-dependent and may be overwritten.
     */
    isReservedTag: no,

    /**
     * Check if an attribute is reserved so that it cannot be used as a component
     * prop. This is platform-dependent and may be overwritten.
     */
    isReservedAttr: no,

    /**
     * Check if a tag is an unknown element.
     * Platform-dependent.
     */
    isUnknownElement: no,

    /**
     * Get the namespace of an element
     */
    getTagNamespace: noop,

    /**
     * Parse the real tag name for the specific platform.
     */
    parsePlatformTagName: identity,

    /**
     * Check if an attribute must be bound using property, e.g. value
     * Platform-dependent.
     */
    mustUseProp: no,

    /**
     * Perform updates asynchronously. Intended to be used by Vue Test Utils
     * This will significantly reduce performance if set to false.
     */
    async: true,

    /**
     * Exposed for legacy reasons
     */
    _lifecycleHooks: LIFECYCLE_HOOKS
  });

  /*  */

  /**
   * unicode letters used for parsing html tags, component names and property paths.
   * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
   * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
   */
  var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

  /**
   * Check if a string starts with $ or _
   */
  function isReserved (str) {
    var c = (str + '').charCodeAt(0);
    return c === 0x24 || c === 0x5F
  }

  /**
   * Define a property.
   */
  function def (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }

  /**
   * Parse simple path.
   */
  var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
  function parsePath (path) {
    if (bailRE.test(path)) {
      return
    }
    var segments = path.split('.');
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) { return }
        obj = obj[segments[i]];
      }
      return obj
    }
  }

  /*  */

  // can we use __proto__?
  var hasProto = '__proto__' in {};

  // Browser environment sniffing
  var inBrowser = typeof window !== 'undefined';
  var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
  var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
  var UA = inBrowser && window.navigator.userAgent.toLowerCase();
  var isIE = UA && /msie|trident/.test(UA);
  var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
  var isEdge = UA && UA.indexOf('edge/') > 0;
  var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
  var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
  var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
  var isPhantomJS = UA && /phantomjs/.test(UA);
  var isFF = UA && UA.match(/firefox\/(\d+)/);

  // Firefox has a "watch" function on Object.prototype...
  var nativeWatch = ({}).watch;

  var supportsPassive = false;
  if (inBrowser) {
    try {
      var opts = {};
      Object.defineProperty(opts, 'passive', ({
        get: function get () {
          /* istanbul ignore next */
          supportsPassive = true;
        }
      })); // https://github.com/facebook/flow/issues/285
      window.addEventListener('test-passive', null, opts);
    } catch (e) {}
  }

  // this needs to be lazy-evaled because vue may be required before
  // vue-server-renderer can set VUE_ENV
  var _isServer;
  var isServerRendering = function () {
    if (_isServer === undefined) {
      /* istanbul ignore if */
      if (!inBrowser && !inWeex && typeof global !== 'undefined') {
        // detect presence of vue-server-renderer and avoid
        // Webpack shimming the process
        _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
      } else {
        _isServer = false;
      }
    }
    return _isServer
  };

  // detect devtools
  var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

  /* istanbul ignore next */
  function isNative (Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
  }

  var hasSymbol =
    typeof Symbol !== 'undefined' && isNative(Symbol) &&
    typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

  var _Set;
  /* istanbul ignore if */ // $flow-disable-line
  if (typeof Set !== 'undefined' && isNative(Set)) {
    // use native Set when available.
    _Set = Set;
  } else {
    // a non-standard Set polyfill that only works with primitive keys.
    _Set = /*@__PURE__*/(function () {
      function Set () {
        this.set = Object.create(null);
      }
      Set.prototype.has = function has (key) {
        return this.set[key] === true
      };
      Set.prototype.add = function add (key) {
        this.set[key] = true;
      };
      Set.prototype.clear = function clear () {
        this.set = Object.create(null);
      };

      return Set;
    }());
  }

  /*  */

  var warn = noop;

  /*  */

  var uid = 0;

  /**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   */
  var Dep = function Dep () {
    this.id = uid++;
    this.subs = [];
  };

  Dep.prototype.addSub = function addSub (sub) {
    this.subs.push(sub);
  };

  Dep.prototype.removeSub = function removeSub (sub) {
    remove(this.subs, sub);
  };

  Dep.prototype.depend = function depend () {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  };

  Dep.prototype.notify = function notify () {
    // stabilize the subscriber list first
    var subs = this.subs.slice();
    for (var i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  };

  // The current target watcher being evaluated.
  // This is globally unique because only one watcher
  // can be evaluated at a time.
  Dep.target = null;
  var targetStack = [];

  function pushTarget (target) {
    targetStack.push(target);
    Dep.target = target;
  }

  function popTarget () {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
  }

  /*  */

  var VNode = function VNode (
    tag,
    data,
    children,
    text,
    elm,
    context,
    componentOptions,
    asyncFactory
  ) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.ns = undefined;
    this.context = context;
    this.fnContext = undefined;
    this.fnOptions = undefined;
    this.fnScopeId = undefined;
    this.key = data && data.key;
    this.componentOptions = componentOptions;
    this.componentInstance = undefined;
    this.parent = undefined;
    this.raw = false;
    this.isStatic = false;
    this.isRootInsert = true;
    this.isComment = false;
    this.isCloned = false;
    this.isOnce = false;
    this.asyncFactory = asyncFactory;
    this.asyncMeta = undefined;
    this.isAsyncPlaceholder = false;
  };

  var prototypeAccessors = { child: { configurable: true } };

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  prototypeAccessors.child.get = function () {
    return this.componentInstance
  };

  Object.defineProperties( VNode.prototype, prototypeAccessors );

  var createEmptyVNode = function (text) {
    if ( text === void 0 ) text = '';

    var node = new VNode();
    node.text = text;
    node.isComment = true;
    return node
  };

  function createTextVNode (val) {
    return new VNode(undefined, undefined, undefined, String(val))
  }

  // optimized shallow clone
  // used for static nodes and slot nodes because they may be reused across
  // multiple renders, cloning them avoids errors when DOM manipulations rely
  // on their elm reference.
  function cloneVNode (vnode) {
    var cloned = new VNode(
      vnode.tag,
      vnode.data,
      // #7975
      // clone children array to avoid mutating original in case of cloning
      // a child.
      vnode.children && vnode.children.slice(),
      vnode.text,
      vnode.elm,
      vnode.context,
      vnode.componentOptions,
      vnode.asyncFactory
    );
    cloned.ns = vnode.ns;
    cloned.isStatic = vnode.isStatic;
    cloned.key = vnode.key;
    cloned.isComment = vnode.isComment;
    cloned.fnContext = vnode.fnContext;
    cloned.fnOptions = vnode.fnOptions;
    cloned.fnScopeId = vnode.fnScopeId;
    cloned.asyncMeta = vnode.asyncMeta;
    cloned.isCloned = true;
    return cloned
  }

  /*
   * not type checking this file because flow doesn't play well with
   * dynamically accessing methods on Array prototype
   */

  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);

  var methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ];

  /**
   * Intercept mutating methods and emit events
   */
  methodsToPatch.forEach(function (method) {
    // cache original method
    var original = arrayProto[method];
    def(arrayMethods, method, function mutator () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var result = original.apply(this, args);
      var ob = this.__ob__;
      var inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break
        case 'splice':
          inserted = args.slice(2);
          break
      }
      if (inserted) { ob.observeArray(inserted); }
      // notify change
      ob.dep.notify();
      return result
    });
  });

  /*  */

  var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

  /**
   * In some cases we may want to disable observation inside a component's
   * update computation.
   */
  var shouldObserve = true;

  function toggleObserving (value) {
    shouldObserve = value;
  }

  /**
   * Observer class that is attached to each observed
   * object. Once attached, the observer converts the target
   * object's property keys into getter/setters that
   * collect dependencies and dispatch updates.
   */
  var Observer = function Observer (value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods);
      } else {
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  };

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  Observer.prototype.walk = function walk (obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      defineReactive$$1(obj, keys[i]);
    }
  };

  /**
   * Observe a list of Array items.
   */
  Observer.prototype.observeArray = function observeArray (items) {
    for (var i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  };

  // helpers

  /**
   * Augment a target Object or Array by intercepting
   * the prototype chain using __proto__
   */
  function protoAugment (target, src) {
    /* eslint-disable no-proto */
    target.__proto__ = src;
    /* eslint-enable no-proto */
  }

  /**
   * Augment a target Object or Array by defining
   * hidden properties.
   */
  /* istanbul ignore next */
  function copyAugment (target, src, keys) {
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      def(target, key, src[key]);
    }
  }

  /**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   */
  function observe (value, asRootData) {
    if (!isObject(value) || value instanceof VNode) {
      return
    }
    var ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__;
    } else if (
      shouldObserve &&
      !isServerRendering() &&
      (Array.isArray(value) || isPlainObject(value)) &&
      Object.isExtensible(value) &&
      !value._isVue
    ) {
      ob = new Observer(value);
    }
    if (asRootData && ob) {
      ob.vmCount++;
    }
    return ob
  }

  /**
   * Define a reactive property on an Object.
   */
  function defineReactive$$1 (
    obj,
    key,
    val,
    customSetter,
    shallow
  ) {
    var dep = new Dep();

    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return
    }

    // cater for pre-defined getter/setters
    var getter = property && property.get;
    var setter = property && property.set;
    if ((!getter || setter) && arguments.length === 2) {
      val = obj[key];
    }

    var childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter () {
        var value = getter ? getter.call(obj) : val;
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend();
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }
        return value
      },
      set: function reactiveSetter (newVal) {
        var value = getter ? getter.call(obj) : val;
        /* eslint-disable no-self-compare */
        if (newVal === value || (newVal !== newVal && value !== value)) {
          return
        }
        // #7981: for accessor properties without setter
        if (getter && !setter) { return }
        if (setter) {
          setter.call(obj, newVal);
        } else {
          val = newVal;
        }
        childOb = !shallow && observe(newVal);
        dep.notify();
      }
    });
  }

  /**
   * Set a property on an object. Adds the new property and
   * triggers change notification if the property doesn't
   * already exist.
   */
  function set (target, key, val) {
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val
    }
    if (key in target && !(key in Object.prototype)) {
      target[key] = val;
      return val
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      return val
    }
    if (!ob) {
      target[key] = val;
      return val
    }
    defineReactive$$1(ob.value, key, val);
    ob.dep.notify();
    return val
  }

  /**
   * Delete a property and trigger change if necessary.
   */
  function del (target, key) {
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.splice(key, 1);
      return
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      return
    }
    if (!hasOwn(target, key)) {
      return
    }
    delete target[key];
    if (!ob) {
      return
    }
    ob.dep.notify();
  }

  /**
   * Collect dependencies on array elements when the array is touched, since
   * we cannot intercept array element access like property getters.
   */
  function dependArray (value) {
    for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
      e = value[i];
      e && e.__ob__ && e.__ob__.dep.depend();
      if (Array.isArray(e)) {
        dependArray(e);
      }
    }
  }

  /*  */

  /**
   * Option overwriting strategies are functions that handle
   * how to merge a parent option value and a child option
   * value into the final value.
   */
  var strats = config.optionMergeStrategies;

  /**
   * Helper that recursively merges two data objects together.
   */
  function mergeData (to, from) {
    if (!from) { return to }
    var key, toVal, fromVal;

    var keys = hasSymbol
      ? Reflect.ownKeys(from)
      : Object.keys(from);

    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      // in case the object is already observed...
      if (key === '__ob__') { continue }
      toVal = to[key];
      fromVal = from[key];
      if (!hasOwn(to, key)) {
        set(to, key, fromVal);
      } else if (
        toVal !== fromVal &&
        isPlainObject(toVal) &&
        isPlainObject(fromVal)
      ) {
        mergeData(toVal, fromVal);
      }
    }
    return to
  }

  /**
   * Data
   */
  function mergeDataOrFn (
    parentVal,
    childVal,
    vm
  ) {
    if (!vm) {
      // in a Vue.extend merge, both should be functions
      if (!childVal) {
        return parentVal
      }
      if (!parentVal) {
        return childVal
      }
      // when parentVal & childVal are both present,
      // we need to return a function that returns the
      // merged result of both functions... no need to
      // check if parentVal is a function here because
      // it has to be a function to pass previous merges.
      return function mergedDataFn () {
        return mergeData(
          typeof childVal === 'function' ? childVal.call(this, this) : childVal,
          typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
        )
      }
    } else {
      return function mergedInstanceDataFn () {
        // instance merge
        var instanceData = typeof childVal === 'function'
          ? childVal.call(vm, vm)
          : childVal;
        var defaultData = typeof parentVal === 'function'
          ? parentVal.call(vm, vm)
          : parentVal;
        if (instanceData) {
          return mergeData(instanceData, defaultData)
        } else {
          return defaultData
        }
      }
    }
  }

  strats.data = function (
    parentVal,
    childVal,
    vm
  ) {
    if (!vm) {
      if (childVal && typeof childVal !== 'function') {

        return parentVal
      }
      return mergeDataOrFn(parentVal, childVal)
    }

    return mergeDataOrFn(parentVal, childVal, vm)
  };

  /**
   * Hooks and props are merged as arrays.
   */
  function mergeHook (
    parentVal,
    childVal
  ) {
    var res = childVal
      ? parentVal
        ? parentVal.concat(childVal)
        : Array.isArray(childVal)
          ? childVal
          : [childVal]
      : parentVal;
    return res
      ? dedupeHooks(res)
      : res
  }

  function dedupeHooks (hooks) {
    var res = [];
    for (var i = 0; i < hooks.length; i++) {
      if (res.indexOf(hooks[i]) === -1) {
        res.push(hooks[i]);
      }
    }
    return res
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  /**
   * Assets
   *
   * When a vm is present (instance creation), we need to do
   * a three-way merge between constructor options, instance
   * options and parent options.
   */
  function mergeAssets (
    parentVal,
    childVal,
    vm,
    key
  ) {
    var res = Object.create(parentVal || null);
    if (childVal) {
      return extend(res, childVal)
    } else {
      return res
    }
  }

  ASSET_TYPES.forEach(function (type) {
    strats[type + 's'] = mergeAssets;
  });

  /**
   * Watchers.
   *
   * Watchers hashes should not overwrite one
   * another, so we merge them as arrays.
   */
  strats.watch = function (
    parentVal,
    childVal,
    vm,
    key
  ) {
    // work around Firefox's Object.prototype.watch...
    if (parentVal === nativeWatch) { parentVal = undefined; }
    if (childVal === nativeWatch) { childVal = undefined; }
    /* istanbul ignore if */
    if (!childVal) { return Object.create(parentVal || null) }
    if (!parentVal) { return childVal }
    var ret = {};
    extend(ret, parentVal);
    for (var key$1 in childVal) {
      var parent = ret[key$1];
      var child = childVal[key$1];
      if (parent && !Array.isArray(parent)) {
        parent = [parent];
      }
      ret[key$1] = parent
        ? parent.concat(child)
        : Array.isArray(child) ? child : [child];
    }
    return ret
  };

  /**
   * Other object hashes.
   */
  strats.props =
  strats.methods =
  strats.inject =
  strats.computed = function (
    parentVal,
    childVal,
    vm,
    key
  ) {
    if (childVal && "production" !== 'production') {
      assertObjectType(key, childVal);
    }
    if (!parentVal) { return childVal }
    var ret = Object.create(null);
    extend(ret, parentVal);
    if (childVal) { extend(ret, childVal); }
    return ret
  };
  strats.provide = mergeDataOrFn;

  /**
   * Default strategy.
   */
  var defaultStrat = function (parentVal, childVal) {
    return childVal === undefined
      ? parentVal
      : childVal
  };

  /**
   * Ensure all props option syntax are normalized into the
   * Object-based format.
   */
  function normalizeProps (options, vm) {
    var props = options.props;
    if (!props) { return }
    var res = {};
    var i, val, name;
    if (Array.isArray(props)) {
      i = props.length;
      while (i--) {
        val = props[i];
        if (typeof val === 'string') {
          name = camelize(val);
          res[name] = { type: null };
        }
      }
    } else if (isPlainObject(props)) {
      for (var key in props) {
        val = props[key];
        name = camelize(key);
        res[name] = isPlainObject(val)
          ? val
          : { type: val };
      }
    }
    options.props = res;
  }

  /**
   * Normalize all injections into Object-based format
   */
  function normalizeInject (options, vm) {
    var inject = options.inject;
    if (!inject) { return }
    var normalized = options.inject = {};
    if (Array.isArray(inject)) {
      for (var i = 0; i < inject.length; i++) {
        normalized[inject[i]] = { from: inject[i] };
      }
    } else if (isPlainObject(inject)) {
      for (var key in inject) {
        var val = inject[key];
        normalized[key] = isPlainObject(val)
          ? extend({ from: key }, val)
          : { from: val };
      }
    }
  }

  /**
   * Normalize raw function directives into object format.
   */
  function normalizeDirectives (options) {
    var dirs = options.directives;
    if (dirs) {
      for (var key in dirs) {
        var def$$1 = dirs[key];
        if (typeof def$$1 === 'function') {
          dirs[key] = { bind: def$$1, update: def$$1 };
        }
      }
    }
  }

  function assertObjectType (name, value, vm) {
    if (!isPlainObject(value)) {
      warn(
        "Invalid value for option \"" + name + "\": expected an Object, " +
        "but got " + (toRawType(value)) + ".");
    }
  }

  /**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   */
  function mergeOptions (
    parent,
    child,
    vm
  ) {

    if (typeof child === 'function') {
      child = child.options;
    }

    normalizeProps(child);
    normalizeInject(child);
    normalizeDirectives(child);

    // Apply extends and mixins on the child options,
    // but only if it is a raw options object that isn't
    // the result of another mergeOptions call.
    // Only merged options has the _base property.
    if (!child._base) {
      if (child.extends) {
        parent = mergeOptions(parent, child.extends, vm);
      }
      if (child.mixins) {
        for (var i = 0, l = child.mixins.length; i < l; i++) {
          parent = mergeOptions(parent, child.mixins[i], vm);
        }
      }
    }

    var options = {};
    var key;
    for (key in parent) {
      mergeField(key);
    }
    for (key in child) {
      if (!hasOwn(parent, key)) {
        mergeField(key);
      }
    }
    function mergeField (key) {
      var strat = strats[key] || defaultStrat;
      options[key] = strat(parent[key], child[key], vm, key);
    }
    return options
  }

  /**
   * Resolve an asset.
   * This function is used because child instances need access
   * to assets defined in its ancestor chain.
   */
  function resolveAsset (
    options,
    type,
    id,
    warnMissing
  ) {
    /* istanbul ignore if */
    if (typeof id !== 'string') {
      return
    }
    var assets = options[type];
    // check local registration variations first
    if (hasOwn(assets, id)) { return assets[id] }
    var camelizedId = camelize(id);
    if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
    var PascalCaseId = capitalize(camelizedId);
    if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
    // fallback to prototype chain
    var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
    return res
  }

  /*  */



  function validateProp (
    key,
    propOptions,
    propsData,
    vm
  ) {
    var prop = propOptions[key];
    var absent = !hasOwn(propsData, key);
    var value = propsData[key];
    // boolean casting
    var booleanIndex = getTypeIndex(Boolean, prop.type);
    if (booleanIndex > -1) {
      if (absent && !hasOwn(prop, 'default')) {
        value = false;
      } else if (value === '' || value === hyphenate(key)) {
        // only cast empty string / same name to boolean if
        // boolean has higher priority
        var stringIndex = getTypeIndex(String, prop.type);
        if (stringIndex < 0 || booleanIndex < stringIndex) {
          value = true;
        }
      }
    }
    // check default value
    if (value === undefined) {
      value = getPropDefaultValue(vm, prop, key);
      // since the default value is a fresh copy,
      // make sure to observe it.
      var prevShouldObserve = shouldObserve;
      toggleObserving(true);
      observe(value);
      toggleObserving(prevShouldObserve);
    }
    return value
  }

  /**
   * Get the default value of a prop.
   */
  function getPropDefaultValue (vm, prop, key) {
    // no default, return undefined
    if (!hasOwn(prop, 'default')) {
      return undefined
    }
    var def = prop.default;
    // the raw prop value was also undefined from previous render,
    // return previous default value to avoid unnecessary watcher trigger
    if (vm && vm.$options.propsData &&
      vm.$options.propsData[key] === undefined &&
      vm._props[key] !== undefined
    ) {
      return vm._props[key]
    }
    // call factory function for non-Function types
    // a value is Function if its prototype is function even across different execution context
    return typeof def === 'function' && getType(prop.type) !== 'Function'
      ? def.call(vm)
      : def
  }

  /**
   * Use function string name to check built-in types,
   * because a simple equality check will fail when running
   * across different vms / iframes.
   */
  function getType (fn) {
    var match = fn && fn.toString().match(/^\s*function (\w+)/);
    return match ? match[1] : ''
  }

  function isSameType (a, b) {
    return getType(a) === getType(b)
  }

  function getTypeIndex (type, expectedTypes) {
    if (!Array.isArray(expectedTypes)) {
      return isSameType(expectedTypes, type) ? 0 : -1
    }
    for (var i = 0, len = expectedTypes.length; i < len; i++) {
      if (isSameType(expectedTypes[i], type)) {
        return i
      }
    }
    return -1
  }

  /*  */

  function handleError (err, vm, info) {
    // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
    // See: https://github.com/vuejs/vuex/issues/1505
    pushTarget();
    try {
      if (vm) {
        var cur = vm;
        while ((cur = cur.$parent)) {
          var hooks = cur.$options.errorCaptured;
          if (hooks) {
            for (var i = 0; i < hooks.length; i++) {
              try {
                var capture = hooks[i].call(cur, err, vm, info) === false;
                if (capture) { return }
              } catch (e) {
                globalHandleError(e, cur, 'errorCaptured hook');
              }
            }
          }
        }
      }
      globalHandleError(err, vm, info);
    } finally {
      popTarget();
    }
  }

  function invokeWithErrorHandling (
    handler,
    context,
    args,
    vm,
    info
  ) {
    var res;
    try {
      res = args ? handler.apply(context, args) : handler.call(context);
      if (res && !res._isVue && isPromise(res) && !res._handled) {
        res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
        // issue #9511
        // avoid catch triggering multiple times when nested calls
        res._handled = true;
      }
    } catch (e) {
      handleError(e, vm, info);
    }
    return res
  }

  function globalHandleError (err, vm, info) {
    if (config.errorHandler) {
      try {
        return config.errorHandler.call(null, err, vm, info)
      } catch (e) {
        // if the user intentionally throws the original error in the handler,
        // do not log it twice
        if (e !== err) {
          logError(e);
        }
      }
    }
    logError(err);
  }

  function logError (err, vm, info) {
    /* istanbul ignore else */
    if ((inBrowser || inWeex) && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err
    }
  }

  /*  */

  var isUsingMicroTask = false;

  var callbacks = [];
  var pending = false;

  function flushCallbacks () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // Here we have async deferring wrappers using microtasks.
  // In 2.5 we used (macro) tasks (in combination with microtasks).
  // However, it has subtle problems when state is changed right before repaint
  // (e.g. #6813, out-in transitions).
  // Also, using (macro) tasks in event handler would cause some weird behaviors
  // that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
  // So we now use microtasks everywhere, again.
  // A major drawback of this tradeoff is that there are some scenarios
  // where microtasks have too high a priority and fire in between supposedly
  // sequential events (e.g. #4521, #6690, which have workarounds)
  // or even between bubbling of the same event (#6566).
  var timerFunc;

  // The nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore next, $flow-disable-line */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    timerFunc = function () {
      p.then(flushCallbacks);
      // In problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
    isUsingMicroTask = true;
  } else if (!isIE && typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // Use MutationObserver where native Promise is not available,
    // e.g. PhantomJS, iOS7, Android 4.4
    // (#6466 MutationObserver is unreliable in IE11)
    var counter = 1;
    var observer = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
    isUsingMicroTask = true;
  } else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    // Fallback to setImmediate.
    // Technically it leverages the (macro) task queue,
    // but it is still a better choice than setTimeout.
    timerFunc = function () {
      setImmediate(flushCallbacks);
    };
  } else {
    // Fallback to setTimeout.
    timerFunc = function () {
      setTimeout(flushCallbacks, 0);
    };
  }

  function nextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve) {
        _resolve = resolve;
      })
    }
  }

  /*  */

  var seenObjects = new _Set();

  /**
   * Recursively traverse an object to evoke all converted
   * getters, so that every nested property inside the object
   * is collected as a "deep" dependency.
   */
  function traverse (val) {
    _traverse(val, seenObjects);
    seenObjects.clear();
  }

  function _traverse (val, seen) {
    var i, keys;
    var isA = Array.isArray(val);
    if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
      return
    }
    if (val.__ob__) {
      var depId = val.__ob__.dep.id;
      if (seen.has(depId)) {
        return
      }
      seen.add(depId);
    }
    if (isA) {
      i = val.length;
      while (i--) { _traverse(val[i], seen); }
    } else {
      keys = Object.keys(val);
      i = keys.length;
      while (i--) { _traverse(val[keys[i]], seen); }
    }
  }

  /*  */

  var normalizeEvent = cached(function (name) {
    var passive = name.charAt(0) === '&';
    name = passive ? name.slice(1) : name;
    var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
    name = once$$1 ? name.slice(1) : name;
    var capture = name.charAt(0) === '!';
    name = capture ? name.slice(1) : name;
    return {
      name: name,
      once: once$$1,
      capture: capture,
      passive: passive
    }
  });

  function createFnInvoker (fns, vm) {
    function invoker () {
      var arguments$1 = arguments;

      var fns = invoker.fns;
      if (Array.isArray(fns)) {
        var cloned = fns.slice();
        for (var i = 0; i < cloned.length; i++) {
          invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
        }
      } else {
        // return handler return value for single handlers
        return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
      }
    }
    invoker.fns = fns;
    return invoker
  }

  function updateListeners (
    on,
    oldOn,
    add,
    remove$$1,
    createOnceHandler,
    vm
  ) {
    var name, def$$1, cur, old, event;
    for (name in on) {
      def$$1 = cur = on[name];
      old = oldOn[name];
      event = normalizeEvent(name);
      if (isUndef(cur)) ; else if (isUndef(old)) {
        if (isUndef(cur.fns)) {
          cur = on[name] = createFnInvoker(cur, vm);
        }
        if (isTrue(event.once)) {
          cur = on[name] = createOnceHandler(event.name, cur, event.capture);
        }
        add(event.name, cur, event.capture, event.passive, event.params);
      } else if (cur !== old) {
        old.fns = cur;
        on[name] = old;
      }
    }
    for (name in oldOn) {
      if (isUndef(on[name])) {
        event = normalizeEvent(name);
        remove$$1(event.name, oldOn[name], event.capture);
      }
    }
  }

  /*  */

  function mergeVNodeHook (def, hookKey, hook) {
    if (def instanceof VNode) {
      def = def.data.hook || (def.data.hook = {});
    }
    var invoker;
    var oldHook = def[hookKey];

    function wrappedHook () {
      hook.apply(this, arguments);
      // important: remove merged hook to ensure it's called only once
      // and prevent memory leak
      remove(invoker.fns, wrappedHook);
    }

    if (isUndef(oldHook)) {
      // no existing hook
      invoker = createFnInvoker([wrappedHook]);
    } else {
      /* istanbul ignore if */
      if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
        // already a merged invoker
        invoker = oldHook;
        invoker.fns.push(wrappedHook);
      } else {
        // existing plain hook
        invoker = createFnInvoker([oldHook, wrappedHook]);
      }
    }

    invoker.merged = true;
    def[hookKey] = invoker;
  }

  /*  */

  function extractPropsFromVNodeData (
    data,
    Ctor,
    tag
  ) {
    // we are only extracting raw values here.
    // validation and default values are handled in the child
    // component itself.
    var propOptions = Ctor.options.props;
    if (isUndef(propOptions)) {
      return
    }
    var res = {};
    var attrs = data.attrs;
    var props = data.props;
    if (isDef(attrs) || isDef(props)) {
      for (var key in propOptions) {
        var altKey = hyphenate(key);
        checkProp(res, props, key, altKey, true) ||
        checkProp(res, attrs, key, altKey, false);
      }
    }
    return res
  }

  function checkProp (
    res,
    hash,
    key,
    altKey,
    preserve
  ) {
    if (isDef(hash)) {
      if (hasOwn(hash, key)) {
        res[key] = hash[key];
        if (!preserve) {
          delete hash[key];
        }
        return true
      } else if (hasOwn(hash, altKey)) {
        res[key] = hash[altKey];
        if (!preserve) {
          delete hash[altKey];
        }
        return true
      }
    }
    return false
  }

  /*  */

  // The template compiler attempts to minimize the need for normalization by
  // statically analyzing the template at compile time.
  //
  // For plain HTML markup, normalization can be completely skipped because the
  // generated render function is guaranteed to return Array<VNode>. There are
  // two cases where extra normalization is needed:

  // 1. When the children contains components - because a functional component
  // may return an Array instead of a single root. In this case, just a simple
  // normalization is needed - if any child is an Array, we flatten the whole
  // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
  // because functional components already normalize their own children.
  function simpleNormalizeChildren (children) {
    for (var i = 0; i < children.length; i++) {
      if (Array.isArray(children[i])) {
        return Array.prototype.concat.apply([], children)
      }
    }
    return children
  }

  // 2. When the children contains constructs that always generated nested Arrays,
  // e.g. <template>, <slot>, v-for, or when the children is provided by user
  // with hand-written render functions / JSX. In such cases a full normalization
  // is needed to cater to all possible types of children values.
  function normalizeChildren (children) {
    return isPrimitive(children)
      ? [createTextVNode(children)]
      : Array.isArray(children)
        ? normalizeArrayChildren(children)
        : undefined
  }

  function isTextNode (node) {
    return isDef(node) && isDef(node.text) && isFalse(node.isComment)
  }

  function normalizeArrayChildren (children, nestedIndex) {
    var res = [];
    var i, c, lastIndex, last;
    for (i = 0; i < children.length; i++) {
      c = children[i];
      if (isUndef(c) || typeof c === 'boolean') { continue }
      lastIndex = res.length - 1;
      last = res[lastIndex];
      //  nested
      if (Array.isArray(c)) {
        if (c.length > 0) {
          c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
          // merge adjacent text nodes
          if (isTextNode(c[0]) && isTextNode(last)) {
            res[lastIndex] = createTextVNode(last.text + (c[0]).text);
            c.shift();
          }
          res.push.apply(res, c);
        }
      } else if (isPrimitive(c)) {
        if (isTextNode(last)) {
          // merge adjacent text nodes
          // this is necessary for SSR hydration because text nodes are
          // essentially merged when rendered to HTML strings
          res[lastIndex] = createTextVNode(last.text + c);
        } else if (c !== '') {
          // convert primitive to vnode
          res.push(createTextVNode(c));
        }
      } else {
        if (isTextNode(c) && isTextNode(last)) {
          // merge adjacent text nodes
          res[lastIndex] = createTextVNode(last.text + c.text);
        } else {
          // default key for nested array children (likely generated by v-for)
          if (isTrue(children._isVList) &&
            isDef(c.tag) &&
            isUndef(c.key) &&
            isDef(nestedIndex)) {
            c.key = "__vlist" + nestedIndex + "_" + i + "__";
          }
          res.push(c);
        }
      }
    }
    return res
  }

  /*  */

  function initProvide (vm) {
    var provide = vm.$options.provide;
    if (provide) {
      vm._provided = typeof provide === 'function'
        ? provide.call(vm)
        : provide;
    }
  }

  function initInjections (vm) {
    var result = resolveInject(vm.$options.inject, vm);
    if (result) {
      toggleObserving(false);
      Object.keys(result).forEach(function (key) {
        /* istanbul ignore else */
        {
          defineReactive$$1(vm, key, result[key]);
        }
      });
      toggleObserving(true);
    }
  }

  function resolveInject (inject, vm) {
    if (inject) {
      // inject is :any because flow is not smart enough to figure out cached
      var result = Object.create(null);
      var keys = hasSymbol
        ? Reflect.ownKeys(inject)
        : Object.keys(inject);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        // #6574 in case the inject object is observed...
        if (key === '__ob__') { continue }
        var provideKey = inject[key].from;
        var source = vm;
        while (source) {
          if (source._provided && hasOwn(source._provided, provideKey)) {
            result[key] = source._provided[provideKey];
            break
          }
          source = source.$parent;
        }
        if (!source) {
          if ('default' in inject[key]) {
            var provideDefault = inject[key].default;
            result[key] = typeof provideDefault === 'function'
              ? provideDefault.call(vm)
              : provideDefault;
          }
        }
      }
      return result
    }
  }

  /*  */



  /**
   * Runtime helper for resolving raw children VNodes into a slot object.
   */
  function resolveSlots (
    children,
    context
  ) {
    if (!children || !children.length) {
      return {}
    }
    var slots = {};
    for (var i = 0, l = children.length; i < l; i++) {
      var child = children[i];
      var data = child.data;
      // remove slot attribute if the node is resolved as a Vue slot node
      if (data && data.attrs && data.attrs.slot) {
        delete data.attrs.slot;
      }
      // named slots should only be respected if the vnode was rendered in the
      // same context.
      if ((child.context === context || child.fnContext === context) &&
        data && data.slot != null
      ) {
        var name = data.slot;
        var slot = (slots[name] || (slots[name] = []));
        if (child.tag === 'template') {
          slot.push.apply(slot, child.children || []);
        } else {
          slot.push(child);
        }
      } else {
        (slots.default || (slots.default = [])).push(child);
      }
    }
    // ignore slots that contains only whitespace
    for (var name$1 in slots) {
      if (slots[name$1].every(isWhitespace)) {
        delete slots[name$1];
      }
    }
    return slots
  }

  function isWhitespace (node) {
    return (node.isComment && !node.asyncFactory) || node.text === ' '
  }

  /*  */

  function normalizeScopedSlots (
    slots,
    normalSlots,
    prevSlots
  ) {
    var res;
    var hasNormalSlots = Object.keys(normalSlots).length > 0;
    var isStable = slots ? !!slots.$stable : !hasNormalSlots;
    var key = slots && slots.$key;
    if (!slots) {
      res = {};
    } else if (slots._normalized) {
      // fast path 1: child component re-render only, parent did not change
      return slots._normalized
    } else if (
      isStable &&
      prevSlots &&
      prevSlots !== emptyObject &&
      key === prevSlots.$key &&
      !hasNormalSlots &&
      !prevSlots.$hasNormal
    ) {
      // fast path 2: stable scoped slots w/ no normal slots to proxy,
      // only need to normalize once
      return prevSlots
    } else {
      res = {};
      for (var key$1 in slots) {
        if (slots[key$1] && key$1[0] !== '$') {
          res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
        }
      }
    }
    // expose normal slots on scopedSlots
    for (var key$2 in normalSlots) {
      if (!(key$2 in res)) {
        res[key$2] = proxyNormalSlot(normalSlots, key$2);
      }
    }
    // avoriaz seems to mock a non-extensible $scopedSlots object
    // and when that is passed down this would cause an error
    if (slots && Object.isExtensible(slots)) {
      (slots)._normalized = res;
    }
    def(res, '$stable', isStable);
    def(res, '$key', key);
    def(res, '$hasNormal', hasNormalSlots);
    return res
  }

  function normalizeScopedSlot(normalSlots, key, fn) {
    var normalized = function () {
      var res = arguments.length ? fn.apply(null, arguments) : fn({});
      res = res && typeof res === 'object' && !Array.isArray(res)
        ? [res] // single vnode
        : normalizeChildren(res);
      return res && (
        res.length === 0 ||
        (res.length === 1 && res[0].isComment) // #9658
      ) ? undefined
        : res
    };
    // this is a slot using the new v-slot syntax without scope. although it is
    // compiled as a scoped slot, render fn users would expect it to be present
    // on this.$slots because the usage is semantically a normal slot.
    if (fn.proxy) {
      Object.defineProperty(normalSlots, key, {
        get: normalized,
        enumerable: true,
        configurable: true
      });
    }
    return normalized
  }

  function proxyNormalSlot(slots, key) {
    return function () { return slots[key]; }
  }

  /*  */

  /**
   * Runtime helper for rendering v-for lists.
   */
  function renderList (
    val,
    render
  ) {
    var ret, i, l, keys, key;
    if (Array.isArray(val) || typeof val === 'string') {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i);
      }
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0; i < val; i++) {
        ret[i] = render(i + 1, i);
      }
    } else if (isObject(val)) {
      if (hasSymbol && val[Symbol.iterator]) {
        ret = [];
        var iterator = val[Symbol.iterator]();
        var result = iterator.next();
        while (!result.done) {
          ret.push(render(result.value, ret.length));
          result = iterator.next();
        }
      } else {
        keys = Object.keys(val);
        ret = new Array(keys.length);
        for (i = 0, l = keys.length; i < l; i++) {
          key = keys[i];
          ret[i] = render(val[key], key, i);
        }
      }
    }
    if (!isDef(ret)) {
      ret = [];
    }
    (ret)._isVList = true;
    return ret
  }

  /*  */

  /**
   * Runtime helper for rendering <slot>
   */
  function renderSlot (
    name,
    fallback,
    props,
    bindObject
  ) {
    var scopedSlotFn = this.$scopedSlots[name];
    var nodes;
    if (scopedSlotFn) { // scoped slot
      props = props || {};
      if (bindObject) {
        props = extend(extend({}, bindObject), props);
      }
      nodes = scopedSlotFn(props) || fallback;
    } else {
      nodes = this.$slots[name] || fallback;
    }

    var target = props && props.slot;
    if (target) {
      return this.$createElement('template', { slot: target }, nodes)
    } else {
      return nodes
    }
  }

  /*  */

  /**
   * Runtime helper for resolving filters
   */
  function resolveFilter (id) {
    return resolveAsset(this.$options, 'filters', id) || identity
  }

  /*  */

  function isKeyNotMatch (expect, actual) {
    if (Array.isArray(expect)) {
      return expect.indexOf(actual) === -1
    } else {
      return expect !== actual
    }
  }

  /**
   * Runtime helper for checking keyCodes from config.
   * exposed as Vue.prototype._k
   * passing in eventKeyName as last argument separately for backwards compat
   */
  function checkKeyCodes (
    eventKeyCode,
    key,
    builtInKeyCode,
    eventKeyName,
    builtInKeyName
  ) {
    var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
    if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
      return isKeyNotMatch(builtInKeyName, eventKeyName)
    } else if (mappedKeyCode) {
      return isKeyNotMatch(mappedKeyCode, eventKeyCode)
    } else if (eventKeyName) {
      return hyphenate(eventKeyName) !== key
    }
  }

  /*  */

  /**
   * Runtime helper for merging v-bind="object" into a VNode's data.
   */
  function bindObjectProps (
    data,
    tag,
    value,
    asProp,
    isSync
  ) {
    if (value) {
      if (!isObject(value)) ; else {
        if (Array.isArray(value)) {
          value = toObject(value);
        }
        var hash;
        var loop = function ( key ) {
          if (
            key === 'class' ||
            key === 'style' ||
            isReservedAttribute(key)
          ) {
            hash = data;
          } else {
            var type = data.attrs && data.attrs.type;
            hash = asProp || config.mustUseProp(tag, type, key)
              ? data.domProps || (data.domProps = {})
              : data.attrs || (data.attrs = {});
          }
          var camelizedKey = camelize(key);
          var hyphenatedKey = hyphenate(key);
          if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
            hash[key] = value[key];

            if (isSync) {
              var on = data.on || (data.on = {});
              on[("update:" + key)] = function ($event) {
                value[key] = $event;
              };
            }
          }
        };

        for (var key in value) loop( key );
      }
    }
    return data
  }

  /*  */

  /**
   * Runtime helper for rendering static trees.
   */
  function renderStatic (
    index,
    isInFor
  ) {
    var cached = this._staticTrees || (this._staticTrees = []);
    var tree = cached[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree.
    if (tree && !isInFor) {
      return tree
    }
    // otherwise, render a fresh tree.
    tree = cached[index] = this.$options.staticRenderFns[index].call(
      this._renderProxy,
      null,
      this // for render fns generated for functional component templates
    );
    markStatic(tree, ("__static__" + index), false);
    return tree
  }

  /**
   * Runtime helper for v-once.
   * Effectively it means marking the node as static with a unique key.
   */
  function markOnce (
    tree,
    index,
    key
  ) {
    markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
    return tree
  }

  function markStatic (
    tree,
    key,
    isOnce
  ) {
    if (Array.isArray(tree)) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i] && typeof tree[i] !== 'string') {
          markStaticNode(tree[i], (key + "_" + i), isOnce);
        }
      }
    } else {
      markStaticNode(tree, key, isOnce);
    }
  }

  function markStaticNode (node, key, isOnce) {
    node.isStatic = true;
    node.key = key;
    node.isOnce = isOnce;
  }

  /*  */

  function bindObjectListeners (data, value) {
    if (value) {
      if (!isPlainObject(value)) ; else {
        var on = data.on = data.on ? extend({}, data.on) : {};
        for (var key in value) {
          var existing = on[key];
          var ours = value[key];
          on[key] = existing ? [].concat(existing, ours) : ours;
        }
      }
    }
    return data
  }

  /*  */

  function resolveScopedSlots (
    fns, // see flow/vnode
    res,
    // the following are added in 2.6
    hasDynamicKeys,
    contentHashKey
  ) {
    res = res || { $stable: !hasDynamicKeys };
    for (var i = 0; i < fns.length; i++) {
      var slot = fns[i];
      if (Array.isArray(slot)) {
        resolveScopedSlots(slot, res, hasDynamicKeys);
      } else if (slot) {
        // marker for reverse proxying v-slot without scope on this.$slots
        if (slot.proxy) {
          slot.fn.proxy = true;
        }
        res[slot.key] = slot.fn;
      }
    }
    if (contentHashKey) {
      (res).$key = contentHashKey;
    }
    return res
  }

  /*  */

  function bindDynamicKeys (baseObj, values) {
    for (var i = 0; i < values.length; i += 2) {
      var key = values[i];
      if (typeof key === 'string' && key) {
        baseObj[values[i]] = values[i + 1];
      }
    }
    return baseObj
  }

  // helper to dynamically append modifier runtime markers to event names.
  // ensure only append when value is already string, otherwise it will be cast
  // to string and cause the type check to miss.
  function prependModifier (value, symbol) {
    return typeof value === 'string' ? symbol + value : value
  }

  /*  */

  function installRenderHelpers (target) {
    target._o = markOnce;
    target._n = toNumber;
    target._s = toString;
    target._l = renderList;
    target._t = renderSlot;
    target._q = looseEqual;
    target._i = looseIndexOf;
    target._m = renderStatic;
    target._f = resolveFilter;
    target._k = checkKeyCodes;
    target._b = bindObjectProps;
    target._v = createTextVNode;
    target._e = createEmptyVNode;
    target._u = resolveScopedSlots;
    target._g = bindObjectListeners;
    target._d = bindDynamicKeys;
    target._p = prependModifier;
  }

  /*  */

  function FunctionalRenderContext (
    data,
    props,
    children,
    parent,
    Ctor
  ) {
    var this$1 = this;

    var options = Ctor.options;
    // ensure the createElement function in functional components
    // gets a unique context - this is necessary for correct named slot check
    var contextVm;
    if (hasOwn(parent, '_uid')) {
      contextVm = Object.create(parent);
      // $flow-disable-line
      contextVm._original = parent;
    } else {
      // the context vm passed in is a functional context as well.
      // in this case we want to make sure we are able to get a hold to the
      // real context instance.
      contextVm = parent;
      // $flow-disable-line
      parent = parent._original;
    }
    var isCompiled = isTrue(options._compiled);
    var needNormalization = !isCompiled;

    this.data = data;
    this.props = props;
    this.children = children;
    this.parent = parent;
    this.listeners = data.on || emptyObject;
    this.injections = resolveInject(options.inject, parent);
    this.slots = function () {
      if (!this$1.$slots) {
        normalizeScopedSlots(
          data.scopedSlots,
          this$1.$slots = resolveSlots(children, parent)
        );
      }
      return this$1.$slots
    };

    Object.defineProperty(this, 'scopedSlots', ({
      enumerable: true,
      get: function get () {
        return normalizeScopedSlots(data.scopedSlots, this.slots())
      }
    }));

    // support for compiled functional template
    if (isCompiled) {
      // exposing $options for renderStatic()
      this.$options = options;
      // pre-resolve slots for renderSlot()
      this.$slots = this.slots();
      this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
    }

    if (options._scopeId) {
      this._c = function (a, b, c, d) {
        var vnode = createElement(contextVm, a, b, c, d, needNormalization);
        if (vnode && !Array.isArray(vnode)) {
          vnode.fnScopeId = options._scopeId;
          vnode.fnContext = parent;
        }
        return vnode
      };
    } else {
      this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
    }
  }

  installRenderHelpers(FunctionalRenderContext.prototype);

  function createFunctionalComponent (
    Ctor,
    propsData,
    data,
    contextVm,
    children
  ) {
    var options = Ctor.options;
    var props = {};
    var propOptions = options.props;
    if (isDef(propOptions)) {
      for (var key in propOptions) {
        props[key] = validateProp(key, propOptions, propsData || emptyObject);
      }
    } else {
      if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
      if (isDef(data.props)) { mergeProps(props, data.props); }
    }

    var renderContext = new FunctionalRenderContext(
      data,
      props,
      children,
      contextVm,
      Ctor
    );

    var vnode = options.render.call(null, renderContext._c, renderContext);

    if (vnode instanceof VNode) {
      return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options)
    } else if (Array.isArray(vnode)) {
      var vnodes = normalizeChildren(vnode) || [];
      var res = new Array(vnodes.length);
      for (var i = 0; i < vnodes.length; i++) {
        res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options);
      }
      return res
    }
  }

  function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
    // #7817 clone node before setting fnContext, otherwise if the node is reused
    // (e.g. it was from a cached normal slot) the fnContext causes named slots
    // that should not be matched to match.
    var clone = cloneVNode(vnode);
    clone.fnContext = contextVm;
    clone.fnOptions = options;
    if (data.slot) {
      (clone.data || (clone.data = {})).slot = data.slot;
    }
    return clone
  }

  function mergeProps (to, from) {
    for (var key in from) {
      to[camelize(key)] = from[key];
    }
  }

  /*  */

  /*  */

  /*  */

  /*  */

  // inline hooks to be invoked on component VNodes during patch
  var componentVNodeHooks = {
    init: function init (vnode, hydrating) {
      if (
        vnode.componentInstance &&
        !vnode.componentInstance._isDestroyed &&
        vnode.data.keepAlive
      ) {
        // kept-alive components, treat as a patch
        var mountedNode = vnode; // work around flow
        componentVNodeHooks.prepatch(mountedNode, mountedNode);
      } else {
        var child = vnode.componentInstance = createComponentInstanceForVnode(
          vnode,
          activeInstance
        );
        child.$mount(hydrating ? vnode.elm : undefined, hydrating);
      }
    },

    prepatch: function prepatch (oldVnode, vnode) {
      var options = vnode.componentOptions;
      var child = vnode.componentInstance = oldVnode.componentInstance;
      updateChildComponent(
        child,
        options.propsData, // updated props
        options.listeners, // updated listeners
        vnode, // new parent vnode
        options.children // new children
      );
    },

    insert: function insert (vnode) {
      var context = vnode.context;
      var componentInstance = vnode.componentInstance;
      if (!componentInstance._isMounted) {
        componentInstance._isMounted = true;
        callHook(componentInstance, 'mounted');
      }
      if (vnode.data.keepAlive) {
        if (context._isMounted) {
          // vue-router#1212
          // During updates, a kept-alive component's child components may
          // change, so directly walking the tree here may call activated hooks
          // on incorrect children. Instead we push them into a queue which will
          // be processed after the whole patch process ended.
          queueActivatedComponent(componentInstance);
        } else {
          activateChildComponent(componentInstance, true /* direct */);
        }
      }
    },

    destroy: function destroy (vnode) {
      var componentInstance = vnode.componentInstance;
      if (!componentInstance._isDestroyed) {
        if (!vnode.data.keepAlive) {
          componentInstance.$destroy();
        } else {
          deactivateChildComponent(componentInstance, true /* direct */);
        }
      }
    }
  };

  var hooksToMerge = Object.keys(componentVNodeHooks);

  function createComponent (
    Ctor,
    data,
    context,
    children,
    tag
  ) {
    if (isUndef(Ctor)) {
      return
    }

    var baseCtor = context.$options._base;

    // plain options object: turn it into a constructor
    if (isObject(Ctor)) {
      Ctor = baseCtor.extend(Ctor);
    }

    // if at this stage it's not a constructor or an async component factory,
    // reject.
    if (typeof Ctor !== 'function') {
      return
    }

    // async component
    var asyncFactory;
    if (isUndef(Ctor.cid)) {
      asyncFactory = Ctor;
      Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
      if (Ctor === undefined) {
        // return a placeholder node for async component, which is rendered
        // as a comment node but preserves all the raw information for the node.
        // the information will be used for async server-rendering and hydration.
        return createAsyncPlaceholder(
          asyncFactory,
          data,
          context,
          children,
          tag
        )
      }
    }

    data = data || {};

    // resolve constructor options in case global mixins are applied after
    // component constructor creation
    resolveConstructorOptions(Ctor);

    // transform component v-model data into props & events
    if (isDef(data.model)) {
      transformModel(Ctor.options, data);
    }

    // extract props
    var propsData = extractPropsFromVNodeData(data, Ctor);

    // functional component
    if (isTrue(Ctor.options.functional)) {
      return createFunctionalComponent(Ctor, propsData, data, context, children)
    }

    // extract listeners, since these needs to be treated as
    // child component listeners instead of DOM listeners
    var listeners = data.on;
    // replace with listeners with .native modifier
    // so it gets processed during parent component patch.
    data.on = data.nativeOn;

    if (isTrue(Ctor.options.abstract)) {
      // abstract components do not keep anything
      // other than props & listeners & slot

      // work around flow
      var slot = data.slot;
      data = {};
      if (slot) {
        data.slot = slot;
      }
    }

    // install component management hooks onto the placeholder node
    installComponentHooks(data);

    // return a placeholder vnode
    var name = Ctor.options.name || tag;
    var vnode = new VNode(
      ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
      data, undefined, undefined, undefined, context,
      { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
      asyncFactory
    );

    return vnode
  }

  function createComponentInstanceForVnode (
    vnode, // we know it's MountedComponentVNode but flow doesn't
    parent // activeInstance in lifecycle state
  ) {
    var options = {
      _isComponent: true,
      _parentVnode: vnode,
      parent: parent
    };
    // check inline-template render functions
    var inlineTemplate = vnode.data.inlineTemplate;
    if (isDef(inlineTemplate)) {
      options.render = inlineTemplate.render;
      options.staticRenderFns = inlineTemplate.staticRenderFns;
    }
    return new vnode.componentOptions.Ctor(options)
  }

  function installComponentHooks (data) {
    var hooks = data.hook || (data.hook = {});
    for (var i = 0; i < hooksToMerge.length; i++) {
      var key = hooksToMerge[i];
      var existing = hooks[key];
      var toMerge = componentVNodeHooks[key];
      if (existing !== toMerge && !(existing && existing._merged)) {
        hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
      }
    }
  }

  function mergeHook$1 (f1, f2) {
    var merged = function (a, b) {
      // flow complains about extra args which is why we use any
      f1(a, b);
      f2(a, b);
    };
    merged._merged = true;
    return merged
  }

  // transform component v-model info (value and callback) into
  // prop and event handler respectively.
  function transformModel (options, data) {
    var prop = (options.model && options.model.prop) || 'value';
    var event = (options.model && options.model.event) || 'input'
    ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
    var on = data.on || (data.on = {});
    var existing = on[event];
    var callback = data.model.callback;
    if (isDef(existing)) {
      if (
        Array.isArray(existing)
          ? existing.indexOf(callback) === -1
          : existing !== callback
      ) {
        on[event] = [callback].concat(existing);
      }
    } else {
      on[event] = callback;
    }
  }

  /*  */

  var SIMPLE_NORMALIZE = 1;
  var ALWAYS_NORMALIZE = 2;

  // wrapper function for providing a more flexible interface
  // without getting yelled at by flow
  function createElement (
    context,
    tag,
    data,
    children,
    normalizationType,
    alwaysNormalize
  ) {
    if (Array.isArray(data) || isPrimitive(data)) {
      normalizationType = children;
      children = data;
      data = undefined;
    }
    if (isTrue(alwaysNormalize)) {
      normalizationType = ALWAYS_NORMALIZE;
    }
    return _createElement(context, tag, data, children, normalizationType)
  }

  function _createElement (
    context,
    tag,
    data,
    children,
    normalizationType
  ) {
    if (isDef(data) && isDef((data).__ob__)) {
      return createEmptyVNode()
    }
    // object syntax in v-bind
    if (isDef(data) && isDef(data.is)) {
      tag = data.is;
    }
    if (!tag) {
      // in case of component :is set to falsy value
      return createEmptyVNode()
    }
    // support single function children as default scoped slot
    if (Array.isArray(children) &&
      typeof children[0] === 'function'
    ) {
      data = data || {};
      data.scopedSlots = { default: children[0] };
      children.length = 0;
    }
    if (normalizationType === ALWAYS_NORMALIZE) {
      children = normalizeChildren(children);
    } else if (normalizationType === SIMPLE_NORMALIZE) {
      children = simpleNormalizeChildren(children);
    }
    var vnode, ns;
    if (typeof tag === 'string') {
      var Ctor;
      ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
      if (config.isReservedTag(tag)) {
        vnode = new VNode(
          config.parsePlatformTagName(tag), data, children,
          undefined, undefined, context
        );
      } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
        // component
        vnode = createComponent(Ctor, data, context, children, tag);
      } else {
        // unknown or unlisted namespaced elements
        // check at runtime because it may get assigned a namespace when its
        // parent normalizes children
        vnode = new VNode(
          tag, data, children,
          undefined, undefined, context
        );
      }
    } else {
      // direct component options / constructor
      vnode = createComponent(tag, data, context, children);
    }
    if (Array.isArray(vnode)) {
      return vnode
    } else if (isDef(vnode)) {
      if (isDef(ns)) { applyNS(vnode, ns); }
      if (isDef(data)) { registerDeepBindings(data); }
      return vnode
    } else {
      return createEmptyVNode()
    }
  }

  function applyNS (vnode, ns, force) {
    vnode.ns = ns;
    if (vnode.tag === 'foreignObject') {
      // use default namespace inside foreignObject
      ns = undefined;
      force = true;
    }
    if (isDef(vnode.children)) {
      for (var i = 0, l = vnode.children.length; i < l; i++) {
        var child = vnode.children[i];
        if (isDef(child.tag) && (
          isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
          applyNS(child, ns, force);
        }
      }
    }
  }

  // ref #5318
  // necessary to ensure parent re-render when deep bindings like :style and
  // :class are used on slot nodes
  function registerDeepBindings (data) {
    if (isObject(data.style)) {
      traverse(data.style);
    }
    if (isObject(data.class)) {
      traverse(data.class);
    }
  }

  /*  */

  function initRender (vm) {
    vm._vnode = null; // the root of the child tree
    vm._staticTrees = null; // v-once cached trees
    var options = vm.$options;
    var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
    var renderContext = parentVnode && parentVnode.context;
    vm.$slots = resolveSlots(options._renderChildren, renderContext);
    vm.$scopedSlots = emptyObject;
    // bind the createElement fn to this instance
    // so that we get proper render context inside it.
    // args order: tag, data, children, normalizationType, alwaysNormalize
    // internal version is used by render functions compiled from templates
    vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
    // normalization is always applied for the public version, used in
    // user-written render functions.
    vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

    // $attrs & $listeners are exposed for easier HOC creation.
    // they need to be reactive so that HOCs using them are always updated
    var parentData = parentVnode && parentVnode.data;

    /* istanbul ignore else */
    {
      defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
      defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, null, true);
    }
  }

  var currentRenderingInstance = null;

  function renderMixin (Vue) {
    // install runtime convenience helpers
    installRenderHelpers(Vue.prototype);

    Vue.prototype.$nextTick = function (fn) {
      return nextTick(fn, this)
    };

    Vue.prototype._render = function () {
      var vm = this;
      var ref = vm.$options;
      var render = ref.render;
      var _parentVnode = ref._parentVnode;

      if (_parentVnode) {
        vm.$scopedSlots = normalizeScopedSlots(
          _parentVnode.data.scopedSlots,
          vm.$slots,
          vm.$scopedSlots
        );
      }

      // set parent vnode. this allows render functions to have access
      // to the data on the placeholder node.
      vm.$vnode = _parentVnode;
      // render self
      var vnode;
      try {
        // There's no need to maintain a stack because all render fns are called
        // separately from one another. Nested component's render fns are called
        // when parent component is patched.
        currentRenderingInstance = vm;
        vnode = render.call(vm._renderProxy, vm.$createElement);
      } catch (e) {
        handleError(e, vm, "render");
        // return error render result,
        // or previous vnode to prevent render error causing blank component
        /* istanbul ignore else */
        {
          vnode = vm._vnode;
        }
      } finally {
        currentRenderingInstance = null;
      }
      // if the returned array contains only a single node, allow it
      if (Array.isArray(vnode) && vnode.length === 1) {
        vnode = vnode[0];
      }
      // return empty vnode in case the render function errored out
      if (!(vnode instanceof VNode)) {
        vnode = createEmptyVNode();
      }
      // set parent
      vnode.parent = _parentVnode;
      return vnode
    };
  }

  /*  */

  function ensureCtor (comp, base) {
    if (
      comp.__esModule ||
      (hasSymbol && comp[Symbol.toStringTag] === 'Module')
    ) {
      comp = comp.default;
    }
    return isObject(comp)
      ? base.extend(comp)
      : comp
  }

  function createAsyncPlaceholder (
    factory,
    data,
    context,
    children,
    tag
  ) {
    var node = createEmptyVNode();
    node.asyncFactory = factory;
    node.asyncMeta = { data: data, context: context, children: children, tag: tag };
    return node
  }

  function resolveAsyncComponent (
    factory,
    baseCtor
  ) {
    if (isTrue(factory.error) && isDef(factory.errorComp)) {
      return factory.errorComp
    }

    if (isDef(factory.resolved)) {
      return factory.resolved
    }

    var owner = currentRenderingInstance;
    if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
      // already pending
      factory.owners.push(owner);
    }

    if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
      return factory.loadingComp
    }

    if (owner && !isDef(factory.owners)) {
      var owners = factory.owners = [owner];
      var sync = true;
      var timerLoading = null;
      var timerTimeout = null

      ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

      var forceRender = function (renderCompleted) {
        for (var i = 0, l = owners.length; i < l; i++) {
          (owners[i]).$forceUpdate();
        }

        if (renderCompleted) {
          owners.length = 0;
          if (timerLoading !== null) {
            clearTimeout(timerLoading);
            timerLoading = null;
          }
          if (timerTimeout !== null) {
            clearTimeout(timerTimeout);
            timerTimeout = null;
          }
        }
      };

      var resolve = once(function (res) {
        // cache resolved
        factory.resolved = ensureCtor(res, baseCtor);
        // invoke callbacks only if this is not a synchronous resolve
        // (async resolves are shimmed as synchronous during SSR)
        if (!sync) {
          forceRender(true);
        } else {
          owners.length = 0;
        }
      });

      var reject = once(function (reason) {
        if (isDef(factory.errorComp)) {
          factory.error = true;
          forceRender(true);
        }
      });

      var res = factory(resolve, reject);

      if (isObject(res)) {
        if (isPromise(res)) {
          // () => Promise
          if (isUndef(factory.resolved)) {
            res.then(resolve, reject);
          }
        } else if (isPromise(res.component)) {
          res.component.then(resolve, reject);

          if (isDef(res.error)) {
            factory.errorComp = ensureCtor(res.error, baseCtor);
          }

          if (isDef(res.loading)) {
            factory.loadingComp = ensureCtor(res.loading, baseCtor);
            if (res.delay === 0) {
              factory.loading = true;
            } else {
              timerLoading = setTimeout(function () {
                timerLoading = null;
                if (isUndef(factory.resolved) && isUndef(factory.error)) {
                  factory.loading = true;
                  forceRender(false);
                }
              }, res.delay || 200);
            }
          }

          if (isDef(res.timeout)) {
            timerTimeout = setTimeout(function () {
              timerTimeout = null;
              if (isUndef(factory.resolved)) {
                reject(
                   null
                );
              }
            }, res.timeout);
          }
        }
      }

      sync = false;
      // return in case resolved synchronously
      return factory.loading
        ? factory.loadingComp
        : factory.resolved
    }
  }

  /*  */

  function isAsyncPlaceholder (node) {
    return node.isComment && node.asyncFactory
  }

  /*  */

  function getFirstComponentChild (children) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
          return c
        }
      }
    }
  }

  /*  */

  /*  */

  function initEvents (vm) {
    vm._events = Object.create(null);
    vm._hasHookEvent = false;
    // init parent attached events
    var listeners = vm.$options._parentListeners;
    if (listeners) {
      updateComponentListeners(vm, listeners);
    }
  }

  var target;

  function add (event, fn) {
    target.$on(event, fn);
  }

  function remove$1 (event, fn) {
    target.$off(event, fn);
  }

  function createOnceHandler (event, fn) {
    var _target = target;
    return function onceHandler () {
      var res = fn.apply(null, arguments);
      if (res !== null) {
        _target.$off(event, onceHandler);
      }
    }
  }

  function updateComponentListeners (
    vm,
    listeners,
    oldListeners
  ) {
    target = vm;
    updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
    target = undefined;
  }

  function eventsMixin (Vue) {
    var hookRE = /^hook:/;
    Vue.prototype.$on = function (event, fn) {
      var vm = this;
      if (Array.isArray(event)) {
        for (var i = 0, l = event.length; i < l; i++) {
          vm.$on(event[i], fn);
        }
      } else {
        (vm._events[event] || (vm._events[event] = [])).push(fn);
        // optimize hook:event cost by using a boolean flag marked at registration
        // instead of a hash lookup
        if (hookRE.test(event)) {
          vm._hasHookEvent = true;
        }
      }
      return vm
    };

    Vue.prototype.$once = function (event, fn) {
      var vm = this;
      function on () {
        vm.$off(event, on);
        fn.apply(vm, arguments);
      }
      on.fn = fn;
      vm.$on(event, on);
      return vm
    };

    Vue.prototype.$off = function (event, fn) {
      var vm = this;
      // all
      if (!arguments.length) {
        vm._events = Object.create(null);
        return vm
      }
      // array of events
      if (Array.isArray(event)) {
        for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
          vm.$off(event[i$1], fn);
        }
        return vm
      }
      // specific event
      var cbs = vm._events[event];
      if (!cbs) {
        return vm
      }
      if (!fn) {
        vm._events[event] = null;
        return vm
      }
      // specific handler
      var cb;
      var i = cbs.length;
      while (i--) {
        cb = cbs[i];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1);
          break
        }
      }
      return vm
    };

    Vue.prototype.$emit = function (event) {
      var vm = this;
      var cbs = vm._events[event];
      if (cbs) {
        cbs = cbs.length > 1 ? toArray(cbs) : cbs;
        var args = toArray(arguments, 1);
        var info = "event handler for \"" + event + "\"";
        for (var i = 0, l = cbs.length; i < l; i++) {
          invokeWithErrorHandling(cbs[i], vm, args, vm, info);
        }
      }
      return vm
    };
  }

  /*  */

  var activeInstance = null;

  function setActiveInstance(vm) {
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    return function () {
      activeInstance = prevActiveInstance;
    }
  }

  function initLifecycle (vm) {
    var options = vm.$options;

    // locate first non-abstract parent
    var parent = options.parent;
    if (parent && !options.abstract) {
      while (parent.$options.abstract && parent.$parent) {
        parent = parent.$parent;
      }
      parent.$children.push(vm);
    }

    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
  }

  function lifecycleMixin (Vue) {
    Vue.prototype._update = function (vnode, hydrating) {
      var vm = this;
      var prevEl = vm.$el;
      var prevVnode = vm._vnode;
      var restoreActiveInstance = setActiveInstance(vm);
      vm._vnode = vnode;
      // Vue.prototype.__patch__ is injected in entry points
      // based on the rendering backend used.
      if (!prevVnode) {
        // initial render
        vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
      } else {
        // updates
        vm.$el = vm.__patch__(prevVnode, vnode);
      }
      restoreActiveInstance();
      // update __vue__ reference
      if (prevEl) {
        prevEl.__vue__ = null;
      }
      if (vm.$el) {
        vm.$el.__vue__ = vm;
      }
      // if parent is an HOC, update its $el as well
      if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
        vm.$parent.$el = vm.$el;
      }
      // updated hook is called by the scheduler to ensure that children are
      // updated in a parent's updated hook.
    };

    Vue.prototype.$forceUpdate = function () {
      var vm = this;
      if (vm._watcher) {
        vm._watcher.update();
      }
    };

    Vue.prototype.$destroy = function () {
      var vm = this;
      if (vm._isBeingDestroyed) {
        return
      }
      callHook(vm, 'beforeDestroy');
      vm._isBeingDestroyed = true;
      // remove self from parent
      var parent = vm.$parent;
      if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
        remove(parent.$children, vm);
      }
      // teardown watchers
      if (vm._watcher) {
        vm._watcher.teardown();
      }
      var i = vm._watchers.length;
      while (i--) {
        vm._watchers[i].teardown();
      }
      // remove reference from data ob
      // frozen object may not have observer.
      if (vm._data.__ob__) {
        vm._data.__ob__.vmCount--;
      }
      // call the last hook...
      vm._isDestroyed = true;
      // invoke destroy hooks on current rendered tree
      vm.__patch__(vm._vnode, null);
      // fire destroyed hook
      callHook(vm, 'destroyed');
      // turn off all instance listeners.
      vm.$off();
      // remove __vue__ reference
      if (vm.$el) {
        vm.$el.__vue__ = null;
      }
      // release circular reference (#6759)
      if (vm.$vnode) {
        vm.$vnode.parent = null;
      }
    };
  }

  function mountComponent (
    vm,
    el,
    hydrating
  ) {
    vm.$el = el;
    if (!vm.$options.render) {
      vm.$options.render = createEmptyVNode;
    }
    callHook(vm, 'beforeMount');

    var updateComponent;
    /* istanbul ignore if */
    {
      updateComponent = function () {
        vm._update(vm._render(), hydrating);
      };
    }

    // we set this to vm._watcher inside the watcher's constructor
    // since the watcher's initial patch may call $forceUpdate (e.g. inside child
    // component's mounted hook), which relies on vm._watcher being already defined
    new Watcher(vm, updateComponent, noop, {
      before: function before () {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, 'beforeUpdate');
        }
      }
    }, true /* isRenderWatcher */);
    hydrating = false;

    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
      vm._isMounted = true;
      callHook(vm, 'mounted');
    }
    return vm
  }

  function updateChildComponent (
    vm,
    propsData,
    listeners,
    parentVnode,
    renderChildren
  ) {

    // determine whether component has slot children
    // we need to do this before overwriting $options._renderChildren.

    // check if there are dynamic scopedSlots (hand-written or compiled but with
    // dynamic slot names). Static scoped slots compiled from template has the
    // "$stable" marker.
    var newScopedSlots = parentVnode.data.scopedSlots;
    var oldScopedSlots = vm.$scopedSlots;
    var hasDynamicScopedSlot = !!(
      (newScopedSlots && !newScopedSlots.$stable) ||
      (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
      (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
    );

    // Any static slot children from the parent may have changed during parent's
    // update. Dynamic scoped slots may also have changed. In such cases, a forced
    // update is necessary to ensure correctness.
    var needsForceUpdate = !!(
      renderChildren ||               // has new static slots
      vm.$options._renderChildren ||  // has old static slots
      hasDynamicScopedSlot
    );

    vm.$options._parentVnode = parentVnode;
    vm.$vnode = parentVnode; // update vm's placeholder node without re-render

    if (vm._vnode) { // update child tree's parent
      vm._vnode.parent = parentVnode;
    }
    vm.$options._renderChildren = renderChildren;

    // update $attrs and $listeners hash
    // these are also reactive so they may trigger child update if the child
    // used them during render
    vm.$attrs = parentVnode.data.attrs || emptyObject;
    vm.$listeners = listeners || emptyObject;

    // update props
    if (propsData && vm.$options.props) {
      toggleObserving(false);
      var props = vm._props;
      var propKeys = vm.$options._propKeys || [];
      for (var i = 0; i < propKeys.length; i++) {
        var key = propKeys[i];
        var propOptions = vm.$options.props; // wtf flow?
        props[key] = validateProp(key, propOptions, propsData, vm);
      }
      toggleObserving(true);
      // keep a copy of raw propsData
      vm.$options.propsData = propsData;
    }

    // update listeners
    listeners = listeners || emptyObject;
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);

    // resolve slots + force update if has children
    if (needsForceUpdate) {
      vm.$slots = resolveSlots(renderChildren, parentVnode.context);
      vm.$forceUpdate();
    }
  }

  function isInInactiveTree (vm) {
    while (vm && (vm = vm.$parent)) {
      if (vm._inactive) { return true }
    }
    return false
  }

  function activateChildComponent (vm, direct) {
    if (direct) {
      vm._directInactive = false;
      if (isInInactiveTree(vm)) {
        return
      }
    } else if (vm._directInactive) {
      return
    }
    if (vm._inactive || vm._inactive === null) {
      vm._inactive = false;
      for (var i = 0; i < vm.$children.length; i++) {
        activateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'activated');
    }
  }

  function deactivateChildComponent (vm, direct) {
    if (direct) {
      vm._directInactive = true;
      if (isInInactiveTree(vm)) {
        return
      }
    }
    if (!vm._inactive) {
      vm._inactive = true;
      for (var i = 0; i < vm.$children.length; i++) {
        deactivateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'deactivated');
    }
  }

  function callHook (vm, hook) {
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        invokeWithErrorHandling(handlers[i], vm, null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
    popTarget();
  }

  var queue = [];
  var activatedChildren = [];
  var has = {};
  var waiting = false;
  var flushing = false;
  var index = 0;

  /**
   * Reset the scheduler's state.
   */
  function resetSchedulerState () {
    index = queue.length = activatedChildren.length = 0;
    has = {};
    waiting = flushing = false;
  }

  // Async edge case #6566 requires saving the timestamp when event listeners are
  // attached. However, calling performance.now() has a perf overhead especially
  // if the page has thousands of event listeners. Instead, we take a timestamp
  // every time the scheduler flushes and use that for all event listeners
  // attached during that flush.
  var currentFlushTimestamp = 0;

  // Async edge case fix requires storing an event listener's attach timestamp.
  var getNow = Date.now;

  // Determine what event timestamp the browser is using. Annoyingly, the
  // timestamp can either be hi-res (relative to page load) or low-res
  // (relative to UNIX epoch), so in order to compare time we have to use the
  // same timestamp type when saving the flush timestamp.
  // All IE versions use low-res event timestamps, and have problematic clock
  // implementations (#9632)
  if (inBrowser && !isIE) {
    var performance = window.performance;
    if (
      performance &&
      typeof performance.now === 'function' &&
      getNow() > document.createEvent('Event').timeStamp
    ) {
      // if the event timestamp, although evaluated AFTER the Date.now(), is
      // smaller than it, it means the event is using a hi-res timestamp,
      // and we need to use the hi-res version for event listener timestamps as
      // well.
      getNow = function () { return performance.now(); };
    }
  }

  /**
   * Flush both queues and run the watchers.
   */
  function flushSchedulerQueue () {
    currentFlushTimestamp = getNow();
    flushing = true;
    var watcher, id;

    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child)
    // 2. A component's user watchers are run before its render watcher (because
    //    user watchers are created before the render watcher)
    // 3. If a component is destroyed during a parent component's watcher run,
    //    its watchers can be skipped.
    queue.sort(function (a, b) { return a.id - b.id; });

    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (index = 0; index < queue.length; index++) {
      watcher = queue[index];
      if (watcher.before) {
        watcher.before();
      }
      id = watcher.id;
      has[id] = null;
      watcher.run();
    }

    // keep copies of post queues before resetting state
    var activatedQueue = activatedChildren.slice();
    var updatedQueue = queue.slice();

    resetSchedulerState();

    // call component updated and activated hooks
    callActivatedHooks(activatedQueue);
    callUpdatedHooks(updatedQueue);

    // devtool hook
    /* istanbul ignore if */
    if (devtools && config.devtools) {
      devtools.emit('flush');
    }
  }

  function callUpdatedHooks (queue) {
    var i = queue.length;
    while (i--) {
      var watcher = queue[i];
      var vm = watcher.vm;
      if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'updated');
      }
    }
  }

  /**
   * Queue a kept-alive component that was activated during patch.
   * The queue will be processed after the entire tree has been patched.
   */
  function queueActivatedComponent (vm) {
    // setting _inactive to false here so that a render function can
    // rely on checking whether it's in an inactive tree (e.g. router-view)
    vm._inactive = false;
    activatedChildren.push(vm);
  }

  function callActivatedHooks (queue) {
    for (var i = 0; i < queue.length; i++) {
      queue[i]._inactive = true;
      activateChildComponent(queue[i], true /* true */);
    }
  }

  /**
   * Push a watcher into the watcher queue.
   * Jobs with duplicate IDs will be skipped unless it's
   * pushed when the queue is being flushed.
   */
  function queueWatcher (watcher) {
    var id = watcher.id;
    if (has[id] == null) {
      has[id] = true;
      if (!flushing) {
        queue.push(watcher);
      } else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        var i = queue.length - 1;
        while (i > index && queue[i].id > watcher.id) {
          i--;
        }
        queue.splice(i + 1, 0, watcher);
      }
      // queue the flush
      if (!waiting) {
        waiting = true;
        nextTick(flushSchedulerQueue);
      }
    }
  }

  /*  */



  var uid$2 = 0;

  /**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   * This is used for both the $watch() api and directives.
   */
  var Watcher = function Watcher (
    vm,
    expOrFn,
    cb,
    options,
    isRenderWatcher
  ) {
    this.vm = vm;
    if (isRenderWatcher) {
      vm._watcher = this;
    }
    vm._watchers.push(this);
    // options
    if (options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.lazy = !!options.lazy;
      this.sync = !!options.sync;
      this.before = options.before;
    } else {
      this.deep = this.user = this.lazy = this.sync = false;
    }
    this.cb = cb;
    this.id = ++uid$2; // uid for batching
    this.active = true;
    this.dirty = this.lazy; // for lazy watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new _Set();
    this.newDepIds = new _Set();
    this.expression =  '';
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
      if (!this.getter) {
        this.getter = noop;
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get();
  };

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  Watcher.prototype.get = function get () {
    pushTarget(this);
    var value;
    var vm = this.vm;
    try {
      value = this.getter.call(vm, vm);
    } catch (e) {
      if (this.user) {
        handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value);
      }
      popTarget();
      this.cleanupDeps();
    }
    return value
  };

  /**
   * Add a dependency to this directive.
   */
  Watcher.prototype.addDep = function addDep (dep) {
    var id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  };

  /**
   * Clean up for dependency collection.
   */
  Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var i = this.deps.length;
    while (i--) {
      var dep = this.deps[i];
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this);
      }
    }
    var tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
  };

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  Watcher.prototype.update = function update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  };

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  Watcher.prototype.run = function run () {
    if (this.active) {
      var value = this.get();
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        var oldValue = this.value;
        this.value = value;
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue);
          } catch (e) {
            handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
          }
        } else {
          this.cb.call(this.vm, value, oldValue);
        }
      }
    }
  };

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  Watcher.prototype.evaluate = function evaluate () {
    this.value = this.get();
    this.dirty = false;
  };

  /**
   * Depend on all deps collected by this watcher.
   */
  Watcher.prototype.depend = function depend () {
    var i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
  };

  /**
   * Remove self from all dependencies' subscriber list.
   */
  Watcher.prototype.teardown = function teardown () {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this);
      }
      var i = this.deps.length;
      while (i--) {
        this.deps[i].removeSub(this);
      }
      this.active = false;
    }
  };

  /*  */

  var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };

  function proxy (target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter () {
      return this[sourceKey][key]
    };
    sharedPropertyDefinition.set = function proxySetter (val) {
      this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function initState (vm) {
    vm._watchers = [];
    var opts = vm.$options;
    if (opts.props) { initProps(vm, opts.props); }
    if (opts.methods) { initMethods(vm, opts.methods); }
    if (opts.data) {
      initData(vm);
    } else {
      observe(vm._data = {}, true /* asRootData */);
    }
    if (opts.computed) { initComputed(vm, opts.computed); }
    if (opts.watch && opts.watch !== nativeWatch) {
      initWatch(vm, opts.watch);
    }
  }

  function initProps (vm, propsOptions) {
    var propsData = vm.$options.propsData || {};
    var props = vm._props = {};
    // cache prop keys so that future props updates can iterate using Array
    // instead of dynamic object key enumeration.
    var keys = vm.$options._propKeys = [];
    var isRoot = !vm.$parent;
    // root instance props should be converted
    if (!isRoot) {
      toggleObserving(false);
    }
    var loop = function ( key ) {
      keys.push(key);
      var value = validateProp(key, propsOptions, propsData, vm);
      /* istanbul ignore else */
      {
        defineReactive$$1(props, key, value);
      }
      // static props are already proxied on the component's prototype
      // during Vue.extend(). We only need to proxy props defined at
      // instantiation here.
      if (!(key in vm)) {
        proxy(vm, "_props", key);
      }
    };

    for (var key in propsOptions) loop( key );
    toggleObserving(true);
  }

  function initData (vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function'
      ? getData(data, vm)
      : data || {};
    if (!isPlainObject(data)) {
      data = {};
    }
    // proxy data on instance
    var keys = Object.keys(data);
    var props = vm.$options.props;
    var methods = vm.$options.methods;
    var i = keys.length;
    while (i--) {
      var key = keys[i];
      if (props && hasOwn(props, key)) ; else if (!isReserved(key)) {
        proxy(vm, "_data", key);
      }
    }
    // observe data
    observe(data, true /* asRootData */);
  }

  function getData (data, vm) {
    // #7573 disable dep collection when invoking data getters
    pushTarget();
    try {
      return data.call(vm, vm)
    } catch (e) {
      handleError(e, vm, "data()");
      return {}
    } finally {
      popTarget();
    }
  }

  var computedWatcherOptions = { lazy: true };

  function initComputed (vm, computed) {
    // $flow-disable-line
    var watchers = vm._computedWatchers = Object.create(null);
    // computed properties are just getters during SSR
    var isSSR = isServerRendering();

    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get;

      if (!isSSR) {
        // create internal watcher for the computed property.
        watchers[key] = new Watcher(
          vm,
          getter || noop,
          noop,
          computedWatcherOptions
        );
      }

      // component-defined computed properties are already defined on the
      // component prototype. We only need to define computed properties defined
      // at instantiation here.
      if (!(key in vm)) {
        defineComputed(vm, key, userDef);
      }
    }
  }

  function defineComputed (
    target,
    key,
    userDef
  ) {
    var shouldCache = !isServerRendering();
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = shouldCache
        ? createComputedGetter(key)
        : createGetterInvoker(userDef);
      sharedPropertyDefinition.set = noop;
    } else {
      sharedPropertyDefinition.get = userDef.get
        ? shouldCache && userDef.cache !== false
          ? createComputedGetter(key)
          : createGetterInvoker(userDef.get)
        : noop;
      sharedPropertyDefinition.set = userDef.set || noop;
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function createComputedGetter (key) {
    return function computedGetter () {
      var watcher = this._computedWatchers && this._computedWatchers[key];
      if (watcher) {
        if (watcher.dirty) {
          watcher.evaluate();
        }
        if (Dep.target) {
          watcher.depend();
        }
        return watcher.value
      }
    }
  }

  function createGetterInvoker(fn) {
    return function computedGetter () {
      return fn.call(this, this)
    }
  }

  function initMethods (vm, methods) {
    var props = vm.$options.props;
    for (var key in methods) {
      vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
    }
  }

  function initWatch (vm, watch) {
    for (var key in watch) {
      var handler = watch[key];
      if (Array.isArray(handler)) {
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }

  function createWatcher (
    vm,
    expOrFn,
    handler,
    options
  ) {
    if (isPlainObject(handler)) {
      options = handler;
      handler = handler.handler;
    }
    if (typeof handler === 'string') {
      handler = vm[handler];
    }
    return vm.$watch(expOrFn, handler, options)
  }

  function stateMixin (Vue) {
    // flow somehow has problems with directly declared definition object
    // when using Object.defineProperty, so we have to procedurally build up
    // the object here.
    var dataDef = {};
    dataDef.get = function () { return this._data };
    var propsDef = {};
    propsDef.get = function () { return this._props };
    Object.defineProperty(Vue.prototype, '$data', dataDef);
    Object.defineProperty(Vue.prototype, '$props', propsDef);

    Vue.prototype.$set = set;
    Vue.prototype.$delete = del;

    Vue.prototype.$watch = function (
      expOrFn,
      cb,
      options
    ) {
      var vm = this;
      if (isPlainObject(cb)) {
        return createWatcher(vm, expOrFn, cb, options)
      }
      options = options || {};
      options.user = true;
      var watcher = new Watcher(vm, expOrFn, cb, options);
      if (options.immediate) {
        try {
          cb.call(vm, watcher.value);
        } catch (error) {
          handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
        }
      }
      return function unwatchFn () {
        watcher.teardown();
      }
    };
  }

  /*  */

  var uid$3 = 0;

  function initMixin (Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      // a uid
      vm._uid = uid$3++;

      // a flag to avoid this being observed
      vm._isVue = true;
      // merge options
      if (options && options._isComponent) {
        // optimize internal component instantiation
        // since dynamic options merging is pretty slow, and none of the
        // internal component options needs special treatment.
        initInternalComponent(vm, options);
      } else {
        vm.$options = mergeOptions(
          resolveConstructorOptions(vm.constructor),
          options || {},
          vm
        );
      }
      /* istanbul ignore else */
      {
        vm._renderProxy = vm;
      }
      // expose real self
      vm._self = vm;
      initLifecycle(vm);
      initEvents(vm);
      initRender(vm);
      callHook(vm, 'beforeCreate');
      initInjections(vm); // resolve injections before data/props
      initState(vm);
      initProvide(vm); // resolve provide after data/props
      callHook(vm, 'created');

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
  }

  function initInternalComponent (vm, options) {
    var opts = vm.$options = Object.create(vm.constructor.options);
    // doing this because it's faster than dynamic enumeration.
    var parentVnode = options._parentVnode;
    opts.parent = options.parent;
    opts._parentVnode = parentVnode;

    var vnodeComponentOptions = parentVnode.componentOptions;
    opts.propsData = vnodeComponentOptions.propsData;
    opts._parentListeners = vnodeComponentOptions.listeners;
    opts._renderChildren = vnodeComponentOptions.children;
    opts._componentTag = vnodeComponentOptions.tag;

    if (options.render) {
      opts.render = options.render;
      opts.staticRenderFns = options.staticRenderFns;
    }
  }

  function resolveConstructorOptions (Ctor) {
    var options = Ctor.options;
    if (Ctor.super) {
      var superOptions = resolveConstructorOptions(Ctor.super);
      var cachedSuperOptions = Ctor.superOptions;
      if (superOptions !== cachedSuperOptions) {
        // super option changed,
        // need to resolve new options.
        Ctor.superOptions = superOptions;
        // check if there are any late-modified/attached options (#4976)
        var modifiedOptions = resolveModifiedOptions(Ctor);
        // update base extend options
        if (modifiedOptions) {
          extend(Ctor.extendOptions, modifiedOptions);
        }
        options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
        if (options.name) {
          options.components[options.name] = Ctor;
        }
      }
    }
    return options
  }

  function resolveModifiedOptions (Ctor) {
    var modified;
    var latest = Ctor.options;
    var sealed = Ctor.sealedOptions;
    for (var key in latest) {
      if (latest[key] !== sealed[key]) {
        if (!modified) { modified = {}; }
        modified[key] = latest[key];
      }
    }
    return modified
  }

  function Vue (options) {
    this._init(options);
  }

  initMixin(Vue);
  stateMixin(Vue);
  eventsMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);

  /*  */

  function initUse (Vue) {
    Vue.use = function (plugin) {
      var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
      if (installedPlugins.indexOf(plugin) > -1) {
        return this
      }

      // additional parameters
      var args = toArray(arguments, 1);
      args.unshift(this);
      if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);
      } else if (typeof plugin === 'function') {
        plugin.apply(null, args);
      }
      installedPlugins.push(plugin);
      return this
    };
  }

  /*  */

  function initMixin$1 (Vue) {
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
      return this
    };
  }

  /*  */

  function initExtend (Vue) {
    /**
     * Each instance constructor, including Vue, has a unique
     * cid. This enables us to create wrapped "child
     * constructors" for prototypal inheritance and cache them.
     */
    Vue.cid = 0;
    var cid = 1;

    /**
     * Class inheritance
     */
    Vue.extend = function (extendOptions) {
      extendOptions = extendOptions || {};
      var Super = this;
      var SuperId = Super.cid;
      var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
      if (cachedCtors[SuperId]) {
        return cachedCtors[SuperId]
      }

      var name = extendOptions.name || Super.options.name;

      var Sub = function VueComponent (options) {
        this._init(options);
      };
      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.cid = cid++;
      Sub.options = mergeOptions(
        Super.options,
        extendOptions
      );
      Sub['super'] = Super;

      // For props and computed properties, we define the proxy getters on
      // the Vue instances at extension time, on the extended prototype. This
      // avoids Object.defineProperty calls for each instance created.
      if (Sub.options.props) {
        initProps$1(Sub);
      }
      if (Sub.options.computed) {
        initComputed$1(Sub);
      }

      // allow further extension/mixin/plugin usage
      Sub.extend = Super.extend;
      Sub.mixin = Super.mixin;
      Sub.use = Super.use;

      // create asset registers, so extended classes
      // can have their private assets too.
      ASSET_TYPES.forEach(function (type) {
        Sub[type] = Super[type];
      });
      // enable recursive self-lookup
      if (name) {
        Sub.options.components[name] = Sub;
      }

      // keep a reference to the super options at extension time.
      // later at instantiation we can check if Super's options have
      // been updated.
      Sub.superOptions = Super.options;
      Sub.extendOptions = extendOptions;
      Sub.sealedOptions = extend({}, Sub.options);

      // cache constructor
      cachedCtors[SuperId] = Sub;
      return Sub
    };
  }

  function initProps$1 (Comp) {
    var props = Comp.options.props;
    for (var key in props) {
      proxy(Comp.prototype, "_props", key);
    }
  }

  function initComputed$1 (Comp) {
    var computed = Comp.options.computed;
    for (var key in computed) {
      defineComputed(Comp.prototype, key, computed[key]);
    }
  }

  /*  */

  function initAssetRegisters (Vue) {
    /**
     * Create asset registration methods.
     */
    ASSET_TYPES.forEach(function (type) {
      Vue[type] = function (
        id,
        definition
      ) {
        if (!definition) {
          return this.options[type + 's'][id]
        } else {
          if (type === 'component' && isPlainObject(definition)) {
            definition.name = definition.name || id;
            definition = this.options._base.extend(definition);
          }
          if (type === 'directive' && typeof definition === 'function') {
            definition = { bind: definition, update: definition };
          }
          this.options[type + 's'][id] = definition;
          return definition
        }
      };
    });
  }

  /*  */



  function getComponentName (opts) {
    return opts && (opts.Ctor.options.name || opts.tag)
  }

  function matches (pattern, name) {
    if (Array.isArray(pattern)) {
      return pattern.indexOf(name) > -1
    } else if (typeof pattern === 'string') {
      return pattern.split(',').indexOf(name) > -1
    } else if (isRegExp(pattern)) {
      return pattern.test(name)
    }
    /* istanbul ignore next */
    return false
  }

  function pruneCache (keepAliveInstance, filter) {
    var cache = keepAliveInstance.cache;
    var keys = keepAliveInstance.keys;
    var _vnode = keepAliveInstance._vnode;
    for (var key in cache) {
      var cachedNode = cache[key];
      if (cachedNode) {
        var name = getComponentName(cachedNode.componentOptions);
        if (name && !filter(name)) {
          pruneCacheEntry(cache, key, keys, _vnode);
        }
      }
    }
  }

  function pruneCacheEntry (
    cache,
    key,
    keys,
    current
  ) {
    var cached$$1 = cache[key];
    if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
      cached$$1.componentInstance.$destroy();
    }
    cache[key] = null;
    remove(keys, key);
  }

  var patternTypes = [String, RegExp, Array];

  var KeepAlive = {
    name: 'keep-alive',
    abstract: true,

    props: {
      include: patternTypes,
      exclude: patternTypes,
      max: [String, Number]
    },

    created: function created () {
      this.cache = Object.create(null);
      this.keys = [];
    },

    destroyed: function destroyed () {
      for (var key in this.cache) {
        pruneCacheEntry(this.cache, key, this.keys);
      }
    },

    mounted: function mounted () {
      var this$1 = this;

      this.$watch('include', function (val) {
        pruneCache(this$1, function (name) { return matches(val, name); });
      });
      this.$watch('exclude', function (val) {
        pruneCache(this$1, function (name) { return !matches(val, name); });
      });
    },

    render: function render () {
      var slot = this.$slots.default;
      var vnode = getFirstComponentChild(slot);
      var componentOptions = vnode && vnode.componentOptions;
      if (componentOptions) {
        // check pattern
        var name = getComponentName(componentOptions);
        var ref = this;
        var include = ref.include;
        var exclude = ref.exclude;
        if (
          // not included
          (include && (!name || !matches(include, name))) ||
          // excluded
          (exclude && name && matches(exclude, name))
        ) {
          return vnode
        }

        var ref$1 = this;
        var cache = ref$1.cache;
        var keys = ref$1.keys;
        var key = vnode.key == null
          // same constructor may get registered as different local components
          // so cid alone is not enough (#3269)
          ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
          : vnode.key;
        if (cache[key]) {
          vnode.componentInstance = cache[key].componentInstance;
          // make current key freshest
          remove(keys, key);
          keys.push(key);
        } else {
          cache[key] = vnode;
          keys.push(key);
          // prune oldest entry
          if (this.max && keys.length > parseInt(this.max)) {
            pruneCacheEntry(cache, keys[0], keys, this._vnode);
          }
        }

        vnode.data.keepAlive = true;
      }
      return vnode || (slot && slot[0])
    }
  };

  var builtInComponents = {
    KeepAlive: KeepAlive
  };

  /*  */

  function initGlobalAPI (Vue) {
    // config
    var configDef = {};
    configDef.get = function () { return config; };
    Object.defineProperty(Vue, 'config', configDef);

    // exposed util methods.
    // NOTE: these are not considered part of the public API - avoid relying on
    // them unless you are aware of the risk.
    Vue.util = {
      warn: warn,
      extend: extend,
      mergeOptions: mergeOptions,
      defineReactive: defineReactive$$1
    };

    Vue.set = set;
    Vue.delete = del;
    Vue.nextTick = nextTick;

    // 2.6 explicit observable API
    Vue.observable = function (obj) {
      observe(obj);
      return obj
    };

    Vue.options = Object.create(null);
    ASSET_TYPES.forEach(function (type) {
      Vue.options[type + 's'] = Object.create(null);
    });

    // this is used to identify the "base" constructor to extend all plain-object
    // components with in Weex's multi-instance scenarios.
    Vue.options._base = Vue;

    extend(Vue.options.components, builtInComponents);

    initUse(Vue);
    initMixin$1(Vue);
    initExtend(Vue);
    initAssetRegisters(Vue);
  }

  initGlobalAPI(Vue);

  Object.defineProperty(Vue.prototype, '$isServer', {
    get: isServerRendering
  });

  Object.defineProperty(Vue.prototype, '$ssrContext', {
    get: function get () {
      /* istanbul ignore next */
      return this.$vnode && this.$vnode.ssrContext
    }
  });

  // expose FunctionalRenderContext for ssr runtime helper installation
  Object.defineProperty(Vue, 'FunctionalRenderContext', {
    value: FunctionalRenderContext
  });

  Vue.version = '2.6.11';

  /*  */

  // these are reserved for web because they are directly compiled away
  // during template compilation
  var isReservedAttr = makeMap('style,class');

  // attributes that should be using props for binding
  var acceptValue = makeMap('input,textarea,option,select,progress');
  var mustUseProp = function (tag, type, attr) {
    return (
      (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
      (attr === 'selected' && tag === 'option') ||
      (attr === 'checked' && tag === 'input') ||
      (attr === 'muted' && tag === 'video')
    )
  };

  var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

  var isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');

  var convertEnumeratedValue = function (key, value) {
    return isFalsyAttrValue(value) || value === 'false'
      ? 'false'
      // allow arbitrary string value for contenteditable
      : key === 'contenteditable' && isValidContentEditableValue(value)
        ? value
        : 'true'
  };

  var isBooleanAttr = makeMap(
    'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
    'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
    'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
    'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
    'required,reversed,scoped,seamless,selected,sortable,translate,' +
    'truespeed,typemustmatch,visible'
  );

  var xlinkNS = 'http://www.w3.org/1999/xlink';

  var isXlink = function (name) {
    return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
  };

  var getXlinkProp = function (name) {
    return isXlink(name) ? name.slice(6, name.length) : ''
  };

  var isFalsyAttrValue = function (val) {
    return val == null || val === false
  };

  /*  */

  function genClassForVnode (vnode) {
    var data = vnode.data;
    var parentNode = vnode;
    var childNode = vnode;
    while (isDef(childNode.componentInstance)) {
      childNode = childNode.componentInstance._vnode;
      if (childNode && childNode.data) {
        data = mergeClassData(childNode.data, data);
      }
    }
    while (isDef(parentNode = parentNode.parent)) {
      if (parentNode && parentNode.data) {
        data = mergeClassData(data, parentNode.data);
      }
    }
    return renderClass(data.staticClass, data.class)
  }

  function mergeClassData (child, parent) {
    return {
      staticClass: concat(child.staticClass, parent.staticClass),
      class: isDef(child.class)
        ? [child.class, parent.class]
        : parent.class
    }
  }

  function renderClass (
    staticClass,
    dynamicClass
  ) {
    if (isDef(staticClass) || isDef(dynamicClass)) {
      return concat(staticClass, stringifyClass(dynamicClass))
    }
    /* istanbul ignore next */
    return ''
  }

  function concat (a, b) {
    return a ? b ? (a + ' ' + b) : a : (b || '')
  }

  function stringifyClass (value) {
    if (Array.isArray(value)) {
      return stringifyArray(value)
    }
    if (isObject(value)) {
      return stringifyObject(value)
    }
    if (typeof value === 'string') {
      return value
    }
    /* istanbul ignore next */
    return ''
  }

  function stringifyArray (value) {
    var res = '';
    var stringified;
    for (var i = 0, l = value.length; i < l; i++) {
      if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
        if (res) { res += ' '; }
        res += stringified;
      }
    }
    return res
  }

  function stringifyObject (value) {
    var res = '';
    for (var key in value) {
      if (value[key]) {
        if (res) { res += ' '; }
        res += key;
      }
    }
    return res
  }

  /*  */

  var namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML'
  };

  var isHTMLTag = makeMap(
    'html,body,base,head,link,meta,style,title,' +
    'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
    'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
    'embed,object,param,source,canvas,script,noscript,del,ins,' +
    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
    'output,progress,select,textarea,' +
    'details,dialog,menu,menuitem,summary,' +
    'content,element,shadow,template,blockquote,iframe,tfoot'
  );

  // this map is intentionally selective, only covering SVG elements that may
  // contain child elements.
  var isSVG = makeMap(
    'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
    'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
    'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
    true
  );

  var isReservedTag = function (tag) {
    return isHTMLTag(tag) || isSVG(tag)
  };

  function getTagNamespace (tag) {
    if (isSVG(tag)) {
      return 'svg'
    }
    // basic support for MathML
    // note it doesn't support other MathML elements being component roots
    if (tag === 'math') {
      return 'math'
    }
  }

  var unknownElementCache = Object.create(null);
  function isUnknownElement (tag) {
    /* istanbul ignore if */
    if (!inBrowser) {
      return true
    }
    if (isReservedTag(tag)) {
      return false
    }
    tag = tag.toLowerCase();
    /* istanbul ignore if */
    if (unknownElementCache[tag] != null) {
      return unknownElementCache[tag]
    }
    var el = document.createElement(tag);
    if (tag.indexOf('-') > -1) {
      // http://stackoverflow.com/a/28210364/1070244
      return (unknownElementCache[tag] = (
        el.constructor === window.HTMLUnknownElement ||
        el.constructor === window.HTMLElement
      ))
    } else {
      return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
    }
  }

  var isTextInputType = makeMap('text,number,password,search,email,tel,url');

  /*  */

  /**
   * Query an element selector if it's not an element already.
   */
  function query (el) {
    if (typeof el === 'string') {
      var selected = document.querySelector(el);
      if (!selected) {
        return document.createElement('div')
      }
      return selected
    } else {
      return el
    }
  }

  /*  */

  function createElement$1 (tagName, vnode) {
    var elm = document.createElement(tagName);
    if (tagName !== 'select') {
      return elm
    }
    // false or null will remove the attribute but undefined will not
    if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
      elm.setAttribute('multiple', 'multiple');
    }
    return elm
  }

  function createElementNS (namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName)
  }

  function createTextNode (text) {
    return document.createTextNode(text)
  }

  function createComment (text) {
    return document.createComment(text)
  }

  function insertBefore (parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  }

  function removeChild (node, child) {
    node.removeChild(child);
  }

  function appendChild (node, child) {
    node.appendChild(child);
  }

  function parentNode (node) {
    return node.parentNode
  }

  function nextSibling (node) {
    return node.nextSibling
  }

  function tagName (node) {
    return node.tagName
  }

  function setTextContent (node, text) {
    node.textContent = text;
  }

  function setStyleScope (node, scopeId) {
    node.setAttribute(scopeId, '');
  }

  var nodeOps = /*#__PURE__*/Object.freeze({
    createElement: createElement$1,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    setStyleScope: setStyleScope
  });

  /*  */

  var ref = {
    create: function create (_, vnode) {
      registerRef(vnode);
    },
    update: function update (oldVnode, vnode) {
      if (oldVnode.data.ref !== vnode.data.ref) {
        registerRef(oldVnode, true);
        registerRef(vnode);
      }
    },
    destroy: function destroy (vnode) {
      registerRef(vnode, true);
    }
  };

  function registerRef (vnode, isRemoval) {
    var key = vnode.data.ref;
    if (!isDef(key)) { return }

    var vm = vnode.context;
    var ref = vnode.componentInstance || vnode.elm;
    var refs = vm.$refs;
    if (isRemoval) {
      if (Array.isArray(refs[key])) {
        remove(refs[key], ref);
      } else if (refs[key] === ref) {
        refs[key] = undefined;
      }
    } else {
      if (vnode.data.refInFor) {
        if (!Array.isArray(refs[key])) {
          refs[key] = [ref];
        } else if (refs[key].indexOf(ref) < 0) {
          // $flow-disable-line
          refs[key].push(ref);
        }
      } else {
        refs[key] = ref;
      }
    }
  }

  /**
   * Virtual DOM patching algorithm based on Snabbdom by
   * Simon Friis Vindum (@paldepind)
   * Licensed under the MIT License
   * https://github.com/paldepind/snabbdom/blob/master/LICENSE
   *
   * modified by Evan You (@yyx990803)
   *
   * Not type-checking this because this file is perf-critical and the cost
   * of making flow understand it is not worth it.
   */

  var emptyNode = new VNode('', {}, []);

  var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

  function sameVnode (a, b) {
    return (
      a.key === b.key && (
        (
          a.tag === b.tag &&
          a.isComment === b.isComment &&
          isDef(a.data) === isDef(b.data) &&
          sameInputType(a, b)
        ) || (
          isTrue(a.isAsyncPlaceholder) &&
          a.asyncFactory === b.asyncFactory &&
          isUndef(b.asyncFactory.error)
        )
      )
    )
  }

  function sameInputType (a, b) {
    if (a.tag !== 'input') { return true }
    var i;
    var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
    var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
    return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
  }

  function createKeyToOldIdx (children, beginIdx, endIdx) {
    var i, key;
    var map = {};
    for (i = beginIdx; i <= endIdx; ++i) {
      key = children[i].key;
      if (isDef(key)) { map[key] = i; }
    }
    return map
  }

  function createPatchFunction (backend) {
    var i, j;
    var cbs = {};

    var modules = backend.modules;
    var nodeOps = backend.nodeOps;

    for (i = 0; i < hooks.length; ++i) {
      cbs[hooks[i]] = [];
      for (j = 0; j < modules.length; ++j) {
        if (isDef(modules[j][hooks[i]])) {
          cbs[hooks[i]].push(modules[j][hooks[i]]);
        }
      }
    }

    function emptyNodeAt (elm) {
      return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
    }

    function createRmCb (childElm, listeners) {
      function remove$$1 () {
        if (--remove$$1.listeners === 0) {
          removeNode(childElm);
        }
      }
      remove$$1.listeners = listeners;
      return remove$$1
    }

    function removeNode (el) {
      var parent = nodeOps.parentNode(el);
      // element may have already been removed due to v-html / v-text
      if (isDef(parent)) {
        nodeOps.removeChild(parent, el);
      }
    }

    function createElm (
      vnode,
      insertedVnodeQueue,
      parentElm,
      refElm,
      nested,
      ownerArray,
      index
    ) {
      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // This vnode was used in a previous render!
        // now it's used as a new node, overwriting its elm would cause
        // potential patch errors down the road when it's used as an insertion
        // reference node. Instead, we clone the node on-demand before creating
        // associated DOM element for it.
        vnode = ownerArray[index] = cloneVNode(vnode);
      }

      vnode.isRootInsert = !nested; // for transition enter check
      if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
        return
      }

      var data = vnode.data;
      var children = vnode.children;
      var tag = vnode.tag;
      if (isDef(tag)) {

        vnode.elm = vnode.ns
          ? nodeOps.createElementNS(vnode.ns, tag)
          : nodeOps.createElement(tag, vnode);
        setScope(vnode);

        /* istanbul ignore if */
        {
          createChildren(vnode, children, insertedVnodeQueue);
          if (isDef(data)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
          }
          insert(parentElm, vnode.elm, refElm);
        }
      } else if (isTrue(vnode.isComment)) {
        vnode.elm = nodeOps.createComment(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      } else {
        vnode.elm = nodeOps.createTextNode(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      }
    }

    function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
      var i = vnode.data;
      if (isDef(i)) {
        var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
        if (isDef(i = i.hook) && isDef(i = i.init)) {
          i(vnode, false /* hydrating */);
        }
        // after calling the init hook, if the vnode is a child component
        // it should've created a child instance and mounted it. the child
        // component also has set the placeholder vnode's elm.
        // in that case we can just return the element and be done.
        if (isDef(vnode.componentInstance)) {
          initComponent(vnode, insertedVnodeQueue);
          insert(parentElm, vnode.elm, refElm);
          if (isTrue(isReactivated)) {
            reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
          }
          return true
        }
      }
    }

    function initComponent (vnode, insertedVnodeQueue) {
      if (isDef(vnode.data.pendingInsert)) {
        insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
        vnode.data.pendingInsert = null;
      }
      vnode.elm = vnode.componentInstance.$el;
      if (isPatchable(vnode)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
        setScope(vnode);
      } else {
        // empty component root.
        // skip all element-related modules except for ref (#3455)
        registerRef(vnode);
        // make sure to invoke the insert hook
        insertedVnodeQueue.push(vnode);
      }
    }

    function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
      var i;
      // hack for #4339: a reactivated component with inner transition
      // does not trigger because the inner node's created hooks are not called
      // again. It's not ideal to involve module-specific logic in here but
      // there doesn't seem to be a better way to do it.
      var innerNode = vnode;
      while (innerNode.componentInstance) {
        innerNode = innerNode.componentInstance._vnode;
        if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
          for (i = 0; i < cbs.activate.length; ++i) {
            cbs.activate[i](emptyNode, innerNode);
          }
          insertedVnodeQueue.push(innerNode);
          break
        }
      }
      // unlike a newly created component,
      // a reactivated keep-alive component doesn't insert itself
      insert(parentElm, vnode.elm, refElm);
    }

    function insert (parent, elm, ref$$1) {
      if (isDef(parent)) {
        if (isDef(ref$$1)) {
          if (nodeOps.parentNode(ref$$1) === parent) {
            nodeOps.insertBefore(parent, elm, ref$$1);
          }
        } else {
          nodeOps.appendChild(parent, elm);
        }
      }
    }

    function createChildren (vnode, children, insertedVnodeQueue) {
      if (Array.isArray(children)) {
        for (var i = 0; i < children.length; ++i) {
          createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
        }
      } else if (isPrimitive(vnode.text)) {
        nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
      }
    }

    function isPatchable (vnode) {
      while (vnode.componentInstance) {
        vnode = vnode.componentInstance._vnode;
      }
      return isDef(vnode.tag)
    }

    function invokeCreateHooks (vnode, insertedVnodeQueue) {
      for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
        cbs.create[i$1](emptyNode, vnode);
      }
      i = vnode.data.hook; // Reuse variable
      if (isDef(i)) {
        if (isDef(i.create)) { i.create(emptyNode, vnode); }
        if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
      }
    }

    // set scope id attribute for scoped CSS.
    // this is implemented as a special case to avoid the overhead
    // of going through the normal attribute patching process.
    function setScope (vnode) {
      var i;
      if (isDef(i = vnode.fnScopeId)) {
        nodeOps.setStyleScope(vnode.elm, i);
      } else {
        var ancestor = vnode;
        while (ancestor) {
          if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
            nodeOps.setStyleScope(vnode.elm, i);
          }
          ancestor = ancestor.parent;
        }
      }
      // for slot content they should also get the scopeId from the host instance.
      if (isDef(i = activeInstance) &&
        i !== vnode.context &&
        i !== vnode.fnContext &&
        isDef(i = i.$options._scopeId)
      ) {
        nodeOps.setStyleScope(vnode.elm, i);
      }
    }

    function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
      for (; startIdx <= endIdx; ++startIdx) {
        createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
      }
    }

    function invokeDestroyHook (vnode) {
      var i, j;
      var data = vnode.data;
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
        for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
      }
      if (isDef(i = vnode.children)) {
        for (j = 0; j < vnode.children.length; ++j) {
          invokeDestroyHook(vnode.children[j]);
        }
      }
    }

    function removeVnodes (vnodes, startIdx, endIdx) {
      for (; startIdx <= endIdx; ++startIdx) {
        var ch = vnodes[startIdx];
        if (isDef(ch)) {
          if (isDef(ch.tag)) {
            removeAndInvokeRemoveHook(ch);
            invokeDestroyHook(ch);
          } else { // Text node
            removeNode(ch.elm);
          }
        }
      }
    }

    function removeAndInvokeRemoveHook (vnode, rm) {
      if (isDef(rm) || isDef(vnode.data)) {
        var i;
        var listeners = cbs.remove.length + 1;
        if (isDef(rm)) {
          // we have a recursively passed down rm callback
          // increase the listeners count
          rm.listeners += listeners;
        } else {
          // directly removing
          rm = createRmCb(vnode.elm, listeners);
        }
        // recursively invoke hooks on child component root node
        if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
          removeAndInvokeRemoveHook(i, rm);
        }
        for (i = 0; i < cbs.remove.length; ++i) {
          cbs.remove[i](vnode, rm);
        }
        if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
          i(vnode, rm);
        } else {
          rm();
        }
      } else {
        removeNode(vnode.elm);
      }
    }

    function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
      var oldStartIdx = 0;
      var newStartIdx = 0;
      var oldEndIdx = oldCh.length - 1;
      var oldStartVnode = oldCh[0];
      var oldEndVnode = oldCh[oldEndIdx];
      var newEndIdx = newCh.length - 1;
      var newStartVnode = newCh[0];
      var newEndVnode = newCh[newEndIdx];
      var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

      // removeOnly is a special flag used only by <transition-group>
      // to ensure removed elements stay in correct relative positions
      // during leaving transitions
      var canMove = !removeOnly;

      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) {
          oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
        } else if (isUndef(oldEndVnode)) {
          oldEndVnode = oldCh[--oldEndIdx];
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
          patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          oldStartVnode = oldCh[++oldStartIdx];
          newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
          patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
          oldEndVnode = oldCh[--oldEndIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
          patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
          canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
          oldStartVnode = oldCh[++oldStartIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
          patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
          oldEndVnode = oldCh[--oldEndIdx];
          newStartVnode = newCh[++newStartIdx];
        } else {
          if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
          idxInOld = isDef(newStartVnode.key)
            ? oldKeyToIdx[newStartVnode.key]
            : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
          if (isUndef(idxInOld)) { // New element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          } else {
            vnodeToMove = oldCh[idxInOld];
            if (sameVnode(vnodeToMove, newStartVnode)) {
              patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
              oldCh[idxInOld] = undefined;
              canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
            } else {
              // same key but different element. treat as new element
              createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
            }
          }
          newStartVnode = newCh[++newStartIdx];
        }
      }
      if (oldStartIdx > oldEndIdx) {
        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
      } else if (newStartIdx > newEndIdx) {
        removeVnodes(oldCh, oldStartIdx, oldEndIdx);
      }
    }

    function findIdxInOld (node, oldCh, start, end) {
      for (var i = start; i < end; i++) {
        var c = oldCh[i];
        if (isDef(c) && sameVnode(node, c)) { return i }
      }
    }

    function patchVnode (
      oldVnode,
      vnode,
      insertedVnodeQueue,
      ownerArray,
      index,
      removeOnly
    ) {
      if (oldVnode === vnode) {
        return
      }

      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // clone reused vnode
        vnode = ownerArray[index] = cloneVNode(vnode);
      }

      var elm = vnode.elm = oldVnode.elm;

      if (isTrue(oldVnode.isAsyncPlaceholder)) {
        if (isDef(vnode.asyncFactory.resolved)) {
          hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
        } else {
          vnode.isAsyncPlaceholder = true;
        }
        return
      }

      // reuse element for static trees.
      // note we only do this if the vnode is cloned -
      // if the new node is not cloned it means the render functions have been
      // reset by the hot-reload-api and we need to do a proper re-render.
      if (isTrue(vnode.isStatic) &&
        isTrue(oldVnode.isStatic) &&
        vnode.key === oldVnode.key &&
        (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
      ) {
        vnode.componentInstance = oldVnode.componentInstance;
        return
      }

      var i;
      var data = vnode.data;
      if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
        i(oldVnode, vnode);
      }

      var oldCh = oldVnode.children;
      var ch = vnode.children;
      if (isDef(data) && isPatchable(vnode)) {
        for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
        if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
      }
      if (isUndef(vnode.text)) {
        if (isDef(oldCh) && isDef(ch)) {
          if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
        } else if (isDef(ch)) {
          if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
          addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
        } else if (isDef(oldCh)) {
          removeVnodes(oldCh, 0, oldCh.length - 1);
        } else if (isDef(oldVnode.text)) {
          nodeOps.setTextContent(elm, '');
        }
      } else if (oldVnode.text !== vnode.text) {
        nodeOps.setTextContent(elm, vnode.text);
      }
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
      }
    }

    function invokeInsertHook (vnode, queue, initial) {
      // delay insert hooks for component root nodes, invoke them after the
      // element is really inserted
      if (isTrue(initial) && isDef(vnode.parent)) {
        vnode.parent.data.pendingInsert = queue;
      } else {
        for (var i = 0; i < queue.length; ++i) {
          queue[i].data.hook.insert(queue[i]);
        }
      }
    }
    // list of modules that can skip create hook during hydration because they
    // are already rendered on the client or has no need for initialization
    // Note: style is excluded because it relies on initial clone for future
    // deep updates (#7063).
    var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

    // Note: this is a browser-only function so we can assume elms are DOM nodes.
    function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
      var i;
      var tag = vnode.tag;
      var data = vnode.data;
      var children = vnode.children;
      inVPre = inVPre || (data && data.pre);
      vnode.elm = elm;

      if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
        vnode.isAsyncPlaceholder = true;
        return true
      }
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
        if (isDef(i = vnode.componentInstance)) {
          // child component. it should have hydrated its own tree.
          initComponent(vnode, insertedVnodeQueue);
          return true
        }
      }
      if (isDef(tag)) {
        if (isDef(children)) {
          // empty element, allow client to pick up and populate children
          if (!elm.hasChildNodes()) {
            createChildren(vnode, children, insertedVnodeQueue);
          } else {
            // v-html and domProps: innerHTML
            if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
              if (i !== elm.innerHTML) {
                return false
              }
            } else {
              // iterate and compare children lists
              var childrenMatch = true;
              var childNode = elm.firstChild;
              for (var i$1 = 0; i$1 < children.length; i$1++) {
                if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                  childrenMatch = false;
                  break
                }
                childNode = childNode.nextSibling;
              }
              // if childNode is not null, it means the actual childNodes list is
              // longer than the virtual children list.
              if (!childrenMatch || childNode) {
                return false
              }
            }
          }
        }
        if (isDef(data)) {
          var fullInvoke = false;
          for (var key in data) {
            if (!isRenderedModule(key)) {
              fullInvoke = true;
              invokeCreateHooks(vnode, insertedVnodeQueue);
              break
            }
          }
          if (!fullInvoke && data['class']) {
            // ensure collecting deps for deep class bindings for future updates
            traverse(data['class']);
          }
        }
      } else if (elm.data !== vnode.text) {
        elm.data = vnode.text;
      }
      return true
    }

    return function patch (oldVnode, vnode, hydrating, removeOnly) {
      if (isUndef(vnode)) {
        if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
        return
      }

      var isInitialPatch = false;
      var insertedVnodeQueue = [];

      if (isUndef(oldVnode)) {
        // empty mount (likely as component), create new root element
        isInitialPatch = true;
        createElm(vnode, insertedVnodeQueue);
      } else {
        var isRealElement = isDef(oldVnode.nodeType);
        if (!isRealElement && sameVnode(oldVnode, vnode)) {
          // patch existing root node
          patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
        } else {
          if (isRealElement) {
            // mounting to a real element
            // check if this is server-rendered content and if we can perform
            // a successful hydration.
            if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
              oldVnode.removeAttribute(SSR_ATTR);
              hydrating = true;
            }
            if (isTrue(hydrating)) {
              if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                invokeInsertHook(vnode, insertedVnodeQueue, true);
                return oldVnode
              }
            }
            // either not server-rendered, or hydration failed.
            // create an empty node and replace it
            oldVnode = emptyNodeAt(oldVnode);
          }

          // replacing existing element
          var oldElm = oldVnode.elm;
          var parentElm = nodeOps.parentNode(oldElm);

          // create new node
          createElm(
            vnode,
            insertedVnodeQueue,
            // extremely rare edge case: do not insert if old element is in a
            // leaving transition. Only happens when combining transition +
            // keep-alive + HOCs. (#4590)
            oldElm._leaveCb ? null : parentElm,
            nodeOps.nextSibling(oldElm)
          );

          // update parent placeholder node element, recursively
          if (isDef(vnode.parent)) {
            var ancestor = vnode.parent;
            var patchable = isPatchable(vnode);
            while (ancestor) {
              for (var i = 0; i < cbs.destroy.length; ++i) {
                cbs.destroy[i](ancestor);
              }
              ancestor.elm = vnode.elm;
              if (patchable) {
                for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                  cbs.create[i$1](emptyNode, ancestor);
                }
                // #6513
                // invoke insert hooks that may have been merged by create hooks.
                // e.g. for directives that uses the "inserted" hook.
                var insert = ancestor.data.hook.insert;
                if (insert.merged) {
                  // start at index 1 to avoid re-invoking component mounted hook
                  for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                    insert.fns[i$2]();
                  }
                }
              } else {
                registerRef(ancestor);
              }
              ancestor = ancestor.parent;
            }
          }

          // destroy old node
          if (isDef(parentElm)) {
            removeVnodes([oldVnode], 0, 0);
          } else if (isDef(oldVnode.tag)) {
            invokeDestroyHook(oldVnode);
          }
        }
      }

      invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
      return vnode.elm
    }
  }

  /*  */

  var directives = {
    create: updateDirectives,
    update: updateDirectives,
    destroy: function unbindDirectives (vnode) {
      updateDirectives(vnode, emptyNode);
    }
  };

  function updateDirectives (oldVnode, vnode) {
    if (oldVnode.data.directives || vnode.data.directives) {
      _update(oldVnode, vnode);
    }
  }

  function _update (oldVnode, vnode) {
    var isCreate = oldVnode === emptyNode;
    var isDestroy = vnode === emptyNode;
    var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
    var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

    var dirsWithInsert = [];
    var dirsWithPostpatch = [];

    var key, oldDir, dir;
    for (key in newDirs) {
      oldDir = oldDirs[key];
      dir = newDirs[key];
      if (!oldDir) {
        // new directive, bind
        callHook$1(dir, 'bind', vnode, oldVnode);
        if (dir.def && dir.def.inserted) {
          dirsWithInsert.push(dir);
        }
      } else {
        // existing directive, update
        dir.oldValue = oldDir.value;
        dir.oldArg = oldDir.arg;
        callHook$1(dir, 'update', vnode, oldVnode);
        if (dir.def && dir.def.componentUpdated) {
          dirsWithPostpatch.push(dir);
        }
      }
    }

    if (dirsWithInsert.length) {
      var callInsert = function () {
        for (var i = 0; i < dirsWithInsert.length; i++) {
          callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
        }
      };
      if (isCreate) {
        mergeVNodeHook(vnode, 'insert', callInsert);
      } else {
        callInsert();
      }
    }

    if (dirsWithPostpatch.length) {
      mergeVNodeHook(vnode, 'postpatch', function () {
        for (var i = 0; i < dirsWithPostpatch.length; i++) {
          callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
        }
      });
    }

    if (!isCreate) {
      for (key in oldDirs) {
        if (!newDirs[key]) {
          // no longer present, unbind
          callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
        }
      }
    }
  }

  var emptyModifiers = Object.create(null);

  function normalizeDirectives$1 (
    dirs,
    vm
  ) {
    var res = Object.create(null);
    if (!dirs) {
      // $flow-disable-line
      return res
    }
    var i, dir;
    for (i = 0; i < dirs.length; i++) {
      dir = dirs[i];
      if (!dir.modifiers) {
        // $flow-disable-line
        dir.modifiers = emptyModifiers;
      }
      res[getRawDirName(dir)] = dir;
      dir.def = resolveAsset(vm.$options, 'directives', dir.name);
    }
    // $flow-disable-line
    return res
  }

  function getRawDirName (dir) {
    return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
  }

  function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
    var fn = dir.def && dir.def[hook];
    if (fn) {
      try {
        fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
      } catch (e) {
        handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
      }
    }
  }

  var baseModules = [
    ref,
    directives
  ];

  /*  */

  function updateAttrs (oldVnode, vnode) {
    var opts = vnode.componentOptions;
    if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
      return
    }
    if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
      return
    }
    var key, cur, old;
    var elm = vnode.elm;
    var oldAttrs = oldVnode.data.attrs || {};
    var attrs = vnode.data.attrs || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(attrs.__ob__)) {
      attrs = vnode.data.attrs = extend({}, attrs);
    }

    for (key in attrs) {
      cur = attrs[key];
      old = oldAttrs[key];
      if (old !== cur) {
        setAttr(elm, key, cur);
      }
    }
    // #4391: in IE9, setting type can reset value for input[type=radio]
    // #6666: IE/Edge forces progress value down to 1 before setting a max
    /* istanbul ignore if */
    if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
      setAttr(elm, 'value', attrs.value);
    }
    for (key in oldAttrs) {
      if (isUndef(attrs[key])) {
        if (isXlink(key)) {
          elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
        } else if (!isEnumeratedAttr(key)) {
          elm.removeAttribute(key);
        }
      }
    }
  }

  function setAttr (el, key, value) {
    if (el.tagName.indexOf('-') > -1) {
      baseSetAttr(el, key, value);
    } else if (isBooleanAttr(key)) {
      // set attribute for blank value
      // e.g. <option disabled>Select one</option>
      if (isFalsyAttrValue(value)) {
        el.removeAttribute(key);
      } else {
        // technically allowfullscreen is a boolean attribute for <iframe>,
        // but Flash expects a value of "true" when used on <embed> tag
        value = key === 'allowfullscreen' && el.tagName === 'EMBED'
          ? 'true'
          : key;
        el.setAttribute(key, value);
      }
    } else if (isEnumeratedAttr(key)) {
      el.setAttribute(key, convertEnumeratedValue(key, value));
    } else if (isXlink(key)) {
      if (isFalsyAttrValue(value)) {
        el.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      baseSetAttr(el, key, value);
    }
  }

  function baseSetAttr (el, key, value) {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // #7138: IE10 & 11 fires input event when setting placeholder on
      // <textarea>... block the first input event and remove the blocker
      // immediately.
      /* istanbul ignore if */
      if (
        isIE && !isIE9 &&
        el.tagName === 'TEXTAREA' &&
        key === 'placeholder' && value !== '' && !el.__ieph
      ) {
        var blocker = function (e) {
          e.stopImmediatePropagation();
          el.removeEventListener('input', blocker);
        };
        el.addEventListener('input', blocker);
        // $flow-disable-line
        el.__ieph = true; /* IE placeholder patched */
      }
      el.setAttribute(key, value);
    }
  }

  var attrs = {
    create: updateAttrs,
    update: updateAttrs
  };

  /*  */

  function updateClass (oldVnode, vnode) {
    var el = vnode.elm;
    var data = vnode.data;
    var oldData = oldVnode.data;
    if (
      isUndef(data.staticClass) &&
      isUndef(data.class) && (
        isUndef(oldData) || (
          isUndef(oldData.staticClass) &&
          isUndef(oldData.class)
        )
      )
    ) {
      return
    }

    var cls = genClassForVnode(vnode);

    // handle transition classes
    var transitionClass = el._transitionClasses;
    if (isDef(transitionClass)) {
      cls = concat(cls, stringifyClass(transitionClass));
    }

    // set the class
    if (cls !== el._prevClass) {
      el.setAttribute('class', cls);
      el._prevClass = cls;
    }
  }

  var klass = {
    create: updateClass,
    update: updateClass
  };

  /*  */

  /*  */

  /*  */

  /*  */

  // in some cases, the event used has to be determined at runtime
  // so we used some reserved tokens during compile.
  var RANGE_TOKEN = '__r';
  var CHECKBOX_RADIO_TOKEN = '__c';

  /*  */

  // normalize v-model event tokens that can only be determined at runtime.
  // it's important to place the event as the first in the array because
  // the whole point is ensuring the v-model callback gets called before
  // user-attached handlers.
  function normalizeEvents (on) {
    /* istanbul ignore if */
    if (isDef(on[RANGE_TOKEN])) {
      // IE input[type=range] only supports `change` event
      var event = isIE ? 'change' : 'input';
      on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
      delete on[RANGE_TOKEN];
    }
    // This was originally intended to fix #4521 but no longer necessary
    // after 2.5. Keeping it for backwards compat with generated code from < 2.4
    /* istanbul ignore if */
    if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
      on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
      delete on[CHECKBOX_RADIO_TOKEN];
    }
  }

  var target$1;

  function createOnceHandler$1 (event, handler, capture) {
    var _target = target$1; // save current target element in closure
    return function onceHandler () {
      var res = handler.apply(null, arguments);
      if (res !== null) {
        remove$2(event, onceHandler, capture, _target);
      }
    }
  }

  // #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
  // implementation and does not fire microtasks in between event propagation, so
  // safe to exclude.
  var useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);

  function add$1 (
    name,
    handler,
    capture,
    passive
  ) {
    // async edge case #6566: inner click event triggers patch, event handler
    // attached to outer element during patch, and triggered again. This
    // happens because browsers fire microtask ticks between event propagation.
    // the solution is simple: we save the timestamp when a handler is attached,
    // and the handler would only fire if the event passed to it was fired
    // AFTER it was attached.
    if (useMicrotaskFix) {
      var attachedTimestamp = currentFlushTimestamp;
      var original = handler;
      handler = original._wrapper = function (e) {
        if (
          // no bubbling, should always fire.
          // this is just a safety net in case event.timeStamp is unreliable in
          // certain weird environments...
          e.target === e.currentTarget ||
          // event is fired after handler attachment
          e.timeStamp >= attachedTimestamp ||
          // bail for environments that have buggy event.timeStamp implementations
          // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
          // #9681 QtWebEngine event.timeStamp is negative value
          e.timeStamp <= 0 ||
          // #9448 bail if event is fired in another document in a multi-page
          // electron/nw.js app, since event.timeStamp will be using a different
          // starting reference
          e.target.ownerDocument !== document
        ) {
          return original.apply(this, arguments)
        }
      };
    }
    target$1.addEventListener(
      name,
      handler,
      supportsPassive
        ? { capture: capture, passive: passive }
        : capture
    );
  }

  function remove$2 (
    name,
    handler,
    capture,
    _target
  ) {
    (_target || target$1).removeEventListener(
      name,
      handler._wrapper || handler,
      capture
    );
  }

  function updateDOMListeners (oldVnode, vnode) {
    if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
      return
    }
    var on = vnode.data.on || {};
    var oldOn = oldVnode.data.on || {};
    target$1 = vnode.elm;
    normalizeEvents(on);
    updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context);
    target$1 = undefined;
  }

  var events = {
    create: updateDOMListeners,
    update: updateDOMListeners
  };

  /*  */

  var svgContainer;

  function updateDOMProps (oldVnode, vnode) {
    if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
      return
    }
    var key, cur;
    var elm = vnode.elm;
    var oldProps = oldVnode.data.domProps || {};
    var props = vnode.data.domProps || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(props.__ob__)) {
      props = vnode.data.domProps = extend({}, props);
    }

    for (key in oldProps) {
      if (!(key in props)) {
        elm[key] = '';
      }
    }

    for (key in props) {
      cur = props[key];
      // ignore children if the node has textContent or innerHTML,
      // as these will throw away existing DOM nodes and cause removal errors
      // on subsequent patches (#3360)
      if (key === 'textContent' || key === 'innerHTML') {
        if (vnode.children) { vnode.children.length = 0; }
        if (cur === oldProps[key]) { continue }
        // #6601 work around Chrome version <= 55 bug where single textNode
        // replaced by innerHTML/textContent retains its parentNode property
        if (elm.childNodes.length === 1) {
          elm.removeChild(elm.childNodes[0]);
        }
      }

      if (key === 'value' && elm.tagName !== 'PROGRESS') {
        // store value as _value as well since
        // non-string values will be stringified
        elm._value = cur;
        // avoid resetting cursor position when value is the same
        var strCur = isUndef(cur) ? '' : String(cur);
        if (shouldUpdateValue(elm, strCur)) {
          elm.value = strCur;
        }
      } else if (key === 'innerHTML' && isSVG(elm.tagName) && isUndef(elm.innerHTML)) {
        // IE doesn't support innerHTML for SVG elements
        svgContainer = svgContainer || document.createElement('div');
        svgContainer.innerHTML = "<svg>" + cur + "</svg>";
        var svg = svgContainer.firstChild;
        while (elm.firstChild) {
          elm.removeChild(elm.firstChild);
        }
        while (svg.firstChild) {
          elm.appendChild(svg.firstChild);
        }
      } else if (
        // skip the update if old and new VDOM state is the same.
        // `value` is handled separately because the DOM value may be temporarily
        // out of sync with VDOM state due to focus, composition and modifiers.
        // This  #4521 by skipping the unnecesarry `checked` update.
        cur !== oldProps[key]
      ) {
        // some property updates can throw
        // e.g. `value` on <progress> w/ non-finite value
        try {
          elm[key] = cur;
        } catch (e) {}
      }
    }
  }

  // check platforms/web/util/attrs.js acceptValue


  function shouldUpdateValue (elm, checkVal) {
    return (!elm.composing && (
      elm.tagName === 'OPTION' ||
      isNotInFocusAndDirty(elm, checkVal) ||
      isDirtyWithModifiers(elm, checkVal)
    ))
  }

  function isNotInFocusAndDirty (elm, checkVal) {
    // return true when textbox (.number and .trim) loses focus and its value is
    // not equal to the updated value
    var notInFocus = true;
    // #6157
    // work around IE bug when accessing document.activeElement in an iframe
    try { notInFocus = document.activeElement !== elm; } catch (e) {}
    return notInFocus && elm.value !== checkVal
  }

  function isDirtyWithModifiers (elm, newVal) {
    var value = elm.value;
    var modifiers = elm._vModifiers; // injected by v-model runtime
    if (isDef(modifiers)) {
      if (modifiers.number) {
        return toNumber(value) !== toNumber(newVal)
      }
      if (modifiers.trim) {
        return value.trim() !== newVal.trim()
      }
    }
    return value !== newVal
  }

  var domProps = {
    create: updateDOMProps,
    update: updateDOMProps
  };

  /*  */

  var parseStyleText = cached(function (cssText) {
    var res = {};
    var listDelimiter = /;(?![^(]*\))/g;
    var propertyDelimiter = /:(.+)/;
    cssText.split(listDelimiter).forEach(function (item) {
      if (item) {
        var tmp = item.split(propertyDelimiter);
        tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return res
  });

  // merge static and dynamic style data on the same vnode
  function normalizeStyleData (data) {
    var style = normalizeStyleBinding(data.style);
    // static style is pre-processed into an object during compilation
    // and is always a fresh object, so it's safe to merge into it
    return data.staticStyle
      ? extend(data.staticStyle, style)
      : style
  }

  // normalize possible array / string values into Object
  function normalizeStyleBinding (bindingStyle) {
    if (Array.isArray(bindingStyle)) {
      return toObject(bindingStyle)
    }
    if (typeof bindingStyle === 'string') {
      return parseStyleText(bindingStyle)
    }
    return bindingStyle
  }

  /**
   * parent component style should be after child's
   * so that parent component's style could override it
   */
  function getStyle (vnode, checkChild) {
    var res = {};
    var styleData;

    if (checkChild) {
      var childNode = vnode;
      while (childNode.componentInstance) {
        childNode = childNode.componentInstance._vnode;
        if (
          childNode && childNode.data &&
          (styleData = normalizeStyleData(childNode.data))
        ) {
          extend(res, styleData);
        }
      }
    }

    if ((styleData = normalizeStyleData(vnode.data))) {
      extend(res, styleData);
    }

    var parentNode = vnode;
    while ((parentNode = parentNode.parent)) {
      if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
        extend(res, styleData);
      }
    }
    return res
  }

  /*  */

  var cssVarRE = /^--/;
  var importantRE = /\s*!important$/;
  var setProp = function (el, name, val) {
    /* istanbul ignore if */
    if (cssVarRE.test(name)) {
      el.style.setProperty(name, val);
    } else if (importantRE.test(val)) {
      el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
    } else {
      var normalizedName = normalize(name);
      if (Array.isArray(val)) {
        // Support values array created by autoprefixer, e.g.
        // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
        // Set them one by one, and the browser will only set those it can recognize
        for (var i = 0, len = val.length; i < len; i++) {
          el.style[normalizedName] = val[i];
        }
      } else {
        el.style[normalizedName] = val;
      }
    }
  };

  var vendorNames = ['Webkit', 'Moz', 'ms'];

  var emptyStyle;
  var normalize = cached(function (prop) {
    emptyStyle = emptyStyle || document.createElement('div').style;
    prop = camelize(prop);
    if (prop !== 'filter' && (prop in emptyStyle)) {
      return prop
    }
    var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
    for (var i = 0; i < vendorNames.length; i++) {
      var name = vendorNames[i] + capName;
      if (name in emptyStyle) {
        return name
      }
    }
  });

  function updateStyle (oldVnode, vnode) {
    var data = vnode.data;
    var oldData = oldVnode.data;

    if (isUndef(data.staticStyle) && isUndef(data.style) &&
      isUndef(oldData.staticStyle) && isUndef(oldData.style)
    ) {
      return
    }

    var cur, name;
    var el = vnode.elm;
    var oldStaticStyle = oldData.staticStyle;
    var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

    // if static style exists, stylebinding already merged into it when doing normalizeStyleData
    var oldStyle = oldStaticStyle || oldStyleBinding;

    var style = normalizeStyleBinding(vnode.data.style) || {};

    // store normalized style under a different key for next diff
    // make sure to clone it if it's reactive, since the user likely wants
    // to mutate it.
    vnode.data.normalizedStyle = isDef(style.__ob__)
      ? extend({}, style)
      : style;

    var newStyle = getStyle(vnode, true);

    for (name in oldStyle) {
      if (isUndef(newStyle[name])) {
        setProp(el, name, '');
      }
    }
    for (name in newStyle) {
      cur = newStyle[name];
      if (cur !== oldStyle[name]) {
        // ie9 setting to null has no effect, must use empty string
        setProp(el, name, cur == null ? '' : cur);
      }
    }
  }

  var style = {
    create: updateStyle,
    update: updateStyle
  };

  /*  */

  var whitespaceRE = /\s+/;

  /**
   * Add class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function addClass (el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(whitespaceRE).forEach(function (c) { return el.classList.add(c); });
      } else {
        el.classList.add(cls);
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      if (cur.indexOf(' ' + cls + ' ') < 0) {
        el.setAttribute('class', (cur + cls).trim());
      }
    }
  }

  /**
   * Remove class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function removeClass (el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(whitespaceRE).forEach(function (c) { return el.classList.remove(c); });
      } else {
        el.classList.remove(cls);
      }
      if (!el.classList.length) {
        el.removeAttribute('class');
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      var tar = ' ' + cls + ' ';
      while (cur.indexOf(tar) >= 0) {
        cur = cur.replace(tar, ' ');
      }
      cur = cur.trim();
      if (cur) {
        el.setAttribute('class', cur);
      } else {
        el.removeAttribute('class');
      }
    }
  }

  /*  */

  function resolveTransition (def$$1) {
    if (!def$$1) {
      return
    }
    /* istanbul ignore else */
    if (typeof def$$1 === 'object') {
      var res = {};
      if (def$$1.css !== false) {
        extend(res, autoCssTransition(def$$1.name || 'v'));
      }
      extend(res, def$$1);
      return res
    } else if (typeof def$$1 === 'string') {
      return autoCssTransition(def$$1)
    }
  }

  var autoCssTransition = cached(function (name) {
    return {
      enterClass: (name + "-enter"),
      enterToClass: (name + "-enter-to"),
      enterActiveClass: (name + "-enter-active"),
      leaveClass: (name + "-leave"),
      leaveToClass: (name + "-leave-to"),
      leaveActiveClass: (name + "-leave-active")
    }
  });

  var hasTransition = inBrowser && !isIE9;
  var TRANSITION = 'transition';
  var ANIMATION = 'animation';

  // Transition property/event sniffing
  var transitionProp = 'transition';
  var transitionEndEvent = 'transitionend';
  var animationProp = 'animation';
  var animationEndEvent = 'animationend';
  if (hasTransition) {
    /* istanbul ignore if */
    if (window.ontransitionend === undefined &&
      window.onwebkittransitionend !== undefined
    ) {
      transitionProp = 'WebkitTransition';
      transitionEndEvent = 'webkitTransitionEnd';
    }
    if (window.onanimationend === undefined &&
      window.onwebkitanimationend !== undefined
    ) {
      animationProp = 'WebkitAnimation';
      animationEndEvent = 'webkitAnimationEnd';
    }
  }

  // binding to window is necessary to make hot reload work in IE in strict mode
  var raf = inBrowser
    ? window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : setTimeout
    : /* istanbul ignore next */ function (fn) { return fn(); };

  function nextFrame (fn) {
    raf(function () {
      raf(fn);
    });
  }

  function addTransitionClass (el, cls) {
    var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
    if (transitionClasses.indexOf(cls) < 0) {
      transitionClasses.push(cls);
      addClass(el, cls);
    }
  }

  function removeTransitionClass (el, cls) {
    if (el._transitionClasses) {
      remove(el._transitionClasses, cls);
    }
    removeClass(el, cls);
  }

  function whenTransitionEnds (
    el,
    expectedType,
    cb
  ) {
    var ref = getTransitionInfo(el, expectedType);
    var type = ref.type;
    var timeout = ref.timeout;
    var propCount = ref.propCount;
    if (!type) { return cb() }
    var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
    var ended = 0;
    var end = function () {
      el.removeEventListener(event, onEnd);
      cb();
    };
    var onEnd = function (e) {
      if (e.target === el) {
        if (++ended >= propCount) {
          end();
        }
      }
    };
    setTimeout(function () {
      if (ended < propCount) {
        end();
      }
    }, timeout + 1);
    el.addEventListener(event, onEnd);
  }

  var transformRE = /\b(transform|all)(,|$)/;

  function getTransitionInfo (el, expectedType) {
    var styles = window.getComputedStyle(el);
    // JSDOM may return undefined for transition properties
    var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
    var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
    var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
    var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
    var animationTimeout = getTimeout(animationDelays, animationDurations);

    var type;
    var timeout = 0;
    var propCount = 0;
    /* istanbul ignore if */
    if (expectedType === TRANSITION) {
      if (transitionTimeout > 0) {
        type = TRANSITION;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout);
      type = timeout > 0
        ? transitionTimeout > animationTimeout
          ? TRANSITION
          : ANIMATION
        : null;
      propCount = type
        ? type === TRANSITION
          ? transitionDurations.length
          : animationDurations.length
        : 0;
    }
    var hasTransform =
      type === TRANSITION &&
      transformRE.test(styles[transitionProp + 'Property']);
    return {
      type: type,
      timeout: timeout,
      propCount: propCount,
      hasTransform: hasTransform
    }
  }

  function getTimeout (delays, durations) {
    /* istanbul ignore next */
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }

    return Math.max.apply(null, durations.map(function (d, i) {
      return toMs(d) + toMs(delays[i])
    }))
  }

  // Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
  // in a locale-dependent way, using a comma instead of a dot.
  // If comma is not replaced with a dot, the input will be rounded down (i.e. acting
  // as a floor function) causing unexpected behaviors
  function toMs (s) {
    return Number(s.slice(0, -1).replace(',', '.')) * 1000
  }

  /*  */

  function enter (vnode, toggleDisplay) {
    var el = vnode.elm;

    // call leave callback now
    if (isDef(el._leaveCb)) {
      el._leaveCb.cancelled = true;
      el._leaveCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data)) {
      return
    }

    /* istanbul ignore if */
    if (isDef(el._enterCb) || el.nodeType !== 1) {
      return
    }

    var css = data.css;
    var type = data.type;
    var enterClass = data.enterClass;
    var enterToClass = data.enterToClass;
    var enterActiveClass = data.enterActiveClass;
    var appearClass = data.appearClass;
    var appearToClass = data.appearToClass;
    var appearActiveClass = data.appearActiveClass;
    var beforeEnter = data.beforeEnter;
    var enter = data.enter;
    var afterEnter = data.afterEnter;
    var enterCancelled = data.enterCancelled;
    var beforeAppear = data.beforeAppear;
    var appear = data.appear;
    var afterAppear = data.afterAppear;
    var appearCancelled = data.appearCancelled;
    var duration = data.duration;

    // activeInstance will always be the <transition> component managing this
    // transition. One edge case to check is when the <transition> is placed
    // as the root node of a child component. In that case we need to check
    // <transition>'s parent for appear check.
    var context = activeInstance;
    var transitionNode = activeInstance.$vnode;
    while (transitionNode && transitionNode.parent) {
      context = transitionNode.context;
      transitionNode = transitionNode.parent;
    }

    var isAppear = !context._isMounted || !vnode.isRootInsert;

    if (isAppear && !appear && appear !== '') {
      return
    }

    var startClass = isAppear && appearClass
      ? appearClass
      : enterClass;
    var activeClass = isAppear && appearActiveClass
      ? appearActiveClass
      : enterActiveClass;
    var toClass = isAppear && appearToClass
      ? appearToClass
      : enterToClass;

    var beforeEnterHook = isAppear
      ? (beforeAppear || beforeEnter)
      : beforeEnter;
    var enterHook = isAppear
      ? (typeof appear === 'function' ? appear : enter)
      : enter;
    var afterEnterHook = isAppear
      ? (afterAppear || afterEnter)
      : afterEnter;
    var enterCancelledHook = isAppear
      ? (appearCancelled || enterCancelled)
      : enterCancelled;

    var explicitEnterDuration = toNumber(
      isObject(duration)
        ? duration.enter
        : duration
    );

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(enterHook);

    var cb = el._enterCb = once(function () {
      if (expectsCSS) {
        removeTransitionClass(el, toClass);
        removeTransitionClass(el, activeClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, startClass);
        }
        enterCancelledHook && enterCancelledHook(el);
      } else {
        afterEnterHook && afterEnterHook(el);
      }
      el._enterCb = null;
    });

    if (!vnode.data.show) {
      // remove pending leave element on enter by injecting an insert hook
      mergeVNodeHook(vnode, 'insert', function () {
        var parent = el.parentNode;
        var pendingNode = parent && parent._pending && parent._pending[vnode.key];
        if (pendingNode &&
          pendingNode.tag === vnode.tag &&
          pendingNode.elm._leaveCb
        ) {
          pendingNode.elm._leaveCb();
        }
        enterHook && enterHook(el, cb);
      });
    }

    // start enter transition
    beforeEnterHook && beforeEnterHook(el);
    if (expectsCSS) {
      addTransitionClass(el, startClass);
      addTransitionClass(el, activeClass);
      nextFrame(function () {
        removeTransitionClass(el, startClass);
        if (!cb.cancelled) {
          addTransitionClass(el, toClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitEnterDuration)) {
              setTimeout(cb, explicitEnterDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }

    if (vnode.data.show) {
      toggleDisplay && toggleDisplay();
      enterHook && enterHook(el, cb);
    }

    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }

  function leave (vnode, rm) {
    var el = vnode.elm;

    // call enter callback now
    if (isDef(el._enterCb)) {
      el._enterCb.cancelled = true;
      el._enterCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data) || el.nodeType !== 1) {
      return rm()
    }

    /* istanbul ignore if */
    if (isDef(el._leaveCb)) {
      return
    }

    var css = data.css;
    var type = data.type;
    var leaveClass = data.leaveClass;
    var leaveToClass = data.leaveToClass;
    var leaveActiveClass = data.leaveActiveClass;
    var beforeLeave = data.beforeLeave;
    var leave = data.leave;
    var afterLeave = data.afterLeave;
    var leaveCancelled = data.leaveCancelled;
    var delayLeave = data.delayLeave;
    var duration = data.duration;

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(leave);

    var explicitLeaveDuration = toNumber(
      isObject(duration)
        ? duration.leave
        : duration
    );

    var cb = el._leaveCb = once(function () {
      if (el.parentNode && el.parentNode._pending) {
        el.parentNode._pending[vnode.key] = null;
      }
      if (expectsCSS) {
        removeTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveActiveClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, leaveClass);
        }
        leaveCancelled && leaveCancelled(el);
      } else {
        rm();
        afterLeave && afterLeave(el);
      }
      el._leaveCb = null;
    });

    if (delayLeave) {
      delayLeave(performLeave);
    } else {
      performLeave();
    }

    function performLeave () {
      // the delayed leave may have already been cancelled
      if (cb.cancelled) {
        return
      }
      // record leaving element
      if (!vnode.data.show && el.parentNode) {
        (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
      }
      beforeLeave && beforeLeave(el);
      if (expectsCSS) {
        addTransitionClass(el, leaveClass);
        addTransitionClass(el, leaveActiveClass);
        nextFrame(function () {
          removeTransitionClass(el, leaveClass);
          if (!cb.cancelled) {
            addTransitionClass(el, leaveToClass);
            if (!userWantsControl) {
              if (isValidDuration(explicitLeaveDuration)) {
                setTimeout(cb, explicitLeaveDuration);
              } else {
                whenTransitionEnds(el, type, cb);
              }
            }
          }
        });
      }
      leave && leave(el, cb);
      if (!expectsCSS && !userWantsControl) {
        cb();
      }
    }
  }

  function isValidDuration (val) {
    return typeof val === 'number' && !isNaN(val)
  }

  /**
   * Normalize a transition hook's argument length. The hook may be:
   * - a merged hook (invoker) with the original in .fns
   * - a wrapped component method (check ._length)
   * - a plain function (.length)
   */
  function getHookArgumentsLength (fn) {
    if (isUndef(fn)) {
      return false
    }
    var invokerFns = fn.fns;
    if (isDef(invokerFns)) {
      // invoker
      return getHookArgumentsLength(
        Array.isArray(invokerFns)
          ? invokerFns[0]
          : invokerFns
      )
    } else {
      return (fn._length || fn.length) > 1
    }
  }

  function _enter (_, vnode) {
    if (vnode.data.show !== true) {
      enter(vnode);
    }
  }

  var transition = inBrowser ? {
    create: _enter,
    activate: _enter,
    remove: function remove$$1 (vnode, rm) {
      /* istanbul ignore else */
      if (vnode.data.show !== true) {
        leave(vnode, rm);
      } else {
        rm();
      }
    }
  } : {};

  var platformModules = [
    attrs,
    klass,
    events,
    domProps,
    style,
    transition
  ];

  /*  */

  // the directive module should be applied last, after all
  // built-in modules have been applied.
  var modules = platformModules.concat(baseModules);

  var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

  /**
   * Not type checking this file because flow doesn't like attaching
   * properties to Elements.
   */

  /* istanbul ignore if */
  if (isIE9) {
    // http://www.matts411.com/post/internet-explorer-9-oninput/
    document.addEventListener('selectionchange', function () {
      var el = document.activeElement;
      if (el && el.vmodel) {
        trigger(el, 'input');
      }
    });
  }

  var directive = {
    inserted: function inserted (el, binding, vnode, oldVnode) {
      if (vnode.tag === 'select') {
        // #6903
        if (oldVnode.elm && !oldVnode.elm._vOptions) {
          mergeVNodeHook(vnode, 'postpatch', function () {
            directive.componentUpdated(el, binding, vnode);
          });
        } else {
          setSelected(el, binding, vnode.context);
        }
        el._vOptions = [].map.call(el.options, getValue);
      } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
        el._vModifiers = binding.modifiers;
        if (!binding.modifiers.lazy) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
          // Safari < 10.2 & UIWebView doesn't fire compositionend when
          // switching focus before confirming composition choice
          // this also fixes the issue where some browsers e.g. iOS Chrome
          // fires "change" instead of "input" on autocomplete.
          el.addEventListener('change', onCompositionEnd);
          /* istanbul ignore if */
          if (isIE9) {
            el.vmodel = true;
          }
        }
      }
    },

    componentUpdated: function componentUpdated (el, binding, vnode) {
      if (vnode.tag === 'select') {
        setSelected(el, binding, vnode.context);
        // in case the options rendered by v-for have changed,
        // it's possible that the value is out-of-sync with the rendered options.
        // detect such cases and filter out values that no longer has a matching
        // option in the DOM.
        var prevOptions = el._vOptions;
        var curOptions = el._vOptions = [].map.call(el.options, getValue);
        if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
          // trigger change event if
          // no matching option found for at least one value
          var needReset = el.multiple
            ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
            : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
          if (needReset) {
            trigger(el, 'change');
          }
        }
      }
    }
  };

  function setSelected (el, binding, vm) {
    actuallySetSelected(el, binding);
    /* istanbul ignore if */
    if (isIE || isEdge) {
      setTimeout(function () {
        actuallySetSelected(el, binding);
      }, 0);
    }
  }

  function actuallySetSelected (el, binding, vm) {
    var value = binding.value;
    var isMultiple = el.multiple;
    if (isMultiple && !Array.isArray(value)) {
      return
    }
    var selected, option;
    for (var i = 0, l = el.options.length; i < l; i++) {
      option = el.options[i];
      if (isMultiple) {
        selected = looseIndexOf(value, getValue(option)) > -1;
        if (option.selected !== selected) {
          option.selected = selected;
        }
      } else {
        if (looseEqual(getValue(option), value)) {
          if (el.selectedIndex !== i) {
            el.selectedIndex = i;
          }
          return
        }
      }
    }
    if (!isMultiple) {
      el.selectedIndex = -1;
    }
  }

  function hasNoMatchingOption (value, options) {
    return options.every(function (o) { return !looseEqual(o, value); })
  }

  function getValue (option) {
    return '_value' in option
      ? option._value
      : option.value
  }

  function onCompositionStart (e) {
    e.target.composing = true;
  }

  function onCompositionEnd (e) {
    // prevent triggering an input event for no reason
    if (!e.target.composing) { return }
    e.target.composing = false;
    trigger(e.target, 'input');
  }

  function trigger (el, type) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
  }

  /*  */

  // recursively search for possible transition defined inside the component root
  function locateNode (vnode) {
    return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
      ? locateNode(vnode.componentInstance._vnode)
      : vnode
  }

  var show = {
    bind: function bind (el, ref, vnode) {
      var value = ref.value;

      vnode = locateNode(vnode);
      var transition$$1 = vnode.data && vnode.data.transition;
      var originalDisplay = el.__vOriginalDisplay =
        el.style.display === 'none' ? '' : el.style.display;
      if (value && transition$$1) {
        vnode.data.show = true;
        enter(vnode, function () {
          el.style.display = originalDisplay;
        });
      } else {
        el.style.display = value ? originalDisplay : 'none';
      }
    },

    update: function update (el, ref, vnode) {
      var value = ref.value;
      var oldValue = ref.oldValue;

      /* istanbul ignore if */
      if (!value === !oldValue) { return }
      vnode = locateNode(vnode);
      var transition$$1 = vnode.data && vnode.data.transition;
      if (transition$$1) {
        vnode.data.show = true;
        if (value) {
          enter(vnode, function () {
            el.style.display = el.__vOriginalDisplay;
          });
        } else {
          leave(vnode, function () {
            el.style.display = 'none';
          });
        }
      } else {
        el.style.display = value ? el.__vOriginalDisplay : 'none';
      }
    },

    unbind: function unbind (
      el,
      binding,
      vnode,
      oldVnode,
      isDestroy
    ) {
      if (!isDestroy) {
        el.style.display = el.__vOriginalDisplay;
      }
    }
  };

  var platformDirectives = {
    model: directive,
    show: show
  };

  /*  */

  var transitionProps = {
    name: String,
    appear: Boolean,
    css: Boolean,
    mode: String,
    type: String,
    enterClass: String,
    leaveClass: String,
    enterToClass: String,
    leaveToClass: String,
    enterActiveClass: String,
    leaveActiveClass: String,
    appearClass: String,
    appearActiveClass: String,
    appearToClass: String,
    duration: [Number, String, Object]
  };

  // in case the child is also an abstract component, e.g. <keep-alive>
  // we want to recursively retrieve the real component to be rendered
  function getRealChild (vnode) {
    var compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.options.abstract) {
      return getRealChild(getFirstComponentChild(compOptions.children))
    } else {
      return vnode
    }
  }

  function extractTransitionData (comp) {
    var data = {};
    var options = comp.$options;
    // props
    for (var key in options.propsData) {
      data[key] = comp[key];
    }
    // events.
    // extract listeners and pass them directly to the transition methods
    var listeners = options._parentListeners;
    for (var key$1 in listeners) {
      data[camelize(key$1)] = listeners[key$1];
    }
    return data
  }

  function placeholder (h, rawChild) {
    if (/\d-keep-alive$/.test(rawChild.tag)) {
      return h('keep-alive', {
        props: rawChild.componentOptions.propsData
      })
    }
  }

  function hasParentTransition (vnode) {
    while ((vnode = vnode.parent)) {
      if (vnode.data.transition) {
        return true
      }
    }
  }

  function isSameChild (child, oldChild) {
    return oldChild.key === child.key && oldChild.tag === child.tag
  }

  var isNotTextNode = function (c) { return c.tag || isAsyncPlaceholder(c); };

  var isVShowDirective = function (d) { return d.name === 'show'; };

  var Transition = {
    name: 'transition',
    props: transitionProps,
    abstract: true,

    render: function render (h) {
      var this$1 = this;

      var children = this.$slots.default;
      if (!children) {
        return
      }

      // filter out text nodes (possible whitespaces)
      children = children.filter(isNotTextNode);
      /* istanbul ignore if */
      if (!children.length) {
        return
      }

      var mode = this.mode;

      var rawChild = children[0];

      // if this is a component root node and the component's
      // parent container node also has transition, skip.
      if (hasParentTransition(this.$vnode)) {
        return rawChild
      }

      // apply transition data to child
      // use getRealChild() to ignore abstract components e.g. keep-alive
      var child = getRealChild(rawChild);
      /* istanbul ignore if */
      if (!child) {
        return rawChild
      }

      if (this._leaving) {
        return placeholder(h, rawChild)
      }

      // ensure a key that is unique to the vnode type and to this transition
      // component instance. This key will be used to remove pending leaving nodes
      // during entering.
      var id = "__transition-" + (this._uid) + "-";
      child.key = child.key == null
        ? child.isComment
          ? id + 'comment'
          : id + child.tag
        : isPrimitive(child.key)
          ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
          : child.key;

      var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
      var oldRawChild = this._vnode;
      var oldChild = getRealChild(oldRawChild);

      // mark v-show
      // so that the transition module can hand over the control to the directive
      if (child.data.directives && child.data.directives.some(isVShowDirective)) {
        child.data.show = true;
      }

      if (
        oldChild &&
        oldChild.data &&
        !isSameChild(child, oldChild) &&
        !isAsyncPlaceholder(oldChild) &&
        // #6687 component root is a comment node
        !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
      ) {
        // replace old child transition data with fresh one
        // important for dynamic transitions!
        var oldData = oldChild.data.transition = extend({}, data);
        // handle transition mode
        if (mode === 'out-in') {
          // return placeholder node and queue update when leave finishes
          this._leaving = true;
          mergeVNodeHook(oldData, 'afterLeave', function () {
            this$1._leaving = false;
            this$1.$forceUpdate();
          });
          return placeholder(h, rawChild)
        } else if (mode === 'in-out') {
          if (isAsyncPlaceholder(child)) {
            return oldRawChild
          }
          var delayedLeave;
          var performLeave = function () { delayedLeave(); };
          mergeVNodeHook(data, 'afterEnter', performLeave);
          mergeVNodeHook(data, 'enterCancelled', performLeave);
          mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
        }
      }

      return rawChild
    }
  };

  /*  */

  var props = extend({
    tag: String,
    moveClass: String
  }, transitionProps);

  delete props.mode;

  var TransitionGroup = {
    props: props,

    beforeMount: function beforeMount () {
      var this$1 = this;

      var update = this._update;
      this._update = function (vnode, hydrating) {
        var restoreActiveInstance = setActiveInstance(this$1);
        // force removing pass
        this$1.__patch__(
          this$1._vnode,
          this$1.kept,
          false, // hydrating
          true // removeOnly (!important, avoids unnecessary moves)
        );
        this$1._vnode = this$1.kept;
        restoreActiveInstance();
        update.call(this$1, vnode, hydrating);
      };
    },

    render: function render (h) {
      var tag = this.tag || this.$vnode.data.tag || 'span';
      var map = Object.create(null);
      var prevChildren = this.prevChildren = this.children;
      var rawChildren = this.$slots.default || [];
      var children = this.children = [];
      var transitionData = extractTransitionData(this);

      for (var i = 0; i < rawChildren.length; i++) {
        var c = rawChildren[i];
        if (c.tag) {
          if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
            children.push(c);
            map[c.key] = c
            ;(c.data || (c.data = {})).transition = transitionData;
          }
        }
      }

      if (prevChildren) {
        var kept = [];
        var removed = [];
        for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
          var c$1 = prevChildren[i$1];
          c$1.data.transition = transitionData;
          c$1.data.pos = c$1.elm.getBoundingClientRect();
          if (map[c$1.key]) {
            kept.push(c$1);
          } else {
            removed.push(c$1);
          }
        }
        this.kept = h(tag, null, kept);
        this.removed = removed;
      }

      return h(tag, null, children)
    },

    updated: function updated () {
      var children = this.prevChildren;
      var moveClass = this.moveClass || ((this.name || 'v') + '-move');
      if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
        return
      }

      // we divide the work into three loops to avoid mixing DOM reads and writes
      // in each iteration - which helps prevent layout thrashing.
      children.forEach(callPendingCbs);
      children.forEach(recordPosition);
      children.forEach(applyTranslation);

      // force reflow to put everything in position
      // assign to this to avoid being removed in tree-shaking
      // $flow-disable-line
      this._reflow = document.body.offsetHeight;

      children.forEach(function (c) {
        if (c.data.moved) {
          var el = c.elm;
          var s = el.style;
          addTransitionClass(el, moveClass);
          s.transform = s.WebkitTransform = s.transitionDuration = '';
          el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
            if (e && e.target !== el) {
              return
            }
            if (!e || /transform$/.test(e.propertyName)) {
              el.removeEventListener(transitionEndEvent, cb);
              el._moveCb = null;
              removeTransitionClass(el, moveClass);
            }
          });
        }
      });
    },

    methods: {
      hasMove: function hasMove (el, moveClass) {
        /* istanbul ignore if */
        if (!hasTransition) {
          return false
        }
        /* istanbul ignore if */
        if (this._hasMove) {
          return this._hasMove
        }
        // Detect whether an element with the move class applied has
        // CSS transitions. Since the element may be inside an entering
        // transition at this very moment, we make a clone of it and remove
        // all other transition classes applied to ensure only the move class
        // is applied.
        var clone = el.cloneNode();
        if (el._transitionClasses) {
          el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
        }
        addClass(clone, moveClass);
        clone.style.display = 'none';
        this.$el.appendChild(clone);
        var info = getTransitionInfo(clone);
        this.$el.removeChild(clone);
        return (this._hasMove = info.hasTransform)
      }
    }
  };

  function callPendingCbs (c) {
    /* istanbul ignore if */
    if (c.elm._moveCb) {
      c.elm._moveCb();
    }
    /* istanbul ignore if */
    if (c.elm._enterCb) {
      c.elm._enterCb();
    }
  }

  function recordPosition (c) {
    c.data.newPos = c.elm.getBoundingClientRect();
  }

  function applyTranslation (c) {
    var oldPos = c.data.pos;
    var newPos = c.data.newPos;
    var dx = oldPos.left - newPos.left;
    var dy = oldPos.top - newPos.top;
    if (dx || dy) {
      c.data.moved = true;
      var s = c.elm.style;
      s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
      s.transitionDuration = '0s';
    }
  }

  var platformComponents = {
    Transition: Transition,
    TransitionGroup: TransitionGroup
  };

  /*  */

  // install platform specific utils
  Vue.config.mustUseProp = mustUseProp;
  Vue.config.isReservedTag = isReservedTag;
  Vue.config.isReservedAttr = isReservedAttr;
  Vue.config.getTagNamespace = getTagNamespace;
  Vue.config.isUnknownElement = isUnknownElement;

  // install platform runtime directives & components
  extend(Vue.options.directives, platformDirectives);
  extend(Vue.options.components, platformComponents);

  // install platform patch function
  Vue.prototype.__patch__ = inBrowser ? patch : noop;

  // public mount method
  Vue.prototype.$mount = function (
    el,
    hydrating
  ) {
    el = el && inBrowser ? query(el) : undefined;
    return mountComponent(this, el, hydrating)
  };

  // devtools global hook
  /* istanbul ignore next */
  if (inBrowser) {
    setTimeout(function () {
      if (config.devtools) {
        if (devtools) {
          devtools.emit('init', Vue);
        }
      }
    }, 0);
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var Global = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  var PI_OVER_180 = Math.PI / 180;
  function detectBrowser() {
      return (typeof window !== 'undefined' &&
          ({}.toString.call(window) === '[object Window]' ||
              {}.toString.call(window) === '[object global]'));
  }
  var _detectIE = function (ua) {
      var msie = ua.indexOf('msie ');
      if (msie > 0) {
          return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
      }
      var trident = ua.indexOf('trident/');
      if (trident > 0) {
          var rv = ua.indexOf('rv:');
          return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
      }
      var edge = ua.indexOf('edge/');
      if (edge > 0) {
          return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
      }
      return false;
  };
  exports._parseUA = function (userAgent) {
      var ua = userAgent.toLowerCase(), match = /(chrome)[ /]([\w.]+)/.exec(ua) ||
          /(webkit)[ /]([\w.]+)/.exec(ua) ||
          /(opera)(?:.*version|)[ /]([\w.]+)/.exec(ua) ||
          /(msie) ([\w.]+)/.exec(ua) ||
          (ua.indexOf('compatible') < 0 &&
              /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)) ||
          [], mobile = !!userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i), ieMobile = !!userAgent.match(/IEMobile/i);
      return {
          browser: match[1] || '',
          version: match[2] || '0',
          isIE: _detectIE(ua),
          mobile: mobile,
          ieMobile: ieMobile
      };
  };
  exports.glob = typeof commonjsGlobal !== 'undefined'
      ? commonjsGlobal
      : typeof window !== 'undefined'
          ? window
          : typeof WorkerGlobalScope !== 'undefined'
              ? self
              : {};
  exports.Konva = {
      _global: exports.glob,
      version: '7.0.3',
      isBrowser: detectBrowser(),
      isUnminified: /param/.test(function (param) { }.toString()),
      dblClickWindow: 400,
      getAngle: function (angle) {
          return exports.Konva.angleDeg ? angle * PI_OVER_180 : angle;
      },
      enableTrace: false,
      _pointerEventsEnabled: false,
      hitOnDragEnabled: false,
      captureTouchEventsEnabled: false,
      listenClickTap: false,
      inDblClickWindow: false,
      pixelRatio: undefined,
      dragDistance: 3,
      angleDeg: true,
      showWarnings: true,
      dragButtons: [0, 1],
      isDragging: function () {
          return exports.Konva['DD'].isDragging;
      },
      isDragReady: function () {
          return !!exports.Konva['DD'].node;
      },
      UA: exports._parseUA((exports.glob.navigator && exports.glob.navigator.userAgent) || ''),
      document: exports.glob.document,
      _injectGlobal: function (Konva) {
          exports.glob.Konva = Konva;
      },
      _parseUA: exports._parseUA
  };
  exports._NODES_REGISTRY = {};
  exports._registerNode = function (NodeClass) {
      exports._NODES_REGISTRY[NodeClass.prototype.getClassName()] = NodeClass;
      exports.Konva[NodeClass.prototype.getClassName()] = NodeClass;
  };
  });

  unwrapExports(Global);
  var Global_1 = Global._parseUA;
  var Global_2 = Global.glob;
  var Global_3 = Global.Konva;
  var Global_4 = Global._NODES_REGISTRY;
  var Global_5 = Global._registerNode;

  var Util = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });

  var Collection = (function () {
      function Collection() {
      }
      Collection.toCollection = function (arr) {
          var collection = new Collection(), len = arr.length, n;
          for (n = 0; n < len; n++) {
              collection.push(arr[n]);
          }
          return collection;
      };
      Collection._mapMethod = function (methodName) {
          Collection.prototype[methodName] = function () {
              var len = this.length, i;
              var args = [].slice.call(arguments);
              for (i = 0; i < len; i++) {
                  this[i][methodName].apply(this[i], args);
              }
              return this;
          };
      };
      Collection.mapMethods = function (constructor) {
          var prot = constructor.prototype;
          for (var methodName in prot) {
              Collection._mapMethod(methodName);
          }
      };
      return Collection;
  }());
  exports.Collection = Collection;
  Collection.prototype = [];
  Collection.prototype.each = function (func) {
      for (var n = 0; n < this.length; n++) {
          func(this[n], n);
      }
  };
  Collection.prototype.toArray = function () {
      var arr = [], len = this.length, n;
      for (n = 0; n < len; n++) {
          arr.push(this[n]);
      }
      return arr;
  };
  var Transform = (function () {
      function Transform(m) {
          if (m === void 0) { m = [1, 0, 0, 1, 0, 0]; }
          this.dirty = false;
          this.m = (m && m.slice()) || [1, 0, 0, 1, 0, 0];
      }
      Transform.prototype.reset = function () {
          this.m[0] = 1;
          this.m[1] = 0;
          this.m[2] = 0;
          this.m[3] = 1;
          this.m[4] = 0;
          this.m[5] = 0;
      };
      Transform.prototype.copy = function () {
          return new Transform(this.m);
      };
      Transform.prototype.copyInto = function (tr) {
          tr.m[0] = this.m[0];
          tr.m[1] = this.m[1];
          tr.m[2] = this.m[2];
          tr.m[3] = this.m[3];
          tr.m[4] = this.m[4];
          tr.m[5] = this.m[5];
      };
      Transform.prototype.point = function (point) {
          var m = this.m;
          return {
              x: m[0] * point.x + m[2] * point.y + m[4],
              y: m[1] * point.x + m[3] * point.y + m[5],
          };
      };
      Transform.prototype.translate = function (x, y) {
          this.m[4] += this.m[0] * x + this.m[2] * y;
          this.m[5] += this.m[1] * x + this.m[3] * y;
          return this;
      };
      Transform.prototype.scale = function (sx, sy) {
          this.m[0] *= sx;
          this.m[1] *= sx;
          this.m[2] *= sy;
          this.m[3] *= sy;
          return this;
      };
      Transform.prototype.rotate = function (rad) {
          var c = Math.cos(rad);
          var s = Math.sin(rad);
          var m11 = this.m[0] * c + this.m[2] * s;
          var m12 = this.m[1] * c + this.m[3] * s;
          var m21 = this.m[0] * -s + this.m[2] * c;
          var m22 = this.m[1] * -s + this.m[3] * c;
          this.m[0] = m11;
          this.m[1] = m12;
          this.m[2] = m21;
          this.m[3] = m22;
          return this;
      };
      Transform.prototype.getTranslation = function () {
          return {
              x: this.m[4],
              y: this.m[5],
          };
      };
      Transform.prototype.skew = function (sx, sy) {
          var m11 = this.m[0] + this.m[2] * sy;
          var m12 = this.m[1] + this.m[3] * sy;
          var m21 = this.m[2] + this.m[0] * sx;
          var m22 = this.m[3] + this.m[1] * sx;
          this.m[0] = m11;
          this.m[1] = m12;
          this.m[2] = m21;
          this.m[3] = m22;
          return this;
      };
      Transform.prototype.multiply = function (matrix) {
          var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
          var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];
          var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
          var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];
          var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
          var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];
          this.m[0] = m11;
          this.m[1] = m12;
          this.m[2] = m21;
          this.m[3] = m22;
          this.m[4] = dx;
          this.m[5] = dy;
          return this;
      };
      Transform.prototype.invert = function () {
          var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
          var m0 = this.m[3] * d;
          var m1 = -this.m[1] * d;
          var m2 = -this.m[2] * d;
          var m3 = this.m[0] * d;
          var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
          var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
          this.m[0] = m0;
          this.m[1] = m1;
          this.m[2] = m2;
          this.m[3] = m3;
          this.m[4] = m4;
          this.m[5] = m5;
          return this;
      };
      Transform.prototype.getMatrix = function () {
          return this.m;
      };
      Transform.prototype.setAbsolutePosition = function (x, y) {
          var m0 = this.m[0], m1 = this.m[1], m2 = this.m[2], m3 = this.m[3], m4 = this.m[4], m5 = this.m[5], yt = (m0 * (y - m5) - m1 * (x - m4)) / (m0 * m3 - m1 * m2), xt = (x - m4 - m2 * yt) / m0;
          return this.translate(xt, yt);
      };
      Transform.prototype.decompose = function () {
          var a = this.m[0];
          var b = this.m[1];
          var c = this.m[2];
          var d = this.m[3];
          var e = this.m[4];
          var f = this.m[5];
          var delta = a * d - b * c;
          var result = {
              x: e,
              y: f,
              rotation: 0,
              scaleX: 0,
              scaleY: 0,
              skewX: 0,
              skewY: 0,
          };
          if (a != 0 || b != 0) {
              var r = Math.sqrt(a * a + b * b);
              result.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
              result.scaleX = r;
              result.scaleY = delta / r;
              result.skewX = (a * c + b * d) / delta;
              result.skewY = 0;
          }
          else if (c != 0 || d != 0) {
              var s = Math.sqrt(c * c + d * d);
              result.rotation =
                  Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
              result.scaleX = delta / s;
              result.scaleY = s;
              result.skewX = 0;
              result.skewY = (a * c + b * d) / delta;
          }
          result.rotation = exports.Util._getRotation(result.rotation);
          return result;
      };
      return Transform;
  }());
  exports.Transform = Transform;
  var OBJECT_ARRAY = '[object Array]', OBJECT_NUMBER = '[object Number]', OBJECT_STRING = '[object String]', OBJECT_BOOLEAN = '[object Boolean]', PI_OVER_DEG180 = Math.PI / 180, DEG180_OVER_PI = 180 / Math.PI, HASH = '#', EMPTY_STRING = '', ZERO = '0', KONVA_WARNING = 'Konva warning: ', KONVA_ERROR = 'Konva error: ', RGB_PAREN = 'rgb(', COLORS = {
      aliceblue: [240, 248, 255],
      antiquewhite: [250, 235, 215],
      aqua: [0, 255, 255],
      aquamarine: [127, 255, 212],
      azure: [240, 255, 255],
      beige: [245, 245, 220],
      bisque: [255, 228, 196],
      black: [0, 0, 0],
      blanchedalmond: [255, 235, 205],
      blue: [0, 0, 255],
      blueviolet: [138, 43, 226],
      brown: [165, 42, 42],
      burlywood: [222, 184, 135],
      cadetblue: [95, 158, 160],
      chartreuse: [127, 255, 0],
      chocolate: [210, 105, 30],
      coral: [255, 127, 80],
      cornflowerblue: [100, 149, 237],
      cornsilk: [255, 248, 220],
      crimson: [220, 20, 60],
      cyan: [0, 255, 255],
      darkblue: [0, 0, 139],
      darkcyan: [0, 139, 139],
      darkgoldenrod: [184, 132, 11],
      darkgray: [169, 169, 169],
      darkgreen: [0, 100, 0],
      darkgrey: [169, 169, 169],
      darkkhaki: [189, 183, 107],
      darkmagenta: [139, 0, 139],
      darkolivegreen: [85, 107, 47],
      darkorange: [255, 140, 0],
      darkorchid: [153, 50, 204],
      darkred: [139, 0, 0],
      darksalmon: [233, 150, 122],
      darkseagreen: [143, 188, 143],
      darkslateblue: [72, 61, 139],
      darkslategray: [47, 79, 79],
      darkslategrey: [47, 79, 79],
      darkturquoise: [0, 206, 209],
      darkviolet: [148, 0, 211],
      deeppink: [255, 20, 147],
      deepskyblue: [0, 191, 255],
      dimgray: [105, 105, 105],
      dimgrey: [105, 105, 105],
      dodgerblue: [30, 144, 255],
      firebrick: [178, 34, 34],
      floralwhite: [255, 255, 240],
      forestgreen: [34, 139, 34],
      fuchsia: [255, 0, 255],
      gainsboro: [220, 220, 220],
      ghostwhite: [248, 248, 255],
      gold: [255, 215, 0],
      goldenrod: [218, 165, 32],
      gray: [128, 128, 128],
      green: [0, 128, 0],
      greenyellow: [173, 255, 47],
      grey: [128, 128, 128],
      honeydew: [240, 255, 240],
      hotpink: [255, 105, 180],
      indianred: [205, 92, 92],
      indigo: [75, 0, 130],
      ivory: [255, 255, 240],
      khaki: [240, 230, 140],
      lavender: [230, 230, 250],
      lavenderblush: [255, 240, 245],
      lawngreen: [124, 252, 0],
      lemonchiffon: [255, 250, 205],
      lightblue: [173, 216, 230],
      lightcoral: [240, 128, 128],
      lightcyan: [224, 255, 255],
      lightgoldenrodyellow: [250, 250, 210],
      lightgray: [211, 211, 211],
      lightgreen: [144, 238, 144],
      lightgrey: [211, 211, 211],
      lightpink: [255, 182, 193],
      lightsalmon: [255, 160, 122],
      lightseagreen: [32, 178, 170],
      lightskyblue: [135, 206, 250],
      lightslategray: [119, 136, 153],
      lightslategrey: [119, 136, 153],
      lightsteelblue: [176, 196, 222],
      lightyellow: [255, 255, 224],
      lime: [0, 255, 0],
      limegreen: [50, 205, 50],
      linen: [250, 240, 230],
      magenta: [255, 0, 255],
      maroon: [128, 0, 0],
      mediumaquamarine: [102, 205, 170],
      mediumblue: [0, 0, 205],
      mediumorchid: [186, 85, 211],
      mediumpurple: [147, 112, 219],
      mediumseagreen: [60, 179, 113],
      mediumslateblue: [123, 104, 238],
      mediumspringgreen: [0, 250, 154],
      mediumturquoise: [72, 209, 204],
      mediumvioletred: [199, 21, 133],
      midnightblue: [25, 25, 112],
      mintcream: [245, 255, 250],
      mistyrose: [255, 228, 225],
      moccasin: [255, 228, 181],
      navajowhite: [255, 222, 173],
      navy: [0, 0, 128],
      oldlace: [253, 245, 230],
      olive: [128, 128, 0],
      olivedrab: [107, 142, 35],
      orange: [255, 165, 0],
      orangered: [255, 69, 0],
      orchid: [218, 112, 214],
      palegoldenrod: [238, 232, 170],
      palegreen: [152, 251, 152],
      paleturquoise: [175, 238, 238],
      palevioletred: [219, 112, 147],
      papayawhip: [255, 239, 213],
      peachpuff: [255, 218, 185],
      peru: [205, 133, 63],
      pink: [255, 192, 203],
      plum: [221, 160, 203],
      powderblue: [176, 224, 230],
      purple: [128, 0, 128],
      rebeccapurple: [102, 51, 153],
      red: [255, 0, 0],
      rosybrown: [188, 143, 143],
      royalblue: [65, 105, 225],
      saddlebrown: [139, 69, 19],
      salmon: [250, 128, 114],
      sandybrown: [244, 164, 96],
      seagreen: [46, 139, 87],
      seashell: [255, 245, 238],
      sienna: [160, 82, 45],
      silver: [192, 192, 192],
      skyblue: [135, 206, 235],
      slateblue: [106, 90, 205],
      slategray: [119, 128, 144],
      slategrey: [119, 128, 144],
      snow: [255, 255, 250],
      springgreen: [0, 255, 127],
      steelblue: [70, 130, 180],
      tan: [210, 180, 140],
      teal: [0, 128, 128],
      thistle: [216, 191, 216],
      transparent: [255, 255, 255, 0],
      tomato: [255, 99, 71],
      turquoise: [64, 224, 208],
      violet: [238, 130, 238],
      wheat: [245, 222, 179],
      white: [255, 255, 255],
      whitesmoke: [245, 245, 245],
      yellow: [255, 255, 0],
      yellowgreen: [154, 205, 5],
  }, RGB_REGEX = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/, animQueue = [];
  exports.Util = {
      _isElement: function (obj) {
          return !!(obj && obj.nodeType == 1);
      },
      _isFunction: function (obj) {
          return !!(obj && obj.constructor && obj.call && obj.apply);
      },
      _isPlainObject: function (obj) {
          return !!obj && obj.constructor === Object;
      },
      _isArray: function (obj) {
          return Object.prototype.toString.call(obj) === OBJECT_ARRAY;
      },
      _isNumber: function (obj) {
          return (Object.prototype.toString.call(obj) === OBJECT_NUMBER &&
              !isNaN(obj) &&
              isFinite(obj));
      },
      _isString: function (obj) {
          return Object.prototype.toString.call(obj) === OBJECT_STRING;
      },
      _isBoolean: function (obj) {
          return Object.prototype.toString.call(obj) === OBJECT_BOOLEAN;
      },
      isObject: function (val) {
          return val instanceof Object;
      },
      isValidSelector: function (selector) {
          if (typeof selector !== 'string') {
              return false;
          }
          var firstChar = selector[0];
          return (firstChar === '#' ||
              firstChar === '.' ||
              firstChar === firstChar.toUpperCase());
      },
      _sign: function (number) {
          if (number === 0) {
              return 0;
          }
          if (number > 0) {
              return 1;
          }
          else {
              return -1;
          }
      },
      requestAnimFrame: function (callback) {
          animQueue.push(callback);
          if (animQueue.length === 1) {
              requestAnimationFrame(function () {
                  var queue = animQueue;
                  animQueue = [];
                  queue.forEach(function (cb) {
                      cb();
                  });
              });
          }
      },
      createCanvasElement: function () {
          var canvas = document.createElement('canvas');
          try {
              canvas.style = canvas.style || {};
          }
          catch (e) { }
          return canvas;
      },
      createImageElement: function () {
          return document.createElement('img');
      },
      _isInDocument: function (el) {
          while ((el = el.parentNode)) {
              if (el == document) {
                  return true;
              }
          }
          return false;
      },
      _simplifyArray: function (arr) {
          var retArr = [], len = arr.length, util = exports.Util, n, val;
          for (n = 0; n < len; n++) {
              val = arr[n];
              if (util._isNumber(val)) {
                  val = Math.round(val * 1000) / 1000;
              }
              else if (!util._isString(val)) {
                  val = val.toString();
              }
              retArr.push(val);
          }
          return retArr;
      },
      _urlToImage: function (url, callback) {
          var imageObj = new Global.glob.Image();
          imageObj.onload = function () {
              callback(imageObj);
          };
          imageObj.src = url;
      },
      _rgbToHex: function (r, g, b) {
          return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      },
      _hexToRgb: function (hex) {
          hex = hex.replace(HASH, EMPTY_STRING);
          var bigint = parseInt(hex, 16);
          return {
              r: (bigint >> 16) & 255,
              g: (bigint >> 8) & 255,
              b: bigint & 255,
          };
      },
      getRandomColor: function () {
          var randColor = ((Math.random() * 0xffffff) << 0).toString(16);
          while (randColor.length < 6) {
              randColor = ZERO + randColor;
          }
          return HASH + randColor;
      },
      get: function (val, def) {
          if (val === undefined) {
              return def;
          }
          else {
              return val;
          }
      },
      getRGB: function (color) {
          var rgb;
          if (color in COLORS) {
              rgb = COLORS[color];
              return {
                  r: rgb[0],
                  g: rgb[1],
                  b: rgb[2],
              };
          }
          else if (color[0] === HASH) {
              return this._hexToRgb(color.substring(1));
          }
          else if (color.substr(0, 4) === RGB_PAREN) {
              rgb = RGB_REGEX.exec(color.replace(/ /g, ''));
              return {
                  r: parseInt(rgb[1], 10),
                  g: parseInt(rgb[2], 10),
                  b: parseInt(rgb[3], 10),
              };
          }
          else {
              return {
                  r: 0,
                  g: 0,
                  b: 0,
              };
          }
      },
      colorToRGBA: function (str) {
          str = str || 'black';
          return (exports.Util._namedColorToRBA(str) ||
              exports.Util._hex3ColorToRGBA(str) ||
              exports.Util._hex6ColorToRGBA(str) ||
              exports.Util._rgbColorToRGBA(str) ||
              exports.Util._rgbaColorToRGBA(str) ||
              exports.Util._hslColorToRGBA(str));
      },
      _namedColorToRBA: function (str) {
          var c = COLORS[str.toLowerCase()];
          if (!c) {
              return null;
          }
          return {
              r: c[0],
              g: c[1],
              b: c[2],
              a: 1,
          };
      },
      _rgbColorToRGBA: function (str) {
          if (str.indexOf('rgb(') === 0) {
              str = str.match(/rgb\(([^)]+)\)/)[1];
              var parts = str.split(/ *, */).map(Number);
              return {
                  r: parts[0],
                  g: parts[1],
                  b: parts[2],
                  a: 1,
              };
          }
      },
      _rgbaColorToRGBA: function (str) {
          if (str.indexOf('rgba(') === 0) {
              str = str.match(/rgba\(([^)]+)\)/)[1];
              var parts = str.split(/ *, */).map(Number);
              return {
                  r: parts[0],
                  g: parts[1],
                  b: parts[2],
                  a: parts[3],
              };
          }
      },
      _hex6ColorToRGBA: function (str) {
          if (str[0] === '#' && str.length === 7) {
              return {
                  r: parseInt(str.slice(1, 3), 16),
                  g: parseInt(str.slice(3, 5), 16),
                  b: parseInt(str.slice(5, 7), 16),
                  a: 1,
              };
          }
      },
      _hex3ColorToRGBA: function (str) {
          if (str[0] === '#' && str.length === 4) {
              return {
                  r: parseInt(str[1] + str[1], 16),
                  g: parseInt(str[2] + str[2], 16),
                  b: parseInt(str[3] + str[3], 16),
                  a: 1,
              };
          }
      },
      _hslColorToRGBA: function (str) {
          if (/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.test(str)) {
              var _a = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(str), _ = _a[0], hsl = _a.slice(1);
              var h = Number(hsl[0]) / 360;
              var s = Number(hsl[1]) / 100;
              var l = Number(hsl[2]) / 100;
              var t2 = void 0;
              var t3 = void 0;
              var val = void 0;
              if (s === 0) {
                  val = l * 255;
                  return {
                      r: Math.round(val),
                      g: Math.round(val),
                      b: Math.round(val),
                      a: 1,
                  };
              }
              if (l < 0.5) {
                  t2 = l * (1 + s);
              }
              else {
                  t2 = l + s - l * s;
              }
              var t1 = 2 * l - t2;
              var rgb = [0, 0, 0];
              for (var i = 0; i < 3; i++) {
                  t3 = h + (1 / 3) * -(i - 1);
                  if (t3 < 0) {
                      t3++;
                  }
                  if (t3 > 1) {
                      t3--;
                  }
                  if (6 * t3 < 1) {
                      val = t1 + (t2 - t1) * 6 * t3;
                  }
                  else if (2 * t3 < 1) {
                      val = t2;
                  }
                  else if (3 * t3 < 2) {
                      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
                  }
                  else {
                      val = t1;
                  }
                  rgb[i] = val * 255;
              }
              return {
                  r: Math.round(rgb[0]),
                  g: Math.round(rgb[1]),
                  b: Math.round(rgb[2]),
                  a: 1,
              };
          }
      },
      haveIntersection: function (r1, r2) {
          return !(r2.x > r1.x + r1.width ||
              r2.x + r2.width < r1.x ||
              r2.y > r1.y + r1.height ||
              r2.y + r2.height < r1.y);
      },
      cloneObject: function (obj) {
          var retObj = {};
          for (var key in obj) {
              if (this._isPlainObject(obj[key])) {
                  retObj[key] = this.cloneObject(obj[key]);
              }
              else if (this._isArray(obj[key])) {
                  retObj[key] = this.cloneArray(obj[key]);
              }
              else {
                  retObj[key] = obj[key];
              }
          }
          return retObj;
      },
      cloneArray: function (arr) {
          return arr.slice(0);
      },
      _degToRad: function (deg) {
          return deg * PI_OVER_DEG180;
      },
      _radToDeg: function (rad) {
          return rad * DEG180_OVER_PI;
      },
      _getRotation: function (radians) {
          return Global.Konva.angleDeg ? exports.Util._radToDeg(radians) : radians;
      },
      _capitalize: function (str) {
          return str.charAt(0).toUpperCase() + str.slice(1);
      },
      throw: function (str) {
          throw new Error(KONVA_ERROR + str);
      },
      error: function (str) {
          console.error(KONVA_ERROR + str);
      },
      warn: function (str) {
          if (!Global.Konva.showWarnings) {
              return;
          }
          console.warn(KONVA_WARNING + str);
      },
      extend: function (child, parent) {
          function Ctor() {
              this.constructor = child;
          }
          Ctor.prototype = parent.prototype;
          var oldProto = child.prototype;
          child.prototype = new Ctor();
          for (var key in oldProto) {
              if (oldProto.hasOwnProperty(key)) {
                  child.prototype[key] = oldProto[key];
              }
          }
          child.__super__ = parent.prototype;
          child.super = parent;
      },
      _getControlPoints: function (x0, y0, x1, y1, x2, y2, t) {
          var d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)), d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)), fa = (t * d01) / (d01 + d12), fb = (t * d12) / (d01 + d12), p1x = x1 - fa * (x2 - x0), p1y = y1 - fa * (y2 - y0), p2x = x1 + fb * (x2 - x0), p2y = y1 + fb * (y2 - y0);
          return [p1x, p1y, p2x, p2y];
      },
      _expandPoints: function (p, tension) {
          var len = p.length, allPoints = [], n, cp;
          for (n = 2; n < len - 2; n += 2) {
              cp = exports.Util._getControlPoints(p[n - 2], p[n - 1], p[n], p[n + 1], p[n + 2], p[n + 3], tension);
              allPoints.push(cp[0]);
              allPoints.push(cp[1]);
              allPoints.push(p[n]);
              allPoints.push(p[n + 1]);
              allPoints.push(cp[2]);
              allPoints.push(cp[3]);
          }
          return allPoints;
      },
      each: function (obj, func) {
          for (var key in obj) {
              func(key, obj[key]);
          }
      },
      _inRange: function (val, left, right) {
          return left <= val && val < right;
      },
      _getProjectionToSegment: function (x1, y1, x2, y2, x3, y3) {
          var x, y, dist;
          var pd2 = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
          if (pd2 == 0) {
              x = x1;
              y = y1;
              dist = (x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2);
          }
          else {
              var u = ((x3 - x1) * (x2 - x1) + (y3 - y1) * (y2 - y1)) / pd2;
              if (u < 0) {
                  x = x1;
                  y = y1;
                  dist = (x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3);
              }
              else if (u > 1.0) {
                  x = x2;
                  y = y2;
                  dist = (x2 - x3) * (x2 - x3) + (y2 - y3) * (y2 - y3);
              }
              else {
                  x = x1 + u * (x2 - x1);
                  y = y1 + u * (y2 - y1);
                  dist = (x - x3) * (x - x3) + (y - y3) * (y - y3);
              }
          }
          return [x, y, dist];
      },
      _getProjectionToLine: function (pt, line, isClosed) {
          var pc = exports.Util.cloneObject(pt);
          var dist = Number.MAX_VALUE;
          line.forEach(function (p1, i) {
              if (!isClosed && i === line.length - 1) {
                  return;
              }
              var p2 = line[(i + 1) % line.length];
              var proj = exports.Util._getProjectionToSegment(p1.x, p1.y, p2.x, p2.y, pt.x, pt.y);
              var px = proj[0], py = proj[1], pdist = proj[2];
              if (pdist < dist) {
                  pc.x = px;
                  pc.y = py;
                  dist = pdist;
              }
          });
          return pc;
      },
      _prepareArrayForTween: function (startArray, endArray, isClosed) {
          var n, start = [], end = [];
          if (startArray.length > endArray.length) {
              var temp = endArray;
              endArray = startArray;
              startArray = temp;
          }
          for (n = 0; n < startArray.length; n += 2) {
              start.push({
                  x: startArray[n],
                  y: startArray[n + 1],
              });
          }
          for (n = 0; n < endArray.length; n += 2) {
              end.push({
                  x: endArray[n],
                  y: endArray[n + 1],
              });
          }
          var newStart = [];
          end.forEach(function (point) {
              var pr = exports.Util._getProjectionToLine(point, start, isClosed);
              newStart.push(pr.x);
              newStart.push(pr.y);
          });
          return newStart;
      },
      _prepareToStringify: function (obj) {
          var desc;
          obj.visitedByCircularReferenceRemoval = true;
          for (var key in obj) {
              if (!(obj.hasOwnProperty(key) && obj[key] && typeof obj[key] == 'object')) {
                  continue;
              }
              desc = Object.getOwnPropertyDescriptor(obj, key);
              if (obj[key].visitedByCircularReferenceRemoval ||
                  exports.Util._isElement(obj[key])) {
                  if (desc.configurable) {
                      delete obj[key];
                  }
                  else {
                      return null;
                  }
              }
              else if (exports.Util._prepareToStringify(obj[key]) === null) {
                  if (desc.configurable) {
                      delete obj[key];
                  }
                  else {
                      return null;
                  }
              }
          }
          delete obj.visitedByCircularReferenceRemoval;
          return obj;
      },
      _assign: function (target, source) {
          for (var key in source) {
              target[key] = source[key];
          }
          return target;
      },
      _getFirstPointerId: function (evt) {
          if (!evt.touches) {
              return 999;
          }
          else {
              return evt.changedTouches[0].identifier;
          }
      },
  };
  });

  unwrapExports(Util);
  var Util_1 = Util.Collection;
  var Util_2 = Util.Transform;
  var Util_3 = Util.Util;

  var Validators = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });


  function _formatValue(val) {
      if (Util.Util._isString(val)) {
          return '"' + val + '"';
      }
      if (Object.prototype.toString.call(val) === '[object Number]') {
          return val;
      }
      if (Util.Util._isBoolean(val)) {
          return val;
      }
      return Object.prototype.toString.call(val);
  }
  function RGBComponent(val) {
      if (val > 255) {
          return 255;
      }
      else if (val < 0) {
          return 0;
      }
      return Math.round(val);
  }
  exports.RGBComponent = RGBComponent;
  function alphaComponent(val) {
      if (val > 1) {
          return 1;
      }
      else if (val < 0.0001) {
          return 0.0001;
      }
      return val;
  }
  exports.alphaComponent = alphaComponent;
  function getNumberValidator() {
      if (Global.Konva.isUnminified) {
          return function (val, attr) {
              if (!Util.Util._isNumber(val)) {
                  Util.Util.warn(_formatValue(val) +
                      ' is a not valid value for "' +
                      attr +
                      '" attribute. The value should be a number.');
              }
              return val;
          };
      }
  }
  exports.getNumberValidator = getNumberValidator;
  function getNumberOrAutoValidator() {
      if (Global.Konva.isUnminified) {
          return function (val, attr) {
              var isNumber = Util.Util._isNumber(val);
              var isAuto = val === 'auto';
              if (!(isNumber || isAuto)) {
                  Util.Util.warn(_formatValue(val) +
                      ' is a not valid value for "' +
                      attr +
                      '" attribute. The value should be a number or "auto".');
              }
              return val;
          };
      }
  }
  exports.getNumberOrAutoValidator = getNumberOrAutoValidator;
  function getStringValidator() {
      if (Global.Konva.isUnminified) {
          return function (val, attr) {
              if (!Util.Util._isString(val)) {
                  Util.Util.warn(_formatValue(val) +
                      ' is a not valid value for "' +
                      attr +
                      '" attribute. The value should be a string.');
              }
              return val;
          };
      }
  }
  exports.getStringValidator = getStringValidator;
  function getFunctionValidator() {
      if (Global.Konva.isUnminified) {
          return function (val, attr) {
              if (!Util.Util._isFunction(val)) {
                  Util.Util.warn(_formatValue(val) +
                      ' is a not valid value for "' +
                      attr +
                      '" attribute. The value should be a function.');
              }
              return val;
          };
      }
  }
  exports.getFunctionValidator = getFunctionValidator;
  function getNumberArrayValidator() {
      if (Global.Konva.isUnminified) {
          return function (val, attr) {
              if (!Util.Util._isArray(val)) {
                  Util.Util.warn(_formatValue(val) +
                      ' is a not valid value for "' +
                      attr +
                      '" attribute. The value should be a array of numbers.');
              }
              else {
                  val.forEach(function (item) {
                      if (!Util.Util._isNumber(item)) {
                          Util.Util.warn('"' +
                              attr +
                              '" attribute has non numeric element ' +
                              item +
                              '. Make sure that all elements are numbers.');
                      }
                  });
              }
              return val;
          };
      }
  }
  exports.getNumberArrayValidator = getNumberArrayValidator;
  function getBooleanValidator() {
      if (Global.Konva.isUnminified) {
          return function (val, attr) {
              var isBool = val === true || val === false;
              if (!isBool) {
                  Util.Util.warn(_formatValue(val) +
                      ' is a not valid value for "' +
                      attr +
                      '" attribute. The value should be a boolean.');
              }
              return val;
          };
      }
  }
  exports.getBooleanValidator = getBooleanValidator;
  function getComponentValidator(components) {
      if (Global.Konva.isUnminified) {
          return function (val, attr) {
              if (!Util.Util.isObject(val)) {
                  Util.Util.warn(_formatValue(val) +
                      ' is a not valid value for "' +
                      attr +
                      '" attribute. The value should be an object with properties ' +
                      components);
              }
              return val;
          };
      }
  }
  exports.getComponentValidator = getComponentValidator;
  });

  unwrapExports(Validators);
  var Validators_1 = Validators.RGBComponent;
  var Validators_2 = Validators.alphaComponent;
  var Validators_3 = Validators.getNumberValidator;
  var Validators_4 = Validators.getNumberOrAutoValidator;
  var Validators_5 = Validators.getStringValidator;
  var Validators_6 = Validators.getFunctionValidator;
  var Validators_7 = Validators.getNumberArrayValidator;
  var Validators_8 = Validators.getBooleanValidator;
  var Validators_9 = Validators.getComponentValidator;

  var Factory = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });


  var GET = 'get', SET = 'set';
  exports.Factory = {
      addGetterSetter: function (constructor, attr, def, validator, after) {
          exports.Factory.addGetter(constructor, attr, def);
          exports.Factory.addSetter(constructor, attr, validator, after);
          exports.Factory.addOverloadedGetterSetter(constructor, attr);
      },
      addGetter: function (constructor, attr, def) {
          var method = GET + Util.Util._capitalize(attr);
          constructor.prototype[method] =
              constructor.prototype[method] ||
                  function () {
                      var val = this.attrs[attr];
                      return val === undefined ? def : val;
                  };
      },
      addSetter: function (constructor, attr, validator, after) {
          var method = SET + Util.Util._capitalize(attr);
          if (!constructor.prototype[method]) {
              exports.Factory.overWriteSetter(constructor, attr, validator, after);
          }
      },
      overWriteSetter: function (constructor, attr, validator, after) {
          var method = SET + Util.Util._capitalize(attr);
          constructor.prototype[method] = function (val) {
              if (validator && val !== undefined && val !== null) {
                  val = validator.call(this, val, attr);
              }
              this._setAttr(attr, val);
              if (after) {
                  after.call(this);
              }
              return this;
          };
      },
      addComponentsGetterSetter: function (constructor, attr, components, validator, after) {
          var len = components.length, capitalize = Util.Util._capitalize, getter = GET + capitalize(attr), setter = SET + capitalize(attr), n, component;
          constructor.prototype[getter] = function () {
              var ret = {};
              for (n = 0; n < len; n++) {
                  component = components[n];
                  ret[component] = this.getAttr(attr + capitalize(component));
              }
              return ret;
          };
          var basicValidator = Validators.getComponentValidator(components);
          constructor.prototype[setter] = function (val) {
              var oldVal = this.attrs[attr], key;
              if (validator) {
                  val = validator.call(this, val);
              }
              if (basicValidator) {
                  basicValidator.call(this, val, attr);
              }
              for (key in val) {
                  if (!val.hasOwnProperty(key)) {
                      continue;
                  }
                  this._setAttr(attr + capitalize(key), val[key]);
              }
              this._fireChangeEvent(attr, oldVal, val);
              if (after) {
                  after.call(this);
              }
              return this;
          };
          exports.Factory.addOverloadedGetterSetter(constructor, attr);
      },
      addOverloadedGetterSetter: function (constructor, attr) {
          var capitalizedAttr = Util.Util._capitalize(attr), setter = SET + capitalizedAttr, getter = GET + capitalizedAttr;
          constructor.prototype[attr] = function () {
              if (arguments.length) {
                  this[setter](arguments[0]);
                  return this;
              }
              return this[getter]();
          };
      },
      addDeprecatedGetterSetter: function (constructor, attr, def, validator) {
          Util.Util.error('Adding deprecated ' + attr);
          var method = GET + Util.Util._capitalize(attr);
          var message = attr +
              ' property is deprecated and will be removed soon. Look at Konva change log for more information.';
          constructor.prototype[method] = function () {
              Util.Util.error(message);
              var val = this.attrs[attr];
              return val === undefined ? def : val;
          };
          exports.Factory.addSetter(constructor, attr, validator, function () {
              Util.Util.error(message);
          });
          exports.Factory.addOverloadedGetterSetter(constructor, attr);
      },
      backCompat: function (constructor, methods) {
          Util.Util.each(methods, function (oldMethodName, newMethodName) {
              var method = constructor.prototype[newMethodName];
              var oldGetter = GET + Util.Util._capitalize(oldMethodName);
              var oldSetter = SET + Util.Util._capitalize(oldMethodName);
              function deprecated() {
                  method.apply(this, arguments);
                  Util.Util.error('"' +
                      oldMethodName +
                      '" method is deprecated and will be removed soon. Use ""' +
                      newMethodName +
                      '" instead.');
              }
              constructor.prototype[oldMethodName] = deprecated;
              constructor.prototype[oldGetter] = deprecated;
              constructor.prototype[oldSetter] = deprecated;
          });
      },
      afterSetFilter: function () {
          this._filterUpToDate = false;
      },
  };
  });

  unwrapExports(Factory);
  var Factory_1 = Factory.Factory;

  var Context_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });


  var COMMA = ',', OPEN_PAREN = '(', CLOSE_PAREN = ')', OPEN_PAREN_BRACKET = '([', CLOSE_BRACKET_PAREN = '])', SEMICOLON = ';', DOUBLE_PAREN = '()', EQUALS = '=', CONTEXT_METHODS = [
      'arc',
      'arcTo',
      'beginPath',
      'bezierCurveTo',
      'clearRect',
      'clip',
      'closePath',
      'createLinearGradient',
      'createPattern',
      'createRadialGradient',
      'drawImage',
      'ellipse',
      'fill',
      'fillText',
      'getImageData',
      'createImageData',
      'lineTo',
      'moveTo',
      'putImageData',
      'quadraticCurveTo',
      'rect',
      'restore',
      'rotate',
      'save',
      'scale',
      'setLineDash',
      'setTransform',
      'stroke',
      'strokeText',
      'transform',
      'translate',
  ];
  var CONTEXT_PROPERTIES = [
      'fillStyle',
      'strokeStyle',
      'shadowColor',
      'shadowBlur',
      'shadowOffsetX',
      'shadowOffsetY',
      'lineCap',
      'lineDashOffset',
      'lineJoin',
      'lineWidth',
      'miterLimit',
      'font',
      'textAlign',
      'textBaseline',
      'globalAlpha',
      'globalCompositeOperation',
      'imageSmoothingEnabled',
  ];
  var traceArrMax = 100;
  var Context = (function () {
      function Context(canvas) {
          this.canvas = canvas;
          this._context = canvas._canvas.getContext('2d');
          if (Global.Konva.enableTrace) {
              this.traceArr = [];
              this._enableTrace();
          }
      }
      Context.prototype.fillShape = function (shape) {
          if (shape.fillEnabled()) {
              this._fill(shape);
          }
      };
      Context.prototype._fill = function (shape) {
      };
      Context.prototype.strokeShape = function (shape) {
          if (shape.hasStroke()) {
              this._stroke(shape);
          }
      };
      Context.prototype._stroke = function (shape) {
      };
      Context.prototype.fillStrokeShape = function (shape) {
          this.fillShape(shape);
          this.strokeShape(shape);
      };
      Context.prototype.getTrace = function (relaxed) {
          var traceArr = this.traceArr, len = traceArr.length, str = '', n, trace, method, args;
          for (n = 0; n < len; n++) {
              trace = traceArr[n];
              method = trace.method;
              if (method) {
                  args = trace.args;
                  str += method;
                  if (relaxed) {
                      str += DOUBLE_PAREN;
                  }
                  else {
                      if (Util.Util._isArray(args[0])) {
                          str += OPEN_PAREN_BRACKET + args.join(COMMA) + CLOSE_BRACKET_PAREN;
                      }
                      else {
                          str += OPEN_PAREN + args.join(COMMA) + CLOSE_PAREN;
                      }
                  }
              }
              else {
                  str += trace.property;
                  if (!relaxed) {
                      str += EQUALS + trace.val;
                  }
              }
              str += SEMICOLON;
          }
          return str;
      };
      Context.prototype.clearTrace = function () {
          this.traceArr = [];
      };
      Context.prototype._trace = function (str) {
          var traceArr = this.traceArr, len;
          traceArr.push(str);
          len = traceArr.length;
          if (len >= traceArrMax) {
              traceArr.shift();
          }
      };
      Context.prototype.reset = function () {
          var pixelRatio = this.getCanvas().getPixelRatio();
          this.setTransform(1 * pixelRatio, 0, 0, 1 * pixelRatio, 0, 0);
      };
      Context.prototype.getCanvas = function () {
          return this.canvas;
      };
      Context.prototype.clear = function (bounds) {
          var canvas = this.getCanvas();
          if (bounds) {
              this.clearRect(bounds.x || 0, bounds.y || 0, bounds.width || 0, bounds.height || 0);
          }
          else {
              this.clearRect(0, 0, canvas.getWidth() / canvas.pixelRatio, canvas.getHeight() / canvas.pixelRatio);
          }
      };
      Context.prototype._applyLineCap = function (shape) {
          var lineCap = shape.getLineCap();
          if (lineCap) {
              this.setAttr('lineCap', lineCap);
          }
      };
      Context.prototype._applyOpacity = function (shape) {
          var absOpacity = shape.getAbsoluteOpacity();
          if (absOpacity !== 1) {
              this.setAttr('globalAlpha', absOpacity);
          }
      };
      Context.prototype._applyLineJoin = function (shape) {
          var lineJoin = shape.attrs.lineJoin;
          if (lineJoin) {
              this.setAttr('lineJoin', lineJoin);
          }
      };
      Context.prototype.setAttr = function (attr, val) {
          this._context[attr] = val;
      };
      Context.prototype.arc = function (a0, a1, a2, a3, a4, a5) {
          this._context.arc(a0, a1, a2, a3, a4, a5);
      };
      Context.prototype.arcTo = function (a0, a1, a2, a3, a4) {
          this._context.arcTo(a0, a1, a2, a3, a4);
      };
      Context.prototype.beginPath = function () {
          this._context.beginPath();
      };
      Context.prototype.bezierCurveTo = function (a0, a1, a2, a3, a4, a5) {
          this._context.bezierCurveTo(a0, a1, a2, a3, a4, a5);
      };
      Context.prototype.clearRect = function (a0, a1, a2, a3) {
          this._context.clearRect(a0, a1, a2, a3);
      };
      Context.prototype.clip = function () {
          this._context.clip();
      };
      Context.prototype.closePath = function () {
          this._context.closePath();
      };
      Context.prototype.createImageData = function (a0, a1) {
          var a = arguments;
          if (a.length === 2) {
              return this._context.createImageData(a0, a1);
          }
          else if (a.length === 1) {
              return this._context.createImageData(a0);
          }
      };
      Context.prototype.createLinearGradient = function (a0, a1, a2, a3) {
          return this._context.createLinearGradient(a0, a1, a2, a3);
      };
      Context.prototype.createPattern = function (a0, a1) {
          return this._context.createPattern(a0, a1);
      };
      Context.prototype.createRadialGradient = function (a0, a1, a2, a3, a4, a5) {
          return this._context.createRadialGradient(a0, a1, a2, a3, a4, a5);
      };
      Context.prototype.drawImage = function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
          var a = arguments, _context = this._context;
          if (a.length === 3) {
              _context.drawImage(a0, a1, a2);
          }
          else if (a.length === 5) {
              _context.drawImage(a0, a1, a2, a3, a4);
          }
          else if (a.length === 9) {
              _context.drawImage(a0, a1, a2, a3, a4, a5, a6, a7, a8);
          }
      };
      Context.prototype.ellipse = function (a0, a1, a2, a3, a4, a5, a6, a7) {
          this._context.ellipse(a0, a1, a2, a3, a4, a5, a6, a7);
      };
      Context.prototype.isPointInPath = function (x, y) {
          return this._context.isPointInPath(x, y);
      };
      Context.prototype.fill = function () {
          this._context.fill();
      };
      Context.prototype.fillRect = function (x, y, width, height) {
          this._context.fillRect(x, y, width, height);
      };
      Context.prototype.strokeRect = function (x, y, width, height) {
          this._context.strokeRect(x, y, width, height);
      };
      Context.prototype.fillText = function (a0, a1, a2) {
          this._context.fillText(a0, a1, a2);
      };
      Context.prototype.measureText = function (text) {
          return this._context.measureText(text);
      };
      Context.prototype.getImageData = function (a0, a1, a2, a3) {
          return this._context.getImageData(a0, a1, a2, a3);
      };
      Context.prototype.lineTo = function (a0, a1) {
          this._context.lineTo(a0, a1);
      };
      Context.prototype.moveTo = function (a0, a1) {
          this._context.moveTo(a0, a1);
      };
      Context.prototype.rect = function (a0, a1, a2, a3) {
          this._context.rect(a0, a1, a2, a3);
      };
      Context.prototype.putImageData = function (a0, a1, a2) {
          this._context.putImageData(a0, a1, a2);
      };
      Context.prototype.quadraticCurveTo = function (a0, a1, a2, a3) {
          this._context.quadraticCurveTo(a0, a1, a2, a3);
      };
      Context.prototype.restore = function () {
          this._context.restore();
      };
      Context.prototype.rotate = function (a0) {
          this._context.rotate(a0);
      };
      Context.prototype.save = function () {
          this._context.save();
      };
      Context.prototype.scale = function (a0, a1) {
          this._context.scale(a0, a1);
      };
      Context.prototype.setLineDash = function (a0) {
          if (this._context.setLineDash) {
              this._context.setLineDash(a0);
          }
          else if ('mozDash' in this._context) {
              this._context['mozDash'] = a0;
          }
          else if ('webkitLineDash' in this._context) {
              this._context['webkitLineDash'] = a0;
          }
      };
      Context.prototype.getLineDash = function () {
          return this._context.getLineDash();
      };
      Context.prototype.setTransform = function (a0, a1, a2, a3, a4, a5) {
          this._context.setTransform(a0, a1, a2, a3, a4, a5);
      };
      Context.prototype.stroke = function () {
          this._context.stroke();
      };
      Context.prototype.strokeText = function (a0, a1, a2, a3) {
          this._context.strokeText(a0, a1, a2, a3);
      };
      Context.prototype.transform = function (a0, a1, a2, a3, a4, a5) {
          this._context.transform(a0, a1, a2, a3, a4, a5);
      };
      Context.prototype.translate = function (a0, a1) {
          this._context.translate(a0, a1);
      };
      Context.prototype._enableTrace = function () {
          var that = this, len = CONTEXT_METHODS.length, _simplifyArray = Util.Util._simplifyArray, origSetter = this.setAttr, n, args;
          var func = function (methodName) {
              var origMethod = that[methodName], ret;
              that[methodName] = function () {
                  args = _simplifyArray(Array.prototype.slice.call(arguments, 0));
                  ret = origMethod.apply(that, arguments);
                  that._trace({
                      method: methodName,
                      args: args,
                  });
                  return ret;
              };
          };
          for (n = 0; n < len; n++) {
              func(CONTEXT_METHODS[n]);
          }
          that.setAttr = function () {
              origSetter.apply(that, arguments);
              var prop = arguments[0];
              var val = arguments[1];
              if (prop === 'shadowOffsetX' ||
                  prop === 'shadowOffsetY' ||
                  prop === 'shadowBlur') {
                  val = val / this.canvas.getPixelRatio();
              }
              that._trace({
                  property: prop,
                  val: val,
              });
          };
      };
      Context.prototype._applyGlobalCompositeOperation = function (node) {
          var globalCompositeOperation = node.getGlobalCompositeOperation();
          if (globalCompositeOperation !== 'source-over') {
              this.setAttr('globalCompositeOperation', globalCompositeOperation);
          }
      };
      return Context;
  }());
  exports.Context = Context;
  CONTEXT_PROPERTIES.forEach(function (prop) {
      Object.defineProperty(Context.prototype, prop, {
          get: function () {
              return this._context[prop];
          },
          set: function (val) {
              this._context[prop] = val;
          },
      });
  });
  var SceneContext = (function (_super) {
      __extends(SceneContext, _super);
      function SceneContext() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      SceneContext.prototype._fillColor = function (shape) {
          var fill = shape.fill();
          this.setAttr('fillStyle', fill);
          shape._fillFunc(this);
      };
      SceneContext.prototype._fillPattern = function (shape) {
          var fillPatternX = shape.getFillPatternX(), fillPatternY = shape.getFillPatternY(), fillPatternRotation = Global.Konva.getAngle(shape.getFillPatternRotation()), fillPatternOffsetX = shape.getFillPatternOffsetX(), fillPatternOffsetY = shape.getFillPatternOffsetY(), fillPatternScaleX = shape.getFillPatternScaleX(), fillPatternScaleY = shape.getFillPatternScaleY();
          if (fillPatternX || fillPatternY) {
              this.translate(fillPatternX || 0, fillPatternY || 0);
          }
          if (fillPatternRotation) {
              this.rotate(fillPatternRotation);
          }
          if (fillPatternScaleX || fillPatternScaleY) {
              this.scale(fillPatternScaleX, fillPatternScaleY);
          }
          if (fillPatternOffsetX || fillPatternOffsetY) {
              this.translate(-1 * fillPatternOffsetX, -1 * fillPatternOffsetY);
          }
          this.setAttr('fillStyle', shape._getFillPattern());
          shape._fillFunc(this);
      };
      SceneContext.prototype._fillLinearGradient = function (shape) {
          var grd = shape._getLinearGradient();
          if (grd) {
              this.setAttr('fillStyle', grd);
              shape._fillFunc(this);
          }
      };
      SceneContext.prototype._fillRadialGradient = function (shape) {
          var grd = shape._getRadialGradient();
          if (grd) {
              this.setAttr('fillStyle', grd);
              shape._fillFunc(this);
          }
      };
      SceneContext.prototype._fill = function (shape) {
          var hasColor = shape.fill(), fillPriority = shape.getFillPriority();
          if (hasColor && fillPriority === 'color') {
              this._fillColor(shape);
              return;
          }
          var hasPattern = shape.getFillPatternImage();
          if (hasPattern && fillPriority === 'pattern') {
              this._fillPattern(shape);
              return;
          }
          var hasLinearGradient = shape.getFillLinearGradientColorStops();
          if (hasLinearGradient && fillPriority === 'linear-gradient') {
              this._fillLinearGradient(shape);
              return;
          }
          var hasRadialGradient = shape.getFillRadialGradientColorStops();
          if (hasRadialGradient && fillPriority === 'radial-gradient') {
              this._fillRadialGradient(shape);
              return;
          }
          if (hasColor) {
              this._fillColor(shape);
          }
          else if (hasPattern) {
              this._fillPattern(shape);
          }
          else if (hasLinearGradient) {
              this._fillLinearGradient(shape);
          }
          else if (hasRadialGradient) {
              this._fillRadialGradient(shape);
          }
      };
      SceneContext.prototype._strokeLinearGradient = function (shape) {
          var start = shape.getStrokeLinearGradientStartPoint(), end = shape.getStrokeLinearGradientEndPoint(), colorStops = shape.getStrokeLinearGradientColorStops(), grd = this.createLinearGradient(start.x, start.y, end.x, end.y);
          if (colorStops) {
              for (var n = 0; n < colorStops.length; n += 2) {
                  grd.addColorStop(colorStops[n], colorStops[n + 1]);
              }
              this.setAttr('strokeStyle', grd);
          }
      };
      SceneContext.prototype._stroke = function (shape) {
          var dash = shape.dash(), strokeScaleEnabled = shape.getStrokeScaleEnabled();
          if (shape.hasStroke()) {
              if (!strokeScaleEnabled) {
                  this.save();
                  var pixelRatio = this.getCanvas().getPixelRatio();
                  this.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
              }
              this._applyLineCap(shape);
              if (dash && shape.dashEnabled()) {
                  this.setLineDash(dash);
                  this.setAttr('lineDashOffset', shape.dashOffset());
              }
              this.setAttr('lineWidth', shape.strokeWidth());
              if (!shape.getShadowForStrokeEnabled()) {
                  this.setAttr('shadowColor', 'rgba(0,0,0,0)');
              }
              var hasLinearGradient = shape.getStrokeLinearGradientColorStops();
              if (hasLinearGradient) {
                  this._strokeLinearGradient(shape);
              }
              else {
                  this.setAttr('strokeStyle', shape.stroke());
              }
              shape._strokeFunc(this);
              if (!strokeScaleEnabled) {
                  this.restore();
              }
          }
      };
      SceneContext.prototype._applyShadow = function (shape) {
          var util = Util.Util, color = util.get(shape.getShadowRGBA(), 'black'), blur = util.get(shape.getShadowBlur(), 5), offset = util.get(shape.getShadowOffset(), {
              x: 0,
              y: 0,
          }), scale = shape.getAbsoluteScale(), ratio = this.canvas.getPixelRatio(), scaleX = scale.x * ratio, scaleY = scale.y * ratio;
          this.setAttr('shadowColor', color);
          this.setAttr('shadowBlur', blur * Math.min(Math.abs(scaleX), Math.abs(scaleY)));
          this.setAttr('shadowOffsetX', offset.x * scaleX);
          this.setAttr('shadowOffsetY', offset.y * scaleY);
      };
      return SceneContext;
  }(Context));
  exports.SceneContext = SceneContext;
  var HitContext = (function (_super) {
      __extends(HitContext, _super);
      function HitContext() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      HitContext.prototype._fill = function (shape) {
          this.save();
          this.setAttr('fillStyle', shape.colorKey);
          shape._fillFuncHit(this);
          this.restore();
      };
      HitContext.prototype.strokeShape = function (shape) {
          if (shape.hasHitStroke()) {
              this._stroke(shape);
          }
      };
      HitContext.prototype._stroke = function (shape) {
          if (shape.hasHitStroke()) {
              var strokeScaleEnabled = shape.getStrokeScaleEnabled();
              if (!strokeScaleEnabled) {
                  this.save();
                  var pixelRatio = this.getCanvas().getPixelRatio();
                  this.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
              }
              this._applyLineCap(shape);
              var hitStrokeWidth = shape.hitStrokeWidth();
              var strokeWidth = hitStrokeWidth === 'auto' ? shape.strokeWidth() : hitStrokeWidth;
              this.setAttr('lineWidth', strokeWidth);
              this.setAttr('strokeStyle', shape.colorKey);
              shape._strokeFuncHit(this);
              if (!strokeScaleEnabled) {
                  this.restore();
              }
          }
      };
      return HitContext;
  }(Context));
  exports.HitContext = HitContext;
  });

  unwrapExports(Context_1);
  var Context_2 = Context_1.Context;
  var Context_3 = Context_1.SceneContext;
  var Context_4 = Context_1.HitContext;

  var Canvas_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var _pixelRatio;
  function getDevicePixelRatio() {
      if (_pixelRatio) {
          return _pixelRatio;
      }
      var canvas = Util.Util.createCanvasElement();
      var context = canvas.getContext('2d');
      _pixelRatio = (function () {
          var devicePixelRatio = Global.Konva._global.devicePixelRatio || 1, backingStoreRatio = context.webkitBackingStorePixelRatio ||
              context.mozBackingStorePixelRatio ||
              context.msBackingStorePixelRatio ||
              context.oBackingStorePixelRatio ||
              context.backingStorePixelRatio ||
              1;
          return devicePixelRatio / backingStoreRatio;
      })();
      return _pixelRatio;
  }
  var Canvas = (function () {
      function Canvas(config) {
          this.pixelRatio = 1;
          this.width = 0;
          this.height = 0;
          this.isCache = false;
          var conf = config || {};
          var pixelRatio = conf.pixelRatio || Global.Konva.pixelRatio || getDevicePixelRatio();
          this.pixelRatio = pixelRatio;
          this._canvas = Util.Util.createCanvasElement();
          this._canvas.style.padding = '0';
          this._canvas.style.margin = '0';
          this._canvas.style.border = '0';
          this._canvas.style.background = 'transparent';
          this._canvas.style.position = 'absolute';
          this._canvas.style.top = '0';
          this._canvas.style.left = '0';
      }
      Canvas.prototype.getContext = function () {
          return this.context;
      };
      Canvas.prototype.getPixelRatio = function () {
          return this.pixelRatio;
      };
      Canvas.prototype.setPixelRatio = function (pixelRatio) {
          var previousRatio = this.pixelRatio;
          this.pixelRatio = pixelRatio;
          this.setSize(this.getWidth() / previousRatio, this.getHeight() / previousRatio);
      };
      Canvas.prototype.setWidth = function (width) {
          this.width = this._canvas.width = width * this.pixelRatio;
          this._canvas.style.width = width + 'px';
          var pixelRatio = this.pixelRatio, _context = this.getContext()._context;
          _context.scale(pixelRatio, pixelRatio);
      };
      Canvas.prototype.setHeight = function (height) {
          this.height = this._canvas.height = height * this.pixelRatio;
          this._canvas.style.height = height + 'px';
          var pixelRatio = this.pixelRatio, _context = this.getContext()._context;
          _context.scale(pixelRatio, pixelRatio);
      };
      Canvas.prototype.getWidth = function () {
          return this.width;
      };
      Canvas.prototype.getHeight = function () {
          return this.height;
      };
      Canvas.prototype.setSize = function (width, height) {
          this.setWidth(width || 0);
          this.setHeight(height || 0);
      };
      Canvas.prototype.toDataURL = function (mimeType, quality) {
          try {
              return this._canvas.toDataURL(mimeType, quality);
          }
          catch (e) {
              try {
                  return this._canvas.toDataURL();
              }
              catch (err) {
                  Util.Util.error('Unable to get data URL. ' +
                      err.message +
                      ' For more info read https://konvajs.org/docs/posts/Tainted_Canvas.html.');
                  return '';
              }
          }
      };
      return Canvas;
  }());
  exports.Canvas = Canvas;
  Factory.Factory.addGetterSetter(Canvas, 'pixelRatio', undefined, Validators.getNumberValidator());
  var SceneCanvas = (function (_super) {
      __extends(SceneCanvas, _super);
      function SceneCanvas(config) {
          if (config === void 0) { config = { width: 0, height: 0 }; }
          var _this = _super.call(this, config) || this;
          _this.context = new Context_1.SceneContext(_this);
          _this.setSize(config.width, config.height);
          return _this;
      }
      return SceneCanvas;
  }(Canvas));
  exports.SceneCanvas = SceneCanvas;
  var HitCanvas = (function (_super) {
      __extends(HitCanvas, _super);
      function HitCanvas(config) {
          if (config === void 0) { config = { width: 0, height: 0 }; }
          var _this = _super.call(this, config) || this;
          _this.hitCanvas = true;
          _this.context = new Context_1.HitContext(_this);
          _this.setSize(config.width, config.height);
          return _this;
      }
      return HitCanvas;
  }(Canvas));
  exports.HitCanvas = HitCanvas;
  });

  unwrapExports(Canvas_1);
  var Canvas_2 = Canvas_1.Canvas;
  var Canvas_3 = Canvas_1.SceneCanvas;
  var Canvas_4 = Canvas_1.HitCanvas;

  var DragAndDrop = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });


  exports.DD = {
      get isDragging() {
          var flag = false;
          exports.DD._dragElements.forEach(function (elem) {
              if (elem.dragStatus === 'dragging') {
                  flag = true;
              }
          });
          return flag;
      },
      justDragged: false,
      get node() {
          var node;
          exports.DD._dragElements.forEach(function (elem) {
              node = elem.node;
          });
          return node;
      },
      _dragElements: new Map(),
      _drag: function (evt) {
          var nodesToFireEvents = [];
          exports.DD._dragElements.forEach(function (elem, key) {
              var node = elem.node;
              var stage = node.getStage();
              stage.setPointersPositions(evt);
              if (elem.pointerId === undefined) {
                  elem.pointerId = Util.Util._getFirstPointerId(evt);
              }
              var pos = stage._changedPointerPositions.find(function (pos) { return pos.id === elem.pointerId; });
              if (!pos) {
                  return;
              }
              if (elem.dragStatus !== 'dragging') {
                  var dragDistance = node.dragDistance();
                  var distance = Math.max(Math.abs(pos.x - elem.startPointerPos.x), Math.abs(pos.y - elem.startPointerPos.y));
                  if (distance < dragDistance) {
                      return;
                  }
                  node.startDrag({ evt: evt });
                  if (!node.isDragging()) {
                      return;
                  }
              }
              node._setDragPosition(evt, elem);
              nodesToFireEvents.push(node);
          });
          nodesToFireEvents.forEach(function (node) {
              node.fire('dragmove', {
                  type: 'dragmove',
                  target: node,
                  evt: evt,
              }, true);
          });
      },
      _endDragBefore: function (evt) {
          exports.DD._dragElements.forEach(function (elem, key) {
              var node = elem.node;
              var stage = node.getStage();
              if (evt) {
                  stage.setPointersPositions(evt);
              }
              var pos = stage._changedPointerPositions.find(function (pos) { return pos.id === elem.pointerId; });
              if (!pos) {
                  return;
              }
              if (elem.dragStatus === 'dragging' || elem.dragStatus === 'stopped') {
                  exports.DD.justDragged = true;
                  Global.Konva.listenClickTap = false;
                  elem.dragStatus = 'stopped';
              }
              var drawNode = elem.node.getLayer() ||
                  (elem.node instanceof Global.Konva['Stage'] && elem.node);
              if (drawNode) {
                  drawNode.draw();
              }
          });
      },
      _endDragAfter: function (evt) {
          exports.DD._dragElements.forEach(function (elem, key) {
              if (elem.dragStatus === 'stopped') {
                  elem.node.fire('dragend', {
                      type: 'dragend',
                      target: elem.node,
                      evt: evt,
                  }, true);
              }
              if (elem.dragStatus !== 'dragging') {
                  exports.DD._dragElements.delete(key);
              }
          });
      },
  };
  if (Global.Konva.isBrowser) {
      window.addEventListener('mouseup', exports.DD._endDragBefore, true);
      window.addEventListener('touchend', exports.DD._endDragBefore, true);
      window.addEventListener('mousemove', exports.DD._drag);
      window.addEventListener('touchmove', exports.DD._drag);
      window.addEventListener('mouseup', exports.DD._endDragAfter, false);
      window.addEventListener('touchend', exports.DD._endDragAfter, false);
  }
  });

  unwrapExports(DragAndDrop);
  var DragAndDrop_1 = DragAndDrop.DD;

  var Node_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });






  exports.ids = {};
  exports.names = {};
  var _addId = function (node, id) {
      if (!id) {
          return;
      }
      exports.ids[id] = node;
  };
  exports._removeId = function (id, node) {
      if (!id) {
          return;
      }
      if (exports.ids[id] !== node) {
          return;
      }
      delete exports.ids[id];
  };
  exports._addName = function (node, name) {
      if (name) {
          if (!exports.names[name]) {
              exports.names[name] = [];
          }
          exports.names[name].push(node);
      }
  };
  exports._removeName = function (name, _id) {
      if (!name) {
          return;
      }
      var nodes = exports.names[name];
      if (!nodes) {
          return;
      }
      for (var n = 0; n < nodes.length; n++) {
          var no = nodes[n];
          if (no._id === _id) {
              nodes.splice(n, 1);
          }
      }
      if (nodes.length === 0) {
          delete exports.names[name];
      }
  };
  var ABSOLUTE_OPACITY = 'absoluteOpacity', ABSOLUTE_TRANSFORM = 'absoluteTransform', ABSOLUTE_SCALE = 'absoluteScale', CANVAS = 'canvas', CHANGE = 'Change', CHILDREN = 'children', KONVA = 'konva', LISTENING = 'listening', MOUSEENTER = 'mouseenter', MOUSELEAVE = 'mouseleave', NAME = 'name', SET = 'set', SHAPE = 'Shape', SPACE = ' ', STAGE = 'stage', TRANSFORM = 'transform', UPPER_STAGE = 'Stage', VISIBLE = 'visible', TRANSFORM_CHANGE_STR = [
      'xChange.konva',
      'yChange.konva',
      'scaleXChange.konva',
      'scaleYChange.konva',
      'skewXChange.konva',
      'skewYChange.konva',
      'rotationChange.konva',
      'offsetXChange.konva',
      'offsetYChange.konva',
      'transformsEnabledChange.konva',
  ].join(SPACE);
  var emptyChildren = new Util.Collection();
  var idCounter = 1;
  var Node = (function () {
      function Node(config) {
          var _this = this;
          this._id = idCounter++;
          this.eventListeners = {};
          this.attrs = {};
          this.index = 0;
          this.parent = null;
          this._cache = new Map();
          this._attachedDepsListeners = new Map();
          this._lastPos = null;
          this._batchingTransformChange = false;
          this._needClearTransformCache = false;
          this._filterUpToDate = false;
          this._isUnderCache = false;
          this.children = emptyChildren;
          this._dragEventId = null;
          this.setAttrs(config);
          this.on(TRANSFORM_CHANGE_STR, function () {
              if (_this._batchingTransformChange) {
                  _this._needClearTransformCache = true;
                  return;
              }
              _this._clearCache(TRANSFORM);
              _this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
          });
          this.on('visibleChange.konva', function () {
              _this._clearSelfAndDescendantCache(VISIBLE);
          });
          this.on('listeningChange.konva', function () {
              _this._clearSelfAndDescendantCache(LISTENING);
          });
          this.on('opacityChange.konva', function () {
              _this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
          });
      }
      Node.prototype.hasChildren = function () {
          return false;
      };
      Node.prototype.getChildren = function () {
          return emptyChildren;
      };
      Node.prototype._clearCache = function (attr) {
          if ((attr === TRANSFORM || attr === ABSOLUTE_TRANSFORM) &&
              this._cache.get(attr)) {
              this._cache.get(attr).dirty = true;
          }
          else if (attr) {
              this._cache.delete(attr);
          }
          else {
              this._cache.clear();
          }
      };
      Node.prototype._getCache = function (attr, privateGetter) {
          var cache = this._cache.get(attr);
          var isTransform = attr === TRANSFORM || attr === ABSOLUTE_TRANSFORM;
          var invalid = cache === undefined || (isTransform && cache.dirty === true);
          if (invalid) {
              cache = privateGetter.call(this);
              this._cache.set(attr, cache);
          }
          return cache;
      };
      Node.prototype._calculate = function (name, deps, getter) {
          var _this = this;
          if (!this._attachedDepsListeners.get(name)) {
              var depsString = deps.map(function (dep) { return dep + 'Change.konva'; }).join(SPACE);
              this.on(depsString, function () {
                  _this._clearCache(name);
              });
              this._attachedDepsListeners.set(name, true);
          }
          return this._getCache(name, getter);
      };
      Node.prototype._getCanvasCache = function () {
          return this._cache.get(CANVAS);
      };
      Node.prototype._clearSelfAndDescendantCache = function (attr, forceEvent) {
          this._clearCache(attr);
          if (forceEvent && attr === ABSOLUTE_TRANSFORM) {
              this.fire('_clearTransformCache');
          }
          if (this.isCached()) {
              return;
          }
          if (this.children) {
              this.children.each(function (node) {
                  node._clearSelfAndDescendantCache(attr, true);
              });
          }
      };
      Node.prototype.clearCache = function () {
          this._cache.delete(CANVAS);
          this._clearSelfAndDescendantCache();
          return this;
      };
      Node.prototype.cache = function (config) {
          var conf = config || {};
          var rect = {};
          if (conf.x === undefined ||
              conf.y === undefined ||
              conf.width === undefined ||
              conf.height === undefined) {
              rect = this.getClientRect({
                  skipTransform: true,
                  relativeTo: this.getParent(),
              });
          }
          var width = Math.ceil(conf.width || rect.width), height = Math.ceil(conf.height || rect.height), pixelRatio = conf.pixelRatio, x = conf.x === undefined ? rect.x : conf.x, y = conf.y === undefined ? rect.y : conf.y, offset = conf.offset || 0, drawBorder = conf.drawBorder || false;
          if (!width || !height) {
              Util.Util.error('Can not cache the node. Width or height of the node equals 0. Caching is skipped.');
              return;
          }
          width += offset * 2;
          height += offset * 2;
          x -= offset;
          y -= offset;
          var cachedSceneCanvas = new Canvas_1.SceneCanvas({
              pixelRatio: pixelRatio,
              width: width,
              height: height,
          }), cachedFilterCanvas = new Canvas_1.SceneCanvas({
              pixelRatio: pixelRatio,
              width: 0,
              height: 0,
          }), cachedHitCanvas = new Canvas_1.HitCanvas({
              pixelRatio: 1,
              width: width,
              height: height,
          }), sceneContext = cachedSceneCanvas.getContext(), hitContext = cachedHitCanvas.getContext();
          cachedHitCanvas.isCache = true;
          cachedSceneCanvas.isCache = true;
          this._cache.delete('canvas');
          this._filterUpToDate = false;
          if (conf.imageSmoothingEnabled === false) {
              cachedSceneCanvas.getContext()._context.imageSmoothingEnabled = false;
              cachedFilterCanvas.getContext()._context.imageSmoothingEnabled = false;
          }
          sceneContext.save();
          hitContext.save();
          sceneContext.translate(-x, -y);
          hitContext.translate(-x, -y);
          this._isUnderCache = true;
          this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
          this._clearSelfAndDescendantCache(ABSOLUTE_SCALE);
          this.drawScene(cachedSceneCanvas, this);
          this.drawHit(cachedHitCanvas, this);
          this._isUnderCache = false;
          sceneContext.restore();
          hitContext.restore();
          if (drawBorder) {
              sceneContext.save();
              sceneContext.beginPath();
              sceneContext.rect(0, 0, width, height);
              sceneContext.closePath();
              sceneContext.setAttr('strokeStyle', 'red');
              sceneContext.setAttr('lineWidth', 5);
              sceneContext.stroke();
              sceneContext.restore();
          }
          this._cache.set(CANVAS, {
              scene: cachedSceneCanvas,
              filter: cachedFilterCanvas,
              hit: cachedHitCanvas,
              x: x,
              y: y,
          });
          return this;
      };
      Node.prototype.isCached = function () {
          return this._cache.has('canvas');
      };
      Node.prototype.getClientRect = function (config) {
          throw new Error('abstract "getClientRect" method call');
      };
      Node.prototype._transformedRect = function (rect, top) {
          var points = [
              { x: rect.x, y: rect.y },
              { x: rect.x + rect.width, y: rect.y },
              { x: rect.x + rect.width, y: rect.y + rect.height },
              { x: rect.x, y: rect.y + rect.height },
          ];
          var minX, minY, maxX, maxY;
          var trans = this.getAbsoluteTransform(top);
          points.forEach(function (point) {
              var transformed = trans.point(point);
              if (minX === undefined) {
                  minX = maxX = transformed.x;
                  minY = maxY = transformed.y;
              }
              minX = Math.min(minX, transformed.x);
              minY = Math.min(minY, transformed.y);
              maxX = Math.max(maxX, transformed.x);
              maxY = Math.max(maxY, transformed.y);
          });
          return {
              x: minX,
              y: minY,
              width: maxX - minX,
              height: maxY - minY,
          };
      };
      Node.prototype._drawCachedSceneCanvas = function (context) {
          context.save();
          context._applyOpacity(this);
          context._applyGlobalCompositeOperation(this);
          var canvasCache = this._getCanvasCache();
          context.translate(canvasCache.x, canvasCache.y);
          var cacheCanvas = this._getCachedSceneCanvas();
          var ratio = cacheCanvas.pixelRatio;
          context.drawImage(cacheCanvas._canvas, 0, 0, cacheCanvas.width / ratio, cacheCanvas.height / ratio);
          context.restore();
      };
      Node.prototype._drawCachedHitCanvas = function (context) {
          var canvasCache = this._getCanvasCache(), hitCanvas = canvasCache.hit;
          context.save();
          context.translate(canvasCache.x, canvasCache.y);
          context.drawImage(hitCanvas._canvas, 0, 0);
          context.restore();
      };
      Node.prototype._getCachedSceneCanvas = function () {
          var filters = this.filters(), cachedCanvas = this._getCanvasCache(), sceneCanvas = cachedCanvas.scene, filterCanvas = cachedCanvas.filter, filterContext = filterCanvas.getContext(), len, imageData, n, filter;
          if (filters) {
              if (!this._filterUpToDate) {
                  var ratio = sceneCanvas.pixelRatio;
                  filterCanvas.setSize(sceneCanvas.width / sceneCanvas.pixelRatio, sceneCanvas.height / sceneCanvas.pixelRatio);
                  try {
                      len = filters.length;
                      filterContext.clear();
                      filterContext.drawImage(sceneCanvas._canvas, 0, 0, sceneCanvas.getWidth() / ratio, sceneCanvas.getHeight() / ratio);
                      imageData = filterContext.getImageData(0, 0, filterCanvas.getWidth(), filterCanvas.getHeight());
                      for (n = 0; n < len; n++) {
                          filter = filters[n];
                          if (typeof filter !== 'function') {
                              Util.Util.error('Filter should be type of function, but got ' +
                                  typeof filter +
                                  ' instead. Please check correct filters');
                              continue;
                          }
                          filter.call(this, imageData);
                          filterContext.putImageData(imageData, 0, 0);
                      }
                  }
                  catch (e) {
                      Util.Util.error('Unable to apply filter. ' +
                          e.message +
                          ' This post my help you https://konvajs.org/docs/posts/Tainted_Canvas.html.');
                  }
                  this._filterUpToDate = true;
              }
              return filterCanvas;
          }
          return sceneCanvas;
      };
      Node.prototype.on = function (evtStr, handler) {
          if (arguments.length === 3) {
              return this._delegate.apply(this, arguments);
          }
          var events = evtStr.split(SPACE), len = events.length, n, event, parts, baseEvent, name;
          for (n = 0; n < len; n++) {
              event = events[n];
              parts = event.split('.');
              baseEvent = parts[0];
              name = parts[1] || '';
              if (!this.eventListeners[baseEvent]) {
                  this.eventListeners[baseEvent] = [];
              }
              this.eventListeners[baseEvent].push({
                  name: name,
                  handler: handler,
              });
          }
          return this;
      };
      Node.prototype.off = function (evtStr, callback) {
          var events = (evtStr || '').split(SPACE), len = events.length, n, t, event, parts, baseEvent, name;
          if (!evtStr) {
              for (t in this.eventListeners) {
                  this._off(t);
              }
          }
          for (n = 0; n < len; n++) {
              event = events[n];
              parts = event.split('.');
              baseEvent = parts[0];
              name = parts[1];
              if (baseEvent) {
                  if (this.eventListeners[baseEvent]) {
                      this._off(baseEvent, name, callback);
                  }
              }
              else {
                  for (t in this.eventListeners) {
                      this._off(t, name, callback);
                  }
              }
          }
          return this;
      };
      Node.prototype.dispatchEvent = function (evt) {
          var e = {
              target: this,
              type: evt.type,
              evt: evt,
          };
          this.fire(evt.type, e);
          return this;
      };
      Node.prototype.addEventListener = function (type, handler) {
          this.on(type, function (evt) {
              handler.call(this, evt.evt);
          });
          return this;
      };
      Node.prototype.removeEventListener = function (type) {
          this.off(type);
          return this;
      };
      Node.prototype._delegate = function (event, selector, handler) {
          var stopNode = this;
          this.on(event, function (evt) {
              var targets = evt.target.findAncestors(selector, true, stopNode);
              for (var i = 0; i < targets.length; i++) {
                  evt = Util.Util.cloneObject(evt);
                  evt.currentTarget = targets[i];
                  handler.call(targets[i], evt);
              }
          });
      };
      Node.prototype.remove = function () {
          if (this.isDragging()) {
              this.stopDrag();
          }
          DragAndDrop.DD._dragElements.delete(this._id);
          this._remove();
          return this;
      };
      Node.prototype._clearCaches = function () {
          this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
          this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
          this._clearSelfAndDescendantCache(ABSOLUTE_SCALE);
          this._clearSelfAndDescendantCache(STAGE);
          this._clearSelfAndDescendantCache(VISIBLE);
          this._clearSelfAndDescendantCache(LISTENING);
      };
      Node.prototype._remove = function () {
          this._clearCaches();
          var parent = this.getParent();
          if (parent && parent.children) {
              parent.children.splice(this.index, 1);
              parent._setChildrenIndices();
              this.parent = null;
          }
      };
      Node.prototype.destroy = function () {
          exports._removeId(this.id(), this);
          var names = (this.name() || '').split(/\s/g);
          for (var i = 0; i < names.length; i++) {
              var subname = names[i];
              exports._removeName(subname, this._id);
          }
          this.remove();
          return this;
      };
      Node.prototype.getAttr = function (attr) {
          var method = 'get' + Util.Util._capitalize(attr);
          if (Util.Util._isFunction(this[method])) {
              return this[method]();
          }
          return this.attrs[attr];
      };
      Node.prototype.getAncestors = function () {
          var parent = this.getParent(), ancestors = new Util.Collection();
          while (parent) {
              ancestors.push(parent);
              parent = parent.getParent();
          }
          return ancestors;
      };
      Node.prototype.getAttrs = function () {
          return this.attrs || {};
      };
      Node.prototype.setAttrs = function (config) {
          var _this = this;
          this._batchTransformChanges(function () {
              var key, method;
              if (!config) {
                  return _this;
              }
              for (key in config) {
                  if (key === CHILDREN) {
                      continue;
                  }
                  method = SET + Util.Util._capitalize(key);
                  if (Util.Util._isFunction(_this[method])) {
                      _this[method](config[key]);
                  }
                  else {
                      _this._setAttr(key, config[key]);
                  }
              }
          });
          return this;
      };
      Node.prototype.isListening = function () {
          return this._getCache(LISTENING, this._isListening);
      };
      Node.prototype._isListening = function (relativeTo) {
          var listening = this.listening();
          if (!listening) {
              return false;
          }
          var parent = this.getParent();
          if (parent && parent !== relativeTo && this !== relativeTo) {
              return parent._isListening(relativeTo);
          }
          else {
              return true;
          }
      };
      Node.prototype.isVisible = function () {
          return this._getCache(VISIBLE, this._isVisible);
      };
      Node.prototype._isVisible = function (relativeTo) {
          var visible = this.visible();
          if (!visible) {
              return false;
          }
          var parent = this.getParent();
          if (parent && parent !== relativeTo && this !== relativeTo) {
              return parent._isVisible(relativeTo);
          }
          else {
              return true;
          }
      };
      Node.prototype.shouldDrawHit = function (top) {
          if (top) {
              return this._isVisible(top) && this._isListening(top);
          }
          var layer = this.getLayer();
          var layerUnderDrag = false;
          DragAndDrop.DD._dragElements.forEach(function (elem) {
              if (elem.dragStatus === 'dragging' && elem.node.getLayer() === layer) {
                  layerUnderDrag = true;
              }
          });
          var dragSkip = !Global.Konva.hitOnDragEnabled && layerUnderDrag;
          return this.isListening() && this.isVisible() && !dragSkip;
      };
      Node.prototype.show = function () {
          this.visible(true);
          return this;
      };
      Node.prototype.hide = function () {
          this.visible(false);
          return this;
      };
      Node.prototype.getZIndex = function () {
          return this.index || 0;
      };
      Node.prototype.getAbsoluteZIndex = function () {
          var depth = this.getDepth(), that = this, index = 0, nodes, len, n, child;
          function addChildren(children) {
              nodes = [];
              len = children.length;
              for (n = 0; n < len; n++) {
                  child = children[n];
                  index++;
                  if (child.nodeType !== SHAPE) {
                      nodes = nodes.concat(child.getChildren().toArray());
                  }
                  if (child._id === that._id) {
                      n = len;
                  }
              }
              if (nodes.length > 0 && nodes[0].getDepth() <= depth) {
                  addChildren(nodes);
              }
          }
          if (that.nodeType !== UPPER_STAGE) {
              addChildren(that.getStage().getChildren());
          }
          return index;
      };
      Node.prototype.getDepth = function () {
          var depth = 0, parent = this.parent;
          while (parent) {
              depth++;
              parent = parent.parent;
          }
          return depth;
      };
      Node.prototype._batchTransformChanges = function (func) {
          this._batchingTransformChange = true;
          func();
          this._batchingTransformChange = false;
          if (this._needClearTransformCache) {
              this._clearCache(TRANSFORM);
              this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM, true);
          }
          this._needClearTransformCache = false;
      };
      Node.prototype.setPosition = function (pos) {
          var _this = this;
          this._batchTransformChanges(function () {
              _this.x(pos.x);
              _this.y(pos.y);
          });
          return this;
      };
      Node.prototype.getPosition = function () {
          return {
              x: this.x(),
              y: this.y(),
          };
      };
      Node.prototype.getAbsolutePosition = function (top) {
          var haveCachedParent = false;
          var parent = this.parent;
          while (parent) {
              if (parent.isCached()) {
                  haveCachedParent = true;
                  break;
              }
              parent = parent.parent;
          }
          if (haveCachedParent && !top) {
              top = true;
          }
          var absoluteMatrix = this.getAbsoluteTransform(top).getMatrix(), absoluteTransform = new Util.Transform(), offset = this.offset();
          absoluteTransform.m = absoluteMatrix.slice();
          absoluteTransform.translate(offset.x, offset.y);
          return absoluteTransform.getTranslation();
      };
      Node.prototype.setAbsolutePosition = function (pos) {
          var origTrans = this._clearTransform();
          this.attrs.x = origTrans.x;
          this.attrs.y = origTrans.y;
          delete origTrans.x;
          delete origTrans.y;
          this._clearCache(TRANSFORM);
          var it = this._getAbsoluteTransform().copy();
          it.invert();
          it.translate(pos.x, pos.y);
          pos = {
              x: this.attrs.x + it.getTranslation().x,
              y: this.attrs.y + it.getTranslation().y,
          };
          this._setTransform(origTrans);
          this.setPosition({ x: pos.x, y: pos.y });
          this._clearCache(TRANSFORM);
          this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
          return this;
      };
      Node.prototype._setTransform = function (trans) {
          var key;
          for (key in trans) {
              this.attrs[key] = trans[key];
          }
      };
      Node.prototype._clearTransform = function () {
          var trans = {
              x: this.x(),
              y: this.y(),
              rotation: this.rotation(),
              scaleX: this.scaleX(),
              scaleY: this.scaleY(),
              offsetX: this.offsetX(),
              offsetY: this.offsetY(),
              skewX: this.skewX(),
              skewY: this.skewY(),
          };
          this.attrs.x = 0;
          this.attrs.y = 0;
          this.attrs.rotation = 0;
          this.attrs.scaleX = 1;
          this.attrs.scaleY = 1;
          this.attrs.offsetX = 0;
          this.attrs.offsetY = 0;
          this.attrs.skewX = 0;
          this.attrs.skewY = 0;
          return trans;
      };
      Node.prototype.move = function (change) {
          var changeX = change.x, changeY = change.y, x = this.x(), y = this.y();
          if (changeX !== undefined) {
              x += changeX;
          }
          if (changeY !== undefined) {
              y += changeY;
          }
          this.setPosition({ x: x, y: y });
          return this;
      };
      Node.prototype._eachAncestorReverse = function (func, top) {
          var family = [], parent = this.getParent(), len, n;
          if (top && top._id === this._id) {
              func(this);
              return;
          }
          family.unshift(this);
          while (parent && (!top || parent._id !== top._id)) {
              family.unshift(parent);
              parent = parent.parent;
          }
          len = family.length;
          for (n = 0; n < len; n++) {
              func(family[n]);
          }
      };
      Node.prototype.rotate = function (theta) {
          this.rotation(this.rotation() + theta);
          return this;
      };
      Node.prototype.moveToTop = function () {
          if (!this.parent) {
              Util.Util.warn('Node has no parent. moveToTop function is ignored.');
              return false;
          }
          var index = this.index;
          this.parent.children.splice(index, 1);
          this.parent.children.push(this);
          this.parent._setChildrenIndices();
          return true;
      };
      Node.prototype.moveUp = function () {
          if (!this.parent) {
              Util.Util.warn('Node has no parent. moveUp function is ignored.');
              return false;
          }
          var index = this.index, len = this.parent.getChildren().length;
          if (index < len - 1) {
              this.parent.children.splice(index, 1);
              this.parent.children.splice(index + 1, 0, this);
              this.parent._setChildrenIndices();
              return true;
          }
          return false;
      };
      Node.prototype.moveDown = function () {
          if (!this.parent) {
              Util.Util.warn('Node has no parent. moveDown function is ignored.');
              return false;
          }
          var index = this.index;
          if (index > 0) {
              this.parent.children.splice(index, 1);
              this.parent.children.splice(index - 1, 0, this);
              this.parent._setChildrenIndices();
              return true;
          }
          return false;
      };
      Node.prototype.moveToBottom = function () {
          if (!this.parent) {
              Util.Util.warn('Node has no parent. moveToBottom function is ignored.');
              return false;
          }
          var index = this.index;
          if (index > 0) {
              this.parent.children.splice(index, 1);
              this.parent.children.unshift(this);
              this.parent._setChildrenIndices();
              return true;
          }
          return false;
      };
      Node.prototype.setZIndex = function (zIndex) {
          if (!this.parent) {
              Util.Util.warn('Node has no parent. zIndex parameter is ignored.');
              return this;
          }
          if (zIndex < 0 || zIndex >= this.parent.children.length) {
              Util.Util.warn('Unexpected value ' +
                  zIndex +
                  ' for zIndex property. zIndex is just index of a node in children of its parent. Expected value is from 0 to ' +
                  (this.parent.children.length - 1) +
                  '.');
          }
          var index = this.index;
          this.parent.children.splice(index, 1);
          this.parent.children.splice(zIndex, 0, this);
          this.parent._setChildrenIndices();
          return this;
      };
      Node.prototype.getAbsoluteOpacity = function () {
          return this._getCache(ABSOLUTE_OPACITY, this._getAbsoluteOpacity);
      };
      Node.prototype._getAbsoluteOpacity = function () {
          var absOpacity = this.opacity();
          var parent = this.getParent();
          if (parent && !parent._isUnderCache) {
              absOpacity *= parent.getAbsoluteOpacity();
          }
          return absOpacity;
      };
      Node.prototype.moveTo = function (newContainer) {
          if (this.getParent() !== newContainer) {
              this._remove();
              newContainer.add(this);
          }
          return this;
      };
      Node.prototype.toObject = function () {
          var obj = {}, attrs = this.getAttrs(), key, val, getter, defaultValue, nonPlainObject;
          obj.attrs = {};
          for (key in attrs) {
              val = attrs[key];
              nonPlainObject =
                  Util.Util.isObject(val) && !Util.Util._isPlainObject(val) && !Util.Util._isArray(val);
              if (nonPlainObject) {
                  continue;
              }
              getter = typeof this[key] === 'function' && this[key];
              delete attrs[key];
              defaultValue = getter ? getter.call(this) : null;
              attrs[key] = val;
              if (defaultValue !== val) {
                  obj.attrs[key] = val;
              }
          }
          obj.className = this.getClassName();
          return Util.Util._prepareToStringify(obj);
      };
      Node.prototype.toJSON = function () {
          return JSON.stringify(this.toObject());
      };
      Node.prototype.getParent = function () {
          return this.parent;
      };
      Node.prototype.findAncestors = function (selector, includeSelf, stopNode) {
          var res = [];
          if (includeSelf && this._isMatch(selector)) {
              res.push(this);
          }
          var ancestor = this.parent;
          while (ancestor) {
              if (ancestor === stopNode) {
                  return res;
              }
              if (ancestor._isMatch(selector)) {
                  res.push(ancestor);
              }
              ancestor = ancestor.parent;
          }
          return res;
      };
      Node.prototype.isAncestorOf = function (node) {
          return false;
      };
      Node.prototype.findAncestor = function (selector, includeSelf, stopNode) {
          return this.findAncestors(selector, includeSelf, stopNode)[0];
      };
      Node.prototype._isMatch = function (selector) {
          if (!selector) {
              return false;
          }
          if (typeof selector === 'function') {
              return selector(this);
          }
          var selectorArr = selector.replace(/ /g, '').split(','), len = selectorArr.length, n, sel;
          for (n = 0; n < len; n++) {
              sel = selectorArr[n];
              if (!Util.Util.isValidSelector(sel)) {
                  Util.Util.warn('Selector "' +
                      sel +
                      '" is invalid. Allowed selectors examples are "#foo", ".bar" or "Group".');
                  Util.Util.warn('If you have a custom shape with such className, please change it to start with upper letter like "Triangle".');
                  Util.Util.warn('Konva is awesome, right?');
              }
              if (sel.charAt(0) === '#') {
                  if (this.id() === sel.slice(1)) {
                      return true;
                  }
              }
              else if (sel.charAt(0) === '.') {
                  if (this.hasName(sel.slice(1))) {
                      return true;
                  }
              }
              else if (this.className === sel || this.nodeType === sel) {
                  return true;
              }
          }
          return false;
      };
      Node.prototype.getLayer = function () {
          var parent = this.getParent();
          return parent ? parent.getLayer() : null;
      };
      Node.prototype.getStage = function () {
          return this._getCache(STAGE, this._getStage);
      };
      Node.prototype._getStage = function () {
          var parent = this.getParent();
          if (parent) {
              return parent.getStage();
          }
          else {
              return undefined;
          }
      };
      Node.prototype.fire = function (eventType, evt, bubble) {
          if (evt === void 0) { evt = {}; }
          evt.target = evt.target || this;
          if (bubble) {
              this._fireAndBubble(eventType, evt);
          }
          else {
              this._fire(eventType, evt);
          }
          return this;
      };
      Node.prototype.getAbsoluteTransform = function (top) {
          if (top) {
              return this._getAbsoluteTransform(top);
          }
          else {
              return this._getCache(ABSOLUTE_TRANSFORM, this._getAbsoluteTransform);
          }
      };
      Node.prototype._getAbsoluteTransform = function (top) {
          var at;
          if (top) {
              at = new Util.Transform();
              this._eachAncestorReverse(function (node) {
                  var transformsEnabled = node.transformsEnabled();
                  if (transformsEnabled === 'all') {
                      at.multiply(node.getTransform());
                  }
                  else if (transformsEnabled === 'position') {
                      at.translate(node.x() - node.offsetX(), node.y() - node.offsetY());
                  }
              }, top);
              return at;
          }
          else {
              at = this._cache.get(ABSOLUTE_TRANSFORM) || new Util.Transform();
              if (this.parent) {
                  this.parent.getAbsoluteTransform().copyInto(at);
              }
              else {
                  at.reset();
              }
              var transformsEnabled = this.transformsEnabled();
              if (transformsEnabled === 'all') {
                  at.multiply(this.getTransform());
              }
              else if (transformsEnabled === 'position') {
                  var x = this.attrs.x || 0;
                  var y = this.attrs.y || 0;
                  var offsetX = this.attrs.offsetX || 0;
                  var offsetY = this.attrs.offsetY || 0;
                  at.translate(x - offsetX, y - offsetY);
              }
              at.dirty = false;
              return at;
          }
      };
      Node.prototype.getAbsoluteScale = function (top) {
          var parent = this;
          while (parent) {
              if (parent._isUnderCache) {
                  top = parent;
              }
              parent = parent.getParent();
          }
          var transform = this.getAbsoluteTransform(top);
          var attrs = transform.decompose();
          return {
              x: attrs.scaleX,
              y: attrs.scaleY,
          };
      };
      Node.prototype.getAbsoluteRotation = function () {
          return this.getAbsoluteTransform().decompose().rotation;
      };
      Node.prototype.getTransform = function () {
          return this._getCache(TRANSFORM, this._getTransform);
      };
      Node.prototype._getTransform = function () {
          var _a, _b;
          var m = this._cache.get(TRANSFORM) || new Util.Transform();
          m.reset();
          var x = this.x(), y = this.y(), rotation = Global.Konva.getAngle(this.rotation()), scaleX = (_a = this.attrs.scaleX) !== null && _a !== void 0 ? _a : 1, scaleY = (_b = this.attrs.scaleY) !== null && _b !== void 0 ? _b : 1, skewX = this.attrs.skewX || 0, skewY = this.attrs.skewY || 0, offsetX = this.attrs.offsetX || 0, offsetY = this.attrs.offsetY || 0;
          if (x !== 0 || y !== 0) {
              m.translate(x, y);
          }
          if (rotation !== 0) {
              m.rotate(rotation);
          }
          if (skewX !== 0 || skewY !== 0) {
              m.skew(skewX, skewY);
          }
          if (scaleX !== 1 || scaleY !== 1) {
              m.scale(scaleX, scaleY);
          }
          if (offsetX !== 0 || offsetY !== 0) {
              m.translate(-1 * offsetX, -1 * offsetY);
          }
          m.dirty = false;
          return m;
      };
      Node.prototype.clone = function (obj) {
          var attrs = Util.Util.cloneObject(this.attrs), key, allListeners, len, n, listener;
          for (key in obj) {
              attrs[key] = obj[key];
          }
          var node = new this.constructor(attrs);
          for (key in this.eventListeners) {
              allListeners = this.eventListeners[key];
              len = allListeners.length;
              for (n = 0; n < len; n++) {
                  listener = allListeners[n];
                  if (listener.name.indexOf(KONVA) < 0) {
                      if (!node.eventListeners[key]) {
                          node.eventListeners[key] = [];
                      }
                      node.eventListeners[key].push(listener);
                  }
              }
          }
          return node;
      };
      Node.prototype._toKonvaCanvas = function (config) {
          config = config || {};
          var box = this.getClientRect();
          var stage = this.getStage(), x = config.x !== undefined ? config.x : box.x, y = config.y !== undefined ? config.y : box.y, pixelRatio = config.pixelRatio || 1, canvas = new Canvas_1.SceneCanvas({
              width: config.width || box.width || (stage ? stage.width() : 0),
              height: config.height || box.height || (stage ? stage.height() : 0),
              pixelRatio: pixelRatio,
          }), context = canvas.getContext();
          context.save();
          if (x || y) {
              context.translate(-1 * x, -1 * y);
          }
          this.drawScene(canvas);
          context.restore();
          return canvas;
      };
      Node.prototype.toCanvas = function (config) {
          return this._toKonvaCanvas(config)._canvas;
      };
      Node.prototype.toDataURL = function (config) {
          config = config || {};
          var mimeType = config.mimeType || null, quality = config.quality || null;
          var url = this._toKonvaCanvas(config).toDataURL(mimeType, quality);
          if (config.callback) {
              config.callback(url);
          }
          return url;
      };
      Node.prototype.toImage = function (config) {
          if (!config || !config.callback) {
              throw 'callback required for toImage method config argument';
          }
          var callback = config.callback;
          delete config.callback;
          Util.Util._urlToImage(this.toDataURL(config), function (img) {
              callback(img);
          });
      };
      Node.prototype.setSize = function (size) {
          this.width(size.width);
          this.height(size.height);
          return this;
      };
      Node.prototype.getSize = function () {
          return {
              width: this.width(),
              height: this.height(),
          };
      };
      Node.prototype.getClassName = function () {
          return this.className || this.nodeType;
      };
      Node.prototype.getType = function () {
          return this.nodeType;
      };
      Node.prototype.getDragDistance = function () {
          if (this.attrs.dragDistance !== undefined) {
              return this.attrs.dragDistance;
          }
          else if (this.parent) {
              return this.parent.getDragDistance();
          }
          else {
              return Global.Konva.dragDistance;
          }
      };
      Node.prototype._off = function (type, name, callback) {
          var evtListeners = this.eventListeners[type], i, evtName, handler;
          for (i = 0; i < evtListeners.length; i++) {
              evtName = evtListeners[i].name;
              handler = evtListeners[i].handler;
              if ((evtName !== 'konva' || name === 'konva') &&
                  (!name || evtName === name) &&
                  (!callback || callback === handler)) {
                  evtListeners.splice(i, 1);
                  if (evtListeners.length === 0) {
                      delete this.eventListeners[type];
                      break;
                  }
                  i--;
              }
          }
      };
      Node.prototype._fireChangeEvent = function (attr, oldVal, newVal) {
          this._fire(attr + CHANGE, {
              oldVal: oldVal,
              newVal: newVal,
          });
      };
      Node.prototype.setId = function (id) {
          var oldId = this.id();
          exports._removeId(oldId, this);
          _addId(this, id);
          this._setAttr('id', id);
          return this;
      };
      Node.prototype.setName = function (name) {
          var oldNames = (this.name() || '').split(/\s/g);
          var newNames = (name || '').split(/\s/g);
          var subname, i;
          for (i = 0; i < oldNames.length; i++) {
              subname = oldNames[i];
              if (newNames.indexOf(subname) === -1 && subname) {
                  exports._removeName(subname, this._id);
              }
          }
          for (i = 0; i < newNames.length; i++) {
              subname = newNames[i];
              if (oldNames.indexOf(subname) === -1 && subname) {
                  exports._addName(this, subname);
              }
          }
          this._setAttr(NAME, name);
          return this;
      };
      Node.prototype.addName = function (name) {
          if (!this.hasName(name)) {
              var oldName = this.name();
              var newName = oldName ? oldName + ' ' + name : name;
              this.setName(newName);
          }
          return this;
      };
      Node.prototype.hasName = function (name) {
          if (!name) {
              return false;
          }
          var fullName = this.name();
          if (!fullName) {
              return false;
          }
          var names = (fullName || '').split(/\s/g);
          return names.indexOf(name) !== -1;
      };
      Node.prototype.removeName = function (name) {
          var names = (this.name() || '').split(/\s/g);
          var index = names.indexOf(name);
          if (index !== -1) {
              names.splice(index, 1);
              this.setName(names.join(' '));
          }
          return this;
      };
      Node.prototype.setAttr = function (attr, val) {
          var func = this[SET + Util.Util._capitalize(attr)];
          if (Util.Util._isFunction(func)) {
              func.call(this, val);
          }
          else {
              this._setAttr(attr, val);
          }
          return this;
      };
      Node.prototype._setAttr = function (key, val) {
          var oldVal = this.attrs[key];
          if (oldVal === val && !Util.Util.isObject(val)) {
              return;
          }
          if (val === undefined || val === null) {
              delete this.attrs[key];
          }
          else {
              this.attrs[key] = val;
          }
          this._fireChangeEvent(key, oldVal, val);
      };
      Node.prototype._setComponentAttr = function (key, component, val) {
          var oldVal;
          if (val !== undefined) {
              oldVal = this.attrs[key];
              if (!oldVal) {
                  this.attrs[key] = this.getAttr(key);
              }
              this.attrs[key][component] = val;
              this._fireChangeEvent(key, oldVal, val);
          }
      };
      Node.prototype._fireAndBubble = function (eventType, evt, compareShape) {
          if (evt && this.nodeType === SHAPE) {
              evt.target = this;
          }
          var shouldStop = (eventType === MOUSEENTER || eventType === MOUSELEAVE) &&
              ((compareShape &&
                  (this === compareShape ||
                      (this.isAncestorOf && this.isAncestorOf(compareShape)))) ||
                  (this.nodeType === 'Stage' && !compareShape));
          if (!shouldStop) {
              this._fire(eventType, evt);
              var stopBubble = (eventType === MOUSEENTER || eventType === MOUSELEAVE) &&
                  compareShape &&
                  compareShape.isAncestorOf &&
                  compareShape.isAncestorOf(this) &&
                  !compareShape.isAncestorOf(this.parent);
              if (((evt && !evt.cancelBubble) || !evt) &&
                  this.parent &&
                  this.parent.isListening() &&
                  !stopBubble) {
                  if (compareShape && compareShape.parent) {
                      this._fireAndBubble.call(this.parent, eventType, evt, compareShape);
                  }
                  else {
                      this._fireAndBubble.call(this.parent, eventType, evt);
                  }
              }
          }
      };
      Node.prototype._fire = function (eventType, evt) {
          var events = this.eventListeners[eventType], i;
          if (events) {
              evt = evt || {};
              evt.currentTarget = this;
              evt.type = eventType;
              for (i = 0; i < events.length; i++) {
                  events[i].handler.call(this, evt);
              }
          }
      };
      Node.prototype.draw = function () {
          this.drawScene();
          this.drawHit();
          return this;
      };
      Node.prototype._createDragElement = function (evt) {
          var pointerId = evt ? evt.pointerId : undefined;
          var stage = this.getStage();
          var ap = this.getAbsolutePosition();
          var pos = stage._getPointerById(pointerId) ||
              stage._changedPointerPositions[0] ||
              ap;
          DragAndDrop.DD._dragElements.set(this._id, {
              node: this,
              startPointerPos: pos,
              offset: {
                  x: pos.x - ap.x,
                  y: pos.y - ap.y,
              },
              dragStatus: 'ready',
              pointerId: pointerId,
          });
      };
      Node.prototype.startDrag = function (evt) {
          if (!DragAndDrop.DD._dragElements.has(this._id)) {
              this._createDragElement(evt);
          }
          var elem = DragAndDrop.DD._dragElements.get(this._id);
          elem.dragStatus = 'dragging';
          this.fire('dragstart', {
              type: 'dragstart',
              target: this,
              evt: evt && evt.evt,
          }, true);
      };
      Node.prototype._setDragPosition = function (evt, elem) {
          var pos = this.getStage()._getPointerById(elem.pointerId);
          if (!pos) {
              return;
          }
          var newNodePos = {
              x: pos.x - elem.offset.x,
              y: pos.y - elem.offset.y,
          };
          var dbf = this.dragBoundFunc();
          if (dbf !== undefined) {
              var bounded = dbf.call(this, newNodePos, evt);
              if (!bounded) {
                  Util.Util.warn('dragBoundFunc did not return any value. That is unexpected behavior. You must return new absolute position from dragBoundFunc.');
              }
              else {
                  newNodePos = bounded;
              }
          }
          if (!this._lastPos ||
              this._lastPos.x !== newNodePos.x ||
              this._lastPos.y !== newNodePos.y) {
              this.setAbsolutePosition(newNodePos);
              if (this.getLayer()) {
                  this.getLayer().batchDraw();
              }
              else if (this.getStage()) {
                  this.getStage().batchDraw();
              }
          }
          this._lastPos = newNodePos;
      };
      Node.prototype.stopDrag = function (evt) {
          var elem = DragAndDrop.DD._dragElements.get(this._id);
          if (elem) {
              elem.dragStatus = 'stopped';
          }
          DragAndDrop.DD._endDragBefore(evt);
          DragAndDrop.DD._endDragAfter(evt);
      };
      Node.prototype.setDraggable = function (draggable) {
          this._setAttr('draggable', draggable);
          this._dragChange();
      };
      Node.prototype.isDragging = function () {
          var elem = DragAndDrop.DD._dragElements.get(this._id);
          return elem ? elem.dragStatus === 'dragging' : false;
      };
      Node.prototype._listenDrag = function () {
          this._dragCleanup();
          this.on('mousedown.konva touchstart.konva', function (evt) {
              var _this = this;
              var shouldCheckButton = evt.evt['button'] !== undefined;
              var canDrag = !shouldCheckButton || Global.Konva.dragButtons.indexOf(evt.evt['button']) >= 0;
              if (!canDrag) {
                  return;
              }
              if (this.isDragging()) {
                  return;
              }
              var hasDraggingChild = false;
              DragAndDrop.DD._dragElements.forEach(function (elem) {
                  if (_this.isAncestorOf(elem.node)) {
                      hasDraggingChild = true;
                  }
              });
              if (!hasDraggingChild) {
                  this._createDragElement(evt);
              }
          });
      };
      Node.prototype._dragChange = function () {
          if (this.attrs.draggable) {
              this._listenDrag();
          }
          else {
              this._dragCleanup();
              var stage = this.getStage();
              if (!stage) {
                  return;
              }
              var dragElement = DragAndDrop.DD._dragElements.get(this._id);
              var isDragging = dragElement && dragElement.dragStatus === 'dragging';
              var isReady = dragElement && dragElement.dragStatus === 'ready';
              if (isDragging) {
                  this.stopDrag();
              }
              else if (isReady) {
                  DragAndDrop.DD._dragElements.delete(this._id);
              }
          }
      };
      Node.prototype._dragCleanup = function () {
          this.off('mousedown.konva');
          this.off('touchstart.konva');
      };
      Node.create = function (data, container) {
          if (Util.Util._isString(data)) {
              data = JSON.parse(data);
          }
          return this._createNode(data, container);
      };
      Node._createNode = function (obj, container) {
          var className = Node.prototype.getClassName.call(obj), children = obj.children, no, len, n;
          if (container) {
              obj.attrs.container = container;
          }
          if (!Global._NODES_REGISTRY[className]) {
              Util.Util.warn('Can not find a node with class name "' +
                  className +
                  '". Fallback to "Shape".');
              className = 'Shape';
          }
          var Class = Global._NODES_REGISTRY[className];
          no = new Class(obj.attrs);
          if (children) {
              len = children.length;
              for (n = 0; n < len; n++) {
                  no.add(Node._createNode(children[n]));
              }
          }
          return no;
      };
      return Node;
  }());
  exports.Node = Node;
  Node.prototype.nodeType = 'Node';
  Node.prototype._attrsAffectingSize = [];
  var addGetterSetter = Factory.Factory.addGetterSetter;
  addGetterSetter(Node, 'zIndex');
  addGetterSetter(Node, 'absolutePosition');
  addGetterSetter(Node, 'position');
  addGetterSetter(Node, 'x', 0, Validators.getNumberValidator());
  addGetterSetter(Node, 'y', 0, Validators.getNumberValidator());
  addGetterSetter(Node, 'globalCompositeOperation', 'source-over', Validators.getStringValidator());
  addGetterSetter(Node, 'opacity', 1, Validators.getNumberValidator());
  addGetterSetter(Node, 'name', '', Validators.getStringValidator());
  addGetterSetter(Node, 'id', '', Validators.getStringValidator());
  addGetterSetter(Node, 'rotation', 0, Validators.getNumberValidator());
  Factory.Factory.addComponentsGetterSetter(Node, 'scale', ['x', 'y']);
  addGetterSetter(Node, 'scaleX', 1, Validators.getNumberValidator());
  addGetterSetter(Node, 'scaleY', 1, Validators.getNumberValidator());
  Factory.Factory.addComponentsGetterSetter(Node, 'skew', ['x', 'y']);
  addGetterSetter(Node, 'skewX', 0, Validators.getNumberValidator());
  addGetterSetter(Node, 'skewY', 0, Validators.getNumberValidator());
  Factory.Factory.addComponentsGetterSetter(Node, 'offset', ['x', 'y']);
  addGetterSetter(Node, 'offsetX', 0, Validators.getNumberValidator());
  addGetterSetter(Node, 'offsetY', 0, Validators.getNumberValidator());
  addGetterSetter(Node, 'dragDistance', null, Validators.getNumberValidator());
  addGetterSetter(Node, 'width', 0, Validators.getNumberValidator());
  addGetterSetter(Node, 'height', 0, Validators.getNumberValidator());
  addGetterSetter(Node, 'listening', true, Validators.getBooleanValidator());
  addGetterSetter(Node, 'preventDefault', true, Validators.getBooleanValidator());
  addGetterSetter(Node, 'filters', null, function (val) {
      this._filterUpToDate = false;
      return val;
  });
  addGetterSetter(Node, 'visible', true, Validators.getBooleanValidator());
  addGetterSetter(Node, 'transformsEnabled', 'all', Validators.getStringValidator());
  addGetterSetter(Node, 'size');
  addGetterSetter(Node, 'dragBoundFunc');
  addGetterSetter(Node, 'draggable', false, Validators.getBooleanValidator());
  Factory.Factory.backCompat(Node, {
      rotateDeg: 'rotate',
      setRotationDeg: 'setRotation',
      getRotationDeg: 'getRotation',
  });
  Util.Collection.mapMethods(Node);
  });

  unwrapExports(Node_1);
  var Node_2 = Node_1.ids;
  var Node_3 = Node_1.names;
  var Node_4 = Node_1._removeId;
  var Node_5 = Node_1._addName;
  var Node_6 = Node_1._removeName;
  var Node_7 = Node_1.Node;

  var Container_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });




  var Container = (function (_super) {
      __extends(Container, _super);
      function Container() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.children = new Util.Collection();
          return _this;
      }
      Container.prototype.getChildren = function (filterFunc) {
          if (!filterFunc) {
              return this.children;
          }
          var results = new Util.Collection();
          this.children.each(function (child) {
              if (filterFunc(child)) {
                  results.push(child);
              }
          });
          return results;
      };
      Container.prototype.hasChildren = function () {
          return this.getChildren().length > 0;
      };
      Container.prototype.removeChildren = function () {
          var child;
          for (var i = 0; i < this.children.length; i++) {
              child = this.children[i];
              child.parent = null;
              child.index = 0;
              child.remove();
          }
          this.children = new Util.Collection();
          return this;
      };
      Container.prototype.destroyChildren = function () {
          var child;
          for (var i = 0; i < this.children.length; i++) {
              child = this.children[i];
              child.parent = null;
              child.index = 0;
              child.destroy();
          }
          this.children = new Util.Collection();
          return this;
      };
      Container.prototype.add = function () {
          var children = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              children[_i] = arguments[_i];
          }
          if (arguments.length > 1) {
              for (var i = 0; i < arguments.length; i++) {
                  this.add(arguments[i]);
              }
              return this;
          }
          var child = children[0];
          if (child.getParent()) {
              child.moveTo(this);
              return this;
          }
          var _children = this.children;
          this._validateAdd(child);
          child._clearCaches();
          child.index = _children.length;
          child.parent = this;
          _children.push(child);
          this._fire('add', {
              child: child,
          });
          return this;
      };
      Container.prototype.destroy = function () {
          if (this.hasChildren()) {
              this.destroyChildren();
          }
          _super.prototype.destroy.call(this);
          return this;
      };
      Container.prototype.find = function (selector) {
          return this._generalFind(selector, false);
      };
      Container.prototype.get = function (selector) {
          Util.Util.warn('collection.get() method is deprecated. Please use collection.find() instead.');
          return this.find(selector);
      };
      Container.prototype.findOne = function (selector) {
          var result = this._generalFind(selector, true);
          return result.length > 0 ? result[0] : undefined;
      };
      Container.prototype._generalFind = function (selector, findOne) {
          var retArr = [];
          this._descendants(function (node) {
              var valid = node._isMatch(selector);
              if (valid) {
                  retArr.push(node);
              }
              if (valid && findOne) {
                  return true;
              }
              return false;
          });
          return Util.Collection.toCollection(retArr);
      };
      Container.prototype._descendants = function (fn) {
          var shouldStop = false;
          for (var i = 0; i < this.children.length; i++) {
              var child = this.children[i];
              shouldStop = fn(child);
              if (shouldStop) {
                  return true;
              }
              if (!child.hasChildren()) {
                  continue;
              }
              shouldStop = child._descendants(fn);
              if (shouldStop) {
                  return true;
              }
          }
          return false;
      };
      Container.prototype.toObject = function () {
          var obj = Node_1.Node.prototype.toObject.call(this);
          obj.children = [];
          var children = this.getChildren();
          var len = children.length;
          for (var n = 0; n < len; n++) {
              var child = children[n];
              obj.children.push(child.toObject());
          }
          return obj;
      };
      Container.prototype.isAncestorOf = function (node) {
          var parent = node.getParent();
          while (parent) {
              if (parent._id === this._id) {
                  return true;
              }
              parent = parent.getParent();
          }
          return false;
      };
      Container.prototype.clone = function (obj) {
          var node = Node_1.Node.prototype.clone.call(this, obj);
          this.getChildren().each(function (no) {
              node.add(no.clone());
          });
          return node;
      };
      Container.prototype.getAllIntersections = function (pos) {
          var arr = [];
          this.find('Shape').each(function (shape) {
              if (shape.isVisible() && shape.intersects(pos)) {
                  arr.push(shape);
              }
          });
          return arr;
      };
      Container.prototype._setChildrenIndices = function () {
          this.children.each(function (child, n) {
              child.index = n;
          });
      };
      Container.prototype.drawScene = function (can, top) {
          var layer = this.getLayer(), canvas = can || (layer && layer.getCanvas()), context = canvas && canvas.getContext(), cachedCanvas = this._getCanvasCache(), cachedSceneCanvas = cachedCanvas && cachedCanvas.scene;
          var caching = canvas && canvas.isCache;
          if (!this.isVisible() && !caching) {
              return this;
          }
          if (cachedSceneCanvas) {
              context.save();
              var m = this.getAbsoluteTransform(top).getMatrix();
              context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
              this._drawCachedSceneCanvas(context);
              context.restore();
          }
          else {
              this._drawChildren('drawScene', canvas, top);
          }
          return this;
      };
      Container.prototype.drawHit = function (can, top) {
          if (!this.shouldDrawHit(top)) {
              return this;
          }
          var layer = this.getLayer(), canvas = can || (layer && layer.hitCanvas), context = canvas && canvas.getContext(), cachedCanvas = this._getCanvasCache(), cachedHitCanvas = cachedCanvas && cachedCanvas.hit;
          if (cachedHitCanvas) {
              context.save();
              var m = this.getAbsoluteTransform(top).getMatrix();
              context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
              this._drawCachedHitCanvas(context);
              context.restore();
          }
          else {
              this._drawChildren('drawHit', canvas, top);
          }
          return this;
      };
      Container.prototype._drawChildren = function (drawMethod, canvas, top) {
          var context = canvas && canvas.getContext(), clipWidth = this.clipWidth(), clipHeight = this.clipHeight(), clipFunc = this.clipFunc(), hasClip = (clipWidth && clipHeight) || clipFunc;
          var selfCache = top === this;
          if (hasClip) {
              context.save();
              var transform = this.getAbsoluteTransform(top);
              var m = transform.getMatrix();
              context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
              context.beginPath();
              if (clipFunc) {
                  clipFunc.call(this, context, this);
              }
              else {
                  var clipX = this.clipX();
                  var clipY = this.clipY();
                  context.rect(clipX, clipY, clipWidth, clipHeight);
              }
              context.clip();
              m = transform.copy().invert().getMatrix();
              context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
          }
          var hasComposition = !selfCache &&
              this.globalCompositeOperation() !== 'source-over' &&
              drawMethod === 'drawScene';
          if (hasComposition) {
              context.save();
              context._applyGlobalCompositeOperation(this);
          }
          this.children.each(function (child) {
              child[drawMethod](canvas, top);
          });
          if (hasComposition) {
              context.restore();
          }
          if (hasClip) {
              context.restore();
          }
      };
      Container.prototype.getClientRect = function (config) {
          config = config || {};
          var skipTransform = config.skipTransform;
          var relativeTo = config.relativeTo;
          var minX, minY, maxX, maxY;
          var selfRect = {
              x: Infinity,
              y: Infinity,
              width: 0,
              height: 0,
          };
          var that = this;
          this.children.each(function (child) {
              if (!child.visible()) {
                  return;
              }
              var rect = child.getClientRect({
                  relativeTo: that,
                  skipShadow: config.skipShadow,
                  skipStroke: config.skipStroke,
              });
              if (rect.width === 0 && rect.height === 0) {
                  return;
              }
              if (minX === undefined) {
                  minX = rect.x;
                  minY = rect.y;
                  maxX = rect.x + rect.width;
                  maxY = rect.y + rect.height;
              }
              else {
                  minX = Math.min(minX, rect.x);
                  minY = Math.min(minY, rect.y);
                  maxX = Math.max(maxX, rect.x + rect.width);
                  maxY = Math.max(maxY, rect.y + rect.height);
              }
          });
          var shapes = this.find('Shape');
          var hasVisible = false;
          for (var i = 0; i < shapes.length; i++) {
              var shape = shapes[i];
              if (shape._isVisible(this)) {
                  hasVisible = true;
                  break;
              }
          }
          if (hasVisible && minX !== undefined) {
              selfRect = {
                  x: minX,
                  y: minY,
                  width: maxX - minX,
                  height: maxY - minY,
              };
          }
          else {
              selfRect = {
                  x: 0,
                  y: 0,
                  width: 0,
                  height: 0,
              };
          }
          if (!skipTransform) {
              return this._transformedRect(selfRect, relativeTo);
          }
          return selfRect;
      };
      return Container;
  }(Node_1.Node));
  exports.Container = Container;
  Factory.Factory.addComponentsGetterSetter(Container, 'clip', [
      'x',
      'y',
      'width',
      'height',
  ]);
  Factory.Factory.addGetterSetter(Container, 'clipX', undefined, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Container, 'clipY', undefined, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Container, 'clipWidth', undefined, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Container, 'clipHeight', undefined, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Container, 'clipFunc');
  Util.Collection.mapMethods(Container);
  });

  unwrapExports(Container_1);
  var Container_2 = Container_1.Container;

  var PointerEvents = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });

  var Captures = new Map();
  var SUPPORT_POINTER_EVENTS = Global.Konva._global['PointerEvent'] !== undefined;
  function getCapturedShape(pointerId) {
      return Captures.get(pointerId);
  }
  exports.getCapturedShape = getCapturedShape;
  function createEvent(evt) {
      return {
          evt: evt,
          pointerId: evt.pointerId
      };
  }
  exports.createEvent = createEvent;
  function hasPointerCapture(pointerId, shape) {
      return Captures.get(pointerId) === shape;
  }
  exports.hasPointerCapture = hasPointerCapture;
  function setPointerCapture(pointerId, shape) {
      releaseCapture(pointerId);
      var stage = shape.getStage();
      if (!stage)
          return;
      Captures.set(pointerId, shape);
      if (SUPPORT_POINTER_EVENTS) {
          shape._fire('gotpointercapture', createEvent(new PointerEvent('gotpointercapture')));
      }
  }
  exports.setPointerCapture = setPointerCapture;
  function releaseCapture(pointerId, target) {
      var shape = Captures.get(pointerId);
      if (!shape)
          return;
      var stage = shape.getStage();
      if (stage && stage.content) ;
      Captures.delete(pointerId);
      if (SUPPORT_POINTER_EVENTS) {
          shape._fire('lostpointercapture', createEvent(new PointerEvent('lostpointercapture')));
      }
  }
  exports.releaseCapture = releaseCapture;
  });

  unwrapExports(PointerEvents);
  var PointerEvents_1 = PointerEvents.getCapturedShape;
  var PointerEvents_2 = PointerEvents.createEvent;
  var PointerEvents_3 = PointerEvents.hasPointerCapture;
  var PointerEvents_4 = PointerEvents.setPointerCapture;
  var PointerEvents_5 = PointerEvents.releaseCapture;

  var Stage_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });






  var Global_2 = Global;

  var STAGE = 'Stage', STRING = 'string', PX = 'px', MOUSEOUT = 'mouseout', MOUSELEAVE = 'mouseleave', MOUSEOVER = 'mouseover', MOUSEENTER = 'mouseenter', MOUSEMOVE = 'mousemove', MOUSEDOWN = 'mousedown', MOUSEUP = 'mouseup', POINTERMOVE = 'pointermove', POINTERDOWN = 'pointerdown', POINTERUP = 'pointerup', POINTERCANCEL = 'pointercancel', LOSTPOINTERCAPTURE = 'lostpointercapture', CONTEXTMENU = 'contextmenu', CLICK = 'click', DBL_CLICK = 'dblclick', TOUCHSTART = 'touchstart', TOUCHEND = 'touchend', TAP = 'tap', DBL_TAP = 'dbltap', TOUCHMOVE = 'touchmove', WHEEL = 'wheel', CONTENT_MOUSEOUT = 'contentMouseout', CONTENT_MOUSEOVER = 'contentMouseover', CONTENT_MOUSEMOVE = 'contentMousemove', CONTENT_MOUSEDOWN = 'contentMousedown', CONTENT_MOUSEUP = 'contentMouseup', CONTENT_CONTEXTMENU = 'contentContextmenu', CONTENT_CLICK = 'contentClick', CONTENT_DBL_CLICK = 'contentDblclick', CONTENT_TOUCHSTART = 'contentTouchstart', CONTENT_TOUCHEND = 'contentTouchend', CONTENT_DBL_TAP = 'contentDbltap', CONTENT_TAP = 'contentTap', CONTENT_TOUCHMOVE = 'contentTouchmove', CONTENT_WHEEL = 'contentWheel', RELATIVE = 'relative', KONVA_CONTENT = 'konvajs-content', UNDERSCORE = '_', CONTAINER = 'container', MAX_LAYERS_NUMBER = 5, EMPTY_STRING = '', EVENTS = [
      MOUSEENTER,
      MOUSEDOWN,
      MOUSEMOVE,
      MOUSEUP,
      MOUSEOUT,
      TOUCHSTART,
      TOUCHMOVE,
      TOUCHEND,
      MOUSEOVER,
      WHEEL,
      CONTEXTMENU,
      POINTERDOWN,
      POINTERMOVE,
      POINTERUP,
      POINTERCANCEL,
      LOSTPOINTERCAPTURE,
  ], eventsLength = EVENTS.length;
  function addEvent(ctx, eventName) {
      ctx.content.addEventListener(eventName, function (evt) {
          ctx[UNDERSCORE + eventName](evt);
      }, false);
  }
  var NO_POINTERS_MESSAGE = "Pointer position is missing and not registered by the stage. Looks like it is outside of the stage container. You can set it manually from event: stage.setPointersPositions(event);";
  exports.stages = [];
  function checkNoClip(attrs) {
      if (attrs === void 0) { attrs = {}; }
      if (attrs.clipFunc || attrs.clipWidth || attrs.clipHeight) {
          Util.Util.warn('Stage does not support clipping. Please use clip for Layers or Groups.');
      }
      return attrs;
  }
  var Stage = (function (_super) {
      __extends(Stage, _super);
      function Stage(config) {
          var _this = _super.call(this, checkNoClip(config)) || this;
          _this._pointerPositions = [];
          _this._changedPointerPositions = [];
          _this._buildDOM();
          _this._bindContentEvents();
          exports.stages.push(_this);
          _this.on('widthChange.konva heightChange.konva', _this._resizeDOM);
          _this.on('visibleChange.konva', _this._checkVisibility);
          _this.on('clipWidthChange.konva clipHeightChange.konva clipFuncChange.konva', function () {
              checkNoClip(_this.attrs);
          });
          _this._checkVisibility();
          return _this;
      }
      Stage.prototype._validateAdd = function (child) {
          var isLayer = child.getType() === 'Layer';
          var isFastLayer = child.getType() === 'FastLayer';
          var valid = isLayer || isFastLayer;
          if (!valid) {
              Util.Util.throw('You may only add layers to the stage.');
          }
      };
      Stage.prototype._checkVisibility = function () {
          if (!this.content) {
              return;
          }
          var style = this.visible() ? '' : 'none';
          this.content.style.display = style;
      };
      Stage.prototype.setContainer = function (container) {
          if (typeof container === STRING) {
              if (container.charAt(0) === '.') {
                  var className = container.slice(1);
                  container = document.getElementsByClassName(className)[0];
              }
              else {
                  var id;
                  if (container.charAt(0) !== '#') {
                      id = container;
                  }
                  else {
                      id = container.slice(1);
                  }
                  container = document.getElementById(id);
              }
              if (!container) {
                  throw 'Can not find container in document with id ' + id;
              }
          }
          this._setAttr(CONTAINER, container);
          if (this.content) {
              if (this.content.parentElement) {
                  this.content.parentElement.removeChild(this.content);
              }
              container.appendChild(this.content);
          }
          return this;
      };
      Stage.prototype.shouldDrawHit = function () {
          return true;
      };
      Stage.prototype.clear = function () {
          var layers = this.children, len = layers.length, n;
          for (n = 0; n < len; n++) {
              layers[n].clear();
          }
          return this;
      };
      Stage.prototype.clone = function (obj) {
          if (!obj) {
              obj = {};
          }
          obj.container = document.createElement('div');
          return Container_1.Container.prototype.clone.call(this, obj);
      };
      Stage.prototype.destroy = function () {
          _super.prototype.destroy.call(this);
          var content = this.content;
          if (content && Util.Util._isInDocument(content)) {
              this.container().removeChild(content);
          }
          var index = exports.stages.indexOf(this);
          if (index > -1) {
              exports.stages.splice(index, 1);
          }
          return this;
      };
      Stage.prototype.getPointerPosition = function () {
          var pos = this._pointerPositions[0] || this._changedPointerPositions[0];
          if (!pos) {
              Util.Util.warn(NO_POINTERS_MESSAGE);
              return null;
          }
          return {
              x: pos.x,
              y: pos.y,
          };
      };
      Stage.prototype._getPointerById = function (id) {
          return this._pointerPositions.find(function (p) { return p.id === id; });
      };
      Stage.prototype.getPointersPositions = function () {
          return this._pointerPositions;
      };
      Stage.prototype.getStage = function () {
          return this;
      };
      Stage.prototype.getContent = function () {
          return this.content;
      };
      Stage.prototype._toKonvaCanvas = function (config) {
          config = config || {};
          var x = config.x || 0, y = config.y || 0, canvas = new Canvas_1.SceneCanvas({
              width: config.width || this.width(),
              height: config.height || this.height(),
              pixelRatio: config.pixelRatio || 1,
          }), _context = canvas.getContext()._context, layers = this.children;
          if (x || y) {
              _context.translate(-1 * x, -1 * y);
          }
          layers.each(function (layer) {
              if (!layer.isVisible()) {
                  return;
              }
              var layerCanvas = layer._toKonvaCanvas(config);
              _context.drawImage(layerCanvas._canvas, x, y, layerCanvas.getWidth() / layerCanvas.getPixelRatio(), layerCanvas.getHeight() / layerCanvas.getPixelRatio());
          });
          return canvas;
      };
      Stage.prototype.getIntersection = function (pos, selector) {
          if (!pos) {
              return null;
          }
          var layers = this.children, len = layers.length, end = len - 1, n, shape;
          for (n = end; n >= 0; n--) {
              shape = layers[n].getIntersection(pos, selector);
              if (shape) {
                  return shape;
              }
          }
          return null;
      };
      Stage.prototype._resizeDOM = function () {
          var width = this.width();
          var height = this.height();
          if (this.content) {
              this.content.style.width = width + PX;
              this.content.style.height = height + PX;
          }
          this.bufferCanvas.setSize(width, height);
          this.bufferHitCanvas.setSize(width, height);
          this.children.each(function (layer) {
              layer.setSize({ width: width, height: height });
              layer.draw();
          });
      };
      Stage.prototype.add = function (layer) {
          if (arguments.length > 1) {
              for (var i = 0; i < arguments.length; i++) {
                  this.add(arguments[i]);
              }
              return this;
          }
          _super.prototype.add.call(this, layer);
          var length = this.children.length;
          if (length > MAX_LAYERS_NUMBER) {
              Util.Util.warn('The stage has ' +
                  length +
                  ' layers. Recommended maximum number of layers is 3-5. Adding more layers into the stage may drop the performance. Rethink your tree structure, you can use Konva.Group.');
          }
          layer.setSize({ width: this.width(), height: this.height() });
          layer.draw();
          if (Global.Konva.isBrowser) {
              this.content.appendChild(layer.canvas._canvas);
          }
          return this;
      };
      Stage.prototype.getParent = function () {
          return null;
      };
      Stage.prototype.getLayer = function () {
          return null;
      };
      Stage.prototype.hasPointerCapture = function (pointerId) {
          return PointerEvents.hasPointerCapture(pointerId, this);
      };
      Stage.prototype.setPointerCapture = function (pointerId) {
          PointerEvents.setPointerCapture(pointerId, this);
      };
      Stage.prototype.releaseCapture = function (pointerId) {
          PointerEvents.releaseCapture(pointerId, this);
      };
      Stage.prototype.getLayers = function () {
          return this.getChildren();
      };
      Stage.prototype._bindContentEvents = function () {
          if (!Global.Konva.isBrowser) {
              return;
          }
          for (var n = 0; n < eventsLength; n++) {
              addEvent(this, EVENTS[n]);
          }
      };
      Stage.prototype._mouseenter = function (evt) {
          this.setPointersPositions(evt);
          this._fire(MOUSEENTER, { evt: evt, target: this, currentTarget: this });
      };
      Stage.prototype._mouseover = function (evt) {
          this.setPointersPositions(evt);
          this._fire(CONTENT_MOUSEOVER, { evt: evt });
          this._fire(MOUSEOVER, { evt: evt, target: this, currentTarget: this });
      };
      Stage.prototype._mouseout = function (evt) {
          var _a;
          this.setPointersPositions(evt);
          var targetShape = ((_a = this.targetShape) === null || _a === void 0 ? void 0 : _a.getStage()) ? this.targetShape : null;
          var eventsEnabled = !DragAndDrop.DD.isDragging || Global.Konva.hitOnDragEnabled;
          if (targetShape && eventsEnabled) {
              targetShape._fireAndBubble(MOUSEOUT, { evt: evt });
              targetShape._fireAndBubble(MOUSELEAVE, { evt: evt });
              this._fire(MOUSELEAVE, { evt: evt, target: this, currentTarget: this });
              this.targetShape = null;
          }
          else if (eventsEnabled) {
              this._fire(MOUSELEAVE, {
                  evt: evt,
                  target: this,
                  currentTarget: this,
              });
              this._fire(MOUSEOUT, {
                  evt: evt,
                  target: this,
                  currentTarget: this,
              });
          }
          this.pointerPos = undefined;
          this._pointerPositions = [];
          this._fire(CONTENT_MOUSEOUT, { evt: evt });
      };
      Stage.prototype._mousemove = function (evt) {
          var _a;
          if (Global.Konva.UA.ieMobile) {
              return this._touchmove(evt);
          }
          this.setPointersPositions(evt);
          var pointerId = Util.Util._getFirstPointerId(evt);
          var shape;
          var targetShape = ((_a = this.targetShape) === null || _a === void 0 ? void 0 : _a.getStage()) ? this.targetShape : null;
          var eventsEnabled = !DragAndDrop.DD.isDragging || Global.Konva.hitOnDragEnabled;
          if (eventsEnabled) {
              shape = this.getIntersection(this.getPointerPosition());
              if (shape && shape.isListening()) {
                  var differentTarget = targetShape !== shape;
                  if (eventsEnabled && differentTarget) {
                      if (targetShape) {
                          targetShape._fireAndBubble(MOUSEOUT, { evt: evt, pointerId: pointerId }, shape);
                          targetShape._fireAndBubble(MOUSELEAVE, { evt: evt, pointerId: pointerId }, shape);
                      }
                      shape._fireAndBubble(MOUSEOVER, { evt: evt, pointerId: pointerId }, targetShape);
                      shape._fireAndBubble(MOUSEENTER, { evt: evt, pointerId: pointerId }, targetShape);
                      shape._fireAndBubble(MOUSEMOVE, { evt: evt, pointerId: pointerId });
                      this.targetShape = shape;
                  }
                  else {
                      shape._fireAndBubble(MOUSEMOVE, { evt: evt, pointerId: pointerId });
                  }
              }
              else {
                  if (targetShape && eventsEnabled) {
                      targetShape._fireAndBubble(MOUSEOUT, { evt: evt, pointerId: pointerId });
                      targetShape._fireAndBubble(MOUSELEAVE, { evt: evt, pointerId: pointerId });
                      this._fire(MOUSEOVER, {
                          evt: evt,
                          target: this,
                          currentTarget: this,
                          pointerId: pointerId,
                      });
                      this.targetShape = null;
                  }
                  this._fire(MOUSEMOVE, {
                      evt: evt,
                      target: this,
                      currentTarget: this,
                      pointerId: pointerId,
                  });
              }
              this._fire(CONTENT_MOUSEMOVE, { evt: evt });
          }
          if (evt.cancelable) {
              evt.preventDefault();
          }
      };
      Stage.prototype._mousedown = function (evt) {
          if (Global.Konva.UA.ieMobile) {
              return this._touchstart(evt);
          }
          this.setPointersPositions(evt);
          var pointerId = Util.Util._getFirstPointerId(evt);
          var shape = this.getIntersection(this.getPointerPosition());
          DragAndDrop.DD.justDragged = false;
          Global.Konva.listenClickTap = true;
          if (shape && shape.isListening()) {
              this.clickStartShape = shape;
              shape._fireAndBubble(MOUSEDOWN, { evt: evt, pointerId: pointerId });
          }
          else {
              this._fire(MOUSEDOWN, {
                  evt: evt,
                  target: this,
                  currentTarget: this,
                  pointerId: pointerId,
              });
          }
          this._fire(CONTENT_MOUSEDOWN, { evt: evt });
      };
      Stage.prototype._mouseup = function (evt) {
          if (Global.Konva.UA.ieMobile) {
              return this._touchend(evt);
          }
          this.setPointersPositions(evt);
          var pointerId = Util.Util._getFirstPointerId(evt);
          var shape = this.getIntersection(this.getPointerPosition()), clickStartShape = this.clickStartShape, clickEndShape = this.clickEndShape, fireDblClick = false;
          if (Global.Konva.inDblClickWindow) {
              fireDblClick = true;
              clearTimeout(this.dblTimeout);
          }
          else if (!DragAndDrop.DD.justDragged) {
              Global.Konva.inDblClickWindow = true;
              clearTimeout(this.dblTimeout);
          }
          this.dblTimeout = setTimeout(function () {
              Global.Konva.inDblClickWindow = false;
          }, Global.Konva.dblClickWindow);
          if (shape && shape.isListening()) {
              this.clickEndShape = shape;
              shape._fireAndBubble(MOUSEUP, { evt: evt, pointerId: pointerId });
              if (Global.Konva.listenClickTap &&
                  clickStartShape &&
                  clickStartShape._id === shape._id) {
                  shape._fireAndBubble(CLICK, { evt: evt, pointerId: pointerId });
                  if (fireDblClick && clickEndShape && clickEndShape === shape) {
                      shape._fireAndBubble(DBL_CLICK, { evt: evt, pointerId: pointerId });
                  }
              }
          }
          else {
              this.clickEndShape = null;
              this._fire(MOUSEUP, {
                  evt: evt,
                  target: this,
                  currentTarget: this,
                  pointerId: pointerId,
              });
              if (Global.Konva.listenClickTap) {
                  this._fire(CLICK, {
                      evt: evt,
                      target: this,
                      currentTarget: this,
                      pointerId: pointerId,
                  });
              }
              if (fireDblClick) {
                  this._fire(DBL_CLICK, {
                      evt: evt,
                      target: this,
                      currentTarget: this,
                      pointerId: pointerId,
                  });
              }
          }
          this._fire(CONTENT_MOUSEUP, { evt: evt });
          if (Global.Konva.listenClickTap) {
              this._fire(CONTENT_CLICK, { evt: evt });
              if (fireDblClick) {
                  this._fire(CONTENT_DBL_CLICK, { evt: evt });
              }
          }
          Global.Konva.listenClickTap = false;
          if (evt.cancelable) {
              evt.preventDefault();
          }
      };
      Stage.prototype._contextmenu = function (evt) {
          this.setPointersPositions(evt);
          var shape = this.getIntersection(this.getPointerPosition());
          if (shape && shape.isListening()) {
              shape._fireAndBubble(CONTEXTMENU, { evt: evt });
          }
          else {
              this._fire(CONTEXTMENU, {
                  evt: evt,
                  target: this,
                  currentTarget: this,
              });
          }
          this._fire(CONTENT_CONTEXTMENU, { evt: evt });
      };
      Stage.prototype._touchstart = function (evt) {
          var _this = this;
          this.setPointersPositions(evt);
          var triggeredOnShape = false;
          this._changedPointerPositions.forEach(function (pos) {
              var shape = _this.getIntersection(pos);
              Global.Konva.listenClickTap = true;
              DragAndDrop.DD.justDragged = false;
              var hasShape = shape && shape.isListening();
              if (!hasShape) {
                  return;
              }
              if (Global.Konva.captureTouchEventsEnabled) {
                  shape.setPointerCapture(pos.id);
              }
              _this.tapStartShape = shape;
              shape._fireAndBubble(TOUCHSTART, { evt: evt, pointerId: pos.id }, _this);
              triggeredOnShape = true;
              if (shape.isListening() && shape.preventDefault() && evt.cancelable) {
                  evt.preventDefault();
              }
          });
          if (!triggeredOnShape) {
              this._fire(TOUCHSTART, {
                  evt: evt,
                  target: this,
                  currentTarget: this,
                  pointerId: this._changedPointerPositions[0].id,
              });
          }
          this._fire(CONTENT_TOUCHSTART, { evt: evt });
      };
      Stage.prototype._touchmove = function (evt) {
          var _this = this;
          this.setPointersPositions(evt);
          var eventsEnabled = !DragAndDrop.DD.isDragging || Global.Konva.hitOnDragEnabled;
          if (eventsEnabled) {
              var triggeredOnShape = false;
              var processedShapesIds = {};
              this._changedPointerPositions.forEach(function (pos) {
                  var shape = PointerEvents.getCapturedShape(pos.id) || _this.getIntersection(pos);
                  var hasShape = shape && shape.isListening();
                  if (!hasShape) {
                      return;
                  }
                  if (processedShapesIds[shape._id]) {
                      return;
                  }
                  processedShapesIds[shape._id] = true;
                  shape._fireAndBubble(TOUCHMOVE, { evt: evt, pointerId: pos.id });
                  triggeredOnShape = true;
                  if (shape.isListening() && shape.preventDefault() && evt.cancelable) {
                      evt.preventDefault();
                  }
              });
              if (!triggeredOnShape) {
                  this._fire(TOUCHMOVE, {
                      evt: evt,
                      target: this,
                      currentTarget: this,
                      pointerId: this._changedPointerPositions[0].id,
                  });
              }
              this._fire(CONTENT_TOUCHMOVE, { evt: evt });
          }
          if (DragAndDrop.DD.isDragging && DragAndDrop.DD.node.preventDefault() && evt.cancelable) {
              evt.preventDefault();
          }
      };
      Stage.prototype._touchend = function (evt) {
          var _this = this;
          this.setPointersPositions(evt);
          var tapEndShape = this.tapEndShape, fireDblClick = false;
          if (Global.Konva.inDblClickWindow) {
              fireDblClick = true;
              clearTimeout(this.dblTimeout);
          }
          else if (!DragAndDrop.DD.justDragged) {
              Global.Konva.inDblClickWindow = true;
              clearTimeout(this.dblTimeout);
          }
          this.dblTimeout = setTimeout(function () {
              Global.Konva.inDblClickWindow = false;
          }, Global.Konva.dblClickWindow);
          var triggeredOnShape = false;
          var processedShapesIds = {};
          var tapTriggered = false;
          var dblTapTriggered = false;
          this._changedPointerPositions.forEach(function (pos) {
              var shape = PointerEvents.getCapturedShape(pos.id) ||
                  _this.getIntersection(pos);
              if (shape) {
                  shape.releaseCapture(pos.id);
              }
              var hasShape = shape && shape.isListening();
              if (!hasShape) {
                  return;
              }
              if (processedShapesIds[shape._id]) {
                  return;
              }
              processedShapesIds[shape._id] = true;
              _this.tapEndShape = shape;
              shape._fireAndBubble(TOUCHEND, { evt: evt, pointerId: pos.id });
              triggeredOnShape = true;
              if (Global.Konva.listenClickTap && shape === _this.tapStartShape) {
                  tapTriggered = true;
                  shape._fireAndBubble(TAP, { evt: evt, pointerId: pos.id });
                  if (fireDblClick && tapEndShape && tapEndShape === shape) {
                      dblTapTriggered = true;
                      shape._fireAndBubble(DBL_TAP, { evt: evt, pointerId: pos.id });
                  }
              }
              if (shape.isListening() && shape.preventDefault() && evt.cancelable) {
                  evt.preventDefault();
              }
          });
          if (!triggeredOnShape) {
              this._fire(TOUCHEND, {
                  evt: evt,
                  target: this,
                  currentTarget: this,
                  pointerId: this._changedPointerPositions[0].id,
              });
          }
          if (Global.Konva.listenClickTap && !tapTriggered) {
              this.tapEndShape = null;
              this._fire(TAP, {
                  evt: evt,
                  target: this,
                  currentTarget: this,
                  pointerId: this._changedPointerPositions[0].id,
              });
          }
          if (fireDblClick && !dblTapTriggered) {
              this._fire(DBL_TAP, {
                  evt: evt,
                  target: this,
                  currentTarget: this,
                  pointerId: this._changedPointerPositions[0].id,
              });
          }
          this._fire(CONTENT_TOUCHEND, { evt: evt });
          if (Global.Konva.listenClickTap) {
              this._fire(CONTENT_TAP, { evt: evt });
              if (fireDblClick) {
                  this._fire(CONTENT_DBL_TAP, { evt: evt });
              }
          }
          if (this.preventDefault() && evt.cancelable) {
              evt.preventDefault();
          }
          Global.Konva.listenClickTap = false;
      };
      Stage.prototype._wheel = function (evt) {
          this.setPointersPositions(evt);
          var shape = this.getIntersection(this.getPointerPosition());
          if (shape && shape.isListening()) {
              shape._fireAndBubble(WHEEL, { evt: evt });
          }
          else {
              this._fire(WHEEL, {
                  evt: evt,
                  target: this,
                  currentTarget: this,
              });
          }
          this._fire(CONTENT_WHEEL, { evt: evt });
      };
      Stage.prototype._pointerdown = function (evt) {
          if (!Global.Konva._pointerEventsEnabled) {
              return;
          }
          this.setPointersPositions(evt);
          var shape = PointerEvents.getCapturedShape(evt.pointerId) ||
              this.getIntersection(this.getPointerPosition());
          if (shape) {
              shape._fireAndBubble(POINTERDOWN, PointerEvents.createEvent(evt));
          }
      };
      Stage.prototype._pointermove = function (evt) {
          if (!Global.Konva._pointerEventsEnabled) {
              return;
          }
          this.setPointersPositions(evt);
          var shape = PointerEvents.getCapturedShape(evt.pointerId) ||
              this.getIntersection(this.getPointerPosition());
          if (shape) {
              shape._fireAndBubble(POINTERMOVE, PointerEvents.createEvent(evt));
          }
      };
      Stage.prototype._pointerup = function (evt) {
          if (!Global.Konva._pointerEventsEnabled) {
              return;
          }
          this.setPointersPositions(evt);
          var shape = PointerEvents.getCapturedShape(evt.pointerId) ||
              this.getIntersection(this.getPointerPosition());
          if (shape) {
              shape._fireAndBubble(POINTERUP, PointerEvents.createEvent(evt));
          }
          PointerEvents.releaseCapture(evt.pointerId);
      };
      Stage.prototype._pointercancel = function (evt) {
          if (!Global.Konva._pointerEventsEnabled) {
              return;
          }
          this.setPointersPositions(evt);
          var shape = PointerEvents.getCapturedShape(evt.pointerId) ||
              this.getIntersection(this.getPointerPosition());
          if (shape) {
              shape._fireAndBubble(POINTERUP, PointerEvents.createEvent(evt));
          }
          PointerEvents.releaseCapture(evt.pointerId);
      };
      Stage.prototype._lostpointercapture = function (evt) {
          PointerEvents.releaseCapture(evt.pointerId);
      };
      Stage.prototype.setPointersPositions = function (evt) {
          var _this = this;
          var contentPosition = this._getContentPosition(), x = null, y = null;
          evt = evt ? evt : window.event;
          if (evt.touches !== undefined) {
              this._pointerPositions = [];
              this._changedPointerPositions = [];
              Util.Collection.prototype.each.call(evt.touches, function (touch) {
                  _this._pointerPositions.push({
                      id: touch.identifier,
                      x: (touch.clientX - contentPosition.left) / contentPosition.scaleX,
                      y: (touch.clientY - contentPosition.top) / contentPosition.scaleY,
                  });
              });
              Util.Collection.prototype.each.call(evt.changedTouches || evt.touches, function (touch) {
                  _this._changedPointerPositions.push({
                      id: touch.identifier,
                      x: (touch.clientX - contentPosition.left) / contentPosition.scaleX,
                      y: (touch.clientY - contentPosition.top) / contentPosition.scaleY,
                  });
              });
          }
          else {
              x = (evt.clientX - contentPosition.left) / contentPosition.scaleX;
              y = (evt.clientY - contentPosition.top) / contentPosition.scaleY;
              this.pointerPos = {
                  x: x,
                  y: y,
              };
              this._pointerPositions = [{ x: x, y: y, id: Util.Util._getFirstPointerId(evt) }];
              this._changedPointerPositions = [
                  { x: x, y: y, id: Util.Util._getFirstPointerId(evt) },
              ];
          }
      };
      Stage.prototype._setPointerPosition = function (evt) {
          Util.Util.warn('Method _setPointerPosition is deprecated. Use "stage.setPointersPositions(event)" instead.');
          this.setPointersPositions(evt);
      };
      Stage.prototype._getContentPosition = function () {
          if (!this.content || !this.content.getBoundingClientRect) {
              return {
                  top: 0,
                  left: 0,
                  scaleX: 1,
                  scaleY: 1,
              };
          }
          var rect = this.content.getBoundingClientRect();
          return {
              top: rect.top,
              left: rect.left,
              scaleX: rect.width / this.content.clientWidth || 1,
              scaleY: rect.height / this.content.clientHeight || 1,
          };
      };
      Stage.prototype._buildDOM = function () {
          this.bufferCanvas = new Canvas_1.SceneCanvas({
              width: this.width(),
              height: this.height(),
          });
          this.bufferHitCanvas = new Canvas_1.HitCanvas({
              pixelRatio: 1,
              width: this.width(),
              height: this.height(),
          });
          if (!Global.Konva.isBrowser) {
              return;
          }
          var container = this.container();
          if (!container) {
              throw 'Stage has no container. A container is required.';
          }
          container.innerHTML = EMPTY_STRING;
          this.content = document.createElement('div');
          this.content.style.position = RELATIVE;
          this.content.style.userSelect = 'none';
          this.content.className = KONVA_CONTENT;
          this.content.setAttribute('role', 'presentation');
          container.appendChild(this.content);
          this._resizeDOM();
      };
      Stage.prototype.cache = function () {
          Util.Util.warn('Cache function is not allowed for stage. You may use cache only for layers, groups and shapes.');
          return this;
      };
      Stage.prototype.clearCache = function () {
          return this;
      };
      Stage.prototype.batchDraw = function () {
          this.children.each(function (layer) {
              layer.batchDraw();
          });
          return this;
      };
      return Stage;
  }(Container_1.Container));
  exports.Stage = Stage;
  Stage.prototype.nodeType = STAGE;
  Global_2._registerNode(Stage);
  Factory.Factory.addGetterSetter(Stage, 'container');
  });

  unwrapExports(Stage_1);
  var Stage_2 = Stage_1.stages;
  var Stage_3 = Stage_1.Stage;

  var Shape_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });






  var HAS_SHADOW = 'hasShadow';
  var SHADOW_RGBA = 'shadowRGBA';
  var patternImage = 'patternImage';
  var linearGradient = 'linearGradient';
  var radialGradient = 'radialGradient';
  var dummyContext;
  function getDummyContext() {
      if (dummyContext) {
          return dummyContext;
      }
      dummyContext = Util.Util.createCanvasElement().getContext('2d');
      return dummyContext;
  }
  exports.shapes = {};
  function _fillFunc(context) {
      context.fill();
  }
  function _strokeFunc(context) {
      context.stroke();
  }
  function _fillFuncHit(context) {
      context.fill();
  }
  function _strokeFuncHit(context) {
      context.stroke();
  }
  function _clearHasShadowCache() {
      this._clearCache(HAS_SHADOW);
  }
  function _clearGetShadowRGBACache() {
      this._clearCache(SHADOW_RGBA);
  }
  function _clearFillPatternCache() {
      this._clearCache(patternImage);
  }
  function _clearLinearGradientCache() {
      this._clearCache(linearGradient);
  }
  function _clearRadialGradientCache() {
      this._clearCache(radialGradient);
  }
  var Shape = (function (_super) {
      __extends(Shape, _super);
      function Shape(config) {
          var _this = _super.call(this, config) || this;
          var key;
          while (true) {
              key = Util.Util.getRandomColor();
              if (key && !(key in exports.shapes)) {
                  break;
              }
          }
          _this.colorKey = key;
          exports.shapes[key] = _this;
          _this.on('shadowColorChange.konva shadowBlurChange.konva shadowOffsetChange.konva shadowOpacityChange.konva shadowEnabledChange.konva', _clearHasShadowCache);
          _this.on('shadowColorChange.konva shadowOpacityChange.konva shadowEnabledChange.konva', _clearGetShadowRGBACache);
          _this.on('fillPriorityChange.konva fillPatternImageChange.konva fillPatternRepeatChange.konva fillPatternScaleXChange.konva fillPatternScaleYChange.konva', _clearFillPatternCache);
          _this.on('fillPriorityChange.konva fillLinearGradientColorStopsChange.konva fillLinearGradientStartPointXChange.konva fillLinearGradientStartPointYChange.konva fillLinearGradientEndPointXChange.konva fillLinearGradientEndPointYChange.konva', _clearLinearGradientCache);
          _this.on('fillPriorityChange.konva fillRadialGradientColorStopsChange.konva fillRadialGradientStartPointXChange.konva fillRadialGradientStartPointYChange.konva fillRadialGradientEndPointXChange.konva fillRadialGradientEndPointYChange.konva fillRadialGradientStartRadiusChange.konva fillRadialGradientEndRadiusChange.konva', _clearRadialGradientCache);
          return _this;
      }
      Shape.prototype.getContext = function () {
          return this.getLayer().getContext();
      };
      Shape.prototype.getCanvas = function () {
          return this.getLayer().getCanvas();
      };
      Shape.prototype.getSceneFunc = function () {
          return this.attrs.sceneFunc || this['_sceneFunc'];
      };
      Shape.prototype.getHitFunc = function () {
          return this.attrs.hitFunc || this['_hitFunc'];
      };
      Shape.prototype.hasShadow = function () {
          return this._getCache(HAS_SHADOW, this._hasShadow);
      };
      Shape.prototype._hasShadow = function () {
          return (this.shadowEnabled() &&
              this.shadowOpacity() !== 0 &&
              !!(this.shadowColor() ||
                  this.shadowBlur() ||
                  this.shadowOffsetX() ||
                  this.shadowOffsetY()));
      };
      Shape.prototype._getFillPattern = function () {
          return this._getCache(patternImage, this.__getFillPattern);
      };
      Shape.prototype.__getFillPattern = function () {
          if (this.fillPatternImage()) {
              var ctx = getDummyContext();
              var pattern = ctx.createPattern(this.fillPatternImage(), this.fillPatternRepeat() || 'repeat');
              return pattern;
          }
      };
      Shape.prototype._getLinearGradient = function () {
          return this._getCache(linearGradient, this.__getLinearGradient);
      };
      Shape.prototype.__getLinearGradient = function () {
          var colorStops = this.fillLinearGradientColorStops();
          if (colorStops) {
              var ctx = getDummyContext();
              var start = this.fillLinearGradientStartPoint();
              var end = this.fillLinearGradientEndPoint();
              var grd = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
              for (var n = 0; n < colorStops.length; n += 2) {
                  grd.addColorStop(colorStops[n], colorStops[n + 1]);
              }
              return grd;
          }
      };
      Shape.prototype._getRadialGradient = function () {
          return this._getCache(radialGradient, this.__getRadialGradient);
      };
      Shape.prototype.__getRadialGradient = function () {
          var colorStops = this.fillRadialGradientColorStops();
          if (colorStops) {
              var ctx = getDummyContext();
              var start = this.fillRadialGradientStartPoint();
              var end = this.fillRadialGradientEndPoint();
              var grd = ctx.createRadialGradient(start.x, start.y, this.fillRadialGradientStartRadius(), end.x, end.y, this.fillRadialGradientEndRadius());
              for (var n = 0; n < colorStops.length; n += 2) {
                  grd.addColorStop(colorStops[n], colorStops[n + 1]);
              }
              return grd;
          }
      };
      Shape.prototype.getShadowRGBA = function () {
          return this._getCache(SHADOW_RGBA, this._getShadowRGBA);
      };
      Shape.prototype._getShadowRGBA = function () {
          if (this.hasShadow()) {
              var rgba = Util.Util.colorToRGBA(this.shadowColor());
              return ('rgba(' +
                  rgba.r +
                  ',' +
                  rgba.g +
                  ',' +
                  rgba.b +
                  ',' +
                  rgba.a * (this.shadowOpacity() || 1) +
                  ')');
          }
      };
      Shape.prototype.hasFill = function () {
          var _this = this;
          return this._calculate('hasFill', [
              'fillEnabled',
              'fill',
              'fillPatternImage',
              'fillLinearGradientColorStops',
              'fillRadialGradientColorStops',
          ], function () {
              return (_this.fillEnabled() &&
                  !!(_this.fill() ||
                      _this.fillPatternImage() ||
                      _this.fillLinearGradientColorStops() ||
                      _this.fillRadialGradientColorStops()));
          });
      };
      Shape.prototype.hasStroke = function () {
          var _this = this;
          return this._calculate('hasStroke', [
              'strokeEnabled',
              'strokeWidth',
              'stroke',
              'strokeLinearGradientColorStops',
          ], function () {
              return (_this.strokeEnabled() &&
                  _this.strokeWidth() &&
                  !!(_this.stroke() || _this.strokeLinearGradientColorStops()));
          });
      };
      Shape.prototype.hasHitStroke = function () {
          var width = this.hitStrokeWidth();
          if (width === 'auto') {
              return this.hasStroke();
          }
          return this.strokeEnabled() && !!width;
      };
      Shape.prototype.intersects = function (point) {
          var stage = this.getStage(), bufferHitCanvas = stage.bufferHitCanvas, p;
          bufferHitCanvas.getContext().clear();
          this.drawHit(bufferHitCanvas);
          p = bufferHitCanvas.context.getImageData(Math.round(point.x), Math.round(point.y), 1, 1).data;
          return p[3] > 0;
      };
      Shape.prototype.destroy = function () {
          Node_1.Node.prototype.destroy.call(this);
          delete exports.shapes[this.colorKey];
          delete this.colorKey;
          return this;
      };
      Shape.prototype._useBufferCanvas = function (forceFill) {
          var _a;
          if (!this.getStage()) {
              return false;
          }
          var perfectDrawEnabled = (_a = this.attrs.perfectDrawEnabled) !== null && _a !== void 0 ? _a : true;
          if (!perfectDrawEnabled) {
              return false;
          }
          var hasFill = forceFill || this.hasFill();
          var hasStroke = this.hasStroke();
          var isTransparent = this.getAbsoluteOpacity() !== 1;
          if (hasFill && hasStroke && isTransparent) {
              return true;
          }
          var hasShadow = this.hasShadow();
          var strokeForShadow = this.shadowForStrokeEnabled();
          if (hasFill && hasStroke && hasShadow && strokeForShadow) {
              return true;
          }
          return false;
      };
      Shape.prototype.setStrokeHitEnabled = function (val) {
          Util.Util.warn('strokeHitEnabled property is deprecated. Please use hitStrokeWidth instead.');
          if (val) {
              this.hitStrokeWidth('auto');
          }
          else {
              this.hitStrokeWidth(0);
          }
      };
      Shape.prototype.getStrokeHitEnabled = function () {
          if (this.hitStrokeWidth() === 0) {
              return false;
          }
          else {
              return true;
          }
      };
      Shape.prototype.getSelfRect = function () {
          var size = this.size();
          return {
              x: this._centroid ? -size.width / 2 : 0,
              y: this._centroid ? -size.height / 2 : 0,
              width: size.width,
              height: size.height,
          };
      };
      Shape.prototype.getClientRect = function (attrs) {
          attrs = attrs || {};
          var skipTransform = attrs.skipTransform;
          var relativeTo = attrs.relativeTo;
          var fillRect = this.getSelfRect();
          var applyStroke = !attrs.skipStroke && this.hasStroke();
          var strokeWidth = (applyStroke && this.strokeWidth()) || 0;
          var fillAndStrokeWidth = fillRect.width + strokeWidth;
          var fillAndStrokeHeight = fillRect.height + strokeWidth;
          var applyShadow = !attrs.skipShadow && this.hasShadow();
          var shadowOffsetX = applyShadow ? this.shadowOffsetX() : 0;
          var shadowOffsetY = applyShadow ? this.shadowOffsetY() : 0;
          var preWidth = fillAndStrokeWidth + Math.abs(shadowOffsetX);
          var preHeight = fillAndStrokeHeight + Math.abs(shadowOffsetY);
          var blurRadius = (applyShadow && this.shadowBlur()) || 0;
          var width = preWidth + blurRadius * 2;
          var height = preHeight + blurRadius * 2;
          var roundingOffset = 0;
          if (Math.round(strokeWidth / 2) !== strokeWidth / 2) {
              roundingOffset = 1;
          }
          var rect = {
              width: width + roundingOffset,
              height: height + roundingOffset,
              x: -Math.round(strokeWidth / 2 + blurRadius) +
                  Math.min(shadowOffsetX, 0) +
                  fillRect.x,
              y: -Math.round(strokeWidth / 2 + blurRadius) +
                  Math.min(shadowOffsetY, 0) +
                  fillRect.y,
          };
          if (!skipTransform) {
              return this._transformedRect(rect, relativeTo);
          }
          return rect;
      };
      Shape.prototype.drawScene = function (can, top) {
          var layer = this.getLayer(), canvas = can || layer.getCanvas(), context = canvas.getContext(), cachedCanvas = this._getCanvasCache(), drawFunc = this.getSceneFunc(), hasShadow = this.hasShadow(), stage, bufferCanvas, bufferContext;
          var caching = canvas.isCache;
          var skipBuffer = canvas.isCache;
          var cachingSelf = top === this;
          if (!this.isVisible() && !caching) {
              return this;
          }
          if (cachedCanvas) {
              context.save();
              var m = this.getAbsoluteTransform(top).getMatrix();
              context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
              this._drawCachedSceneCanvas(context);
              context.restore();
              return this;
          }
          if (!drawFunc) {
              return this;
          }
          context.save();
          if (this._useBufferCanvas() && !skipBuffer) {
              stage = this.getStage();
              bufferCanvas = stage.bufferCanvas;
              bufferContext = bufferCanvas.getContext();
              bufferContext.clear();
              bufferContext.save();
              bufferContext._applyLineJoin(this);
              var o = this.getAbsoluteTransform(top).getMatrix();
              bufferContext.transform(o[0], o[1], o[2], o[3], o[4], o[5]);
              drawFunc.call(this, bufferContext, this);
              bufferContext.restore();
              var ratio = bufferCanvas.pixelRatio;
              if (hasShadow) {
                  context._applyShadow(this);
              }
              context._applyOpacity(this);
              context._applyGlobalCompositeOperation(this);
              context.drawImage(bufferCanvas._canvas, 0, 0, bufferCanvas.width / ratio, bufferCanvas.height / ratio);
          }
          else {
              context._applyLineJoin(this);
              if (!cachingSelf) {
                  var o = this.getAbsoluteTransform(top).getMatrix();
                  context.transform(o[0], o[1], o[2], o[3], o[4], o[5]);
                  context._applyOpacity(this);
                  context._applyGlobalCompositeOperation(this);
              }
              if (hasShadow) {
                  context._applyShadow(this);
              }
              drawFunc.call(this, context, this);
          }
          context.restore();
          return this;
      };
      Shape.prototype.drawHit = function (can, top) {
          if (!this.shouldDrawHit(top)) {
              return this;
          }
          var layer = this.getLayer(), canvas = can || layer.hitCanvas, context = canvas && canvas.getContext(), drawFunc = this.hitFunc() || this.sceneFunc(), cachedCanvas = this._getCanvasCache(), cachedHitCanvas = cachedCanvas && cachedCanvas.hit;
          if (!this.colorKey) {
              console.log(this);
              Util.Util.warn('Looks like your canvas has a destroyed shape in it. Do not reuse shape after you destroyed it. See the shape in logs above. If you want to reuse shape you should call remove() instead of destroy()');
          }
          if (cachedHitCanvas) {
              context.save();
              var m = this.getAbsoluteTransform(top).getMatrix();
              context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
              this._drawCachedHitCanvas(context);
              context.restore();
              return this;
          }
          if (!drawFunc) {
              return this;
          }
          context.save();
          context._applyLineJoin(this);
          var selfCache = this === top;
          if (!selfCache) {
              var o = this.getAbsoluteTransform(top).getMatrix();
              context.transform(o[0], o[1], o[2], o[3], o[4], o[5]);
          }
          drawFunc.call(this, context, this);
          context.restore();
          return this;
      };
      Shape.prototype.drawHitFromCache = function (alphaThreshold) {
          if (alphaThreshold === void 0) { alphaThreshold = 0; }
          var cachedCanvas = this._getCanvasCache(), sceneCanvas = this._getCachedSceneCanvas(), hitCanvas = cachedCanvas.hit, hitContext = hitCanvas.getContext(), hitWidth = hitCanvas.getWidth(), hitHeight = hitCanvas.getHeight(), hitImageData, hitData, len, rgbColorKey, i, alpha;
          hitContext.clear();
          hitContext.drawImage(sceneCanvas._canvas, 0, 0, hitWidth, hitHeight);
          try {
              hitImageData = hitContext.getImageData(0, 0, hitWidth, hitHeight);
              hitData = hitImageData.data;
              len = hitData.length;
              rgbColorKey = Util.Util._hexToRgb(this.colorKey);
              for (i = 0; i < len; i += 4) {
                  alpha = hitData[i + 3];
                  if (alpha > alphaThreshold) {
                      hitData[i] = rgbColorKey.r;
                      hitData[i + 1] = rgbColorKey.g;
                      hitData[i + 2] = rgbColorKey.b;
                      hitData[i + 3] = 255;
                  }
                  else {
                      hitData[i + 3] = 0;
                  }
              }
              hitContext.putImageData(hitImageData, 0, 0);
          }
          catch (e) {
              Util.Util.error('Unable to draw hit graph from cached scene canvas. ' + e.message);
          }
          return this;
      };
      Shape.prototype.hasPointerCapture = function (pointerId) {
          return PointerEvents.hasPointerCapture(pointerId, this);
      };
      Shape.prototype.setPointerCapture = function (pointerId) {
          PointerEvents.setPointerCapture(pointerId, this);
      };
      Shape.prototype.releaseCapture = function (pointerId) {
          PointerEvents.releaseCapture(pointerId, this);
      };
      return Shape;
  }(Node_1.Node));
  exports.Shape = Shape;
  Shape.prototype._fillFunc = _fillFunc;
  Shape.prototype._strokeFunc = _strokeFunc;
  Shape.prototype._fillFuncHit = _fillFuncHit;
  Shape.prototype._strokeFuncHit = _strokeFuncHit;
  Shape.prototype._centroid = false;
  Shape.prototype.nodeType = 'Shape';
  Global._registerNode(Shape);
  Factory.Factory.addGetterSetter(Shape, 'stroke', undefined, Validators.getStringValidator());
  Factory.Factory.addGetterSetter(Shape, 'strokeWidth', 2, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Shape, 'hitStrokeWidth', 'auto', Validators.getNumberOrAutoValidator());
  Factory.Factory.addGetterSetter(Shape, 'strokeHitEnabled', true, Validators.getBooleanValidator());
  Factory.Factory.addGetterSetter(Shape, 'perfectDrawEnabled', true, Validators.getBooleanValidator());
  Factory.Factory.addGetterSetter(Shape, 'shadowForStrokeEnabled', true, Validators.getBooleanValidator());
  Factory.Factory.addGetterSetter(Shape, 'lineJoin');
  Factory.Factory.addGetterSetter(Shape, 'lineCap');
  Factory.Factory.addGetterSetter(Shape, 'sceneFunc');
  Factory.Factory.addGetterSetter(Shape, 'hitFunc');
  Factory.Factory.addGetterSetter(Shape, 'dash');
  Factory.Factory.addGetterSetter(Shape, 'dashOffset', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Shape, 'shadowColor', undefined, Validators.getStringValidator());
  Factory.Factory.addGetterSetter(Shape, 'shadowBlur', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Shape, 'shadowOpacity', 1, Validators.getNumberValidator());
  Factory.Factory.addComponentsGetterSetter(Shape, 'shadowOffset', ['x', 'y']);
  Factory.Factory.addGetterSetter(Shape, 'shadowOffsetX', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Shape, 'shadowOffsetY', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Shape, 'fillPatternImage');
  Factory.Factory.addGetterSetter(Shape, 'fill', undefined, Validators.getStringValidator());
  Factory.Factory.addGetterSetter(Shape, 'fillPatternX', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Shape, 'fillPatternY', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Shape, 'fillLinearGradientColorStops');
  Factory.Factory.addGetterSetter(Shape, 'strokeLinearGradientColorStops');
  Factory.Factory.addGetterSetter(Shape, 'fillRadialGradientStartRadius', 0);
  Factory.Factory.addGetterSetter(Shape, 'fillRadialGradientEndRadius', 0);
  Factory.Factory.addGetterSetter(Shape, 'fillRadialGradientColorStops');
  Factory.Factory.addGetterSetter(Shape, 'fillPatternRepeat', 'repeat');
  Factory.Factory.addGetterSetter(Shape, 'fillEnabled', true);
  Factory.Factory.addGetterSetter(Shape, 'strokeEnabled', true);
  Factory.Factory.addGetterSetter(Shape, 'shadowEnabled', true);
  Factory.Factory.addGetterSetter(Shape, 'dashEnabled', true);
  Factory.Factory.addGetterSetter(Shape, 'strokeScaleEnabled', true);
  Factory.Factory.addGetterSetter(Shape, 'fillPriority', 'color');
  Factory.Factory.addComponentsGetterSetter(Shape, 'fillPatternOffset', ['x', 'y']);
  Factory.Factory.addGetterSetter(Shape, 'fillPatternOffsetX', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Shape, 'fillPatternOffsetY', 0, Validators.getNumberValidator());
  Factory.Factory.addComponentsGetterSetter(Shape, 'fillPatternScale', ['x', 'y']);
  Factory.Factory.addGetterSetter(Shape, 'fillPatternScaleX', 1, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Shape, 'fillPatternScaleY', 1, Validators.getNumberValidator());
  Factory.Factory.addComponentsGetterSetter(Shape, 'fillLinearGradientStartPoint', [
      'x',
      'y',
  ]);
  Factory.Factory.addComponentsGetterSetter(Shape, 'strokeLinearGradientStartPoint', [
      'x',
      'y',
  ]);
  Factory.Factory.addGetterSetter(Shape, 'fillLinearGradientStartPointX', 0);
  Factory.Factory.addGetterSetter(Shape, 'strokeLinearGradientStartPointX', 0);
  Factory.Factory.addGetterSetter(Shape, 'fillLinearGradientStartPointY', 0);
  Factory.Factory.addGetterSetter(Shape, 'strokeLinearGradientStartPointY', 0);
  Factory.Factory.addComponentsGetterSetter(Shape, 'fillLinearGradientEndPoint', [
      'x',
      'y',
  ]);
  Factory.Factory.addComponentsGetterSetter(Shape, 'strokeLinearGradientEndPoint', [
      'x',
      'y',
  ]);
  Factory.Factory.addGetterSetter(Shape, 'fillLinearGradientEndPointX', 0);
  Factory.Factory.addGetterSetter(Shape, 'strokeLinearGradientEndPointX', 0);
  Factory.Factory.addGetterSetter(Shape, 'fillLinearGradientEndPointY', 0);
  Factory.Factory.addGetterSetter(Shape, 'strokeLinearGradientEndPointY', 0);
  Factory.Factory.addComponentsGetterSetter(Shape, 'fillRadialGradientStartPoint', [
      'x',
      'y',
  ]);
  Factory.Factory.addGetterSetter(Shape, 'fillRadialGradientStartPointX', 0);
  Factory.Factory.addGetterSetter(Shape, 'fillRadialGradientStartPointY', 0);
  Factory.Factory.addComponentsGetterSetter(Shape, 'fillRadialGradientEndPoint', [
      'x',
      'y',
  ]);
  Factory.Factory.addGetterSetter(Shape, 'fillRadialGradientEndPointX', 0);
  Factory.Factory.addGetterSetter(Shape, 'fillRadialGradientEndPointY', 0);
  Factory.Factory.addGetterSetter(Shape, 'fillPatternRotation', 0);
  Factory.Factory.backCompat(Shape, {
      dashArray: 'dash',
      getDashArray: 'getDash',
      setDashArray: 'getDash',
      drawFunc: 'sceneFunc',
      getDrawFunc: 'getSceneFunc',
      setDrawFunc: 'setSceneFunc',
      drawHitFunc: 'hitFunc',
      getDrawHitFunc: 'getHitFunc',
      setDrawHitFunc: 'setHitFunc',
  });
  Util.Collection.mapMethods(Shape);
  });

  unwrapExports(Shape_1);
  var Shape_2 = Shape_1.shapes;
  var Shape_3 = Shape_1.Shape;

  var Layer_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });








  var HASH = '#', BEFORE_DRAW = 'beforeDraw', DRAW = 'draw', INTERSECTION_OFFSETS = [
      { x: 0, y: 0 },
      { x: -1, y: -1 },
      { x: 1, y: -1 },
      { x: 1, y: 1 },
      { x: -1, y: 1 },
  ], INTERSECTION_OFFSETS_LEN = INTERSECTION_OFFSETS.length;
  var Layer = (function (_super) {
      __extends(Layer, _super);
      function Layer(config) {
          var _this = _super.call(this, config) || this;
          _this.canvas = new Canvas_1.SceneCanvas();
          _this.hitCanvas = new Canvas_1.HitCanvas({
              pixelRatio: 1,
          });
          _this._waitingForDraw = false;
          _this.on('visibleChange.konva', _this._checkVisibility);
          _this._checkVisibility();
          _this.on('imageSmoothingEnabledChange.konva', _this._setSmoothEnabled);
          _this._setSmoothEnabled();
          return _this;
      }
      Layer.prototype.createPNGStream = function () {
          var c = this.canvas._canvas;
          return c.createPNGStream();
      };
      Layer.prototype.getCanvas = function () {
          return this.canvas;
      };
      Layer.prototype.getHitCanvas = function () {
          return this.hitCanvas;
      };
      Layer.prototype.getContext = function () {
          return this.getCanvas().getContext();
      };
      Layer.prototype.clear = function (bounds) {
          this.getContext().clear(bounds);
          this.getHitCanvas().getContext().clear(bounds);
          return this;
      };
      Layer.prototype.setZIndex = function (index) {
          _super.prototype.setZIndex.call(this, index);
          var stage = this.getStage();
          if (stage) {
              stage.content.removeChild(this.getCanvas()._canvas);
              if (index < stage.children.length - 1) {
                  stage.content.insertBefore(this.getCanvas()._canvas, stage.children[index + 1].getCanvas()._canvas);
              }
              else {
                  stage.content.appendChild(this.getCanvas()._canvas);
              }
          }
          return this;
      };
      Layer.prototype.moveToTop = function () {
          Node_1.Node.prototype.moveToTop.call(this);
          var stage = this.getStage();
          if (stage) {
              stage.content.removeChild(this.getCanvas()._canvas);
              stage.content.appendChild(this.getCanvas()._canvas);
          }
          return true;
      };
      Layer.prototype.moveUp = function () {
          var moved = Node_1.Node.prototype.moveUp.call(this);
          if (!moved) {
              return false;
          }
          var stage = this.getStage();
          if (!stage) {
              return false;
          }
          stage.content.removeChild(this.getCanvas()._canvas);
          if (this.index < stage.children.length - 1) {
              stage.content.insertBefore(this.getCanvas()._canvas, stage.children[this.index + 1].getCanvas()._canvas);
          }
          else {
              stage.content.appendChild(this.getCanvas()._canvas);
          }
          return true;
      };
      Layer.prototype.moveDown = function () {
          if (Node_1.Node.prototype.moveDown.call(this)) {
              var stage = this.getStage();
              if (stage) {
                  var children = stage.children;
                  stage.content.removeChild(this.getCanvas()._canvas);
                  stage.content.insertBefore(this.getCanvas()._canvas, children[this.index + 1].getCanvas()._canvas);
              }
              return true;
          }
          return false;
      };
      Layer.prototype.moveToBottom = function () {
          if (Node_1.Node.prototype.moveToBottom.call(this)) {
              var stage = this.getStage();
              if (stage) {
                  var children = stage.children;
                  stage.content.removeChild(this.getCanvas()._canvas);
                  stage.content.insertBefore(this.getCanvas()._canvas, children[1].getCanvas()._canvas);
              }
              return true;
          }
          return false;
      };
      Layer.prototype.getLayer = function () {
          return this;
      };
      Layer.prototype.remove = function () {
          var _canvas = this.getCanvas()._canvas;
          Node_1.Node.prototype.remove.call(this);
          if (_canvas && _canvas.parentNode && Util.Util._isInDocument(_canvas)) {
              _canvas.parentNode.removeChild(_canvas);
          }
          return this;
      };
      Layer.prototype.getStage = function () {
          return this.parent;
      };
      Layer.prototype.setSize = function (_a) {
          var width = _a.width, height = _a.height;
          this.canvas.setSize(width, height);
          this.hitCanvas.setSize(width, height);
          this._setSmoothEnabled();
          return this;
      };
      Layer.prototype._validateAdd = function (child) {
          var type = child.getType();
          if (type !== 'Group' && type !== 'Shape') {
              Util.Util.throw('You may only add groups and shapes to a layer.');
          }
      };
      Layer.prototype._toKonvaCanvas = function (config) {
          config = config || {};
          config.width = config.width || this.getWidth();
          config.height = config.height || this.getHeight();
          config.x = config.x !== undefined ? config.x : this.x();
          config.y = config.y !== undefined ? config.y : this.y();
          return Node_1.Node.prototype._toKonvaCanvas.call(this, config);
      };
      Layer.prototype._checkVisibility = function () {
          var visible = this.visible();
          if (visible) {
              this.canvas._canvas.style.display = 'block';
          }
          else {
              this.canvas._canvas.style.display = 'none';
          }
      };
      Layer.prototype._setSmoothEnabled = function () {
          this.getContext()._context.imageSmoothingEnabled = this.imageSmoothingEnabled();
      };
      Layer.prototype.getWidth = function () {
          if (this.parent) {
              return this.parent.width();
          }
      };
      Layer.prototype.setWidth = function () {
          Util.Util.warn('Can not change width of layer. Use "stage.width(value)" function instead.');
      };
      Layer.prototype.getHeight = function () {
          if (this.parent) {
              return this.parent.height();
          }
      };
      Layer.prototype.setHeight = function () {
          Util.Util.warn('Can not change height of layer. Use "stage.height(value)" function instead.');
      };
      Layer.prototype.batchDraw = function () {
          var _this = this;
          if (!this._waitingForDraw) {
              this._waitingForDraw = true;
              Util.Util.requestAnimFrame(function () {
                  _this.draw();
                  _this._waitingForDraw = false;
              });
          }
          return this;
      };
      Layer.prototype.getIntersection = function (pos, selector) {
          var obj, i, intersectionOffset, shape;
          if (!this.isListening() || !this.isVisible()) {
              return null;
          }
          var spiralSearchDistance = 1;
          var continueSearch = false;
          while (true) {
              for (i = 0; i < INTERSECTION_OFFSETS_LEN; i++) {
                  intersectionOffset = INTERSECTION_OFFSETS[i];
                  obj = this._getIntersection({
                      x: pos.x + intersectionOffset.x * spiralSearchDistance,
                      y: pos.y + intersectionOffset.y * spiralSearchDistance,
                  });
                  shape = obj.shape;
                  if (shape && selector) {
                      return shape.findAncestor(selector, true);
                  }
                  else if (shape) {
                      return shape;
                  }
                  continueSearch = !!obj.antialiased;
                  if (!obj.antialiased) {
                      break;
                  }
              }
              if (continueSearch) {
                  spiralSearchDistance += 1;
              }
              else {
                  return null;
              }
          }
      };
      Layer.prototype._getIntersection = function (pos) {
          var ratio = this.hitCanvas.pixelRatio;
          var p = this.hitCanvas.context.getImageData(Math.round(pos.x * ratio), Math.round(pos.y * ratio), 1, 1).data, p3 = p[3], colorKey, shape;
          if (p3 === 255) {
              colorKey = Util.Util._rgbToHex(p[0], p[1], p[2]);
              shape = Shape_1.shapes[HASH + colorKey];
              if (shape) {
                  return {
                      shape: shape,
                  };
              }
              return {
                  antialiased: true,
              };
          }
          else if (p3 > 0) {
              return {
                  antialiased: true,
              };
          }
          return {};
      };
      Layer.prototype.drawScene = function (can, top) {
          var layer = this.getLayer(), canvas = can || (layer && layer.getCanvas());
          this._fire(BEFORE_DRAW, {
              node: this,
          });
          if (this.clearBeforeDraw()) {
              canvas.getContext().clear();
          }
          Container_1.Container.prototype.drawScene.call(this, canvas, top);
          this._fire(DRAW, {
              node: this,
          });
          return this;
      };
      Layer.prototype.drawHit = function (can, top) {
          var layer = this.getLayer(), canvas = can || (layer && layer.hitCanvas);
          if (layer && layer.clearBeforeDraw()) {
              layer.getHitCanvas().getContext().clear();
          }
          Container_1.Container.prototype.drawHit.call(this, canvas, top);
          return this;
      };
      Layer.prototype.enableHitGraph = function () {
          this.hitGraphEnabled(true);
          return this;
      };
      Layer.prototype.disableHitGraph = function () {
          this.hitGraphEnabled(false);
          return this;
      };
      Layer.prototype.setHitGraphEnabled = function (val) {
          Util.Util.warn('hitGraphEnabled method is deprecated. Please use layer.listening() instead.');
          this.listening(val);
      };
      Layer.prototype.getHitGraphEnabled = function (val) {
          Util.Util.warn('hitGraphEnabled method is deprecated. Please use layer.listening() instead.');
          return this.listening();
      };
      Layer.prototype.toggleHitCanvas = function () {
          if (!this.parent) {
              return;
          }
          var parent = this.parent;
          var added = !!this.hitCanvas._canvas.parentNode;
          if (added) {
              parent.content.removeChild(this.hitCanvas._canvas);
          }
          else {
              parent.content.appendChild(this.hitCanvas._canvas);
          }
      };
      return Layer;
  }(Container_1.Container));
  exports.Layer = Layer;
  Layer.prototype.nodeType = 'Layer';
  Global._registerNode(Layer);
  Factory.Factory.addGetterSetter(Layer, 'imageSmoothingEnabled', true);
  Factory.Factory.addGetterSetter(Layer, 'clearBeforeDraw', true);
  Factory.Factory.addGetterSetter(Layer, 'hitGraphEnabled', true, Validators.getBooleanValidator());
  Util.Collection.mapMethods(Layer);
  });

  unwrapExports(Layer_1);
  var Layer_2 = Layer_1.Layer;

  var FastLayer_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });



  var FastLayer = (function (_super) {
      __extends(FastLayer, _super);
      function FastLayer(attrs) {
          var _this = _super.call(this, attrs) || this;
          _this.listening(false);
          Util.Util.warn('Konva.Fast layer is deprecated. Please use "new Konva.Layer({ listening: false })" instead.');
          return _this;
      }
      return FastLayer;
  }(Layer_1.Layer));
  exports.FastLayer = FastLayer;
  FastLayer.prototype.nodeType = 'FastLayer';
  Global._registerNode(FastLayer);
  Util.Collection.mapMethods(FastLayer);
  });

  unwrapExports(FastLayer_1);
  var FastLayer_2 = FastLayer_1.FastLayer;

  var Group_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });



  var Group = (function (_super) {
      __extends(Group, _super);
      function Group() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Group.prototype._validateAdd = function (child) {
          var type = child.getType();
          if (type !== 'Group' && type !== 'Shape') {
              Util.Util.throw('You may only add groups and shapes to groups.');
          }
      };
      return Group;
  }(Container_1.Container));
  exports.Group = Group;
  Group.prototype.nodeType = 'Group';
  Global._registerNode(Group);
  Util.Collection.mapMethods(Group);
  });

  unwrapExports(Group_1);
  var Group_2 = Group_1.Group;

  var Animation_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });

  var now = (function () {
      if (Global.glob.performance && Global.glob.performance.now) {
          return function () {
              return Global.glob.performance.now();
          };
      }
      return function () {
          return new Date().getTime();
      };
  })();
  var Animation = (function () {
      function Animation(func, layers) {
          this.id = Animation.animIdCounter++;
          this.frame = {
              time: 0,
              timeDiff: 0,
              lastTime: now(),
              frameRate: 0
          };
          this.func = func;
          this.setLayers(layers);
      }
      Animation.prototype.setLayers = function (layers) {
          var lays = [];
          if (!layers) {
              lays = [];
          }
          else if (layers.length > 0) {
              lays = layers;
          }
          else {
              lays = [layers];
          }
          this.layers = lays;
          return this;
      };
      Animation.prototype.getLayers = function () {
          return this.layers;
      };
      Animation.prototype.addLayer = function (layer) {
          var layers = this.layers, len = layers.length, n;
          for (n = 0; n < len; n++) {
              if (layers[n]._id === layer._id) {
                  return false;
              }
          }
          this.layers.push(layer);
          return true;
      };
      Animation.prototype.isRunning = function () {
          var a = Animation, animations = a.animations, len = animations.length, n;
          for (n = 0; n < len; n++) {
              if (animations[n].id === this.id) {
                  return true;
              }
          }
          return false;
      };
      Animation.prototype.start = function () {
          this.stop();
          this.frame.timeDiff = 0;
          this.frame.lastTime = now();
          Animation._addAnimation(this);
          return this;
      };
      Animation.prototype.stop = function () {
          Animation._removeAnimation(this);
          return this;
      };
      Animation.prototype._updateFrameObject = function (time) {
          this.frame.timeDiff = time - this.frame.lastTime;
          this.frame.lastTime = time;
          this.frame.time += this.frame.timeDiff;
          this.frame.frameRate = 1000 / this.frame.timeDiff;
      };
      Animation._addAnimation = function (anim) {
          this.animations.push(anim);
          this._handleAnimation();
      };
      Animation._removeAnimation = function (anim) {
          var id = anim.id, animations = this.animations, len = animations.length, n;
          for (n = 0; n < len; n++) {
              if (animations[n].id === id) {
                  this.animations.splice(n, 1);
                  break;
              }
          }
      };
      Animation._runFrames = function () {
          var layerHash = {}, animations = this.animations, anim, layers, func, n, i, layersLen, layer, key, needRedraw;
          for (n = 0; n < animations.length; n++) {
              anim = animations[n];
              layers = anim.layers;
              func = anim.func;
              anim._updateFrameObject(now());
              layersLen = layers.length;
              if (func) {
                  needRedraw = func.call(anim, anim.frame) !== false;
              }
              else {
                  needRedraw = true;
              }
              if (!needRedraw) {
                  continue;
              }
              for (i = 0; i < layersLen; i++) {
                  layer = layers[i];
                  if (layer._id !== undefined) {
                      layerHash[layer._id] = layer;
                  }
              }
          }
          for (key in layerHash) {
              if (!layerHash.hasOwnProperty(key)) {
                  continue;
              }
              layerHash[key].draw();
          }
      };
      Animation._animationLoop = function () {
          var Anim = Animation;
          if (Anim.animations.length) {
              Anim._runFrames();
              requestAnimationFrame(Anim._animationLoop);
          }
          else {
              Anim.animRunning = false;
          }
      };
      Animation._handleAnimation = function () {
          if (!this.animRunning) {
              this.animRunning = true;
              requestAnimationFrame(this._animationLoop);
          }
      };
      Animation.animations = [];
      Animation.animIdCounter = 0;
      Animation.animRunning = false;
      return Animation;
  }());
  exports.Animation = Animation;
  });

  unwrapExports(Animation_1);
  var Animation_2 = Animation_1.Animation;

  var Tween_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });




  var blacklist = {
      node: 1,
      duration: 1,
      easing: 1,
      onFinish: 1,
      yoyo: 1
  }, PAUSED = 1, PLAYING = 2, REVERSING = 3, idCounter = 0, colorAttrs = ['fill', 'stroke', 'shadowColor'];
  var TweenEngine = (function () {
      function TweenEngine(prop, propFunc, func, begin, finish, duration, yoyo) {
          this.prop = prop;
          this.propFunc = propFunc;
          this.begin = begin;
          this._pos = begin;
          this.duration = duration;
          this._change = 0;
          this.prevPos = 0;
          this.yoyo = yoyo;
          this._time = 0;
          this._position = 0;
          this._startTime = 0;
          this._finish = 0;
          this.func = func;
          this._change = finish - this.begin;
          this.pause();
      }
      TweenEngine.prototype.fire = function (str) {
          var handler = this[str];
          if (handler) {
              handler();
          }
      };
      TweenEngine.prototype.setTime = function (t) {
          if (t > this.duration) {
              if (this.yoyo) {
                  this._time = this.duration;
                  this.reverse();
              }
              else {
                  this.finish();
              }
          }
          else if (t < 0) {
              if (this.yoyo) {
                  this._time = 0;
                  this.play();
              }
              else {
                  this.reset();
              }
          }
          else {
              this._time = t;
              this.update();
          }
      };
      TweenEngine.prototype.getTime = function () {
          return this._time;
      };
      TweenEngine.prototype.setPosition = function (p) {
          this.prevPos = this._pos;
          this.propFunc(p);
          this._pos = p;
      };
      TweenEngine.prototype.getPosition = function (t) {
          if (t === undefined) {
              t = this._time;
          }
          return this.func(t, this.begin, this._change, this.duration);
      };
      TweenEngine.prototype.play = function () {
          this.state = PLAYING;
          this._startTime = this.getTimer() - this._time;
          this.onEnterFrame();
          this.fire('onPlay');
      };
      TweenEngine.prototype.reverse = function () {
          this.state = REVERSING;
          this._time = this.duration - this._time;
          this._startTime = this.getTimer() - this._time;
          this.onEnterFrame();
          this.fire('onReverse');
      };
      TweenEngine.prototype.seek = function (t) {
          this.pause();
          this._time = t;
          this.update();
          this.fire('onSeek');
      };
      TweenEngine.prototype.reset = function () {
          this.pause();
          this._time = 0;
          this.update();
          this.fire('onReset');
      };
      TweenEngine.prototype.finish = function () {
          this.pause();
          this._time = this.duration;
          this.update();
          this.fire('onFinish');
      };
      TweenEngine.prototype.update = function () {
          this.setPosition(this.getPosition(this._time));
      };
      TweenEngine.prototype.onEnterFrame = function () {
          var t = this.getTimer() - this._startTime;
          if (this.state === PLAYING) {
              this.setTime(t);
          }
          else if (this.state === REVERSING) {
              this.setTime(this.duration - t);
          }
      };
      TweenEngine.prototype.pause = function () {
          this.state = PAUSED;
          this.fire('onPause');
      };
      TweenEngine.prototype.getTimer = function () {
          return new Date().getTime();
      };
      return TweenEngine;
  }());
  var Tween = (function () {
      function Tween(config) {
          var that = this, node = config.node, nodeId = node._id, duration, easing = config.easing || exports.Easings.Linear, yoyo = !!config.yoyo, key;
          if (typeof config.duration === 'undefined') {
              duration = 0.3;
          }
          else if (config.duration === 0) {
              duration = 0.001;
          }
          else {
              duration = config.duration;
          }
          this.node = node;
          this._id = idCounter++;
          var layers = node.getLayer() ||
              (node instanceof Global.Konva['Stage'] ? node.getLayers() : null);
          if (!layers) {
              Util.Util.error('Tween constructor have `node` that is not in a layer. Please add node into layer first.');
          }
          this.anim = new Animation_1.Animation(function () {
              that.tween.onEnterFrame();
          }, layers);
          this.tween = new TweenEngine(key, function (i) {
              that._tweenFunc(i);
          }, easing, 0, 1, duration * 1000, yoyo);
          this._addListeners();
          if (!Tween.attrs[nodeId]) {
              Tween.attrs[nodeId] = {};
          }
          if (!Tween.attrs[nodeId][this._id]) {
              Tween.attrs[nodeId][this._id] = {};
          }
          if (!Tween.tweens[nodeId]) {
              Tween.tweens[nodeId] = {};
          }
          for (key in config) {
              if (blacklist[key] === undefined) {
                  this._addAttr(key, config[key]);
              }
          }
          this.reset();
          this.onFinish = config.onFinish;
          this.onReset = config.onReset;
      }
      Tween.prototype._addAttr = function (key, end) {
          var node = this.node, nodeId = node._id, start, diff, tweenId, n, len, trueEnd, trueStart, endRGBA;
          tweenId = Tween.tweens[nodeId][key];
          if (tweenId) {
              delete Tween.attrs[nodeId][tweenId][key];
          }
          start = node.getAttr(key);
          if (Util.Util._isArray(end)) {
              diff = [];
              len = Math.max(end.length, start.length);
              if (key === 'points' && end.length !== start.length) {
                  if (end.length > start.length) {
                      trueStart = start;
                      start = Util.Util._prepareArrayForTween(start, end, node.closed());
                  }
                  else {
                      trueEnd = end;
                      end = Util.Util._prepareArrayForTween(end, start, node.closed());
                  }
              }
              if (key.indexOf('fill') === 0) {
                  for (n = 0; n < len; n++) {
                      if (n % 2 === 0) {
                          diff.push(end[n] - start[n]);
                      }
                      else {
                          var startRGBA = Util.Util.colorToRGBA(start[n]);
                          endRGBA = Util.Util.colorToRGBA(end[n]);
                          start[n] = startRGBA;
                          diff.push({
                              r: endRGBA.r - startRGBA.r,
                              g: endRGBA.g - startRGBA.g,
                              b: endRGBA.b - startRGBA.b,
                              a: endRGBA.a - startRGBA.a
                          });
                      }
                  }
              }
              else {
                  for (n = 0; n < len; n++) {
                      diff.push(end[n] - start[n]);
                  }
              }
          }
          else if (colorAttrs.indexOf(key) !== -1) {
              start = Util.Util.colorToRGBA(start);
              endRGBA = Util.Util.colorToRGBA(end);
              diff = {
                  r: endRGBA.r - start.r,
                  g: endRGBA.g - start.g,
                  b: endRGBA.b - start.b,
                  a: endRGBA.a - start.a
              };
          }
          else {
              diff = end - start;
          }
          Tween.attrs[nodeId][this._id][key] = {
              start: start,
              diff: diff,
              end: end,
              trueEnd: trueEnd,
              trueStart: trueStart
          };
          Tween.tweens[nodeId][key] = this._id;
      };
      Tween.prototype._tweenFunc = function (i) {
          var node = this.node, attrs = Tween.attrs[node._id][this._id], key, attr, start, diff, newVal, n, len, end;
          for (key in attrs) {
              attr = attrs[key];
              start = attr.start;
              diff = attr.diff;
              end = attr.end;
              if (Util.Util._isArray(start)) {
                  newVal = [];
                  len = Math.max(start.length, end.length);
                  if (key.indexOf('fill') === 0) {
                      for (n = 0; n < len; n++) {
                          if (n % 2 === 0) {
                              newVal.push((start[n] || 0) + diff[n] * i);
                          }
                          else {
                              newVal.push('rgba(' +
                                  Math.round(start[n].r + diff[n].r * i) +
                                  ',' +
                                  Math.round(start[n].g + diff[n].g * i) +
                                  ',' +
                                  Math.round(start[n].b + diff[n].b * i) +
                                  ',' +
                                  (start[n].a + diff[n].a * i) +
                                  ')');
                          }
                      }
                  }
                  else {
                      for (n = 0; n < len; n++) {
                          newVal.push((start[n] || 0) + diff[n] * i);
                      }
                  }
              }
              else if (colorAttrs.indexOf(key) !== -1) {
                  newVal =
                      'rgba(' +
                          Math.round(start.r + diff.r * i) +
                          ',' +
                          Math.round(start.g + diff.g * i) +
                          ',' +
                          Math.round(start.b + diff.b * i) +
                          ',' +
                          (start.a + diff.a * i) +
                          ')';
              }
              else {
                  newVal = start + diff * i;
              }
              node.setAttr(key, newVal);
          }
      };
      Tween.prototype._addListeners = function () {
          var _this = this;
          this.tween.onPlay = function () {
              _this.anim.start();
          };
          this.tween.onReverse = function () {
              _this.anim.start();
          };
          this.tween.onPause = function () {
              _this.anim.stop();
          };
          this.tween.onFinish = function () {
              var node = _this.node;
              var attrs = Tween.attrs[node._id][_this._id];
              if (attrs.points && attrs.points.trueEnd) {
                  node.setAttr('points', attrs.points.trueEnd);
              }
              if (_this.onFinish) {
                  _this.onFinish.call(_this);
              }
          };
          this.tween.onReset = function () {
              var node = _this.node;
              var attrs = Tween.attrs[node._id][_this._id];
              if (attrs.points && attrs.points.trueStart) {
                  node.points(attrs.points.trueStart);
              }
              if (_this.onReset) {
                  _this.onReset();
              }
          };
      };
      Tween.prototype.play = function () {
          this.tween.play();
          return this;
      };
      Tween.prototype.reverse = function () {
          this.tween.reverse();
          return this;
      };
      Tween.prototype.reset = function () {
          this.tween.reset();
          return this;
      };
      Tween.prototype.seek = function (t) {
          this.tween.seek(t * 1000);
          return this;
      };
      Tween.prototype.pause = function () {
          this.tween.pause();
          return this;
      };
      Tween.prototype.finish = function () {
          this.tween.finish();
          return this;
      };
      Tween.prototype.destroy = function () {
          var nodeId = this.node._id, thisId = this._id, attrs = Tween.tweens[nodeId], key;
          this.pause();
          for (key in attrs) {
              delete Tween.tweens[nodeId][key];
          }
          delete Tween.attrs[nodeId][thisId];
      };
      Tween.attrs = {};
      Tween.tweens = {};
      return Tween;
  }());
  exports.Tween = Tween;
  Node_1.Node.prototype.to = function (params) {
      var onFinish = params.onFinish;
      params.node = this;
      params.onFinish = function () {
          this.destroy();
          if (onFinish) {
              onFinish();
          }
      };
      var tween = new Tween(params);
      tween.play();
  };
  exports.Easings = {
      BackEaseIn: function (t, b, c, d) {
          var s = 1.70158;
          return c * (t /= d) * t * ((s + 1) * t - s) + b;
      },
      BackEaseOut: function (t, b, c, d) {
          var s = 1.70158;
          return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
      },
      BackEaseInOut: function (t, b, c, d) {
          var s = 1.70158;
          if ((t /= d / 2) < 1) {
              return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
          }
          return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
      },
      ElasticEaseIn: function (t, b, c, d, a, p) {
          var s = 0;
          if (t === 0) {
              return b;
          }
          if ((t /= d) === 1) {
              return b + c;
          }
          if (!p) {
              p = d * 0.3;
          }
          if (!a || a < Math.abs(c)) {
              a = c;
              s = p / 4;
          }
          else {
              s = (p / (2 * Math.PI)) * Math.asin(c / a);
          }
          return (-(a *
              Math.pow(2, 10 * (t -= 1)) *
              Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b);
      },
      ElasticEaseOut: function (t, b, c, d, a, p) {
          var s = 0;
          if (t === 0) {
              return b;
          }
          if ((t /= d) === 1) {
              return b + c;
          }
          if (!p) {
              p = d * 0.3;
          }
          if (!a || a < Math.abs(c)) {
              a = c;
              s = p / 4;
          }
          else {
              s = (p / (2 * Math.PI)) * Math.asin(c / a);
          }
          return (a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
              c +
              b);
      },
      ElasticEaseInOut: function (t, b, c, d, a, p) {
          var s = 0;
          if (t === 0) {
              return b;
          }
          if ((t /= d / 2) === 2) {
              return b + c;
          }
          if (!p) {
              p = d * (0.3 * 1.5);
          }
          if (!a || a < Math.abs(c)) {
              a = c;
              s = p / 4;
          }
          else {
              s = (p / (2 * Math.PI)) * Math.asin(c / a);
          }
          if (t < 1) {
              return (-0.5 *
                  (a *
                      Math.pow(2, 10 * (t -= 1)) *
                      Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
                  b);
          }
          return (a *
              Math.pow(2, -10 * (t -= 1)) *
              Math.sin(((t * d - s) * (2 * Math.PI)) / p) *
              0.5 +
              c +
              b);
      },
      BounceEaseOut: function (t, b, c, d) {
          if ((t /= d) < 1 / 2.75) {
              return c * (7.5625 * t * t) + b;
          }
          else if (t < 2 / 2.75) {
              return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
          }
          else if (t < 2.5 / 2.75) {
              return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
          }
          else {
              return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
          }
      },
      BounceEaseIn: function (t, b, c, d) {
          return c - exports.Easings.BounceEaseOut(d - t, 0, c, d) + b;
      },
      BounceEaseInOut: function (t, b, c, d) {
          if (t < d / 2) {
              return exports.Easings.BounceEaseIn(t * 2, 0, c, d) * 0.5 + b;
          }
          else {
              return exports.Easings.BounceEaseOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
          }
      },
      EaseIn: function (t, b, c, d) {
          return c * (t /= d) * t + b;
      },
      EaseOut: function (t, b, c, d) {
          return -c * (t /= d) * (t - 2) + b;
      },
      EaseInOut: function (t, b, c, d) {
          if ((t /= d / 2) < 1) {
              return (c / 2) * t * t + b;
          }
          return (-c / 2) * (--t * (t - 2) - 1) + b;
      },
      StrongEaseIn: function (t, b, c, d) {
          return c * (t /= d) * t * t * t * t + b;
      },
      StrongEaseOut: function (t, b, c, d) {
          return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
      },
      StrongEaseInOut: function (t, b, c, d) {
          if ((t /= d / 2) < 1) {
              return (c / 2) * t * t * t * t * t + b;
          }
          return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
      },
      Linear: function (t, b, c, d) {
          return (c * t) / d + b;
      }
  };
  });

  unwrapExports(Tween_1);
  var Tween_2 = Tween_1.Tween;
  var Tween_3 = Tween_1.Easings;

  var _CoreInternals = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });














  exports.Konva = Util.Util._assign(Global.Konva, {
      Collection: Util.Collection,
      Util: Util.Util,
      Transform: Util.Transform,
      Node: Node_1.Node,
      ids: Node_1.ids,
      names: Node_1.names,
      Container: Container_1.Container,
      Stage: Stage_1.Stage,
      stages: Stage_1.stages,
      Layer: Layer_1.Layer,
      FastLayer: FastLayer_1.FastLayer,
      Group: Group_1.Group,
      DD: DragAndDrop.DD,
      Shape: Shape_1.Shape,
      shapes: Shape_1.shapes,
      Animation: Animation_1.Animation,
      Tween: Tween_1.Tween,
      Easings: Tween_1.Easings,
      Context: Context_1.Context,
      Canvas: Canvas_1.Canvas
  });
  });

  unwrapExports(_CoreInternals);
  var _CoreInternals_1 = _CoreInternals.Konva;

  var Arc_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var Global_2 = Global;
  var Arc = (function (_super) {
      __extends(Arc, _super);
      function Arc() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Arc.prototype._sceneFunc = function (context) {
          var angle = Global.Konva.getAngle(this.angle()), clockwise = this.clockwise();
          context.beginPath();
          context.arc(0, 0, this.outerRadius(), 0, angle, clockwise);
          context.arc(0, 0, this.innerRadius(), angle, 0, !clockwise);
          context.closePath();
          context.fillStrokeShape(this);
      };
      Arc.prototype.getWidth = function () {
          return this.outerRadius() * 2;
      };
      Arc.prototype.getHeight = function () {
          return this.outerRadius() * 2;
      };
      Arc.prototype.setWidth = function (width) {
          this.outerRadius(width / 2);
      };
      Arc.prototype.setHeight = function (height) {
          this.outerRadius(height / 2);
      };
      return Arc;
  }(Shape_1.Shape));
  exports.Arc = Arc;
  Arc.prototype._centroid = true;
  Arc.prototype.className = 'Arc';
  Arc.prototype._attrsAffectingSize = ['innerRadius', 'outerRadius'];
  Global_2._registerNode(Arc);
  Factory.Factory.addGetterSetter(Arc, 'innerRadius', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Arc, 'outerRadius', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Arc, 'angle', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Arc, 'clockwise', false, Validators.getBooleanValidator());
  Util.Collection.mapMethods(Arc);
  });

  unwrapExports(Arc_1);
  var Arc_2 = Arc_1.Arc;

  var Line_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  var __spreadArrays = (commonjsGlobal && commonjsGlobal.__spreadArrays) || function () {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
          for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
              r[k] = a[j];
      return r;
  };
  Object.defineProperty(exports, "__esModule", { value: true });





  var Line = (function (_super) {
      __extends(Line, _super);
      function Line(config) {
          var _this = _super.call(this, config) || this;
          _this.on('pointsChange.konva tensionChange.konva closedChange.konva bezierChange.konva', function () {
              this._clearCache('tensionPoints');
          });
          return _this;
      }
      Line.prototype._sceneFunc = function (context) {
          var points = this.points(), length = points.length, tension = this.tension(), closed = this.closed(), bezier = this.bezier(), tp, len, n;
          if (!length) {
              return;
          }
          context.beginPath();
          context.moveTo(points[0], points[1]);
          if (tension !== 0 && length > 4) {
              tp = this.getTensionPoints();
              len = tp.length;
              n = closed ? 0 : 4;
              if (!closed) {
                  context.quadraticCurveTo(tp[0], tp[1], tp[2], tp[3]);
              }
              while (n < len - 2) {
                  context.bezierCurveTo(tp[n++], tp[n++], tp[n++], tp[n++], tp[n++], tp[n++]);
              }
              if (!closed) {
                  context.quadraticCurveTo(tp[len - 2], tp[len - 1], points[length - 2], points[length - 1]);
              }
          }
          else if (bezier) {
              n = 2;
              while (n < length) {
                  context.bezierCurveTo(points[n++], points[n++], points[n++], points[n++], points[n++], points[n++]);
              }
          }
          else {
              for (n = 2; n < length; n += 2) {
                  context.lineTo(points[n], points[n + 1]);
              }
          }
          if (closed) {
              context.closePath();
              context.fillStrokeShape(this);
          }
          else {
              context.strokeShape(this);
          }
      };
      Line.prototype.getTensionPoints = function () {
          return this._getCache('tensionPoints', this._getTensionPoints);
      };
      Line.prototype._getTensionPoints = function () {
          if (this.closed()) {
              return this._getTensionPointsClosed();
          }
          else {
              return Util.Util._expandPoints(this.points(), this.tension());
          }
      };
      Line.prototype._getTensionPointsClosed = function () {
          var p = this.points(), len = p.length, tension = this.tension(), firstControlPoints = Util.Util._getControlPoints(p[len - 2], p[len - 1], p[0], p[1], p[2], p[3], tension), lastControlPoints = Util.Util._getControlPoints(p[len - 4], p[len - 3], p[len - 2], p[len - 1], p[0], p[1], tension), middle = Util.Util._expandPoints(p, tension), tp = [firstControlPoints[2], firstControlPoints[3]]
              .concat(middle)
              .concat([
              lastControlPoints[0],
              lastControlPoints[1],
              p[len - 2],
              p[len - 1],
              lastControlPoints[2],
              lastControlPoints[3],
              firstControlPoints[0],
              firstControlPoints[1],
              p[0],
              p[1]
          ]);
          return tp;
      };
      Line.prototype.getWidth = function () {
          return this.getSelfRect().width;
      };
      Line.prototype.getHeight = function () {
          return this.getSelfRect().height;
      };
      Line.prototype.getSelfRect = function () {
          var points = this.points();
          if (points.length < 4) {
              return {
                  x: points[0] || 0,
                  y: points[1] || 0,
                  width: 0,
                  height: 0
              };
          }
          if (this.tension() !== 0) {
              points = __spreadArrays([
                  points[0],
                  points[1]
              ], this._getTensionPoints(), [
                  points[points.length - 2],
                  points[points.length - 1]
              ]);
          }
          else {
              points = this.points();
          }
          var minX = points[0];
          var maxX = points[0];
          var minY = points[1];
          var maxY = points[1];
          var x, y;
          for (var i = 0; i < points.length / 2; i++) {
              x = points[i * 2];
              y = points[i * 2 + 1];
              minX = Math.min(minX, x);
              maxX = Math.max(maxX, x);
              minY = Math.min(minY, y);
              maxY = Math.max(maxY, y);
          }
          return {
              x: minX,
              y: minY,
              width: maxX - minX,
              height: maxY - minY
          };
      };
      return Line;
  }(Shape_1.Shape));
  exports.Line = Line;
  Line.prototype.className = 'Line';
  Line.prototype._attrsAffectingSize = ['points', 'bezier', 'tension'];
  Global._registerNode(Line);
  Factory.Factory.addGetterSetter(Line, 'closed', false);
  Factory.Factory.addGetterSetter(Line, 'bezier', false);
  Factory.Factory.addGetterSetter(Line, 'tension', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Line, 'points', [], Validators.getNumberArrayValidator());
  Util.Collection.mapMethods(Line);
  });

  unwrapExports(Line_1);
  var Line_2 = Line_1.Line;

  var Arrow_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var Arrow = (function (_super) {
      __extends(Arrow, _super);
      function Arrow() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Arrow.prototype._sceneFunc = function (ctx) {
          _super.prototype._sceneFunc.call(this, ctx);
          var PI2 = Math.PI * 2;
          var points = this.points();
          var tp = points;
          var fromTension = this.tension() !== 0 && points.length > 4;
          if (fromTension) {
              tp = this.getTensionPoints();
          }
          var n = points.length;
          var dx, dy;
          if (fromTension) {
              dx = points[n - 2] - (tp[tp.length - 2] + tp[tp.length - 4]) / 2;
              dy = points[n - 1] - (tp[tp.length - 1] + tp[tp.length - 3]) / 2;
          }
          else {
              dx = points[n - 2] - points[n - 4];
              dy = points[n - 1] - points[n - 3];
          }
          var radians = (Math.atan2(dy, dx) + PI2) % PI2;
          var length = this.pointerLength();
          var width = this.pointerWidth();
          ctx.save();
          ctx.beginPath();
          ctx.translate(points[n - 2], points[n - 1]);
          ctx.rotate(radians);
          ctx.moveTo(0, 0);
          ctx.lineTo(-length, width / 2);
          ctx.lineTo(-length, -width / 2);
          ctx.closePath();
          ctx.restore();
          if (this.pointerAtBeginning()) {
              ctx.save();
              ctx.translate(points[0], points[1]);
              if (fromTension) {
                  dx = (tp[0] + tp[2]) / 2 - points[0];
                  dy = (tp[1] + tp[3]) / 2 - points[1];
              }
              else {
                  dx = points[2] - points[0];
                  dy = points[3] - points[1];
              }
              ctx.rotate((Math.atan2(-dy, -dx) + PI2) % PI2);
              ctx.moveTo(0, 0);
              ctx.lineTo(-length, width / 2);
              ctx.lineTo(-length, -width / 2);
              ctx.closePath();
              ctx.restore();
          }
          var isDashEnabled = this.dashEnabled();
          if (isDashEnabled) {
              this.attrs.dashEnabled = false;
              ctx.setLineDash([]);
          }
          ctx.fillStrokeShape(this);
          if (isDashEnabled) {
              this.attrs.dashEnabled = true;
          }
      };
      Arrow.prototype.getSelfRect = function () {
          var lineRect = _super.prototype.getSelfRect.call(this);
          var offset = this.pointerWidth() / 2;
          return {
              x: lineRect.x - offset,
              y: lineRect.y - offset,
              width: lineRect.width + offset * 2,
              height: lineRect.height + offset * 2
          };
      };
      return Arrow;
  }(Line_1.Line));
  exports.Arrow = Arrow;
  Arrow.prototype.className = 'Arrow';
  Global._registerNode(Arrow);
  Factory.Factory.addGetterSetter(Arrow, 'pointerLength', 10, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Arrow, 'pointerWidth', 10, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Arrow, 'pointerAtBeginning', false);
  Util.Collection.mapMethods(Arrow);
  });

  unwrapExports(Arrow_1);
  var Arrow_2 = Arrow_1.Arrow;

  var Circle_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var Circle = (function (_super) {
      __extends(Circle, _super);
      function Circle() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Circle.prototype._sceneFunc = function (context) {
          context.beginPath();
          context.arc(0, 0, this.radius(), 0, Math.PI * 2, false);
          context.closePath();
          context.fillStrokeShape(this);
      };
      Circle.prototype.getWidth = function () {
          return this.radius() * 2;
      };
      Circle.prototype.getHeight = function () {
          return this.radius() * 2;
      };
      Circle.prototype.setWidth = function (width) {
          if (this.radius() !== width / 2) {
              this.radius(width / 2);
          }
      };
      Circle.prototype.setHeight = function (height) {
          if (this.radius() !== height / 2) {
              this.radius(height / 2);
          }
      };
      return Circle;
  }(Shape_1.Shape));
  exports.Circle = Circle;
  Circle.prototype._centroid = true;
  Circle.prototype.className = 'Circle';
  Circle.prototype._attrsAffectingSize = ['radius'];
  Global._registerNode(Circle);
  Factory.Factory.addGetterSetter(Circle, 'radius', 0, Validators.getNumberValidator());
  Util.Collection.mapMethods(Circle);
  });

  unwrapExports(Circle_1);
  var Circle_2 = Circle_1.Circle;

  var Ellipse_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var Ellipse = (function (_super) {
      __extends(Ellipse, _super);
      function Ellipse() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Ellipse.prototype._sceneFunc = function (context) {
          var rx = this.radiusX(), ry = this.radiusY();
          context.beginPath();
          context.save();
          if (rx !== ry) {
              context.scale(1, ry / rx);
          }
          context.arc(0, 0, rx, 0, Math.PI * 2, false);
          context.restore();
          context.closePath();
          context.fillStrokeShape(this);
      };
      Ellipse.prototype.getWidth = function () {
          return this.radiusX() * 2;
      };
      Ellipse.prototype.getHeight = function () {
          return this.radiusY() * 2;
      };
      Ellipse.prototype.setWidth = function (width) {
          this.radiusX(width / 2);
      };
      Ellipse.prototype.setHeight = function (height) {
          this.radiusY(height / 2);
      };
      return Ellipse;
  }(Shape_1.Shape));
  exports.Ellipse = Ellipse;
  Ellipse.prototype.className = 'Ellipse';
  Ellipse.prototype._centroid = true;
  Ellipse.prototype._attrsAffectingSize = ['radiusX', 'radiusY'];
  Global._registerNode(Ellipse);
  Factory.Factory.addComponentsGetterSetter(Ellipse, 'radius', ['x', 'y']);
  Factory.Factory.addGetterSetter(Ellipse, 'radiusX', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Ellipse, 'radiusY', 0, Validators.getNumberValidator());
  Util.Collection.mapMethods(Ellipse);
  });

  unwrapExports(Ellipse_1);
  var Ellipse_2 = Ellipse_1.Ellipse;

  var Image_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var Image = (function (_super) {
      __extends(Image, _super);
      function Image() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Image.prototype._useBufferCanvas = function () {
          return _super.prototype._useBufferCanvas.call(this, true);
      };
      Image.prototype._sceneFunc = function (context) {
          var width = this.getWidth(), height = this.getHeight(), image = this.attrs.image, cropWidth, cropHeight, params;
          if (image) {
              cropWidth = this.attrs.cropWidth;
              cropHeight = this.attrs.cropHeight;
              if (cropWidth && cropHeight) {
                  params = [
                      image,
                      this.cropX(),
                      this.cropY(),
                      cropWidth,
                      cropHeight,
                      0,
                      0,
                      width,
                      height,
                  ];
              }
              else {
                  params = [image, 0, 0, width, height];
              }
          }
          if (this.hasFill() || this.hasStroke()) {
              context.beginPath();
              context.rect(0, 0, width, height);
              context.closePath();
              context.fillStrokeShape(this);
          }
          if (image) {
              context.drawImage.apply(context, params);
          }
      };
      Image.prototype._hitFunc = function (context) {
          var width = this.width(), height = this.height();
          context.beginPath();
          context.rect(0, 0, width, height);
          context.closePath();
          context.fillStrokeShape(this);
      };
      Image.prototype.getWidth = function () {
          var _a, _b;
          return (_a = this.attrs.width) !== null && _a !== void 0 ? _a : (((_b = this.image()) === null || _b === void 0 ? void 0 : _b.width) || 0);
      };
      Image.prototype.getHeight = function () {
          var _a, _b;
          return (_a = this.attrs.height) !== null && _a !== void 0 ? _a : (((_b = this.image()) === null || _b === void 0 ? void 0 : _b.height) || 0);
      };
      Image.fromURL = function (url, callback) {
          var img = Util.Util.createImageElement();
          img.onload = function () {
              var image = new Image({
                  image: img,
              });
              callback(image);
          };
          img.crossOrigin = 'Anonymous';
          img.src = url;
      };
      return Image;
  }(Shape_1.Shape));
  exports.Image = Image;
  Image.prototype.className = 'Image';
  Global._registerNode(Image);
  Factory.Factory.addGetterSetter(Image, 'image');
  Factory.Factory.addComponentsGetterSetter(Image, 'crop', ['x', 'y', 'width', 'height']);
  Factory.Factory.addGetterSetter(Image, 'cropX', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Image, 'cropY', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Image, 'cropWidth', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Image, 'cropHeight', 0, Validators.getNumberValidator());
  Util.Collection.mapMethods(Image);
  });

  unwrapExports(Image_1);
  var Image_2 = Image_1.Image;

  var Label_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });






  var ATTR_CHANGE_LIST = [
      'fontFamily',
      'fontSize',
      'fontStyle',
      'padding',
      'lineHeight',
      'text',
      'width'
  ], CHANGE_KONVA = 'Change.konva', NONE = 'none', UP = 'up', RIGHT = 'right', DOWN = 'down', LEFT = 'left', attrChangeListLen = ATTR_CHANGE_LIST.length;
  var Label = (function (_super) {
      __extends(Label, _super);
      function Label(config) {
          var _this = _super.call(this, config) || this;
          _this.on('add.konva', function (evt) {
              this._addListeners(evt.child);
              this._sync();
          });
          return _this;
      }
      Label.prototype.getText = function () {
          return this.find('Text')[0];
      };
      Label.prototype.getTag = function () {
          return this.find('Tag')[0];
      };
      Label.prototype._addListeners = function (text) {
          var that = this, n;
          var func = function () {
              that._sync();
          };
          for (n = 0; n < attrChangeListLen; n++) {
              text.on(ATTR_CHANGE_LIST[n] + CHANGE_KONVA, func);
          }
      };
      Label.prototype.getWidth = function () {
          return this.getText().width();
      };
      Label.prototype.getHeight = function () {
          return this.getText().height();
      };
      Label.prototype._sync = function () {
          var text = this.getText(), tag = this.getTag(), width, height, pointerDirection, pointerWidth, x, y, pointerHeight;
          if (text && tag) {
              width = text.width();
              height = text.height();
              pointerDirection = tag.pointerDirection();
              pointerWidth = tag.pointerWidth();
              pointerHeight = tag.pointerHeight();
              x = 0;
              y = 0;
              switch (pointerDirection) {
                  case UP:
                      x = width / 2;
                      y = -1 * pointerHeight;
                      break;
                  case RIGHT:
                      x = width + pointerWidth;
                      y = height / 2;
                      break;
                  case DOWN:
                      x = width / 2;
                      y = height + pointerHeight;
                      break;
                  case LEFT:
                      x = -1 * pointerWidth;
                      y = height / 2;
                      break;
              }
              tag.setAttrs({
                  x: -1 * x,
                  y: -1 * y,
                  width: width,
                  height: height
              });
              text.setAttrs({
                  x: -1 * x,
                  y: -1 * y
              });
          }
      };
      return Label;
  }(Group_1.Group));
  exports.Label = Label;
  Label.prototype.className = 'Label';
  Global._registerNode(Label);
  Util.Collection.mapMethods(Label);
  var Tag = (function (_super) {
      __extends(Tag, _super);
      function Tag() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Tag.prototype._sceneFunc = function (context) {
          var width = this.width(), height = this.height(), pointerDirection = this.pointerDirection(), pointerWidth = this.pointerWidth(), pointerHeight = this.pointerHeight(), cornerRadius = Math.min(this.cornerRadius(), width / 2, height / 2);
          context.beginPath();
          if (!cornerRadius) {
              context.moveTo(0, 0);
          }
          else {
              context.moveTo(cornerRadius, 0);
          }
          if (pointerDirection === UP) {
              context.lineTo((width - pointerWidth) / 2, 0);
              context.lineTo(width / 2, -1 * pointerHeight);
              context.lineTo((width + pointerWidth) / 2, 0);
          }
          if (!cornerRadius) {
              context.lineTo(width, 0);
          }
          else {
              context.lineTo(width - cornerRadius, 0);
              context.arc(width - cornerRadius, cornerRadius, cornerRadius, (Math.PI * 3) / 2, 0, false);
          }
          if (pointerDirection === RIGHT) {
              context.lineTo(width, (height - pointerHeight) / 2);
              context.lineTo(width + pointerWidth, height / 2);
              context.lineTo(width, (height + pointerHeight) / 2);
          }
          if (!cornerRadius) {
              context.lineTo(width, height);
          }
          else {
              context.lineTo(width, height - cornerRadius);
              context.arc(width - cornerRadius, height - cornerRadius, cornerRadius, 0, Math.PI / 2, false);
          }
          if (pointerDirection === DOWN) {
              context.lineTo((width + pointerWidth) / 2, height);
              context.lineTo(width / 2, height + pointerHeight);
              context.lineTo((width - pointerWidth) / 2, height);
          }
          if (!cornerRadius) {
              context.lineTo(0, height);
          }
          else {
              context.lineTo(cornerRadius, height);
              context.arc(cornerRadius, height - cornerRadius, cornerRadius, Math.PI / 2, Math.PI, false);
          }
          if (pointerDirection === LEFT) {
              context.lineTo(0, (height + pointerHeight) / 2);
              context.lineTo(-1 * pointerWidth, height / 2);
              context.lineTo(0, (height - pointerHeight) / 2);
          }
          if (cornerRadius) {
              context.lineTo(0, cornerRadius);
              context.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, (Math.PI * 3) / 2, false);
          }
          context.closePath();
          context.fillStrokeShape(this);
      };
      Tag.prototype.getSelfRect = function () {
          var x = 0, y = 0, pointerWidth = this.pointerWidth(), pointerHeight = this.pointerHeight(), direction = this.pointerDirection(), width = this.width(), height = this.height();
          if (direction === UP) {
              y -= pointerHeight;
              height += pointerHeight;
          }
          else if (direction === DOWN) {
              height += pointerHeight;
          }
          else if (direction === LEFT) {
              x -= pointerWidth * 1.5;
              width += pointerWidth;
          }
          else if (direction === RIGHT) {
              width += pointerWidth * 1.5;
          }
          return {
              x: x,
              y: y,
              width: width,
              height: height
          };
      };
      return Tag;
  }(Shape_1.Shape));
  exports.Tag = Tag;
  Tag.prototype.className = 'Tag';
  Global._registerNode(Tag);
  Factory.Factory.addGetterSetter(Tag, 'pointerDirection', NONE);
  Factory.Factory.addGetterSetter(Tag, 'pointerWidth', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Tag, 'pointerHeight', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Tag, 'cornerRadius', 0, Validators.getNumberValidator());
  Util.Collection.mapMethods(Tag);
  });

  unwrapExports(Label_1);
  var Label_2 = Label_1.Label;
  var Label_3 = Label_1.Tag;

  var Path_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });




  var Path = (function (_super) {
      __extends(Path, _super);
      function Path(config) {
          var _this = _super.call(this, config) || this;
          _this.dataArray = [];
          _this.pathLength = 0;
          _this.dataArray = Path.parsePathData(_this.data());
          _this.pathLength = 0;
          for (var i = 0; i < _this.dataArray.length; ++i) {
              _this.pathLength += _this.dataArray[i].pathLength;
          }
          _this.on('dataChange.konva', function () {
              this.dataArray = Path.parsePathData(this.data());
              this.pathLength = 0;
              for (var i = 0; i < this.dataArray.length; ++i) {
                  this.pathLength += this.dataArray[i].pathLength;
              }
          });
          return _this;
      }
      Path.prototype._sceneFunc = function (context) {
          var ca = this.dataArray;
          context.beginPath();
          var isClosed = false;
          for (var n = 0; n < ca.length; n++) {
              var c = ca[n].command;
              var p = ca[n].points;
              switch (c) {
                  case 'L':
                      context.lineTo(p[0], p[1]);
                      break;
                  case 'M':
                      context.moveTo(p[0], p[1]);
                      break;
                  case 'C':
                      context.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
                      break;
                  case 'Q':
                      context.quadraticCurveTo(p[0], p[1], p[2], p[3]);
                      break;
                  case 'A':
                      var cx = p[0], cy = p[1], rx = p[2], ry = p[3], theta = p[4], dTheta = p[5], psi = p[6], fs = p[7];
                      var r = rx > ry ? rx : ry;
                      var scaleX = rx > ry ? 1 : rx / ry;
                      var scaleY = rx > ry ? ry / rx : 1;
                      context.translate(cx, cy);
                      context.rotate(psi);
                      context.scale(scaleX, scaleY);
                      context.arc(0, 0, r, theta, theta + dTheta, 1 - fs);
                      context.scale(1 / scaleX, 1 / scaleY);
                      context.rotate(-psi);
                      context.translate(-cx, -cy);
                      break;
                  case 'z':
                      isClosed = true;
                      context.closePath();
                      break;
              }
          }
          if (!isClosed && !this.hasFill()) {
              context.strokeShape(this);
          }
          else {
              context.fillStrokeShape(this);
          }
      };
      Path.prototype.getSelfRect = function () {
          var points = [];
          this.dataArray.forEach(function (data) {
              if (data.command === 'A') {
                  var start = data.points[4];
                  var dTheta = data.points[5];
                  var end = data.points[4] + dTheta;
                  var inc = Math.PI / 180.0;
                  if (Math.abs(start - end) < inc) {
                      inc = Math.abs(start - end);
                  }
                  if (dTheta < 0) {
                      for (var t = start - inc; t > end; t -= inc) {
                          var point = Path.getPointOnEllipticalArc(data.points[0], data.points[1], data.points[2], data.points[3], t, 0);
                          points.push(point.x, point.y);
                      }
                  }
                  else {
                      for (var t = start + inc; t < end; t += inc) {
                          var point = Path.getPointOnEllipticalArc(data.points[0], data.points[1], data.points[2], data.points[3], t, 0);
                          points.push(point.x, point.y);
                      }
                  }
              }
              else if (data.command === 'C') {
                  for (var t = 0.0; t <= 1; t += 0.01) {
                      var point = Path.getPointOnCubicBezier(t, data.start.x, data.start.y, data.points[0], data.points[1], data.points[2], data.points[3], data.points[4], data.points[5]);
                      points.push(point.x, point.y);
                  }
              }
              else {
                  points = points.concat(data.points);
              }
          });
          var minX = points[0];
          var maxX = points[0];
          var minY = points[1];
          var maxY = points[1];
          var x, y;
          for (var i = 0; i < points.length / 2; i++) {
              x = points[i * 2];
              y = points[i * 2 + 1];
              if (!isNaN(x)) {
                  minX = Math.min(minX, x);
                  maxX = Math.max(maxX, x);
              }
              if (!isNaN(y)) {
                  minY = Math.min(minY, y);
                  maxY = Math.max(maxY, y);
              }
          }
          return {
              x: Math.round(minX),
              y: Math.round(minY),
              width: Math.round(maxX - minX),
              height: Math.round(maxY - minY)
          };
      };
      Path.prototype.getLength = function () {
          return this.pathLength;
      };
      Path.prototype.getPointAtLength = function (length) {
          var point, i = 0, ii = this.dataArray.length;
          if (!ii) {
              return null;
          }
          while (i < ii && length > this.dataArray[i].pathLength) {
              length -= this.dataArray[i].pathLength;
              ++i;
          }
          if (i === ii) {
              point = this.dataArray[i - 1].points.slice(-2);
              return {
                  x: point[0],
                  y: point[1]
              };
          }
          if (length < 0.01) {
              point = this.dataArray[i].points.slice(0, 2);
              return {
                  x: point[0],
                  y: point[1]
              };
          }
          var cp = this.dataArray[i];
          var p = cp.points;
          switch (cp.command) {
              case 'L':
                  return Path.getPointOnLine(length, cp.start.x, cp.start.y, p[0], p[1]);
              case 'C':
                  return Path.getPointOnCubicBezier(length / cp.pathLength, cp.start.x, cp.start.y, p[0], p[1], p[2], p[3], p[4], p[5]);
              case 'Q':
                  return Path.getPointOnQuadraticBezier(length / cp.pathLength, cp.start.x, cp.start.y, p[0], p[1], p[2], p[3]);
              case 'A':
                  var cx = p[0], cy = p[1], rx = p[2], ry = p[3], theta = p[4], dTheta = p[5], psi = p[6];
                  theta += (dTheta * length) / cp.pathLength;
                  return Path.getPointOnEllipticalArc(cx, cy, rx, ry, theta, psi);
          }
          return null;
      };
      Path.getLineLength = function (x1, y1, x2, y2) {
          return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
      };
      Path.getPointOnLine = function (dist, P1x, P1y, P2x, P2y, fromX, fromY) {
          if (fromX === undefined) {
              fromX = P1x;
          }
          if (fromY === undefined) {
              fromY = P1y;
          }
          var m = (P2y - P1y) / (P2x - P1x + 0.00000001);
          var run = Math.sqrt((dist * dist) / (1 + m * m));
          if (P2x < P1x) {
              run *= -1;
          }
          var rise = m * run;
          var pt;
          if (P2x === P1x) {
              pt = {
                  x: fromX,
                  y: fromY + rise
              };
          }
          else if ((fromY - P1y) / (fromX - P1x + 0.00000001) === m) {
              pt = {
                  x: fromX + run,
                  y: fromY + rise
              };
          }
          else {
              var ix, iy;
              var len = this.getLineLength(P1x, P1y, P2x, P2y);
              if (len < 0.00000001) {
                  return undefined;
              }
              var u = (fromX - P1x) * (P2x - P1x) + (fromY - P1y) * (P2y - P1y);
              u = u / (len * len);
              ix = P1x + u * (P2x - P1x);
              iy = P1y + u * (P2y - P1y);
              var pRise = this.getLineLength(fromX, fromY, ix, iy);
              var pRun = Math.sqrt(dist * dist - pRise * pRise);
              run = Math.sqrt((pRun * pRun) / (1 + m * m));
              if (P2x < P1x) {
                  run *= -1;
              }
              rise = m * run;
              pt = {
                  x: ix + run,
                  y: iy + rise
              };
          }
          return pt;
      };
      Path.getPointOnCubicBezier = function (pct, P1x, P1y, P2x, P2y, P3x, P3y, P4x, P4y) {
          function CB1(t) {
              return t * t * t;
          }
          function CB2(t) {
              return 3 * t * t * (1 - t);
          }
          function CB3(t) {
              return 3 * t * (1 - t) * (1 - t);
          }
          function CB4(t) {
              return (1 - t) * (1 - t) * (1 - t);
          }
          var x = P4x * CB1(pct) + P3x * CB2(pct) + P2x * CB3(pct) + P1x * CB4(pct);
          var y = P4y * CB1(pct) + P3y * CB2(pct) + P2y * CB3(pct) + P1y * CB4(pct);
          return {
              x: x,
              y: y
          };
      };
      Path.getPointOnQuadraticBezier = function (pct, P1x, P1y, P2x, P2y, P3x, P3y) {
          function QB1(t) {
              return t * t;
          }
          function QB2(t) {
              return 2 * t * (1 - t);
          }
          function QB3(t) {
              return (1 - t) * (1 - t);
          }
          var x = P3x * QB1(pct) + P2x * QB2(pct) + P1x * QB3(pct);
          var y = P3y * QB1(pct) + P2y * QB2(pct) + P1y * QB3(pct);
          return {
              x: x,
              y: y
          };
      };
      Path.getPointOnEllipticalArc = function (cx, cy, rx, ry, theta, psi) {
          var cosPsi = Math.cos(psi), sinPsi = Math.sin(psi);
          var pt = {
              x: rx * Math.cos(theta),
              y: ry * Math.sin(theta)
          };
          return {
              x: cx + (pt.x * cosPsi - pt.y * sinPsi),
              y: cy + (pt.x * sinPsi + pt.y * cosPsi)
          };
      };
      Path.parsePathData = function (data) {
          if (!data) {
              return [];
          }
          var cs = data;
          var cc = [
              'm',
              'M',
              'l',
              'L',
              'v',
              'V',
              'h',
              'H',
              'z',
              'Z',
              'c',
              'C',
              'q',
              'Q',
              't',
              'T',
              's',
              'S',
              'a',
              'A'
          ];
          cs = cs.replace(new RegExp(' ', 'g'), ',');
          for (var n = 0; n < cc.length; n++) {
              cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
          }
          var arr = cs.split('|');
          var ca = [];
          var coords = [];
          var cpx = 0;
          var cpy = 0;
          var re = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi;
          var match;
          for (n = 1; n < arr.length; n++) {
              var str = arr[n];
              var c = str.charAt(0);
              str = str.slice(1);
              coords.length = 0;
              while ((match = re.exec(str))) {
                  coords.push(match[0]);
              }
              var p = [];
              for (var j = 0, jlen = coords.length; j < jlen; j++) {
                  var parsed = parseFloat(coords[j]);
                  if (!isNaN(parsed)) {
                      p.push(parsed);
                  }
                  else {
                      p.push(0);
                  }
              }
              while (p.length > 0) {
                  if (isNaN(p[0])) {
                      break;
                  }
                  var cmd = null;
                  var points = [];
                  var startX = cpx, startY = cpy;
                  var prevCmd, ctlPtx, ctlPty;
                  var rx, ry, psi, fa, fs, x1, y1;
                  switch (c) {
                      case 'l':
                          cpx += p.shift();
                          cpy += p.shift();
                          cmd = 'L';
                          points.push(cpx, cpy);
                          break;
                      case 'L':
                          cpx = p.shift();
                          cpy = p.shift();
                          points.push(cpx, cpy);
                          break;
                      case 'm':
                          var dx = p.shift();
                          var dy = p.shift();
                          cpx += dx;
                          cpy += dy;
                          cmd = 'M';
                          if (ca.length > 2 && ca[ca.length - 1].command === 'z') {
                              for (var idx = ca.length - 2; idx >= 0; idx--) {
                                  if (ca[idx].command === 'M') {
                                      cpx = ca[idx].points[0] + dx;
                                      cpy = ca[idx].points[1] + dy;
                                      break;
                                  }
                              }
                          }
                          points.push(cpx, cpy);
                          c = 'l';
                          break;
                      case 'M':
                          cpx = p.shift();
                          cpy = p.shift();
                          cmd = 'M';
                          points.push(cpx, cpy);
                          c = 'L';
                          break;
                      case 'h':
                          cpx += p.shift();
                          cmd = 'L';
                          points.push(cpx, cpy);
                          break;
                      case 'H':
                          cpx = p.shift();
                          cmd = 'L';
                          points.push(cpx, cpy);
                          break;
                      case 'v':
                          cpy += p.shift();
                          cmd = 'L';
                          points.push(cpx, cpy);
                          break;
                      case 'V':
                          cpy = p.shift();
                          cmd = 'L';
                          points.push(cpx, cpy);
                          break;
                      case 'C':
                          points.push(p.shift(), p.shift(), p.shift(), p.shift());
                          cpx = p.shift();
                          cpy = p.shift();
                          points.push(cpx, cpy);
                          break;
                      case 'c':
                          points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift());
                          cpx += p.shift();
                          cpy += p.shift();
                          cmd = 'C';
                          points.push(cpx, cpy);
                          break;
                      case 'S':
                          ctlPtx = cpx;
                          ctlPty = cpy;
                          prevCmd = ca[ca.length - 1];
                          if (prevCmd.command === 'C') {
                              ctlPtx = cpx + (cpx - prevCmd.points[2]);
                              ctlPty = cpy + (cpy - prevCmd.points[3]);
                          }
                          points.push(ctlPtx, ctlPty, p.shift(), p.shift());
                          cpx = p.shift();
                          cpy = p.shift();
                          cmd = 'C';
                          points.push(cpx, cpy);
                          break;
                      case 's':
                          ctlPtx = cpx;
                          ctlPty = cpy;
                          prevCmd = ca[ca.length - 1];
                          if (prevCmd.command === 'C') {
                              ctlPtx = cpx + (cpx - prevCmd.points[2]);
                              ctlPty = cpy + (cpy - prevCmd.points[3]);
                          }
                          points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift());
                          cpx += p.shift();
                          cpy += p.shift();
                          cmd = 'C';
                          points.push(cpx, cpy);
                          break;
                      case 'Q':
                          points.push(p.shift(), p.shift());
                          cpx = p.shift();
                          cpy = p.shift();
                          points.push(cpx, cpy);
                          break;
                      case 'q':
                          points.push(cpx + p.shift(), cpy + p.shift());
                          cpx += p.shift();
                          cpy += p.shift();
                          cmd = 'Q';
                          points.push(cpx, cpy);
                          break;
                      case 'T':
                          ctlPtx = cpx;
                          ctlPty = cpy;
                          prevCmd = ca[ca.length - 1];
                          if (prevCmd.command === 'Q') {
                              ctlPtx = cpx + (cpx - prevCmd.points[0]);
                              ctlPty = cpy + (cpy - prevCmd.points[1]);
                          }
                          cpx = p.shift();
                          cpy = p.shift();
                          cmd = 'Q';
                          points.push(ctlPtx, ctlPty, cpx, cpy);
                          break;
                      case 't':
                          ctlPtx = cpx;
                          ctlPty = cpy;
                          prevCmd = ca[ca.length - 1];
                          if (prevCmd.command === 'Q') {
                              ctlPtx = cpx + (cpx - prevCmd.points[0]);
                              ctlPty = cpy + (cpy - prevCmd.points[1]);
                          }
                          cpx += p.shift();
                          cpy += p.shift();
                          cmd = 'Q';
                          points.push(ctlPtx, ctlPty, cpx, cpy);
                          break;
                      case 'A':
                          rx = p.shift();
                          ry = p.shift();
                          psi = p.shift();
                          fa = p.shift();
                          fs = p.shift();
                          x1 = cpx;
                          y1 = cpy;
                          cpx = p.shift();
                          cpy = p.shift();
                          cmd = 'A';
                          points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                          break;
                      case 'a':
                          rx = p.shift();
                          ry = p.shift();
                          psi = p.shift();
                          fa = p.shift();
                          fs = p.shift();
                          x1 = cpx;
                          y1 = cpy;
                          cpx += p.shift();
                          cpy += p.shift();
                          cmd = 'A';
                          points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                          break;
                  }
                  ca.push({
                      command: cmd || c,
                      points: points,
                      start: {
                          x: startX,
                          y: startY
                      },
                      pathLength: this.calcLength(startX, startY, cmd || c, points)
                  });
              }
              if (c === 'z' || c === 'Z') {
                  ca.push({
                      command: 'z',
                      points: [],
                      start: undefined,
                      pathLength: 0
                  });
              }
          }
          return ca;
      };
      Path.calcLength = function (x, y, cmd, points) {
          var len, p1, p2, t;
          var path = Path;
          switch (cmd) {
              case 'L':
                  return path.getLineLength(x, y, points[0], points[1]);
              case 'C':
                  len = 0.0;
                  p1 = path.getPointOnCubicBezier(0, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
                  for (t = 0.01; t <= 1; t += 0.01) {
                      p2 = path.getPointOnCubicBezier(t, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
                      len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                      p1 = p2;
                  }
                  return len;
              case 'Q':
                  len = 0.0;
                  p1 = path.getPointOnQuadraticBezier(0, x, y, points[0], points[1], points[2], points[3]);
                  for (t = 0.01; t <= 1; t += 0.01) {
                      p2 = path.getPointOnQuadraticBezier(t, x, y, points[0], points[1], points[2], points[3]);
                      len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                      p1 = p2;
                  }
                  return len;
              case 'A':
                  len = 0.0;
                  var start = points[4];
                  var dTheta = points[5];
                  var end = points[4] + dTheta;
                  var inc = Math.PI / 180.0;
                  if (Math.abs(start - end) < inc) {
                      inc = Math.abs(start - end);
                  }
                  p1 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], start, 0);
                  if (dTheta < 0) {
                      for (t = start - inc; t > end; t -= inc) {
                          p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
                          len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                          p1 = p2;
                      }
                  }
                  else {
                      for (t = start + inc; t < end; t += inc) {
                          p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
                          len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                          p1 = p2;
                      }
                  }
                  p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], end, 0);
                  len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                  return len;
          }
          return 0;
      };
      Path.convertEndpointToCenterParameterization = function (x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {
          var psi = psiDeg * (Math.PI / 180.0);
          var xp = (Math.cos(psi) * (x1 - x2)) / 2.0 + (Math.sin(psi) * (y1 - y2)) / 2.0;
          var yp = (-1 * Math.sin(psi) * (x1 - x2)) / 2.0 +
              (Math.cos(psi) * (y1 - y2)) / 2.0;
          var lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);
          if (lambda > 1) {
              rx *= Math.sqrt(lambda);
              ry *= Math.sqrt(lambda);
          }
          var f = Math.sqrt((rx * rx * (ry * ry) - rx * rx * (yp * yp) - ry * ry * (xp * xp)) /
              (rx * rx * (yp * yp) + ry * ry * (xp * xp)));
          if (fa === fs) {
              f *= -1;
          }
          if (isNaN(f)) {
              f = 0;
          }
          var cxp = (f * rx * yp) / ry;
          var cyp = (f * -ry * xp) / rx;
          var cx = (x1 + x2) / 2.0 + Math.cos(psi) * cxp - Math.sin(psi) * cyp;
          var cy = (y1 + y2) / 2.0 + Math.sin(psi) * cxp + Math.cos(psi) * cyp;
          var vMag = function (v) {
              return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
          };
          var vRatio = function (u, v) {
              return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
          };
          var vAngle = function (u, v) {
              return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
          };
          var theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);
          var u = [(xp - cxp) / rx, (yp - cyp) / ry];
          var v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
          var dTheta = vAngle(u, v);
          if (vRatio(u, v) <= -1) {
              dTheta = Math.PI;
          }
          if (vRatio(u, v) >= 1) {
              dTheta = 0;
          }
          if (fs === 0 && dTheta > 0) {
              dTheta = dTheta - 2 * Math.PI;
          }
          if (fs === 1 && dTheta < 0) {
              dTheta = dTheta + 2 * Math.PI;
          }
          return [cx, cy, rx, ry, theta, dTheta, psi, fs];
      };
      return Path;
  }(Shape_1.Shape));
  exports.Path = Path;
  Path.prototype.className = 'Path';
  Path.prototype._attrsAffectingSize = ['data'];
  Global._registerNode(Path);
  Factory.Factory.addGetterSetter(Path, 'data');
  Util.Collection.mapMethods(Path);
  });

  unwrapExports(Path_1);
  var Path_2 = Path_1.Path;

  var Rect_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });




  var Rect = (function (_super) {
      __extends(Rect, _super);
      function Rect() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Rect.prototype._sceneFunc = function (context) {
          var cornerRadius = this.cornerRadius(), width = this.width(), height = this.height();
          context.beginPath();
          if (!cornerRadius) {
              context.rect(0, 0, width, height);
          }
          else {
              var topLeft = 0;
              var topRight = 0;
              var bottomLeft = 0;
              var bottomRight = 0;
              if (typeof cornerRadius === 'number') {
                  topLeft = topRight = bottomLeft = bottomRight = Math.min(cornerRadius, width / 2, height / 2);
              }
              else {
                  topLeft = Math.min(cornerRadius[0], width / 2, height / 2);
                  topRight = Math.min(cornerRadius[1], width / 2, height / 2);
                  bottomRight = Math.min(cornerRadius[2], width / 2, height / 2);
                  bottomLeft = Math.min(cornerRadius[3], width / 2, height / 2);
              }
              context.moveTo(topLeft, 0);
              context.lineTo(width - topRight, 0);
              context.arc(width - topRight, topRight, topRight, (Math.PI * 3) / 2, 0, false);
              context.lineTo(width, height - bottomRight);
              context.arc(width - bottomRight, height - bottomRight, bottomRight, 0, Math.PI / 2, false);
              context.lineTo(bottomLeft, height);
              context.arc(bottomLeft, height - bottomLeft, bottomLeft, Math.PI / 2, Math.PI, false);
              context.lineTo(0, topLeft);
              context.arc(topLeft, topLeft, topLeft, Math.PI, (Math.PI * 3) / 2, false);
          }
          context.closePath();
          context.fillStrokeShape(this);
      };
      return Rect;
  }(Shape_1.Shape));
  exports.Rect = Rect;
  Rect.prototype.className = 'Rect';
  Global._registerNode(Rect);
  Factory.Factory.addGetterSetter(Rect, 'cornerRadius', 0);
  Util.Collection.mapMethods(Rect);
  });

  unwrapExports(Rect_1);
  var Rect_2 = Rect_1.Rect;

  var RegularPolygon_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var RegularPolygon = (function (_super) {
      __extends(RegularPolygon, _super);
      function RegularPolygon() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      RegularPolygon.prototype._sceneFunc = function (context) {
          var sides = this.sides(), radius = this.radius(), n, x, y;
          context.beginPath();
          context.moveTo(0, 0 - radius);
          for (n = 1; n < sides; n++) {
              x = radius * Math.sin((n * 2 * Math.PI) / sides);
              y = -1 * radius * Math.cos((n * 2 * Math.PI) / sides);
              context.lineTo(x, y);
          }
          context.closePath();
          context.fillStrokeShape(this);
      };
      RegularPolygon.prototype.getWidth = function () {
          return this.radius() * 2;
      };
      RegularPolygon.prototype.getHeight = function () {
          return this.radius() * 2;
      };
      RegularPolygon.prototype.setWidth = function (width) {
          this.radius(width / 2);
      };
      RegularPolygon.prototype.setHeight = function (height) {
          this.radius(height / 2);
      };
      return RegularPolygon;
  }(Shape_1.Shape));
  exports.RegularPolygon = RegularPolygon;
  RegularPolygon.prototype.className = 'RegularPolygon';
  RegularPolygon.prototype._centroid = true;
  RegularPolygon.prototype._attrsAffectingSize = ['radius'];
  Global._registerNode(RegularPolygon);
  Factory.Factory.addGetterSetter(RegularPolygon, 'radius', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(RegularPolygon, 'sides', 0, Validators.getNumberValidator());
  Util.Collection.mapMethods(RegularPolygon);
  });

  unwrapExports(RegularPolygon_1);
  var RegularPolygon_2 = RegularPolygon_1.RegularPolygon;

  var Ring_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var PIx2 = Math.PI * 2;
  var Ring = (function (_super) {
      __extends(Ring, _super);
      function Ring() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Ring.prototype._sceneFunc = function (context) {
          context.beginPath();
          context.arc(0, 0, this.innerRadius(), 0, PIx2, false);
          context.moveTo(this.outerRadius(), 0);
          context.arc(0, 0, this.outerRadius(), PIx2, 0, true);
          context.closePath();
          context.fillStrokeShape(this);
      };
      Ring.prototype.getWidth = function () {
          return this.outerRadius() * 2;
      };
      Ring.prototype.getHeight = function () {
          return this.outerRadius() * 2;
      };
      Ring.prototype.setWidth = function (width) {
          this.outerRadius(width / 2);
      };
      Ring.prototype.setHeight = function (height) {
          this.outerRadius(height / 2);
      };
      return Ring;
  }(Shape_1.Shape));
  exports.Ring = Ring;
  Ring.prototype.className = 'Ring';
  Ring.prototype._centroid = true;
  Ring.prototype._attrsAffectingSize = ['innerRadius', 'outerRadius'];
  Global._registerNode(Ring);
  Factory.Factory.addGetterSetter(Ring, 'innerRadius', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Ring, 'outerRadius', 0, Validators.getNumberValidator());
  Util.Collection.mapMethods(Ring);
  });

  unwrapExports(Ring_1);
  var Ring_2 = Ring_1.Ring;

  var Sprite_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });






  var Sprite = (function (_super) {
      __extends(Sprite, _super);
      function Sprite(config) {
          var _this = _super.call(this, config) || this;
          _this._updated = true;
          _this.anim = new Animation_1.Animation(function () {
              var updated = _this._updated;
              _this._updated = false;
              return updated;
          });
          _this.on('animationChange.konva', function () {
              this.frameIndex(0);
          });
          _this.on('frameIndexChange.konva', function () {
              this._updated = true;
          });
          _this.on('frameRateChange.konva', function () {
              if (!this.anim.isRunning()) {
                  return;
              }
              clearInterval(this.interval);
              this._setInterval();
          });
          return _this;
      }
      Sprite.prototype._sceneFunc = function (context) {
          var anim = this.animation(), index = this.frameIndex(), ix4 = index * 4, set = this.animations()[anim], offsets = this.frameOffsets(), x = set[ix4 + 0], y = set[ix4 + 1], width = set[ix4 + 2], height = set[ix4 + 3], image = this.image();
          if (this.hasFill() || this.hasStroke()) {
              context.beginPath();
              context.rect(0, 0, width, height);
              context.closePath();
              context.fillStrokeShape(this);
          }
          if (image) {
              if (offsets) {
                  var offset = offsets[anim], ix2 = index * 2;
                  context.drawImage(image, x, y, width, height, offset[ix2 + 0], offset[ix2 + 1], width, height);
              }
              else {
                  context.drawImage(image, x, y, width, height, 0, 0, width, height);
              }
          }
      };
      Sprite.prototype._hitFunc = function (context) {
          var anim = this.animation(), index = this.frameIndex(), ix4 = index * 4, set = this.animations()[anim], offsets = this.frameOffsets(), width = set[ix4 + 2], height = set[ix4 + 3];
          context.beginPath();
          if (offsets) {
              var offset = offsets[anim];
              var ix2 = index * 2;
              context.rect(offset[ix2 + 0], offset[ix2 + 1], width, height);
          }
          else {
              context.rect(0, 0, width, height);
          }
          context.closePath();
          context.fillShape(this);
      };
      Sprite.prototype._useBufferCanvas = function () {
          return _super.prototype._useBufferCanvas.call(this, true);
      };
      Sprite.prototype._setInterval = function () {
          var that = this;
          this.interval = setInterval(function () {
              that._updateIndex();
          }, 1000 / this.frameRate());
      };
      Sprite.prototype.start = function () {
          if (this.isRunning()) {
              return;
          }
          var layer = this.getLayer();
          this.anim.setLayers(layer);
          this._setInterval();
          this.anim.start();
      };
      Sprite.prototype.stop = function () {
          this.anim.stop();
          clearInterval(this.interval);
      };
      Sprite.prototype.isRunning = function () {
          return this.anim.isRunning();
      };
      Sprite.prototype._updateIndex = function () {
          var index = this.frameIndex(), animation = this.animation(), animations = this.animations(), anim = animations[animation], len = anim.length / 4;
          if (index < len - 1) {
              this.frameIndex(index + 1);
          }
          else {
              this.frameIndex(0);
          }
      };
      return Sprite;
  }(Shape_1.Shape));
  exports.Sprite = Sprite;
  Sprite.prototype.className = 'Sprite';
  Global._registerNode(Sprite);
  Factory.Factory.addGetterSetter(Sprite, 'animation');
  Factory.Factory.addGetterSetter(Sprite, 'animations');
  Factory.Factory.addGetterSetter(Sprite, 'frameOffsets');
  Factory.Factory.addGetterSetter(Sprite, 'image');
  Factory.Factory.addGetterSetter(Sprite, 'frameIndex', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Sprite, 'frameRate', 17, Validators.getNumberValidator());
  Factory.Factory.backCompat(Sprite, {
      index: 'frameIndex',
      getIndex: 'getFrameIndex',
      setIndex: 'setFrameIndex',
  });
  Util.Collection.mapMethods(Sprite);
  });

  unwrapExports(Sprite_1);
  var Sprite_2 = Sprite_1.Sprite;

  var Star_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var Star = (function (_super) {
      __extends(Star, _super);
      function Star() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Star.prototype._sceneFunc = function (context) {
          var innerRadius = this.innerRadius(), outerRadius = this.outerRadius(), numPoints = this.numPoints();
          context.beginPath();
          context.moveTo(0, 0 - outerRadius);
          for (var n = 1; n < numPoints * 2; n++) {
              var radius = n % 2 === 0 ? outerRadius : innerRadius;
              var x = radius * Math.sin((n * Math.PI) / numPoints);
              var y = -1 * radius * Math.cos((n * Math.PI) / numPoints);
              context.lineTo(x, y);
          }
          context.closePath();
          context.fillStrokeShape(this);
      };
      Star.prototype.getWidth = function () {
          return this.outerRadius() * 2;
      };
      Star.prototype.getHeight = function () {
          return this.outerRadius() * 2;
      };
      Star.prototype.setWidth = function (width) {
          this.outerRadius(width / 2);
      };
      Star.prototype.setHeight = function (height) {
          this.outerRadius(height / 2);
      };
      return Star;
  }(Shape_1.Shape));
  exports.Star = Star;
  Star.prototype.className = 'Star';
  Star.prototype._centroid = true;
  Star.prototype._attrsAffectingSize = ['innerRadius', 'outerRadius'];
  Global._registerNode(Star);
  Factory.Factory.addGetterSetter(Star, 'numPoints', 5, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Star, 'innerRadius', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Star, 'outerRadius', 0, Validators.getNumberValidator());
  Util.Collection.mapMethods(Star);
  });

  unwrapExports(Star_1);
  var Star_2 = Star_1.Star;

  var Text_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var Global_2 = Global;
  var AUTO = 'auto', CENTER = 'center', JUSTIFY = 'justify', CHANGE_KONVA = 'Change.konva', CONTEXT_2D = '2d', DASH = '-', LEFT = 'left', TEXT = 'text', TEXT_UPPER = 'Text', TOP = 'top', BOTTOM = 'bottom', MIDDLE = 'middle', NORMAL = 'normal', PX_SPACE = 'px ', SPACE = ' ', RIGHT = 'right', WORD = 'word', CHAR = 'char', NONE = 'none', ELLIPSIS = '…', ATTR_CHANGE_LIST = [
      'fontFamily',
      'fontSize',
      'fontStyle',
      'fontVariant',
      'padding',
      'align',
      'verticalAlign',
      'lineHeight',
      'text',
      'width',
      'height',
      'wrap',
      'ellipsis',
      'letterSpacing',
  ], attrChangeListLen = ATTR_CHANGE_LIST.length;
  function normalizeFontFamily(fontFamily) {
      return fontFamily
          .split(',')
          .map(function (family) {
          family = family.trim();
          var hasSpace = family.indexOf(' ') >= 0;
          var hasQuotes = family.indexOf('"') >= 0 || family.indexOf("'") >= 0;
          if (hasSpace && !hasQuotes) {
              family = "\"" + family + "\"";
          }
          return family;
      })
          .join(', ');
  }
  var dummyContext;
  function getDummyContext() {
      if (dummyContext) {
          return dummyContext;
      }
      dummyContext = Util.Util.createCanvasElement().getContext(CONTEXT_2D);
      return dummyContext;
  }
  function _fillFunc(context) {
      context.fillText(this._partialText, this._partialTextX, this._partialTextY);
  }
  function _strokeFunc(context) {
      context.strokeText(this._partialText, this._partialTextX, this._partialTextY);
  }
  function checkDefaultFill(config) {
      config = config || {};
      if (!config.fillLinearGradientColorStops &&
          !config.fillRadialGradientColorStops &&
          !config.fillPatternImage) {
          config.fill = config.fill || 'black';
      }
      return config;
  }
  var Text = (function (_super) {
      __extends(Text, _super);
      function Text(config) {
          var _this = _super.call(this, checkDefaultFill(config)) || this;
          _this._partialTextX = 0;
          _this._partialTextY = 0;
          for (var n = 0; n < attrChangeListLen; n++) {
              _this.on(ATTR_CHANGE_LIST[n] + CHANGE_KONVA, _this._setTextData);
          }
          _this._setTextData();
          return _this;
      }
      Text.prototype._sceneFunc = function (context) {
          var padding = this.padding(), fontSize = this.fontSize(), lineHeightPx = this.lineHeight() * fontSize, textArr = this.textArr, textArrLen = textArr.length, verticalAlign = this.verticalAlign(), alignY = 0, align = this.align(), totalWidth = this.getWidth(), letterSpacing = this.letterSpacing(), fill = this.fill(), textDecoration = this.textDecoration(), shouldUnderline = textDecoration.indexOf('underline') !== -1, shouldLineThrough = textDecoration.indexOf('line-through') !== -1, n;
          var translateY = 0;
          var translateY = lineHeightPx / 2;
          var lineTranslateX = 0;
          var lineTranslateY = 0;
          context.setAttr('font', this._getContextFont());
          context.setAttr('textBaseline', MIDDLE);
          context.setAttr('textAlign', LEFT);
          if (verticalAlign === MIDDLE) {
              alignY = (this.getHeight() - textArrLen * lineHeightPx - padding * 2) / 2;
          }
          else if (verticalAlign === BOTTOM) {
              alignY = this.getHeight() - textArrLen * lineHeightPx - padding * 2;
          }
          context.translate(padding, alignY + padding);
          for (n = 0; n < textArrLen; n++) {
              var lineTranslateX = 0;
              var lineTranslateY = 0;
              var obj = textArr[n], text = obj.text, width = obj.width, lastLine = n !== textArrLen - 1, spacesNumber, oneWord, lineWidth;
              context.save();
              if (align === RIGHT) {
                  lineTranslateX += totalWidth - width - padding * 2;
              }
              else if (align === CENTER) {
                  lineTranslateX += (totalWidth - width - padding * 2) / 2;
              }
              if (shouldUnderline) {
                  context.save();
                  context.beginPath();
                  context.moveTo(lineTranslateX, translateY + lineTranslateY + Math.round(fontSize / 2));
                  spacesNumber = text.split(' ').length - 1;
                  oneWord = spacesNumber === 0;
                  lineWidth =
                      align === JUSTIFY && lastLine && !oneWord
                          ? totalWidth - padding * 2
                          : width;
                  context.lineTo(lineTranslateX + Math.round(lineWidth), translateY + lineTranslateY + Math.round(fontSize / 2));
                  context.lineWidth = fontSize / 15;
                  context.strokeStyle = fill;
                  context.stroke();
                  context.restore();
              }
              if (shouldLineThrough) {
                  context.save();
                  context.beginPath();
                  context.moveTo(lineTranslateX, translateY + lineTranslateY);
                  spacesNumber = text.split(' ').length - 1;
                  oneWord = spacesNumber === 0;
                  lineWidth =
                      align === JUSTIFY && lastLine && !oneWord
                          ? totalWidth - padding * 2
                          : width;
                  context.lineTo(lineTranslateX + Math.round(lineWidth), translateY + lineTranslateY);
                  context.lineWidth = fontSize / 15;
                  context.strokeStyle = fill;
                  context.stroke();
                  context.restore();
              }
              if (letterSpacing !== 0 || align === JUSTIFY) {
                  spacesNumber = text.split(' ').length - 1;
                  for (var li = 0; li < text.length; li++) {
                      var letter = text[li];
                      if (letter === ' ' && n !== textArrLen - 1 && align === JUSTIFY) {
                          lineTranslateX += (totalWidth - padding * 2 - width) / spacesNumber;
                      }
                      this._partialTextX = lineTranslateX;
                      this._partialTextY = translateY + lineTranslateY;
                      this._partialText = letter;
                      context.fillStrokeShape(this);
                      lineTranslateX += this.measureSize(letter).width + letterSpacing;
                  }
              }
              else {
                  this._partialTextX = lineTranslateX;
                  this._partialTextY = translateY + lineTranslateY;
                  this._partialText = text;
                  context.fillStrokeShape(this);
              }
              context.restore();
              if (textArrLen > 1) {
                  translateY += lineHeightPx;
              }
          }
      };
      Text.prototype._hitFunc = function (context) {
          var width = this.getWidth(), height = this.getHeight();
          context.beginPath();
          context.rect(0, 0, width, height);
          context.closePath();
          context.fillStrokeShape(this);
      };
      Text.prototype.setText = function (text) {
          var str = Util.Util._isString(text)
              ? text
              : text === null || text === undefined
                  ? ''
                  : text + '';
          this._setAttr(TEXT, str);
          return this;
      };
      Text.prototype.getWidth = function () {
          var isAuto = this.attrs.width === AUTO || this.attrs.width === undefined;
          return isAuto ? this.getTextWidth() + this.padding() * 2 : this.attrs.width;
      };
      Text.prototype.getHeight = function () {
          var isAuto = this.attrs.height === AUTO || this.attrs.height === undefined;
          return isAuto
              ? this.fontSize() * this.textArr.length * this.lineHeight() +
                  this.padding() * 2
              : this.attrs.height;
      };
      Text.prototype.getTextWidth = function () {
          return this.textWidth;
      };
      Text.prototype.getTextHeight = function () {
          Util.Util.warn('text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height.');
          return this.textHeight;
      };
      Text.prototype.measureSize = function (text) {
          var _context = getDummyContext(), fontSize = this.fontSize(), metrics;
          _context.save();
          _context.font = this._getContextFont();
          metrics = _context.measureText(text);
          _context.restore();
          return {
              width: metrics.width,
              height: fontSize,
          };
      };
      Text.prototype._getContextFont = function () {
          if (Global.Konva.UA.isIE) {
              return (this.fontStyle() +
                  SPACE +
                  this.fontSize() +
                  PX_SPACE +
                  this.fontFamily());
          }
          return (this.fontStyle() +
              SPACE +
              this.fontVariant() +
              SPACE +
              (this.fontSize() + PX_SPACE) +
              normalizeFontFamily(this.fontFamily()));
      };
      Text.prototype._addTextLine = function (line) {
          if (this.align() === JUSTIFY) {
              line = line.trim();
          }
          var width = this._getTextWidth(line);
          return this.textArr.push({ text: line, width: width });
      };
      Text.prototype._getTextWidth = function (text) {
          var letterSpacing = this.letterSpacing();
          var length = text.length;
          return (getDummyContext().measureText(text).width +
              (length ? letterSpacing * (length - 1) : 0));
      };
      Text.prototype._setTextData = function () {
          var lines = this.text().split('\n'), fontSize = +this.fontSize(), textWidth = 0, lineHeightPx = this.lineHeight() * fontSize, width = this.attrs.width, height = this.attrs.height, fixedWidth = width !== AUTO && width !== undefined, fixedHeight = height !== AUTO && height !== undefined, padding = this.padding(), maxWidth = width - padding * 2, maxHeightPx = height - padding * 2, currentHeightPx = 0, wrap = this.wrap(), shouldWrap = wrap !== NONE, wrapAtWord = wrap !== CHAR && shouldWrap, shouldAddEllipsis = this.ellipsis() && !shouldWrap;
          this.textArr = [];
          getDummyContext().font = this._getContextFont();
          var additionalWidth = shouldAddEllipsis ? this._getTextWidth(ELLIPSIS) : 0;
          for (var i = 0, max = lines.length; i < max; ++i) {
              var line = lines[i];
              var lineWidth = this._getTextWidth(line);
              if (fixedWidth && lineWidth > maxWidth) {
                  while (line.length > 0) {
                      var low = 0, high = line.length, match = '', matchWidth = 0;
                      while (low < high) {
                          var mid = (low + high) >>> 1, substr = line.slice(0, mid + 1), substrWidth = this._getTextWidth(substr) + additionalWidth;
                          if (substrWidth <= maxWidth) {
                              low = mid + 1;
                              match = substr + (shouldAddEllipsis ? ELLIPSIS : '');
                              matchWidth = substrWidth;
                          }
                          else {
                              high = mid;
                          }
                      }
                      if (match) {
                          if (wrapAtWord) {
                              var wrapIndex;
                              var nextChar = line[match.length];
                              var nextIsSpaceOrDash = nextChar === SPACE || nextChar === DASH;
                              if (nextIsSpaceOrDash && matchWidth <= maxWidth) {
                                  wrapIndex = match.length;
                              }
                              else {
                                  wrapIndex =
                                      Math.max(match.lastIndexOf(SPACE), match.lastIndexOf(DASH)) +
                                          1;
                              }
                              if (wrapIndex > 0) {
                                  low = wrapIndex;
                                  match = match.slice(0, low);
                                  matchWidth = this._getTextWidth(match);
                              }
                          }
                          match = match.trimRight();
                          this._addTextLine(match);
                          textWidth = Math.max(textWidth, matchWidth);
                          currentHeightPx += lineHeightPx;
                          if (!shouldWrap ||
                              (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx)) {
                              break;
                          }
                          line = line.slice(low);
                          line = line.trimLeft();
                          if (line.length > 0) {
                              lineWidth = this._getTextWidth(line);
                              if (lineWidth <= maxWidth) {
                                  this._addTextLine(line);
                                  currentHeightPx += lineHeightPx;
                                  textWidth = Math.max(textWidth, lineWidth);
                                  break;
                              }
                          }
                      }
                      else {
                          break;
                      }
                  }
              }
              else {
                  this._addTextLine(line);
                  currentHeightPx += lineHeightPx;
                  textWidth = Math.max(textWidth, lineWidth);
              }
              if (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx) {
                  break;
              }
          }
          this.textHeight = fontSize;
          this.textWidth = textWidth;
      };
      Text.prototype.getStrokeScaleEnabled = function () {
          return true;
      };
      return Text;
  }(Shape_1.Shape));
  exports.Text = Text;
  Text.prototype._fillFunc = _fillFunc;
  Text.prototype._strokeFunc = _strokeFunc;
  Text.prototype.className = TEXT_UPPER;
  Text.prototype._attrsAffectingSize = [
      'text',
      'fontSize',
      'padding',
      'wrap',
      'lineHeight',
  ];
  Global_2._registerNode(Text);
  Factory.Factory.overWriteSetter(Text, 'width', Validators.getNumberOrAutoValidator());
  Factory.Factory.overWriteSetter(Text, 'height', Validators.getNumberOrAutoValidator());
  Factory.Factory.addGetterSetter(Text, 'fontFamily', 'Arial');
  Factory.Factory.addGetterSetter(Text, 'fontSize', 12, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Text, 'fontStyle', NORMAL);
  Factory.Factory.addGetterSetter(Text, 'fontVariant', NORMAL);
  Factory.Factory.addGetterSetter(Text, 'padding', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Text, 'align', LEFT);
  Factory.Factory.addGetterSetter(Text, 'verticalAlign', TOP);
  Factory.Factory.addGetterSetter(Text, 'lineHeight', 1, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Text, 'wrap', WORD);
  Factory.Factory.addGetterSetter(Text, 'ellipsis', false);
  Factory.Factory.addGetterSetter(Text, 'letterSpacing', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Text, 'text', '', Validators.getStringValidator());
  Factory.Factory.addGetterSetter(Text, 'textDecoration', '');
  Util.Collection.mapMethods(Text);
  });

  unwrapExports(Text_1);
  var Text_2 = Text_1.Text;

  var TextPath_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });







  var EMPTY_STRING = '', NORMAL = 'normal';
  function _fillFunc(context) {
      context.fillText(this.partialText, 0, 0);
  }
  function _strokeFunc(context) {
      context.strokeText(this.partialText, 0, 0);
  }
  var TextPath = (function (_super) {
      __extends(TextPath, _super);
      function TextPath(config) {
          var _this = _super.call(this, config) || this;
          _this.dummyCanvas = Util.Util.createCanvasElement();
          _this.dataArray = [];
          _this.dataArray = Path_1.Path.parsePathData(_this.attrs.data);
          _this.on('dataChange.konva', function () {
              this.dataArray = Path_1.Path.parsePathData(this.attrs.data);
              this._setTextData();
          });
          _this.on('textChange.konva alignChange.konva letterSpacingChange.konva kerningFuncChange.konva', _this._setTextData);
          if (config && config['getKerning']) {
              Util.Util.warn('getKerning TextPath API is deprecated. Please use "kerningFunc" instead.');
              _this.kerningFunc(config['getKerning']);
          }
          _this._setTextData();
          return _this;
      }
      TextPath.prototype._sceneFunc = function (context) {
          context.setAttr('font', this._getContextFont());
          context.setAttr('textBaseline', this.textBaseline());
          context.setAttr('textAlign', 'left');
          context.save();
          var textDecoration = this.textDecoration();
          var fill = this.fill();
          var fontSize = this.fontSize();
          var glyphInfo = this.glyphInfo;
          if (textDecoration === 'underline') {
              context.beginPath();
          }
          for (var i = 0; i < glyphInfo.length; i++) {
              context.save();
              var p0 = glyphInfo[i].p0;
              context.translate(p0.x, p0.y);
              context.rotate(glyphInfo[i].rotation);
              this.partialText = glyphInfo[i].text;
              context.fillStrokeShape(this);
              if (textDecoration === 'underline') {
                  if (i === 0) {
                      context.moveTo(0, fontSize / 2 + 1);
                  }
                  context.lineTo(fontSize, fontSize / 2 + 1);
              }
              context.restore();
          }
          if (textDecoration === 'underline') {
              context.strokeStyle = fill;
              context.lineWidth = fontSize / 20;
              context.stroke();
          }
          context.restore();
      };
      TextPath.prototype._hitFunc = function (context) {
          context.beginPath();
          var glyphInfo = this.glyphInfo;
          if (glyphInfo.length >= 1) {
              var p0 = glyphInfo[0].p0;
              context.moveTo(p0.x, p0.y);
          }
          for (var i = 0; i < glyphInfo.length; i++) {
              var p1 = glyphInfo[i].p1;
              context.lineTo(p1.x, p1.y);
          }
          context.setAttr('lineWidth', this.fontSize());
          context.setAttr('strokeStyle', this.colorKey);
          context.stroke();
      };
      TextPath.prototype.getTextWidth = function () {
          return this.textWidth;
      };
      TextPath.prototype.getTextHeight = function () {
          Util.Util.warn('text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height.');
          return this.textHeight;
      };
      TextPath.prototype.setText = function (text) {
          return Text_1.Text.prototype.setText.call(this, text);
      };
      TextPath.prototype._getContextFont = function () {
          return Text_1.Text.prototype._getContextFont.call(this);
      };
      TextPath.prototype._getTextSize = function (text) {
          var dummyCanvas = this.dummyCanvas;
          var _context = dummyCanvas.getContext('2d');
          _context.save();
          _context.font = this._getContextFont();
          var metrics = _context.measureText(text);
          _context.restore();
          return {
              width: metrics.width,
              height: parseInt(this.attrs.fontSize, 10)
          };
      };
      TextPath.prototype._setTextData = function () {
          var that = this;
          var size = this._getTextSize(this.attrs.text);
          var letterSpacing = this.letterSpacing();
          var align = this.align();
          var kerningFunc = this.kerningFunc();
          this.textWidth = size.width;
          this.textHeight = size.height;
          var textFullWidth = Math.max(this.textWidth + ((this.attrs.text || '').length - 1) * letterSpacing, 0);
          this.glyphInfo = [];
          var fullPathWidth = 0;
          for (var l = 0; l < that.dataArray.length; l++) {
              if (that.dataArray[l].pathLength > 0) {
                  fullPathWidth += that.dataArray[l].pathLength;
              }
          }
          var offset = 0;
          if (align === 'center') {
              offset = Math.max(0, fullPathWidth / 2 - textFullWidth / 2);
          }
          if (align === 'right') {
              offset = Math.max(0, fullPathWidth - textFullWidth);
          }
          var charArr = this.text().split('');
          var spacesNumber = this.text().split(' ').length - 1;
          var p0, p1, pathCmd;
          var pIndex = -1;
          var currentT = 0;
          var getNextPathSegment = function () {
              currentT = 0;
              var pathData = that.dataArray;
              for (var j = pIndex + 1; j < pathData.length; j++) {
                  if (pathData[j].pathLength > 0) {
                      pIndex = j;
                      return pathData[j];
                  }
                  else if (pathData[j].command === 'M') {
                      p0 = {
                          x: pathData[j].points[0],
                          y: pathData[j].points[1]
                      };
                  }
              }
              return {};
          };
          var findSegmentToFitCharacter = function (c) {
              var glyphWidth = that._getTextSize(c).width + letterSpacing;
              if (c === ' ' && align === 'justify') {
                  glyphWidth += (fullPathWidth - textFullWidth) / spacesNumber;
              }
              var currLen = 0;
              var attempts = 0;
              p1 = undefined;
              while (Math.abs(glyphWidth - currLen) / glyphWidth > 0.01 &&
                  attempts < 25) {
                  attempts++;
                  var cumulativePathLength = currLen;
                  while (pathCmd === undefined) {
                      pathCmd = getNextPathSegment();
                      if (pathCmd &&
                          cumulativePathLength + pathCmd.pathLength < glyphWidth) {
                          cumulativePathLength += pathCmd.pathLength;
                          pathCmd = undefined;
                      }
                  }
                  if (pathCmd === {} || p0 === undefined) {
                      return undefined;
                  }
                  var needNewSegment = false;
                  switch (pathCmd.command) {
                      case 'L':
                          if (Path_1.Path.getLineLength(p0.x, p0.y, pathCmd.points[0], pathCmd.points[1]) > glyphWidth) {
                              p1 = Path_1.Path.getPointOnLine(glyphWidth, p0.x, p0.y, pathCmd.points[0], pathCmd.points[1], p0.x, p0.y);
                          }
                          else {
                              pathCmd = undefined;
                          }
                          break;
                      case 'A':
                          var start = pathCmd.points[4];
                          var dTheta = pathCmd.points[5];
                          var end = pathCmd.points[4] + dTheta;
                          if (currentT === 0) {
                              currentT = start + 0.00000001;
                          }
                          else if (glyphWidth > currLen) {
                              currentT += ((Math.PI / 180.0) * dTheta) / Math.abs(dTheta);
                          }
                          else {
                              currentT -= ((Math.PI / 360.0) * dTheta) / Math.abs(dTheta);
                          }
                          if ((dTheta < 0 && currentT < end) ||
                              (dTheta >= 0 && currentT > end)) {
                              currentT = end;
                              needNewSegment = true;
                          }
                          p1 = Path_1.Path.getPointOnEllipticalArc(pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3], currentT, pathCmd.points[6]);
                          break;
                      case 'C':
                          if (currentT === 0) {
                              if (glyphWidth > pathCmd.pathLength) {
                                  currentT = 0.00000001;
                              }
                              else {
                                  currentT = glyphWidth / pathCmd.pathLength;
                              }
                          }
                          else if (glyphWidth > currLen) {
                              currentT += (glyphWidth - currLen) / pathCmd.pathLength;
                          }
                          else {
                              currentT -= (currLen - glyphWidth) / pathCmd.pathLength;
                          }
                          if (currentT > 1.0) {
                              currentT = 1.0;
                              needNewSegment = true;
                          }
                          p1 = Path_1.Path.getPointOnCubicBezier(currentT, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3], pathCmd.points[4], pathCmd.points[5]);
                          break;
                      case 'Q':
                          if (currentT === 0) {
                              currentT = glyphWidth / pathCmd.pathLength;
                          }
                          else if (glyphWidth > currLen) {
                              currentT += (glyphWidth - currLen) / pathCmd.pathLength;
                          }
                          else {
                              currentT -= (currLen - glyphWidth) / pathCmd.pathLength;
                          }
                          if (currentT > 1.0) {
                              currentT = 1.0;
                              needNewSegment = true;
                          }
                          p1 = Path_1.Path.getPointOnQuadraticBezier(currentT, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3]);
                          break;
                  }
                  if (p1 !== undefined) {
                      currLen = Path_1.Path.getLineLength(p0.x, p0.y, p1.x, p1.y);
                  }
                  if (needNewSegment) {
                      needNewSegment = false;
                      pathCmd = undefined;
                  }
              }
          };
          var testChar = 'C';
          var glyphWidth = that._getTextSize(testChar).width + letterSpacing;
          var lettersInOffset = offset / glyphWidth - 1;
          for (var k = 0; k < lettersInOffset; k++) {
              findSegmentToFitCharacter(testChar);
              if (p0 === undefined || p1 === undefined) {
                  break;
              }
              p0 = p1;
          }
          for (var i = 0; i < charArr.length; i++) {
              findSegmentToFitCharacter(charArr[i]);
              if (p0 === undefined || p1 === undefined) {
                  break;
              }
              var width = Path_1.Path.getLineLength(p0.x, p0.y, p1.x, p1.y);
              var kern = 0;
              if (kerningFunc) {
                  try {
                      kern = kerningFunc(charArr[i - 1], charArr[i]) * this.fontSize();
                  }
                  catch (e) {
                      kern = 0;
                  }
              }
              p0.x += kern;
              p1.x += kern;
              this.textWidth += kern;
              var midpoint = Path_1.Path.getPointOnLine(kern + width / 2.0, p0.x, p0.y, p1.x, p1.y);
              var rotation = Math.atan2(p1.y - p0.y, p1.x - p0.x);
              this.glyphInfo.push({
                  transposeX: midpoint.x,
                  transposeY: midpoint.y,
                  text: charArr[i],
                  rotation: rotation,
                  p0: p0,
                  p1: p1
              });
              p0 = p1;
          }
      };
      TextPath.prototype.getSelfRect = function () {
          if (!this.glyphInfo.length) {
              return {
                  x: 0,
                  y: 0,
                  width: 0,
                  height: 0
              };
          }
          var points = [];
          this.glyphInfo.forEach(function (info) {
              points.push(info.p0.x);
              points.push(info.p0.y);
              points.push(info.p1.x);
              points.push(info.p1.y);
          });
          var minX = points[0] || 0;
          var maxX = points[0] || 0;
          var minY = points[1] || 0;
          var maxY = points[1] || 0;
          var x, y;
          for (var i = 0; i < points.length / 2; i++) {
              x = points[i * 2];
              y = points[i * 2 + 1];
              minX = Math.min(minX, x);
              maxX = Math.max(maxX, x);
              minY = Math.min(minY, y);
              maxY = Math.max(maxY, y);
          }
          var fontSize = this.fontSize();
          return {
              x: minX - fontSize / 2,
              y: minY - fontSize / 2,
              width: maxX - minX + fontSize,
              height: maxY - minY + fontSize
          };
      };
      return TextPath;
  }(Shape_1.Shape));
  exports.TextPath = TextPath;
  TextPath.prototype._fillFunc = _fillFunc;
  TextPath.prototype._strokeFunc = _strokeFunc;
  TextPath.prototype._fillFuncHit = _fillFunc;
  TextPath.prototype._strokeFuncHit = _strokeFunc;
  TextPath.prototype.className = 'TextPath';
  TextPath.prototype._attrsAffectingSize = ['text', 'fontSize', 'data'];
  Global._registerNode(TextPath);
  Factory.Factory.addGetterSetter(TextPath, 'data');
  Factory.Factory.addGetterSetter(TextPath, 'fontFamily', 'Arial');
  Factory.Factory.addGetterSetter(TextPath, 'fontSize', 12, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(TextPath, 'fontStyle', NORMAL);
  Factory.Factory.addGetterSetter(TextPath, 'align', 'left');
  Factory.Factory.addGetterSetter(TextPath, 'letterSpacing', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(TextPath, 'textBaseline', 'middle');
  Factory.Factory.addGetterSetter(TextPath, 'fontVariant', NORMAL);
  Factory.Factory.addGetterSetter(TextPath, 'text', EMPTY_STRING);
  Factory.Factory.addGetterSetter(TextPath, 'textDecoration', null);
  Factory.Factory.addGetterSetter(TextPath, 'kerningFunc', null);
  Util.Collection.mapMethods(TextPath);
  });

  unwrapExports(TextPath_1);
  var TextPath_2 = TextPath_1.TextPath;

  var Transformer_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
      __assign = Object.assign || function(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                  t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };
  Object.defineProperty(exports, "__esModule", { value: true });








  var Global_2 = Global;
  var EVENTS_NAME = 'tr-konva';
  var ATTR_CHANGE_LIST = [
      'resizeEnabledChange',
      'rotateAnchorOffsetChange',
      'rotateEnabledChange',
      'enabledAnchorsChange',
      'anchorSizeChange',
      'borderEnabledChange',
      'borderStrokeChange',
      'borderStrokeWidthChange',
      'borderDashChange',
      'anchorStrokeChange',
      'anchorStrokeWidthChange',
      'anchorFillChange',
      'anchorCornerRadiusChange',
      'ignoreStrokeChange',
  ]
      .map(function (e) { return e + ("." + EVENTS_NAME); })
      .join(' ');
  var NODES_RECT = 'nodesRect';
  var TRANSFORM_CHANGE_STR = [
      'widthChange',
      'heightChange',
      'scaleXChange',
      'scaleYChange',
      'skewXChange',
      'skewYChange',
      'rotationChange',
      'offsetXChange',
      'offsetYChange',
      'transformsEnabledChange',
      'strokeWidthChange',
  ]
      .map(function (e) { return e + ("." + EVENTS_NAME); })
      .join(' ');
  var ANGLES = {
      'top-left': -45,
      'top-center': 0,
      'top-right': 45,
      'middle-right': -90,
      'middle-left': 90,
      'bottom-left': -135,
      'bottom-center': 180,
      'bottom-right': 135,
  };
  var TOUCH_DEVICE = 'ontouchstart' in Global.Konva._global;
  function getCursor(anchorName, rad) {
      if (anchorName === 'rotater') {
          return 'crosshair';
      }
      rad += Util.Util._degToRad(ANGLES[anchorName] || 0);
      var angle = ((Util.Util._radToDeg(rad) % 360) + 360) % 360;
      if (Util.Util._inRange(angle, 315 + 22.5, 360) || Util.Util._inRange(angle, 0, 22.5)) {
          return 'ns-resize';
      }
      else if (Util.Util._inRange(angle, 45 - 22.5, 45 + 22.5)) {
          return 'nesw-resize';
      }
      else if (Util.Util._inRange(angle, 90 - 22.5, 90 + 22.5)) {
          return 'ew-resize';
      }
      else if (Util.Util._inRange(angle, 135 - 22.5, 135 + 22.5)) {
          return 'nwse-resize';
      }
      else if (Util.Util._inRange(angle, 180 - 22.5, 180 + 22.5)) {
          return 'ns-resize';
      }
      else if (Util.Util._inRange(angle, 225 - 22.5, 225 + 22.5)) {
          return 'nesw-resize';
      }
      else if (Util.Util._inRange(angle, 270 - 22.5, 270 + 22.5)) {
          return 'ew-resize';
      }
      else if (Util.Util._inRange(angle, 315 - 22.5, 315 + 22.5)) {
          return 'nwse-resize';
      }
      else {
          Util.Util.error('Transformer has unknown angle for cursor detection: ' + angle);
          return 'pointer';
      }
  }
  var ANCHORS_NAMES = [
      'top-left',
      'top-center',
      'top-right',
      'middle-right',
      'middle-left',
      'bottom-left',
      'bottom-center',
      'bottom-right',
  ];
  var MAX_SAFE_INTEGER = 100000000;
  function getCenter(shape) {
      return {
          x: shape.x +
              (shape.width / 2) * Math.cos(shape.rotation) +
              (shape.height / 2) * Math.sin(-shape.rotation),
          y: shape.y +
              (shape.height / 2) * Math.cos(shape.rotation) +
              (shape.width / 2) * Math.sin(shape.rotation),
      };
  }
  function rotateAroundPoint(shape, angleRad, point) {
      var x = point.x +
          (shape.x - point.x) * Math.cos(angleRad) -
          (shape.y - point.y) * Math.sin(angleRad);
      var y = point.y +
          (shape.x - point.x) * Math.sin(angleRad) +
          (shape.y - point.y) * Math.cos(angleRad);
      return __assign(__assign({}, shape), { rotation: shape.rotation + angleRad, x: x,
          y: y });
  }
  function rotateAroundCenter(shape, deltaRad) {
      var center = getCenter(shape);
      return rotateAroundPoint(shape, deltaRad, center);
  }
  function getSnap(snaps, newRotationRad, tol) {
      var snapped = newRotationRad;
      for (var i = 0; i < snaps.length; i++) {
          var angle = Global.Konva.getAngle(snaps[i]);
          var absDiff = Math.abs(angle - newRotationRad) % (Math.PI * 2);
          var dif = Math.min(absDiff, Math.PI * 2 - absDiff);
          if (dif < tol) {
              snapped = angle;
          }
      }
      return snapped;
  }
  var Transformer = (function (_super) {
      __extends(Transformer, _super);
      function Transformer(config) {
          var _this = _super.call(this, config) || this;
          _this._transforming = false;
          _this._createElements();
          _this._handleMouseMove = _this._handleMouseMove.bind(_this);
          _this._handleMouseUp = _this._handleMouseUp.bind(_this);
          _this.update = _this.update.bind(_this);
          _this.on(ATTR_CHANGE_LIST, _this.update);
          if (_this.getNode()) {
              _this.update();
          }
          return _this;
      }
      Transformer.prototype.attachTo = function (node) {
          this.setNode(node);
          return this;
      };
      Transformer.prototype.setNode = function (node) {
          Util.Util.warn('tr.setNode(shape), tr.node(shape) and tr.attachTo(shape) methods are deprecated. Please use tr.nodes(nodesArray) instead.');
          return this.setNodes([node]);
      };
      Transformer.prototype.getNode = function () {
          return this._nodes && this._nodes[0];
      };
      Transformer.prototype.setNodes = function (nodes) {
          var _this = this;
          if (nodes === void 0) { nodes = []; }
          if (this._nodes && this._nodes.length) {
              this.detach();
          }
          this._nodes = nodes;
          if (nodes.length === 1) {
              this.rotation(nodes[0].rotation());
          }
          else {
              this.rotation(0);
          }
          this._nodes.forEach(function (node) {
              var additionalEvents = node._attrsAffectingSize
                  .map(function (prop) { return prop + 'Change.' + EVENTS_NAME; })
                  .join(' ');
              var onChange = function () {
                  _this._resetTransformCache();
                  if (!_this._transforming) {
                      _this.update();
                  }
              };
              node.on(additionalEvents, onChange);
              node.on(TRANSFORM_CHANGE_STR, onChange);
              node.on("_clearTransformCache." + EVENTS_NAME, onChange);
              node.on("xChange." + EVENTS_NAME + " yChange." + EVENTS_NAME, onChange);
              _this._proxyDrag(node);
          });
          this._resetTransformCache();
          var elementsCreated = !!this.findOne('.top-left');
          if (elementsCreated) {
              this.update();
          }
          return this;
      };
      Transformer.prototype._proxyDrag = function (node) {
          var _this = this;
          var lastPos;
          node.on("dragstart." + EVENTS_NAME, function (e) {
              lastPos = node.getAbsolutePosition();
              if (!_this.isDragging() && node !== _this.findOne('.back')) {
                  _this.startDrag();
              }
          });
          node.on("dragmove." + EVENTS_NAME, function (e) {
              if (!lastPos) {
                  return;
              }
              var abs = node.getAbsolutePosition();
              var dx = abs.x - lastPos.x;
              var dy = abs.y - lastPos.y;
              _this.nodes().forEach(function (otherNode) {
                  if (otherNode === node) {
                      return;
                  }
                  if (otherNode.isDragging()) {
                      return;
                  }
                  var otherAbs = otherNode.getAbsolutePosition();
                  otherNode.setAbsolutePosition({
                      x: otherAbs.x + dx,
                      y: otherAbs.y + dy,
                  });
                  otherNode.startDrag();
              });
              lastPos = null;
          });
      };
      Transformer.prototype.getNodes = function () {
          return this._nodes;
      };
      Transformer.prototype.getActiveAnchor = function () {
          return this._movingAnchorName;
      };
      Transformer.prototype.detach = function () {
          if (this._nodes) {
              this._nodes.forEach(function (node) {
                  node.off('.' + EVENTS_NAME);
              });
          }
          this._nodes = [];
          this._resetTransformCache();
      };
      Transformer.prototype._resetTransformCache = function () {
          this._clearCache(NODES_RECT);
          this._clearCache('transform');
          this._clearSelfAndDescendantCache('absoluteTransform');
      };
      Transformer.prototype._getNodeRect = function () {
          return this._getCache(NODES_RECT, this.__getNodeRect);
      };
      Transformer.prototype.__getNodeShape = function (node, rot, relative) {
          if (rot === void 0) { rot = this.rotation(); }
          var rect = node.getClientRect({
              skipTransform: true,
              skipShadow: true,
              skipStroke: this.ignoreStroke(),
          });
          var absScale = node.getAbsoluteScale(relative);
          var absPos = node.getAbsolutePosition(relative);
          var dx = rect.x * absScale.x - node.offsetX() * absScale.x;
          var dy = rect.y * absScale.y - node.offsetY() * absScale.y;
          var rotation = (Global.Konva.getAngle(node.getAbsoluteRotation()) + Math.PI * 2) %
              (Math.PI * 2);
          var box = {
              x: absPos.x + dx * Math.cos(rotation) + dy * Math.sin(-rotation),
              y: absPos.y + dy * Math.cos(rotation) + dx * Math.sin(rotation),
              width: rect.width * absScale.x,
              height: rect.height * absScale.y,
              rotation: rotation,
          };
          return rotateAroundPoint(box, -Global.Konva.getAngle(rot), {
              x: 0,
              y: 0,
          });
      };
      Transformer.prototype.__getNodeRect = function () {
          var _this = this;
          var node = this.getNode();
          if (!node) {
              return {
                  x: -MAX_SAFE_INTEGER,
                  y: -MAX_SAFE_INTEGER,
                  width: 0,
                  height: 0,
                  rotation: 0,
              };
          }
          var totalPoints = [];
          this.nodes().map(function (node) {
              var box = node.getClientRect({
                  skipTransform: true,
                  skipShadow: true,
                  skipStroke: _this.ignoreStroke(),
              });
              var points = [
                  { x: box.x, y: box.y },
                  { x: box.x + box.width, y: box.y },
                  { x: box.x + box.width, y: box.y + box.height },
                  { x: box.x, y: box.y + box.height },
              ];
              var trans = node.getAbsoluteTransform();
              points.forEach(function (point) {
                  var transformed = trans.point(point);
                  totalPoints.push(transformed);
              });
          });
          var tr = new Util.Transform();
          tr.rotate(-Global.Konva.getAngle(this.rotation()));
          var minX, minY, maxX, maxY;
          totalPoints.forEach(function (point) {
              var transformed = tr.point(point);
              if (minX === undefined) {
                  minX = maxX = transformed.x;
                  minY = maxY = transformed.y;
              }
              minX = Math.min(minX, transformed.x);
              minY = Math.min(minY, transformed.y);
              maxX = Math.max(maxX, transformed.x);
              maxY = Math.max(maxY, transformed.y);
          });
          tr.invert();
          var p = tr.point({ x: minX, y: minY });
          return {
              x: p.x,
              y: p.y,
              width: maxX - minX,
              height: maxY - minY,
              rotation: Global.Konva.getAngle(this.rotation()),
          };
      };
      Transformer.prototype.getX = function () {
          return this._getNodeRect().x;
      };
      Transformer.prototype.getY = function () {
          return this._getNodeRect().y;
      };
      Transformer.prototype.getWidth = function () {
          return this._getNodeRect().width;
      };
      Transformer.prototype.getHeight = function () {
          return this._getNodeRect().height;
      };
      Transformer.prototype._createElements = function () {
          this._createBack();
          ANCHORS_NAMES.forEach(function (name) {
              this._createAnchor(name);
          }.bind(this));
          this._createAnchor('rotater');
      };
      Transformer.prototype._createAnchor = function (name) {
          var _this = this;
          var anchor = new Rect_1.Rect({
              stroke: 'rgb(0, 161, 255)',
              fill: 'white',
              strokeWidth: 1,
              name: name + ' _anchor',
              dragDistance: 0,
              draggable: true,
              hitStrokeWidth: TOUCH_DEVICE ? 10 : 'auto',
          });
          var self = this;
          anchor.on('mousedown touchstart', function (e) {
              self._handleMouseDown(e);
          });
          anchor.on('dragstart', function (e) {
              anchor.stopDrag();
              e.cancelBubble = true;
          });
          anchor.on('dragend', function (e) {
              e.cancelBubble = true;
          });
          anchor.on('mouseenter', function () {
              var rad = Global.Konva.getAngle(_this.rotation());
              var cursor = getCursor(name, rad);
              anchor.getStage().content.style.cursor = cursor;
              _this._cursorChange = true;
          });
          anchor.on('mouseout', function () {
              anchor.getStage().content.style.cursor = '';
              _this._cursorChange = false;
          });
          this.add(anchor);
      };
      Transformer.prototype._createBack = function () {
          var _this = this;
          var back = new Shape_1.Shape({
              name: 'back',
              width: 0,
              height: 0,
              draggable: true,
              sceneFunc: function (ctx) {
                  var tr = this.getParent();
                  var padding = tr.padding();
                  ctx.beginPath();
                  ctx.rect(-padding, -padding, this.width() + padding * 2, this.height() + padding * 2);
                  ctx.moveTo(this.width() / 2, -padding);
                  if (tr.rotateEnabled()) {
                      ctx.lineTo(this.width() / 2, -tr.rotateAnchorOffset() * Util.Util._sign(this.height()) - padding);
                  }
                  ctx.fillStrokeShape(this);
              },
              hitFunc: function (ctx, shape) {
                  if (!_this.shouldOverdrawWholeArea()) {
                      return;
                  }
                  var padding = _this.padding();
                  ctx.beginPath();
                  ctx.rect(-padding, -padding, shape.width() + padding * 2, shape.height() + padding * 2);
                  ctx.fillStrokeShape(shape);
              },
          });
          this.add(back);
          this._proxyDrag(back);
      };
      Transformer.prototype._handleMouseDown = function (e) {
          this._movingAnchorName = e.target.name().split(' ')[0];
          var attrs = this._getNodeRect();
          var width = attrs.width;
          var height = attrs.height;
          var hypotenuse = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
          this.sin = Math.abs(height / hypotenuse);
          this.cos = Math.abs(width / hypotenuse);
          window.addEventListener('mousemove', this._handleMouseMove);
          window.addEventListener('touchmove', this._handleMouseMove);
          window.addEventListener('mouseup', this._handleMouseUp, true);
          window.addEventListener('touchend', this._handleMouseUp, true);
          this._transforming = true;
          var ap = e.target.getAbsolutePosition();
          var pos = e.target.getStage().getPointerPosition();
          this._anchorDragOffset = {
              x: pos.x - ap.x,
              y: pos.y - ap.y,
          };
          this._fire('transformstart', { evt: e, target: this.getNode() });
          this.getNode()._fire('transformstart', { evt: e, target: this.getNode() });
      };
      Transformer.prototype._handleMouseMove = function (e) {
          var x, y, newHypotenuse;
          var anchorNode = this.findOne('.' + this._movingAnchorName);
          var stage = anchorNode.getStage();
          stage.setPointersPositions(e);
          var pp = stage.getPointerPosition();
          var newNodePos = {
              x: pp.x - this._anchorDragOffset.x,
              y: pp.y - this._anchorDragOffset.y,
          };
          var oldAbs = anchorNode.getAbsolutePosition();
          anchorNode.setAbsolutePosition(newNodePos);
          var newAbs = anchorNode.getAbsolutePosition();
          if (oldAbs.x === newAbs.x && oldAbs.y === newAbs.y) {
              return;
          }
          if (this._movingAnchorName === 'rotater') {
              var attrs = this._getNodeRect();
              x = anchorNode.x() - attrs.width / 2;
              y = -anchorNode.y() + attrs.height / 2;
              var delta = Math.atan2(-y, x) + Math.PI / 2;
              if (attrs.height < 0) {
                  delta -= Math.PI;
              }
              var oldRotation = Global.Konva.getAngle(this.rotation());
              var newRotation = oldRotation + delta;
              var tol = Global.Konva.getAngle(this.rotationSnapTolerance());
              var snappedRot = getSnap(this.rotationSnaps(), newRotation, tol);
              var diff = snappedRot - attrs.rotation;
              var shape = rotateAroundCenter(attrs, diff);
              this._fitNodesInto(shape, e);
              return;
          }
          var keepProportion = this.keepRatio() || e.shiftKey;
          var centeredScaling = this.centeredScaling() || e.altKey;
          if (this._movingAnchorName === 'top-left') {
              if (keepProportion) {
                  var comparePoint = centeredScaling
                      ? {
                          x: this.width() / 2,
                          y: this.height() / 2,
                      }
                      : {
                          x: this.findOne('.bottom-right').x(),
                          y: this.findOne('.bottom-right').y(),
                      };
                  newHypotenuse = Math.sqrt(Math.pow(comparePoint.x - anchorNode.x(), 2) +
                      Math.pow(comparePoint.y - anchorNode.y(), 2));
                  var reverseX = this.findOne('.top-left').x() > comparePoint.x ? -1 : 1;
                  var reverseY = this.findOne('.top-left').y() > comparePoint.y ? -1 : 1;
                  x = newHypotenuse * this.cos * reverseX;
                  y = newHypotenuse * this.sin * reverseY;
                  this.findOne('.top-left').x(comparePoint.x - x);
                  this.findOne('.top-left').y(comparePoint.y - y);
              }
          }
          else if (this._movingAnchorName === 'top-center') {
              this.findOne('.top-left').y(anchorNode.y());
          }
          else if (this._movingAnchorName === 'top-right') {
              if (keepProportion) {
                  var comparePoint = centeredScaling
                      ? {
                          x: this.width() / 2,
                          y: this.height() / 2,
                      }
                      : {
                          x: this.findOne('.bottom-left').x(),
                          y: this.findOne('.bottom-left').y(),
                      };
                  newHypotenuse = Math.sqrt(Math.pow(anchorNode.x() - comparePoint.x, 2) +
                      Math.pow(comparePoint.y - anchorNode.y(), 2));
                  var reverseX = this.findOne('.top-right').x() < comparePoint.x ? -1 : 1;
                  var reverseY = this.findOne('.top-right').y() > comparePoint.y ? -1 : 1;
                  x = newHypotenuse * this.cos * reverseX;
                  y = newHypotenuse * this.sin * reverseY;
                  this.findOne('.top-right').x(comparePoint.x + x);
                  this.findOne('.top-right').y(comparePoint.y - y);
              }
              var pos = anchorNode.position();
              this.findOne('.top-left').y(pos.y);
              this.findOne('.bottom-right').x(pos.x);
          }
          else if (this._movingAnchorName === 'middle-left') {
              this.findOne('.top-left').x(anchorNode.x());
          }
          else if (this._movingAnchorName === 'middle-right') {
              this.findOne('.bottom-right').x(anchorNode.x());
          }
          else if (this._movingAnchorName === 'bottom-left') {
              if (keepProportion) {
                  var comparePoint = centeredScaling
                      ? {
                          x: this.width() / 2,
                          y: this.height() / 2,
                      }
                      : {
                          x: this.findOne('.top-right').x(),
                          y: this.findOne('.top-right').y(),
                      };
                  newHypotenuse = Math.sqrt(Math.pow(comparePoint.x - anchorNode.x(), 2) +
                      Math.pow(anchorNode.y() - comparePoint.y, 2));
                  var reverseX = comparePoint.x < anchorNode.x() ? -1 : 1;
                  var reverseY = anchorNode.y() < comparePoint.y ? -1 : 1;
                  x = newHypotenuse * this.cos * reverseX;
                  y = newHypotenuse * this.sin * reverseY;
                  anchorNode.x(comparePoint.x - x);
                  anchorNode.y(comparePoint.y + y);
              }
              pos = anchorNode.position();
              this.findOne('.top-left').x(pos.x);
              this.findOne('.bottom-right').y(pos.y);
          }
          else if (this._movingAnchorName === 'bottom-center') {
              this.findOne('.bottom-right').y(anchorNode.y());
          }
          else if (this._movingAnchorName === 'bottom-right') {
              if (keepProportion) {
                  var comparePoint = centeredScaling
                      ? {
                          x: this.width() / 2,
                          y: this.height() / 2,
                      }
                      : {
                          x: this.findOne('.top-left').x(),
                          y: this.findOne('.top-left').y(),
                      };
                  newHypotenuse = Math.sqrt(Math.pow(anchorNode.x() - comparePoint.x, 2) +
                      Math.pow(anchorNode.y() - comparePoint.y, 2));
                  var reverseX = this.findOne('.bottom-right').x() < comparePoint.x ? -1 : 1;
                  var reverseY = this.findOne('.bottom-right').y() < comparePoint.y ? -1 : 1;
                  x = newHypotenuse * this.cos * reverseX;
                  y = newHypotenuse * this.sin * reverseY;
                  this.findOne('.bottom-right').x(comparePoint.x + x);
                  this.findOne('.bottom-right').y(comparePoint.y + y);
              }
          }
          else {
              console.error(new Error('Wrong position argument of selection resizer: ' +
                  this._movingAnchorName));
          }
          var centeredScaling = this.centeredScaling() || e.altKey;
          if (centeredScaling) {
              var topLeft = this.findOne('.top-left');
              var bottomRight = this.findOne('.bottom-right');
              var topOffsetX = topLeft.x();
              var topOffsetY = topLeft.y();
              var bottomOffsetX = this.getWidth() - bottomRight.x();
              var bottomOffsetY = this.getHeight() - bottomRight.y();
              bottomRight.move({
                  x: -topOffsetX,
                  y: -topOffsetY,
              });
              topLeft.move({
                  x: bottomOffsetX,
                  y: bottomOffsetY,
              });
          }
          var absPos = this.findOne('.top-left').getAbsolutePosition();
          x = absPos.x;
          y = absPos.y;
          var width = this.findOne('.bottom-right').x() - this.findOne('.top-left').x();
          var height = this.findOne('.bottom-right').y() - this.findOne('.top-left').y();
          this._fitNodesInto({
              x: x,
              y: y,
              width: width,
              height: height,
              rotation: Global.Konva.getAngle(this.rotation()),
          }, e);
      };
      Transformer.prototype._handleMouseUp = function (e) {
          this._removeEvents(e);
      };
      Transformer.prototype.getAbsoluteTransform = function () {
          return this.getTransform();
      };
      Transformer.prototype._removeEvents = function (e) {
          if (this._transforming) {
              this._transforming = false;
              window.removeEventListener('mousemove', this._handleMouseMove);
              window.removeEventListener('touchmove', this._handleMouseMove);
              window.removeEventListener('mouseup', this._handleMouseUp, true);
              window.removeEventListener('touchend', this._handleMouseUp, true);
              var node = this.getNode();
              this._fire('transformend', { evt: e, target: node });
              if (node) {
                  node.fire('transformend', { evt: e, target: node });
              }
              this._movingAnchorName = null;
          }
      };
      Transformer.prototype._fitNodesInto = function (newAttrs, evt) {
          var _this = this;
          var oldAttrs = this._getNodeRect();
          var minSize = 1;
          if (Util.Util._inRange(newAttrs.width, -this.padding() * 2 - minSize, minSize)) {
              this.update();
              return;
          }
          if (Util.Util._inRange(newAttrs.height, -this.padding() * 2 - minSize, minSize)) {
              this.update();
              return;
          }
          var t = new Util.Transform();
          t.rotate(Global.Konva.getAngle(this.rotation()));
          if (this._movingAnchorName &&
              newAttrs.width < 0 &&
              this._movingAnchorName.indexOf('left') >= 0) {
              var offset = t.point({
                  x: -this.padding() * 2,
                  y: 0,
              });
              newAttrs.x += offset.x;
              newAttrs.y += offset.y;
              newAttrs.width += this.padding() * 2;
              this._movingAnchorName = this._movingAnchorName.replace('left', 'right');
              this._anchorDragOffset.x -= offset.x;
              this._anchorDragOffset.y -= offset.y;
          }
          else if (this._movingAnchorName &&
              newAttrs.width < 0 &&
              this._movingAnchorName.indexOf('right') >= 0) {
              var offset = t.point({
                  x: this.padding() * 2,
                  y: 0,
              });
              this._movingAnchorName = this._movingAnchorName.replace('right', 'left');
              this._anchorDragOffset.x -= offset.x;
              this._anchorDragOffset.y -= offset.y;
              newAttrs.width += this.padding() * 2;
          }
          if (this._movingAnchorName &&
              newAttrs.height < 0 &&
              this._movingAnchorName.indexOf('top') >= 0) {
              var offset = t.point({
                  x: 0,
                  y: -this.padding() * 2,
              });
              newAttrs.x += offset.x;
              newAttrs.y += offset.y;
              this._movingAnchorName = this._movingAnchorName.replace('top', 'bottom');
              this._anchorDragOffset.x -= offset.x;
              this._anchorDragOffset.y -= offset.y;
              newAttrs.height += this.padding() * 2;
          }
          else if (this._movingAnchorName &&
              newAttrs.height < 0 &&
              this._movingAnchorName.indexOf('bottom') >= 0) {
              var offset = t.point({
                  x: 0,
                  y: this.padding() * 2,
              });
              this._movingAnchorName = this._movingAnchorName.replace('bottom', 'top');
              this._anchorDragOffset.x -= offset.x;
              this._anchorDragOffset.y -= offset.y;
              newAttrs.height += this.padding() * 2;
          }
          if (this.boundBoxFunc()) {
              var bounded = this.boundBoxFunc()(oldAttrs, newAttrs);
              if (bounded) {
                  newAttrs = bounded;
              }
              else {
                  Util.Util.warn('boundBoxFunc returned falsy. You should return new bound rect from it!');
              }
          }
          var baseSize = 10000000;
          var oldTr = new Util.Transform();
          oldTr.translate(oldAttrs.x, oldAttrs.y);
          oldTr.rotate(oldAttrs.rotation);
          oldTr.scale(oldAttrs.width / baseSize, oldAttrs.height / baseSize);
          var newTr = new Util.Transform();
          newTr.translate(newAttrs.x, newAttrs.y);
          newTr.rotate(newAttrs.rotation);
          newTr.scale(newAttrs.width / baseSize, newAttrs.height / baseSize);
          var delta = newTr.multiply(oldTr.invert());
          this._nodes.forEach(function (node) {
              var parentTransform = node.getParent().getAbsoluteTransform();
              var localTransform = node.getTransform().copy();
              localTransform.translate(node.offsetX(), node.offsetY());
              var newLocalTransform = new Util.Transform();
              newLocalTransform
                  .multiply(parentTransform.copy().invert())
                  .multiply(delta)
                  .multiply(parentTransform)
                  .multiply(localTransform);
              var attrs = newLocalTransform.decompose();
              node.setAttrs(attrs);
              _this._fire('transform', { evt: evt, target: node });
              node._fire('transform', { evt: evt, target: node });
          });
          this.rotation(Util.Util._getRotation(newAttrs.rotation));
          this._resetTransformCache();
          this.update();
          this.getLayer().batchDraw();
      };
      Transformer.prototype.forceUpdate = function () {
          this._resetTransformCache();
          this.update();
      };
      Transformer.prototype._batchChangeChild = function (selector, attrs) {
          var anchor = this.findOne(selector);
          anchor.setAttrs(attrs);
      };
      Transformer.prototype.update = function () {
          var _this = this;
          var attrs = this._getNodeRect();
          this.rotation(Util.Util._getRotation(attrs.rotation));
          var width = attrs.width;
          var height = attrs.height;
          var enabledAnchors = this.enabledAnchors();
          var resizeEnabled = this.resizeEnabled();
          var padding = this.padding();
          var anchorSize = this.anchorSize();
          this.find('._anchor').each(function (node) {
              node.setAttrs({
                  width: anchorSize,
                  height: anchorSize,
                  offsetX: anchorSize / 2,
                  offsetY: anchorSize / 2,
                  stroke: _this.anchorStroke(),
                  strokeWidth: _this.anchorStrokeWidth(),
                  fill: _this.anchorFill(),
                  cornerRadius: _this.anchorCornerRadius(),
              });
          });
          this._batchChangeChild('.top-left', {
              x: 0,
              y: 0,
              offsetX: anchorSize / 2 + padding,
              offsetY: anchorSize / 2 + padding,
              visible: resizeEnabled && enabledAnchors.indexOf('top-left') >= 0,
          });
          this._batchChangeChild('.top-center', {
              x: width / 2,
              y: 0,
              offsetY: anchorSize / 2 + padding,
              visible: resizeEnabled && enabledAnchors.indexOf('top-center') >= 0,
          });
          this._batchChangeChild('.top-right', {
              x: width,
              y: 0,
              offsetX: anchorSize / 2 - padding,
              offsetY: anchorSize / 2 + padding,
              visible: resizeEnabled && enabledAnchors.indexOf('top-right') >= 0,
          });
          this._batchChangeChild('.middle-left', {
              x: 0,
              y: height / 2,
              offsetX: anchorSize / 2 + padding,
              visible: resizeEnabled && enabledAnchors.indexOf('middle-left') >= 0,
          });
          this._batchChangeChild('.middle-right', {
              x: width,
              y: height / 2,
              offsetX: anchorSize / 2 - padding,
              visible: resizeEnabled && enabledAnchors.indexOf('middle-right') >= 0,
          });
          this._batchChangeChild('.bottom-left', {
              x: 0,
              y: height,
              offsetX: anchorSize / 2 + padding,
              offsetY: anchorSize / 2 - padding,
              visible: resizeEnabled && enabledAnchors.indexOf('bottom-left') >= 0,
          });
          this._batchChangeChild('.bottom-center', {
              x: width / 2,
              y: height,
              offsetY: anchorSize / 2 - padding,
              visible: resizeEnabled && enabledAnchors.indexOf('bottom-center') >= 0,
          });
          this._batchChangeChild('.bottom-right', {
              x: width,
              y: height,
              offsetX: anchorSize / 2 - padding,
              offsetY: anchorSize / 2 - padding,
              visible: resizeEnabled && enabledAnchors.indexOf('bottom-right') >= 0,
          });
          this._batchChangeChild('.rotater', {
              x: width / 2,
              y: -this.rotateAnchorOffset() * Util.Util._sign(height) - padding,
              visible: this.rotateEnabled(),
          });
          this._batchChangeChild('.back', {
              width: width,
              height: height,
              visible: this.borderEnabled(),
              stroke: this.borderStroke(),
              strokeWidth: this.borderStrokeWidth(),
              dash: this.borderDash(),
              x: 0,
              y: 0,
          });
      };
      Transformer.prototype.isTransforming = function () {
          return this._transforming;
      };
      Transformer.prototype.stopTransform = function () {
          if (this._transforming) {
              this._removeEvents();
              var anchorNode = this.findOne('.' + this._movingAnchorName);
              if (anchorNode) {
                  anchorNode.stopDrag();
              }
          }
      };
      Transformer.prototype.destroy = function () {
          if (this.getStage() && this._cursorChange) {
              this.getStage().content.style.cursor = '';
          }
          Group_1.Group.prototype.destroy.call(this);
          this.detach();
          this._removeEvents();
          return this;
      };
      Transformer.prototype.toObject = function () {
          return Node_1.Node.prototype.toObject.call(this);
      };
      return Transformer;
  }(Group_1.Group));
  exports.Transformer = Transformer;
  function validateAnchors(val) {
      if (!(val instanceof Array)) {
          Util.Util.warn('enabledAnchors value should be an array');
      }
      if (val instanceof Array) {
          val.forEach(function (name) {
              if (ANCHORS_NAMES.indexOf(name) === -1) {
                  Util.Util.warn('Unknown anchor name: ' +
                      name +
                      '. Available names are: ' +
                      ANCHORS_NAMES.join(', '));
              }
          });
      }
      return val || [];
  }
  Transformer.prototype.className = 'Transformer';
  Global_2._registerNode(Transformer);
  Factory.Factory.addGetterSetter(Transformer, 'enabledAnchors', ANCHORS_NAMES, validateAnchors);
  Factory.Factory.addGetterSetter(Transformer, 'resizeEnabled', true);
  Factory.Factory.addGetterSetter(Transformer, 'anchorSize', 10, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Transformer, 'rotateEnabled', true);
  Factory.Factory.addGetterSetter(Transformer, 'rotationSnaps', []);
  Factory.Factory.addGetterSetter(Transformer, 'rotateAnchorOffset', 50, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Transformer, 'rotationSnapTolerance', 5, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Transformer, 'borderEnabled', true);
  Factory.Factory.addGetterSetter(Transformer, 'anchorStroke', 'rgb(0, 161, 255)');
  Factory.Factory.addGetterSetter(Transformer, 'anchorStrokeWidth', 1, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Transformer, 'anchorFill', 'white');
  Factory.Factory.addGetterSetter(Transformer, 'anchorCornerRadius', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Transformer, 'borderStroke', 'rgb(0, 161, 255)');
  Factory.Factory.addGetterSetter(Transformer, 'borderStrokeWidth', 1, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Transformer, 'borderDash');
  Factory.Factory.addGetterSetter(Transformer, 'keepRatio', true);
  Factory.Factory.addGetterSetter(Transformer, 'centeredScaling', false);
  Factory.Factory.addGetterSetter(Transformer, 'ignoreStroke', false);
  Factory.Factory.addGetterSetter(Transformer, 'padding', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Transformer, 'node');
  Factory.Factory.addGetterSetter(Transformer, 'nodes');
  Factory.Factory.addGetterSetter(Transformer, 'boundBoxFunc');
  Factory.Factory.addGetterSetter(Transformer, 'shouldOverdrawWholeArea', false);
  Factory.Factory.backCompat(Transformer, {
      lineEnabled: 'borderEnabled',
      rotateHandlerOffset: 'rotateAnchorOffset',
      enabledHandlers: 'enabledAnchors',
  });
  Util.Collection.mapMethods(Transformer);
  });

  unwrapExports(Transformer_1);
  var Transformer_2 = Transformer_1.Transformer;

  var Wedge_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var Global_2 = Global;
  var Wedge = (function (_super) {
      __extends(Wedge, _super);
      function Wedge() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Wedge.prototype._sceneFunc = function (context) {
          context.beginPath();
          context.arc(0, 0, this.radius(), 0, Global.Konva.getAngle(this.angle()), this.clockwise());
          context.lineTo(0, 0);
          context.closePath();
          context.fillStrokeShape(this);
      };
      Wedge.prototype.getWidth = function () {
          return this.radius() * 2;
      };
      Wedge.prototype.getHeight = function () {
          return this.radius() * 2;
      };
      Wedge.prototype.setWidth = function (width) {
          this.radius(width / 2);
      };
      Wedge.prototype.setHeight = function (height) {
          this.radius(height / 2);
      };
      return Wedge;
  }(Shape_1.Shape));
  exports.Wedge = Wedge;
  Wedge.prototype.className = 'Wedge';
  Wedge.prototype._centroid = true;
  Wedge.prototype._attrsAffectingSize = ['radius'];
  Global_2._registerNode(Wedge);
  Factory.Factory.addGetterSetter(Wedge, 'radius', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Wedge, 'angle', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Wedge, 'clockwise', false);
  Factory.Factory.backCompat(Wedge, {
      angleDeg: 'angle',
      getAngleDeg: 'getAngle',
      setAngleDeg: 'setAngle'
  });
  Util.Collection.mapMethods(Wedge);
  });

  unwrapExports(Wedge_1);
  var Wedge_2 = Wedge_1.Wedge;

  var Blur = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  function BlurStack() {
      this.r = 0;
      this.g = 0;
      this.b = 0;
      this.a = 0;
      this.next = null;
  }
  var mul_table = [
      512,
      512,
      456,
      512,
      328,
      456,
      335,
      512,
      405,
      328,
      271,
      456,
      388,
      335,
      292,
      512,
      454,
      405,
      364,
      328,
      298,
      271,
      496,
      456,
      420,
      388,
      360,
      335,
      312,
      292,
      273,
      512,
      482,
      454,
      428,
      405,
      383,
      364,
      345,
      328,
      312,
      298,
      284,
      271,
      259,
      496,
      475,
      456,
      437,
      420,
      404,
      388,
      374,
      360,
      347,
      335,
      323,
      312,
      302,
      292,
      282,
      273,
      265,
      512,
      497,
      482,
      468,
      454,
      441,
      428,
      417,
      405,
      394,
      383,
      373,
      364,
      354,
      345,
      337,
      328,
      320,
      312,
      305,
      298,
      291,
      284,
      278,
      271,
      265,
      259,
      507,
      496,
      485,
      475,
      465,
      456,
      446,
      437,
      428,
      420,
      412,
      404,
      396,
      388,
      381,
      374,
      367,
      360,
      354,
      347,
      341,
      335,
      329,
      323,
      318,
      312,
      307,
      302,
      297,
      292,
      287,
      282,
      278,
      273,
      269,
      265,
      261,
      512,
      505,
      497,
      489,
      482,
      475,
      468,
      461,
      454,
      447,
      441,
      435,
      428,
      422,
      417,
      411,
      405,
      399,
      394,
      389,
      383,
      378,
      373,
      368,
      364,
      359,
      354,
      350,
      345,
      341,
      337,
      332,
      328,
      324,
      320,
      316,
      312,
      309,
      305,
      301,
      298,
      294,
      291,
      287,
      284,
      281,
      278,
      274,
      271,
      268,
      265,
      262,
      259,
      257,
      507,
      501,
      496,
      491,
      485,
      480,
      475,
      470,
      465,
      460,
      456,
      451,
      446,
      442,
      437,
      433,
      428,
      424,
      420,
      416,
      412,
      408,
      404,
      400,
      396,
      392,
      388,
      385,
      381,
      377,
      374,
      370,
      367,
      363,
      360,
      357,
      354,
      350,
      347,
      344,
      341,
      338,
      335,
      332,
      329,
      326,
      323,
      320,
      318,
      315,
      312,
      310,
      307,
      304,
      302,
      299,
      297,
      294,
      292,
      289,
      287,
      285,
      282,
      280,
      278,
      275,
      273,
      271,
      269,
      267,
      265,
      263,
      261,
      259
  ];
  var shg_table = [
      9,
      11,
      12,
      13,
      13,
      14,
      14,
      15,
      15,
      15,
      15,
      16,
      16,
      16,
      16,
      17,
      17,
      17,
      17,
      17,
      17,
      17,
      18,
      18,
      18,
      18,
      18,
      18,
      18,
      18,
      18,
      19,
      19,
      19,
      19,
      19,
      19,
      19,
      19,
      19,
      19,
      19,
      19,
      19,
      19,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24
  ];
  function filterGaussBlurRGBA(imageData, radius) {
      var pixels = imageData.data, width = imageData.width, height = imageData.height;
      var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, r_out_sum, g_out_sum, b_out_sum, a_out_sum, r_in_sum, g_in_sum, b_in_sum, a_in_sum, pr, pg, pb, pa, rbs;
      var div = radius + radius + 1, widthMinus1 = width - 1, heightMinus1 = height - 1, radiusPlus1 = radius + 1, sumFactor = (radiusPlus1 * (radiusPlus1 + 1)) / 2, stackStart = new BlurStack(), stackEnd = null, stack = stackStart, stackIn = null, stackOut = null, mul_sum = mul_table[radius], shg_sum = shg_table[radius];
      for (i = 1; i < div; i++) {
          stack = stack.next = new BlurStack();
          if (i === radiusPlus1) {
              stackEnd = stack;
          }
      }
      stack.next = stackStart;
      yw = yi = 0;
      for (y = 0; y < height; y++) {
          r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
          r_out_sum = radiusPlus1 * (pr = pixels[yi]);
          g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
          b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
          a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
          r_sum += sumFactor * pr;
          g_sum += sumFactor * pg;
          b_sum += sumFactor * pb;
          a_sum += sumFactor * pa;
          stack = stackStart;
          for (i = 0; i < radiusPlus1; i++) {
              stack.r = pr;
              stack.g = pg;
              stack.b = pb;
              stack.a = pa;
              stack = stack.next;
          }
          for (i = 1; i < radiusPlus1; i++) {
              p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
              r_sum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
              g_sum += (stack.g = pg = pixels[p + 1]) * rbs;
              b_sum += (stack.b = pb = pixels[p + 2]) * rbs;
              a_sum += (stack.a = pa = pixels[p + 3]) * rbs;
              r_in_sum += pr;
              g_in_sum += pg;
              b_in_sum += pb;
              a_in_sum += pa;
              stack = stack.next;
          }
          stackIn = stackStart;
          stackOut = stackEnd;
          for (x = 0; x < width; x++) {
              pixels[yi + 3] = pa = (a_sum * mul_sum) >> shg_sum;
              if (pa !== 0) {
                  pa = 255 / pa;
                  pixels[yi] = ((r_sum * mul_sum) >> shg_sum) * pa;
                  pixels[yi + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
                  pixels[yi + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
              }
              else {
                  pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
              }
              r_sum -= r_out_sum;
              g_sum -= g_out_sum;
              b_sum -= b_out_sum;
              a_sum -= a_out_sum;
              r_out_sum -= stackIn.r;
              g_out_sum -= stackIn.g;
              b_out_sum -= stackIn.b;
              a_out_sum -= stackIn.a;
              p = (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;
              r_in_sum += stackIn.r = pixels[p];
              g_in_sum += stackIn.g = pixels[p + 1];
              b_in_sum += stackIn.b = pixels[p + 2];
              a_in_sum += stackIn.a = pixels[p + 3];
              r_sum += r_in_sum;
              g_sum += g_in_sum;
              b_sum += b_in_sum;
              a_sum += a_in_sum;
              stackIn = stackIn.next;
              r_out_sum += pr = stackOut.r;
              g_out_sum += pg = stackOut.g;
              b_out_sum += pb = stackOut.b;
              a_out_sum += pa = stackOut.a;
              r_in_sum -= pr;
              g_in_sum -= pg;
              b_in_sum -= pb;
              a_in_sum -= pa;
              stackOut = stackOut.next;
              yi += 4;
          }
          yw += width;
      }
      for (x = 0; x < width; x++) {
          g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
          yi = x << 2;
          r_out_sum = radiusPlus1 * (pr = pixels[yi]);
          g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
          b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
          a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
          r_sum += sumFactor * pr;
          g_sum += sumFactor * pg;
          b_sum += sumFactor * pb;
          a_sum += sumFactor * pa;
          stack = stackStart;
          for (i = 0; i < radiusPlus1; i++) {
              stack.r = pr;
              stack.g = pg;
              stack.b = pb;
              stack.a = pa;
              stack = stack.next;
          }
          yp = width;
          for (i = 1; i <= radius; i++) {
              yi = (yp + x) << 2;
              r_sum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
              g_sum += (stack.g = pg = pixels[yi + 1]) * rbs;
              b_sum += (stack.b = pb = pixels[yi + 2]) * rbs;
              a_sum += (stack.a = pa = pixels[yi + 3]) * rbs;
              r_in_sum += pr;
              g_in_sum += pg;
              b_in_sum += pb;
              a_in_sum += pa;
              stack = stack.next;
              if (i < heightMinus1) {
                  yp += width;
              }
          }
          yi = x;
          stackIn = stackStart;
          stackOut = stackEnd;
          for (y = 0; y < height; y++) {
              p = yi << 2;
              pixels[p + 3] = pa = (a_sum * mul_sum) >> shg_sum;
              if (pa > 0) {
                  pa = 255 / pa;
                  pixels[p] = ((r_sum * mul_sum) >> shg_sum) * pa;
                  pixels[p + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
                  pixels[p + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
              }
              else {
                  pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
              }
              r_sum -= r_out_sum;
              g_sum -= g_out_sum;
              b_sum -= b_out_sum;
              a_sum -= a_out_sum;
              r_out_sum -= stackIn.r;
              g_out_sum -= stackIn.g;
              b_out_sum -= stackIn.b;
              a_out_sum -= stackIn.a;
              p =
                  (x +
                      ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width) <<
                      2;
              r_sum += r_in_sum += stackIn.r = pixels[p];
              g_sum += g_in_sum += stackIn.g = pixels[p + 1];
              b_sum += b_in_sum += stackIn.b = pixels[p + 2];
              a_sum += a_in_sum += stackIn.a = pixels[p + 3];
              stackIn = stackIn.next;
              r_out_sum += pr = stackOut.r;
              g_out_sum += pg = stackOut.g;
              b_out_sum += pb = stackOut.b;
              a_out_sum += pa = stackOut.a;
              r_in_sum -= pr;
              g_in_sum -= pg;
              b_in_sum -= pb;
              a_in_sum -= pa;
              stackOut = stackOut.next;
              yi += width;
          }
      }
  }
  exports.Blur = function Blur(imageData) {
      var radius = Math.round(this.blurRadius());
      if (radius > 0) {
          filterGaussBlurRGBA(imageData, radius);
      }
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'blurRadius', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  });

  unwrapExports(Blur);
  var Blur_1 = Blur.Blur;

  var Brighten = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  exports.Brighten = function (imageData) {
      var brightness = this.brightness() * 255, data = imageData.data, len = data.length, i;
      for (i = 0; i < len; i += 4) {
          data[i] += brightness;
          data[i + 1] += brightness;
          data[i + 2] += brightness;
      }
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'brightness', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  });

  unwrapExports(Brighten);
  var Brighten_1 = Brighten.Brighten;

  var Contrast = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  exports.Contrast = function (imageData) {
      var adjust = Math.pow((this.contrast() + 100) / 100, 2);
      var data = imageData.data, nPixels = data.length, red = 150, green = 150, blue = 150, i;
      for (i = 0; i < nPixels; i += 4) {
          red = data[i];
          green = data[i + 1];
          blue = data[i + 2];
          red /= 255;
          red -= 0.5;
          red *= adjust;
          red += 0.5;
          red *= 255;
          green /= 255;
          green -= 0.5;
          green *= adjust;
          green += 0.5;
          green *= 255;
          blue /= 255;
          blue -= 0.5;
          blue *= adjust;
          blue += 0.5;
          blue *= 255;
          red = red < 0 ? 0 : red > 255 ? 255 : red;
          green = green < 0 ? 0 : green > 255 ? 255 : green;
          blue = blue < 0 ? 0 : blue > 255 ? 255 : blue;
          data[i] = red;
          data[i + 1] = green;
          data[i + 2] = blue;
      }
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'contrast', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  });

  unwrapExports(Contrast);
  var Contrast_1 = Contrast.Contrast;

  var Emboss = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });




  exports.Emboss = function (imageData) {
      var strength = this.embossStrength() * 10, greyLevel = this.embossWhiteLevel() * 255, direction = this.embossDirection(), blend = this.embossBlend(), dirY = 0, dirX = 0, data = imageData.data, w = imageData.width, h = imageData.height, w4 = w * 4, y = h;
      switch (direction) {
          case 'top-left':
              dirY = -1;
              dirX = -1;
              break;
          case 'top':
              dirY = -1;
              dirX = 0;
              break;
          case 'top-right':
              dirY = -1;
              dirX = 1;
              break;
          case 'right':
              dirY = 0;
              dirX = 1;
              break;
          case 'bottom-right':
              dirY = 1;
              dirX = 1;
              break;
          case 'bottom':
              dirY = 1;
              dirX = 0;
              break;
          case 'bottom-left':
              dirY = 1;
              dirX = -1;
              break;
          case 'left':
              dirY = 0;
              dirX = -1;
              break;
          default:
              Util.Util.error('Unknown emboss direction: ' + direction);
      }
      do {
          var offsetY = (y - 1) * w4;
          var otherY = dirY;
          if (y + otherY < 1) {
              otherY = 0;
          }
          if (y + otherY > h) {
              otherY = 0;
          }
          var offsetYOther = (y - 1 + otherY) * w * 4;
          var x = w;
          do {
              var offset = offsetY + (x - 1) * 4;
              var otherX = dirX;
              if (x + otherX < 1) {
                  otherX = 0;
              }
              if (x + otherX > w) {
                  otherX = 0;
              }
              var offsetOther = offsetYOther + (x - 1 + otherX) * 4;
              var dR = data[offset] - data[offsetOther];
              var dG = data[offset + 1] - data[offsetOther + 1];
              var dB = data[offset + 2] - data[offsetOther + 2];
              var dif = dR;
              var absDif = dif > 0 ? dif : -dif;
              var absG = dG > 0 ? dG : -dG;
              var absB = dB > 0 ? dB : -dB;
              if (absG > absDif) {
                  dif = dG;
              }
              if (absB > absDif) {
                  dif = dB;
              }
              dif *= strength;
              if (blend) {
                  var r = data[offset] + dif;
                  var g = data[offset + 1] + dif;
                  var b = data[offset + 2] + dif;
                  data[offset] = r > 255 ? 255 : r < 0 ? 0 : r;
                  data[offset + 1] = g > 255 ? 255 : g < 0 ? 0 : g;
                  data[offset + 2] = b > 255 ? 255 : b < 0 ? 0 : b;
              }
              else {
                  var grey = greyLevel - dif;
                  if (grey < 0) {
                      grey = 0;
                  }
                  else if (grey > 255) {
                      grey = 255;
                  }
                  data[offset] = data[offset + 1] = data[offset + 2] = grey;
              }
          } while (--x);
      } while (--y);
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'embossStrength', 0.5, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  Factory.Factory.addGetterSetter(Node_1.Node, 'embossWhiteLevel', 0.5, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  Factory.Factory.addGetterSetter(Node_1.Node, 'embossDirection', 'top-left', null, Factory.Factory.afterSetFilter);
  Factory.Factory.addGetterSetter(Node_1.Node, 'embossBlend', false, null, Factory.Factory.afterSetFilter);
  });

  unwrapExports(Emboss);
  var Emboss_1 = Emboss.Emboss;

  var Enhance = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  function remap(fromValue, fromMin, fromMax, toMin, toMax) {
      var fromRange = fromMax - fromMin, toRange = toMax - toMin, toValue;
      if (fromRange === 0) {
          return toMin + toRange / 2;
      }
      if (toRange === 0) {
          return toMin;
      }
      toValue = (fromValue - fromMin) / fromRange;
      toValue = toRange * toValue + toMin;
      return toValue;
  }
  exports.Enhance = function (imageData) {
      var data = imageData.data, nSubPixels = data.length, rMin = data[0], rMax = rMin, r, gMin = data[1], gMax = gMin, g, bMin = data[2], bMax = bMin, b, i;
      var enhanceAmount = this.enhance();
      if (enhanceAmount === 0) {
          return;
      }
      for (i = 0; i < nSubPixels; i += 4) {
          r = data[i + 0];
          if (r < rMin) {
              rMin = r;
          }
          else if (r > rMax) {
              rMax = r;
          }
          g = data[i + 1];
          if (g < gMin) {
              gMin = g;
          }
          else if (g > gMax) {
              gMax = g;
          }
          b = data[i + 2];
          if (b < bMin) {
              bMin = b;
          }
          else if (b > bMax) {
              bMax = b;
          }
      }
      if (rMax === rMin) {
          rMax = 255;
          rMin = 0;
      }
      if (gMax === gMin) {
          gMax = 255;
          gMin = 0;
      }
      if (bMax === bMin) {
          bMax = 255;
          bMin = 0;
      }
      var rMid, rGoalMax, rGoalMin, gMid, gGoalMax, gGoalMin, bMid, bGoalMax, bGoalMin;
      if (enhanceAmount > 0) {
          rGoalMax = rMax + enhanceAmount * (255 - rMax);
          rGoalMin = rMin - enhanceAmount * (rMin - 0);
          gGoalMax = gMax + enhanceAmount * (255 - gMax);
          gGoalMin = gMin - enhanceAmount * (gMin - 0);
          bGoalMax = bMax + enhanceAmount * (255 - bMax);
          bGoalMin = bMin - enhanceAmount * (bMin - 0);
      }
      else {
          rMid = (rMax + rMin) * 0.5;
          rGoalMax = rMax + enhanceAmount * (rMax - rMid);
          rGoalMin = rMin + enhanceAmount * (rMin - rMid);
          gMid = (gMax + gMin) * 0.5;
          gGoalMax = gMax + enhanceAmount * (gMax - gMid);
          gGoalMin = gMin + enhanceAmount * (gMin - gMid);
          bMid = (bMax + bMin) * 0.5;
          bGoalMax = bMax + enhanceAmount * (bMax - bMid);
          bGoalMin = bMin + enhanceAmount * (bMin - bMid);
      }
      for (i = 0; i < nSubPixels; i += 4) {
          data[i + 0] = remap(data[i + 0], rMin, rMax, rGoalMin, rGoalMax);
          data[i + 1] = remap(data[i + 1], gMin, gMax, gGoalMin, gGoalMax);
          data[i + 2] = remap(data[i + 2], bMin, bMax, bGoalMin, bGoalMax);
      }
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'enhance', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  });

  unwrapExports(Enhance);
  var Enhance_1 = Enhance.Enhance;

  var Grayscale = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Grayscale = function (imageData) {
      var data = imageData.data, len = data.length, i, brightness;
      for (i = 0; i < len; i += 4) {
          brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
          data[i] = brightness;
          data[i + 1] = brightness;
          data[i + 2] = brightness;
      }
  };
  });

  unwrapExports(Grayscale);
  var Grayscale_1 = Grayscale.Grayscale;

  var HSL = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  Factory.Factory.addGetterSetter(Node_1.Node, 'hue', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  Factory.Factory.addGetterSetter(Node_1.Node, 'saturation', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  Factory.Factory.addGetterSetter(Node_1.Node, 'luminance', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  exports.HSL = function (imageData) {
      var data = imageData.data, nPixels = data.length, v = 1, s = Math.pow(2, this.saturation()), h = Math.abs(this.hue() + 360) % 360, l = this.luminance() * 127, i;
      var vsu = v * s * Math.cos((h * Math.PI) / 180), vsw = v * s * Math.sin((h * Math.PI) / 180);
      var rr = 0.299 * v + 0.701 * vsu + 0.167 * vsw, rg = 0.587 * v - 0.587 * vsu + 0.33 * vsw, rb = 0.114 * v - 0.114 * vsu - 0.497 * vsw;
      var gr = 0.299 * v - 0.299 * vsu - 0.328 * vsw, gg = 0.587 * v + 0.413 * vsu + 0.035 * vsw, gb = 0.114 * v - 0.114 * vsu + 0.293 * vsw;
      var br = 0.299 * v - 0.3 * vsu + 1.25 * vsw, bg = 0.587 * v - 0.586 * vsu - 1.05 * vsw, bb = 0.114 * v + 0.886 * vsu - 0.2 * vsw;
      var r, g, b, a;
      for (i = 0; i < nPixels; i += 4) {
          r = data[i + 0];
          g = data[i + 1];
          b = data[i + 2];
          a = data[i + 3];
          data[i + 0] = rr * r + rg * g + rb * b + l;
          data[i + 1] = gr * r + gg * g + gb * b + l;
          data[i + 2] = br * r + bg * g + bb * b + l;
          data[i + 3] = a;
      }
  };
  });

  unwrapExports(HSL);
  var HSL_1 = HSL.HSL;

  var HSV = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  exports.HSV = function (imageData) {
      var data = imageData.data, nPixels = data.length, v = Math.pow(2, this.value()), s = Math.pow(2, this.saturation()), h = Math.abs(this.hue() + 360) % 360, i;
      var vsu = v * s * Math.cos((h * Math.PI) / 180), vsw = v * s * Math.sin((h * Math.PI) / 180);
      var rr = 0.299 * v + 0.701 * vsu + 0.167 * vsw, rg = 0.587 * v - 0.587 * vsu + 0.33 * vsw, rb = 0.114 * v - 0.114 * vsu - 0.497 * vsw;
      var gr = 0.299 * v - 0.299 * vsu - 0.328 * vsw, gg = 0.587 * v + 0.413 * vsu + 0.035 * vsw, gb = 0.114 * v - 0.114 * vsu + 0.293 * vsw;
      var br = 0.299 * v - 0.3 * vsu + 1.25 * vsw, bg = 0.587 * v - 0.586 * vsu - 1.05 * vsw, bb = 0.114 * v + 0.886 * vsu - 0.2 * vsw;
      var r, g, b, a;
      for (i = 0; i < nPixels; i += 4) {
          r = data[i + 0];
          g = data[i + 1];
          b = data[i + 2];
          a = data[i + 3];
          data[i + 0] = rr * r + rg * g + rb * b;
          data[i + 1] = gr * r + gg * g + gb * b;
          data[i + 2] = br * r + bg * g + bb * b;
          data[i + 3] = a;
      }
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'hue', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  Factory.Factory.addGetterSetter(Node_1.Node, 'saturation', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  Factory.Factory.addGetterSetter(Node_1.Node, 'value', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  });

  unwrapExports(HSV);
  var HSV_1 = HSV.HSV;

  var Invert = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Invert = function (imageData) {
      var data = imageData.data, len = data.length, i;
      for (i = 0; i < len; i += 4) {
          data[i] = 255 - data[i];
          data[i + 1] = 255 - data[i + 1];
          data[i + 2] = 255 - data[i + 2];
      }
  };
  });

  unwrapExports(Invert);
  var Invert_1 = Invert.Invert;

  var Kaleidoscope = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });




  var ToPolar = function (src, dst, opt) {
      var srcPixels = src.data, dstPixels = dst.data, xSize = src.width, ySize = src.height, xMid = opt.polarCenterX || xSize / 2, yMid = opt.polarCenterY || ySize / 2, i, x, y, r = 0, g = 0, b = 0, a = 0;
      var rad, rMax = Math.sqrt(xMid * xMid + yMid * yMid);
      x = xSize - xMid;
      y = ySize - yMid;
      rad = Math.sqrt(x * x + y * y);
      rMax = rad > rMax ? rad : rMax;
      var rSize = ySize, tSize = xSize, radius, theta;
      var conversion = ((360 / tSize) * Math.PI) / 180, sin, cos;
      for (theta = 0; theta < tSize; theta += 1) {
          sin = Math.sin(theta * conversion);
          cos = Math.cos(theta * conversion);
          for (radius = 0; radius < rSize; radius += 1) {
              x = Math.floor(xMid + ((rMax * radius) / rSize) * cos);
              y = Math.floor(yMid + ((rMax * radius) / rSize) * sin);
              i = (y * xSize + x) * 4;
              r = srcPixels[i + 0];
              g = srcPixels[i + 1];
              b = srcPixels[i + 2];
              a = srcPixels[i + 3];
              i = (theta + radius * xSize) * 4;
              dstPixels[i + 0] = r;
              dstPixels[i + 1] = g;
              dstPixels[i + 2] = b;
              dstPixels[i + 3] = a;
          }
      }
  };
  var FromPolar = function (src, dst, opt) {
      var srcPixels = src.data, dstPixels = dst.data, xSize = src.width, ySize = src.height, xMid = opt.polarCenterX || xSize / 2, yMid = opt.polarCenterY || ySize / 2, i, x, y, dx, dy, r = 0, g = 0, b = 0, a = 0;
      var rad, rMax = Math.sqrt(xMid * xMid + yMid * yMid);
      x = xSize - xMid;
      y = ySize - yMid;
      rad = Math.sqrt(x * x + y * y);
      rMax = rad > rMax ? rad : rMax;
      var rSize = ySize, tSize = xSize, radius, theta, phaseShift = opt.polarRotation || 0;
      var x1, y1;
      for (x = 0; x < xSize; x += 1) {
          for (y = 0; y < ySize; y += 1) {
              dx = x - xMid;
              dy = y - yMid;
              radius = (Math.sqrt(dx * dx + dy * dy) * rSize) / rMax;
              theta = ((Math.atan2(dy, dx) * 180) / Math.PI + 360 + phaseShift) % 360;
              theta = (theta * tSize) / 360;
              x1 = Math.floor(theta);
              y1 = Math.floor(radius);
              i = (y1 * xSize + x1) * 4;
              r = srcPixels[i + 0];
              g = srcPixels[i + 1];
              b = srcPixels[i + 2];
              a = srcPixels[i + 3];
              i = (y * xSize + x) * 4;
              dstPixels[i + 0] = r;
              dstPixels[i + 1] = g;
              dstPixels[i + 2] = b;
              dstPixels[i + 3] = a;
          }
      }
  };
  exports.Kaleidoscope = function (imageData) {
      var xSize = imageData.width, ySize = imageData.height;
      var x, y, xoff, i, r, g, b, a, srcPos, dstPos;
      var power = Math.round(this.kaleidoscopePower());
      var angle = Math.round(this.kaleidoscopeAngle());
      var offset = Math.floor((xSize * (angle % 360)) / 360);
      if (power < 1) {
          return;
      }
      var tempCanvas = Util.Util.createCanvasElement();
      tempCanvas.width = xSize;
      tempCanvas.height = ySize;
      var scratchData = tempCanvas
          .getContext('2d')
          .getImageData(0, 0, xSize, ySize);
      ToPolar(imageData, scratchData, {
          polarCenterX: xSize / 2,
          polarCenterY: ySize / 2
      });
      var minSectionSize = xSize / Math.pow(2, power);
      while (minSectionSize <= 8) {
          minSectionSize = minSectionSize * 2;
          power -= 1;
      }
      minSectionSize = Math.ceil(minSectionSize);
      var sectionSize = minSectionSize;
      var xStart = 0, xEnd = sectionSize, xDelta = 1;
      if (offset + minSectionSize > xSize) {
          xStart = sectionSize;
          xEnd = 0;
          xDelta = -1;
      }
      for (y = 0; y < ySize; y += 1) {
          for (x = xStart; x !== xEnd; x += xDelta) {
              xoff = Math.round(x + offset) % xSize;
              srcPos = (xSize * y + xoff) * 4;
              r = scratchData.data[srcPos + 0];
              g = scratchData.data[srcPos + 1];
              b = scratchData.data[srcPos + 2];
              a = scratchData.data[srcPos + 3];
              dstPos = (xSize * y + x) * 4;
              scratchData.data[dstPos + 0] = r;
              scratchData.data[dstPos + 1] = g;
              scratchData.data[dstPos + 2] = b;
              scratchData.data[dstPos + 3] = a;
          }
      }
      for (y = 0; y < ySize; y += 1) {
          sectionSize = Math.floor(minSectionSize);
          for (i = 0; i < power; i += 1) {
              for (x = 0; x < sectionSize + 1; x += 1) {
                  srcPos = (xSize * y + x) * 4;
                  r = scratchData.data[srcPos + 0];
                  g = scratchData.data[srcPos + 1];
                  b = scratchData.data[srcPos + 2];
                  a = scratchData.data[srcPos + 3];
                  dstPos = (xSize * y + sectionSize * 2 - x - 1) * 4;
                  scratchData.data[dstPos + 0] = r;
                  scratchData.data[dstPos + 1] = g;
                  scratchData.data[dstPos + 2] = b;
                  scratchData.data[dstPos + 3] = a;
              }
              sectionSize *= 2;
          }
      }
      FromPolar(scratchData, imageData, { polarRotation: 0 });
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'kaleidoscopePower', 2, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  Factory.Factory.addGetterSetter(Node_1.Node, 'kaleidoscopeAngle', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  });

  unwrapExports(Kaleidoscope);
  var Kaleidoscope_1 = Kaleidoscope.Kaleidoscope;

  var Mask = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  function pixelAt(idata, x, y) {
      var idx = (y * idata.width + x) * 4;
      var d = [];
      d.push(idata.data[idx++], idata.data[idx++], idata.data[idx++], idata.data[idx++]);
      return d;
  }
  function rgbDistance(p1, p2) {
      return Math.sqrt(Math.pow(p1[0] - p2[0], 2) +
          Math.pow(p1[1] - p2[1], 2) +
          Math.pow(p1[2] - p2[2], 2));
  }
  function rgbMean(pTab) {
      var m = [0, 0, 0];
      for (var i = 0; i < pTab.length; i++) {
          m[0] += pTab[i][0];
          m[1] += pTab[i][1];
          m[2] += pTab[i][2];
      }
      m[0] /= pTab.length;
      m[1] /= pTab.length;
      m[2] /= pTab.length;
      return m;
  }
  function backgroundMask(idata, threshold) {
      var rgbv_no = pixelAt(idata, 0, 0);
      var rgbv_ne = pixelAt(idata, idata.width - 1, 0);
      var rgbv_so = pixelAt(idata, 0, idata.height - 1);
      var rgbv_se = pixelAt(idata, idata.width - 1, idata.height - 1);
      var thres = threshold || 10;
      if (rgbDistance(rgbv_no, rgbv_ne) < thres &&
          rgbDistance(rgbv_ne, rgbv_se) < thres &&
          rgbDistance(rgbv_se, rgbv_so) < thres &&
          rgbDistance(rgbv_so, rgbv_no) < thres) {
          var mean = rgbMean([rgbv_ne, rgbv_no, rgbv_se, rgbv_so]);
          var mask = [];
          for (var i = 0; i < idata.width * idata.height; i++) {
              var d = rgbDistance(mean, [
                  idata.data[i * 4],
                  idata.data[i * 4 + 1],
                  idata.data[i * 4 + 2]
              ]);
              mask[i] = d < thres ? 0 : 255;
          }
          return mask;
      }
  }
  function applyMask(idata, mask) {
      for (var i = 0; i < idata.width * idata.height; i++) {
          idata.data[4 * i + 3] = mask[i];
      }
  }
  function erodeMask(mask, sw, sh) {
      var weights = [1, 1, 1, 1, 0, 1, 1, 1, 1];
      var side = Math.round(Math.sqrt(weights.length));
      var halfSide = Math.floor(side / 2);
      var maskResult = [];
      for (var y = 0; y < sh; y++) {
          for (var x = 0; x < sw; x++) {
              var so = y * sw + x;
              var a = 0;
              for (var cy = 0; cy < side; cy++) {
                  for (var cx = 0; cx < side; cx++) {
                      var scy = y + cy - halfSide;
                      var scx = x + cx - halfSide;
                      if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                          var srcOff = scy * sw + scx;
                          var wt = weights[cy * side + cx];
                          a += mask[srcOff] * wt;
                      }
                  }
              }
              maskResult[so] = a === 255 * 8 ? 255 : 0;
          }
      }
      return maskResult;
  }
  function dilateMask(mask, sw, sh) {
      var weights = [1, 1, 1, 1, 1, 1, 1, 1, 1];
      var side = Math.round(Math.sqrt(weights.length));
      var halfSide = Math.floor(side / 2);
      var maskResult = [];
      for (var y = 0; y < sh; y++) {
          for (var x = 0; x < sw; x++) {
              var so = y * sw + x;
              var a = 0;
              for (var cy = 0; cy < side; cy++) {
                  for (var cx = 0; cx < side; cx++) {
                      var scy = y + cy - halfSide;
                      var scx = x + cx - halfSide;
                      if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                          var srcOff = scy * sw + scx;
                          var wt = weights[cy * side + cx];
                          a += mask[srcOff] * wt;
                      }
                  }
              }
              maskResult[so] = a >= 255 * 4 ? 255 : 0;
          }
      }
      return maskResult;
  }
  function smoothEdgeMask(mask, sw, sh) {
      var weights = [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9];
      var side = Math.round(Math.sqrt(weights.length));
      var halfSide = Math.floor(side / 2);
      var maskResult = [];
      for (var y = 0; y < sh; y++) {
          for (var x = 0; x < sw; x++) {
              var so = y * sw + x;
              var a = 0;
              for (var cy = 0; cy < side; cy++) {
                  for (var cx = 0; cx < side; cx++) {
                      var scy = y + cy - halfSide;
                      var scx = x + cx - halfSide;
                      if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                          var srcOff = scy * sw + scx;
                          var wt = weights[cy * side + cx];
                          a += mask[srcOff] * wt;
                      }
                  }
              }
              maskResult[so] = a;
          }
      }
      return maskResult;
  }
  exports.Mask = function (imageData) {
      var threshold = this.threshold(), mask = backgroundMask(imageData, threshold);
      if (mask) {
          mask = erodeMask(mask, imageData.width, imageData.height);
          mask = dilateMask(mask, imageData.width, imageData.height);
          mask = smoothEdgeMask(mask, imageData.width, imageData.height);
          applyMask(imageData, mask);
      }
      return imageData;
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'threshold', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  });

  unwrapExports(Mask);
  var Mask_1 = Mask.Mask;

  var Noise = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  exports.Noise = function (imageData) {
      var amount = this.noise() * 255, data = imageData.data, nPixels = data.length, half = amount / 2, i;
      for (i = 0; i < nPixels; i += 4) {
          data[i + 0] += half - 2 * half * Math.random();
          data[i + 1] += half - 2 * half * Math.random();
          data[i + 2] += half - 2 * half * Math.random();
      }
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'noise', 0.2, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  });

  unwrapExports(Noise);
  var Noise_1 = Noise.Noise;

  var Pixelate = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });




  exports.Pixelate = function (imageData) {
      var pixelSize = Math.ceil(this.pixelSize()), width = imageData.width, height = imageData.height, x, y, i, red, green, blue, alpha, nBinsX = Math.ceil(width / pixelSize), nBinsY = Math.ceil(height / pixelSize), xBinStart, xBinEnd, yBinStart, yBinEnd, xBin, yBin, pixelsInBin, data = imageData.data;
      if (pixelSize <= 0) {
          Util.Util.error('pixelSize value can not be <= 0');
          return;
      }
      for (xBin = 0; xBin < nBinsX; xBin += 1) {
          for (yBin = 0; yBin < nBinsY; yBin += 1) {
              red = 0;
              green = 0;
              blue = 0;
              alpha = 0;
              xBinStart = xBin * pixelSize;
              xBinEnd = xBinStart + pixelSize;
              yBinStart = yBin * pixelSize;
              yBinEnd = yBinStart + pixelSize;
              pixelsInBin = 0;
              for (x = xBinStart; x < xBinEnd; x += 1) {
                  if (x >= width) {
                      continue;
                  }
                  for (y = yBinStart; y < yBinEnd; y += 1) {
                      if (y >= height) {
                          continue;
                      }
                      i = (width * y + x) * 4;
                      red += data[i + 0];
                      green += data[i + 1];
                      blue += data[i + 2];
                      alpha += data[i + 3];
                      pixelsInBin += 1;
                  }
              }
              red = red / pixelsInBin;
              green = green / pixelsInBin;
              blue = blue / pixelsInBin;
              alpha = alpha / pixelsInBin;
              for (x = xBinStart; x < xBinEnd; x += 1) {
                  if (x >= width) {
                      continue;
                  }
                  for (y = yBinStart; y < yBinEnd; y += 1) {
                      if (y >= height) {
                          continue;
                      }
                      i = (width * y + x) * 4;
                      data[i + 0] = red;
                      data[i + 1] = green;
                      data[i + 2] = blue;
                      data[i + 3] = alpha;
                  }
              }
          }
      }
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'pixelSize', 8, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  });

  unwrapExports(Pixelate);
  var Pixelate_1 = Pixelate.Pixelate;

  var Posterize = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  exports.Posterize = function (imageData) {
      var levels = Math.round(this.levels() * 254) + 1, data = imageData.data, len = data.length, scale = 255 / levels, i;
      for (i = 0; i < len; i += 1) {
          data[i] = Math.floor(data[i] / scale) * scale;
      }
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'levels', 0.5, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  });

  unwrapExports(Posterize);
  var Posterize_1 = Posterize.Posterize;

  var RGB = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  exports.RGB = function (imageData) {
      var data = imageData.data, nPixels = data.length, red = this.red(), green = this.green(), blue = this.blue(), i, brightness;
      for (i = 0; i < nPixels; i += 4) {
          brightness =
              (0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]) / 255;
          data[i] = brightness * red;
          data[i + 1] = brightness * green;
          data[i + 2] = brightness * blue;
          data[i + 3] = data[i + 3];
      }
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'red', 0, function (val) {
      this._filterUpToDate = false;
      if (val > 255) {
          return 255;
      }
      else if (val < 0) {
          return 0;
      }
      else {
          return Math.round(val);
      }
  });
  Factory.Factory.addGetterSetter(Node_1.Node, 'green', 0, function (val) {
      this._filterUpToDate = false;
      if (val > 255) {
          return 255;
      }
      else if (val < 0) {
          return 0;
      }
      else {
          return Math.round(val);
      }
  });
  Factory.Factory.addGetterSetter(Node_1.Node, 'blue', 0, Validators.RGBComponent, Factory.Factory.afterSetFilter);
  });

  unwrapExports(RGB);
  var RGB_1 = RGB.RGB;

  var RGBA = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  exports.RGBA = function (imageData) {
      var data = imageData.data, nPixels = data.length, red = this.red(), green = this.green(), blue = this.blue(), alpha = this.alpha(), i, ia;
      for (i = 0; i < nPixels; i += 4) {
          ia = 1 - alpha;
          data[i] = red * alpha + data[i] * ia;
          data[i + 1] = green * alpha + data[i + 1] * ia;
          data[i + 2] = blue * alpha + data[i + 2] * ia;
      }
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'red', 0, function (val) {
      this._filterUpToDate = false;
      if (val > 255) {
          return 255;
      }
      else if (val < 0) {
          return 0;
      }
      else {
          return Math.round(val);
      }
  });
  Factory.Factory.addGetterSetter(Node_1.Node, 'green', 0, function (val) {
      this._filterUpToDate = false;
      if (val > 255) {
          return 255;
      }
      else if (val < 0) {
          return 0;
      }
      else {
          return Math.round(val);
      }
  });
  Factory.Factory.addGetterSetter(Node_1.Node, 'blue', 0, Validators.RGBComponent, Factory.Factory.afterSetFilter);
  Factory.Factory.addGetterSetter(Node_1.Node, 'alpha', 1, function (val) {
      this._filterUpToDate = false;
      if (val > 1) {
          return 1;
      }
      else if (val < 0) {
          return 0;
      }
      else {
          return val;
      }
  });
  });

  unwrapExports(RGBA);
  var RGBA_1 = RGBA.RGBA;

  var Sepia = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Sepia = function (imageData) {
      var data = imageData.data, nPixels = data.length, i, r, g, b;
      for (i = 0; i < nPixels; i += 4) {
          r = data[i + 0];
          g = data[i + 1];
          b = data[i + 2];
          data[i + 0] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
          data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
          data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
      }
  };
  });

  unwrapExports(Sepia);
  var Sepia_1 = Sepia.Sepia;

  var Solarize = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Solarize = function (imageData) {
      var data = imageData.data, w = imageData.width, h = imageData.height, w4 = w * 4, y = h;
      do {
          var offsetY = (y - 1) * w4;
          var x = w;
          do {
              var offset = offsetY + (x - 1) * 4;
              var r = data[offset];
              var g = data[offset + 1];
              var b = data[offset + 2];
              if (r > 127) {
                  r = 255 - r;
              }
              if (g > 127) {
                  g = 255 - g;
              }
              if (b > 127) {
                  b = 255 - b;
              }
              data[offset] = r;
              data[offset + 1] = g;
              data[offset + 2] = b;
          } while (--x);
      } while (--y);
  };
  });

  unwrapExports(Solarize);
  var Solarize_1 = Solarize.Solarize;

  var Threshold = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  exports.Threshold = function (imageData) {
      var level = this.threshold() * 255, data = imageData.data, len = data.length, i;
      for (i = 0; i < len; i += 1) {
          data[i] = data[i] < level ? 0 : 255;
      }
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'threshold', 0.5, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  });

  unwrapExports(Threshold);
  var Threshold_1 = Threshold.Threshold;

  var _FullInternals = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });





































  exports.Konva = _CoreInternals.Konva.Util._assign(_CoreInternals.Konva, {
      Arc: Arc_1.Arc,
      Arrow: Arrow_1.Arrow,
      Circle: Circle_1.Circle,
      Ellipse: Ellipse_1.Ellipse,
      Image: Image_1.Image,
      Label: Label_1.Label,
      Tag: Label_1.Tag,
      Line: Line_1.Line,
      Path: Path_1.Path,
      Rect: Rect_1.Rect,
      RegularPolygon: RegularPolygon_1.RegularPolygon,
      Ring: Ring_1.Ring,
      Sprite: Sprite_1.Sprite,
      Star: Star_1.Star,
      Text: Text_1.Text,
      TextPath: TextPath_1.TextPath,
      Transformer: Transformer_1.Transformer,
      Wedge: Wedge_1.Wedge,
      Filters: {
          Blur: Blur.Blur,
          Brighten: Brighten.Brighten,
          Contrast: Contrast.Contrast,
          Emboss: Emboss.Emboss,
          Enhance: Enhance.Enhance,
          Grayscale: Grayscale.Grayscale,
          HSL: HSL.HSL,
          HSV: HSV.HSV,
          Invert: Invert.Invert,
          Kaleidoscope: Kaleidoscope.Kaleidoscope,
          Mask: Mask.Mask,
          Noise: Noise.Noise,
          Pixelate: Pixelate.Pixelate,
          Posterize: Posterize.Posterize,
          RGB: RGB.RGB,
          RGBA: RGBA.RGBA,
          Sepia: Sepia.Sepia,
          Solarize: Solarize.Solarize,
          Threshold: Threshold.Threshold
      }
  });
  });

  unwrapExports(_FullInternals);
  var _FullInternals_1 = _FullInternals.Konva;

  var lib = createCommonjsModule(function (module, exports) {
  var Konva = _FullInternals.Konva;
  Konva._injectGlobal(Konva);
  exports['default'] = Konva;
  module.exports = exports['default'];
  });

  var vueKonva = createCommonjsModule(function (module, exports) {
  /*!
   * vue-konva v2.1.2 - https://github.com/konvajs/vue-konva#readme
   * MIT Licensed
   */
  (function webpackUniversalModuleDefinition(root, factory) {
  	module.exports = factory(Vue, lib);
  })(commonjsGlobal, function(__WEBPACK_EXTERNAL_MODULE__0__, __WEBPACK_EXTERNAL_MODULE__2__) {
  return /******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
  /******/
  /******/ 		// Check if module is in cache
  /******/ 		if(installedModules[moduleId]) {
  /******/ 			return installedModules[moduleId].exports;
  /******/ 		}
  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = installedModules[moduleId] = {
  /******/ 			i: moduleId,
  /******/ 			l: false,
  /******/ 			exports: {}
  /******/ 		};
  /******/
  /******/ 		// Execute the module function
  /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  /******/
  /******/ 		// Flag the module as loaded
  /******/ 		module.l = true;
  /******/
  /******/ 		// Return the exports of the module
  /******/ 		return module.exports;
  /******/ 	}
  /******/
  /******/
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;
  /******/
  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;
  /******/
  /******/ 	// define getter function for harmony exports
  /******/ 	__webpack_require__.d = function(exports, name, getter) {
  /******/ 		if(!__webpack_require__.o(exports, name)) {
  /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
  /******/ 		}
  /******/ 	};
  /******/
  /******/ 	// define __esModule on exports
  /******/ 	__webpack_require__.r = function(exports) {
  /******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
  /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  /******/ 		}
  /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
  /******/ 	};
  /******/
  /******/ 	// create a fake namespace object
  /******/ 	// mode & 1: value is a module id, require it
  /******/ 	// mode & 2: merge all properties of value into the ns
  /******/ 	// mode & 4: return value when already ns object
  /******/ 	// mode & 8|1: behave like require
  /******/ 	__webpack_require__.t = function(value, mode) {
  /******/ 		if(mode & 1) value = __webpack_require__(value);
  /******/ 		if(mode & 8) return value;
  /******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
  /******/ 		var ns = Object.create(null);
  /******/ 		__webpack_require__.r(ns);
  /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
  /******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
  /******/ 		return ns;
  /******/ 	};
  /******/
  /******/ 	// getDefaultExport function for compatibility with non-harmony modules
  /******/ 	__webpack_require__.n = function(module) {
  /******/ 		var getter = module && module.__esModule ?
  /******/ 			function getDefault() { return module['default']; } :
  /******/ 			function getModuleExports() { return module; };
  /******/ 		__webpack_require__.d(getter, 'a', getter);
  /******/ 		return getter;
  /******/ 	};
  /******/
  /******/ 	// Object.prototype.hasOwnProperty.call
  /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  /******/
  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";
  /******/
  /******/
  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(__webpack_require__.s = 1);
  /******/ })
  /************************************************************************/
  /******/ ([
  /* 0 */
  /***/ (function(module, exports) {

  module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

  /***/ }),
  /* 1 */
  /***/ (function(module, exports, __webpack_require__) {

  module.exports = __webpack_require__(3);


  /***/ }),
  /* 2 */
  /***/ (function(module, exports) {

  module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

  /***/ }),
  /* 3 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  __webpack_require__.r(__webpack_exports__);

  // EXTERNAL MODULE: external {"root":"Vue","commonjs2":"vue","commonjs":"vue","amd":"vue"}
  var external_root_Vue_commonjs2_vue_commonjs_vue_amd_vue_ = __webpack_require__(0);
  var external_root_Vue_commonjs2_vue_commonjs_vue_amd_vue_default = /*#__PURE__*/__webpack_require__.n(external_root_Vue_commonjs2_vue_commonjs_vue_amd_vue_);

  // CONCATENATED MODULE: ./src/utils/updatePicture.js
  // adapted FROM: https://github.com/lavrton/react-konva/blob/master/src/react-konva-fiber.js

  function updatePicture(node) {
    var drawingNode = node.getLayer() || node.getStage();
    drawingNode && drawingNode.batchDraw();
  }
  // CONCATENATED MODULE: ./src/utils/applyNodeProps.js
  // adapted FROM: https://github.com/lavrton/react-konva/blob/master/src/react-konva-fiber.js



  var propsToSkip = { key: true, style: true, elm: true, isRootInsert: true };
  var EVENTS_NAMESPACE = '.vue-konva-event';

  function applyNodeProps(vueComponent) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var oldProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var instance = vueComponent._konvaNode;
    var updatedProps = {};
    var hasUpdates = false;
    for (var key in oldProps) {
      if (propsToSkip[key]) {
        continue;
      }
      var isEvent = key.slice(0, 2) === 'on';
      var propChanged = oldProps[key] !== props[key];
      if (isEvent && propChanged) {
        var eventName = key.substr(2).toLowerCase();
        if (eventName.substr(0, 7) === 'content') {
          eventName = 'content' + eventName.substr(7, 1).toUpperCase() + eventName.substr(8);
        }
        instance.off(eventName + EVENTS_NAMESPACE, oldProps[key]);
      }
      var toRemove = !props.hasOwnProperty(key);
      if (toRemove) {
        instance.setAttr(key, undefined);
      }
    }
    for (var _key in props) {
      if (propsToSkip[_key]) {
        continue;
      }
      var _isEvent = _key.slice(0, 2) === 'on';
      var toAdd = oldProps[_key] !== props[_key];
      if (_isEvent && toAdd) {
        var _eventName = _key.substr(2).toLowerCase();
        if (_eventName.substr(0, 7) === 'content') {
          _eventName = 'content' + _eventName.substr(7, 1).toUpperCase() + _eventName.substr(8);
        }
        if (props[_key]) {
          instance.off(_eventName + EVENTS_NAMESPACE);
          instance.on(_eventName + EVENTS_NAMESPACE, props[_key]);
        }
      }
      if (!_isEvent && props[_key] !== oldProps[_key]) {
        hasUpdates = true;
        updatedProps[_key] = props[_key];
      }
    }

    if (hasUpdates) {
      instance.setAttrs(updatedProps);
      updatePicture(instance);
    }
  }
  // CONCATENATED MODULE: ./src/utils/index.js



  var componentPrefix = 'v';
  var konvaNodeMarker = '_konvaNode';

  function createListener(obj) {
    var output = {};
    Object.keys(obj).forEach(function (eventName) {
      output['on' + eventName] = obj[eventName];
    });
    return output;
  }

  function findParentKonva(instance) {
    function re(instance) {
      if (instance._konvaNode) {
        return instance;
      }
      if (instance.$parent) {
        return re(instance.$parent);
      }
      return {};
    }
    return re(instance.$parent);
  }

  function findKonvaNode(instance) {
    if (!instance) {
      return null;
    }
    if (instance.$options[konvaNodeMarker]) {
      return instance.getNode();
    }
    if (instance.$children.length === 0) {
      return null;
    }
    return findKonvaNode(instance.$children[0]);
  }


  // CONCATENATED MODULE: ./src/components/Stage.js
  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };




  /* harmony default export */ var Stage = (external_root_Vue_commonjs2_vue_commonjs_vue_amd_vue_default.a.component('v-stage', {
    render: function render(createElement) {
      return createElement('div', this.$slots.default);
    },
    watch: {
      config: {
        handler: function handler(val) {
          this.uploadKonva();
        },

        deep: true
      }
    },
    props: {
      config: {
        type: Object,
        default: function _default() {
          return {};
        }
      }
    },

    created: function created() {
      this._konvaNode = new window.Konva.Stage({
        width: this.config.width,
        height: this.config.height,
        // create fake container, later it will be replaced with real div on the page
        container: document.createElement('div')
      });
    },
    mounted: function mounted() {
      this.$el.innerHTML = '';
      this._konvaNode.container(this.$el);
      this.uploadKonva();
      this.validateChildren();
    },
    updated: function updated() {
      this.uploadKonva();
      this.validateChildren();
    },
    beforeDestroy: function beforeDestroy() {
      this._konvaNode.destroy();
    },

    methods: {
      getNode: function getNode() {
        return this._konvaNode;
      },
      getStage: function getStage() {
        return this._konvaNode;
      },
      uploadKonva: function uploadKonva() {
        var oldProps = this.oldProps || {};
        var props = _extends({}, this.$attrs, this.config, createListener(this.$listeners));
        applyNodeProps(this, props, oldProps);
        this.oldProps = props;
      },
      validateChildren: function validateChildren() {
        // TODO: add a waring if we see non-Konva element here
        // this.$vnode.componentOptions.children.forEach(child => {
        //   console.log(child);
        // })
      }
    }
  }));
  // CONCATENATED MODULE: ./src/components/KonvaNode.js
  var KonvaNode_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



  var KonvaNode_EVENTS_NAMESPACE = '.vue-konva-event';

  var CONTAINERS = {
    Group: true,
    Layer: true,
    FastLayer: true,
    Label: true
  };

  /* harmony default export */ var KonvaNode = (function (nameNode) {
    var _ref;

    return _ref = {}, _ref[konvaNodeMarker] = true, _ref.render = function render(createElement) {
      // containers should be able to draw children
      var isContainer = CONTAINERS[nameNode];
      if (isContainer) {
        return createElement('slot', this.$slots.default);
      }
      // other elements are not containers
      return null;
    }, _ref.watch = {
      config: {
        handler: function handler(val) {
          this.uploadKonva();
        },

        deep: true
      }
    }, _ref.props = {
      config: {
        type: Object,
        default: function _default() {
          return {};
        }
      }
    }, _ref.created = function created() {
      this.initKonva();
    }, _ref.mounted = function mounted() {
      var parentVueInstance = findParentKonva(this);
      var parentKonvaNode = parentVueInstance._konvaNode;
      parentKonvaNode.add(this._konvaNode);
      updatePicture(this._konvaNode);
    }, _ref.updated = function updated() {
      this.uploadKonva();
      var needRedraw = false;
      // check indexes
      // somehow this.$children are not ordered correctly
      // so we have to dive-in into componentOptions of vnode
      // also componentOptions.children may have empty nodes, and other non Konva elements so we need to filter them first

      var children = this.$vnode.componentOptions.children || [];

      var nodes = [];
      children.forEach(function ($vnode) {
        var konvaNode = findKonvaNode($vnode.componentInstance);
        if (konvaNode) {
          nodes.push(konvaNode);
        }
        if ($vnode.componentInstance && !konvaNode) {
          var tag = $vnode.componentOptions.tag;

          console.error('vue-konva error: You are trying to render "' + tag + '" inside your component tree. Looks like it is not a Konva node. You can render only Konva components inside the Stage.');
        }
      });

      nodes.forEach(function (konvaNode, index) {
        if (konvaNode.getZIndex() !== index) {
          konvaNode.setZIndex(index);
          needRedraw = true;
        }
      });

      if (needRedraw) {
        updatePicture(this._konvaNode);
      }
    }, _ref.destroyed = function destroyed() {
      updatePicture(this._konvaNode);
      this._konvaNode.destroy();
      this._konvaNode.off(KonvaNode_EVENTS_NAMESPACE);
    }, _ref.methods = {
      getNode: function getNode() {
        return this._konvaNode;
      },
      getStage: function getStage() {
        return this._konvaNode;
      },
      initKonva: function initKonva() {
        var NodeClass = window.Konva[nameNode];

        if (!NodeClass) {
          console.error('vue-konva error: Can not find node ' + nameNode);
          return;
        }

        this._konvaNode = new NodeClass();
        this._konvaNode.VueComponent = this;

        this.uploadKonva();
      },
      uploadKonva: function uploadKonva() {
        var oldProps = this.oldProps || {};
        var props = KonvaNode_extends({}, this.$attrs, this.config, createListener(this.$listeners));
        applyNodeProps(this, props, oldProps);
        this.oldProps = props;
      }
    }, _ref;
  });
  // CONCATENATED MODULE: ./src/index.js




  if (typeof window !== 'undefined' && !window.Konva) {
    __webpack_require__(2);
  }

  var KONVA_NODES = ['Layer', 'FastLayer', 'Group', 'Label', 'Rect', 'Circle', 'Ellipse', 'Wedge', 'Line', 'Sprite', 'Image', 'Text', 'TextPath', 'Star', 'Ring', 'Arc', 'Tag', 'Path', 'RegularPolygon', 'Arrow', 'Shape', 'Transformer'];
  var components = [{
    name: 'Stage',
    component: Stage
  }].concat(KONVA_NODES.map(function (name) {
    return {
      name: name,
      component: KonvaNode(name)
    };
  }));

  var VueKonva = {
    install: function install(Vue, options) {
      var prefixToUse = componentPrefix;
      if (options && options.prefix) {
        prefixToUse = options.prefix;
      }
      components.forEach(function (k) {
        Vue.component('' + prefixToUse + k.name, k.component);
      });
    }
  };

  /* harmony default export */ var src = __webpack_exports__["default"] = (VueKonva);

  if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(VueKonva);
  }

  /***/ })
  /******/ ])["default"];
  });
  });

  var VueKonva = unwrapExports(vueKonva);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  const WORKER_URL = "./build/worker.js";
  var script = {
    data: function () {
      return {
        installDisabled: false,
        runDisabled: false,
        worker: null,
        install_status: "Disconnected",
        run_status: "Not Running",
        message: "",
        x_input: 4,
        y_input: 5,
        final_value: 0,
        logs: [],
        configKonva: {},
        configWorldLines: {},
        list: [],
        is_full_screen: false,
      };
    },
    created() {
      window.addEventListener("resize", this.drawSpaceTime);
    },
    destroyed() {
      window.removeEventListener("resize", this.drawSpaceTime);
    },
    mounted() {
      this.drawSpaceTime();
    },
    methods: {
      Installition: async function () {
        try {
          this.worker = await this.WorkerLoad();
          this.install_status = "Installition Complete !";
          this.installDisabled = true;
        } catch (e) {
          console.log(e);
          this.install_status = "Installition Error";
          this.logs.push({ text: "Installition Error" });
        }
      },

      Running: function () {
        try {
          this.worker.postMessage({ status: "run" });
          this.run_status = "App is Running";
          this.runDisabled = true;
          this.sendWindowsWorker();
          this.worker.onmessage = (e) => {
            try {
              let shape = decodeURIComponent(escape(window.atob(e.data)));
              let point = JSON.parse(shape);
              console.log(point);
              this.list.push(point);
              // send raw data to golang
            } catch (e) {
              // console.log(e);
            }
          };
        } catch (e) {
          this.run_status = "runing error";
          console.log(e);
        }
      },

      getRandomInt: function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },

      TurnOff: async function () {
        this.worker.postMessage({ status: "close" });
        this.installDisabled = false;
        this.runDisabled = false;
        this.install_status = "Disconnected";
        this.run_status = "Not Running";
      },

      WorkerTest: async function () {
        this.logs.push({ text: "WorkerTest" });
      },

      WorkerLoad: async function () {
        this.install_status = "Step 2: Loading Worker";
        return new Promise(function (resolve, reject) {
          let worker = new Worker(WORKER_URL);
          worker.postMessage({ status: "load" });
          worker.onmessage = (e) => {
            console.log(e.data);
            resolve(worker);
          };
          worker.onerror = function (err) {
            reject(err);
          };
        });
      },

      delay: async function (delayInms) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(2);
          }, delayInms);
        });
      },

      loadCanvasWindows: function (app_windows) {
        const height = app_windows.offsetHeight;
        const width = app_windows.offsetWidth;

        this.configKonva.width = width;
        this.configKonva.height = height;
        let out = {
          height: height,
          width: width,
        };
        return out;
      },
      drawWorldLines: function (windows) {
        return {
          sceneFunc: function (context, shape) {
            // X axis
            context.beginPath();
            context.moveTo(0, windows.height / 2);
            context.lineTo(windows.width, windows.height / 2);
            context.closePath();
            context.fillStrokeShape(shape);

            // Y axis
            context.beginPath();
            context.moveTo(windows.width / 2, 0);
            context.lineTo(windows.width / 2, windows.height);
            context.closePath();
            context.fillStrokeShape(shape);
          },
          fill: "white",
          stroke: "#ddd",
          strokeWidth: 1,
        };
      },
      loadCenterPoint: function (windows) {
        let pos = {
          x: windows.width / 2,
          y: windows.height / 2,
          r: 2,
          f: "#01b4b4",
        };
        this.list.push(pos);
      },

      drawSpaceTime: async function () {
        // check for full screen !
        try {
          this.is_full_screen = await JSON.parse(localStorage.wasm_full_screen);
        } catch (e) {
          // console.log(e);
        }
        let app_windows = await this.$refs.canvas_aria;

        if (!app_windows) {
          return;
        }

        let windows = await this.loadCanvasWindows(app_windows);

        //Draw world line
        this.configWorldLines = await this.drawWorldLines(windows);

        // Draw +
        await this.loadCenterPoint(windows);
        this.sendWindowsWorker();
      },
      fullScreen: function () {
        if (this.is_full_screen) {
          this.is_full_screen = false;
          localStorage.wasm_full_screen = false;
        } else {
          this.is_full_screen = true;
          localStorage.wasm_full_screen = true;
        }
        this.drawSpaceTime();
      },
      sendWindowsWorker: function () {
        if (this.runDisabled) {
          let app_windows = this.$refs.canvas_aria;
          let windows = this.loadCanvasWindows(app_windows);
          this.worker.postMessage({ status: "windows-size", windows: windows });
        }
      },
    },
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      const options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      let hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              const originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              const existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  const isOldIE = typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
      return (id, style) => addStyle(id, style);
  }
  let HEAD;
  const styles = {};
  function addStyle(id, css) {
      const group = isOldIE ? css.media || 'default' : id;
      const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
      if (!style.ids.has(id)) {
          style.ids.add(id);
          let code = css.source;
          if (css.map) {
              // https://developer.chrome.com/devtools/docs/javascript-debugging
              // this makes source maps inside style tags work properly in Chrome
              code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
              // http://stackoverflow.com/a/26603875
              code +=
                  '\n/*# sourceMappingURL=data:application/json;base64,' +
                      btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                      ' */';
          }
          if (!style.element) {
              style.element = document.createElement('style');
              style.element.type = 'text/css';
              if (css.media)
                  style.element.setAttribute('media', css.media);
              if (HEAD === undefined) {
                  HEAD = document.head || document.getElementsByTagName('head')[0];
              }
              HEAD.appendChild(style.element);
          }
          if ('styleSheet' in style.element) {
              style.styles.push(code);
              style.element.styleSheet.cssText = style.styles
                  .filter(Boolean)
                  .join('\n');
          }
          else {
              const index = style.ids.size - 1;
              const textNode = document.createTextNode(code);
              const nodes = style.element.childNodes;
              if (nodes[index])
                  style.element.removeChild(nodes[index]);
              if (nodes.length)
                  style.element.insertBefore(textNode, nodes[index]);
              else
                  style.element.appendChild(textNode);
          }
      }
  }

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { class: _vm.is_full_screen ? "full-screen app-windows" : "app-windows" },
      [
        _c("aside", { staticClass: "tools" }, [
          _c("div", { staticClass: "button-input" }, [
            _c(
              "button",
              {
                attrs: { disabled: _vm.installDisabled },
                on: { click: _vm.Installition }
              },
              [_vm._v("نصب نرم‌افزار")]
            ),
            _vm._v(" "),
            _c("span", [_vm._v(_vm._s(_vm.install_status))])
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "button-input" }, [
            _c(
              "button",
              {
                attrs: { disabled: _vm.runDisabled },
                on: { click: _vm.Running }
              },
              [_vm._v("اجرای نرم‌افزار")]
            ),
            _vm._v(" "),
            _c("span", [_vm._v(_vm._s(_vm.run_status))])
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "button-input" }, [
            _c(
              "button",
              {
                attrs: { disabled: !_vm.runDisabled },
                on: { click: _vm.TurnOff }
              },
              [_vm._v("غیرفعال سازی")]
            )
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "button-input" }, [
            _c("button", { on: { click: _vm.WorkerTest } }, [_vm._v("تست سرعت")])
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "button-input" }, [
            _vm.is_full_screen
              ? _c("button", { on: { click: _vm.fullScreen } }, [
                  _vm._v("خروج از تمام‌صفحه")
                ])
              : _c("button", { on: { click: _vm.fullScreen } }, [
                  _vm._v("تمام‌صفحه")
                ])
          ])
        ]),
        _vm._v(" "),
        _c("aside", { staticClass: "logger" }, [
          _c(
            "ol",
            _vm._l(_vm.logs, function(log) {
              return _c("li", { key: log }, [_vm._v(_vm._s(log.text))])
            }),
            0
          )
        ]),
        _vm._v(" "),
        _c(
          "main",
          { ref: "canvas_aria" },
          [
            _c(
              "v-stage",
              { ref: "stage", attrs: { config: _vm.configKonva } },
              [
                _c(
                  "v-layer",
                  { ref: "layer" },
                  [
                    _c("v-shape", { attrs: { config: _vm.configWorldLines } }),
                    _vm._v(" "),
                    _vm._l(_vm.list, function(item) {
                      return _c("v-circle", {
                        key: item.id,
                        ref: "particles",
                        refInFor: true,
                        attrs: {
                          config: {
                            x: item.x,
                            y: item.y,
                            radius: item.r,
                            fill: item.f
                          }
                        }
                      })
                    })
                  ],
                  2
                )
              ],
              1
            )
          ],
          1
        )
      ]
    )
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__ = function (inject) {
      if (!inject) return
      inject("data-v-4054ab13_0", { source: "\n.app-windows {\n  display: grid;\n  grid-template-areas:\n    \"tools main main main main main\"\n    \"logger main main main main main\";\n  grid-gap: 5px;\n  padding: 3px;\n  background: #f5f7f9;\n  width: 100%;\n  height: 500px;\n}\n.full-screen {\n  position: fixed;\n  bottom: 0;\n  top: 0;\n  z-index: 1000;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  height: 100%;\n}\n.app-windows > aside,\n.app-windows > main {\n  background-color: rgba(255, 255, 255, 0.8);\n}\n.app-windows aside {\n  grid-area: aside;\n}\n.app-windows .tools {\n  grid-area: tools;\n}\n.app-windows .logger ol {\n  display: flex;\n  flex-direction: column-reverse;\n}\n.app-windows .logger {\n  grid-area: logger;\n  font-size: 11px;\n  overflow-y: scroll;\n  text-align: right;\n}\n.app-windows main {\n  grid-area: main;\n}\n.app-windows main > div {\n  position: absolute;\n}\n.app-windows #canvas {\n  width: 100%;\n  background: #ddd;\n  height: 100%;\n}\n.app-windows .tools-input {\n  text-align: right;\n  white-space: nowrap;\n  direction: ltr;\n}\n.app-windows .tools input {\n  padding: 4px;\n  margin: 1px;\n  border: none;\n  width: 80px;\n  background: white;\n  margin-right: 10px;\n  text-align: center;\n  border-bottom: 1px solid #ddd;\n}\n.app-windows .button-input {\n  display: grid;\n  text-align: center;\n  border-bottom: 1px solid #f5f7f9;\n}\n.app-windows .button-input span {\n  padding: 0;\n  margin: -3px;\n  font-size: 0.7em;\n}\n.app-windows .tools button {\n  display: grid;\n  padding: 5px 0;\n  margin: 2px;\n  border: 1px solid #ddd;\n}\n", map: {"version":3,"sources":["/home/ali/Projects/konar.studio/surface-scanner/src/SurfaceScanner.vue"],"names":[],"mappings":";AAgPA;EACA,aAAA;EACA;;qCAEA;EACA,aAAA;EACA,YAAA;EACA,mBAAA;EACA,WAAA;EACA,aAAA;AACA;AAEA;EACA,eAAA;EACA,SAAA;EACA,MAAA;EACA,aAAA;EACA,QAAA;EACA,SAAA;EACA,OAAA;EACA,YAAA;AACA;AACA;;EAEA,0CAAA;AACA;AAEA;EACA,gBAAA;AACA;AAEA;EACA,gBAAA;AACA;AAEA;EACA,aAAA;EACA,8BAAA;AACA;AAEA;EACA,iBAAA;EACA,eAAA;EACA,kBAAA;EACA,iBAAA;AACA;AAEA;EACA,eAAA;AACA;AACA;EACA,kBAAA;AACA;AACA;EACA,WAAA;EACA,gBAAA;EACA,YAAA;AACA;AAEA;EACA,iBAAA;EACA,mBAAA;EACA,cAAA;AACA;AAEA;EACA,YAAA;EACA,WAAA;EACA,YAAA;EACA,WAAA;EACA,iBAAA;EACA,kBAAA;EACA,kBAAA;EACA,6BAAA;AACA;AAEA;EACA,aAAA;EACA,kBAAA;EACA,gCAAA;AACA;AACA;EACA,UAAA;EACA,YAAA;EACA,gBAAA;AACA;AACA;EACA,aAAA;EACA,cAAA;EACA,WAAA;EACA,sBAAA;AACA","file":"SurfaceScanner.vue","sourcesContent":["<template>\n  <div :class=\"is_full_screen ? 'full-screen app-windows' : 'app-windows'\">\n    <aside class=\"tools\">\n      <div class=\"button-input\">\n        <button v-on:click=\"Installition\" :disabled=\"installDisabled\">نصب نرم‌افزار</button>\n        <span>{{install_status}}</span>\n      </div>\n      <div class=\"button-input\">\n        <button v-on:click=\"Running\" :disabled=\"runDisabled\">اجرای نرم‌افزار</button>\n        <span>{{run_status}}</span>\n      </div>\n      <div class=\"button-input\">\n        <button v-on:click=\"TurnOff\" :disabled=\"!runDisabled\">غیرفعال سازی</button>\n      </div>\n      <div class=\"button-input\">\n        <button v-on:click=\"WorkerTest\">تست سرعت</button>\n      </div>\n      <div class=\"button-input\">\n        <button v-on:click=\"fullScreen\" v-if=\"is_full_screen\">خروج از تمام‌صفحه</button>\n        <button v-on:click=\"fullScreen\" v-else>تمام‌صفحه</button>\n      </div>\n    </aside>\n    <aside class=\"logger\">\n      <ol>\n        <li v-for=\"log in logs\" v-bind:key=\"log\">{{ log.text }}</li>\n      </ol>\n    </aside>\n    <main ref=\"canvas_aria\">\n      <v-stage ref=\"stage\" :config=\"configKonva\">\n        <v-layer ref=\"layer\">\n          <v-shape :config=\"configWorldLines\" />\n          <v-circle\n            ref=\"particles\"\n            v-for=\"item in list\"\n            :key=\"item.id\"\n            :config=\"{\n            x : item.x, y: item.y, radius: item.r, fill: item.f,\n          }\"\n          ></v-circle>\n        </v-layer>\n      </v-stage>\n    </main>\n  </div>\n</template>\n\n<script>\nconst WORKER_URL = \"./build/worker.js\";\nexport default {\n  data: function () {\n    return {\n      installDisabled: false,\n      runDisabled: false,\n      worker: null,\n      install_status: \"Disconnected\",\n      run_status: \"Not Running\",\n      message: \"\",\n      x_input: 4,\n      y_input: 5,\n      final_value: 0,\n      logs: [],\n      configKonva: {},\n      configWorldLines: {},\n      list: [],\n      is_full_screen: false,\n    };\n  },\n  created() {\n    window.addEventListener(\"resize\", this.drawSpaceTime);\n  },\n  destroyed() {\n    window.removeEventListener(\"resize\", this.drawSpaceTime);\n  },\n  mounted() {\n    this.drawSpaceTime();\n  },\n  methods: {\n    Installition: async function () {\n      try {\n        this.worker = await this.WorkerLoad();\n        this.install_status = \"Installition Complete !\";\n        this.installDisabled = true;\n      } catch (e) {\n        console.log(e);\n        this.install_status = \"Installition Error\";\n        this.logs.push({ text: \"Installition Error\" });\n      }\n    },\n\n    Running: function () {\n      try {\n        this.worker.postMessage({ status: \"run\" });\n        this.run_status = \"App is Running\";\n        this.runDisabled = true;\n        this.sendWindowsWorker();\n        this.worker.onmessage = (e) => {\n          try {\n            let shape = decodeURIComponent(escape(window.atob(e.data)));\n            let point = JSON.parse(shape);\n            console.log(point);\n            this.list.push(point);\n            // send raw data to golang\n          } catch (e) {\n            // console.log(e);\n          }\n        };\n      } catch (e) {\n        this.run_status = \"runing error\";\n        console.log(e);\n      }\n    },\n\n    getRandomInt: function (min, max) {\n      min = Math.ceil(min);\n      max = Math.floor(max);\n      return Math.floor(Math.random() * (max - min + 1)) + min;\n    },\n\n    TurnOff: async function () {\n      this.worker.postMessage({ status: \"close\" });\n      this.installDisabled = false;\n      this.runDisabled = false;\n      this.install_status = \"Disconnected\";\n      this.run_status = \"Not Running\";\n    },\n\n    WorkerTest: async function () {\n      this.logs.push({ text: \"WorkerTest\" });\n    },\n\n    WorkerLoad: async function () {\n      this.install_status = \"Step 2: Loading Worker\";\n      return new Promise(function (resolve, reject) {\n        let worker = new Worker(WORKER_URL);\n        worker.postMessage({ status: \"load\" });\n        worker.onmessage = (e) => {\n          console.log(e.data);\n          resolve(worker);\n        };\n        worker.onerror = function (err) {\n          reject(err);\n        };\n      });\n    },\n\n    delay: async function (delayInms) {\n      return new Promise((resolve) => {\n        setTimeout(() => {\n          resolve(2);\n        }, delayInms);\n      });\n    },\n\n    loadCanvasWindows: function (app_windows) {\n      const height = app_windows.offsetHeight;\n      const width = app_windows.offsetWidth;\n\n      this.configKonva.width = width;\n      this.configKonva.height = height;\n      let out = {\n        height: height,\n        width: width,\n      };\n      return out;\n    },\n    drawWorldLines: function (windows) {\n      return {\n        sceneFunc: function (context, shape) {\n          // X axis\n          context.beginPath();\n          context.moveTo(0, windows.height / 2);\n          context.lineTo(windows.width, windows.height / 2);\n          context.closePath();\n          context.fillStrokeShape(shape);\n\n          // Y axis\n          context.beginPath();\n          context.moveTo(windows.width / 2, 0);\n          context.lineTo(windows.width / 2, windows.height);\n          context.closePath();\n          context.fillStrokeShape(shape);\n        },\n        fill: \"white\",\n        stroke: \"#ddd\",\n        strokeWidth: 1,\n      };\n    },\n    loadCenterPoint: function (windows) {\n      let pos = {\n        x: windows.width / 2,\n        y: windows.height / 2,\n        r: 2,\n        f: \"#01b4b4\",\n      };\n      this.list.push(pos);\n    },\n\n    drawSpaceTime: async function () {\n      // check for full screen !\n      try {\n        this.is_full_screen = await JSON.parse(localStorage.wasm_full_screen);\n      } catch (e) {\n        // console.log(e);\n      }\n      let app_windows = await this.$refs.canvas_aria;\n\n      if (!app_windows) {\n        return;\n      }\n\n      let windows = await this.loadCanvasWindows(app_windows);\n\n      //Draw world line\n      this.configWorldLines = await this.drawWorldLines(windows);\n\n      // Draw +\n      await this.loadCenterPoint(windows);\n      this.sendWindowsWorker();\n    },\n    fullScreen: function () {\n      if (this.is_full_screen) {\n        this.is_full_screen = false;\n        localStorage.wasm_full_screen = false;\n      } else {\n        this.is_full_screen = true;\n        localStorage.wasm_full_screen = true;\n      }\n      this.drawSpaceTime();\n    },\n    sendWindowsWorker: function () {\n      if (this.runDisabled) {\n        let app_windows = this.$refs.canvas_aria;\n        let windows = this.loadCanvasWindows(app_windows);\n        this.worker.postMessage({ status: \"windows-size\", windows: windows });\n      }\n    },\n  },\n};\n</script>\n\n<style>\n.app-windows {\n  display: grid;\n  grid-template-areas:\n    \"tools main main main main main\"\n    \"logger main main main main main\";\n  grid-gap: 5px;\n  padding: 3px;\n  background: #f5f7f9;\n  width: 100%;\n  height: 500px;\n}\n\n.full-screen {\n  position: fixed;\n  bottom: 0;\n  top: 0;\n  z-index: 1000;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  height: 100%;\n}\n.app-windows > aside,\n.app-windows > main {\n  background-color: rgba(255, 255, 255, 0.8);\n}\n\n.app-windows aside {\n  grid-area: aside;\n}\n\n.app-windows .tools {\n  grid-area: tools;\n}\n\n.app-windows .logger ol {\n  display: flex;\n  flex-direction: column-reverse;\n}\n\n.app-windows .logger {\n  grid-area: logger;\n  font-size: 11px;\n  overflow-y: scroll;\n  text-align: right;\n}\n\n.app-windows main {\n  grid-area: main;\n}\n.app-windows main > div {\n  position: absolute;\n}\n.app-windows #canvas {\n  width: 100%;\n  background: #ddd;\n  height: 100%;\n}\n\n.app-windows .tools-input {\n  text-align: right;\n  white-space: nowrap;\n  direction: ltr;\n}\n\n.app-windows .tools input {\n  padding: 4px;\n  margin: 1px;\n  border: none;\n  width: 80px;\n  background: white;\n  margin-right: 10px;\n  text-align: center;\n  border-bottom: 1px solid #ddd;\n}\n\n.app-windows .button-input {\n  display: grid;\n  text-align: center;\n  border-bottom: 1px solid #f5f7f9;\n}\n.app-windows .button-input span {\n  padding: 0;\n  margin: -3px;\n  font-size: 0.7em;\n}\n.app-windows .tools button {\n  display: grid;\n  padding: 5px 0;\n  margin: 2px;\n  border: 1px solid #ddd;\n}\n</style>"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__ = undefined;
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__ = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      createInjector,
      undefined,
      undefined
    );

  Vue.use(VueKonva);
  new Vue({
    el: '#wasm-windows',
    // delimiters: ["[[", "]]"],
    render: (h) => h(__vue_component__),

  });

}());
//# sourceMappingURL=wasmApp-core.js.map
