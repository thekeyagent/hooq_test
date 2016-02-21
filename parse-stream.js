// 0. Please use readline (https://nodejs.org/api/readline.html) to deal with per line file reading
// 1. Then use the parse API of csv-parse (http://csv.adaltas.com/parse/ find the Node.js Stream API section)
'use strict';
const debug = require('debug')('hello');
const helper = require('./helper');
var rl	= require('readline').createInterface({
    input: require('fs').createReadStream('./sample.csv'),
    output: process.stdout,
    terminal: false,
});

//rl		= readline('./sample.csv');
rl.on('line', function (val) {
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
})
.on('error', function (e) {
    console.log('Somewthing Wrong ' + e);
});
