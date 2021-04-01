const puppeteer = require('puppeteer');
const Queue = require('./helper/queue.js');

class Schabbi {
    constructor() {
        this.domain;
        this.queue = new Queue();
        this.finished = [];
        this.result = [];
        this.options = {
            includeExternalLinks : false,
            userAgent : "Mozilla/5.0 (compatible; schabbi-webscraper/1.0.0; +https://github.com/PatrickSchababerle/schabbi-webscaper)",
            browser : {}
        }
    }
    withOptions(object){
        for(var option in object){
            var config = object[option];
            this.options[option] = config;
        }
        return this;
    }
    setUrl(string){
        this.domain = string.domain();
        this.queue.enqueue(string);
        return this;
    }
    getPage(browser){

        var self = this;
        const url = this.queue.peek();

        return (async () => {

            try{

                const page = await browser.newPage();
                
                await page.setUserAgent(self.options.userAgent);

                const response = await page.goto(url, {
                    waitUntil : 'networkidle0'
                });

                const hrefs = await page.$$eval('a[href*="/"]', as => as.map(a => a.href));
                const chain = response.request().redirectChain();

                var status_code;

                if(chain.length > 0){
                    status_code = chain[0].response().status();
                }else{
                    status_code = response.status();
                }

                if(url.domain() === self.domain){
                    hrefs.forEach((href) => {
                        if(href.domain() === url.domain() || self.options.includeExternalLinks){
                            if(self.finished.indexOf(href) == -1 && !self.queue.contained(href)){
                                self.queue.enqueue(href);
                            }
                        }
                    });
                }

                const cookies = await page._client.send('Network.getAllCookies');

                self.result.push({
                    url : url,
                    status : status_code,
                    cookies : cookies.cookies
                });

                self.finished.push(url);
                self.queue.dequeue(url);

                await page.close();

                return true;

            }catch(e){

                self.result.push({
                    url : url,
                    status : e.message
                });

                self.finished.push(url);

            }

        })();
    }
    crawl(){
        var self = this;
        return (async () => {
            const browser = await puppeteer.launch(self.options.browser);
            while(!self.queue.isEmpty()){
                await self.getPage(browser);
            }
            await browser.close();
            return self.result;
        })();
    }
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

String.prototype.hostname = function() {
    var hostname;
    if (this.indexOf("//") > -1) {
        hostname = this.split('/')[2];
    } else {
        hostname = this.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    return hostname;
}

String.prototype.domain = function() {
    return this.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];
}

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

module.exports = Schabbi;
