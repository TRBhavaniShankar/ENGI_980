import expect from "expect" ;

describe('mocha and expect', function() : void{
    it('should fail this test', function() : void {
        expect( true ).toBe( false ) ;
    } ) ;
    it('should pass this test', function() : void {
        expect( true ).toBe( true ) ;
    } ) ;
} ) ;