/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';
const Alexa         = require('alexa-sdk');
const Stations      = require( './worker/stations.js' );
const RssReader     = require( './worker/rss-reader.js' );

const APP_ID        = 'amzn1.ask.skill.45dbaa2a-c19c-40b6-9fd9-34dbd1eb090b';
const HELP_MESSAGE  = 'Help Message Here';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE  = 'Ok Goodbye!';

const optionalGreetings = [
    'Welcome to ',
    'Hello and welcome to ',
    'Hey this is '
];

const handlers = {
    'LaunchRequest': function () {
        let random = Math.floor( Math.random() * 3 );
        this.attributes.startLocation = null;
        this.attributes.endLocation = null;
        this.response.speak( "<audio src='https://s3.amazonaws.com/ask-soundlibrary/transportation/amzn_sfx_subway_leaving_01.mp3'/> " + optionalGreetings[random] + " Train Checker, where are you travelling today?").listen();
        this.emit(':responseReady');
    },
    'journeyIntent': function() {

        if ( this.event.request.intent.confirmationStatus == 'NONE' ) {

            if ( !this.event.request.intent.slots.startLocation.value ) {

                const slotToElicit = 'startLocation';
                const speechOutput = 'Where will you be starting your journey';
                const repromptSpeech = 'Please tell me where you are starting from';
                this.emit( ':elicitSlot' , slotToElicit , speechOutput , repromptSpeech );

            } else if ( !this.event.request.intent.slots.endLocation.value ) {

                const slotToElicit = 'endLocation';
                const speechOutput = 'Where will you be ending your journey';
                const repromptSpeech = 'Please tell me where you are getting off';
                this.emit( ':elicitSlot' , slotToElicit , speechOutput , repromptSpeech );

            } else if ( this.event.request.intent.slots.startLocation.value && this.event.request.intent.slots.endLocation.value && this.event.request.intent.confirmationStatus == 'NONE' ) {

                this.attributes.startLocation = this.event.request.intent.slots.startLocation.value;
                this.attributes.endLocation = this.event.request.intent.slots.endLocation.value;

                const speechOutput = "Ok, I'll check the trains between " + this.attributes.startLocation + " and " + this.attributes.endLocation + ", is this correct?";
                const repromptSpeech = speechOutput;
                this.emit( ':confirmIntent' , speechOutput , repromptSpeech );

            }

        } else {

            if ( this.event.request.intent.confirmationStatus !== 'DENIED' ) {

                let startStation = '';
                let endStation = '';

                // This is a bit of a mess, need to improve this...
                // -------------------------------------------------------------------
                let myPromise = new Promise( (resolve, reject) => {
                    Stations.loadStations( ( err , status ) => {
                        if ( err ) {
                            reject( err );
                        }
                        resolve( status );
                    });
                });

                myPromise.then( (resolvedValue) => {

                    startStation = Stations.lookupStation( this.attributes.startLocation );
                    endStation = Stations.lookupStation( this.attributes.endLocation );

                    if ( startStation === '' || endStation === '' ) {
                        this.response.speak( "Sorry I wasn't able to identify those stations, would you like to restart or exit?" ).listen( "Would you like to restart or exit?" );
                        this.emit(':responseReady');
                    } else {

                        let myPromiseRss = new Promise( (resolve, reject) => {
                            RssReader.loadData( startStation , endStation , function( err , items ) {
                                if ( err ) {
                                    reject( err );
                                }
                                resolve( items );
                            });
                        });

                        myPromiseRss.then( (resolvedValue) => {

                            let output = '';

                            resolvedValue.forEach( function( value ) {
                                output += '<p>' + value.description + '</p>';
                            });

                            this.response.speak( "Ok, I'm checking " + startStation + " to " + endStation + " and found " + output );
                            this.emit(':responseReady');

                        }, (error) => {
                            // RSS lookup failed for some reason, deal with it
                            this.response.speak( "Sorry I wasn't able to find any route information, would you like to restart or exit?" ).listen( "Would you like to restart or exit?" );
                            this.emit(':responseReady');
                        });

                    }

                }, (error) => {

                    // Deal with errors related to loading the stations.csv file
                    this.response.speak( "Sorry I wasn't able to find any route information, would you like to restart or exit?" ).listen( "Would you like to restart or exit?" );
                    this.emit(':responseReady');

                });

            } else {
                // Deal with somebody saying No to :confirmIntent
                this.response.speak( "I must've misheard you, would you like to restart or exit?" ).listen( "Would you like to restart or exit?" );
                this.emit(':responseReady');
            }

        }

    },
    'restartOrQuitIntent': function() {
        this.attributes = {};
        this.response.speak( "Ok lets start again, where would you like to travel from?" ).listen("Where would you like to travel from?");
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.attributes = {};
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.attributes = {};
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        this.attributes = {};
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        this.emit(':ask', "Sorry, I didn't get that.", "Sorry, I didn't get that.");
    }
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
