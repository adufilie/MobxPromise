import {computed, extras, IComputedValue} from 'mobx';
import {MobxPromise} from "./MobxPromise";

/**
 * A decorator for creating a <code>@computed</code> property that will be cached
 * after the first time it is accessed, even if it becomes unobserved later.
 * @param target
 * @param propertyKey
 * @param descriptor
 */
export function cached<T>(target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>)
{
	if (descriptor.get)
	{
		let firstTime = true;
		let get = descriptor.get;
		descriptor.get = function(...args:any[]) {
			if (firstTime)
			{
				const computed = extras.getAtom(target, propertyKey as string) as any as IComputedValue<any>;
				computed.observe(function() { /*noop*/ });
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
export function labelMobxPromises<T extends object>(target:T)
{
	for (let key in target)
	{
		let desc = Object.getOwnPropertyDescriptor(target, key);
		if (desc.value instanceof MobxPromise)
		{
			let admin = extras.getAdministration(desc.value);
			admin.name = `${key}(${admin.name})`;
		}
	}
}
