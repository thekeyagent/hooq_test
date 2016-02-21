// please use promise approach to fight the naive one in parse-callback.js
'use strict';
const debug = require('debug')('hello');
const helper = require('./helper');
var fs = require('fs'),
Q = require('q'),
parse = require('csv-parse');

Q.nfcall(fs.readFile, './sample.csv')
.then(function (data) {
    data.toString().split('\r').forEach(function (val) {
        if (val.split(',')[0] != '') {

            console.log(val.split(',')[0].replace(/"/g, '') + ' '
			+ val.split(',')[1].replace(/"/g, ''));

            //send sms
            console.log('sending sms');
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
    });
})
.fail(function (err) {
    console.log('something wrong ' + err);
})
.done(function () {
    console.log('done');
});
