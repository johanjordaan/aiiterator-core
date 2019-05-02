const should = require('should');
const {
  Map,
  List,
} = require('immutable')

const Select = require('./Select')

describe('xxx',()=>{
	it('should',()=>{
		const def = Select.CreateDef([1,2,3],2,2,false)
		Select.Validate([1,3],def).should.equal(true)
	})

	it('should',()=>{
		const def = Select.CreateDef([1,2,3],2,2,false)
		Select.Validate([9,3],def).should.equal(false)
	})

	it('should',()=>{
		const def = Select.CreateDef([1,2,3],2,2,false)
		Select.Validate([9],def).should.equal(false)
	})

	it('should',()=>{
		const def = Select.CreateDef(List([1,2,3]),2,2,false)
		Select.Validate([1,3],def).should.equal(true)
	})


	it('should',()=>{
		const def = Select.CreateDef([1,2,3],2,2,false)
		Select.Validate(3,def).should.equal(false)
	})

  it('should allow duplicxate selection',()=>{
		const def = Select.CreateDef([1,2,3],2,2,true)
		Select.Validate([2,2],def).should.equal(true)
	})


})
