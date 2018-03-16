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

	describe("MobxPromise.all", () => {
		it("gives correct results for empty array input", (done) => {
			MobxPromise.all([], {
				onResult:r => {
					assert.deepEqual(r, [], "result should be empty array");
					done();
				},
				onError:e => {
					throw new Error("break test!");
				}
			}).result; // reference result to invoke promise
		});
		it("gives correct results for one promise input", (done) => {
			const promise = MobxPromise.all([
				new MobxPromise({
					invoke:() => Promise.resolve("whatsup")
				})
			], {
				default:["default"],
				onResult:r => {
					assert.deepEqual(r, ["whatsup"]);
					done();
				},
				onError:e => {
					throw new Error("break test!");
				}
			});
			assert.deepEqual(promise.result, ["default"]); // checking .result invokes the promise
		});
		it("awaits the given promises and invokes, returning the array of their results in order, and having given default result", () => {
			const promise = MobxPromise.all([
				new MobxPromise({
					invoke:() => Promise.resolve("hello")
				}),
				new MobxPromise({
					invoke:() => Promise.resolve("hi")
				}),
				new MobxPromise({
					invoke:() => Promise.resolve("bye")
				})
			], {
				default:["default"],
				onResult:r => {
					assert.deepEqual(r, ["hello", "hi" ,"bye"]);
					done();
				},
				onError:e => {
					throw new Error("break test!");
				}
			});
			assert.deepEqual(promise.result, ["default"]); // checking .result invokes the promise
		});
		it("errors if any of the given promises error", () => {
			const promise = MobxPromise.all([
				new MobxPromise({
					invoke:() => Promise.reject("oh no!!")
				}),
				new MobxPromise({
					invoke:() => Promise.resolve("hi")
				}),
				new MobxPromise({
					invoke:() => Promise.resolve("bye")
				})
			], {
				default:["default"],
				onResult:r => {
					throw new Error("break test!");
				},
				onError:e => {
					assert.equal(e.message, "oh no!!");
					done();
				}
			});
			assert.deepEqual(promise.result, ["default"]); // checking .result invokes the promise
		});
	});
});
