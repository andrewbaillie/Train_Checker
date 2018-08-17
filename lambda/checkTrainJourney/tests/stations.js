const chai      = require( 'chai' );
const stations  = require( '../worker/stations.js' );

describe('loadStations', function () {

    it('should return done, for loading stations', function ( done ) {
        stations.loadStations( ( err , status ) => {
            if ( err ) {
                done( new Error( err ) );
            } else {
                chai.expect( status ).to.equal( 'done' );
                done();
            }
        });
    });

    it('should return HNC, for input of Hamilton Central', function () {
        chai.expect( stations.lookupStation( 'Hamilton Central' ) ).to.equal( 'HNC' );
    });

    it('should return YOK, for input of Yoker', function () {
        chai.expect( stations.lookupStation( 'Yoker' ) ).to.equal( 'YOK' );
    });

});
