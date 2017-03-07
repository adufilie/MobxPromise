"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Sinon = require("sinon");
const mobx = require("mobx");
const mobxpromise_1 = require("../src/mobxpromise");
function spy(func) {
    return Sinon.spy(func);
}
function observeOnce(expression) {
    return __awaiter(this, void 0, void 0, function* () {
        let n = 0;
        let value;
        return new Promise(resolve => {
            mobx.when(() => {
                value = expression();
                return n++ > 0;
            }, () => resolve(value));
        });
    });
}
describe('MobxPromise', () => {
    const INITIAL = 'initial';
    const DEFAULT = 'default';
    let reactionDisposer;
    afterEach(() => {
        //reactionDisposer();
    });
    it('triggers mobx as expected', () => __awaiter(this, void 0, void 0, function* () {
        let value = mobx.observable(INITIAL);
        let params = {
            invoke: spy(() => __awaiter(this, void 0, void 0, function* () { return value.get(); })),
            default: DEFAULT,
            reaction: spy((result) => null)
        };
        let mp = new mobxpromise_1.default(params);
        // let reaction = spy(() => {
        // 	let {status, result, error, isPending, isError, isComplete} = mp;
        // 	return {status, result, error, isPending, isError, isComplete} as typeof mp;
        // });
        chai_1.assert.isTrue(params.invoke.notCalled, 'invoke is not called until we attempt to access properties');
        // we have to set up a reaction or @computed properties won't be cached.
        // reactionDisposer = mobx.autorun(reaction);
        chai_1.assert.equal(mp.status, 'pending', 'status is pending immediately after creation');
        chai_1.assert.isTrue(params.invoke.calledOnce, 'invoke called once when status is checked');
        chai_1.assert.equal(mp.result, DEFAULT, 'result is set to default value');
        chai_1.assert.equal(yield observeOnce(() => mp.result), INITIAL, 'observed initial result');
        chai_1.assert.equal(mp.status, 'complete', 'status is complete when result updates');
        value.set('this result should be skipped');
        chai_1.assert.equal(mp.status, 'pending', 'status pending after updating dependency');
        chai_1.assert.equal(mp.result, INITIAL, 'result is still initial value');
        value.set('updated result');
        chai_1.assert.equal(yield observeOnce(() => mp.status), 'complete', 'status updated to complete');
        chai_1.assert.equal(mp.result, value.get(), 'result updated to latest value');
        // assert.isTrue(params.reaction.calledTwice, 'params.reaction() called only twice');
        // assert.isTrue(params.reaction.firstCall.calledWith(INITIAL), 'params.reaction() called first time with initial value');
        // assert.isTrue(params.reaction.lastCall.calledWith(value.get()), 'params.reaction() called second time with final value');
        return true;
    }));
});
//# sourceMappingURL=MobxPromise.spec.js.map