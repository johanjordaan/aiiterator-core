const should = require('should');
const Integer = require('./Integer')

describe('xxx',()=>{
	it('should',()=>{
		const def = Integer.CreateDef(2,4)
		Integer.Validate(1,def).should.equal(false)
		Integer.Validate(3,def).should.equal(true)
	})

	it('should',()=>{
		const def = Integer.CreateDef(2,4)
		Integer.Validate([1,2],def).should.equal(false)
		Integer.Validate(3.33,def).should.equal(false)
	})

})
