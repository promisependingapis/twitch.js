[<img src="https://cdn.discordapp.com/attachments/780245027212492812/780245250382757930/TwitchJS.png">]()

<p>
  <a href="https://discord.gg/26KFSUbVFe"><img src="https://img.shields.io/discord/773920681246851083?color=7289da&logo=discord&logoColor=FFFFFF"/></a>
  <a href="https://www.npmjs.com/package/@twitchapis/twitch.js"><img src="https://img.shields.io/npm/v/@twitchapis/twitch.js.svg?maxAge=3600"/></a>
  <a href="https://www.npmjs.com/package/@twitchapis/twitch.js"><img src="https://img.shields.io/npm/dt/@twitchapis/twitch.js.svg?maxAge=3600"/></a>
  <a href="https://github.com/twitchapis/twitch.js"><img src="https://github.com/twitchapis/twitch.js/workflows/Testing/badge.svg"/></a>
  <a href="https://github.com/twitchapis/twitch.js"><img src="https://img.shields.io/david/twitchapis/twitch.js.svg?maxAge=3600"/></a>
</p>

[<img src="https://media.discordapp.net/attachments/780245027212492812/785968486018318356/Novo_Projeto6.png?width=1440&height=480" align='right' width='300'/>](https://discord.gg/26KFSUbVFe) [<span><br/><img src="https://nodei.co/npm/@twitchapis/twitch.js.png?downloads=true&stars=true" align='left'/></span>](https://www.npmjs.com/package/@twitchapis/twitch.js)

<br/>
<br/>

## Summary

- [TODO](#todo)
- [About](#about)
- [Installing](#installing)
  - [npm](#npm)
  - [yarn](#yarn)
- [Example Usage](#example-usage)
  - [Expected Result](#expected-result)
- [Contributors](#contributors)
- [Authors](#authors)

## TODO

- [x] Beauty logger. (**DON'T TOUCH HIM**)
- [x] Stabilize a websocket connection with Twitchᵀⱽ.
- [x] Create easy functions to interact with Twitchᵀⱽ.
- [x] Create onReady event.
- [x] Create onLeave event.
- [x] Create onJoin event.
- [ ] Create onUserJoin event. (Emitted everytime someone new enter in the chat)
- [ ] Create onUserLeave event. (Emitted everytime someone leaves the chat)
- [ ] Create event dispatchers to the actions.
- [ ] Create all easy interact functions to Twitchᵀⱽ.
- [ ] Create Shard system.
- [ ] Implement other types of connections with twitch (To alloy the bot to make things like follow someone, get stream details, ...)

## About

Twitchʲˢ is a [unnoficial] powerful [Node.js](https://nodejs.org) module that allows you to easily interact with the
[Twitchᵀⱽ](https://twitch.tv) making easy the way to make a Twitchᵀⱽ bot, for a custom chat overlay for you [OBS](https://obsproject.com/), or a moderation bot for you chat, or you just want a easy interface to Twitchᵀⱽ.

- Object-oriented
- Predictable abstractions
- Performant

## Installing

**Node.js 12.0.0 or newer is required.**

#### npm:

```bat
npm i @twitchapis/twitch.js
```

#### yarn:

```bat
yarn add @twitchapis/twitch.js
```

## Example Usage

```javascript
const Twitch = require('@twitchapis/twitch.js');

const Client = new Twitch.Client({
  autoLogEnd: true,
  channels: ['space_interprise', 'lobometalurgico'],
  debug: true,
});

Client.on('message', (msg) => {
  if (msg.toString().toLowerCase().includes('hello')) {
    msg.reply('World');
  }
  if (msg.toString().toLowerCase() === 'leave space_interprise channel') {
    msg.channel.send('Ok, goodbye ;-;');
    Client.leave('space_interprise');
  }
});

Client.login('MyFabolousBotUserName', 'MyFabolousBotToken🤫').then(() => {
  Twitch.logger.info('YAY, i am connected with twitch!');
});
```

### Expected Result

<img src='https://media.discordapp.net/attachments/780245027212492812/785949988056203284/unknown.png'></img>

## Contributors

| [<img src="https://avatars0.githubusercontent.com/u/10421864?s=120&v=4" witdh=115><br><sub>VietnameZe</sub>](https://github.com/VietnameZe) |
| :-----------------------------------------------------------------------------------------------------------------------------------------: |

## Authors

| [<img src="https://avatars3.githubusercontent.com/u/43734867?s=460&u=4c7c28e1c72445f234f37ca2cf8b000133fdfd24&v=4" width=115><br><sub>Lobo Metalurgico</sub>](https://github.com/LoboMetalurgico) | [<img src="https://avatars1.githubusercontent.com/u/44732812?s=460&u=37014703e35379861b0abbd585d035304e1e061d&v=4" width=115><br><sub>Space_Interprise</sub>](https://github.com/emanuelfranklyn) |
| :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
