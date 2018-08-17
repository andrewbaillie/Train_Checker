const chai      = require( 'chai' );
const rss       = require( '../worker/rss-reader.js' );

describe('rss-reader', function () {

    it('Should return data for given input', function ( done ) {
        rss.loadData( 'HNC' , 'YOK' , function( err , items ) {
            if ( err ) {
                done( new Error( err ) );
            } else {
                chai.expect( items ).to.be.a('array');
                done();
            }
        });
    });

});
