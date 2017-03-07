/**
 * This tagged union type describes the interoperability of MobxPromise properties.
 */
export declare type MobxPromiseUnionType<R> = ({
    status: 'pending';
    isPending: true;
    isError: false;
    isComplete: false;
    result: undefined;
    error: undefined;
} | {
    status: 'error';
    isPending: false;
    isError: true;
    isComplete: false;
    result: undefined;
    error: Error;
} | {
    status: 'complete';
    isPending: false;
    isError: false;
    isComplete: true;
    result: R;
    error: undefined;
});
export declare type MobxPromiseUnionTypeWithDefault<R> = ({
    status: 'pending';
    isPending: true;
    isError: false;
    isComplete: false;
    result: R;
    error: undefined;
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
    error: undefined;
});
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
    reaction?: (result?: R) => void;
};
export declare type MobxPromise_await = () => Array<MobxPromiseImpl<any> | MobxPromiseUnionType<any> | MobxPromiseUnionTypeWithDefault<any>>;
export declare type MobxPromise_invoke<R> = () => PromiseLike<R>;
export declare type MobxPromiseInputParamsWithDefault<R> = {
    await?: MobxPromise_await;
    invoke: MobxPromise_invoke<R>;
    default: R;
    reaction?: (result: R) => void;
};
/**
 * MobxPromise provides an observable interface for a computed promise.
 * @author adufilie http://github.com/adufilie
 */
export declare class MobxPromiseImpl<R> {
    static isPromiseLike(value?: Partial<PromiseLike<any>>): boolean;
    static normalizeInput<R>(input: MobxPromiseInputParamsWithDefault<R>): MobxPromiseInputParamsWithDefault<R>;
    static normalizeInput<R>(input: MobxPromiseInputUnion<R>, defaultResult: R): MobxPromiseInputParamsWithDefault<R>;
    constructor(input: MobxPromiseInputUnion<R>, defaultResult?: R);
    private await?;
    private invoke;
    private reaction?;
    private defaultResult?;
    private invokeId;
    private _latestInvokeId;
    private internalStatus;
    private internalResult?;
    private internalError?;
    readonly status: 'pending' | 'complete' | 'error';
    readonly isPending: boolean;
    readonly isComplete: boolean;
    readonly isError: boolean;
    readonly result: R | undefined;
    readonly error: Error | undefined;
    /**
     * This lets mobx determine when to call this.invoke(),
     * taking advantage of caching based on observable property access tracking.
     */
    private readonly latestInvokeId;
    private setPending(invokeId, promise);
    private setComplete(invokeId, result);
    private setError(invokeId, error);
}
export declare const MobxPromise: {
    new <R>(input: MobxPromiseInputParamsWithDefault<R>): {
        status: "pending";
        isPending: true;
        isError: false;
        isComplete: false;
        result: R;
        error: undefined;
    } | {
        status: "error";
        isPending: false;
        isError: true;
        isComplete: false;
        result: R;
        error: Error;
    } | {
        status: "complete";
        isPending: false;
        isError: false;
        isComplete: true;
        result: R;
        error: undefined;
    };
    new <R>(input: MobxPromiseInputUnion<R>, defaultResult: R): {
        status: "pending";
        isPending: true;
        isError: false;
        isComplete: false;
        result: R;
        error: undefined;
    } | {
        status: "error";
        isPending: false;
        isError: true;
        isComplete: false;
        result: R;
        error: Error;
    } | {
        status: "complete";
        isPending: false;
        isError: false;
        isComplete: true;
        result: R;
        error: undefined;
    };
    new <R>(input: MobxPromiseInputUnion<R>): {
        status: "pending";
        isPending: true;
        isError: false;
        isComplete: false;
        result: undefined;
        error: undefined;
    } | {
        status: "error";
        isPending: false;
        isError: true;
        isComplete: false;
        result: undefined;
        error: Error;
    } | {
        status: "complete";
        isPending: false;
        isError: false;
        isComplete: true;
        result: R;
        error: undefined;
    };
};
export interface MobxPromise<T> extends Pick<MobxPromiseImpl<T>, 'status' | 'error' | 'result' | 'isPending' | 'isError' | 'isComplete'> {
}
export default MobxPromise;
