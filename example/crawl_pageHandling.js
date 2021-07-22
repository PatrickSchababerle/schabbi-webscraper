const Schabbi = require('./../Schabbi.js');
const Crawler = new Schabbi();

Crawler.setUrl('https://digitalsterne.de').eachPage((page) => {
    const links = page.$$eval('a', as => as.map(a => a.href));
    return links;
}).crawl().then((result) => {
    console.log(result);
});