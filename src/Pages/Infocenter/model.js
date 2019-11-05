import prompt from '@system.prompt'
import router from '@system.router'
import device from '@system.device'
export const model = {
    page: undefined,
    public:{  
        channelid:'',
        pubTempId:''
    },
    private: {
        infoCenterLists:[],
        logoIcon:'',
        comName:'',
        isLoading: false,
        isRefreshing: false,
        hasMoreData: true,
        page: 0,
        pageSize: 10,
        pageSizeVal: 10,
    },
    reload(page) {
        model.page = page
    },
    onLoading({status}) {
        if (model.page.isLoading) {
            model.page.isLoading = status
        }
    },
    onReady() {
        model.page.isLoading = true
        model.page.getListInfo({pubTempId: model.page.pubTempId, page: model.page.page, pageSize: model.page.pageSize}).callback(({status, data}) => {        
            if(status === 200){
                if(data && data.ret === '0'){
                    if(data.infoCenterLists && data.infoCenterLists.length >= model.page.pageSize){
                        model.page.hasMoreData = true;
                    }else{
                        model.page.hasMoreData = false;
                    }
                    model.page.infoCenterLists = data.infoCenterLists
                    model.page.logoIcon = data.logoIcon
                    model.page.comName = data.comName
                    model.page.$page.setTitleBar({text: model.page.comName})
                }else{
                    prompt.showToast({ message: data})
                    model.page.$page.setTitleBar({text: '系统异常'})
                }
            }else{
                prompt.showToast({ message: data})
                model.page.$page.setTitleBar({text: '系统异常'})
            }
        })
        if(model.page.channelid && model.page.channelid != '0'){
            device.getDeviceId({
                success:function(data){
                    model.page.saveAccess({deviceid: data.deviceId,channelid:model.page.channelid,pubTempId: model.page.pubTempId,channelurl:'Pages/Infocenter'})
                        .callback()
                },
                fail:function(data,code){
                    prompt.showToast({ message: '获取设备标识失败.'})
                }
            })
        }
    },
    refresh (data,e) {
        // // 更新刷新状态（属性refreshing的值从false改为true会触发refresh组件的状态更新，反之亦然）
        model.page.isRefreshing = e.refreshing;
        model.page.pageSize = model.page.pageSizeVal;
        model.page.getListInfo({pubTempId: model.page.pubTempId,page: model.page.page, pageSize: model.page.pageSize}).callback(({status, data}) => {
            model.page.isRefreshing = false;
            if(status === 200){
                if(data && data.ret === '0'){
                    if(data.infoCenterLists && data.infoCenterLists.length >= model.page.pageSize){
                        model.page.hasMoreData = true;
                    }else{
                        model.page.hasMoreData = false;
                    }
                    model.page.infoCenterLists = data.infoCenterLists
                    model.page.logoIcon = data.logoIcon
                    model.page.comName = data.comName
                    model.page.$page.setTitleBar({text: model.page.comName})
                }else{
                    prompt.showToast({ message: data})
                    model.page.$page.setTitleBar({text: '系统异常'})
                }
            }else{
                prompt.showToast({ message: data})
                model.page.$page.setTitleBar({text: '系统异常'})
            }
        })
      },
      renderMoreListItem () {
        model.page.pageSize = model.page.pageSize + model.page.pageSizeVal;
        model.page.getListInfo({pubTempId: model.page.pubTempId,page: model.page.page, pageSize: model.page.pageSize}).callback(({status, data}) => {
            if(status === 200){
                if(data && data.ret === '0'){
                    if(data.infoCenterLists && data.infoCenterLists.length >= model.page.pageSize){
                        model.page.hasMoreData = true;
                    }else{
                        model.page.hasMoreData = false;
                    }
                    model.page.infoCenterLists = data.infoCenterLists
                    model.page.logoIcon = data.logoIcon
                    model.page.comName = data.comName
                }else{
                    prompt.showToast({ message: data})
                    model.page.$page.setTitleBar({text: '系统异常'})
                }
            }else{
                prompt.showToast({ message: data})
                model.page.$page.setTitleBar({text: '系统异常'})
            }
        })
      },
    gotoBack(){
        model.page.$app.exit()
    },
    contentClick(data) {
        const items = data.key
        if(items.channelContentflag === '1' ){
            if(items.channelContentUrl){
                router.push({uri:items.channelContentUrl})
            }else{
                prompt.showToast({ message: '跳转链接不能为空.'}) 
            }
        }else if(items.channelContentflag === '0'){
            router.push({uri:'Pages/InfoDetail',params:{contentId:items.contentId,channelid:model.page.channelid,pubTempId:model.page.pubTempId}})
        }else{
            prompt.showToast({ message: '跳转标识有误,请核对.'}) 
        }
    },
    onEventListener({data,evt}) {
        if (model[data.type]) {
            model[data.type](data, evt)
        }
    }

}
