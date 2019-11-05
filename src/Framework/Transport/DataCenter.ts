import { IMessage, IResponse, SyncProtocols, PageConfig } from "./Entity";
const fetch = require('@system.fetch')
const systemRequest = require('@system.request')
const upload = systemRequest.upload;
interface ReturnMsg {
    status: 200|number,
    headers: any,
    data:any
}
export default class DataCenter {
    private config:PageConfig = undefined;
    private page:any = undefined;
    constructor(currentPage: any, config:PageConfig) {
        this.config = config;
        this.page = currentPage
    }
    syncConfig(protocols:any) {
        const pros = []
        let json = null
        for (let key in protocols) {
            json = protocols[key].toJSON()
            pros.push({
                operation: key,
                request: json.request ? JSON.stringify(json.request) : null,
                response: json.response ? JSON.stringify(json.response) : null,
                note: json.note,
                changeLog: json.changeLog
            })
        }
        const sync:SyncProtocols = {
            appid: this.config.appId,
            appName: this.config.appName,
            version: this.config.appVersion,
            pageName: this.config.pageName,
            pageType: this.config.pageType,
            protocols: pros
        }
        this.pushProtocols(sync)
    }
    /**
     * 
     * @param protocols 协议同步请求
     */
    async pushProtocols(protocols:SyncProtocols) {
        const option = {
            url: this.getRealUriByType('sync'),
            responseType: 'json',
            method: 'POST',
            data: protocols,
            header: {'Content-Type': 'application/json;charset=UTF-8'},
            success: (response:IResponse) => {
                console.debug('协议同步成功')
            },
            fail: (data, code) => {
                console.debug('协议同步失败[' + data + ']')
            }
        }
        fetch.fetch(option)
    }
    /**
     * 
     * @param args 
     * @param protocol 
     * @param callback 
     */
    request(args: IMessage, protocol:any, callback:Function) {
        try {
            this.startLoading(args.operation)
            switch (args.type) {
                case 'fetch':
                    return this.fetch(args, protocol, callback)
                case 'upload':
                    return this.upload(args, protocol, callback)
                case 'websocket':
                    break;
            }
        } catch (error) {
            console.error(error)
            this.endLoading(args.operation)
        }
        
    }
    /**
     * 
     * @param args 获取远端数据
     * @param callback 
     */
    private fetch(args: IMessage, protocol:any, callback?:Function) {
        const option = {
            url: this.getRealUri(args),
            responseType: 'json',
            method: 'POST',
            data: args,
            header: {'Content-Type': 'application/json;charset=UTF-8'},
            success: (response:IResponse) => {
                if (callback) {
                    this.dealResult(args, callback, response)
                }
            },
            fail: (data, code) => {
                if (callback) {
                    this.dealResult(args, callback, {code, data});
                }
            }
        }
        
        fetch.fetch(option)
    }
    startLoading(operation:string) {
        if (this.page && this.page.onLoading) {
            this.page.onLoading({operation, status: true})
        }
    }
    endLoading(operation:string) {
        if (this.page && this.page.onLoading) {
            this.page.onLoading({operation, status: false})
        }
    }
    private getRealUri(args: IMessage):string {
        if (args.uri) {
            return args.uri
        }
        return this.getRealUriByType(args.type)
    }
    private getRealUriByType(type:string):string {
        const prefix = this.config.center.endsWith('/') ? '' : '/'
        return this.config.center + prefix + type
    }
    private upload(args: IMessage, protocol:any, callback:Function) {
        const requestData = args.request;
        let files = [];
        const dataList = [];
        const fileKeys:string[] = this.getFileKeys(protocol)
        console.info(args.operation, ' fiel keys ', fileKeys)
        for (let key in requestData) {
            if (fileKeys.includes(key)) {
                for (let i = 0; i < requestData[key].length; i++) {
                    files.push({...requestData[key][i], name: key})
                }
                requestData[key] = "_File"
            }
        }
        dataList.push({name: 'message', value: JSON.stringify({operation: args.operation, request: args.request})});
        const option = {
            url: this.getRealUriByType('upload'),
            files,
            data: dataList,
            success: function(response) {
                this.dealResult(args, callback, response);
            },
            fail: function(data, code) {
                this.dealResult(args, callback, {code, data});
            }
        }
        upload(option);
    } //文件上传
    private getFileKeys = (protocol:any) => {
        if (protocol) {
            const request = protocol.request
            const keys:string[] = []
            let key:string;
            for (key in request) {
                if (request[key]._type === 'file') {
                    keys.push(key)
                }
            }
            return keys
        }
        return []
    }

    private dealResult = (event: IMessage, callback, response) => {
        const {code, data, headers} = response;
        const backInfo: ReturnMsg = {status:code, data:data, headers:headers};
        if (code - 400 > 0) {
            backInfo.data = '网络请求异常';
        } else {
            backInfo.data = data.response;
        }
        callback(backInfo)
        this.endLoading(event.operation)
    }
}