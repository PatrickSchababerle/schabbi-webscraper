const Schabbi = require('./../Schabbi.js');
const Crawler = new Schabbi();

Crawler.setUrl('https://digitalsterne.de').withOptions({
    queue : {
        pattern : 'a[href*="/"]'
    }
}).crawl().then((result) => {
    console.log(result);
});