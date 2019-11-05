"use strict";
exports.__esModule = true;
var ApiDefined_1 = require("../../../Framework/Protocol/ApiDefined");
var TypeDefined_1 = require("../../../Framework/Protocol/TypeDefined");
/** 获取渠道消息协议 */
var getInfocenter = function () {
    var Request = {
        pubTempId: TypeDefined_1.TString('模板ID 比如某切片有10套模板  0~9 代表不同的10套模板', '<NU, 5>', true),
        page: TypeDefined_1.TInt('当前页码', '0', true),
        pageSize: TypeDefined_1.TInt('每页条数', '10', true)
    };
    var Response = {
        seqid: TypeDefined_1.TString('流水号'),
        ret: TypeDefined_1.TString('错误码 0代表成功，非0为失败', '<[0|1]>'),
        desc: TypeDefined_1.TString('错误描述', '<[success|error]>'),
        //  channelCompanyId:_String('','公司标识'),
        logoIcon: TypeDefined_1.TString('企业logo地址'),
        comName: TypeDefined_1.TString('企业名称'),
        infoCenterLists: TypeDefined_1.TList(TypeDefined_1.TObject({
            flag: TypeDefined_1.TString('展示标识 0左右布局 1上下布局'),
            backIcon: TypeDefined_1.TString('背景图url'),
            content: TypeDefined_1.TString('内容标题'),
            contentId: TypeDefined_1.TString('内容id  获取内容详情的id 当channelContentflag为0时使用'),
            channelContentflag: TypeDefined_1.TString('内容跳转标识 0代表快应用录入的内容  1代表跳转到外链（H5或其它快应用）'),
            channelContentUrl: TypeDefined_1.TString('外链地址 当channelContentflag为1时使用')
        }, '内容概览信息', false), '内容列表页信息', false),
        currentPage: TypeDefined_1.TInt('当前页码', '0', true),
        pageSize: TypeDefined_1.TInt('每页条数', '10', true),
        total: TypeDefined_1.TInt('总条数', '10', true)
    };
    return ApiDefined_1.api({ request: Request, response: Response, note: '获取内容列表信息协议', changeLog: '为请求添加page， pageSize, total参数' });
};
/** save渠道消息协议 */
var setChannelInfo = function () {
    var Request = {
        channelid: TypeDefined_1.TString('渠道标识 0 代表 快应用默认启动 1代表 服务号启动', '<[0|1]>'),
        // channelCompanyId:_String('','公司标识'),
        pubTempId: TypeDefined_1.TString('模板ID 比如某切片有10套模板  0~9 代表不同的10套模板', '<NU, 2>'),
        // contentType:_String('','获取内容标识 比如0代表 企业简介  1代表营销资讯之类的 '),
        channelurl: TypeDefined_1.TString('快应用某页跳转链接  渠道标识为非0时使用'),
        deviceid: TypeDefined_1.TString('设备唯一标识')
    };
    var Response = {
        ret: TypeDefined_1.TString('错误码 0代表成功，非0为失败', '<[0|1]>'),
        desc: TypeDefined_1.TString('错误描述', '<[success|error]>')
    };
    return ApiDefined_1.api({ request: Request, response: Response, note: 'save渠道消息协议', changeLog: '梦网百家1.0.0版本' });
};
var getListInfo = getInfocenter();
exports.getListInfo = getListInfo;
var saveAccess = setChannelInfo();
exports.saveAccess = saveAccess;
