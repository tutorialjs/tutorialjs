var chai = require('chai');
var expect = chai.expect;

describe('When I open the demo page', () => {

    beforeEach((done)=>{
        browser.url('demo/test').call(done)
    });

    it('has a tutorial blur', () => {
        browser.element('div.tutorial-blur').waitForExist();
    });

    it('has a tutorial wrapper', () => {
        browser.element('div.tutorial-wrapper').waitForExist();
    });
});