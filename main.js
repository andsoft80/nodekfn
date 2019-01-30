var host = '185.220.35.146';
var mySqlHost = '185.220.35.146';
var redirectHost = 'http://kakar.ru';
var port = 80;
var express = require("express");
var fs = require('fs');
var app = express();
var cors = require('cors');
var yandexMoney = require("yandex-money-sdk");
var request_mod = require('request');
var song_cost = 2;

//httpProxy = require('http-proxy');
//
//var privateKey = fs.readFileSync('privkey.pem');
//var certificate = fs.readFileSync('cert.pem');
//https = require('https');
//
//
//https.createServer({
//    key: privateKey,
//    cert: certificate
//}, app).listen(443);



var bodyParser = require('body-parser');
var aesjs = require('aes-js');
var formidable = require('formidable');
var path = require('path');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('ass'));
app.use(express.static('images'));
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var secret = 'death666';
var mysql = require('mysql');

var redisHost = host;



var con = mysql.createConnection({
    host: mySqlHost,
    user: "user",
    password: "user",
    database: "karplay"
});
con.connect(function (err) {
    if (err)
        throw err;
    console.log("Connected!");
});
var mySqlConnect = function () {
    con.on('error', function (err) {

        if (err.code === 'PROTOCOL_CONNECTION_LOST') {



            console.log("MySQL lost connection. Reconnect...");

            con = mysql.createConnection({
                host: mySqlHost,
                user: "user",
                password: "user",
                database: "karplay"
            });
            con.connect(function (err) {
                if (err)
                    throw err;
                console.log("Connected!");
            });
            mySqlConnect();
        }



    });
};
mySqlConnect();
//con.connect(function (err) {
//    if (err)
//        throw err;
//    console.log("Connected!");
//});
var mailer = require("nodemailer");
var smtpTransport = mailer.createTransport({
    service: "Gmail",
    auth: {
        user: "andsoft80@gmail.com",
        pass: "Professional1"
    }
});



var sessionStore = new MySQLStore({

    clearExpired: true,
    // How frequently expired sessions will be cleared; milliseconds:
    checkExpirationInterval: 20000000,
    // The maximum age of a valid session; milliseconds:
    expiration: 86400000
}/* session store options */, con);

app.use(session({
    key: 'karplay',
    secret: 'death666',
    store: sessionStore,
    resave: false,
    saveUninitialized: false

}));



//var redis = require('redis');
//app.redisClient = redis.createClient('6379', '185.220.35.146');
var kue = require('kue');



var jobs = kue.createQueue({
    redis: {
//        createClientFactory: function(){
//            return app.redisClient;
//        }
        port: 6379,
        host: redisHost



    }
});

function newJob(name) {
    name = name || 'Default_Name';
    var job = jobs.create('new job', {
        name: name
    });

    job
            .on('complete', function () {
                console.log('Job', job.id, 'with name', job.data.name, 'is done');
            })
            .on('failed', function () {
                console.log('Job', job.id, 'with name', job.data.name, 'has failed');
            })

    job.save();
}

//jobs.process('new job', function (job, done) {
//    /* carry out all the job function here */
//    done && done();
//});


//setInterval(function (){
//  newJob('Send_Email');
//}, 3000);


//function newJob() {
//    var job = jobs.create('new_job');
//    job.save();
//}

jobs.on('job enqueue', function (id, type) {
    console.log('Job %s got queued of type %s', id, type);

}).on('job complete', function (id, result) {
    kue.Job.get(id, function (err, job) {
        if (err)
            return;
        job.remove(function (err) {
            if (err)
                throw err;
            console.log('removed completed job #%d', job.id);
        });
    });
});

//setInterval(newJob, 3000);

kue.app.listen(3000);

//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
var reader = null;
var a = null;
var b = null;
var input = null;
var key = null;
var entryArr = [];
var tarr = [];
var marr = [];
var lineArrJson = [];
var Artist = '';
var Title = '';
var res = null;


function getFileBinary(filename) {
    //console.log(process.platform);
    if (process.platform !== 'win32') {
        filename = filename.replace(/\\/g, "/");
    }
    var res = null;
    var data = fs.readFileSync((filename));

    res = (data.toString('binary'));
    console.log('bin.ready');


    return res;

}

function getFileHex(filename) {
    console.log(filename);
    if (process.platform !== 'win32') {
        filename = filename.replace(/\\/g, "/");
    }
    var res = null;
    var data = fs.readFileSync((filename));

    res = (data.toString('hex'));



    return res;
}


function readbytes(offset, input, n) {
    var arr = input.slice(offset, (offset + n));

    return arr;
}
function bufferToHex(buffer) {
    return Array
            .from(new Uint8Array(buffer))
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
}
function hex2a(hexx) {//for hex string
    var hex = hexx.toString();//force conversion
    var hex = hexx;
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}
function hexarr2a(hexx) {//for hex arr

    var hex = hexx;
    var str = '';
    for (var i = 0; (i < hex.length && hex[i] !== '00'); i ++)
        str += String.fromCharCode(parseInt(hex[i], 16));
    return str;
}
function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    var padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
}
function bin2hex(bin)
{

    var i = 0, l = bin.length, chr, hex = '';

    for (i; i < l; ++i)
    {

        chr = bin.charCodeAt(i).toString(16);

        hex += chr.length < 2 ? '0' + chr : chr;

    }

    return hex;

}

function readDWord(arr, offset) {
    var b1 = parseInt(readbytes(offset, arr, 1), 16);
    var b2 = parseInt(readbytes(offset + 1, arr, 1), 16);
    var b3 = parseInt(readbytes(offset + 2, arr, 1), 16);
    var b4 = parseInt(readbytes(offset + 3, arr, 1), 16);

    return b4 << 24 | b3 << 16 | b2 << 8 | b1;
}
function hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}

function uint8ArrToString(arr) {
    var hex = [];
    for (i = 0; i < arr.length; i++) {
        hex.push(decimalToHex(arr[i]));
    }
    return hexarr2a(hex);
}

function uint8ToHexArr(arr) {
    var hex = [];
    for (i = 0; i < arr.length; i++) {
        hex.push(decimalToHex(arr[i]));
    }
    return hex;
}

function hexArrToUint8Arr(hex) {
    var uint8Arr = [];
    for (var i = 0; i < hex.length; i += 2)
    {
        uint8Arr.push(parseInt(hex.substring(i, i + 2), 16));
    }
    return uint8Arr;
}

function hexToUint8Arr(hex) {
    var uint8Arr = [];
    for (var i = 0; i < hex.length; i += 2)
    {
        uint8Arr.push(parseInt(hex.substring(i, i + 2), 16));
    }
    return uint8Arr;
}

function bin2String(array) {
    var result = "";
    for (var i = 0; i < array.length; i++) {
        result += String.fromCharCode(parseInt(array[i], 2));
    }
    return result;
}
function check(playFileName) {
    var a = getFileHex(playFileName);

    //header FLID strval - ключ AES для ///////////////////
    offset = 8;
    tag = '';
    tryc = 0;
    while (tag !== 'ENDH') {
        if (tryc > 20) {

            return false;
        }
        //tag = uint8ArrToString(readbytes(offset, u, 4));
        tag = hex2a(readbytes(offset, a, 8));

        offset = offset + 8;
        type = hexToUint8Arr(readbytes(offset, a, 2))[0];
        offset++;
        offset++;
        strval = '';
        if (type == '2') {

            lenval = hexToUint8Arr(readbytes(offset, a, 8));

            offset = offset + 8;

            strval = hex2a(readbytes(offset, a, lenval[0] * 2));

            if (tag == 'FLID') {
                key = (readbytes(offset, a, lenval[0] * 2));

            }
            offset = offset + lenval[0] * 2;
        } else {
            lenval = (readbytes(offset, a, 8));
            offset = offset + 8;
        }



        //console.log(tag + ' ' + type + ' ' + lenval + ' ' + strval+ ' ' + key);
        tryc++;
    }
    ;
    return true;
}
function prepFile(playFileName) {
    tarr = [];
    marr = [];
    entryArr = [];
//                    var u = new Uint8Array(reader.result);
    a = getFileHex(playFileName);

    var result = hexArrToUint8Arr(a);

//    for (var i = 0; i < a.length; i += 2)
//    {
//        result.push(parseInt(a.substring(i, i + 2), 16));
//    }
    a = [];
    var u = Uint8Array.from(result);
    //var u = Buffer.from(result);
    //var u = res;
    //console.log(u);



    //header FLID strval - ключ AES для ///////////////////
    offset = 4;
    tag = '';
    tryc = 0;
    while (tag !== 'ENDH') {
        if (tryc > 20) {

            return false;
        }
        tag = uint8ArrToString(readbytes(offset, u, 4));
        //console.log(tag);
        offset = offset + 4;
        type = (readbytes(offset, u, 1));
        offset++;
        strval = '';
        if (type == '2') {
            console.log('lenval ');
            lenval = (readbytes(offset, u, 4));

            offset = offset + 4;

            strval = uint8ArrToString(readbytes(offset, u, lenval[0]));

            if (tag == 'FLID') {
                key = (readbytes(offset, u, lenval[0]));

            }
            offset = offset + lenval[0];
        } else {
            lenval = uint8ToHexArr((readbytes(offset, u, 4))).join("");
            offset = offset + 4;
        }



        //console.log(tag + ' ' + type + ' ' + lenval + ' ' + strval);
        tryc++;
    }
    ;

    /////////////////////////////////////////////////

    //extract media/////////////////////////////////////
    type_songtext = 1;
    type_music = 2;
    type_image = 3;
    type_font = 4;
    type_video = 5;




//                    numFilesh = (readbytes(offset, a, 4));
    numFiles = (readbytes(offset, u, 4))[0];
    offset = offset + 4;
    //alert(numFiles);
    for (var k = 0; k < numFiles; k++) {
        fileNameLen = (readbytes(offset, u, 4))[0];
        offset = offset + 4;

        fileName = uint8ArrToString(readbytes(offset, u, fileNameLen));
        offset = offset + fileNameLen;

        //fileTypeh = (readbytes(offset, a, 4));
        fileType = (readbytes(offset, u, 4))[0];
        offset = offset + 4;

        fileSize1h = uint8ToHexArr((readbytes(offset, u, 4)));
        fileSize1 = readDWord(fileSize1h, 0);
        offset = offset + 4;

        fileOffseth = uint8ToHexArr((readbytes(offset, u, 4)));
        fileOffset = readDWord(fileOffseth, 0);
        offset = offset + 4;


        fileSize2h = uint8ToHexArr((readbytes(offset, u, 4)));
        fileSize2 = readDWord(fileSize2h, 0);
        offset = offset + 4;


        fileFlagsh = uint8ToHexArr((readbytes(offset, u, 4)));
        fileFlags = readDWord(fileFlagsh, 0);
        offset = offset + 4;


        entry = {
            type: '',
            filename: '',
            length1: '',
            length2: '',
            offset: '',
            flags: '',
            bindata: ''
        };
        entry.type = fileType;
        entry.filename = fileName;
        entry.length1 = fileSize1;
        entry.length2 = fileSize2;
        entry.offset = fileOffset;
        entry.flags = fileFlags;

        entryArr.push(entry);

        //console.log(JSON.stringify(entryArr));


    }

    for (var p = 0; p < numFiles; p++) {
        entryArr[p].offset = entryArr[p].offset + offset;
    }

    //u = [];

    /////////////////////////////////////////////////////
    //console.log(JSON.stringify(entryArr));



//                    var binaryReader = new FileReader();
//                    binaryReader.readAsBinaryString(input.files[0]);
    var aes = new aesjs.AES(key);
//                    binaryReader.onload = function () {
//                        b = binaryReader.result;
    b = getFileBinary(playFileName);

    for (var n = 0; n < entryArr.length - 1; n++) {
        var bd = b.substring(entryArr[n].offset, entryArr[n].offset + entryArr[n].length1);

        entryArr[n].bindata = bd;
        bd = [];
    }
    ;

    b = [];


    if (entryArr[entryArr.length - 1].flags === 1) {
        bb = (readbytes(entryArr[entryArr.length - 1].offset, u, entryArr[entryArr.length - 1].length2));
        c = entryArr[entryArr.length - 1].length2 / 16;
        cont = new Uint8Array(entryArr[entryArr.length - 1].length2);

        for (var q = 0; q < c; q++) {
            bb16 = bb.slice(q * 16, q * 16 + 16);
            var decryptedBytes = aes.decrypt(bb16);
            cont.set(decryptedBytes, q * 16);
        }

        realcont = cont.slice(0, entryArr[entryArr.length - 1].length1);
    } else {
        realcont = (readbytes(entryArr[entryArr.length - 1].offset, u, entryArr[entryArr.length - 1].length2));
    }
    ;



    Title = '';
    Artist = '';

    res = uint8ArrToString(realcont);
    //console.log(res);

    iniFileTextArr = res.split('\n');
    lineArr = [];
    lineArrJson = [];

    u = [];
    bb = [];
    c = [];
    cont = [];
    res = [];
    realcont = [];
    for (var i = 0; i < iniFileTextArr.length; i++) {

        lineEntry = {
            lineText: '',
            timeSplit: [],
            wordSplit: []
        };


        var str = iniFileTextArr[i];
        str = str.replace(/[\r]*/g, '');

        if (str.indexOf('Title=') === 0 & str[str.length - 1] !== '=') {
            p = str.indexOf('=');
            s = str.substring(p + 1, (str.length - p) * 2);
            Title = decodeURIComponent(escape(s));
            //console.log(Title);
        }


        if (str.indexOf('Artist=') === 0 & str[str.length - 1] !== '=') {
            p = str.indexOf('=');
            s = str.substring(p + 1, 100000);
            Artist = decodeURIComponent(escape(s));
            //console.log(Artist);

        }


        if (str.indexOf('Text') === 0 &
                str.indexOf('TextCount') !== 0 &
                str[str.length - 1] !== '='
                &
                str.substring(str.length - 2, 100000) !== '=\n'
                &
                str.substring(str.length - 2, 100000) !== '=\r'
                )


        {





            p = str.indexOf('=');
            s = str.substring(p + 1, 100000);
            utfstring = decodeURIComponent(escape(s));

            str_etl = utfstring.replace(/ {1,}/g, " ");//готовая для разбивки по пробелам и по слешам
            str_etl = str_etl.replace(/[\r]*/g, '');//готовая для разбивки по пробелам и по слешам
            lineArr.push(str_etl);



            lineEntry.lineText = str_etl.replace(/[/]*/g, '');//убрали слеши - строка для вывода белым
            var ntarr = str_etl.split(' ');
            for (var k = 0; k < ntarr.length; k++) {
                var sw = ntarr[k] + ' ';//возвращаем пробел, чтобы сшивать
                var swarr = sw.split('/');
                for (var j = 0; j < swarr.length; j++) {
                    lineEntry.wordSplit.push(swarr[j]);
                }
            }

            lineArrJson.push(lineEntry);

            //console.log(str_etl);

        }
        if (str.indexOf('Sync') === 0 &
                str[str.length - 1] !== '='
                //&
                //str[str.length - 1] !== '_'
                ) {
            p = str.indexOf('=');
            s = str.substring(p + 1, 10000);
            arr = s.split(',');
            for (var j = 0; j < arr.length; j++) {
                marr.push(arr[j].replace(/[\r]*/g, ''));
            }
        }





    }
    var p = 0;
    for (var r = 0; r < lineArrJson.length; r++) {
        for (var q = 0; q < lineArrJson[r].wordSplit.length; q++) {
            lineArrJson[r].timeSplit.push(marr[p]);
            p++;

        }

    }
    tarr = [];
    marr = [];

    console.log(JSON.stringify(lineArrJson));
    return true;
}




/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////




























app.get("/", function (request, response) {
    fs.readFile("index.html", function (error, data) {
        if (error) {
            console.log(error);
            response.write(JSON.stringify(error));
            response.end();
            return;
        }

        response.write(data);
        response.end();

    });
});

app.post("/transfer", function (req, res) {



    var form = new formidable.IncomingForm();
    form.uploadDir = 'downloads';
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        var oldpath = files.f.path;

        var newpath = 'downloads\\' + files.f.name;
        fs.rename(oldpath, newpath, function (err) {
            if (err)
                throw err;





            res.write(files.f.name);
            res.end();
        });



    });




});

app.get("/list", function (request, response) {
//    fs.readFile("list.json", function (error, data) {
//        if (error) {
//            console.log(error);
//            response.write(JSON.stringify(error));
//            response.end();
//            return;
//        }
//
//        response.write(data);
//        response.end();
//
//    });
    var pl = localStorage.getItem('playList');
    response.write(pl);
    response.end();
});

app.get("/listinit", function (request, response) {

    var json = [];

    var i = 0;

    fs.readdir("downloads", (err, files) => {

        files.forEach(file => {
            if (file.indexOf('.') < 0) {//dir
                var entry = {
                    "text": "",
                    "children": []

                };


                entry.text = file;
                json.push(entry);

                var strarr = fs.readdirSync("downloads/" + file);
                strarr.forEach(file => {
                    var entryCh = {
                        "text": "",
                        "children": [],
                        "icon": "notepic_s.jpg"

                    };
                    if (file.indexOf('.kfn') > 0) {
                        entryCh.text = file;
                        entry.children.push(entryCh);
                    }
                });

            }
            if (file.indexOf('.kfn') > 0) {
                var entry = {
                    "text": "",
                    "children": [],
                    "icon": "notepic_s.jpg"

                };


                entry.text = file;
                json.push(entry);
            }


        });

        response.write(JSON.stringify(json));
        response.end();


    });

});


function reBuildSeq(listjson) {

    for (var i = 0; i < listjson.length; i++) {

        listjson[i].id = i + 1;
    }
    return listjson;
}
app.post("/adduser", function (request, response) {

    var email = request.body.email;
    var name = request.body.name;
    var pwd = request.body.pwd;
    parcel = {};

    var hash = bcrypt.hashSync(pwd, salt);
    var sql = "insert into users (email, name, pwd) values ('" + email + "','" + name + "','" + hash + "')";
    con.query(sql, function (err, result) {
        if (err) {
            parcel.err = err;

        } else {
            parcel.auth = 'ok';
        }

        response.write(JSON.stringify(parcel));
        response.end();
    });


});

app.post("/checkuser", function (request, response) {
    var parcel = {"auth": ""};
    var email = request.body.email;
    var pwd = request.body.pwd;

    var sql = "select * from users where email = '" + email + "'";
    con.query(sql, function (err, result) {
        if (err)
            throw err;

        if (result.length === 0) {
            parcel.auth = 'notusr';
        } else {
            var hash = result[0].pwd;
            if (bcrypt.compareSync(pwd, hash)) {
                parcel.auth = 'ok';
                parcel.name = result[0].name;
                parcel.signature = bcrypt.hashSync(secret + result[0].email, salt);
                request.session.user = result[0].email;
                request.session.name = result[0].name;
            } else {
                parcel.auth = 'notpass';
            }
        }
        response.write(JSON.stringify(parcel));
        response.end();
    });

});

app.post("/recover", function (request, response) {
    var parcel = {};
    var email = request.body.email;
    var newPwd = 'temppass' + Math.floor(Math.random() * 1000);

    var sql = "select * from users where email = '" + email + "'";
    con.query(sql, function (err, result) {
        if (err)
            throw err;

        if (result.length === 0) {
            parcel.auth = 'notusr';
        } else {
            var mail = {
                from: "Karplay(not reply)",
                to: email,
                subject: "Восстановление пароля",
                text: "Ваш новый пароль : " + newPwd,

            };

            smtpTransport.sendMail(mail, function (error, res) {
                if (error) {
                    console.log(error);
                } else {
                    var sql = "update users  set pwd ='" + bcrypt.hashSync(newPwd, salt) + "' where email = '" + email + "'";
                    con.query(sql, function (err, result) {
                        if (err)
                            throw err;
                    });
                }

                smtpTransport.close();
            });

            parcel.auth = 'ok';



        }
        response.write(JSON.stringify(parcel));
        response.end();
    });

});

app.post("/getcoins", function (request, response) {
    var token = request.session.yandexMoneyToken;

    var parcel = {};
    if (typeof token !== 'undefined' & token !== '') {

        var api = new yandexMoney.Wallet(token);

        api.accountInfo(function infoComplete(err, data) {

            if (err) {
                console.log(err);
                parcel.coins = 'Не подключен';
                response.write(JSON.stringify(parcel));
                response.end();
                return;
            }

            parcel.coins = data.balance_details.available;
            response.write(JSON.stringify(parcel));
            response.end();

        });
    } else {
        parcel.coins = 'Не подключен';
        response.write(JSON.stringify(parcel));
        response.end();
    }


});

app.post("/getauth", function (request, response) {
    var parcel = {};
    var curruser = request.session.user;
    if (typeof curruser !== 'undefined') {
        parcel.email = request.session.user;
        parcel.name = request.session.name;
    } else {
        parcel.email = 'empty';
        parcel.name = 'empty';
    }
    response.write(JSON.stringify(parcel));
    response.end();

});

app.post("/buysong", function (request, response) {


    var token = request.session.yandexMoneyToken;

    var parcel = {};

    ////////////////////////////////заглушка
//    parcel.result = 'ok';
//    response.write(JSON.stringify(parcel));
//    response.end();
//    return;
    ///////////////////////////////   
    if (typeof token !== 'undefined' & token !== '') {

        var api = new yandexMoney.Wallet(token);

        api.accountInfo(function infoComplete(err, data) {

            if (err) {

                parcel.result = err;
                response.write(JSON.stringify(parcel));
                response.end();
                return;
            }
            var balance = data.balance_details.available;
            if (balance < song_cost) {
                parcel.result = 'no_money';
                response.write(JSON.stringify(parcel));
                response.end();

            } else {
                var options = {
                    "pattern_id": "p2p",
                    "to": "410018593739203",
                    "amount_due": song_cost,
                    "comment": "Оплата за песню в онлайн караоке",
                    "message": "Оплата за песню в онлайн караоке",
                    "label": "Оплата за песню в онлайн караоке"

                };
                api.requestPayment(options, function requestComplete(err, data) {

                    if (err) {
                        parcel.result = err;
                        response.write(JSON.stringify(parcel));
                        response.end();
                        return;
                    }
                    if (data.status !== "success") {
                        parcel.result = data.status;
                        response.write(JSON.stringify(parcel));
                        response.end();
                        return;
                    }
                    console.log(JSON.stringify(data));
                    var request_id = data.request_id;

                    api.processPayment({
                        "request_id": request_id
                    }, processComplete);
                });

                function processComplete(err, data) {
                    if (err) {
                        parcel.result = err;
                        response.write(JSON.stringify(parcel));
                        response.end();
                        return;
                    }
                    console.log(JSON.stringify(data));
                    parcel.result = 'ok';
                    response.write(JSON.stringify(parcel));
                    response.end();
                }
            }


        });
    } else {
        parcel.result = 'no_yandex';
        response.write(JSON.stringify(parcel));
        response.end();
    }

});

app.post("/logout", function (request, response) {
    if (request.session) {
        request.session.destroy(function () {});
    }
    response.write(JSON.stringify('session destroy'));
    response.end();

});


var clientId = '574F7AEE27BADD0BBE9716DB31930577D11280CF5385937D7CF99A440633FAD2';
var redirectURI = redirectHost + ':' + port + '/oauth';
var clientSecret = '3713CE09AF30D6FD7883AB8D9356CF0CC1E0F5E002B2BAC94CF01A8DFEDDC1E6F2BFE4A9A36493CD978E9E070FEEC40CD34BA3F23CE4868BA68FC2E2B2934197';
var scope = ['account-info', 'operation-history', 'payment.to-account("410018593739203")'];




app.post("/yandex_auth", function (request, response) {

    var url = yandexMoney.Wallet.buildObtainTokenUrl(clientId, redirectURI, scope);
    console.log(url);

//    response.writeHead(301, {
//        'Location': url
//                //add other headers here...
//    });
    response.write(url);
    response.end();




});



app.get("/oauth", function (request, response) {
    var code = request.query.code;

    request_mod.post({
        "url": "https://money.yandex.ru/oauth/token",
        "form": {
            "code": code,
            "client_id": clientId,
            "grant_type": "authorization_code",
            "redirect_uri": redirectURI,
            "client_secret": clientSecret
        }
    }, function (error, res, body) {
        var body_json = JSON.parse(body);


        request.session.yandexMoneyToken = body_json.access_token;
        var api = new yandexMoney.Wallet(body_json.access_token);

        api.accountInfo(function infoComplete(err, data) {
            if (err) {
                // process error
            }
            fs.readFile("index.html", function (error, data) {
                if (error) {
                    console.log(error);
                    response.write(JSON.stringify(error));
                    response.end();
                    return;
                }
                response.redirect('/');
                response.write(data);
                response.end();

            });
        });
    }
    );



});


app.post("/list_add", function (request, response) {
    var listjson = '';
    var id = 1;
    var pl = localStorage.getItem('playList');

    listjson = JSON.parse(pl);
    if (listjson.length > 0) {
        id = listjson[listjson.length - 1].id + 1;
    }

    var entry = {
        "id": "",
        "name": "",
        "artist": ""

    };
    for (var i = 0; i < listjson.length; i++) {
        if (listjson[i].name === request.body.filename) {
            response.write(JSON.stringify(listjson));
            response.end();
            return;
        }
    }

    entry.id = id;
    entry.name = request.body.filename;
    entry.artist = request.body.artist;
    listjson.push(entry);

    localStorage.setItem('playList', JSON.stringify(listjson));

    response.write(JSON.stringify(listjson));
    response.end();


});

app.get("/list_delete/:id", function (request, response) {
    var listjson = '';

    var pl = localStorage.getItem('playList');
    listjson = JSON.parse(pl);
    var i = 0;
    var find = -1;

    for (var i = 0; i < listjson.length; i++) {

        if (listjson[i].id.toString() === request.params.id.toString()) {

            find = i;
            break;
        }
        ;
    }
    ;

    if (find > -1) {
        listjson.splice(find, 1);
        listjson = reBuildSeq(listjson);

    }


    localStorage.setItem('playList', JSON.stringify(listjson));


    response.write(JSON.stringify(listjson));
    response.end();


});

app.get("/list_up/:id", function (request, response) {
    var listjson = '';
    var pl = localStorage.getItem('playList');

    listjson = JSON.parse(pl);
    var i = 0;
    var find = -1;

    for (var i = 0; i < listjson.length; i++) {

        if (listjson[i].id.toString() === request.params.id.toString()) {

            find = i;
            break;
        }
        ;
    }
    ;

    if (find > 0) {
        var tmp = listjson[find];
        listjson[find] = listjson[find - 1];
        listjson[find - 1] = tmp;
        listjson = reBuildSeq(listjson);

    }


    localStorage.setItem('playList', JSON.stringify(listjson));


    response.write(JSON.stringify(listjson));
    response.end();


});
app.get("/list_down/:id", function (request, response) {
    var listjson = '';
    var pl = localStorage.getItem('playList');

    listjson = JSON.parse(pl);
    var i = 0;
    var find = -1;

    for (var i = 0; i < listjson.length; i++) {

        if (listjson[i].id.toString() === request.params.id.toString()) {

            find = i;
            break;
        }
        ;
    }
    ;

    if (find < listjson.length - 1) {
        var tmp = listjson[find];
        listjson[find] = listjson[find + 1];
        listjson[find + 1] = tmp;
        listjson = reBuildSeq(listjson);

    }


    localStorage.setItem('playList', JSON.stringify(listjson));


    response.write(JSON.stringify(listjson));
    response.end();


});

function transferBinFile(filename, response, done) {




    console.log(filename);
    fs.readFile(filename, function (error, data) {
        if (error) {
            console.log(error);
            response.write(JSON.stringify(error));
            response.end();
            return;
        }

        //response.set({'Content-Type': 'application/octet-stream'});

        response.write(data.toString('binary'));
        response.end();
        done();

    });

}

function transferHexFile(filename, response, done) {




    console.log(filename);
    fs.readFile(filename, function (error, data) {
        if (error) {
            console.log(error);
            response.write(JSON.stringify(error));
            response.end();
            return;
        }

        //response.set({'Content-Type': 'application/octet-stream'});

        response.write(data.toString('hex'));
        response.end();
        done();

    });

}
var responses = {};
jobs.process("new_job", function (job, done) {
    console.log('bin');
    var filename = job.data.filename;
    console.log(filename);
    fs.readFile(filename, function (error, data) {
        if (error) {
            console.log(error);
            responses[job.data.res_id].write(JSON.stringify(error));
            responses[job.data.res_id].end();
            return;
        }

        //response.set({'Content-Type': 'application/octet-stream'});

        responses[job.data.res_id].write(data.toString('binary'));
        responses[job.data.res_id].end();
        delete responses[job.data.res_id];
        console.log('Job', job.id, 'is done');
        done && done();

    });

});

jobs.process('new_job_hex', function (job, done) {
    console.log('hex');
    var filename = job.data.filename;
    console.log(filename);
    fs.readFile(filename, function (error, data) {
        if (error) {
            console.log(error);
            responses[job.data.res_id].write(JSON.stringify(error));
            responses[job.data.res_id].end();
            return;
        }

        //response.set({'Content-Type': 'application/octet-stream'});

        responses[job.data.res_id].write(data.toString('hex'));
        responses[job.data.res_id].end();
        delete responses[job.data.res_id];
        console.log('Job', job.id, 'is done');
        done && done();

    });

});

function newJobBin(res, filename) {
    var id = '' + Math.random();

    var job = jobs.create("new_job", {res_id: id, filename: filename});
    job.save();
    responses[id] = res;
}

app.get("/getfilebin/:filename", function (request, response) {
    if (process.platform !== 'win32') {
        filename = request.params.filename.replace(/\\/g, "/");
    } else {
        filename = request.params.filename;
    }

    newJobBin(response, filename);








});

app.get("/getfilehex/:filename", function (request, response) {
    var id = '' + Math.random();
    if (process.platform !== 'win32') {
        filename = request.params.filename.replace(/\\/g, "/");
    } else {
        filename = request.params.filename;
    }
    var job = jobs.create('new_job_hex', {res_id: id, filename: filename});
    job.save();
    responses[id] = response;




});

app.get("/prep/:filename", function (request, response) {

    if (prepFile(request.params.filename)) {
        parcel = {
            "artist": "",
            "title": "",
            "linearrjson": [],
            "entryarr": []


        };
        parcel.artist = Artist;
        parcel.title = Title;
        parcel.linearrjson = lineArrJson;
        entryArrCut = [];
        for (var i = 0; i < entryArr.length; i++) {//оставляем музыку и текст

            if (entryArr[i].type === 1 | entryArr[i].type === 2) {
                entryArrCut.push(entryArr[i]);
            }
        }
        parcel.entryarr = entryArrCut;

        //console.log(parcel.entryarr);

        //response.send((parcel));
        response.write(JSON.stringify(parcel));
        response.end();
        parcel = {};
        entryArr = [];
        entryArrCut = [];
        lineArrJson = [];
    } else {
        response.send({"error": "format"});
        response.end();
    }
});

app.get("/check", function (request, response) {
    var fileList = [];
    fs.readdir("downloads", (err, files) => {

        files.forEach(file => {

            if (file.indexOf('.') < 0) {//dir

                var strarr = fs.readdirSync("downloads/" + file);
                var artist = file;
                strarr.forEach(file => {

                    if (file.indexOf('.kfn') > 0) {
                        if (!check("downloads/" + artist + '/' + file)) {
                            fs.rename("downloads/" + artist + '/' + file, "downloads/" + 'badFormat' + '/' + file, function (err) {});
                            fileList.push("downloads/" + artist + '/' + file);

                        }
                    }
                });

            }
            if (file.indexOf('.kfn') > 0) {
                if (!check("downloads/" + file)) {
                    fs.rename("downloads/" + file, "downloads/" + 'badFormat' + '/' + file, function (err) {});
                    fileList.push("downloads/" + file);

                }
            }


        });



    });

    response.send(JSON.stringify(fileList));
    response.end();

});


app.listen(port);













