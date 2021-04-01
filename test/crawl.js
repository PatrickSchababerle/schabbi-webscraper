const Schabbi = require('./../Schabbi.js');
const Crawler = new Schabbi();

Crawler.setUrl('https://www.example.com').withOptions({
    includeExternalLinks : true,
    userAgent : "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"

}).crawl().then((result) => {
    console.log(result);
});