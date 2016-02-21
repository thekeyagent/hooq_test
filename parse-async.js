// Please use async lib https://github.com/caolan/async
'use strict';
const debug = require('debug')('hello');
const helper = require('./helper');
var fs	= require('fs'),
parse = require('csv-parse'),
async = require('async'),

inputFile = './sample.csv';

var parser		= parse({ delimiter: ',' }, function (er, data) {
    data.forEach(function (val) {
        async.parallel([
			function (callback) {
    if (val[0] != '') {
        console.log(val[0] + ' ' + val[1]);
        callback();
    }
			},

			function (callback) {
    if (val[0] != '') {
        //send sms
        helper.sendSms(val, function afterSending(err, sendingStatus) {
            var lineToLog;
            if (err) {
                debug(err.message);
            }

            lineToLog = {
                sendingStatus: sendingStatus,
                line: val,
            };
            if (lineToLog) {
                helper.logToS3(lineToLog, function afterLogging(err, loggingStatus) {
                                if (err) {
                                    debug(err.message);
                                }
                            });
            }
        });
    }
			},
		], function (err, res) {
    console.log('something wrong mate');
		});
    });
});

fs.createReadStream(inputFile).pipe(parser);
