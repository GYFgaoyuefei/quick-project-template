import { api } from "../../../Framework/Protocol/ApiDefined";
import { TString, TInt, TList, TObject } from "../../../Framework/Protocol/TypeDefined";


/** 获取渠道消息协议 */
const getInfocenter = () =>{
    const Request = {
        pubTempId:TString('模板ID 比如某切片有10套模板  0~9 代表不同的10套模板', '<NU, 5>', true),
        page:TInt('当前页码', '0', true),
        pageSize:TInt('每页条数', '10', true)
    }
    const Response = {
        seqid: TString('流水号'),
        ret: TString('错误码 0代表成功，非0为失败', '<[0|1]>'),
        desc:TString('错误描述', '<[success|error]>'),
      //  channelCompanyId:_String('','公司标识'),
        logoIcon: TString('企业logo地址'),
        comName: TString('企业名称'),
        infoCenterLists: TList(TObject({
                                    flag:TString('展示标识 0左右布局 1上下布局'),
                                    backIcon: TString('背景图url'),
                                    content: TString('内容标题'),
                                    contentId:TString('内容id  获取内容详情的id 当channelContentflag为0时使用'),
                                    channelContentflag:TString('内容跳转标识 0代表快应用录入的内容  1代表跳转到外链（H5或其它快应用）'),
                                    channelContentUrl:TString('外链地址 当channelContentflag为1时使用')
                                }, '内容概览信息', false)
            ,'内容列表页信息', false),
        currentPage:TInt('当前页码', '0', true),
        pageSize:TInt('每页条数', '10', true),
        total:TInt('总条数', '10', true)
    }
    return api({request: Request, response: Response, note: '获取内容列表信息协议', changeLog:'为请求添加page， pageSize, total参数'})
}
/** save渠道消息协议 */
const setChannelInfo = () =>{
    const Request = {
        channelid: TString('渠道标识 0 代表 快应用默认启动 1代表 服务号启动', '<[0|1]>'),
       // channelCompanyId:_String('','公司标识'),
        pubTempId:TString('模板ID 比如某切片有10套模板  0~9 代表不同的10套模板', '<NU, 2>'),
       // contentType:_String('','获取内容标识 比如0代表 企业简介  1代表营销资讯之类的 '),
        channelurl: TString('快应用某页跳转链接  渠道标识为非0时使用'),
        deviceid:TString('设备唯一标识')
    }
    const Response = {
        ret: TString('错误码 0代表成功，非0为失败', '<[0|1]>'),
        desc:TString('错误描述', '<[success|error]>'),
    }
    return api({request: Request, response: Response, note: 'save渠道消息协议', changeLog:'梦网百家1.0.0版本'})
}

const getListInfo = getInfocenter()
const saveAccess = setChannelInfo()
export  {getListInfo, saveAccess}