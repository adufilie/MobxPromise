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

describe('MobxPromise', () => {
	const INITIAL = 'initial';
	const DEFAULT = 'default';
	let reactionDisposer:mobx.IReactionDisposer;

	afterEach(() => {
		//reactionDisposer();
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

		assert.isTrue(params.invoke.notCalled, 'invoke is not called until we attempt to access properties');

		// we have to set up a reaction or @computed properties won't be cached.
		// reactionDisposer = mobx.autorun(reaction);

		assert.equal(mp.status, 'pending', 'status is pending immediately after creation');
		assert.isTrue(params.invoke.calledOnce, 'invoke called once when status is checked');
		assert.equal(mp.result, DEFAULT, 'result is set to default value');
		assert.equal(await observeOnce(() => mp.result), INITIAL, 'observed initial result');
		assert.equal(mp.status, 'complete', 'status is complete when result updates');

		value.set('this result should be skipped');
		assert.equal(mp.status, 'pending', 'status pending after updating dependency');
		assert.equal(mp.result, INITIAL, 'result is still initial value');
		value.set('updated result');
		assert.equal(await observeOnce(() => mp.status), 'complete', 'status updated to complete');
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
			reaction: spy((result:string) => null)
		};
		let mp = new MobxPromise(params);

		assert.equal(mp.result, DEFAULT, 'result matches default value when first requested');
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				try
				{
					let callCount = params.invoke.callCount;
					assert.equal(mp.result, value.get(), 'result using latest value');
					assert.equal(params.invoke.callCount, callCount, 'not invoked again');
					resolve(true);
				}
				catch (error)
				{
					reject(error);
				}
			}, 200);
		});
	});

	it('calls invoke with the arguments from await', (done)=>{
		let mp1 = new MobxPromise(()=>new Promise<number>(resolve=>setTimeout(()=>resolve(5), 10)));
		let mp2 = new MobxPromise(()=>new Promise<string>(resolve=>setTimeout(()=>resolve("hello"), 10)));
		let mp3 = new MobxPromise({
			await:()=>[mp1, mp2],
			invoke:(a0:number, a1:string)=>{
				assert.equal(a0, 5);
				assert.equal(a1, "hello");
				done();
				return Promise.resolve("hi");
			}
		});
		mp3.result;
	});
});
