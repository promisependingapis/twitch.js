<p>
  <img src="https://img.shields.io/discord/773920681246851083?style=for-the-badge&color=7289da&logo=discord&logoColor=FFFFFF"/>
  <a href="https://www.npmjs.com/package/@twitchapis/twitch.js"><img src="https://img.shields.io/npm/v/@twitchapis/twitch.js.svg?style=for-the-badge&maxAge=3600"/></a>
  <a href="https://www.npmjs.com/package/@twitchapis/twitch.js"><img src="https://img.shields.io/npm/dt/@twitchapis/twitch.js.svg?style=for-the-badge&maxAge=3600"/></a>
  <a href="https://github.com/twitchapis/twitch.js/graphs/contributors"><img src="https://img.shields.io/github/contributors/twitchapis/twitch.js.svg?style=for-the-badge"/></a>
  <a href="https://github.com/twitchapis/twitch.js/blob/main/LICENSE"><img src="https://img.shields.io/github/license/twitchapis/twitch.js.svg?style=for-the-badge"/></a>
</p>

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

## About

Twitchʲˢ is a <b>[UNNOFICIAL]</b> api to interact with Twitch IRC.

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
const { Client } = require('@twitchapis/twitch.js');

const client = new Client({
    channels: ['space_interprise', 'lobometalurgico'],
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.name}!`);
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
