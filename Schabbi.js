const puppeteer = require('puppeteer');
const Queue = require('./helper/queue.js');

class Schabbi {
    constructor() {
        this.domain;
        this.queue = new Queue();
        this.finished = [];
        this.result = [];
        this.start_time = new Date();
        this.status = setInterval(() => {
            let done = this.finished.length;
            let open = this.queue.length();
            let sum = done + open;
            let time = new Date();
            process.stdout.write(`\rStatus: ${parseInt(done / sum * 100)} % || ${done} of ${sum} Pages crawled in ${formatMs(time - this.start_time)}`);
        }, 1000);
        this.options = {
            includeExternalLinks : false,
            userAgent : "Mozilla/5.0 (compatible; schabbi-webscraper/1.0.0; +https://github.com/PatrickSchababerle/schabbi-webscaper)",
            authentication : {
                username : false,
                password : false
            },
            browser : {},
            queue : {
                pattern : 'a[href*="/"]'
            },
            ignoreUrlParameter : false
        }
        this.callback = false;
        console.clear();
    }

    /**
     * Set options in class variables
     * @param  {object} object  The configuration object
     * @return {class}          Returning current Schabbi instance
     */

    withOptions(object){
        for(var option in object){
            var config = object[option];
            this.options[option] = config;
        }
        return this;
    }

    /**
     * Set a function to be executed on each page result from puppeteer
     * @param callback  function    The function to be executed
     * @returns {class}             Returning current Schabbi instance
     */
    eachPage(callback) {
        this.callback = callback;
        return this;
    }

    /**
     * Set entry url for the crawler to begin
     * @param  {string} string  Entry point url
     * @return {class}          Returning current Schabbi instance
     */

    setUrl(string){
        this.domain = string.domain();
        this.queue.enqueue(string);
        return this;
    }

    /**
     * Process with next url in queue
     * @param  {class} browser  Puppeteer browser instance
     * @return {promise}        Returning promise till page has been crawled
     */

    getPage(browser){

        var self = this;
        const url = this.queue.peek();

        return (async () => {

            try{

                const page = await browser.newPage();
                
                await page.setUserAgent(self.options.userAgent);

                if (self.options.authentication) {
                    await page.authenticate(self.options.authentication);
                }

                const response = await page.goto(url, {
                    waitUntil : 'networkidle0'
                });

                const hrefs = await page.$$eval(this.options.queue.pattern, as => as.map(a => a.href));
                const chain = response.request().redirectChain();

                var status_code;

                if(chain.length > 0){
                    status_code = chain[0].response().status();
                }else{
                    status_code = response.status();
                }

                if(url.domain() === self.domain){
                    hrefs.forEach((href) => {
                        if(self.options.ignoreUrlParameter) {
                            href = href.split('?')[0];
                        }
                        if(href.domain() === url.domain() || self.options.includeExternalLinks){
                            if(self.finished.indexOf(href) == -1 && !self.queue.contained(href)){
                                self.queue.enqueue(href);
                            }
                        }
                    });
                }

                const cookies = await page._client.send('Network.getAllCookies');

                let temp_result = {
                    url : url,
                    status : status_code,
                    cookies : cookies.cookies
                }

                if(this.callback !== false) {
                    temp_result['cb'] = await this.callback(page);
                }

                self.result.push(temp_result);

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

    /**
     * Initial function to start the crawling process
     * @return {promise}        Returning promise till all pages in queue have been crawled
     */

    crawl(){
        var self = this;
        return (async () => {
            const browser = await puppeteer.launch(self.options.browser);
            while(!self.queue.isEmpty()){
                await self.getPage(browser);
            }
            clearInterval(this.status);
            console.clear();
            await browser.close();
            return self.result;
        })();
    }

}

/**
 * Helper function: Get domain of url string
 * @param  {string} url     URL string
 * @return {string}         Returning domain string of url
 */

String.prototype.domain = function() {
    return this.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];
}

/**
 * Helper function: Format milliseconds to d:hh:mm:ss
 * @param seconds
 * @returns {*}
 */
function formatMs(ms) {
    return new Date(ms).toISOString().substr(11, 8);
}

/**
 * Schabbi Webscraper Module
 * @module Schabbi
 */

module.exports = Schabbi;
