(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("mobx"));
	else if(typeof define === 'function' && define.amd)
		define(["mobx"], factory);
	else if(typeof exports === 'object')
		exports["index"] = factory(require("mobx"));
	else
		root["index"] = factory(root["mobx"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = __webpack_require__(2);
var utils_1 = __webpack_require__(1);
/**
 * MobxPromise provides an observable interface for a computed promise.
 * @author adufilie http://github.com/adufilie
 */

var MobxPromiseImpl = function () {
    function MobxPromiseImpl(input, defaultResult) {
        _classCallCheck(this, MobxPromiseImpl);

        this.invokeId = 0;
        this._latestInvokeId = 0;
        this.internalStatus = 'pending';
        this.internalResult = undefined;
        this.internalError = undefined;
        input = MobxPromiseImpl.normalizeInput(input, defaultResult);
        this.await = input.await;
        this.invoke = input.invoke;
        this.defaultResult = input.default;
        this.reaction = input.reaction;
    }

    _createClass(MobxPromiseImpl, [{
        key: "setPending",
        value: function setPending(invokeId, promise) {
            var _this = this;

            this.invokeId = invokeId;
            promise.then(function (result) {
                return _this.setComplete(invokeId, result);
            }, function (error) {
                return _this.setError(invokeId, error);
            });
            this.internalStatus = 'pending';
        }
    }, {
        key: "setComplete",
        value: function setComplete(invokeId, result) {
            if (invokeId === this.invokeId) {
                this.internalResult = result;
                this.internalStatus = 'complete';
                if (this.reaction) this.reaction(this.result);
            }
        }
    }, {
        key: "setError",
        value: function setError(invokeId, error) {
            if (invokeId === this.invokeId) {
                this.internalError = error;
                this.internalStatus = 'error';
            }
        }
    }, {
        key: "status",
        get: function get() {
            // wait until all MobxPromise dependencies are complete
            if (this.await) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.await()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var mobxPromise = _step.value;

                        if (!mobxPromise.isComplete) return mobxPromise.status;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }var status = this.internalStatus; // force mobx to track changes to internalStatus
            if (this.latestInvokeId != this.invokeId) status = 'pending';
            return status;
        }
    }, {
        key: "isPending",
        get: function get() {
            return this.status == 'pending';
        }
    }, {
        key: "isComplete",
        get: function get() {
            return this.status == 'complete';
        }
    }, {
        key: "isError",
        get: function get() {
            return this.status == 'error';
        }
    }, {
        key: "result",
        get: function get() {
            // checking status may trigger invoke
            if (this.isError || this.internalResult == null) return this.defaultResult;
            return this.internalResult;
        }
    }, {
        key: "error",
        get: function get() {
            // checking status may trigger invoke
            if (this.isError && this.await) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.await()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var mobxPromise = _step2.value;

                        if (mobxPromise.isError) return mobxPromise.error;
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }return this.internalError;
        }
        /**
         * This lets mobx determine when to call this.invoke(),
         * taking advantage of caching based on observable property access tracking.
         */

    }, {
        key: "latestInvokeId",
        get: function get() {
            var _this2 = this;

            window.clearTimeout(this._latestInvokeId);
            var promise = this.invoke();
            var invokeId = window.setTimeout(function () {
                return _this2.setPending(invokeId, promise);
            });
            return this._latestInvokeId = invokeId;
        }
    }], [{
        key: "isPromiseLike",
        value: function isPromiseLike(value) {
            return value != null && (typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object' && typeof value.then === 'function';
        }
    }, {
        key: "normalizeInput",
        value: function normalizeInput(input, defaultResult) {
            if (typeof input === 'function') return { invoke: input, default: defaultResult };
            if (MobxPromiseImpl.isPromiseLike(input)) return { invoke: function invoke() {
                    return input;
                }, default: defaultResult };
            input = input;
            if (defaultResult !== undefined) input = Object.assign({}, input, { default: defaultResult });
            return input;
        }
    }]);

    return MobxPromiseImpl;
}();

__decorate([mobx_1.observable], MobxPromiseImpl.prototype, "internalStatus", void 0);
__decorate([mobx_1.observable.ref], MobxPromiseImpl.prototype, "internalResult", void 0);
__decorate([mobx_1.observable.ref], MobxPromiseImpl.prototype, "internalError", void 0);
__decorate([utils_1.cached], MobxPromiseImpl.prototype, "status", null);
__decorate([utils_1.cached], MobxPromiseImpl.prototype, "isPending", null);
__decorate([utils_1.cached], MobxPromiseImpl.prototype, "isComplete", null);
__decorate([utils_1.cached], MobxPromiseImpl.prototype, "isError", null);
__decorate([utils_1.cached], MobxPromiseImpl.prototype, "result", null);
__decorate([utils_1.cached], MobxPromiseImpl.prototype, "error", null);
__decorate([utils_1.cached], MobxPromiseImpl.prototype, "latestInvokeId", null);
__decorate([mobx_1.action], MobxPromiseImpl.prototype, "setPending", null);
__decorate([mobx_1.action], MobxPromiseImpl.prototype, "setComplete", null);
__decorate([mobx_1.action], MobxPromiseImpl.prototype, "setError", null);
exports.MobxPromiseImpl = MobxPromiseImpl;
exports.MobxPromise = MobxPromiseImpl;
exports.default = exports.MobxPromise;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = __webpack_require__(2);
var MobxPromise_1 = __webpack_require__(0);
/**
 * A decorator for creating a <code>@computed</code> property that will be cached
 * after the first time it is accessed, even if it becomes unobserved later.
 * @param target
 * @param propertyKey
 * @param descriptor
 */
function cached(target, propertyKey, descriptor) {
    if (descriptor.get) {
        var firstTime = true;
        var get = descriptor.get;
        descriptor.get = function () {
            if (firstTime) {
                var computed = mobx_1.extras.getAtom(this, propertyKey);
                computed.observe(function () {});
                firstTime = false;
            }

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return get.apply(this, args);
        };
    }
    return mobx_1.computed(target, propertyKey, descriptor);
}
exports.cached = cached;
/**
 * Update MobxPromise debug names to reflect their property names on a given object.
 * @param target An object which has properties that are MobxPromises.
 */
function labelMobxPromises(target) {
    for (var key in target) {
        var desc = Object.getOwnPropertyDescriptor(target, key);
        if (desc && desc.value instanceof MobxPromise_1.MobxPromise) {
            var admin = mobx_1.extras.getAdministration(desc.value);
            admin.name = key + "(" + admin.name + ")";
        }
    }
}
exports.labelMobxPromises = labelMobxPromises;
/**
 * Creates a function which constructs a MobxPromise that will pass the result and default values through a given function.
 * For example, this can be used to make results immutable.
 * @param resultModifier
 * @returns {(input:MobxPromiseInputUnion<R>, defaultResult?:R)=>MobxPromiseUnionType<R>}
 */
function createMobxPromiseFactory(resultModifier) {
    return function (input, defaultResult) {
        input = MobxPromise_1.MobxPromiseImpl.normalizeInput(input, defaultResult);
        var invoke = input.invoke;
        input.invoke = function () {
            return invoke().then(resultModifier);
        };
        input.default = resultModifier(input.default);
        return new MobxPromise_1.MobxPromise(input);
    };
}
exports.createMobxPromiseFactory = createMobxPromiseFactory;
/**
 * A function created with debounceAsync() returns a new Promise
 * every time, but only the last promise created before invoking the
 * original function will be resolved after a specified delay.
 */
function debounceAsync(invoke) {
    var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    function invokeLater(context, args, resolve, reject) {
        try {
            resolve(invoke.apply(context, args));
        } catch (e) {
            reject(e);
        }
    }
    var timeout = 0;
    return function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return new Promise(function (resolve, reject) {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(invokeLater, delay, this, args, resolve, reject);
        });
    };
}
exports.debounceAsync = debounceAsync;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function __export(m) {
    for (var p in m) {
        if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(0));
__export(__webpack_require__(1));
var MobxPromise_1 = __webpack_require__(0);
exports.default = MobxPromise_1.default;

/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map