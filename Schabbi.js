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
 * Schabbi Webscraper Module
 * @module Schabbi
 */

module.exports = Schabbi;
