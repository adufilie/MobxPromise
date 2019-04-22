import {assert} from "chai";
import * as Sinon from 'sinon';
import * as mobx from "mobx";
import MobxPromise from "../src/mobxpromise";

function spy<T extends (...args: any[]) => void>(func: T) {
    return Sinon.spy(func) as T & Sinon.SinonSpy;
}

async function observeOnce<T>(expression: () => T) {
    let n = 0;
    let value: T;
    return new Promise(resolve => {
        mobx.when(
            () => {
                value = expression();
                return n++ > 0;
            },
            () => resolve(value)
        );
    });
}

function sleep() {
    return new Promise(resolve => setTimeout(resolve, 0));
}

function whenComplete(promise: any) {
    return new Promise(resolve => {
        mobx.when(
            () => promise.isComplete,
            resolve
        );
    });
}

describe('MobxPromise', () => {
    const INITIAL = 'initial';
    const DEFAULT = 'default';
    let reactionDisposer: mobx.IReactionDisposer | undefined;

    afterEach(() => {
        if (reactionDisposer) {
            reactionDisposer();
            reactionDisposer = undefined;
        }
    });

    it('triggers mobx as expected', async () => {
        let value = mobx.observable(INITIAL);
        let params = {
            invoke: spy(async () => value.get()),
            default: DEFAULT,
            reaction: spy((result: string) => null)
        };
        let mp = new MobxPromise(params);
        // let reaction = spy(() => {
        // 	let {status, result, error, isPending, isError, isComplete} = mp;
        // 	return {status, result, error, isPending, isError, isComplete} as typeof mp;
        // });
        assert.equal(mp.peekStatus, "pending", "pending status initially");
        assert.isTrue(params.invoke.notCalled, 'invoke is not called until we attempt to access properties');
        await sleep();
        assert.isTrue(params.invoke.notCalled, "checking peekStatus does not trigger invoke");

        // we have to set up a reaction or @computed properties won't be cached.
        // reactionDisposer = mobx.autorun(reaction);
        assert.equal(mp.peekStatus, "pending", "peekStatus is same as status");
        assert.equal(mp.status, 'pending', 'status is pending immediately after creation');
        assert.isTrue(params.invoke.calledOnce, 'invoke called once when status is checked');
        assert.equal(mp.result, DEFAULT, 'result is set to default value');

        reactionDisposer = mobx.autorun(() => mp.result);
        await whenComplete(mp);
        assert.equal(mp.result, INITIAL, 'observed initial result');
        assert.equal(mp.status, 'complete', 'status is complete when result updates');
        assert.equal(mp.peekStatus, "complete", "peekStatus is same as status");

        value.set('this result should be skipped');
        assert.equal(mp.peekStatus, "complete", "peekStatus is still complete because it doesnt respond to changed dependency");
        assert.equal(mp.status, 'pending', 'status pending after updating dependency');
        assert.equal(mp.result, INITIAL, 'result is still initial value');
        value.set('updated result');
        await whenComplete(mp);
        assert.equal(mp.peekStatus, "complete", "peekStatus is same as status");
        assert.equal(mp.status, 'complete', 'status updated to complete');
        assert.equal(mp.result, value.get(), 'result updated to latest value');
        // assert.isTrue(params.reaction.calledTwice, 'params.reaction() called only twice');
        // assert.isTrue(params.reaction.firstCall.calledWith(INITIAL), 'params.reaction() called first time with initial value');
        // assert.isTrue(params.reaction.lastCall.calledWith(value.get()), 'params.reaction() called second time with final value');

        return true;
    });

    it('will not keep calling invoke when not observed', async () => {
        let value = mobx.observable(INITIAL);
        let params = {
            invoke: spy(async () => value.get()),
            default: DEFAULT,
            reaction: spy((result: string) => null)
        };
        let mp = new MobxPromise(params);

        assert.equal(mp.peekStatus, "pending", "pending status initially");
        await sleep();
        assert.isTrue(params.invoke.notCalled, "checking peekStatus does not trigger invoke");
        assert.equal(mp.result, DEFAULT, 'result matches default value when first requested');

        reactionDisposer = mobx.autorun(() => mp.result);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let callCount = params.invoke.callCount;
                    assert.equal(mp.result, value.get(), 'result using latest value');
                    assert.equal(params.invoke.callCount, callCount, 'not invoked again');
                    assert.equal(mp.peekStatus, "complete", "peekStatus is complete");
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            }, 200);
        });
    });
});
