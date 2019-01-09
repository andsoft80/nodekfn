/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
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
                console.log(process.platform);
                if (process.platform !== 'win32') {
                    filename = filename.replace(/\\/g, "/");
                }
                var res = null;
                var data = fs.readFileSync((filename));

                res = (data.toString('hex'));
                console.log('hex.ready');


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
            function hexStr2HexArr(hex){
                var hexArr = [];
                for (var i = 0; i < hex.length; i += 2){
                    hexArr.push(hex.substring(i, i + 2));
                }
                return hexArr;
            }

            function prepFile(playFileName) {
                tarr = [];
                marr = [];
                entryArr = [];
//                    var u = new Uint8Array(reader.result);
                a = getFileHex(playFileName);
                b = getFileBinary(playFileName);
                //var result = hexToUint8Arr(a);

//    for (var i = 0; i < a.length; i += 2)
//    {
//        result.push(parseInt(a.substring(i, i + 2), 16));
//    }
                //a = [];
                //var u = Uint8Array.from(result);
                //var u = Buffer.from(result);
                //var u = res;
                //console.log(u);



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
                    console.log(tag);
                    offset = offset + 8;
                    type = hexToUint8Arr(readbytes(offset, a, 2))[0];
                    offset++;
                    offset++;
                    strval = '';
                    if (type == '2') {
                        console.log('lenval ');
                        lenval = hexToUint8Arr(readbytes(offset, a, 8));

                        offset = offset + 8;

                        strval = hex2a(readbytes(offset, a, lenval[0]*2));

                        if (tag == 'FLID') {
                            key = (readbytes(offset, a, lenval[0]*2));

                        }
                        offset = offset + lenval[0]*2;
                    } else {
                        lenval = (readbytes(offset, a, 8));
                        offset = offset + 8;
                    }



                    //console.log(tag + ' ' + type + ' ' + lenval + ' ' + strval+ ' ' + key);
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
                numFiles = hexToUint8Arr(readbytes(offset, a, 8))[0];
                offset = offset + 8;
                //alert(numFiles);
                
                for (var k = 0; k < numFiles; k++) {
                    fileNameLen = hexToUint8Arr(readbytes(offset, a, 8))[0];
                    offset = offset + 8;

                    fileName = hex2a(readbytes(offset, a, fileNameLen*2));
                    offset = offset + fileNameLen*2;
                    

                    //fileTypeh = (readbytes(offset, a, 4));
                    fileType = hexToUint8Arr(readbytes(offset, a, 8))[0];
                    offset = offset + 8;
                    
                    
                    //offset = offset/2;

                    fileSize1h = hexStr2HexArr((readbytes(offset, a, 8)));
                    fileSize1 = readDWord(fileSize1h, 0);
                    offset = offset + 8;

                    fileOffseth = hexStr2HexArr((readbytes(offset, a, 8)));
                    fileOffset = readDWord(fileOffseth, 0);
                    offset = offset + 8;


                    fileSize2h = hexStr2HexArr((readbytes(offset, a, 8)));
                    fileSize2 = readDWord(fileSize2h, 0);
                    offset = offset + 8;


                    fileFlagsh = hexStr2HexArr((readbytes(offset, a, 8)));
                    fileFlags = readDWord(fileFlagsh, 0);
                    offset = offset + 8;


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
                    entryArr[p].offset = entryArr[p].offset + offset/2;
                }

                //u = [];

                /////////////////////////////////////////////////////
                //console.log(JSON.stringify(entryArr));



//                    var binaryReader = new FileReader();
//                    binaryReader.readAsBinaryString(input.files[0]);
                var aes = new aesjs.AES(hexToUint8Arr(key));
//                    binaryReader.onload = function () {
//                        b = binaryReader.result;
                

                for (var n = 0; n < entryArr.length - 1; n++) {
                    var bd = b.substring(entryArr[n].offset, entryArr[n].offset + entryArr[n].length1);

                    entryArr[n].bindata = bd;
                    bd = [];
                }
                ;

                b = [];


                if (entryArr[entryArr.length - 1].flags === 1) {
                    bb = hexToUint8Arr(readbytes(entryArr[entryArr.length - 1].offset*2, a, entryArr[entryArr.length - 1].length2*2));
                    c = entryArr[entryArr.length - 1].length2 / 16;
                    cont = new Uint8Array(entryArr[entryArr.length - 1].length2);

                    for (var q = 0; q < c; q++) {
                        bb16 = bb.slice(q * 16, q * 16 + 16);
                        var decryptedBytes = aes.decrypt(bb16);
                        cont.set(decryptedBytes, q * 16);
                    }

                    realcont = cont.slice(0, entryArr[entryArr.length - 1].length1);
                } else {
                    realcont = hexToUint8Arr(readbytes(entryArr[entryArr.length - 1].offset*2, a, entryArr[entryArr.length - 1].length2*2));
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




///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////