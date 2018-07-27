// 测试环境变量
const mode = 'development'
// 生产环境变量
// const mode = 'production'

let apiDomain = '',             // 接口domain        
    detailDomain = ''           // 详情页domain
if (mode === 'development') {
    // 开发环境dimain
    apiDomain = 'http://xxm.test.ximalaya.com/mobile/album'
    detailDomain = 'http://static2.test.ximalaya.com'
} else if (mode === 'production') {
    // 生产环境damain
    apiDomain = 'https://xxm.ximalaya.com/mobile/album'
    detailDomain = 'http://s1.xmcdn.com'
}

export const config = {
    album: `${ apiDomain }/album/queryAlbumDetail`,
    queryTrackRecords: `${ apiDomain }/trackRecord/queryTrackRecordsByAlbumIdAndUid`,
    querySampleTrack: `${ apiDomain }/trackRecord/querySampleTrack`,
    
    appLink:`itingKid://wireless/album_detail?albumId=`,
    detailLink: `${ detailDomain }/lib/xxm-hybrid-h5/last/dist/detail/index.html?albumId=`,

    andriodDownload: 'https://mobile.ximalaya.com/v1/mobile/version2',
    iosDownload: 'itms-apps://itunes.apple.com/app/id1390926586'
}

class Api {
    ajax (type, url, params = {}) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open(type, url, true)
            xhr.withCredentials = true
            xhr.setRequestHeader('Content-Type', 'application/json')
            xhr.send(JSON.stringify(params))
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
                    const res = JSON.parse(xhr.responseText)
                    if (res.ret === 0) {
                        resolve(res.data)
                    } else {
                        reject('error')
                    }
                }
            }
        })
    }
    get (url) {
        return this.ajax('GET', url)
    }
    post (url, params) {
        return this.ajax('POST', url, params)
    }
}

export const api = new Api

// window.config = config
// window.api = new Api