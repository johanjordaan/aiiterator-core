const should = require('should');
const String = require('./String')

describe('String',()=>{
	describe('CreateDef',()=>{
		const def = String.CreateDef()

		it('should create a valid String def',()=>{
			def.type.should.equal('String')
		})
	})

	describe('Validate',()=>{
		const def = String.CreateDef()

		it('should accept strings',()=>{
			String.Validate('hallo',def).should.equal(true)
		})

		it('should reject non strings',()=>{
			String.Validate(undefined,def).should.equal(false)
			String.Validate([],def).should.equal(false)
			String.Validate({},def).should.equal(false)
			String.Validate(1,def).should.equal(false)
		})

	})


})
