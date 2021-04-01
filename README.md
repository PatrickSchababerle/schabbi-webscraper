<!-- [START badges] -->

[![Build Status](https://travis-ci.com/PatrickSchababerle/schabbi-webscraper.svg?token=x3Xxx6fmnZtByDoY9d4v&branch=master)](https://travis-ci.com/PatrickSchababerle/schabbi-webscraper)
[![npm puppeteer package](https://img.shields.io/npm/v/schabbi)](https://npmjs.org/package/schabbi)

<!-- [END badges] -->

# Schabbi Webscaper

Easy to use and simple webcrawler.

## Installation

### via NPM

    $ npm i schabbi

### via Github

    $ git clone https://github.com/PatrickSchababerle/schabbi-webscraper
    $ npm install

## Usage

#### Standard use case

    const  Schabbi = require('schabbi');
    const  Crawler = new Schabbi();      
    
    Crawler.setUrl('https://www.example.com').crawl();

#### With custom option parameters

    const  Schabbi = require('schabbi');
    const  Crawler = new  Schabbi();

    Crawler.setUrl('https://www.example.com').withOptions({
	    includeExternalLinks :  true,
	    userAgent :  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    }).crawl();

#### Further work with result

Schabbi is returning a promise which will be resolved as soon as the crawl has finished:

    const  Schabbi = require('schabbi');
    const  Crawler = new  Schabbi();
    
    Crawler.setUrl('https://www.example.com').crawl().then((result) => {
    	console.log(result);
    });

## Methods

| Method | Description |
|--|--|
| withOptions( Object ) | Set custom options for the crawler |
| setUrl( String ) | Set initial url |
| crawl() | Start the crawling |

## About this project

This is one of my first projects on github to be available for you all out there. Please feel free to provide feedback :)
