import { computed, extras } from 'mobx';
import { MobxPromise } from "./MobxPromise";
/**
 * A decorator for creating a <code>@computed</code> property that will be cached
 * after the first time it is accessed, even if it becomes unobserved later.
 * @param target
 * @param propertyKey
 * @param descriptor
 */
export function cached(target, propertyKey, descriptor) {
    if (descriptor.get) {
        let firstTime = true;
        let get = descriptor.get;
        descriptor.get = function (...args) {
            if (firstTime) {
                const computed = extras.getAtom(target, propertyKey);
                computed.observe(function () { });
                firstTime = false;
            }
            return get.apply(this, args);
        };
    }
    return computed(target, propertyKey, descriptor);
}
/**
 * Update MobxPromise debug names to reflect their property names on a given object.
 * @param target An object which has properties that are MobxPromises.
 */
export function labelMobxPromises(target) {
    for (let key in target) {
        let desc = Object.getOwnPropertyDescriptor(target, key);
        if (desc.value instanceof MobxPromise) {
            let admin = extras.getAdministration(desc.value);
            admin.name = `${key}(${admin.name})`;
        }
    }
}
//# sourceMappingURL=utils.js.map