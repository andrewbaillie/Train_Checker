const FeedParser  = require( 'feedparser' );
const request     = require( 'request' );

loadData = ( from , to , callback ) => {

    let req = request('http://rss.journeycheck.com/scotrail/route?action=search&from=' + from + '&to=' + to + '&period=today&formTubeUpdateLocation=&formTubeUpdatePeriod=&savedRoute=')
    let feedparser  = new FeedParser( { addmeta: false } );
    let items = [];

    // Error handler for the request
    req.on('error', (error) => {
        callback( error , null );
    });

    // Check the response from the server is good
    req.on( 'response' , (res) => {

        if ( res.statusCode !== 200 ) {
            callback( new Error('Bad status code') , null );
        }
        else {
            req.pipe(feedparser);
        }

    });

    // Error handler for the feed
    feedparser.on('error', (error) => {
        callback( error , null );
    });

    // When stream is readable process it
    feedparser.on('readable', () => {

        while ( item = feedparser.read() ) {

            let data = {};
            data.title          = item.title;
            data.description    = item.description;

            items.push( data );
        }

    });

    // When finished callback with the retreived data
    feedparser.on( 'end' , () => {
        callback( null , items );
    });

};

module.exports = { loadData };
