const Schabbi = require('./../Schabbi.js');
const Crawler = new Schabbi();

Crawler.setUrl('https://www.example.com').withOptions({
    browser : {
        headless : false
    }
}).crawl().then((result) => {
    console.log(result);
});