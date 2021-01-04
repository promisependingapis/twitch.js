/* eslint-disable no-undef */
// https://stackoverflow.com/questions/1484506/random-color-generator
function getRandomColor() {
    var letters = '789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 9)];
    }
    return color;
}

var addChannel = () => {};
var removeChannel = () => {};

var socket = io();

var ConnectedsChannels = [];
var SelectedChannels = '';
var Messages = [];

var DOM = {
    Status: document.getElementsByClassName('StatusValue')[0],
    StatusColor: document.getElementsByClassName('ColorIndicator')[0],
    ChatResizeBox: document.getElementById('IntegratedChatResizeClick'),
    ChatBoxMessages: document.getElementById('IntegratedChatMessages'),
    ChatBoxSend: document.getElementById('IntegratedChatSendMessages'),
    ChatBox: document.getElementsByClassName('IntegratedChat')[0],
    ChatTextInput: document.getElementsByClassName('IntegratedChatTextInput')[0],
    CurrentSelectedChannel: document.getElementsByClassName('CurrentSelectedChannel')[0],
    SelectedChannel: document.getElementsByClassName('SelectedChannel')[0],
    ConnectedChannels: document.getElementsByClassName('ConnectedChannels')[0],
    TopBar: document.getElementsByClassName('TopBar')[0],
    TypedMessageToSend: document.getElementById('message'),
    Main: document.getElementsByClassName('Main')[0],
    ChannelsDropBox: document.getElementsByClassName('ChannelsDropBox')[0],
    IntegratedChat: document.getElementsByClassName('IntegratedChat')[0],
    ChannelsDropBoxHandler: document.getElementsByClassName('ChannelsDropBoxHandler')[0],
    addChannel: document.getElementsByClassName('addChannel')[0],
};

function ChannelsConfigDropBoxOpen() {
    DOM.ChannelsDropBox.onclick = ChannelsConfigDropBoxClose;
    DOM.ChannelsDropBox.innerText = '△ ' + SelectedChannels;
    DOM.ChannelsDropBoxHandler.style.display = 'flex';
    DOM.ChannelsDropBoxHandler.style.opacity = 100;
}

function ChannelsConfigDropBoxClose() {
    DOM.ChannelsDropBox.onclick = ChannelsConfigDropBoxOpen;
    DOM.ChannelsDropBox.innerText = '▽ ' + SelectedChannels;
    setTimeout(() => {
        DOM.ChannelsDropBoxHandler.style.opacity = 0;
    }, 100);
    setTimeout(() => {
        DOM.ChannelsDropBoxHandler.style.display = 'none';
    }, 500);
}

DOM.ChannelsDropBox.onclick = ChannelsConfigDropBoxOpen;
DOM.ChannelsDropBox.addEventListener('focusout', ChannelsConfigDropBoxClose);

function UpdateChannels() {
    if (!SelectedChannels || SelectedChannels === '' || !ConnectedsChannels.includes(SelectedChannels)) {
        SelectedChannels = ConnectedsChannels[0];
    }
    DOM.CurrentSelectedChannel.innerText = '▽ ' + SelectedChannels;
    DOM.ChannelsDropBox.innerText = '▽ ' + SelectedChannels;
    [...DOM.ConnectedChannels.children].forEach(() => {
        DOM.ConnectedChannels.innerHTML = '';
        DOM.ChannelsDropBoxHandler.innerHTML = '<button class="addChannel" onclick="addChannel(prompt(&quot;Name of channel&quot;))">+</button>';
    });
    ConnectedsChannels.forEach((element) => {
        if (element === '') {return;}
        var channel = document.createElement('button');
        channel.textContent = element;
        channel.onclick = () => {
            SelectedChannels = element;
            DOM.CurrentSelectedChannel.innerText = '▽ ' + SelectedChannels;
            DOM.ChannelsDropBox.innerText = '▽ ' + SelectedChannels;
            loadMessages();
        };
        var alreadyExists = false;
        if ([...DOM.ConnectedChannels.children].length > 0) {
            [...DOM.ConnectedChannels.children].forEach((child) => {
                if (child.textContent === element) {
                    alreadyExists = true;
                }
            });
            if (alreadyExists) {return;}
            DOM.ConnectedChannels.appendChild(channel);
            RemoveChannelButton = '<button onclick=\'removeChannel("' + element + '");\'>X</button>';
            // eslint-disable-next-line max-len
            channelS = '<span onclick=\'SelectedChannels = "' + element + '";DOM.CurrentSelectedChannel.innerText = "▽ " + "' + SelectedChannels + '";DOM.ChannelsDropBox.innerText = "▽ " + "' + SelectedChannels + '";UpdateChannels();\'>' + element + RemoveChannelButton + '</span>';
            DOM.ChannelsDropBoxHandler.innerHTML += channelS;
        } else {
            DOM.ConnectedChannels.appendChild(channel);
            RemoveChannelButton = '<button onclick=\'removeChannel("' + element + '");\'>X</button>';
            // eslint-disable-next-line max-len
            channelS = '<span onclick=\'SelectedChannels = "' + element + '";DOM.CurrentSelectedChannel.innerText = "▽ " + "' + SelectedChannels + '";DOM.ChannelsDropBox.innerText = "▽ " + "' + SelectedChannels + '";UpdateChannels();\'>' + element + RemoveChannelButton + '</span>';
            DOM.ChannelsDropBoxHandler.innerHTML += channelS;
        }
        loadMessages();
    });
}

function loadMessages() {
    DOM.ChatBoxMessages.innerHTML = '';
    Messages.forEach((Message, index) => {
        if (Message.channel.name.split('#').join('') !== SelectedChannels) {return;}
        if (DOM.ChatBoxMessages.childElementCount > 0) {
            var LineBreak = document.createElement('br');
            DOM.ChatBoxMessages.appendChild(LineBreak);
        }
        var DupMsg = false;
        if (Message.author.self) {
            Messages.forEach((verifyer, indexV) => {
                if (verifyer.author.self === true && indexV !== index) {
                    if (verifyer.content === Message.content && verifyer.Actual !== true) {DupMsg = true;}
                }
            });
        }
        if (DupMsg === true) {return;}
        if ((Message.author.self === true && Message.content.startsWith('/me')) || (Message.content.startsWith('\u0001ACTION'))) {
            var MessageContentBackup = Message.content;
            if (Message.content.startsWith('\u0001ACTION')) {
                Message.content = Message.content.slice(7);
            } else {
                Message.content = Message.content.slice(4);
            }
            // eslint-disable-next-line max-len
            DOM.ChatBoxMessages.innerHTML += '<span class=\'MessageContent\' style=\'color: ' + Message.author.color + '\'><span class=\'AuthorName\' style=\'color: ' + Message.author.color + '\'>' + Message.author.displayName + '</span> ' + Message.content + '</span>';
            Messages[index].content = MessageContentBackup; 
        } else {
            // eslint-disable-next-line max-len
            DOM.ChatBoxMessages.innerHTML += '<span class=\'MessageContent\'><span class=\'AuthorName\' style=\'color: ' + Message.author.color + '\'>' + Message.author.displayName + '</span>: ' + Message.content + '</span>';
        }
        DOM.ChatBoxMessages.scrollTop = DOM.ChatBoxMessages.scrollHeight;
    });
}

function openSelectChannel() {
    DOM.SelectedChannel.style.display = 'block';
    DOM.SelectedChannel.style.opacity = 100;
    DOM.CurrentSelectedChannel.onclick = closeSelectChannel;
    DOM.CurrentSelectedChannel.innerText = '△ ' + SelectedChannels;
    DOM.ChannelsDropBox.innerText = '▽ ' + SelectedChannels;
}

function closeSelectChannel() {
    DOM.CurrentSelectedChannel.onclick = openSelectChannel;
    DOM.CurrentSelectedChannel.innerText = '▽ ' + SelectedChannels;
    DOM.ChannelsDropBox.innerText = '▽ ' + SelectedChannels;
    setTimeout(()=>{
        DOM.SelectedChannel.style.opacity = 0;
    }, 100);
    setTimeout(()=>{
        DOM.SelectedChannel.style.display = 'none';
    }, 500);
}

DOM.CurrentSelectedChannel.onclick = openSelectChannel;
DOM.CurrentSelectedChannel.addEventListener('focusout', closeSelectChannel);

DOM.ChatTextInput.onsubmit = (e) => {
    e.preventDefault(); 
};

function Resizer() {
    DOM.ChatBoxMessages.style.height = window.innerHeight - ((15 / 100) * window.innerWidth) + 'px';
    DOM.Main.style.height = window.innerHeight - ((5 / 100) * window.innerWidth) + 'px';
    if (Number(DOM.ChatBoxMessages.style.width.slice(0,DOM.ChatBoxMessages.style.width.length - 2)) > 0) {
        // eslint-disable-next-line max-len
        DOM.Main.style.width = ((window.innerWidth - Number(DOM.ChatBoxMessages.style.width.slice(0,DOM.ChatBoxMessages.style.width.length - 2))) + 'px').toString();
    }
    // eslint-disable-next-line max-len
    if (Number(DOM.IntegratedChat.style.width.slice(0,DOM.IntegratedChat.style.width.length - 2)) >= window.innerWidth || Number(DOM.IntegratedChat.style.width.slice(0,DOM.IntegratedChat.style.width.length - 2)) + Number(DOM.Main.style.width.slice(0,DOM.Main.style.width.length - 2))) {
        DOM.Main.style.width = '';
        DOM.IntegratedChat.style.width = '';
        DOM.TopBar.style.width = '';
    }
}

Resizer();
window.onresize = Resizer;

function ChatResizeBoxMouseHandler(event) {
    DOM.ChatBox.style.width = (window.innerWidth - event.x).toString() + 'px';
    DOM.TopBar.style.width = (window.innerWidth - event.x).toString() + 'px';
    DOM.ChatBoxMessages.style.width = (window.innerWidth - (event.x + 15)).toString() + 'px';
    DOM.Main.style.width = (event.x).toString() + 'px';
}

DOM.ChatResizeBox.addEventListener('mousedown', function() {
    document.addEventListener('mousemove', ChatResizeBoxMouseHandler);
});
document.addEventListener('mouseup', function() {
    document.removeEventListener('mousemove', ChatResizeBoxMouseHandler);
});

socket.on('connect', () => {
    socket.emit('Load');
    socket.on('StatusUpdate', (Data) => {
        Data = JSON.parse(Data);
        DOM.Status.innerText = Data.Text;
        DOM.StatusColor.style.backgroundColor = Data.Color;
    });
    socket.on('TwitchChatMessage', (Data) => {
        var MessageDuplicated = false;
        Messages.forEach((element) => {
            if (element.author.id === Data.author.id && Data.author.self === false) {
                MessageDuplicated = true;
            }
        });
        if (MessageDuplicated) {return;}
        if (SelectedChannels === '') {return;}
        if (!Data.author) {return;}
        if (Data.author.color === true) {
            Messages.forEach((element) => {
                if (element.author.id === Data.author.id) {
                    Data.author.color = element.author.color;
                }
            });
            if (Data.author.color === true) {
                Data.author.color = getRandomColor();
            }
        }
        Messages.push(Data);
        loadMessages();
    });
    socket.on('ChatChannels', (Data) => {
        if (typeof Data === 'string') {
            Data = JSON.parse(Data);
        }
        Data.forEach((element) => {
            if (!ConnectedsChannels.includes(element.name)) {
                ConnectedsChannels.push(element.name.split('#').join(''));
            }
        });
        UpdateChannels();
    });
    DOM.ChatTextInput.onsubmit = (e) => {
        e.preventDefault();
        UpdateChannels();
        if (DOM.TypedMessageToSend.value.replaceAll(/\s/g,'') === '' || SelectedChannels === '' || !SelectedChannels) {
            DOM.TypedMessageToSend.value = '';
            DOM.TypedMessageToSend.style.backgroundColor = '#FF3333';
            setTimeout(() => {
                DOM.TypedMessageToSend.style.marginLeft = '-1vw';
            }, 150);
            setTimeout(() => {
                DOM.TypedMessageToSend.style.marginLeft = '1vw';
            }, 300);
            setTimeout(() => {
                DOM.TypedMessageToSend.style.marginLeft = '-1vw';
            }, 450);
            setTimeout(() => {
                DOM.TypedMessageToSend.style.marginLeft = '1vw';
            }, 600);
            setTimeout(() => {
                DOM.TypedMessageToSend.style.marginLeft = '0vw';
                DOM.TypedMessageToSend.style.backgroundColor = '';
                if (SelectedChannels === '' || SelectedChannels === undefined) {
                    alert('Not connected to any channel, select one using the arrows on top bar of chat, or the property channels of bot configs');
                }
            }, 750);
            return;
        }
        socket.emit('SendMessage', {selectedChannel: SelectedChannels, content: DOM.TypedMessageToSend.value});
        DOM.TypedMessageToSend.value = '';
        DOM.TypedMessageToSend.style.backgroundColor = '#997799';
        setTimeout(() => {
            DOM.TypedMessageToSend.style.backgroundColor = '';
        }, 100);
    };
    addChannel = (ChannelName) => {
        if (ChannelName === null || ChannelName === undefined) {return;}
        if (ChannelName.replaceAll(/\s/g,'') === '') {
            addChannel(prompt('Insert a valid twitch channel name:'));
        } else {
            socket.emit('ConnectToChannel', {channelName: ChannelName});
        }
        UpdateChannels();
    };
    // eslint-disable-next-line no-unused-vars
    removeChannel = (ChannelName) => {
        socket.emit('LeaveOfChannel', {channelName: ChannelName});
    };
    socket.on('ConnectToChannelResponse', (Data) => {
        Data = JSON.parse(Data);
        if (Data.error) {ConnectedsChannels = [];socket.emit('Load');alert(JSON.parse(Data.error));}
        if (Data.name && !ConnectedsChannels.includes(Data.name)) {
            ConnectedsChannels.push(Data.name);
            UpdateChannels();
        }
    });
    socket.on('LeaveOfChannelResponse', (Data) => {
        Data = JSON.parse(Data);
        if (Data.name) {
            ConnectedsChannels[ConnectedsChannels.findIndex(Channel => Channel === Data.name)] = '';
            UpdateChannels();
        }
    });
});