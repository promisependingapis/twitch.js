# Changelog

## v2.0.0-beta.4
- [FIX] Memory leak in the "ping" reply

- [BREAKING] Drop support for Node.js below 18.18.x

## v2.0.0-beta.3
- [FIX] Fixed an issue caused by twitch sending numbers as strings in the `message` event.
  - This fix is made especially for the `bits` field of the `message` event.

## v2.0.0-beta.2
- [NEW] We now expose the tags field of the message on the `message` event, this field contains all the tags of the message sent by the user. This includes badges, color, first message, returning chatter, etc.

- [NEW] Added the bits field to the `message` event, this field contains the number of bits sent by the user. Being 0 if the user did not send bits.

## v2.0.0-beta.1
- [FIX] Fixed a bug that made the API not work properly when not including `oauth:` in the token.

- [FIX] Fixed a bug that made the disconnect method not wait for all channels to be left.

- [BREAKING] Removed the `Logger` and `AutoLogEnd` classes. Now they are provided by the [@promisepending/logger](https://www.npmjs.com/package/@promisepending/logger) package.

- [First-Contribution] [Daniele Biggiogero](https://github.com/zeroerrequattro) made his first contribution to the project in the pull request '(#225)'. Thanks for your help! 🎉

## v2.0.0-beta.0
- Beta release of the new version of the API. This release includes a brand new version of the API now based on the [typescript](https://www.typescriptlang.org/) language. This new version of the API is more stable and has a lot of improvements and includes a complete refactoring of the codebase from scratch, new features and bug fixes to provide a better user experience and to be more robust and more reliable. The new version is compatible with the previous version of the API without big code changes.

- [BREAKING]: We dropped support for Node.js 10.x, now the minimum version of Node.js required is 12.22.x.

- [BREAKING]: We doesn't provide the "Collection" class anymore, now the "Collection" class is provided by the [@discordjs/collection](https://www.npmjs.com/package/@discordjs/collection) package.

- [IMPORTANT]: We changed our brand name from "TwitchApis" to "PromisePending". In a near future we will change the name of the organization from "twitchapis" to "promisepending" in the NPM package.

- [NEW]: We added a new system to load the API.
  - This new system allows you to execute sequentially parts of your code together with the API parts of execution.
  - This new system allows you to run the API startup process without having to pass your twitch token and will make the api wait till you call the token method to login in twitch's IRC.

- [NEW]: We recreated our documentation from scratch.
  - The new documentation is more complete and has a lot of improvements.
  - The new documentation is now based on the [typedoc](https://typedoc.org/) library (json file).
  - The new documentation is now available in [docs](https://twitch.js.org/docs) website.

## v1.1.1: Pong Update
- Fixed ping bug where twitch.js would sends a wrong ping reply. 🐜
  - Check: https://dev.twitch.tv/docs/irc#keepalive-messages 📖
- Fix the types 🔝

## v1.1.0: Sleept Update

- Rename SLEEPT to WebSocket 📝
- Improved data types for typescript users 🔝
- Remove unused code ➖
- Fix urls on readme 📖
- Minor Bugs Fixes 🐜

## v1.0.1: DMCA Update

- Changed url's 📝
  - Removed `twitchapis.org` ➖
  - Temporary `purplewolfsoftware.allonsve.com` ➕
- Update all dependencies 🕚
- Minor Bugs Fixes 🐜

## v1.0.0: Pegasi Update

- Stabilize a connection with Twitch IRC 🥳
- Create methods to interact with twitch 🧠
  - Implement Login method 💫
    - `client.login('TOKEN');`
  - Implement Ping method 🕚
    - `client.ping();`
  - Implement Uptime method 🕚
    - `client.uptime();`
  - Implement User Timeout method 🔴
  - Implement User Ban method 🔴
  - Implement User UnBan method 🥳
  - Implement User UnTimeout method 😄
  - Implement User Disconnect method 📤
    - `client.disconnect();`
  - Implement User Leave method 📤
    - `client.leave('channelName');`
  - Implement User Join method 📥
    - `client.join('channelName');`
- Add support to directly interaction with WebSocket ♟️
- Implements structures for easy use 😄
- Implements events for the Twitch responses 🔔
  - Implement ready event 🔛
  - Implement message event 🔔
  - Implement userClear event 🧹
  - Implement clearChat event 🧹
  - Implement join event 📥
  - Implement leave event 📤
- Implements easy to read documentation 📖

### v1.0.0-rc.1

- Maybe has fixed npm readme 📖
- Complete changelog 💌
- Update usage example 📑
- Add user ban method 🔴
- Add user unban method 🥳
- Add user untimeout method 😄
- Fix ready event emit 🔔
- Start implementing new automatized tests 🧪
- Fix bug in disconnect method 💫
- Minor Bugs Fixes 🐜

### v1.0.0-beta.14

- Optimize code ⏩
- Add changelog\.md 📑
- Add ClearChat and UserClearChat events 🔔
- Add timeout method, to timeout the annoying persons on chat 🔴
- Add `ws.send`, so now you can send direct websocket messages to twitchIRC 💌
- Minor fixes 🔹
- Minor Bugs Fixes 🐜
- Improved documentation 📖

### v1.0.0-beta.13

- Remove all global variables (No one left) ➖
- Convert api/functions/chatters.js, api/twitchWebAPI.js and logger to classes 🏛️
- Adds and improve documentation for Client and SLEEPTMethods 📕
- Reduce generateUser method size on SLEEPTMethods ▫️
- Add Twitch token verification endpoint support ☑️
- Added backwards compatibility for some things 👴

### v1.0.0-beta.12

- Readme enhancements 💫
- Added typescript information ➖
- Added automated tests 🧪
- Change paths to absolute paths 📑
- Make client token a private propriety 🚫
- Remove todos from code 🗳️
- Upgrade message reply system to uses twitch thread system 🧵
- Add disconnect method to disconnect from IRC 📤
- Make some classes than should be private really private 🔴
- Implements anonymous mode 🕵️
- Login method promise only returns when IRC is connected and no more when web-socket is connected 🕰️
- Crashes fixes 📕
- Remove unnecessary comments 🐸

### v1.0.0-beta.11

- Backwards compatibility 🔙
- Code optimization ⏩

### v1.0.0-beta.10

- Fixed bug than makes bot user collection be created without name 🐛

### v1.0.0-beta.9

- Fixed bug than makes bot crash on leave 🐛
- Intelligent autoLogEnd 🧠
- Minor crashes resolved 💥
- Make readme\.md clean 🧼
- Make logger file shorter 🔹
- Implements http requests ➖
- Uses users collection on author 💠
- Makes users collection have all users of chat when bot connects to it 😄
- Makes client update channels propriety when the channels global propriety  is changed 🥳
- Resolve some todos ♟️
- Improve switch cases ☑️

### v1.0.0-beta.8

- Fixed bug than allows you to send messages on not connected channels 🐛
- Solved minor crashes than can happen when you try to disconnect from a channel ✅

### v1.0.0-beta.7

- Fixed indentation 🆙
- Removed unnecessary comments ⛔
- Fixed bug than blocks you of connecting to a channel after login 🐛
