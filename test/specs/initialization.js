var expect = require(chai).expect;

describe("Initialization", function() {
    it("should create default instance", function () {
        var t = new Tutorial({name: "test"});

        expect(t.selector).to.equal("tut-action");
    });
});