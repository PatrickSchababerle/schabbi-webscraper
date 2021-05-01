const Schabbi = require('./../Schabbi.js');
const Crawler = new Schabbi();

Crawler
    .setUrl('http://httpbin.org/basic-auth/foo/bars')
    .withOptions({
        includeExternalLinks : true,
        userAgent : "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
        authentication : {
            username : 'foo',
            password : 'bar'
        },
        browser : {
            headless : true
        }
    })
    .crawl()
    .then((results) => {
        results.forEach((result) => {
            console.log(result.url);
        });
    });