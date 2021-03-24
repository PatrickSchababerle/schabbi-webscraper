const Schabbi = require('./Schabbi.js');

const schabbi = new Schabbi('https://www.digitalsterne.de', {
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

schabbi.start();

// async function test(val) {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             resolve(console.log(val));
//         }, 5000);
//     });
// }

// const files = ['A', 'B', 'C'];

// console.log('Start');

// for (const [index, file] of files.entries()) {
//     test(file).then(() => {
//         if((index + 1) == files.length){
//             console.log('End');
//         }else{
//             console.log('---');
//         }
//     });
// }