"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
require("whatwg-fetch");
require("navigator.sendbeacon");
var Qs = require('qs');

var Client = function () {
    function Client() {
        _classCallCheck(this, Client);

        this.credentials = '';
        this.headerInterceptor = function (header) {
            return header;
        };
        this.defaultHeader = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }

    _createClass(Client, [{
        key: "setBaseUrl",
        value: function setBaseUrl(baseUrl) {
            if (typeof baseUrl === 'string') {
                this.baseUrl = baseUrl;
            } else {
                this.baseUrl = baseUrl[process.env.NODE_ENV];
            }
        }
    }, {
        key: "setDefaultHeader",
        value: function setDefaultHeader(header) {
            this.defaultHeader = header;
        }
    }, {
        key: "setHeaderInterceptor",
        value: function setHeaderInterceptor(interceptor) {
            this.headerInterceptor = interceptor;
        }
    }, {
        key: "get",
        value: function get(url, query, body) {
            if (query) {
                return this.fetch("" + this.baseUrl + url + "?" + Qs.stringify(query, { arrayFormat: 'repeat' }), {
                    method: 'get',
                    body: JSON.stringify(body)
                });
            }
            return this.fetch("" + this.baseUrl + url, {
                method: 'get',
                body: JSON.stringify(body)
            });
        }
    }, {
        key: "post",
        value: function post(url, body, encoder) {
            return this.fetch("" + this.baseUrl + url, {
                method: 'post',
                body: encoder ? encoder(body) : JSON.stringify(body)
            });
        }
    }, {
        key: "postByForm",
        value: function postByForm(url, body) {
            return this.fetch("" + this.baseUrl + url, {
                method: 'post',
                body: body,
                headers: this.headerInterceptor({
                    'Accept': 'application/json'
                })
            });
        }
    }, {
        key: "postByUrlEncoding",
        value: function postByUrlEncoding(url, body) {
            return this.fetch("" + this.baseUrl + url, {
                method: 'post',
                body: Qs.stringify(body, { arrayFormat: 'repeat' }),
                headers: this.getHeaderUrlEncodedContentType()
            });
        }
    }, {
        key: "put",
        value: function put(url, body) {
            return this.fetch("" + this.baseUrl + url, {
                method: 'put',
                body: JSON.stringify(body)
            });
        }
    }, {
        key: "putByForm",
        value: function putByForm(url, body) {
            return this.fetch("" + this.baseUrl + url, {
                method: 'put',
                body: body,
                headers: this.headerInterceptor({
                    'Accept': 'application/json'
                })
            });
        }
    }, {
        key: "putByUrlEncoding",
        value: function putByUrlEncoding(url, body) {
            return this.fetch("" + this.baseUrl + url, {
                method: 'put',
                body: Qs.stringify(body, { arrayFormat: 'repeat' }),
                headers: this.getHeaderUrlEncodedContentType()
            });
        }
    }, {
        key: "delete",
        value: function _delete(url) {
            return this.fetch("" + this.baseUrl + url, {
                method: 'delete'
            });
        }
    }, {
        key: "sendBeacon",
        value: function sendBeacon(url, body) {
            var blob = new Blob([JSON.stringify(body)], this.getHeader());
            return navigator.sendBeacon("" + this.baseUrl + url, blob);
        }
    }, {
        key: "fetch",
        value: function (_fetch) {
            function fetch(_x, _x2) {
                return _fetch.apply(this, arguments);
            }

            fetch.toString = function () {
                return _fetch.toString();
            };

            return fetch;
        }(function (url, options) {
            return fetch(url, _extends({
                headers: this.getHeader(),
                credentials: this.credentials || undefined
            }, options)).then(Client.checkStatus).catch(Client.checkDisconnected);
        })
    }, {
        key: "getHeader",
        value: function getHeader() {
            return this.headerInterceptor(this.defaultHeader);
        }
    }, {
        key: "getHeaderUrlEncodedContentType",
        value: function getHeaderUrlEncodedContentType() {
            return this.headerInterceptor({
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            });
        }
    }], [{
        key: "checkStatus",
        value: function checkStatus(response) {
            function parseJSON(response) {
                return response ? JSON.parse(response) : response;
            }
            if (response.status >= 200 && response.status < 300) {
                return response.text().then(parseJSON);
            }
            return response.text().then(parseJSON).then(function (json) {
                var error = {
                    status: response.status,
                    statusText: response.statusText,
                    body: json
                };
                throw error;
            });
        }
    }, {
        key: "checkDisconnected",
        value: function checkDisconnected(response) {
            if (!response.status && !response.statusText) {
                throw {
                    status: 0,
                    statusText: response
                };
            } else {
                throw response;
            }
        }
    }]);

    return Client;
}();

exports.default = Client;