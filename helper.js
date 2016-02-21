

const debug = require('debug')('hello-helper');
const AWS = require('mock-aws-s3');

AWS.config.basePath = __dirname + '/buckets';

const s3 = AWS.S3({ params: { Bucket: 'example' } });

function surprise(name) {
    var tempMath		= Math.floor(Math.random() * 100) + 1;

    if (tempMath <= 50) {
        return new Error('w00t!!! ' + name + ' error ' + tempMath.toString());
    }
}

// simulates sending sms
exports.sendSms = function (data, callback) {

    setTimeout(function () {
        debug('sending out sms: ${JSON.stringify(data)}');
        callback(surprise('sending-sms'), {
            status: 200,
            message: 'OK',
        });
    }, 200);
};

// simulates logging to s3
exports.logToS3 = function (data, callback) {
	var temp_date		= new Date().toString();
    setTimeout(function () {
        debug('putting data to S3: ${JSON.stringify(data)}');
        s3.putObject({
            Key: 'row/line-'+temp_date.split(" ")[2]+'_'+temp_date.split(" ")[1]+'_'+temp_date.split(" ")[3]+'.json',
            Body: JSON.stringify(data),
        }, function (err) {
            callback(err ? err : surprise('log-to-s3'), { data:data, logged: true });
        });
    });
};
