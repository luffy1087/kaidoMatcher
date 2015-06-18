var kaidoStepsClass = require('../kaidoSteps')
  , should = require('should')
  , features = require('./featuresModel');

describe('kaidoSteps', function() {

	beforeEach(function(){
    	kaidoSteps = new kaidoStepsClass(features);
  	});
	
	it('prototype', function() {
		kaidoSteps.init.should.be.instanceOf(Function);
		kaidoSteps.addStep.should.be.instanceOf(Function);
		kaidoSteps.getSteps.should.be.instanceOf(Function);
		kaidoSteps.getStep.should.be.instanceOf(Function);
	});

	it('check steps function taken from keywords', function() {
		kaidoSteps.given.should.be.instanceOf(Function);
		kaidoSteps.when.should.be.instanceOf(Function);
		kaidoSteps.then.should.be.instanceOf(Function);
	});

	it('getSteps', function() {
		kaidoSteps.given(/I visit the home page/, function() {});
		kaidoSteps.when(/I click on the menu/, function() {});
		kaidoSteps.then(/Categories should appear/, function() {});
		kaidoSteps.getSteps().should.be.instanceOf(Object);
	});

	it('getStep', function() {
		kaidoSteps.given(/I do that/, function() {});
		kaidoSteps.when(/I do this/, function(){}, 'firstScenario');
		kaidoSteps.then(/something happens/, function(){});
		kaidoSteps.getStep('I do that').should.be.instanceOf(Object);
		kaidoSteps.getStep('I do this', 'firstScenario').should.be.instanceOf(Object);
		kaidoSteps.getStep('something happens').should.be.instanceOf(Object);
		(function() {
			kaidoSteps.getStep('it should raise an error');
		}).should.throw(); // the step is not matched by any regexp
	});

	it('check adding steps', function() {
		kaidoSteps.given(/I visit the home page/, function() {});
		kaidoSteps.getSteps().global.length.should.be.equal(1);
	});
	
	it('check deplicate steps', function() {
		kaidoSteps.given(/I visit the home page/, function() {});
		(function(){
			kaidoSteps.given(/I visit the home page/, function() {});			
		}).should.throw(/Duplicate/i);
	});

});