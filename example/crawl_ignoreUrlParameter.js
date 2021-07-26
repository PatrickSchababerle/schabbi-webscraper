const Schabbi = require('./../Schabbi.js');
const Crawler = new Schabbi();

Crawler.setUrl('https://www.example.com').withOptions({
    ignoreUrlParameter : true
}).crawl().then((result) => {
    console.log(result);
});