const xapiURL = config.apiURLs.xAPI_URL;
// const xapiURL = getxAPIurl();

local_user_cache_last_update = localStorage.getItem("local_user_cache_last_update");
if (local_user_cache_last_update === null) {
    local_user_cache_last_update = 0;
}

local_user_cache = localStorage.getItem("local_user_cache");
if (local_user_cache === null) {
    local_user_cache = "{}";
}

function lucTooOld() {
    // check if the local user cache is expired
    ts_cache = parseInt(local_user_cache_last_update);
    ts_now = Math.floor(Date.now() / 1000);
    // how old does the cache need to be to consider it expired, in seconds
    expire_days = 15;
    // convert days to seconds
    expire_seconds = expire_days * 86400; 
    // is the cache too old? check the timestamp difference (now - cache)
    if (Math.abs(ts_cache - ts_now) > expire_seconds) {
        // cache is too old
        return true;
    } else {
        // cache should be fine
        return false;
    }
}

function getUserInfo(uid) {
    // check cache first
    luc = JSON.parse(local_user_cache);
    if (lucTooOld() === false) {
        // cache should be new enough to use
        if (uid in luc) {
            // console.log('[xclient.js] getUserInfo() :: user is cached');
            user = luc[uid];
            return user;
        }
    }

    // local cache didnt have our user, fire the requests!
    // xmlhttprequest (sync)
    req = new XMLHttpRequest();
    req.open('GET', xapiURL+`users/info/${uid}`, false);  // `false` makes the request synchronous

    // hardcoded public token... the way xapi works requires a token so... yeah.
    req.setRequestHeader("Token", "mnB47r2Iwd8budv0Th6o51WkjTnssyBRlwZ9ly3K658zFXJi");
    req.send(null);

    if (req.status === 200) {
        req_json = JSON.parse(req.responseText);
        user = {
            id: req_json['id'],
            username: req_json['username']
        }
        console.log(`[xclient.js] getUserInfo() :: caching user ${uid}...`);
        luc[uid] = user;
        // update the local user cache
        localStorage.setItem("local_user_cache", JSON.stringify(luc));
        localStorage.setItem("local_user_cache_last_update", Math.floor(Date.now() / 1000));
    } else {
        user = {
            id: 'error',
            username: 'error'
        }
    }
    return user;
}

function xAPIIDToUsername(uid) {
    return getUserInfo(uid).username;
}