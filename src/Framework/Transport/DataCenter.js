"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fetch = require('@system.fetch');
var systemRequest = require('@system.request');
var upload = systemRequest.upload;
var DataCenter = /** @class */ (function () {
    function DataCenter(currentPage, config) {
        var _this = this;
        this.config = undefined;
        this.page = undefined;
        this.getFileKeys = function (protocol) {
            if (protocol) {
                var request = protocol.request;
                var keys = [];
                var key = void 0;
                for (key in request) {
                    if (request[key]._type === 'file') {
                        keys.push(key);
                    }
                }
                return keys;
            }
            return [];
        };
        this.dealResult = function (event, callback, response) {
            var code = response.code, data = response.data, headers = response.headers;
            var backInfo = { status: code, data: data, headers: headers };
            if (code - 400 > 0) {
                backInfo.data = '网络请求异常';
            }
            else {
                backInfo.data = data.response;
            }
            callback(backInfo);
            _this.endLoading(event.operation);
        };
        this.config = config;
        this.page = currentPage;
    }
    DataCenter.prototype.syncConfig = function (protocols) {
        var pros = [];
        var json = null;
        for (var key in protocols) {
            json = protocols[key].toJSON();
            pros.push({
                operation: key,
                request: json.request ? JSON.stringify(json.request) : null,
                response: json.response ? JSON.stringify(json.response) : null,
                note: json.note,
                changeLog: json.changeLog
            });
        }
        var sync = {
            appid: this.config.appId,
            appName: this.config.appName,
            version: this.config.appVersion,
            pageName: this.config.pageName,
            pageType: this.config.pageType,
            protocols: pros
        };
        this.pushProtocols(sync);
    };
    /**
     *
     * @param protocols 协议同步请求
     */
    DataCenter.prototype.pushProtocols = function (protocols) {
        return __awaiter(this, void 0, void 0, function () {
            var option;
            return __generator(this, function (_a) {
                option = {
                    url: this.getRealUriByType('sync'),
                    responseType: 'json',
                    method: 'POST',
                    data: protocols,
                    header: { 'Content-Type': 'application/json;charset=UTF-8' },
                    success: function (response) {
                        console.debug('协议同步成功');
                    },
                    fail: function (data, code) {
                        console.debug('协议同步失败[' + data + ']');
                    }
                };
                fetch.fetch(option);
                return [2 /*return*/];
            });
        });
    };
    /**
     *
     * @param args
     * @param protocol
     * @param callback
     */
    DataCenter.prototype.request = function (args, protocol, callback) {
        try {
            this.startLoading(args.operation);
            switch (args.type) {
                case 'fetch':
                    return this.fetch(args, protocol, callback);
                case 'upload':
                    return this.upload(args, protocol, callback);
                case 'websocket':
                    break;
            }
        }
        catch (error) {
            console.error(error);
            this.endLoading(args.operation);
        }
    };
    /**
     *
     * @param args 获取远端数据
     * @param callback
     */
    DataCenter.prototype.fetch = function (args, protocol, callback) {
        var _this = this;
        var option = {
            url: this.getRealUri(args),
            responseType: 'json',
            method: 'POST',
            data: args,
            header: { 'Content-Type': 'application/json;charset=UTF-8' },
            success: function (response) {
                if (callback) {
                    _this.dealResult(args, callback, response);
                }
            },
            fail: function (data, code) {
                if (callback) {
                    _this.dealResult(args, callback, { code: code, data: data });
                }
            }
        };
        fetch.fetch(option);
    };
    DataCenter.prototype.startLoading = function (operation) {
        if (this.page && this.page.onLoading) {
            this.page.onLoading({ operation: operation, status: true });
        }
    };
    DataCenter.prototype.endLoading = function (operation) {
        if (this.page && this.page.onLoading) {
            this.page.onLoading({ operation: operation, status: false });
        }
    };
    DataCenter.prototype.getRealUri = function (args) {
        if (args.uri) {
            return args.uri;
        }
        return this.getRealUriByType(args.type);
    };
    DataCenter.prototype.getRealUriByType = function (type) {
        var prefix = this.config.center.endsWith('/') ? '' : '/';
        return this.config.center + prefix + type;
    };
    DataCenter.prototype.upload = function (args, protocol, callback) {
        var requestData = args.request;
        var files = [];
        var dataList = [];
        var fileKeys = this.getFileKeys(protocol);
        console.info(args.operation, ' fiel keys ', fileKeys);
        for (var key in requestData) {
            if (fileKeys.includes(key)) {
                for (var i = 0; i < requestData[key].length; i++) {
                    files.push(__assign(__assign({}, requestData[key][i]), { name: key }));
                }
                requestData[key] = "_File";
            }
        }
        dataList.push({ name: 'message', value: JSON.stringify({ operation: args.operation, request: args.request }) });
        var option = {
            url: this.getRealUriByType('upload'),
            files: files,
            data: dataList,
            success: function (response) {
                this.dealResult(args, callback, response);
            },
            fail: function (data, code) {
                this.dealResult(args, callback, { code: code, data: data });
            }
        };
        upload(option);
    }; //文件上传
    return DataCenter;
}());
exports["default"] = DataCenter;
