var axios = require('axios');
var qs = require("qs");
var crypto = require("crypto");

const mongoose = require('mongoose');
const WashroomStatus = require('../models/WashroomStatus.js');
const WashroomLog = require('../models/WashroomLog.js');

var config = {
    /* Service address */
    host: 'https://openapi.tuyaus.com',
    /* Access Id */
    accessKey: '57htseg8b52yh9tz9ct1',
    /* Access Secret */
    secretKey: '2ce1c36276504b139bfdbb28e5bf2cce',
    /* Interface example device_id */
    deviceId: '3428254740f5201991ea',
};

var httpClient = axios.create({
    baseURL: config.host,
    timeout: 5 * 1e3
});

exports.startPolling = async () => {
    console.log('TuyaAPI: Polling service started...');
    while (true) {
        await Promise.all([
            poll(),
            timeout(5000)
        ])
    }
}

async function poll() {
    const data = await getDeviceInfo(config.deviceId);

    const occupied = !data.result.status[0].value;
    const currentStatus = (await WashroomStatus.findOne({ washroomId: config.deviceId }).exec()).occupied;

    if (occupied !== currentStatus || currentStatus === undefined) {
        WashroomLog.create({
            washroomId: config.deviceId,
            occupied
        }, (err) => {
            if (err) {
                console.error('ERROR: Couldn\'t save washroom status log...');
                console.error(err);
            }
        });
    }

    WashroomStatus.findOneAndUpdate(
        { washroomId: config.deviceId }, // query
        { occupied },
        { 
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        },
        function(err, res) {
            if (err) {
                console.error('ERROR: Couldn\'t update washroom status...');
                console.error(err);
            }
        }
    );
}

async function getToken() {
    const method = 'GET';
    const timestamp = Date.now().toString();
    const signUrl = '/v1.0/token?grant_type=1';
    const contentHash = crypto.createHash('sha256').update('').digest('hex');
    const stringToSign = [method, contentHash, '', signUrl].join('\n');
    const signStr = config.accessKey + timestamp + stringToSign;

    const headers = {
        t: timestamp,
        sign_method: 'HMAC-SHA256',
        client_id: config.accessKey,
        sign: await encryptStr(signStr, config.secretKey),
    };

    const { data: login } = await httpClient.get('/v1.0/token?grant_type=1', { headers });
    if (!login || !login.success) {
        throw Error(`Authorization Failed: ${login.msg}`);
    }

    return login.result.access_token;
}

async function getDeviceInfo(deviceId, ) {
    const token = await getToken();

    const query = {};
    const method = 'GET';
    const url = `/v1.0/devices/${deviceId}`;
    const reqHeaders = await getRequestSign(token, url, method, {}, query);

    const { data } = await httpClient.request({
        method,
        data: {},
        params: {},
        headers: reqHeaders,
        url: reqHeaders.path,
    });

    if (!data || !data.success) {
        throw Error(`Request highway Failed: ${data.msg}`);
    }

    return data;
}

async function getRequestSign(
    token,
    path,
    method,
    headers,
    query,
    body = {},
  ) {
    const t = Date.now().toString();
    const [uri, pathQuery] = path.split('?');

    const queryMerged = Object.assign(query, qs.parse(pathQuery));
    const sortedQuery = {};
    Object.keys(queryMerged)
        .sort()
        .forEach((i) => (sortedQuery[i] = query[i]));

    const querystring = decodeURIComponent(qs.stringify(sortedQuery));
    const url = querystring ? `${uri}?${querystring}` : uri;
    const contentHash = crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex');
    const stringToSign = [method, contentHash, '', url].join('\n');
    const signStr = config.accessKey + token + t + stringToSign;

    return {
        t,
        path: url,
        client_id: config.accessKey,
        sign: await encryptStr(signStr, config.secretKey),
        sign_method: 'HMAC-SHA256',
        access_token: token
    };
}

async function encryptStr(str, secret) {
    return crypto.createHmac('sha256', secret).update(str, 'utf8').digest('hex').toUpperCase()
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}