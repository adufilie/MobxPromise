/**
 * A decorator for creating a <code>@computed</code> property that will be cached
 * after the first time it is accessed, even if it becomes unobserved later.
 * @param target
 * @param propertyKey
 * @param descriptor
 */
export declare function cached<T>(target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): void;
/**
 * Checks if a property has observers.
 */
export declare function hasObservers<T>(thing: T, property: keyof T): boolean;
/**
 * Update MobxPromise debug names to reflect their property names on a given object.
 * @param target An object which has properties that are MobxPromises.
 */
export declare function labelMobxPromises<T extends object>(target: T): void;
/**
 * A function created with debounceAsync() returns a new Promise
 * every time, but only the last promise created before invoking the
 * original function will be resolved after a specified delay.
 */
export declare function debounceAsync<R, F extends (...args: any[]) => PromiseLike<R>>(invoke: F, delay?: number): F;
