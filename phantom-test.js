const page = require('webpage').create()
const file = require('fs')

// page.onConsoleMessage = function (msg) {
//     console.log(`page title is ${msg}`)
// }

page.onError = function (msg, trace) {

}

phantom.onError = function (msg, trace) {
    console.log('err', msg)
}

const titles = []
function getShopsName (index, max) {
    index = index || 0
    page.settings.loadImages = false
    return function() {
        console.log('index', index)
        if (index < max) {
            const url = 'https://s.taobao.com/search?q=%E8%BF%9E%E8%A1%A3%E8%A3%99&refpid=430266_1006&source=tbsy&style=grid&tab=all&pvid=e5b49f5dc0b29dbaf823cd93a1b65123&clk1=7930b7eec9e16692eca7eef7d8b5b1e3&spm=a21bo.2017.201856-sline.1.5af911d9sLcjZ8&bcoffset=0&p4ppushleft=3%2C44&s=' + index
            page.open(url, function (s) {
                console.log('index ' + index + ' ' + s)
                if (s === 'success') {
                    setTimeout(function () {
                        const shopUrl = page.evaluate(function () {
                            const urls = []
                            const ele = document.getElementsByClassName('J_ShopInfo')
                            for(var i = 0, len = ele.length; i < len; ++i) {
                                const item = ele[i]
                                urls.push(item.href)
                            }
                            return urls
                        })
                        getTitle(shopUrl, 0, getShopsName(index + 44, max))
                    }, 1500)
                }
            
            })
        } else {
            console.log('done')
            phantom.exit()
        }
    }
}

function getTitle (urls, i, cb) {
    // if (i < 2) {
    if (i < urls.length) {
        const url = urls[i]
        page.open(url, function(s) {
            if (s === 'success') {
                const result = page.evaluate(function () {
                    return document.title
                })
                console.log(i + ' ' + result)
                titles.push(result)
                getTitle (urls, i + 1, cb)
            }
        })
    } else {
        cb && cb()
    }
}

getShopsName(0, 88)()