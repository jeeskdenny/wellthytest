const assert = require("chai").assert;
const expect = require("chai").expect;
var common = require("../../../methods/common");

describe("Common Methods", () => {
    it('Distance Calculation equalityTest - getDistanceFromGoogleMapApi');
    it('Distance Calculation typeCheck - getDistanceFromGoogleMapApi');
    it('Distance Calculation equalityTest- getDistanceFromGoogleMapApi', () => {
        return common.getDistanceFromGoogleMapApi(
            ["-33.86748", "151.20699"].toString(), ["-33.861483", "151.207279"].toString())
            .then(function (data) {
                expect(data).to.equal(752);
            });
    });
    it('Distance Calculation typeCheck - getDistanceFromGoogleMapApi', () => {
        return common.getDistanceFromGoogleMapApi('-33.861483,151.207279', '-33.861483,151.207279')
            .then(function (data) { expect(typeof data).to.equal("number"); });
    });
});