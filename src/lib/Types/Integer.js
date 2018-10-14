const _ = require('lodash')

const CreateDef = (min, max) => {
	return {
		type: 'Integer',
		min,
		max
	}
}

const Validate = (value, def) => {
	if(!_.isInteger(value)) return false
	if(value<def.min || value>def.max) return false;
	return true;
}

module.exports = {
	CreateDef,
	Validate
}
