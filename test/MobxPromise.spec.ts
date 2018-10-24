import {assert} from "chai";
import * as Sinon from 'sinon';
import * as mobx from "mobx";
import MobxPromise from "../src/mobxpromise";

function spy<T extends (...args:any[]) => void>(func:T)
{
	return Sinon.spy(func) as T & Sinon.SinonSpy;
}

async function observeOnce<T>(expression:() => T)
{
	let n = 0;
	let value:T;
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
	return new Promise(resolve=>setTimeout(resolve, 0));
}

function whenComplete(promise:any) {
	return new Promise(resolve=>{
		mobx.when(
			()=>promise.isComplete,
			resolve
		);
	});
}

describe('MobxPromise', () => {
	const INITIAL = 'initial';
	const DEFAULT = 'default';
	let reactionDisposer:mobx.IReactionDisposer|undefined;

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
			reaction: spy((result:string) => null)
		};
		let mp = new MobxPromise(params);
		// let reaction = spy(() => {
		// 	let {status, result, error, isPending, isError, isComplete} = mp;
		// 	return {status, result, error, isPending, isError, isComplete} as typeof mp;
		// });
		assert.isFalse(mp.peekHasInvoked, "not invoked initially");
		assert.isTrue(params.invoke.notCalled, 'invoke is not called until we attempt to access properties');
		await sleep();
		assert.isFalse(mp.peekHasInvoked, "checking peekHasInvoked does not trigger invoke");

		// we have to set up a reaction or @computed properties won't be cached.
		// reactionDisposer = mobx.autorun(reaction);

		assert.equal(mp.status, 'pending', 'status is pending immediately after creation');
		assert.isTrue(params.invoke.calledOnce, 'invoke called once when status is checked');
		assert.equal(mp.result, DEFAULT, 'result is set to default value');
		await sleep(); // give time for setPending to run
		assert.isTrue(mp.peekHasInvoked, "has invoked");

		reactionDisposer = mobx.autorun(()=>mp.result);
		await whenComplete(mp);
		assert.equal(mp.result, INITIAL, 'observed initial result');
		assert.equal(mp.status, 'complete', 'status is complete when result updates');

		value.set('this result should be skipped');
		assert.equal(mp.status, 'pending', 'status pending after updating dependency');
		assert.equal(mp.result, INITIAL, 'result is still initial value');
		value.set('updated result');
		await whenComplete(mp);
		assert.equal(mp.status, 'complete', 'status updated to complete');
		assert.equal(mp.result, value.get(), 'result updated to latest value');
		assert.isTrue(mp.peekHasInvoked, "peekHasInvoked is still true");
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
			reaction: spy((result:string) => null)
		};
		let mp = new MobxPromise(params);

		assert.isFalse(mp.peekHasInvoked, "not invoked initially");
		await sleep();
		assert.isFalse(mp.peekHasInvoked, "checking peekHasInvoked does not trigger invoke");
		assert.equal(mp.result, DEFAULT, 'result matches default value when first requested');
		await sleep(); // give time for setPending to run
		assert.isTrue(mp.peekHasInvoked, "has invoked");

		reactionDisposer = mobx.autorun(()=>mp.result);
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				try
				{
					let callCount = params.invoke.callCount;
					assert.equal(mp.result, value.get(), 'result using latest value');
					assert.equal(params.invoke.callCount, callCount, 'not invoked again');
					assert.isTrue(mp.peekHasInvoked, "still has invoked");
					resolve(true);
				}
				catch (error)
				{
					reject(error);
				}
			}, 200);
		});
	});
});
