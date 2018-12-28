var express = require("express");
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var aesjs = require('aes-js');
var formidable = require('formidable');
var path = require('path');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('assets'));
app.use(express.static('images'));
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

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
    res = null;
    var data = fs.readFileSync(path.normalize(filename));

    res = (data.toString('binary'));



    return res;
    return res;
}

function getFileHex(filename) {

    res = null;
    var data = fs.readFileSync(path.normalize(filename));

    res = (data.toString('hex'));



    return res;
}


function readbytes(offset, input, n) {
    arr = input.slice(offset, (offset + n));

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
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

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
    b1 = parseInt(readbytes(offset, arr, 1), 16);
    b2 = parseInt(readbytes(offset + 1, arr, 1), 16);
    b3 = parseInt(readbytes(offset + 2, arr, 1), 16);
    b4 = parseInt(readbytes(offset + 3, arr, 1), 16);

    return b4 << 24 | b3 << 16 | b2 << 8 | b1;
}
function hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}

function uint8ArrToString(arr) {
    hex = [];
    for (i = 0; i < arr.length; i++) {
        hex.push(decimalToHex(arr[i]));
    }
    return hexarr2a(hex);
}

function uint8ToHexArr(arr) {
    hex = [];
    for (i = 0; i < arr.length; i++) {
        hex.push(decimalToHex(arr[i]));
    }
    return hex;
}

function bin2String(array) {
    var result = "";
    for (var i = 0; i < array.length; i++) {
        result += String.fromCharCode(parseInt(array[i], 2));
    }
    return result;
}

function prepFile(playFileName) {
    tarr = [];
    marr = [];
    entryArr = [];
//                    var u = new Uint8Array(reader.result);
    a = getFileHex(playFileName);

    var result = [];

    for (var i = 0; i < a.length; i += 2)
    {
        result.push(parseInt(a.substring(i, i + 2), 16));
    }
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



        console.log(tag + ' ' + type + ' ' + lenval + ' ' + strval);
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

    }
    ;



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
    console.log(res);

    iniFileTextArr = res.split('\n');
    lineArr = [];
    lineArrJson = [];


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
            console.log(Title);
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

            console.log(str_etl);

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
    ////timing split

    for (var i = 0; i < lineArr.length; i++) {
        var str = lineArr[i];
        var arr = str.split(' ').join('/').split('/');
        for (var j = 0; j < arr.length; j++) {
            tarr.push(arr[j]);
        }
        tarr[tarr.length - 1] = tarr[tarr.length - 1] + '\n';

    }



    var p = 0;
    for (var r = 0; r < lineArrJson.length; r++) {
        for (var q = 0; q < lineArrJson[r].wordSplit.length; q++) {
            lineArrJson[r].timeSplit.push(marr[p]);
            p++;

        }

    }



    console.log(tarr);
    console.log(marr);
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

    json = [];

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

app.get("/getfilebin/:filename", function (request, response) {
    fs.readFile(request.params.filename, function (error, data) {
        if (error) {
            console.log(error);
            response.write(JSON.stringify(error));
            response.end();
            return;
        }

        //response.set({'Content-Type': 'application/octet-stream'});

        response.write(data.toString('binary'));
        response.end();

    });
});

app.get("/getfilehex/:filename", function (request, response) {
    fs.readFile(request.params.filename, function (error, data) {
        if (error) {
            console.log(error);
            response.write(JSON.stringify(error));
            response.end();
            return;
        }

        //response.set({'Content-Type': 'application/octet-stream'});

        response.write(data.toString('hex'));
        response.end();

    });
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
        parcel.entryarr = entryArr;
        response.send((parcel));
        response.end();
    } else {
        response.send({"error": "format"});
        response.end();
    }
});

app.listen(80);













