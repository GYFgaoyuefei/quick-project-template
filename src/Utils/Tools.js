/**
 * 显示菜单
 */
function showMenu () {
    const prompt = require('@system.prompt')
    const router = require('@system.router')
    const appInfo = require('@system.app').getInfo()
    prompt.showContextMenu({
        itemList: ['保存桌面', '关于', '取消'],
        success: function (ret) {
            switch (ret.index) {
            case 0:
            // 保存桌面
                createShortcut()
                break
            case 1:
            // 关于
                router.push({
                    uri: '/About',
                    params: {
                        name: appInfo.name,
                        icon: appInfo.icon
                    }
                })
                break
            case 2:
            // 取消
                break
            default:
                prompt.showToast({
                    message: 'error'
                })
            }
        }
    })
}
  
/**
 * 创建桌面图标
 * 注意：使用加载器测试`创建桌面快捷方式`功能时，请先在`系统设置`中打开`应用加载器`的`桌面快捷方式`权限
 */
function createShortcut () {
    const prompt = require('@system.prompt')
    const shortcut = require('@system.shortcut')
    shortcut.hasInstalled({
        success: function (ret) {
            if (ret) {
                prompt.showToast({
                    message: '已创建桌面图标'
                })
            } else {
                shortcut.install({
                    success: function () {
                        prompt.showToast({
                            message: '成功创建桌面图标'
                        })
                    },
                    fail: function (errmsg, errcode) {
                        prompt.showToast({
                            message: `${errcode}: ${errmsg}`
                        })
                    }
                })
            }
        }
    })
}
  
  
function formatRichText(html){
    let newContent= html.replace(/<img[^>]*>/gi,function(match,capture){
        match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '')
        match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '')
        match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '')
        match = match.replace(/class="[^"]+"/gi, '').replace(/height='[^']+'/gi, '')
        return match
    })
    newContent = newContent.replace(/style="[^"]+"/gi,function(match){
        match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;')
        return match
    })
    newContent = newContent.replace(/<br[^>]*\/>/gi, '')
    newContent = newContent.replace(/<img/gi, '<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"')
    return newContent
}
  
export default {
    showMenu,
    createShortcut,
    formatRichText
}
  