// import {request, SendType, upload, download, onDownloadComplete} from './system'
// import { IMessage, IEventContext, IResponse } from './Entity'
// const events = {}
// events['FETCH'] = (event: IMessage, context: IEventContext, callback) => {
    
//     const fileKeys:string[] = getFileKeys(event)
//     console.info('access fetch request', fileKeys)
//     if (fileKeys && fileKeys.length > 0) {
//         events['upload'](event, context, callback)
//         return
//     }
//     if (!runPlugin(event, context, callback)) {
//         return;
//     }
//     const option = context.requestOption
//     console.info('option', option);
//     option.data = event;
//     option.success = function (response) {
//         dealResult(event, context, callback, response);
//     },
//     option.fail = function (data, code) {
//         dealResult(event, context, callback, {code, message: data});
//     }
//     request(option)
// }
// const getFileKeys = (event: IMessage) => {
//     const protocol = event.protocol;
//     if (protocol) {
//         const request = protocol.request
//         const keys:string[] = []
//         let key:string;
//         for (key in request) {
//             if (request[key]._type === 'file') {
//                 keys.push(key)
//             }
//         }
//         return keys
//     }
//     return []
// }
// events['upload'] = (event: IMessage, context: IEventContext, callback) => {
//     console.info('access upload request', context)
//     if (!runPlugin(event, context, callback)) {
//         return;
//     }
//     const requestData = event.request;
//     let files = [];
//     const dataList = [];
//     const fileKeys:string[] = getFileKeys(event)
//     console.info(event.operation, ' fiel keys ', fileKeys)
//     for (let key in requestData) {
//         let item = {}
//         if (fileKeys.includes(key)) {
//             for (let i = 0; i < requestData[key].length; i++) {
//                 files.push({...requestData[key][i], name: key})
//             }
//             requestData[key] = "_File"
//         }
        
//     }
//     dataList.push({name: 'message', value: JSON.stringify({context: event.context, operation: event.operation, request: event.request})});
//     const defaultOption = context.requestOption
//     const option = {
//         url: `${defaultOption.url}/upload`,
//         files,
//         data: dataList,
//         success: function(response) {
//             dealResult(event, context, callback, response);
//         },
//         fail: function(data, code) {
//             dealResult(event, context, callback, {code, message: data});
//         }
//     }
//     upload(option);
// }

// events['download'] = (event: IMessage, context: IEventContext, callback) => {
//     if (!runPlugin(event, context, callback)) {
//         return;
//     }
//     const option = {
//         url: event.request,
//         success: function(data) {
//             const { token } = data;
//             listenerDownload(event, context, callback, token);
//         },
//         fail: function (data, code) {
//             dealResult(event, context, callback, {code, message: data});
//         }
//     }
//     download(option);
// }

// const listenerDownload = (event: IMessage, context: IEventContext, callback, token) => {
//     onDownloadComplete({
//         token,
//         success: function(data) {
//             const backInfo: IMessage = event;
//             backInfo.status = {status: 200, message: 'success'}
//             backInfo.response = data;
//             callback(backInfo);
//         },
//         fail: function(data, code) {
//             dealResult(event, context, callback, {code, message: data});
//         }
//     })
// }
// /**
//  * 运行前置插件
//  */
// const runPlugin = (event: IMessage, context: IEventContext, callback) => {
//     const requestData = event.request;
//     const backInfo: IMessage = event;
//     if (!requestData) {
//         backInfo.status = {status: 500, message: '请求参数异常'};
//         callback(backInfo);
//         return false;
//     }
//     const { plugins } = context
//     if (plugins) {
//         for (let plugin of plugins) {
//             plugin.func(event, context)
//             if (event.response) {
//                 if (!event.status) {
//                     event.status = {
//                         status: 500,
//                         message: event.response
//                     }
//                 }
//                 callback(event)
//                 return false;
//             }
//         }
//     }
//     return true;
// }

// /**
//  * 处理返回信息
//  */
// const dealResult = (event: IMessage, context: IEventContext, callback, response) => {
//     const {code, data, message} = response;
//     const backInfo: IMessage = event;
//     backInfo.type = SendType.FETCH_DOWN_STREAM
//     if (code - 400 > 0) {
//         backInfo.status = {status: code, message: message ? message : '网络请求异常'}
//     }
//     if (!data) {
//         backInfo.status = {status: 500, message: '返回结果异常'}
//     }
//     const result: IMessage = JSON.parse(data);
//     console.info('response', data, result);
//     backInfo.status = result.status;
//     backInfo.response = result.response;
//     callback(backInfo)
// }
// export default events