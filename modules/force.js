"use strict";

let request = require("request"),
    API_VERSION = 'v35.0';

let getUserId = (oauth) => (typeof(oauth) !== 'undefined') ? oauth.id.split('/').pop() : undefined;

/*
 * Core function to make REST calls to Salesforce
 */
let sfrequest = (oauth, path, options) => new Promise((resolve, reject) => {

    if (!oauth || (!oauth.access_token && !oauth.refresh_token)) {
        reject({code: 401});
        return;
    }

    options = options || {};

    options.method = options.method || 'GET';

    // dev friendly API: Add leading '/' if missing so url + path concat always works
    if (path.charAt(0) !== '/') {
        path = '/' + options.path;
    }

    options.url = oauth.instance_url + path;

    options.headers = options.headers || {};

    options.headers["Accept"]= "application/json";
    options.headers["Authorization"] = "Bearer " + oauth.access_token;

    request(options, function (error, response, body) {
        if (error) {
            console.log(error);
            if (response.statusCode === 401) {
                // Could implement refresh token and retry logic here
                reject({code: 401});
            } else {
                reject(error);
            }
        } else {
            resolve(body);
        }
    });

});

/**
 * Convenience function to execute a SOQL query
 */
let query = (oauth, soql) => sfrequest(oauth, '/services/data/' + API_VERSION + '/query',
    {
        qs: {q: soql},
    }
);

/**
 * Convenience function to retrieve a single record based on its Id
 */
let retrieve = (oauth, objectName, id, fields) => sfrequest(oauth, '/services/data/' + API_VERSION + '/sobjects/' + objectName + '/' + id,
    {
        qs: fields ? {fields: fields} : undefined
    }
);

/**
 * Convenience function to retrieve picklist values from a SalesForce Field
 */
let getPickListValues = (oauth, objectName) => sfrequest(oauth, '/services/data/' + API_VERSION + '/sobjects/' + objectName + '/describe');

/**
 * Convenience function to create a new record
 * @param objectName
 * @param data
 */
let create = (oauth, objectName, data) => sfrequest(oauth, '/services/data/' + API_VERSION + '/sobjects/' + objectName + '/',
    {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        json: true,
        body: data
    }
);

/**
 * Convenience function to update a record. You can either pass the sobject returned by retrieve or query or a simple JavaScript object.
 */
let update = (oauth, objectName, data) => {

    let id = data.Id || data.id,
        fields = JSON.parse(JSON.stringify(data));

    delete fields.attributes;
    delete fields.Id;
    delete fields.id;

    return sfrequest(oauth, '/services/data/' + API_VERSION + '/sobjects/' + objectName + '/' + id,
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            qs: {'_HttpMethod': 'PATCH'},
            json: true,
            body: fields
        }
    );
};

/**
 * Convenience function to delete a record
 */
let del = (oauth, objectName, id) => sfrequest(oauth, '/services/data/' + API_VERSION + '/sobjects/' + objectName + '/' + id,
    {
        method: 'DELETE',
    }
);

/**
 * Convenience function to upsert a record
 */
let upsert = (objectName, externalIdField, externalId, data) => sfrequest(oauth, '/services/data/' + API_VERSION + '/sobjects/' + objectName + '/' + externalIdField + '/' + externalId,
    {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        json: true,
        body: data
    }
);

/**
 * Convenience function to invoke APEX REST endpoints
 */
let apexrest = (oauth, path, params) => {

    if (path.charAt(0) !== "/") {
        path = "/" + path;
    }

    if (path.substr(0, 18) !== "/services/apexrest") {
        path = "/services/apexrest" + path;
    }

    return sfrequest(oauth, path, params);
};

/**
 * Convenience function to invoke the Chatter API
 */
let chatter = (oauth, path, params) => {

    let basePath = "/services/data/" + API_VERSION + "/chatter";

    if (path.charAt(0) !== "/") {
        path = "/" + path;
    }

    path = basePath + path;

    return sfrequest(oauth, path, params);

};

/**
 * Convenience function to retrieve user information
 */
let whoami = oauth => sfrequest(oauth, "/services/oauth2/userinfo");

exports.request = sfrequest;
exports.query = query;
exports.retrieve = retrieve;
exports.getPickListValues = getPickListValues;
exports.create = create;
exports.update = update;
exports.del = del;
exports.upsert = upsert;
exports.apexrest = apexrest;
exports.chatter = chatter;
exports.whoami = whoami;