(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("mobx"));
	else if(typeof define === 'function' && define.amd)
		define(["mobx"], factory);
	else if(typeof exports === 'object')
		exports["index"] = factory(require("mobx"));
	else
		root["index"] = factory(root["mobx"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
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
exports.MobxPromise = exports.MobxPromiseImpl = void 0;
var mobx_1 = __webpack_require__(1);
/**
 * MobxPromise provides an observable interface for a computed promise.
 * @author adufilie http://github.com/adufilie
 */

var MobxPromiseImpl = function () {
    function MobxPromiseImpl(input, defaultResult) {
        _classCallCheck(this, MobxPromiseImpl);

        Object.defineProperty(this, "await", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "invoke", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "onResult", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "onError", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "defaultResult", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "invokeId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_latestInvokeId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "internalStatus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'pending'
        });
        Object.defineProperty(this, "internalResult", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        Object.defineProperty(this, "internalError", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        mobx_1.makeObservable(this);
        var norm = MobxPromiseImpl.normalizeInput(input, defaultResult);
        this.await = norm.await;
        this.invoke = norm.invoke;
        this.defaultResult = norm.default;
        this.onResult = norm.onResult;
        this.onError = norm.onError;
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
                this.internalError = undefined;
                this.internalStatus = 'complete';
                if (this.onResult) this.onResult(this.result); // may use defaultResult
            }
        }
    }, {
        key: "setError",
        value: function setError(invokeId, error) {
            if (invokeId === this.invokeId) {
                this.internalError = error;
                this.internalResult = undefined;
                this.internalStatus = 'error';
                if (this.onError) this.onError(error);
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
                    for (var _iterator = this.await().map(function (mp) {
                        return mp.status;
                    })[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _status = _step.value;
                        // track all statuses before returning
                        if (_status !== 'complete') return _status;
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
        key: "peekStatus",
        get: function get() {
            // check status without triggering invoke
            // check status of all MobxPromise dependencies
            if (this.await) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.await().map(function (mp) {
                        return mp.peekStatus;
                    })[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var status = _step2.value;

                        if (status !== 'complete') return status;
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
            } // otherwise, return internal status
            return this.internalStatus;
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
            if (!this.isComplete && this.await) {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = this.await().map(function (mp) {
                        return mp.error;
                    })[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var error = _step3.value;
                        // track all errors before returning
                        if (error) return error;
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
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
            if (defaultResult !== undefined) input = Object.assign(Object.assign({}, input), { default: defaultResult });
            return input;
        }
    }]);

    return MobxPromiseImpl;
}();

__decorate([mobx_1.observable], MobxPromiseImpl.prototype, "internalStatus", void 0);
__decorate([mobx_1.observable.ref], MobxPromiseImpl.prototype, "internalResult", void 0);
__decorate([mobx_1.observable.ref], MobxPromiseImpl.prototype, "internalError", void 0);
__decorate([mobx_1.computed], MobxPromiseImpl.prototype, "status", null);
__decorate([mobx_1.computed], MobxPromiseImpl.prototype, "peekStatus", null);
__decorate([mobx_1.computed], MobxPromiseImpl.prototype, "isPending", null);
__decorate([mobx_1.computed], MobxPromiseImpl.prototype, "isComplete", null);
__decorate([mobx_1.computed], MobxPromiseImpl.prototype, "isError", null);
__decorate([mobx_1.computed], MobxPromiseImpl.prototype, "result", null);
__decorate([mobx_1.computed], MobxPromiseImpl.prototype, "error", null);
__decorate([mobx_1.computed], MobxPromiseImpl.prototype, "latestInvokeId", null);
__decorate([mobx_1.action], MobxPromiseImpl.prototype, "setPending", null);
__decorate([mobx_1.action], MobxPromiseImpl.prototype, "setComplete", null);
__decorate([mobx_1.action], MobxPromiseImpl.prototype, "setError", null);
exports.MobxPromiseImpl = MobxPromiseImpl;
exports.MobxPromise = MobxPromiseImpl;
exports.default = exports.MobxPromise;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function get() {
            return m[k];
        } });
} : function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = this && this.__exportStar || function (m, exports) {
    for (var p in m) {
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(0), exports);
__exportStar(__webpack_require__(3), exports);
var MobxPromise_1 = __webpack_require__(0);
exports.default = MobxPromise_1.default;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
exports.debounceAsync = exports.labelMobxPromises = exports.hasObservers = exports.cached = void 0;
var mobx_1 = __webpack_require__(1);
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
        var get = descriptor.get;
        descriptor.get = function () {
            var atom = mobx_1.getAtom(this, propertyKey);
            // to keep the cached value, add an observer if there are none
            if (!atom.isBeingObserved_) mobx_1.autorun(function () {
                return atom;
            });

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return get.apply(this, args);
        };
    }
    return descriptor;
}
exports.cached = cached;
/**
 * Checks if a property has observers.
 */
function hasObservers(thing, property) {
    var tree = mobx_1.getObserverTree(thing, property);
    return tree && tree.observers ? tree.observers.length > 0 : false;
}
exports.hasObservers = hasObservers;
/**
 * Update MobxPromise debug names to reflect their property names on a given object.
 * @param target An object which has properties that are MobxPromises.
 */
function labelMobxPromises(target) {
    for (var key in target) {
        var desc = Object.getOwnPropertyDescriptor(target, key);
        if (desc && desc.value instanceof MobxPromise_1.MobxPromise) {
            var admin = mobx_1._getAdministration(desc.value);
            admin.name = key + "(" + admin.name + ")";
        }
    }
}
exports.labelMobxPromises = labelMobxPromises;
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

/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map