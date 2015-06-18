var kaidoMatcherClass = require('../kaidoMatcher')
  , should = require('should')
  , features = require('./featuresModel')
  , sinon = require('sinon');

function err(){ throw new Error(); }

describe('kaidoMatcher tests', function() {

	beforeEach(function(){
    	kaidoMatcher = new kaidoMatcherClass(features);
  	});
	
	it('prototype', function() {
		kaidoMatcher.getStepsFiles.should.be.instanceOf(Function);
		kaidoMatcher.requireStepsFile.should.be.instanceOf(Function);
		kaidoMatcher.execute.should.be.instanceOf(Function);
		kaidoMatcher.executeStep.should.be.instanceOf(Function);
	});

	it('getStepsFiles', function(done) {
		kaidoMatcher.getStepsFiles(function(files) {
			files.should.be.instanceOf(Array);
			files.should.have.property('length').greaterThan(0);
			done();
		}, err);
	});

	it('requireStepsFile does not throw error', function() {
		var stepsFilePath = [
			'steps/steps-home.js'
		];
		(function() {
			kaidoMatcher.requireStepsFile(stepsFilePath);
		}).should.not.throw();
		
	});

	it('requireStepsFile fills kaidoSteps.steps', function() {
		var stepsFilePath = [
			'steps/steps-home.js'
		];
		kaidoMatcher.requireStepsFile(stepsFilePath);
		kaidoMatcher.kaidoSteps.getStep('I visit the home page').should.be.instanceOf(Object);
		kaidoMatcher.kaidoSteps.getStep('I click on the menu').should.be.instanceOf(Object);
		kaidoMatcher.kaidoSteps.getStep('Categories should appear').should.be.instanceOf(Object);
	});

	it('executeStep', function() {
		var stepsFilePath = [
			'steps/steps-home.js'
		];
		kaidoMatcher.requireStepsFile(stepsFilePath);
		(function() {
			kaidoMatcher.executeStep('I visit the home page');
		}).should.not.throw();
	});

	it('executeStep with variables', function() {
		var spy = sinon.spy();
		var kaidoGetStepStub = sinon.stub(kaidoMatcher.kaidoSteps, 'getStep', function(){
			return {
				callback : spy
			}
		});
		kaidoMatcher.executeStep('I want to test two vars. the first one and the second one<Luffy1087><Kaido>');
		spy.calledOnce.should.be.true;
		spy.getCall(0).args[0].should.be.equal('Luffy1087');
		spy.getCall(0).args[1].should.be.equal('Kaido');
		kaidoGetStepStub.restore();
	});

	it('executeAllSteps', function() {
		var stepsFilePath = [
			'steps/steps-home.js'
		];
		kaidoMatcher.requireStepsFile(stepsFilePath);
		(function() {
			kaidoMatcher.execute();
		}).should.not.throw();
	});	

	it('start', function(done) {
		var getStepsFilesSpy = sinon.spy(kaidoMatcher, 'getStepsFiles');
		var requireStepsFileSpy = sinon.spy(kaidoMatcher, 'requireStepsFile');
		var executeSpy = sinon.spy(kaidoMatcher, 'execute');
		kaidoMatcher.start().then(function(){
			getStepsFilesSpy.calledOnce.should.be.true;
			requireStepsFileSpy.calledOnce.should.be.true;
			executeSpy.calledOnce.should.be.true;
			getStepsFilesSpy.restore();
			requireStepsFileSpy.restore();
			executeSpy.restore();
			done();
		}, err);
	});

});