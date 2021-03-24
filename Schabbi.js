const puppeteer = require('puppeteer');
const Sequelize = require('sequelize');
const crypto    = require('crypto');

class Schabbi {
    constructor(url, config) {
        this.domain = url.domain();
        this.queue = [url];
        this.finished = [];
        this.result = [];
        this.maxAsyncs = 5;
        this.runtime = 0;
        this.progressBar = new ProgressBar('Crawling [:bar] :current/:total', {
            complete: '=',
            incomplete: ' ',
            width: 20,
            total: 100
        });
        this.followExternal = config.followExternal;
        this.freshStart = config.freshStart;
        this.db = new Sequelize(config.db.database, config.db.username, config.db.password, config.db.sequelizeOpts);
        this.urlTable = this.db.define(config.db.table, {
            urlHash: {
                type: Sequelize.STRING(40),
                allowNull: false
            },
            domain: {
                type: Sequelize.STRING(10000),
                allowNull: false
            },
            url: {
                type: Sequelize.STRING(10000),
                allowNull: false
            },
            statusCode: {
                type: Sequelize.STRING,
                allowNull: true
            },
            errorCode: {
                type: Sequelize.STRING,
                allowNull: true
            },
            errorMessage: {
                type: Sequelize.STRING(1000),
                allowNull: true
            },
            numErrors: {
                type: Sequelize.INTEGER(10),
                allowNull: false
            },
            nextRetryDate: {
                type: Sequelize.DATE,
                allowNull: false
            }
            }, {
            indexes: [{
                unique: false,
                fields: ["nextRetryDate"]
            }, {
                unique: true,
                fields: ["urlHash"]
            }]
        });
    }
    start = function() {
        console.clear();
        return new Promise(resolve => {
            var self = this;
            if(this.freshStart){
                this.urlTable.destroy({
                    where: {
                        domain : this.domain
                    }
                }).then(function(){
                    self.crawl();
                });
            }else{
                self.crawl();
            }
            this.working = setInterval(function(){

                self.updateProgress();
                
                if(self.queue.length === 0){
                    clearInterval(self.working);
                    return resolve(self.result);
                }else{
                    self.runtime++;
                }

            }, 1000);
        });
    }
    crawl() {
        var urls = (this.queue.length > this.maxAsyncs) ? this.queue.slice(0, this.maxAsyncs) : this.queue;
        
        var counter = 0;
        var currLength = urls.length;
        var self = this;

        for (const [index, url] of urls.entries()) {
            this.getLinks(url).then(() => {
                // remove url from queue
                this.queue.remove(url);
                // add url to finished
                this.finished.push(url);
                // increase counter
                counter++;
            });
        }
        var interval = setInterval(function(){
            if(counter === currLength){
                clearInterval(interval);
                if(self.queue.length > 0){
                    self.crawl();
                }
            }
        }, 500);
    }
    async getLinks(url) {
        return new Promise(resolve => {
            var currUrl = {
                urlHash : crypto.createHash('sha1').update(url).digest("hex"),
                domain : this.domain,
                url : url,
                statusCode : null,
                errorCode : null,
                errorMessage : null,
                numErrors : 0,
                nextRetryDate : 0
            };
            (async () => {
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                // set user agent (override the default headless User Agent)
                await page.setUserAgent("Mozilla/5.0 (compatible; schabbi-webscraper/0.0.1; +https://github.com/PatrickSchababerle/schabbi-webscaper)");
                try{
                    const response = await page.goto(url);
                    const hrefs = await page.$$eval('a[href*="/"]', as => as.map(a => a.href));
                    const chain = response.request().redirectChain();
                    if(chain.length > 0){
                        currUrl.statusCode = chain[0].response().status();
                    }else{
                        currUrl.statusCode = response.status();
                    }
                    hrefs.forEach((href) => {
                        if(href.domain() === url.domain() || this.followExternal){
                            (this.queue.indexOf(href) == -1 && this.finished.indexOf(href) == -1) ? this.queue.push(href) : false;
                        }else{
                            if(this.finished.indexOf(href) == -1){
                                this.finished.push(href);
                                this.result.push([href, null]);
                            }
                        }
                    });
                    this.result.push([url, currUrl.statusCode]);
                }catch(e){
                    currUrl.errorCode = e.code;
                    currUrl.errorMessage = e.message;
                    this.result.push([url, e.message]);
                }
                this.insert(currUrl);
                await browser.close();
                resolve(true);
            })();
        });
    }
    insert(params) {
        return this.urlTable.upsert(params);
    }
    updateProgress(){
        var self = this;
        var current = parseFloat(self.result.length/(self.queue.length + self.result.length)*100).toFixed(0);
    
        const dots = "|".repeat(current/5);
        const left = 20 - (current/5);
        const empty = " ".repeat(left);

        console.clear();

        process.stdout.write(`\r Progress |${dots}${empty}| ${current}%\n\n`);
        process.stdout.write("\r Queue: " +  self.queue.length + " | Results: " +  self.result.length + " | Runtime: " + self.runtime.toString().toHHMMSS() + " | Estimated: " + ((self.runtime/self.result.length)*self.queue.length).toString().toHHMMSS());
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