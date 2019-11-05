"use strict";
exports.__esModule = true;
var DataCenter_1 = require("../Transport/DataCenter");
var app = require('@system.app');
/**
 * 链接传输层实现接口请求
 * 并根据callback返回值自动设置page属性值
 */
var ProxyHandler = /** @class */ (function () {
    function ProxyHandler(page, dataCenter, protocol, sendMsg) {
        this.page = undefined;
        this.center = undefined;
        this.protocols = undefined;
        this.sendMsg = undefined;
        this.page = page;
        this.protocols = protocol;
        this.sendMsg = sendMsg;
        this.center = dataCenter;
    }
    ProxyHandler.prototype.callback = function (backFunc) {
        this.send(backFunc);
    };
    ProxyHandler.prototype.send = function (callback) {
        var _this = this;
        this.center.request(this.sendMsg, this.protocols, function (response) {
            if (callback) {
                try {
                    var result = callback(response);
                    if (result) {
                        for (var key in result) {
                            _this.page[key] = result[key];
                        }
                    }
                }
                catch (error) {
                    console.error(error);
                }
            }
        });
    };
    return ProxyHandler;
}());
/**
 * 1 绑定page与模型对象
 * 2 监控page生命流程，包括请求数据，事件监听，并向后抬提供分析数据
 * 3 更改数据更新方式，请求后台数据灵活更新前台数据
 * 4 url请求参数自动绑定
 */
var PageWrapper = /** @class */ (function () {
    function PageWrapper(model, protocols) {
        this.page = undefined;
        this.model = undefined;
        this.protocols = undefined;
        this.center = undefined;
        this.pageConfig = undefined;
        this.model = model;
        this.protocols = protocols;
    }
    PageWrapper.prototype.initCenter = function (page) {
        return new DataCenter_1["default"](page, this.pageConfig);
    };
    PageWrapper.prototype.pageInit = function (page, config) {
        var manConfig = page.$app.$data.center;
        if (!manConfig) {
            throw Error('manifest中需要配置center值');
        }
        var info = app.getInfo();
        this.pageConfig = {
            debug: manConfig.debug,
            mock: manConfig.mock,
            center: manConfig.uri,
            appId: info.packageName,
            appName: info.name,
            appVersion: info.versionName,
            pageName: page.$page.path,
            pageType: config.type,
            uiConfig: config.uiConfig,
            apiConfig: config.apiConfig
        };
        this.center = this.initCenter(page);
        this.center.syncConfig(this.protocols);
    };
    PageWrapper.prototype.toPage = function (configs) {
        var _this = this;
        var pageConfig = {
            private: this.model.private,
            public: this.model.public,
            protected: this.model.protected,
            onReady: function () {
                _this.cycleRouter(this, _this.model, 'onReady', undefined);
            },
            onInit: function () {
                _this.pageInit(this, configs);
                _this.cycleRouter(this, _this.model, 'onInit', undefined);
            },
            onHide: function () {
                _this.cycleRouter(this, _this.model, 'onHide', undefined);
            },
            onShow: function () {
                _this.cycleRouter(this, _this.model, 'onShow', undefined);
            },
            onEventListener: function (data, evt) {
                _this.cycleRouter(this, _this.model, 'onEventListener', { data: data, evt: evt });
            },
            onLoading: function (_a) {
                var operation = _a.operation, status = _a.status;
                _this.cycleRouter(this, _this.model, 'onLoading', { operation: operation, status: status });
            },
            onDestroy: function () {
                _this.cycleRouter(this, _this.model, 'onDestroy', undefined);
            },
            onBackPress: function () {
                _this.cycleRouter(this, _this.model, 'onBackPress', undefined);
            },
            onMenuPress: function () {
                _this.cycleRouter(this, _this.model, 'onMenuPress', undefined);
            },
            onRefresh: function (args) {
                _this.cycleRouter(this, _this.model, 'onRefresh', args);
            }
        };
        return pageConfig;
    };
    /**
     * 为page实例添加数据请求实例
     * @param page
     * @param protocols
     */
    PageWrapper.prototype.addProtocol2Page = function (page, protocols) {
        for (var key in protocols) {
            page[key] = this.proxy(protocols[key], this.center, key);
        }
    };
    PageWrapper.prototype.cycleRouter = function (page, model, cycleName, cycleParams) {
        this.reload(page);
        var handler = model[cycleName] ? model[cycleName] : undefined;
        if (handler) {
            handler(cycleParams);
        }
    };
    PageWrapper.prototype.reload = function (page) {
        if (page && (!this.page || this.page.__id__ !== page.__id__)) {
            this.page = page;
            this.model.reload(page);
            if (this.protocols) {
                this.addProtocol2Page(page, this.protocols);
            }
        }
    };
    PageWrapper.prototype.proxy = function (protocol, dataCenter, operation) {
        var _this = this;
        return function (sendMsg) {
            var sendMessage = {
                type: 'fetch',
                operation: operation,
                request: sendMsg,
                context: {
                    appid: _this.pageConfig.appId,
                    version: _this.pageConfig.appVersion,
                    pageName: _this.pageConfig.pageName,
                    pageType: _this.pageConfig.pageType,
                    mockStrategy: _this.pageConfig.mock
                }
            };
            return new ProxyHandler(_this.page, dataCenter, protocol, sendMessage);
        };
    };
    return PageWrapper;
}());
exports.PageWrapper = PageWrapper;
