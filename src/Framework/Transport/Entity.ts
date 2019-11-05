import { TIntDefined, TFloatDefined, TStringDefined, TObjectDefined, TListDefined, TSimpleMap } from "../Protocol/TypeDefined";
export interface IContext {
    appid:string,
    version:string|number,
    pageName:string,
    pageType:string,
    mockStrategy:string
}
export interface IMessage {
    type:'fetch' | 'upload' | 'download' | 'websocket' | 'loadConfig',
    operation:string,
    request:any,
    response?:any,
    uri?:string
    context:IContext
}
export interface IResponse {
    headers?: object,
    code: number,
    data?: IMessage,
}
interface Map<T> {
    [key:string]:T
}

export interface PageConfig {
    debug?:boolean,
    mock?:'always' | 'whenNoComplete' | 'none',
    center?:string,
    appId: string,
    appName:string,
    appVersion:string,
    pageName?:string,
    pageType:string,
    uiConfig?:Map<string>, //ui参数配置
    apiConfig?:Map<string>
}
export interface IConfig {
    type:string,
    apiConfig?:Map<string>,
    uiConfig?:Map<string>
}
type normal = TIntDefined | TFloatDefined | TStringDefined | TObjectDefined | TListDefined | TSimpleMap | null
export interface SimpleProtocol {
    operation:string,
    request: normal,
    response: normal,
    note:string,
    changeLog:string
}
export interface SyncProtocols {
    appid:string,
    appName:string,
    version:string,
    pageName:string,
    pageType:string,
    protocols:SimpleProtocol[]
}