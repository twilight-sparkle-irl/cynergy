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

let cyn_ver = 1;

let electron = require("electron").remote;
let remote = electron;
let _fs = require("fs");
let fs = require("original-fs");

let win = electron.getCurrentWindow();

var cacheclear = function () {
    win.webContents.session.clearCache(function(){});
}

var cleanup = function () {
	win.loadURL('https://canary.discordapp.com/channels/@me');
}

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
            try
            {
                asarpwn();
            }
            catch(e)
            {
                logging.style.color = 'red';
                logging.innerText += 'ASARPwn failed. If you are on Linux, try running';
                logging.innerText += ` chmod -R 777 ${approot().split('app.asar')[0]}`;
                logging.innerText += ". If that doesn't help, or you are not on Linux, type cleanup() in the console and PM me: quant#0010\n";
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

        logging.innerText += "Attempting asar extraction...\n";
        try{
            asarpwn();
        }catch(e){
            logging.style.color = 'red';
            logging.innerText += 'ASARPwn failed. If you are on Linux, try running';
            logging.innerText += ` chmod -R 777 ${approot().split('app.asar')[0]}`;
            logging.innerText += ". If that doesn't help, or you are not on Linux, type cleanup() in the console and PM me: Cynthia#0501\n";
            return;
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
	var settings = JSON.parse(fs.readFileSync(settingsjson(), "UTF8"));
	settings.WEBAPP_ENDPOINT="https://cynfoxwell.cf/cynergy";
	fs.writeFileSync(settingsjson(), JSON.stringify(settings));
};

var endpoint_restore = function () {
	var settings = JSON.parse(fs.readFileSync(settingsjson(), "UTF8"));
	settings.WEBAPP_ENDPOINT=null;
	fs.writeFileSync(settingsjson(), JSON.stringify(settings));
};

var asarpwn = function () {
	if (!fs.existsSync(approot().split('app.asar')[0] + '/../cynergy')){
        fs.mkdirSync(approot().split('app.asar')[0] + '/../cynergy');
    }
    if (!fs.existsSync(approot().split('app.asar')[0] + '/../cynergy/lib')){
        fs.mkdirSync(approot().split('app.asar')[0] + '/../cynergy/lib');
    }
    if (!fs.existsSync(approot().split('app.asar')[0] + '/../cynergy/lib/asar')){
        fs.mkdirSync(approot().split('app.asar')[0] + '/../cynergy/lib/asar');
    }

    var asar1 = new XMLHttpRequest();
    asar1.open('GET', 'https://rawgit.com/electron/asar/master/lib/asar.js');
    asar1.onreadystatechange = function() {
        fs.writeFileSync(approot().split('app.asar')[0] + '/../cynergy/libs/asar/asar.js', asar1.responseText);
    }
    asar1.send();

    var asar2 = new XMLHttpRequest();
    asar2.open('GET', 'https://rawgit.com/electron/asar/master/lib/crawlfs.js');
    asar2.onreadystatechange = function() {
        fs.writeFileSync(approot().split('app.asar')[0] + '/../cynergy/libs/asar/crawlfs.js', asar2.responseText);
    }
    asar2.send();

    var asar3 = new XMLHttpRequest();
    asar3.open('GET', 'https://rawgit.com/electron/asar/master/lib/disk.js');
    asar3.onreadystatechange = function() {
        fs.writeFileSync(approot().split('app.asar')[0] + '/../cynergy/libs/asar/disk.js', asar3.responseText);
    }
    asar3.send();

    var asar4 = new XMLHttpRequest();
    asar4.open('GET', 'https://rawgit.com/electron/asar/master/lib/filesystem.js');
    asar4.onreadystatechange = function() {
        fs.writeFileSync(approot().split('app.asar')[0] + '/../cynergy/libs/asar/filesystem.js', asar4.responseText);
    }
    asar4.send();

    var asar5 = new XMLHttpRequest();
    asar5.open('GET', 'https://rawgit.com/electron/asar/master/lib/snapshot.js');
    asar5.onreadystatechange = function() {
        fs.writeFileSync(approot().split('app.asar')[0] + '/../cynergy/libs/asar/snapshot.js', asar5.responseText);
    }
    asar5.send();

    let asar = require(approot().split('app.asar')[0] + '/../cynergy/libs/asar/asar.js');
    try{
        asar.extractAll(approot().split('app.asar')[0]+"/app.asar",approot().split('app.asar')[0] + '/app');
        _fs.renameSync(approot().split('app.asar')[0]+"/app.asar",approot().split('app.asar')[0]+"/original_app.asar");
    }catch(e){
        console.error("asar extraction failed: "+e);
    }
};

var asarunpwn = function () {
    _fs.rmdirSync(approot().split('original_app.asar')[0],approot().split('original_app.asar')[0] + '/../app');
    _fs.renameSync(approot().split('original_app.asar')[0]+"/original_app.asar",approot().split('app.asar')[0]+"/app.asar");
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
    if (!fs.existsSync(approot().split('app.asar')[0] + '/../cynergy')){
        fs.mkdirSync(approot().split('app.asar')[0] + '/../cynergy');
    }
    if (!fs.existsSync(approot().split('app.asar')[0] + '/../cynergy/styles')){
        fs.mkdirSync(approot().split('app.asar')[0] + '/../cynergy/styles');
    }
    if (!fs.existsSync(approot().split('app.asar')[0] + '/../cynergy/plugins')){
        fs.mkdirSync(approot().split('app.asar')[0] + '/../cynergy/plugins');
    }
    if (!fs.existsSync(approot().split('app.asar')[0] + '/../cynergy/lib')){
        fs.mkdirSync(approot().split('app.asar')[0] + '/../cynergy/lib');
    }

    var license = 'BeautifulDiscord\n\nThe MIT License (MIT)\n\nCopyright (c) 2016 leovoel\n\nPermission is hereby granted, free of charge, to any person obtaining a\ncopy of this software and associated documentation files (the "Software"),\nto deal in the Software without restriction, including without limitation\nthe rights to use, copy, modify, merge, publish, distribute, sublicense,\nand/or sell copies of the Software, and to permit persons to whom the\nSoftware is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in\nall copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS\nOR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING\nFROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER\nDEALINGS IN THE SOFTWARE.';

    //   blob of bullshit for i.js start
    // imports/helper definitions
    var ec = 'var fs=require("original-fs");var el=require("electron").remote;var win=el.getCurrentWindow();var app=el.app;var _cyn_data=approot().split("app.asar")[0] + "\\";';
    // restart function
    var rs = 'var _cyn_restart=function(){app.relaunch();app.quit()}';
    // cache clear function
    var cc = 'var _cyn_clean=function(){el.getCurrentWindow().webContents.session.clearCache(function(){})}';
    // continue to discord function
    var ct = 'var _cyn_continue=function(){win.loadURL("https://canary.discordapp.com/channels/@me")}';
    // bootstrap
    var pl = `var fs=require('fs');exports.x=function(win){win.webContents.executeJavaScript('${ec}var _cynergy_ver=${cyn_ver};${rs};${cc};${ct};if(window.location.hostname.includes("discordapp.com")){require(_cyn_data + "/main")}');}`;
    //   end i.js cyst

    fs.writeFileSync(approot().split('app.asar')[0] + '/../cynergy/i.js', pl);
    fs.writeFileSync(approot().split('app.asar')[0] + '/../cynergy/p.js', '// todo');

    try
    {
        fs.readFileSync(approot().split('app.asar')[0] + '/../cynergy/autoexec.js');
    }
    catch(e)
    {
        fs.writeFileSync(approot().split('app.asar')[0] + '/../cynergy/autoexec.js', 'setupCSS(_cyn_data + "/cynergy/styles/style.css");\nconsole.log("Hello, world!");');
    }
    /*try
    {
        fs.readFileSync(data() + 'style.css');
    }
    catch(e)
    {
        var client = new XMLHttpRequest();
        client.open('GET', 'http://apo.wds.us/default.css');
        client.onreadystatechange = function() {
            fs.writeFileSync(data() + 'style.css', client.responseText);
        }
        client.send();
    }
    var eclient = new XMLHttpRequest();
    eclient.open('GET', 'https://cynfoxwell.cf/cynergy/libs/epapi.js');
    eclient.onreadystatechange = function() {
        if (eclient.readyState === 4) {
            fs.writeFileSync(approot().split('app.asar')[0] + 'cynergy/epapi.js', eclient.responseText);
        }
    }
    eclient.send();
    var mclient = new XMLHttpRequest();
    mclient.open('GET', 'https://cynfoxwell.cf/cynergy/libs/main.js');
    mclient.onreadystatechange = function() {
        fs.writeFileSync(approot().split('app.asar')[0] + 'cynergy/main.js', mclient.responseText);
    }
    mclient.send();
    var gclient = new XMLHttpRequest();
    gclient.open('GET', 'http://apo.wds.us/plugins/guild_scrollbar.js');
    gclient.onreadystatechange = function() {
        fs.writeFileSync(approot().split('app.asar')[0] + 'cynergy/plugins/guild_scrollbar.js', gclient.responseText);
    }
    gclient.send();
    var lclient = new XMLHttpRequest();
    lclient.open('GET', 'https://cynfoxwell.cf/cynergy/libs/linq.js');
    lclient.onreadystatechange = function() {
        fs.writeFileSync(approot().split('app.asar')[0] + 'cynergy/lib/linq.js', lclient.responseText);
    }
    lclient.send();*/
    fs.writeFileSync(approot().split('app.asar')[0] + 'cynergy/legal.txt', license);
    fs.writeFileSync(approot().split('app.asar')[0] + 'cynergy/styles/style.css', "/* custom css here */");
}

var crash = function () {
    remote.app.relaunch();
	remote.app.quit();
};