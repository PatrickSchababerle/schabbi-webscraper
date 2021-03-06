<p align="center"><img src="/schabbi_teaser.png" alt="Schabbi Webscraper"></p>
<hr>
<!-- [START badges] -->

[![Build Status](https://travis-ci.com/PatrickSchababerle/schabbi-webscraper.svg?token=x3Xxx6fmnZtByDoY9d4v&branch=master)](https://travis-ci.com/PatrickSchababerle/schabbi-webscraper)
[![npm puppeteer package](https://img.shields.io/npm/v/schabbi-webscraper)](https://npmjs.org/package/schabbi-webscraper)
[![Package Quality](https://packagequality.com/shield/schabbi-webscraper.svg)](https://packagequality.com/#?package=schabbi-webscraper)
![Downloads](https://img.shields.io/npm/dw/schabbi-webscraper)


<!-- [END badges] -->

Lightweight and easy to use webcrawler.

## Features

- Fast and reliable
- Supports custom page handling
- Result contains also all cookies
- Accepts all puppeteer parameters

## Requirements

 - NodeJS v15.*

## Installation

### via NPM
```bash
$ npm i schabbi-webscraper
```
### via Github
```bash
$ git clone https://github.com/PatrickSchababerle/schabbi-webscraper
$ npm install
```
## Usage

#### Standard use case
```js
const  Schabbi = require('schabbi-webscraper');
const  Crawler = new Schabbi();      

Crawler.setUrl('https://www.example.com').crawl();
```
#### With custom option parameters
```js
const  Schabbi = require('schabbi-webscraper');
const  Crawler = new Schabbi();

Crawler.setUrl('https://www.example.com').withOptions({
    includeExternalLinks :  true,
    userAgent :  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
    authentication : {
        username : 'Testuser',
        password : 'Test'
    }
}).crawl();
```
You can decide which crawled links are added to the queue by using the queue option. F.e. to crawl only pages with a specific attribute, class or target:

```js
const  Schabbi = require('schabbi-webscraper');
const  Crawler = new Schabbi();

Crawler.setUrl('https://www.digitalsterne.de').withOptions({
    queue : {
        pattern : 'a[href*="/2021/05/06"]'
    }
}).crawl();
```
You can also decide if parameters are ignored when adding urls to the queue:

```js
const  Schabbi = require('schabbi-webscraper');
const  Crawler = new Schabbi();

Crawler.setUrl('https://www.digitalsterne.de').withOptions({
    ignoreUrlParameter : true
}).crawl();
```

#### Work with the crawled pages while the're beeing processed

With custom functions you can perform actions on each crawled page. The results will be pushed into the final results.
```js
const  Schabbi = require('schabbi-webscraper');
const  Crawler = new Schabbi();

Crawler.setUrl('https://digitalsterne.de').eachPage(async (page) => {
    const links = await page.$$eval('a', as => as.map(a => a.href));
    return links;
}).crawl().then((result) => {
    console.log(result);
});
```
#### Further work with result

Schabbi is returning a promise which will be resolved as soon as the crawl has finished:
```js
const  Schabbi = require('schabbi-webscraper');
const  Crawler = new Schabbi();

Crawler.setUrl('https://www.example.com').crawl().then((result) => {
    console.log(result);
});
```
## Methods

| Method | Description |
|--|--|
| withOptions( Object ) | Set custom options for the crawler |
| setUrl( String ) | Set initial url |
| crawl() | Start the crawling |


## Configuration

| Option | Description | Type |
|--|--|--|
| includeExternalLinks | Determine if Schabbi should output external links in the results | BOOLEAN |
| userAgent | Use a custom User Agent for crawling | STRING |
| browser | Settings for Puppeteer. All Puppeteer browser launch arguments are accepted | OBJECT |
| queue | Set custom pattern for evaluation of links inside crawled pages. | OBJECT |

Visit the examples for detailed information on how to use options properly.


## About this project

This is one of my first projects on github to be available for you all out there. Please feel free to provide feedback!
