/*
    ENDPWN API

    if you are reading this, salutations! i dont know why you'd want to use any code from this garbage,
    but this shit is licensed under the WTFPL:

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                        Version 2, December 2004

     Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>

     Everyone is permitted to copy and distribute verbatim or modified
     copies of this license document, and changing it is allowed as long
     as the name is changed.

                DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
       TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

      0. You just DO WHAT THE FUCK YOU WANT TO.
*/

// Extension methods and shit ig
window.$ = function (s) {
    return document.querySelector(s)
}

window.$$ = function (s) {
    return document.querySelectorAll(s)
}

window.$_ = function (e,c,t,i) {
    var elm = document.createElement(e);
    if (typeof(c) != 'undefined')
    {
        elm.className = c;
		if (typeof(t) != 'undefined')
        {
			elm.innerText = t;
			if (typeof(i) != 'undefined')
			{
				elm.id = i;
			}
        }
    }
	return elm;
}

window.$purge = function (e) {
	e.innerHTML = '';
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
}

Array.prototype.contains = function (s) {
    return this.indexOf(s) != -1;
}

Date.fromSnowflake = (id) => new Date((id / 4194304) + 1420070400000);

// Some internal APIs we use
var internal = {}
var ui = {}
var event = {}

// Base
exports.ver = 4;
exports.xyzzy = 'Nothing happened.';

exports.go = function () {
    try {
        if ($(".guilds-wrapper .guilds").children.length > 0) {
            internal = {
                dispatcher: wc.findFunc('dirtyDispatch')[0].exports,
                evnt: wc.findFunc('MESSAGE_CREATE')[1].exports,
                rmsg: wc.findFunc('receiveMessage')[0].exports,
                cmsg: wc.findFunc('createMessage')[1].exports,
                notf: wc.findFunc('NOTIFICATION_CREATE')[1].exports,
                hguild: wc.findFunc('leaveGuild')[0].exports,
                lguild: wc.findFunc('markGuildAsRead')[0].exports
            };

            // UI
            ui = {
                getCurrentChannel: function () {
                    var p = window.location.pathname.split('/');
                    return p[p.length - 1];
                },

                getCurrentGuild: function () {
                    var p = window.location.pathname.split('/');
                    return p[p.length - 2];
                },

                fakeMsg: function (t, f) {
                    var msg = internal.cmsg.createMessage(this.getCurrentChannel(), t);
                    msg.author.avatar = '/08671efa6ceec0fd40b5856bd2ea1f3b'
                    msg.author.bot = true;
                    msg.author.discriminator = '1337';
                    msg.author.id = '152172984373608449';
                    msg.author.username = 'Cynergy';
                    msg.state = 'SENT';
                    msg.webhook_id = '152172984373608449';
                    if (typeof (f) != 'undefined') {
                        f(msg);
                    }
                    internal.rmsg.receiveMessage(this.getCurrentChannel(), msg);
                },

                hideChannels: function () {
                    $('.channels-wrap').style.display = 'none';
                },

                showChannels: function () {
                    $('.channels-wrap').style.display = '';
                },

                hideServers: function () {
                    $('.guilds-wrapper').style.display = 'none';
                },

                showServers: function () {
                    $('.guilds-wrapper').style.display = '';
                },

                hideToolbar: function () {
                    $('.topic').style.display = 'none';
                    $('.header-toolbar').style.display = 'none';
                },

                showToolbar: function () {
                    $('.topic').style.display = '';
                    $('.header-toolbar').style.display = '';
                },

                toggleUsers: function () {
                    wc.findFunc('toggleSection')[1].exports.TOGGLE_USERS.action()
                }
            }

            // Events
            event = {
                discordNativeEvent: function (e) {
                    return new CustomEvent('ep-native', { detail: e });
                },
                onReady: function () {
                    return new Event('ep-ready');
                },
                onChannelChange: function (e) {
                    return new CustomEvent('ep-onchannelchange', { detail: e.detail });
                },
                onMessage: function (e) {
                    return new CustomEvent('ep-onmessage', { detail: e.detail });
                },
                onChannelMessage: function (e) {
                    return new CustomEvent('ep-onchannelmessage', { detail: e.detail });
                }
            }

            $listen('ep-native', (e) => {
                switch (e.detail.type) {
                    case 'MESSAGE_CREATE':
                        $dispatch(event.onMessage(e));
                        break;
                    case 'CHANNEL_SELECT':
                        $dispatch(event.onChannelChange(e));
                        break;
                }
            });

            $listen('ep-onmessage', function (e) {
                if (e.detail.channel_id == $chan()) {
		            $dispatch(event.onChannelMessage(e));
	            }
            });

            internal.dispatcher.default.register(function (e) {
                $dispatch(event.discordNativeEvent(e));
            })

            // Shorthand shit
            window.$chan = ui.getCurrentChannel;
            window.$guild = ui.getCurrentGuild;

            // Exports
            exports.internal = internal;
            exports.settings = settings;
            exports.ui = ui;
            exports.event = event;

            /===/

            if (fs.existsSync(_cyn_data + '/lib')) {
                fs.readdirSync(_cyn_data + '/lib').forEach(function (x) {
                    try {
                        var lib = require(_cyn_data + '/lib/' + x);
                        global['_lib' + lib.name] = lib;
                    }
                    catch (e) {
                        console.warn(x + ' contains errors.\n\n' + e);
                    }
                });
            }
            fs.readdirSync(_cyn_data + '/plugins').forEach(function (x) {
                try {
                    require(_cyn_data + '/plugins/' + x).start();
                }
                catch (e) {
                    console.warn(x + ' contains errors.\n\n' + e);
                }
            });

            setTimeout(function () {
                $dispatch(event.onReady());
            }, 500);

            // This method should never be run again
            exports.go = undefined;
        }
        else {
            setTimeout(exports.go, 100);
        }
    }
    catch (e) {
        setTimeout(exports.go, 100);
    }
}

let appdata = el.app.getAppPath().replace(/\\/g,"/");

var settings = {
    get: function (k) {
        return JSON.parse(fs.readFileSync(appdata + '/settings.json', 'utf8'))[k];
    },
    set: function (k, v) {
        var o = JSON.parse(fs.readFileSync(appdata + '/settings.json', 'utf8'));
        o[k] = v;
        fs.writeFileSync(_cyn_data + '/settings.json', JSON.stringify(o, null, 2));
        return v;
    }
}

// Discord is a bunch of assholes so they removed the localStorage object
// This means we have to do retarded shit like manually search for and extract the token from the SQLite database
// If we had access to some sort of SQLite lib, we could do this in a much more elegant way, but this works so who cares
function token() {
	return fs.readFileSync(appdata + "/Local Storage/https_discordapp.com_0.localstorage", 'utf8')
		.match(/M\0(?:(?!\.)[--z]\0){23}\.\0(?:(?!\.)[--z]\0){6}\.\0(?:(?!\.)[--z]\0){27}|m\0f\0a\0\.\0(?:(?!\.)[--z]\0){84}/)[0]
		.replaceAll('\0', '');
}

// REST
exports.discord = {
    rest: function (m, e, p, c) {
        if (typeof (c) == "undefined") {
            c = function () { };
        }
        var xhr = new XMLHttpRequest();
        var url = "https://discordapp.com/api/v6" + e;
        xhr.open(m, url, true);
        xhr.setRequestHeader("Authorization", token());
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status.toString().startsWith('4')) {
                    throw (xhr.responseText);
                }
                if (xhr.status.toString().startsWith('5')) {
                    throw (xhr.responseText);
                }
                c(xhr.responseText);
            }
        };
        var data = p;
        xhr.send(data);
    },

    sendMessage: function (channel, text) {
        this.rest('POST', `/channels/${channel}/messages`, JSON.stringify({ content: text }));
    },

    sendEmbed: function (channel, ebd) {
        this.rest('POST', `/channels/${channel}/messages`, JSON.stringify(
            {
                embed: ebd
            }
        ));
    },

    getGuild: function (id, c) {
        this.rest('GET', `/guilds/${id}`, '', function (e) { c(JSON.parse(e)) })
    },

    getChannel: function (id, c) {
        this.rest('GET', '/channels/' + id, '', function (e) { c(JSON.parse(e)) })
    },

    getUser: function (id, c) {
        this.rest('GET', '/users/' + id, '', function (e) { c(JSON.parse(e)) })
    },

    getGuildRoles: function (id, c) {
        this.rest('GET', `/guilds/${id}/roles`, '', function (e) { c(JSON.parse(e)) })
    },

    getGuildChannels: function (id, c) {
        this.rest('GET', `/guilds/${id}/channels`, '', function (e) { c(JSON.parse(e)) })
    },

    getGuildUser: function (id, uid, c) {
        this.rest('GET', `/guilds/${id}/members/${uid}`, '', function (e) { c(JSON.parse(e)) })
    },

    getGuildUsers: function (id, c) {
        this.rest('GET', `/guilds/${id}/members?limit=1000`, '', function (e) { c(JSON.parse(e)) })
    }
}

window.$api = exports;
