"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mobx_1 = require("mobx");
const MobxPromise_1 = require("./MobxPromise");
/**
 * A decorator for creating a <code>@computed</code> property that will be cached
 * after the first time it is accessed, even if it becomes unobserved later.
 * @param target
 * @param propertyKey
 * @param descriptor
 */
function cached(target, propertyKey, descriptor) {
    if (descriptor.get) {
        let firstTime = true;
        let get = descriptor.get;
        descriptor.get = function (...args) {
            if (firstTime) {
                const computed = mobx_1.extras.getAtom(this, propertyKey);
                computed.observe(function () { });
                firstTime = false;
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
    for (let key in target) {
        let desc = Object.getOwnPropertyDescriptor(target, key);
        if (desc.value instanceof MobxPromise_1.MobxPromise) {
            let admin = mobx_1.extras.getAdministration(desc.value);
            admin.name = `${key}(${admin.name})`;
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
        const invoke = input.invoke;
        input.invoke = () => invoke().then(resultModifier);
        input.default = resultModifier(input.default);
        return new MobxPromise_1.MobxPromise(input);
    };
}
exports.createMobxPromiseFactory = createMobxPromiseFactory;
//# sourceMappingURL=utils.js.map