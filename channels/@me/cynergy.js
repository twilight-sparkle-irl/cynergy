/*
 * ==== CYNERGY ====
 * Copyright (c) 2017 Cynthia Foxwell
 *
 * This software is provided as is without waranty.
 * I, Cynthia Foxwell, am not responsible for ANY
 * damage done caused by this software, you are at
 * fault for running any unsolicited code via this
 * software. Use at your own risk.
 *
 * ==== CREDITS ====
 * justquant - EndPwn, the basis of this framework
 * leovoel - BeautifulDiscord CSS injection
 * Memework(tm) - Discord datamining
 */

let cyn_ver = 3;

let electron = require("electron").remote;
let remote = electron;
let __fs = require("fs");
let _fs = require("original-fs");

let _win = electron.getCurrentWindow();

var cacheclear = function () {
    _win.webContents.session.clearCache(function(){});
}

var cleanup = function () {
    let dir = approot().split('app.asar')[0].replace(/\\/g,"/");
    document.head = document.createElement('head');
    document.body = document.createElement('body');
	require("electron").remote.getCurrentWindow().loadURL(`https://${(dir.toLowerCase().indexOf("discordcanary") > -1 && "canary.") || (dir.toLowerCase().indexOf("discordptb") > -1 && "ptb.") || ""}discordapp.com/channels/@me`);
}

var _discord_branch = approot().split('app.asar')[0].replace(/\\/g,"/");

var setup = function () {
    cacheclear();
    logging = document.getElementById('logger');

    var a = navigator.appVersion;
    var v = a.substring(a.indexOf('discord/')).split('/')[1].split(' ')[0];
	logging.innerText += "\n";
	setTimeout(function () {
		if (typeof(_cynergy_ver) == "undefined")
		{
            logging.innerText += "Cynergy is not installed\n";
            logging.innerText += "Injecting dom-ready listener into app.asar\n";
            try {
                if(dir.toLowerCase().indexOf("discordcanary") > -1 || dir.toLowerCase().indexOf("discorddevelopment") > -1){
                    new_injector();
                }else{
                    asarpwn();
                }
            } catch (e) {
                if(dir.toLowerCase().indexOf("discordcanary") > -1 || dir.toLowerCase().indexOf("discorddevelopment") > -1){
                    logging.innerText += "New injector failed.\n";
                    logging.innerText += `${e}\n`;
                }else{
                    logging.innerText += 'ASARPwn failed.\nIf you are on Linux, try running';
                    logging.innerText += ` chmod -R 777 ${approot().split('app.asar')[0]}`;
                    logging.innerText += ".\nIf that doesn't help, or you are not on Linux, type cleanup() in the console.\n";
                }
                return;
            }
		}
        else {
            if (_cynergy_ver == cyn_ver) {
                logging.innerText += "Cynergy is up to date, continuing to Discord\n";
                cleanup();
                return;
            }
        }

		logging.innerText += "Injecting WEBAPP_ENDPOINT override into settings.json\n";
		try
        {
            endpoint_setup();
        }
        catch(e)
        {
            logging.innerText += "Endpoint injection failed, continuing...\n";
        }

        logging.innerText += "Dropping files...\n";
        dropfiles();
		logging.innerText += "Restarting Discord in 10 seconds...\n";
		setTimeout(crash, 10000);
	}, 1000);
}

var endpoint_setup = function () {
	var settings = JSON.parse(_fs.readFileSync(settingsjson(), "UTF8"));
	settings.WEBAPP_ENDPOINT="https://cynergy.cynfoxwell.cf";
	_fs.writeFileSync(settingsjson(), JSON.stringify(settings));
};

var endpoint_restore = function () {
	var settings = JSON.parse(_fs.readFileSync(settingsjson(), "UTF8"));
	settings.WEBAPP_ENDPOINT=null;
	_fs.writeFileSync(settingsjson(), JSON.stringify(settings));
};

var new_injector = function () {
    //Until they remove this listener, we'll be replacing it for now, later we'll readd it.
    let dirlisting = _fs.readdirSync(data());
    let latestver = dirlisting.filter(d=>d.contains("0.0."));
    let mainScreen = _fs.readFileSync(`${data()}/${latestver[latestver.length-1]}/modules/discord_desktop_core/app/mainScreen.js`);

    mainScreen = mainScreen.replace("  // TODO: why do we listen to this?\n  mainWindow.webContents.on('dom-ready', function () {});","  // Thank you for using Cynergy c:\n  mainWindow.webContents.on('dom-ready', function () {require('${data().replace(/\\/g,"/") + '/cynergy/i.js'}').x(mainWindow)});");

    _fs.writeFileSync(`${data()}/${latestver[latestver.length-1]}/modules/discord_desktop_core/app/mainScreen.js`,mainScreen);
}

var asarpwn = function() {
    var bdata = new Buffer(_fs.readFileSync(remote.app.getAppPath()));
    bdata.write(`mainWindow.webContents.on('dom-ready', function () {require('${data().replace(/\\/g,"/") + 'cynergy/i.js'}').x(mainWindow)});//`, bdata.indexOf("mainWindow.webContents.on('dom-ready', function () {});\x0A\x0A    // Prevent navigation whe"));
    _fs.writeFileSync(remote.app.getAppPath(), bdata);
};

var asarunpwn = function() {
    logging = document.getElementById('logger');
    logging.innerText += "\nUndoing asarpwn...\n";
    var bdata = new Buffer(_fs.readFileSync(remote.app.getAppPath()));
    try{
        bdata.write("mainWindow.webContents.on('dom-ready', function () {});\x0A\x0A    // Prevent navigation whe", bdata.indexOf(`mainWindow.webContents.on('dom-ready', function () {require('${data() + '/cynergy/i.js'}').x(mainWindow)});//`));
    }catch(e){}
    try{
        bdata.write("mainWindow.webContents.on('dom-ready', function () {});\x0A\x0A    // Prevent navigation whe", bdata.indexOf(`mainWindow.webContents.on('dom-ready', function () {require('${data().replace(/\\/g,"/") + '/cynergy/i.js'}').x(mainWindow)});//`));
    }catch(e){}
    _fs.writeFileSync(remote.app.getAppPath(), bdata);
}

var data = function () {
    return remote.app.getPath('userData') + "/";
}

var approot = function () {
    return asar() + "/../";
}

var settingsjson = function () {
    return data() + 'settings.json';
}

var asar = function () {
    return remote.app.getAppPath();
}

var dropfiles = function () {
    if (!_fs.existsSync(data() + '/cynergy')){
        _fs.mkdirSync(data() + '/cynergy');
    }
    if (!_fs.existsSync(data() + '/cynergy/styles')){
        _fs.mkdirSync(data() + '/cynergy/styles');
    }
    if (!_fs.existsSync(data() + '/cynergy/plugins')){
        _fs.mkdirSync(data() + '/cynergy/plugins');
    }
    if (!_fs.existsSync(data() + '/cynergy/lib')){
        _fs.mkdirSync(data() + '/cynergy/lib');
    }

    var license = 'BeautifulDiscord\n\nThe MIT License (MIT)\n\nCopyright (c) 2016 leovoel\n\nPermission is hereby granted, free of charge, to any person obtaining a\ncopy of this software and associated documentation files (the "Software"),\nto deal in the Software without restriction, including without limitation\nthe rights to use, copy, modify, merge, publish, distribute, sublicense,\nand/or sell copies of the Software, and to permit persons to whom the\nSoftware is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in\nall copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS\nOR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING\nFROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER\nDEALINGS IN THE SOFTWARE.';

    //   blob of bullshit for i.js start
    // imports/helper definitions
    var ec = `var fs=require("original-fs");var el=require("electron").remote;var win=el.getCurrentWindow();var app=el.app;var _cyn_data="${data().replace(/\\/g,"/")+"cynergy/"}";`;
    // restart function
    var rs = 'var _cyn_restart=function(){app.relaunch();app.quit()}';
    // cache clear function
    var cc = 'var _cyn_clean=function(){el.getCurrentWindow().webContents.session.clearCache(function(){})}';
    // continue to discord function
    var ct = 'var _cyn_continue=function(){win.loadURL("https://canary.discordapp.com/channels/@me")}';
    // bootstrap
    var pl = `var fs=require("original-fs");exports.x=function(win){win.webContents.executeJavaScript('${ec}var _cynergy_ver=${cyn_ver};${rs};${cc};${ct};if(window.location.hostname.includes("discordapp.com")){require(_cyn_data + "/main")}');}`;
    //   end i.js cyst

    _fs.writeFileSync(data() + '/cynergy/i.js', pl);
    _fs.writeFileSync(data() + '/cynergy/p.js', '// todo');

    try
    {
        _fs.readFileSync(data() + '/cynergy/autoexec.js');
    }
    catch(e)
    {
        _fs.writeFileSync(data() + '/cynergy/autoexec.js', 'setupCSS(_cyn_data + "/styles/style.css");\nconsole.log("Hello, world!");');
    }
    /*try
    {
        _fs.readFileSync(data() + 'style.css');
    }
    catch(e)
    {
        var client = new XMLHttpRequest();
        client.open('GET', 'http://apo.wds.us/default.css');
        client.onreadystatechange = function() {
            _fs.writeFileSync(data() + 'style.css', client.responseText);
        }
        client.send();
    }*/
    var eclient = new XMLHttpRequest();
    eclient.open('GET', 'https://cynergy.cynfoxwell.cf/libs/epapi.js');
    eclient.onreadystatechange = function() {
        if (eclient.readyState === 4) {
            _fs.writeFileSync(data() + '/cynergy/epapi.js', eclient.responseText);
        }
    }
    eclient.send();
    var mclient = new XMLHttpRequest();
    mclient.open('GET', 'https://cynergy.cynfoxwell.cf/libs/main.js');
    mclient.onreadystatechange = function() {
        _fs.writeFileSync(data() + '/cynergy/main.js', mclient.responseText);
    }
    mclient.send();
    var lclient = new XMLHttpRequest();
    lclient.open('GET', 'https://cynergy.cynfoxwell.cf/libs/linq.js');
    lclient.onreadystatechange = function() {
        _fs.writeFileSync(data() + '/cynergy/lib/linq.js', lclient.responseText);
    }
    lclient.send();
    _fs.writeFileSync(data() + '/cynergy/legal.txt', license);
    _fs.writeFileSync(data() + '/cynergy/styles/style.css', "/* custom css here */");
}

var crash = function () {
    remote.app.relaunch();
	remote.app.quit();
};