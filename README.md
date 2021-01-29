[<img src="https://media.discordapp.net/attachments/780245027212492812/804814808649433088/TwitchJSBanner.png">]()

<p>
  <a href="https://twitchapis.org/discord"><img src="https://img.shields.io/discord/773920681246851083?style=for-the-badge&color=7289da&logo=discord&logoColor=FFFFFF"/></a>
  <a href="https://www.npmjs.com/package/@twitchapis/twitch.js"><img src="https://img.shields.io/npm/v/@twitchapis/twitch.js.svg?style=for-the-badge&maxAge=3600"/></a>
  <a href="https://www.npmjs.com/package/@twitchapis/twitch.js"><img src="https://img.shields.io/npm/dt/@twitchapis/twitch.js.svg?style=for-the-badge&maxAge=3600"/></a>
  <a href="https://github.com/twitchapis/twitch.js/graphs/contributors"><img src="https://img.shields.io/github/contributors/twitchapis/twitch.js.svg?style=for-the-badge"/></a>
  <a href="https://github.com/twitchapis/twitch.js/blob/main/LICENSE"><img src="https://img.shields.io/github/license/twitchapis/twitch.js.svg?style=for-the-badge"/></a>
</p>

[<img src="https://media.discordapp.net/attachments/780245027212492812/785968486018318356/Novo_Projeto6.png?width=1440&height=480" align='right' width='300'/>](https://twitchapis.org/discord) [<span><br/><img src="https://nodei.co/npm/@twitchapis/twitch.js.png?downloads=true&stars=true" align='left'/></span>](https://www.npmjs.com/package/@twitchapis/twitch.js)

<br/>
<br/>
<br/>
<br/>

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about">About The Project</a>
    </li>
    <li>
      <a href="#installing">Getting Started</a>
      <ul>
        <li><a href="#npm">NPM Installation</a></li>
        <li><a href="#yarn">YARN Installation</a></li>
      </ul>
    </li>
    <li><a href="#example-usage">Usage</a></li>
    <li><a href="#contributors">Contributors</a></li>
    <li><a href="#authors">Authors</a></li>
  </ol>
</details>

## TODO

- [x] Make a auto updated list of users of channels
- [x] | Create automatizated tests.
- [x] | Disconnect IRC function.
- [x] | Make reply uses new thread system of twitch. (beta ⚙️)
- [x] | FanMode (Anonymous mode).
- [x] | Remove global variables.
- [x] | Convert  api/functions/chatters.js into class
- [x] | Convert  api/twitchWebAPI.js into class
- [x] | Reduce generateUser method size
- [x] | Organize annotations. (not sure enough ⚙️)
- [x] | Transform logger in class
- [ ] | Create onUserJoin event. (Emitted everytime someone new enter in the chat)
- [ ] | Create onUserLeave event. (Emitted everytime someone leaves the chat)
- [ ] | Create Shard system.
- [ ] | Implement other http methods (To make things like follow, get stream details, ...)
- [ ] | Split SleeptMethods because it is too much dirty
- [ ] | [Create own parser](#create-own-parser)
#### Create own parser
- [ ] | Plan the new object structure
- [ ] | Code the new parser
- [ ] | Replace old parser code

## About

Twitchʲˢ is a [unnoficial] powerful [Node.js](https://nodejs.org) module based on [Discord.js](https://github.com/discordjs/discord.js) that allows you to easily interact with the
[Twitchᵀⱽ](https://twitch.tv) making easy the way to make a Twitchᵀⱽ bot, for a custom chat overlay for you [OBS](https://obsproject.com/), or a moderation bot for you chat, or you just want a easy interface to Twitchᵀⱽ.

-   Object-oriented
-   Predictable abstractions
-   Performant

## Installing

**Node.js 12.0.0 or newer is required.**

-   npm:

```bat
npm i @twitchapis/twitch.js
```

-   yarn:

```bat
yarn add @twitchapis/twitch.js
```

## Example Usage

```javascript
const { Client, logger } = require('@twitchapis/twitch.js');

const client = new Client({
    autoLogEnd: true, // Default true, optional parameter
    channels: ['space_interprise', 'lobometalurgico'],
    debug: false, // Default false, optional parameter
});

client.on('ready', () => {
    logger.info(`Logged in as ${client.user.name}!`);
});

client.on('message', (msg) => {
    if (msg.content === 'ping') {
        msg.channel.send('pong');
    }
});

client.login('token');
```

## Contributors

| [<img src="https://avatars3.githubusercontent.com/u/10421864?s=120&v=4" witdh="115"><br><sub>Huy Nguyen</sub>](https://github.com/foxviet) | [<img src="https://avatars3.githubusercontent.com/u/54549066?s=120&v=4" witdh="115"><br><sub>Aadarsh</sub>](https://github.com/Itsaadarsh) | [<img src="https://avatars3.githubusercontent.com/u/14365254?s=120&v=4" witdh="115"><br><sub>Nathan Ferreira</sub>](https://github.com/nathan130200) |
| :-------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------: |

## Authors

| [<img src="https://avatars3.githubusercontent.com/u/43734867?s=120&u=4c7c28e1c72445f234f37ca2cf8b000133fdfd24&v=4" width=115><br><sub>Lobo Metalurgico</sub>](https://github.com/LoboMetalurgico) | [<img src="https://avatars3.githubusercontent.com/u/44732812?s=120&u=37014703e35379861b0abbd585d035304e1e061d&v=4" width=115><br><sub>Space_Interprise</sub>](https://github.com/emanuelfranklyn) |
| :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
