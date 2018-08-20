const fs    = require( 'fs' );
const csv   = require( 'fast-csv' );

let stationList = [];

let lookupStation = ( input ) => {

    let found = '';
    let comp = '';

    input = input.toLowerCase();

    if ( stationList.length !== 0 ) {

        stationList.forEach( ( value ) => {
            comp = value[0].toLowerCase();
            if ( comp === input ) {
                 found = value[1];
            }
        });

    }

    return found;

};

let loadStations = ( callback ) => {

    fs.createReadStream( "./data/scotrail.csv" )
    .on( 'error' , ( err ) => {
        callback( err , null );
    })
    .pipe( csv() )
    .on( 'data' , ( data ) => {
        stationList.push( data );
    })
    .on( 'end' , () => {
        callback( null , 'done' );
    });

};

module.exports = { loadStations , lookupStation };
