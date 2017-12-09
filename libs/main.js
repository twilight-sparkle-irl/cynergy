// asar injector, for applying post-install asar patches
function asarinject(sig, inj) {
    if (sig.length != inj.length) {
        throw 'signature and injection not same size'
    }
    var bdata = new Buffer(fs.readFileSync(app.getAppPath()));
    var index = bdata.indexOf(sig);
    if (index == -1) {
        throw 'patched or already modified';
    }
    bdata.write(inj, index);
    fs.writeFileSync(app.getAppPath(), bdata);
}

try {
    asarinject(
        "\x0A      webPreferences: {\x0A        blinkFeatures: 'EnumerateDevices,AudioOutputDevices'\x0A      }\x0A    };",
        "webPreferences:{blinkFeatures:'EnumerateDevices,AudioOutputDevices',preload:__dirname+'/../p.js'}}; "
    );
    alert('A bootstrap patch has just been applied. Press OK to restart Discord.', 'EndPwn');
    _cyn_restart();
}
catch (e) {
    console.debug('Bootstrap patch 2 has already been applied.')
}

// webcrack, used to search for and modify objects in webpack
// credit to NO_BOOT_DEVICE
webpackJsonp([1e3],{webcrack_ver01_xyzzy:function(n,b,d){mArr=d.m,mCac=d.c,mCar=[],Object.keys(mCac).forEach(function(n){mCar[n]=mCac[n]}),findFunc=function(n){if(results=[],"string"==typeof n)mArr.forEach(function(r,t){-1!==r.toString().indexOf(n)&&results.push(mCac[t])});else{if("function"!=typeof n)throw new TypeError("findFunc can only find via string and function, "+typeof n+" was passed");modArray.forEach(function(r,e){n(r)&&results.push(t.c[e])})}return results},findCache=function(n){if(results=[],"function"==typeof n)mCar.forEach(function(r,t){n(r)&&results.push(r)});else{if("string"!=typeof n)throw new TypeError("findCache can only find via function or string, "+typeof n+" was passed");mCar.forEach(function(r,t){if("object"==typeof r.exports)for(p in r.exports)if(p==n&&results.push(r),"default"==p&&"object"==typeof r.exports["default"])for(p in r.exports["default"])p==n&&results.push(r)})}return results},window.wc={get:d,modArr:mArr,modCache:mCac,modCArr:mCar,findFunc:findFunc,findCache:findCache}}});webpackJsonp([1e3],"",["webcrack_ver01_xyzzy"]);

// some epapi shorthand methods, moved here because early accessibility
window.$listen = function (e, c) {
    return document.addEventListener(e, c);
}
window.$dispatch = function (e) {
    return document.dispatchEvent(e);
}

// beautifuldiscord, used to load css styles
// credit to leovoel
bdwatcher=null,bdtag=null,setupCSS=function(n){var e=fs.readFileSync(n,"utf-8");null===bdtag&&(bdtag=document.createElement("style"),document.head.appendChild(bdtag)),bdtag.innerHTML=e,null===bdwatcher&&(bdwatcher=fs.watch(n,{encoding:"utf-8"},function(e,w){if("change"===e){var i=fs.readFileSync(n,"utf-8");bdtag.innerHTML=i}}))};

// SELF_XSS warning disable (quant)
var results=wc.findFunc("SELF_XSS_HEADER");wc.get(results[results.length-1].i).consoleWarning=function(e){};

// load epapi.js
window._epapi = require(_cyn_data + "/cynergy/epapi");

// start the api
$api.go();
// blend the linq.js methods into the array prototype for implicit Enumerable.from()
if (!typeof (Enumerable) == 'undefined')
    for (var k in Enumerable.prototype)
        if (!Array.prototype.hasOwnProperty(k))
            eval('Array.prototype.' + k + '=function(){return Enumerable.prototype.' + k + '.apply(Enumerable.from(this),arguments)}');
// load autoexec.js
try { require(_cyn_data + "/autoexec") } catch (e) { console.warn("Your autoexec.js file appears to have an error:\n\n" + e) };

// welcome message
console.log('%cCynergy', 'font-size: 72px; line-height: 72px; background: linear-gradient(to right, orange , yellow, green, cyan, blue, violet); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log(`Cynergy (EndPwn v2) API v${_epapi.ver} | v${_cynergy_ver} loaded.\nAesthetics and maintence by Cynthia\nUpdater and WEBAPP_ENDPOINT override concept by quant\nwebcrack.js, ASAR injection concept, and general help from NO_BOOT_DEVICE\nExperiments menu enabler code by zatherz\nBeautifulDiscord by leovoel`);