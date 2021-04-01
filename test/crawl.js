const Schabbi = require('./../Schabbi.js');
const Crawler = new Schabbi();

Crawler.setUrl('https://www.example.com').withOptions({
    includeExternalLinks : false
}).crawl().then((result) => {
    console.log(result);
});

Crawler.setUrl('https://www.example.com').withOptions({
    includeExternalLinks : true
}).crawl().then((result) => {
    console.log(result);
});