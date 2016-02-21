'use strict';
const debug = require('debug')('hello');

const fs = require('fs');
const parse = require('csv-parse');
const helper = require('./helper');

// 0. Naïve

function naive() {
    fs.readFile(__dirname + '/sample.csv', function thenParse(err, loadedCsv) {

        parse(loadedCsv, function transformEachLine(err, parsed) {
            parsed.forEach(function (val) {
                //display the first name and last name
                console.log(val[0] + ' ' + val[1]);

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
            });
        });
    });
}

naive();

