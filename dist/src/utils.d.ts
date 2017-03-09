import { MobxPromiseFactory } from "./MobxPromise";
/**
 * A decorator for creating a <code>@computed</code> property that will be cached
 * after the first time it is accessed, even if it becomes unobserved later.
 * @param target
 * @param propertyKey
 * @param descriptor
 */
export declare function cached<T>(target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): void;
/**
 * Update MobxPromise debug names to reflect their property names on a given object.
 * @param target An object which has properties that are MobxPromises.
 */
export declare function labelMobxPromises<T extends object>(target: T): void;
/**
 * Creates a function which constructs a MobxPromise that will pass the result and default values through a given function.
 * For example, this can be used to make results immutable.
 * @param resultModifier
 * @returns {(input:MobxPromiseInputUnion<R>, defaultResult?:R)=>MobxPromiseUnionType<R>}
 */
export declare function createMobxPromiseFactory(resultModifier: <R>(result: R) => R): MobxPromiseFactory;
/**
 * A function created with debounceAsync() returns a new Promise
 * every time, but only the last promise created before invoking the
 * original function will be resolved after a specified delay.
 */
export declare function debounceAsync<R, F extends (...args: any[]) => PromiseLike<R>>(invoke: F, delay?: number): F;
