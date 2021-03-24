const Schabbi = require('./Schabbi.js');

const schabbi = new Schabbi('https://www.loewenstark.com/', {
    followExternal : false,
    freshStart : true,
    db : {
        database : 'crawler',
        username : 'root',
        password : 'root',
        table : 'url',
        sequelizeOpts : {
            host : '127.0.0.1',
            port : '8889',
            dialect : 'mysql',
            logging : false
        }
    }
});

schabbi.start().then(function(results){
    var output = {};
    results.forEach((result) => {
        const url = result[0];
        const res = result[1] || 'External';
        if(output[res] === undefined){
            output[res] = [];
        }
        output[res].push(url);
    });
    console.log("\n", output);
});