/**
 * This tagged union type describes the interoperability of MobxPromise properties.
 */
declare type MobxPromiseStatus = 'pending' | 'error' | 'complete';
export declare type MobxPromiseUnionType<R> = ({
    status: 'pending';
    isPending: true;
    isError: false;
    isComplete: false;
    result: R | undefined;
    error: Error | undefined;
} | {
    status: 'error';
    isPending: false;
    isError: true;
    isComplete: false;
    result: R | undefined;
    error: Error;
} | {
    status: 'complete';
    isPending: false;
    isError: false;
    isComplete: true;
    result: R;
    error: Error | undefined;
}) & {
    peekStatus: MobxPromiseStatus;
};
export declare type MobxPromiseUnionTypeWithDefault<R> = ({
    status: 'pending';
    isPending: true;
    isError: false;
    isComplete: false;
    result: R;
    error: Error | undefined;
} | {
    status: 'error';
    isPending: false;
    isError: true;
    isComplete: false;
    result: R;
    error: Error;
} | {
    status: 'complete';
    isPending: false;
    isError: false;
    isComplete: true;
    result: R;
    error: Error | undefined;
}) & {
    peekStatus: MobxPromiseStatus;
};
export declare type MobxPromiseInputUnion<R> = PromiseLike<R> | (() => PromiseLike<R>) | MobxPromiseInputParams<R>;
export declare type MobxPromiseInputParams<R> = {
    /**
     * A function that returns a list of MobxPromise objects which are dependencies of the invoke function.
     */
    await?: MobxPromise_await;
    /**
     * A function that returns the async result or a promise for the async result.
     */
    invoke: MobxPromise_invoke<R>;
    /**
     * Default result in place of undefined
     */
    default?: R;
    /**
     * A function that will be called when the latest promise from invoke() is resolved.
     * It will not be called for out-of-date promises.
     */
    onResult?: (result?: R) => void;
    /**
     * A function that will be called when the latest promise from invoke() is rejected.
     * It will not be called for out-of-date promises.
     */
    onError?: (error: Error) => void;
};
export declare type MobxPromise_await = () => Array<MobxPromiseUnionTypeWithDefault<any> | MobxPromiseUnionType<any> | MobxPromise<any>>;
export declare type MobxPromise_invoke<R> = () => PromiseLike<R>;
export declare type MobxPromiseInputParamsWithDefault<R> = {
    await?: MobxPromise_await;
    invoke: MobxPromise_invoke<R>;
    default: R;
    onResult?: (result: R) => void;
    onError?: (error: Error) => void;
};
/**
 * MobxPromise provides an observable interface for a computed promise.
 * @author adufilie http://github.com/adufilie
 */
export declare class MobxPromiseImpl<R> {
    static isPromiseLike(value: any): boolean;
    static normalizeInput<R>(input: MobxPromiseInputParamsWithDefault<R>): MobxPromiseInputParamsWithDefault<R>;
    static normalizeInput<R>(input: MobxPromiseInputUnion<R>, defaultResult?: R): MobxPromiseInputParamsWithDefault<R>;
    static normalizeInput<R>(input: MobxPromiseInputUnion<R>): MobxPromiseInputParams<R>;
    constructor(input: MobxPromiseInputUnion<R>, defaultResult?: R);
    private await?;
    private invoke;
    private onResult?;
    private onError?;
    private defaultResult?;
    private invokeId;
    private _latestInvokeId;
    private internalStatus;
    private internalResult?;
    private internalError?;
    get status(): 'pending' | 'complete' | 'error';
    get peekStatus(): 'pending' | 'complete' | 'error';
    get isPending(): boolean;
    get isComplete(): boolean;
    get isError(): boolean;
    get result(): R | undefined;
    get error(): Error | undefined;
    /**
     * This lets mobx determine when to call this.invoke(),
     * taking advantage of caching based on observable property access tracking.
     */
    private get latestInvokeId();
    private setPending;
    private setComplete;
    private setError;
}
export declare type MobxPromiseFactory = {
    <R>(input: MobxPromiseInputParamsWithDefault<R>): MobxPromiseUnionTypeWithDefault<R>;
    <R>(input: MobxPromiseInputUnion<R>, defaultResult: R): MobxPromiseUnionTypeWithDefault<R>;
    <R>(input: MobxPromiseInputUnion<R>): MobxPromiseUnionType<R>;
};
export declare const MobxPromise: {
    new <R>(input: MobxPromiseInputParamsWithDefault<R>): MobxPromiseUnionTypeWithDefault<R>;
    new <R_1>(input: MobxPromiseInputUnion<R_1>, defaultResult: R_1): MobxPromiseUnionTypeWithDefault<R_1>;
    new <R_2>(input: MobxPromiseInputUnion<R_2>): MobxPromiseUnionType<R_2>;
};
export interface MobxPromise<T> extends Pick<MobxPromiseImpl<T>, 'status' | 'error' | 'result' | 'isPending' | 'isError' | 'isComplete' | 'peekStatus'> {
}
export default MobxPromise;
