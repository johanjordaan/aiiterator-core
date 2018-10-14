const _ = require('lodash')
const CreateDef = (options, min, max, allowDuplicates) => {


	return {
		type: 'Select',
		options,
		min,
		max,
		allowDuplicates
	}
}

const Validate = (value, def) => {
	if(!_.isArray(value)) return false
	if(value.length<def.min || value.length>def.max) return false
	if(_.without(value,...def.options).length !== 0 ) return false
	return true;
}

module.exports = {
	CreateDef,
	Validate
}
