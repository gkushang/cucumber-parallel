'use strict';

module.exports = function parallelStepDefs() {

    this.Then(/^a passing$/, function(callback) {
        callback();
    });

};
