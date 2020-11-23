<img src="https://media.discordapp.net/attachments/773922086188089374/774016163909992448/TwitchJS.png?width=879&height=475">
<p>
  <a href="https://discord.gg/26KFSUbVFe"><img src="https://img.shields.io/discord/773920681246851083?color=7289da&logo=discord&logoColor=FFFF55"/></a>
  <a href="https://www.npmjs.com/package/@twitchapis/twitchjs"><img src="https://img.shields.io/npm/v/@twitchapis/twitchjs.svg?maxAge=3600"/></a>
  <a href="https://www.npmjs.com/package/@twitchapis/twitchjs"><img src="https://img.shields.io/npm/dt/@twitchapis/twitchjs.svg?maxAge=3600"/></a>
  <a href="https://github.com/twitchapis/TwitchJS"><img src="https://github.com/twitchapis/TwitchJS/workflows/Testing/badge.svg"/></a>
  <a href="https://github.com/twitchapis/TwitchJS"><img src="https://img.shields.io/david/twitchapis/twitchJs.svg?maxAge=3600"/></a>
</p>
<img src="https://nodei.co/npm/@twitchapis/twitchjs.png?downloads=true&stars=true">

## Summary

- [TODO](#todo)
- [About](#about)
- [Installing](#installing)
  - [npm](#npm)
  - [yarn](#yarn)
- [Example Usage](#example-usage)
- [contributors](#contributors)

## TODO

- [X] Beauty logger. (**DON'T TOUCH HIM**)
- [X] Stabilize a websocket connection with Twitchᵀⱽ.
- [X] Create easy functions to interact with Twitchᵀⱽ.
- [ ] Create onReady event.
- [ ] Create all easy interact functions to Twitchᵀⱽ.
- [ ] Create event dispatchers to the actions.

## About

Twitchʲˢ is a [unnoficial] powerful [Node.js](https://nodejs.org) module that allows you to easily interact with the
[Twitchᵀⱽ](https://twitch.tv) making easy the way to make a Twitchᵀⱽ bot, for a custom chat overlay for you [OBS](https://obsproject.com/), or a moderation bot for you chat, or you just want a easy interface to Twitchᵀⱽ.

- Object-oriented
- Predictable abstractions
- Performant

## installing

**Node.js 12.0.0 or newer is required.**  
`Ignore any warnings about unmet peer dependencies, as they're all optional.`

#### npm: 
```bat
npm i @twitchapis/twitchjs
```  
#### yarn: 
```bat
yarn add @twitchapis/twitchjs
```  

## example-usage

```javascript
  const Twitch = require('@twitchapis/twitchjs');

  const Client = new Twitch.Client({
      autoLogEnd: false,
      channels: ['space_interprise', 'lobometalurgico'],
      debug: true
  });

  Client.on('message', msg => {
      if (msg.toString().toLowerCase().includes('hello')) {
          msg.reply('World');
      }
      if (msg.toString().toLowerCase() === 'leave space_interprise channel') {
        msg.channel.send('Ok, goodbye ;-;')
        Client.leave('space_interprise');
      }
  });

  Client.login('MyFabolousBotUserName', 'MyFabolousBotToken🤫').then(() => {
      Twitch.logger.info('YAY, i am connected with twitch!');
  });
```

## contributors

- [Lobo Metalurgico](https://github.com/LoboMetalurgico)
- [Space_Interprise](https://github.com/emanuelfranklyn)
