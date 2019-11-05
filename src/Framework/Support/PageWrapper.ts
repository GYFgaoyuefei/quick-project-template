import { IMessage, PageConfig, IConfig } from "../Transport/Entity";
import DataCenter from "../Transport/DataCenter";
const app = require('@system.app')

/**
 * 链接传输层实现接口请求
 * 并根据callback返回值自动设置page属性值
 */
class ProxyHandler {
    private page:any = undefined;
    private center:DataCenter = undefined;
    private protocols:any = undefined;
    private sendMsg:IMessage = undefined;
    constructor(page:any, dataCenter:DataCenter, protocol:any, sendMsg:IMessage) {
        this.page = page
        this.protocols = protocol
        this.sendMsg = sendMsg
        this.center = dataCenter
    }
    callback(backFunc) {
        this.send(backFunc)
    }
    private send(callback?:Function) {
        this.center.request(this.sendMsg, this.protocols, (response) => {
            if (callback) {
                try {
                    const result = callback(response)
                    if (result) {
                        for (let key in result) {
                            this.page[key] = result[key]
                        }
                    }
                } catch (error) {
                    console.error(error)
                }
            }
        })
    }
}

/**
 * 1 绑定page与模型对象
 * 2 监控page生命流程，包括请求数据，事件监听，并向后抬提供分析数据
 * 3 更改数据更新方式，请求后台数据灵活更新前台数据
 * 4 url请求参数自动绑定
 */
export class PageWrapper {
    private page:any = undefined;
    private model:any = undefined;
    private protocols:any = undefined;
    private center:DataCenter = undefined;
    private pageConfig: PageConfig = undefined;
    constructor(model, protocols) {
        this.model = model;
        this.protocols = protocols;
    }
    private initCenter(page):DataCenter {
        return new DataCenter(page, this.pageConfig)
    }
    pageInit(page, config) {
        const manConfig = page.$app.$data.center
        if (!manConfig) {
            throw Error('manifest中需要配置center值')
        }
        const info = app.getInfo()
        this.pageConfig = {
            debug:manConfig.debug,
            mock:manConfig.mock,
            center:manConfig.uri,
            appId: info.packageName,
            appName:info.name,
            appVersion:info.versionName,
            pageName: page.$page.path,
            pageType: config.type,
            uiConfig: config.uiConfig, //ui参数配置
            apiConfig: config.apiConfig
        }
        this.center = this.initCenter(page)
        this.center.syncConfig(this.protocols)
    }
    toPage(configs:IConfig) {
        const pageConfig = {
            private:this.model.private,
            public: this.model.public,
            protected: this.model.protected,
            onReady: () => {
                this.cycleRouter(()=>{this}, this.model, 'onReady', undefined)
            },
            onInit: () => {
                this.pageInit(()=>{this}, configs)
                this.cycleRouter(()=>{this}, this.model, 'onInit', undefined)
            },
            onHide: () => {
                this.cycleRouter(()=>{this}, this.model, 'onHide', undefined)
            },
            onShow: () => {
                this.cycleRouter(()=>{this}, this.model, 'onShow', undefined)
            },
            onEventListener: (data, evt) => {
                this.cycleRouter(()=>{this}, this.model, 'onEventListener', {data, evt})
            },
            onLoading: ({operation, status}) => {
                this.cycleRouter(()=>{this}, this.model, 'onLoading', {operation, status})
            },
            onDestroy: () => {
                this.cycleRouter(()=>{this}, this.model, 'onDestroy', undefined)
            },
            onBackPress: () => {
                this.cycleRouter(()=>{this}, this.model, 'onBackPress', undefined)
            },
            onMenuPress: () => {
                this.cycleRouter(()=>{this}, this.model, 'onMenuPress', undefined)
            },
            onRefresh: (args) => {
                this.cycleRouter(()=>{this}, this.model, 'onRefresh', args)
            }
        }
        return pageConfig
    }
    /**
     * 为page实例添加数据请求实例
     * @param page 
     * @param protocols 
     */
    private addProtocol2Page(page, protocols) {
        for (let key in protocols) {
            page[key] = this.proxy(protocols[key], this.center, key)
        }
    }
    private cycleRouter(page, model, cycleName, cycleParams) {
        this.reload(page);
        const handler = model[cycleName] ? model[cycleName] : undefined;
        if (handler) {
            handler(cycleParams);
        }
    }
    private reload(page) {
        if (page && (!this.page || this.page.__id__ !== page.__id__)) {
            this.page = page
            this.model.reload(page)
            if (this.protocols) {
                this.addProtocol2Page(page, this.protocols)
            }
        }
    }
    private proxy(protocol, dataCenter, operation) {
        return (sendMsg:any) => {
            const sendMessage:IMessage = {
                type: 'fetch',
                operation,
                request:sendMsg,
                context: {
                    appid: this.pageConfig.appId,
                    version: this.pageConfig.appVersion,
                    pageName: this.pageConfig.pageName,
                    pageType: this.pageConfig.pageType,
                    mockStrategy: this.pageConfig.mock
                }
            }
            return new ProxyHandler(this.page, dataCenter, protocol, sendMessage)
        }
    }
}