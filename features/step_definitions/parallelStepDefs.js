'use strict';

module.exports = function parallelStepDefs() {

    this.Then(/^a passing$/, function(callback) {
        callback();
    });

    this.Then(/^a failing/, function(callback) {
        callback('I am failing :-(');
    });

};
