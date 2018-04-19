import {observable, action, computed} from "mobx";
import {cached} from "./utils";

/**
 * This tagged union type describes the interoperability of MobxPromise properties.
 */
export type MobxPromiseUnionType<R> = (
	{ status: 'pending',  isPending: true,  isError: false, isComplete: false, result: R|undefined, error: Error|undefined } |
	{ status: 'error',    isPending: false, isError: true,  isComplete: false, result: R|undefined, error: Error           } |
	{ status: 'complete', isPending: false, isError: false, isComplete: true,  result: R,           error: Error|undefined }
);
export type MobxPromiseUnionTypeWithDefault<R> = (
	{ status: 'pending',  isPending: true,  isError: false, isComplete: false, result: R, error: Error|undefined } |
	{ status: 'error',    isPending: false, isError: true,  isComplete: false, result: R, error: Error           } |
	{ status: 'complete', isPending: false, isError: false, isComplete: true,  result: R, error: Error|undefined }
);

/**
 * MobxPromise provides an observable interface for a computed promise.
 * @author adufilie http://github.com/adufilie
 */
export class MobxPromiseImpl<R>
{
	static isPromiseLike(value:any)
	{
		return value != null && typeof value === 'object' && typeof value.then === 'function';
	}

	static normalizeInput<R>(input:MobxPromiseInputParamsWithDefault<R>):MobxPromiseInputParamsWithDefault<R>;
	static normalizeInput<R>(input:MobxPromiseInputUnion<R>, defaultResult?:R):MobxPromiseInputParamsWithDefault<R>;
	static normalizeInput<R>(input:MobxPromiseInputUnion<R>):MobxPromiseInputParams<R>;
	static normalizeInput<R>(input:MobxPromiseInputUnion<R>, defaultResult?:R)
	{
		if (typeof input === 'function')
			return {invoke: input, default: defaultResult};

		if (MobxPromiseImpl.isPromiseLike(input))
			return {invoke: () => input as PromiseLike<R>, default: defaultResult};

		input = input as MobxPromiseInputParams<R>;
		if (defaultResult !== undefined)
			input = {...input, default: defaultResult};
		return input;
	}

	constructor(input:MobxPromiseInputUnion<R>, defaultResult?:R)
	{
		let norm = MobxPromiseImpl.normalizeInput(input, defaultResult);
		this.await = norm.await;
		this.invoke = norm.invoke;
		this.defaultResult = norm.default;
		this.onResult = norm.onResult;
		this.onError = norm.onError;
	}

	private await?:()=>MobxPromise_await_elt<any>[];
	private invoke:(...args:any[])=>PromiseLike<R>;
	private onResult?:(result?:R) => void;
	private onError?:(error:Error) => void;
	private defaultResult?:R;
	private invokeId:number = 0;
	private _latestInvokeId:number = 0;

	@observable private internalStatus:'pending'|'complete'|'error' = 'pending';
	@observable.ref private internalResult?:R = undefined;
	@observable.ref private internalError?:Error = undefined;

	@cached get status():'pending'|'complete'|'error'
	{
		// wait until all MobxPromise dependencies are complete
		if (this.await)
			for (let status of this.await().map(mp => mp.status)) // track all statuses before returning
				if (status !== 'complete')
					return status;

		let status = this.internalStatus; // force mobx to track changes to internalStatus
		if (this.latestInvokeId != this.invokeId)
			status = 'pending';
		return status;
	}

	@cached get isPending() { return this.status == 'pending'; }
	@cached get isComplete() { return this.status == 'complete'; }
	@cached get isError() { return this.status == 'error'; }

	@cached get result():R|undefined
	{
		// checking status may trigger invoke
		if (this.isError || this.internalResult == null)
			return this.defaultResult;

		return this.internalResult;
	}

	@cached get error():Error|undefined
	{
		// checking status may trigger invoke
		if (!this.isComplete && this.await)
			for (let error of this.await().map(mp => mp.error)) // track all errors before returning
				if (error)
					return error;

		return this.internalError;
	}

	/**
	 * This lets mobx determine when to call this.invoke(),
	 * taking advantage of caching based on observable property access tracking.
	 */
	@computed private get latestInvokeId()
	{
		// At this point, all dependencies in await are complete, otherwise we wouldn't
		//	get here from `status`
		let awaitResults = [];
		if (this.await)
			awaitResults = this.await().map(promise=>promise.result);

		window.clearTimeout(this._latestInvokeId);
		let promise = this.invoke.apply(null, awaitResults);
		let invokeId:number = window.setTimeout(() => this.setPending(invokeId, promise));
		return this._latestInvokeId = invokeId;
	}

	@action private setPending(invokeId:number, promise:PromiseLike<R>)
	{
		this.invokeId = invokeId;
		promise.then(
			result => this.setComplete(invokeId, result),
			error => this.setError(invokeId, error)
		);
		this.internalStatus = 'pending';
	}

	@action private setComplete(invokeId:number, result:R)
	{
		if (invokeId === this.invokeId)
		{
			this.internalResult = result;
			this.internalError = undefined;
			this.internalStatus = 'complete';

			if (this.onResult)
				this.onResult(this.result); // may use defaultResult
		}
	}

	@action private setError(invokeId:number, error:Error)
	{
		if (invokeId === this.invokeId)
		{
			this.internalError = error;
			this.internalResult = undefined;
			this.internalStatus = 'error';

			if (this.onError)
				this.onError(error);
		}
	}
}

export type MobxPromiseInputUnion<R, A0=any, A1=any, A2=any, A3=any, A4=any, A5=any, A6=any, A7=any, A8=any, A9=any> =
	PromiseLike<R> | (() => PromiseLike<R>) | MobxPromiseInputParams<R, A0, A1, A2, A3, A4, A5, A6, A7, A8, A9>;

export type StaticAwaitResult0<A0> = [MobxPromise_await_elt<A0>];
export type StaticAwaitResult1<A0, A1> = [MobxPromise_await_elt<A0>, MobxPromise_await_elt<A1>];
export type StaticAwaitResult2<A0, A1, A2> = [MobxPromise_await_elt<A0>, MobxPromise_await_elt<A1>, MobxPromise_await_elt<A2>];
export type StaticAwaitResult3<A0, A1, A2, A3> =
	[MobxPromise_await_elt<A0>, MobxPromise_await_elt<A1>, MobxPromise_await_elt<A2>, MobxPromise_await_elt<A3>];
export type StaticAwaitResult4<A0, A1, A2, A3, A4> =
	[MobxPromise_await_elt<A0>, MobxPromise_await_elt<A1>, MobxPromise_await_elt<A2>, MobxPromise_await_elt<A3>,
		MobxPromise_await_elt<A4>];
export type StaticAwaitResult5<A0, A1, A2, A3, A4, A5> =
	[MobxPromise_await_elt<A0>, MobxPromise_await_elt<A1>, MobxPromise_await_elt<A2>, MobxPromise_await_elt<A3>,
		MobxPromise_await_elt<A4>, MobxPromise_await_elt<A5>];
export type StaticAwaitResult6<A0, A1, A2, A3, A4, A5, A6> =
	[MobxPromise_await_elt<A0>, MobxPromise_await_elt<A1>, MobxPromise_await_elt<A2>, MobxPromise_await_elt<A3>,
		MobxPromise_await_elt<A4>, MobxPromise_await_elt<A5>, MobxPromise_await_elt<A6>];
export type StaticAwaitResult7<A0, A1, A2, A3, A4, A5, A6, A7> =
	[MobxPromise_await_elt<A0>, MobxPromise_await_elt<A1>, MobxPromise_await_elt<A2>, MobxPromise_await_elt<A3>,
		MobxPromise_await_elt<A4>, MobxPromise_await_elt<A5>, MobxPromise_await_elt<A6>, MobxPromise_await_elt<A7>];
export type StaticAwaitResult8<A0, A1, A2, A3, A4, A5, A6, A7, A8> =
	[MobxPromise_await_elt<A0>, MobxPromise_await_elt<A1>, MobxPromise_await_elt<A2>, MobxPromise_await_elt<A3>,
		MobxPromise_await_elt<A4>, MobxPromise_await_elt<A5>, MobxPromise_await_elt<A6>, MobxPromise_await_elt<A7>,
		MobxPromise_await_elt<A8>];
export type StaticAwaitResult9<A0, A1, A2, A3, A4, A5, A6, A7, A8, A9> =
	[MobxPromise_await_elt<A0>, MobxPromise_await_elt<A1>, MobxPromise_await_elt<A2>, MobxPromise_await_elt<A3>,
		MobxPromise_await_elt<A4>, MobxPromise_await_elt<A5>, MobxPromise_await_elt<A6>, MobxPromise_await_elt<A7>,
		MobxPromise_await_elt<A8>, MobxPromise_await_elt<A9>];

export type DynamicAwaitResult0<A0> = never[] | StaticAwaitResult0<A0>;
export type DynamicAwaitResult1<A0, A1> = DynamicAwaitResult0<A0> | StaticAwaitResult1<A0, A1>;
export type DynamicAwaitResult2<A0, A1, A2> = DynamicAwaitResult1<A0, A1> | StaticAwaitResult2<A0, A1, A2>;
export type DynamicAwaitResult3<A0, A1, A2, A3> = DynamicAwaitResult2<A0, A1, A2> | StaticAwaitResult3<A0, A1, A2, A3>;
export type DynamicAwaitResult4<A0, A1, A2, A3, A4> =
	DynamicAwaitResult3<A0, A1, A2, A3> | StaticAwaitResult4<A0, A1, A2, A3, A4>;
export type DynamicAwaitResult5<A0, A1, A2, A3, A4, A5> =
	DynamicAwaitResult4<A0, A1, A2, A3, A4> | StaticAwaitResult5<A0, A1, A2, A3, A4, A5>;
export type DynamicAwaitResult6<A0, A1, A2, A3, A4, A5, A6> =
	DynamicAwaitResult5<A0, A1, A2, A3, A4, A5> | StaticAwaitResult6<A0, A1, A2, A3, A4, A5, A6>;
export type DynamicAwaitResult7<A0, A1, A2, A3, A4, A5, A6, A7> =
	DynamicAwaitResult6<A0, A1, A2, A3, A4, A5, A6> | StaticAwaitResult7<A0, A1, A2, A3, A4, A5, A6, A7>;
export type DynamicAwaitResult8<A0, A1, A2, A3, A4, A5, A6, A7, A8> =
	DynamicAwaitResult7<A0, A1, A2, A3, A4, A5, A6, A7> | StaticAwaitResult8<A0, A1, A2, A3, A4, A5, A6, A7, A8>;
export type DynamicAwaitResult9<A0, A1, A2, A3, A4, A5, A6, A7, A8, A9> =
	DynamicAwaitResult8<A0, A1, A2, A3, A4, A5, A6, A7, A8> | StaticAwaitResult9<A0, A1, A2, A3, A4, A5, A6, A7, A8, A9>;

export type AwaitInvoke<R, A0, A1, A2, A3, A4, A5, A6, A7, A8, A9> =
	/**
	 * await: A function that returns a list of MobxPromise objects which are dependencies of the invoke function.

	 * invoke: A function that receives as arguments the results of the await array, and returns the async result
	 *          or a promise for the async result.
	 */
// case of static await result length
	{
		await?: undefined;
		invoke: ()=>PromiseLike<R>;
	} | {
	await: ()=>StaticAwaitResult0<A0>
	invoke: (a0:A0)=>PromiseLike<R>;
} | {
	await: ()=>StaticAwaitResult1<A0, A1>;
	invoke: (a0:A0, a1:A1)=>PromiseLike<R>;
} | {
	await: ()=>StaticAwaitResult2<A0, A1, A2>;
	invoke: (a0:A0, a1:A1, a2:A2)=>PromiseLike<R>;
} | {
	await: ()=>StaticAwaitResult3<A0, A1, A2, A3>;
	invoke: (a0:A0, a1:A1, a2:A2, a3:A3)=>PromiseLike<R>;
} | {
	await: ()=>StaticAwaitResult4<A0, A1, A2, A3, A4>;
	invoke: (a0:A0, a1:A1, a2:A2, a3:A3, a4:A4)=>PromiseLike<R>;
} | {
	await: ()=>StaticAwaitResult5<A0, A1, A2, A3, A4, A5>;
	invoke: (a0:A0, a1:A1, a2:A2, a3:A3, a4:A4, a5:A5)=>PromiseLike<R>;
} | {
	await: ()=>StaticAwaitResult6<A0, A1, A2, A3, A4, A5, A6>;
	invoke: (a0:A0, a1:A1, a2:A2, a3:A3, a4:A4, a5:A5, a6:A6)=>PromiseLike<R>;
} | {
	await: ()=>StaticAwaitResult7<A0, A1, A2, A3, A4, A5, A6, A7>;
	invoke: (a0:A0, a1:A1, a2:A2, a3:A3, a4:A4, a5:A5, a6:A6, a7:A7)=>PromiseLike<R>;
} | {
	await: ()=>StaticAwaitResult8<A0, A1, A2, A3, A4, A5, A6, A7, A8>;
	invoke: (a0:A0, a1:A1, a2:A2, a3:A3, a4:A4, a5:A5, a6:A6, a7:A7, a8:A8)=>PromiseLike<R>;
} | {
	await: ()=>StaticAwaitResult9<A0, A1, A2, A3, A4, A5, A6, A7, A8, A9>;
	invoke: (a0:A0, a1:A1, a2:A2, a3:A3, a4:A4, a5:A5, a6:A6, a7:A7, a8:A8, a9:A9)=>PromiseLike<R>;
}
// case of dynamic await result length - important to put after static cases, and in ascending order, for accurate type inference
	| {
	await: ()=>DynamicAwaitResult0<A0>,
	invoke: (a0?:A0)=>PromiseLike<R>
} | {
	await: ()=>DynamicAwaitResult1<A0, A1>,
	invoke: (a0?:A0, a1?:A0, a2?:A2, a3?:A3, a4?:A4, a5?:A5, a6?:A6, a7?:A7, a8?:A8, a9?:A9)=>PromiseLike<R>
} | {
	await: ()=>DynamicAwaitResult2<A0, A1, A2>,
	invoke: (a0?:A0, a1?:A0, a2?:A2)=>PromiseLike<R>
} | {
	await: ()=>DynamicAwaitResult3<A0, A1, A2, A3>,
	invoke: (a0?:A0, a1?:A0, a2?:A2, a3?:A3)=>PromiseLike<R>
} | {
	await: ()=>DynamicAwaitResult4<A0, A1, A2, A3, A4>,
	invoke: (a0?:A0, a1?:A0, a2?:A2, a3?:A3, a4?:A4)=>PromiseLike<R>
} | {
	await: ()=>DynamicAwaitResult5<A0, A1, A2, A3, A4, A5>,
	invoke: (a0?:A0, a1?:A0, a2?:A2, a3?:A3, a4?:A4, a5?:A5)=>PromiseLike<R>
} | {
	await: ()=>DynamicAwaitResult6<A0, A1, A2, A3, A4, A5, A6>,
	invoke: (a0?:A0, a1?:A0, a2?:A2, a3?:A3, a4?:A4, a5?:A5, a6?:A6)=>PromiseLike<R>
} | {
	await: ()=>DynamicAwaitResult7<A0, A1, A2, A3, A4, A5, A6, A7>,
	invoke: (a0?:A0, a1?:A0, a2?:A2, a3?:A3, a4?:A4, a5?:A5, a6?:A6, a7?:A7)=>PromiseLike<R>
} | {
	await: ()=>DynamicAwaitResult8<A0, A1, A2, A3, A4, A5, A6, A7, A8>,
	invoke: (a0?:A0, a1?:A0, a2?:A2, a3?:A3, a4?:A4, a5?:A5, a6?:A6, a7?:A7, a8?:A8)=>PromiseLike<R>
} | {
	await: ()=>DynamicAwaitResult9<A0, A1, A2, A3, A4, A5, A6, A7, A8, A9>,
	invoke: (a0?:A0, a1?:A0, a2?:A2, a3?:A3, a4?:A4, a5?:A5, a6?:A6, a7?:A7, a8?:A8, a9?:A9)=>PromiseLike<R>
} | {
	// catch-all for more than 10 await elements - need to put at very end of this union type, for accurate type inference
	await: ()=>MobxPromise_await_elt<any>[];
	invoke: (...args:any[])=>PromiseLike<R>;
};


export type MobxPromiseInputParams<R, A0=any, A1=any, A2=any, A3=any, A4=any, A5=any, A6=any, A7=any, A8=any, A9=any> =
	AwaitInvoke<R, A0, A1, A2, A3, A4, A5, A6, A7, A8, A9> &
	{
		/**
		 * Default result in place of undefined
		 */
		default?: R,

		/**
		 * A function that will be called when the latest promise from invoke() is resolved.
		 * It will not be called for out-of-date promises.
		 */
		onResult?: (result?:R) => void,

		/**
		 * A function that will be called when the latest promise from invoke() is rejected.
		 * It will not be called for out-of-date promises.
		 */
		onError?: (error:Error) => void,
	};
export type MobxPromise_await_elt<R> = MobxPromiseUnionTypeWithDefault<R> | MobxPromiseUnionType<R> | MobxPromise<R>;

export type MobxPromiseInputParamsWithDefault<R, A0=any, A1=any, A2=any, A3=any, A4=any, A5=any, A6=any, A7=any, A8=any, A9=any> =
	AwaitInvoke<R, A0, A1, A2, A3, A4, A5, A6, A7, A8, A9> &
	{
		default: R,
		onResult?: (result:R) => void,
		onError?: (error:Error) => void,
	};


export type MobxPromiseFactory = {
	// This provides more information for TypeScript code flow analysis
	<R, A0=any, A1=any, A2=any, A3=any, A4=any, A5=any, A6=any, A7=any, A8=any, A9=any>(input:MobxPromiseInputParamsWithDefault<R, A0, A1, A2, A3, A4, A5, A6, A7, A8, A9>):MobxPromiseUnionTypeWithDefault<R>;
	<R, A0=any, A1=any, A2=any, A3=any, A4=any, A5=any, A6=any, A7=any, A8=any, A9=any>(input:MobxPromiseInputUnion<R, A0, A1, A2, A3, A4, A5, A6, A7, A8, A9>, defaultResult: R):MobxPromiseUnionTypeWithDefault<R>;
	<R, A0=any, A1=any, A2=any, A3=any, A4=any, A5=any, A6=any, A7=any, A8=any, A9=any>(input:MobxPromiseInputUnion<R, A0, A1, A2, A3, A4, A5, A6, A7, A8, A9>):MobxPromiseUnionType<R>;
};

export const MobxPromise = MobxPromiseImpl as {
	// This provides more information for TypeScript code flow analysis
	// Same as MobxPromiseFactory except w the `new` keyword
	new <R, A0=any, A1=any, A2=any, A3=any, A4=any, A5=any, A6=any, A7=any, A8=any, A9=any>(input:MobxPromiseInputParamsWithDefault<R, A0, A1, A2, A3, A4, A5, A6, A7, A8, A9>):MobxPromiseUnionTypeWithDefault<R>;
	new <R, A0=any, A1=any, A2=any, A3=any, A4=any, A5=any, A6=any, A7=any, A8=any, A9=any>(input:MobxPromiseInputUnion<R, A0, A1, A2, A3, A4, A5, A6, A7, A8, A9>, defaultResult: R):MobxPromiseUnionTypeWithDefault<R>;
	new <R, A0=any, A1=any, A2=any, A3=any, A4=any, A5=any, A6=any, A7=any, A8=any, A9=any>(input:MobxPromiseInputUnion<R, A0, A1, A2, A3, A4, A5, A6, A7, A8, A9>):MobxPromiseUnionType<R>;
};

export interface MobxPromise<T> extends Pick<MobxPromiseImpl<T>, 'status' | 'error' | 'result' | 'isPending' | 'isError' | 'isComplete'>
{
}

export default MobxPromise;
