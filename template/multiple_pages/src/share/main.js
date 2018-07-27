import './main.css'
import 'regenerator-runtime/runtime'
import 'babel-polyfill'
import { config, api } from './config'

// 获取声音列表接口参数
const queryTrackRecordsParams = {
        "pageSize": 10,
        "currentPage": 1,
        "asc": true,
        "trackQualityLevel": 1
    },
    querySampleTrackParams = {
        "action": 1,                 //1播放 2下载 播放会记录播放量
        "trackQualityLevel": 1
    },
    params = handleUrl(window.location.search)

let pageInWeChat = false,       // 标识是否在微信浏览器中
    environment = 0,            // 环境标识  0:初始化   1:ios   2:andriod   3:其他 如黑莓
    isFetching = false,         // 标识滑到底部后，是否正在请求接口获取音频列表
    audioTotalSize = 0,         // 音频总数
    prevAudioStatusBtn = null,  // 上一个播放audio的状态节点
    prevAudio = null            // 上一个播放的audio

const titleDom = document.querySelector('title'),
    guide = document.getElementById('guide'),
    head_content = document.getElementById('head_content'),         // 头部内容
    lessonNum = document.getElementById('lessonNum'),               // 音频节数
    media_container = document.getElementById('media_container'),   // 音频列表
    cover = document.getElementById('cover'),
    popUpContainer = document.getElementById('popUpContainer'),
    popUp = document.getElementById('popUp'),
    popCancel = document.getElementById('popCancel'),
    downloadBtnSmall = document.getElementById('downloadBtnSmall'), // 顶部下载app按钮
    openBtnLarge = document.getElementById('openBtnLarge'),         // 长条打开app按钮
    popOpenBtn = document.getElementById('popOpenBtn'),             // 弹框打开app按钮
    moreLink = document.getElementById('more')                      // 长文案详情介绍按钮

// 获取环境标识
;(function () {
    environment = 3
    const u = navigator.userAgent
    if ( !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ) environment = 1
    if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) environment = 2
    if (/MicroMessenger/.test(u)) pageInWeChat = true
})()

guide.addEventListener('click', function () {
    this.classList.add('none')
})

// 打开app函数
function openApp () {
    if (pageInWeChat) {
        guide.classList.remove('none')
        return null
    }
    window.location.href = window.config.appLink+`${params.albumId}`
}

downloadBtnSmall.addEventListener('click', function(){
    if (environment === 1) {
        window.location.href = config.iosDownload
    } else if (environment === 2) {
        window.location.href = config.andriodDownload
    }
})

openBtnLarge.addEventListener('click', function(){
    openApp()
})

popOpenBtn.addEventListener('click', function(){
    openApp()
})
// 跳转详情页
moreLink.addEventListener('click', function(){
    window.location.href = window.config.detailLink + `${params.albumId}`
})

// 处理进入页面由native传给的参数
function handleUrl(str) {
    str = decodeURIComponent(str.slice(1))
    const items = str.length ? str.split('&') : []
    const args = {}
    items.forEach(item => (args[item.split('=')[0]] = item.split('=')[1]))
    return args
}

// 时间转换 68 => 01:08
function durationFormat (duration) {
    const time = []
    let hours = '0',
        minutes = '0',
        seconds = '0'
    // 处理小时数，如果为‘00’，则不加入到时间中
    hours = Math.floor(duration / 3600)
    hours = hours >= 10 ? hours : `0${hours}`
    if (hours !== '00') {
        time.push(hours)
    }
    duration = duration % 3600

    minutes = Math.floor(duration / 60)
    minutes = minutes >= 10 ? minutes : `0${minutes}`
    time.push(minutes)
    duration = duration % 60

    seconds = duration
    seconds = seconds >= 10 ? seconds : `0${seconds}`
    time.push(seconds)

    return time.join(':')
}

/**
 * 
 * @param {*是否是vip，0：否  1：是} vipType 
 * @param {*是否可试听} isTryOut 
 */
function renderMediaLabelClass (vipType, isTryOut) {
    let res = ''
    if (vipType === 0) {
        res = 'none'
    } else if (vipType === 1) {
        if (isTryOut) {
            res = 'mediaLabel'
        } else {
            res = 'mediaLabel_vip'
        }
    }
    return res
}

/**
 * 
 * @param {*获取的音频列表} trackRecordList 
 * @param {*获取的播放地址列表} playPathList 
 * @param {*dom树中已存在的音频条数} hasAudioLength 
 */
function insertAudioList (trackRecordList, playPathList, hasAudioLength = 0) {
    const frage = document.createDocumentFragment()

    trackRecordList.forEach((item, index) => {
        const li = document.createElement('li'),
            { duration, title, vipType, isTryOut } = item

        li.classList.add('media')
        li.innerHTML = `
                            <a href="javascript:;" class=${ playPathList[index] ? '' : 'vip' }>
                                <button class="play"></button>
                                <div class="mediaInfo">
                                    <h6 class="mediaTitle">
                                        <span>
                                            <span class="key">${ hasAudioLength + index + 1 }、</span>
                                            <span class="title">${ title }</span>
                                        </span>
                                    </h6>
                                    <div class=${ renderMediaLabelClass(vipType, isTryOut) }></div>
                                    <div class="mediaTime">
                                        <span class='time_img'></span>
                                        <p>${ durationFormat(duration) }</p>
                                    </div>
                                </div>
                            </a>
                            <audio ${ playPathList[index] ? `src=${ playPathList[index]['playUrl32'] }` : '' } />
                        `
        frage.appendChild(li)
    })
    media_container.appendChild(frage)
}

function changeStatusBtn (bool) {
    if (bool) {
        prevAudioStatusBtn.classList.remove('play')
        prevAudioStatusBtn.classList.add('pause')
    } else {
        prevAudioStatusBtn.classList.remove('pause')
        prevAudioStatusBtn.classList.add('play')
    }
}

media_container.addEventListener('click', function (e) {
    let dom = e.target
    while (dom.tagName !== 'LI') {
        dom = dom.parentNode
    }
    const currentAudio = dom.lastElementChild
    // 若当前audio标签无src地址（即该音频收费），弹出弹窗
    if (!currentAudio.src) {
        popUpContainer.classList.remove('none')
        return null
    }
    // 上一次点击的和当前点击相同，根据状态判断暂停播放
    if (prevAudio === currentAudio) {
        const classList = Array.prototype.slice.call(prevAudioStatusBtn.classList)
        if ( classList.find(item => item === 'play') ) {
            changeStatusBtn(true)
        } else {
            changeStatusBtn(false)
        }
        if (prevAudio.paused) {
            prevAudio.play()
        } else {
            prevAudio.pause()
        }
    } else {
        // 上一次有点击情况(即不是初始化状态)执行类名切换操作
        if (prevAudioStatusBtn) {
            changeStatusBtn(false)
        }
        prevAudioStatusBtn = dom.firstElementChild.firstElementChild
        changeStatusBtn(true)

        if (prevAudio) {
            prevAudio.pause()
        }
        prevAudio = dom.lastElementChild
        prevAudio.play()
        // 添加播放结束切换状态按钮事件
        prevAudio.addEventListener('ended', function () {
            changeStatusBtn(false)
        })
    }
})

popCancel.addEventListener('click', function () {
    popUpContainer.classList.add('none')
})

popUpContainer.addEventListener('click', function (e) {
    const target = e.target
    if (target.contains(popUp)) {
        this.classList.add('none')
    }
})

//超过指定高度文本隐藏方法
function overflowHidden(contentId, rows, str){
	var text = document.getElementById(contentId);
	var textHeight = getProp(text, 'lineHeight');		//获取段落的行高
	var at = rows * parseInt(textHeight);				//计算段落内容的高度
	text.innerHTML = str;								//传入的文本先写入该对象
	var i = 0;
	if (text.offsetHeight <= at){						//如果段落内容总高度不大于该元素的高度，返回
		return null;
	} else {											//段落内容总高度大于元素高度，则进行判断后的切割
		var temp = "";
		text.innerHTML = temp;							//重置text部分的文本,用于判断其与设定行数的高度的关系
		while (text.offsetHeight <= at){
			temp += str.substring(i, i + 1);
			i++;
			text.innerHTML = temp;
		}
		var length = temp.length;
		temp = str.substring(0, length - 8);			//切割8个文字位置
		text.innerHTML = temp + "...";					//写入文本
	}
}
/**
 * 
 * @param {需要获取样式的对象} obj	
 * @param {需要获取的样式} prop	
 */
function getProp(obj, prop){
    // IE方法检测及其他浏览器方法检测
    if (obj.currentStyle){
        return obj.currentStyle[prop];
    } else if(window.getComputedStyle){
        return window.getComputedStyle(obj, null)[prop];
    }
    return null
}

/**
 * 
 * @param {*上一次then调用返回的数据data} response 
 * @param {*dom树中已存在的音频条数} hasAudioLength 
 */
function fetchPlayPath (response, hasAudioLength) {
    const { trackRecordList } = response, fetchPlayPathList = []
    trackRecordList.forEach(item => {
        const { vipType, isTryOut } = item
        // vip类型且不能试听，不调用接口
        if (vipType === 1 && !isTryOut) {
            fetchPlayPathList.push(null)
        } else {
            fetchPlayPathList.push(
                api.post(config.querySampleTrack, Object.assign(params, querySampleTrackParams, { trackId: item.trackSourceId }))
            )
        }
    })
    return Promise.all(fetchPlayPathList).then(pathList => {
        insertAudioList(trackRecordList, pathList, hasAudioLength)
    }).catch(err => {
        alert('服务出错，请重试')
    })
}

function init () {
    Promise.all([
        api.post(config.album, params),
        api.post(config.queryTrackRecords, Object.assign(params, queryTrackRecordsParams))
    ]).then(res => {
        // 头部文案修改
        const { coverPath, title, shortIntro, subscriptionCount, richIntro, vipType } = res[0].albumDetail
        titleDom.innerText = title
        cover.innerHTML = `
                            <img src=${ coverPath } alt=${ title } />
                            ${ vipType === 1 ? `<span class='labels_vip'>vip</span>` : '' }
                        `
        head_content.innerHTML = `
                                    <h6 class="title">${ title }</h6>
                                    <p class="simpleIntro">${ shortIntro }</p>
                                    <p class="follow"><span id="number">${ subscriptionCount }</span>人已订阅</p>
                                `
        overflowHidden('intro_text', 3, richIntro)
        return res[1]
    }).then(res => {
        // 音频列表修改

        audioTotalSize = res.totalSize
        lessonNum.innerHTML = audioTotalSize
        fetchPlayPath(res).then(res => {
            // 请求成功后再修改currentPage页数，不要在请求前修改
            const hasAudioLength = media_container.querySelectorAll('.media').length
            queryTrackRecordsParams.currentPage = Math.floor(hasAudioLength / 10) + 1

            // 获取到数据并完成列表生成后再绑定事件
            window.addEventListener('scroll', function () {
                const scrollTop = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset,
                    offsetHeight = document.body.offsetHeight
                // 达到底部
                if (scrollTop + window.screen.height >= offsetHeight) {
                    // 不是正在调用接口
                    if (!isFetching) {
                        const loading = document.getElementById('loading'),
                            hasAudioLength = media_container.querySelectorAll('.media').length

                        // 音频总数要比现有已加载条数多
                        if (audioTotalSize > hasAudioLength) {
                            isFetching = true
                            loading.classList.remove('none')
                            // 请求成功和失败都修改是否正在请求接口状态
                            api.post(config.queryTrackRecords, Object.assign(params, queryTrackRecordsParams)).then(res => {
                                fetchPlayPath(res, hasAudioLength).then(res => {
                                    queryTrackRecordsParams.currentPage++
                                })
                                loading.classList.add('none')
                                setTimeout(() => {
                                    isFetching = false
                                }, 2000)
                            }).catch(err => {
                                isFetching = false
                            })
                        }
                    }
                }
            })
        })
    })
}

window.addEventListener('load', init)