(function() {

	function addStep(reg, callback, camelScenarioName) {
		var allSteps = this.steps
		  , regString = reg.toString().replace(/(^\/)|(\/$)/g, '')
		  , key = camelScenarioName || 'global'
		  , foundSteps = allSteps[key]
		  , steps;

		allSteps[key] = foundSteps || [];
		steps = allSteps[key];
		
		var hasThatStepAlready = steps.filter(function(step) { return step.regString.toString() === regString }).length > 0;
		
		if (hasThatStepAlready) {
			var msg = 'Not allowed duplicate step is found [ key :  ' + key + ' ] : ' + regString;
			console.error(msg);
			throw new Error(msg);
		}

		steps.push({
			reg : reg,
			callback : callback,
			regString : regString
		});
	}

	function init(features) {
		features.forEach(function(feature) {
			var keyWords = feature.keyWords;
			keyWords.forEach(function(keyWord) {
				this[keyWord.toLowerCase()] = this.addStep.bind(this);
			}.bind(this));
		}.bind(this));
	}


	function getStep(stepText, camelScenarioName) {
		var key = camelScenarioName || 'global'
		  , allSteps = this.steps
		  , steps
		  , filteredStep;
	
		steps = allSteps[key];
		if (steps && steps.length > 0) {
			filteredStep = steps.filter(function(step) {return step.reg.test(stepText);}).pop();
		}

		if (!filteredStep) {
			var msg = '(getStep) cannot find step code maching this line : ' + stepText + ' [ key : ' + key + ' ]';
			console.error(msg);
			throw new Error(msg);
		}

		return filteredStep;
	}

	function getSteps() {
		return this.steps;
	}

	function StepsClass(features) {
		this.steps = {};
		this.init(features);
	}
	StepsClass.prototype.init = init;
	StepsClass.prototype.addStep = addStep;
	StepsClass.prototype.getSteps = getSteps;
	StepsClass.prototype.getStep = getStep;
	
	module.exports = StepsClass;

})();
