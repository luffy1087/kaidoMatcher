(function() {
	
	//dependencies
	var glob = require('glob')
	  , Promise = require('promise')
	  , kaidoStepsClass = require('./kaidoSteps');

	function getStepsFiles(resolve, reject) {
		glob('steps/**/*.js', null, function(err, files) {
			if (err) {
				reject(err);
			} else if (files && files.length > 0) {
				this.files = files;
				resolve(files);
			}
		}.bind(this));
	}

	function requireStepsFile(stepsFilesPath) {
		var kaidoSteps = this.kaidoSteps
		  , basePath = process.cwd()
		  , stepFileName;
		for (var i = 0, stepFilePath; stepFilePath = stepsFilesPath[i]; i++) {
			stepFilePath = basePath + '/' + stepFilePath;
			stepFileName = stepFilePath.split('/').pop();
			try {
				require(stepFilePath).defineSteps(kaidoSteps);
			} catch(e){
				console.log('Require error: Cannot find module ' + stepFileName);
				console.log(e);
			}
		}
		return kaidoSteps;
	}

	function executeStep(stepText, camelScenarioName) {
		var step = this.kaidoSteps.getStep(stepText, camelScenarioName)
		  , callback = step.callback
		  , regVars = /<\w+>/g
		  , vars = stepText.match(regVars) || [];

		if (vars.length > 0) {
			vars = vars.map(function(elm) {return elm.replace(/[<>]/g, '');});
		}

		stepText = stepText.replace(regVars, '');

		//1) placeholders must be resolved before launching kaidoSteps
		//2) pass variables to callback...done
		callback.apply(null, vars);
	}

	function execute() {
		this.features.forEach(function(feature) {
			feature.scenarios.forEach(function(scenario) {
				scenario.steps.forEach(function(step) {
					this.executeStep(step.step, scenario.camelScenarioName);
				}.bind(this));
			}.bind(this));
		}.bind(this));
		return true;
	}

	function start() {
		var p = new Promise(this.getStepsFiles.bind(this))

		.then(function(files) {
			this.requireStepsFile(files);
			return 1;
		}.bind(this))

		.then(function() {
			this.execute();
			return 1;
		}.bind(this));
			
		return p;
	}

	function KaidoMatcherClass(features) {
		this.features = features;
		this.kaidoSteps = new kaidoStepsClass(features);
	}
	KaidoMatcherClass.prototype.start = start;
	KaidoMatcherClass.prototype.getStepsFiles = getStepsFiles;
	KaidoMatcherClass.prototype.requireStepsFile = requireStepsFile;
	KaidoMatcherClass.prototype.execute = execute;
	KaidoMatcherClass.prototype.executeStep = executeStep;

	module.exports = KaidoMatcherClass;
	
})();