const _ = require('lodash')

// TODO : Length? min max?
const CreateDef = () => {
	return {
		type: 'String',
	}
}

const Validate = (value, def) => {
	if(!_.isString(value)) return false
	return true;
}

module.exports = {
	CreateDef,
	Validate
}
