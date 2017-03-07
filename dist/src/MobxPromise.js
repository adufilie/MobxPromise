"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mobx_1 = require("mobx");
const utils_1 = require("./utils");
/**
 * MobxPromise provides an observable interface for a computed promise.
 * @author adufilie http://github.com/adufilie
 */
class MobxPromiseImpl {
    constructor(input, defaultResult) {
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
    static isPromiseLike(value) {
        return value != null && typeof value === 'object' && typeof value.then === 'function';
    }
    static normalizeInput(input, defaultResult) {
        if (typeof input === 'function')
            return { invoke: input, default: defaultResult };
        if (MobxPromiseImpl.isPromiseLike(input))
            return { invoke: () => input, default: defaultResult };
        input = input;
        if (defaultResult !== undefined)
            input = Object.assign({}, input, { default: defaultResult });
        return input;
    }
    get status() {
        // wait until all MobxPromise dependencies are complete
        if (this.await)
            for (let mobxPromise of this.await())
                if (!mobxPromise.isComplete)
                    return mobxPromise.status;
        let status = this.internalStatus; // force mobx to track changes to internalStatus
        if (this.latestInvokeId != this.invokeId)
            status = 'pending';
        return status;
    }
    get isPending() { return this.status == 'pending'; }
    get isComplete() { return this.status == 'complete'; }
    get isError() { return this.status == 'error'; }
    get result() {
        // checking status may trigger invoke
        if (this.isError || this.internalResult == null)
            return this.defaultResult;
        return this.internalResult;
    }
    get error() {
        // checking status may trigger invoke
        if (this.isError && this.await)
            for (let mobxPromise of this.await())
                if (mobxPromise.isError)
                    return mobxPromise.error;
        return this.internalError;
    }
    /**
     * This lets mobx determine when to call this.invoke(),
     * taking advantage of caching based on observable property access tracking.
     */
    get latestInvokeId() {
        window.clearTimeout(this._latestInvokeId);
        let promise = this.invoke();
        let invokeId = window.setTimeout(() => this.setPending(invokeId, promise));
        return this._latestInvokeId = invokeId;
    }
    setPending(invokeId, promise) {
        this.invokeId = invokeId;
        promise.then(result => this.setComplete(invokeId, result), error => this.setError(invokeId, error));
        this.internalStatus = 'pending';
    }
    setComplete(invokeId, result) {
        if (invokeId === this.invokeId) {
            this.internalResult = result;
            this.internalStatus = 'complete';
            if (this.reaction)
                this.reaction(this.result);
        }
    }
    setError(invokeId, error) {
        if (invokeId === this.invokeId) {
            this.internalError = error;
            this.internalStatus = 'error';
        }
    }
}
__decorate([
    mobx_1.observable
], MobxPromiseImpl.prototype, "internalStatus", void 0);
__decorate([
    mobx_1.observable.ref
], MobxPromiseImpl.prototype, "internalResult", void 0);
__decorate([
    mobx_1.observable.ref
], MobxPromiseImpl.prototype, "internalError", void 0);
__decorate([
    utils_1.cached
], MobxPromiseImpl.prototype, "status", null);
__decorate([
    utils_1.cached
], MobxPromiseImpl.prototype, "isPending", null);
__decorate([
    utils_1.cached
], MobxPromiseImpl.prototype, "isComplete", null);
__decorate([
    utils_1.cached
], MobxPromiseImpl.prototype, "isError", null);
__decorate([
    utils_1.cached
], MobxPromiseImpl.prototype, "result", null);
__decorate([
    utils_1.cached
], MobxPromiseImpl.prototype, "error", null);
__decorate([
    utils_1.cached
], MobxPromiseImpl.prototype, "latestInvokeId", null);
__decorate([
    mobx_1.action
], MobxPromiseImpl.prototype, "setPending", null);
__decorate([
    mobx_1.action
], MobxPromiseImpl.prototype, "setComplete", null);
__decorate([
    mobx_1.action
], MobxPromiseImpl.prototype, "setError", null);
exports.MobxPromiseImpl = MobxPromiseImpl;
exports.MobxPromise = MobxPromiseImpl;
exports.default = exports.MobxPromise;
//# sourceMappingURL=MobxPromise.js.map