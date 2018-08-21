const chai      = require( 'chai' );
const nock      = require( 'nock' );
const rss       = require( '../worker/rss-reader.js' );

describe('rss-reader', function () {

    // nock.recorder.rec();

    nock('http://rss.journeycheck.com:80', {"encodedQueryParams":true})
      .get('/scotrail/route')
      .query({"action":"search","from":"HNC","to":"YOK","period":"today","formTubeUpdateLocation":"","formTubeUpdatePeriod":"","savedRoute":""})
      .reply(200, "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?><rss version=\"2.0\">\n  <channel>\n    <title>ScotRail JourneyCheck Feeds</title>\n    <titleLink>http://www.journeycheck.com/SR</titleLink>\n    <logoLink>/resources/scotrail/web/images/logo.gif</logoLink>\n    <description>Check for problems on your route</description>\n    <pubDate>Tue, 21 Aug 2018 14:23:33 +0100</pubDate>\n    <ttl>10</ttl>\n    <item>\n      <title>UPDATED: Engineering Work: Between Glasgow Central and Lanark, Between Glasgow Central and Newton Lanark, Between Milngavie and Motherwell, Between Balloch and Dalmuir, Between Larkhall and Motherwell, Between Glasgow Central and Edinburgh, Between Dalmuir and Motherwell via Whifflet</title>\n      <description>Planned engineering work will take place between Glasgow Central and Lanark, between Glasgow Central and Newton Lanark, between Milngavie and Motherwell, between Balloch and Dalmuir, between Larkhall and Motherwell, between Glasgow Central and Edinburgh, and between Dalmuir and Motherwell via Whifflet from 00:00, Sunday 19 August 2018 to 23:59, Sunday 19 August 2018, from 00:00, Sunday 02 September 2018 to 23:59, Sunday 02 September 2018, and from 00:00, Sunday 23 September 2018 to 23:59, Sunday 23 September 2018.</description>\n      <link>http://www.journeycheck.com/scotrail/route?id=1322812502&amp;action=search&amp;from=HNC&amp;to=YOK&amp;savedRoute=&amp;formTubeUpdateType=&amp;formTubeUpdateLocation=Todays Enginering Works&amp;formTubeUpdatePeriod=#1322812502</link>\n      <pubDate>01:10:37 11/08/2018</pubDate>\n      <category/>\n    </item>\n  </channel>\n</rss>\n", [ 'Date',
      'Tue, 21 Aug 2018 13:24:42 GMT',
      'Server',
      'Apache/2.4.33 (Unix) OpenSSL/1.0.2o mod_jk/1.2.43',
      'X-XSS-Protection',
      '1; mode=block',
      'X-Content-Type-Options',
      'nosniff',
      'X-Frame-Options',
      'SAMEORIGIN',
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains',
      'Set-Cookie',
      'JSESSIONID=C2254D8A647B4F7A2EB9C24F6AD1AA89.jcpres7; Path=/; HttpOnly',
      'Cache-Control',
      'no-cache',
      'Pragma',
      'no-cache',
      'Expires',
      'Thu, 01 Jan 1970 00:00:00 GMT',
      'Content-Language',
      'en-GB',
      'Vary',
      'Accept-Encoding',
      'Content-Security-Policy',
      'script-src \'self\' https://www.gstatic.com https://www.google.com https://ssl.google-analytics.com https://www.google-analytics.com https://ssl.jcheck.com http://ssl.jcheck.com \'unsafe-eval\' \'unsafe-inline\'; object-src \'self\' https://ssl.jcheck.com http://ssl.jcheck.com https://www.google.com https://www.gstatic.com',
      'Connection',
      'close',
      'Transfer-Encoding',
      'chunked',
      'Content-Type',
      'application/rss+xml;charset=ISO-8859-1' ]);

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
