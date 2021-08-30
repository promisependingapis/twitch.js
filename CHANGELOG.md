# Changelog

## v1.0.1: DMCA Update

- Changed url's
  - Removed `twitchapis.org`
  - Temporary `purplewolfsoftware.allonsve.com`
- Update dependencies

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
- Start implementing new automatizated tests 🧪
- Fix bug in disconnect method 💫
- Minor Bugs Fixes 🐜

### v1.0.0-beta.14

- Optimize code ⏩
- Add changelog\.md 📑
- Add ClearChat and UserClearChat events 🔔
- Add timeout method, to timeout the annoying persons on chat 🔴
- Add `ws.send`, so now you can send direct websocket messages to twitchIRC 💌
- Minor fixes 🔹
- Minor bug fixes 🐜
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
- Code otimization ⏩

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
- Solved minor crashs than can happen when you try to disconnect from a channel ✅

### v1.0.0-beta.7

- Fixed indentation 🆙
- Removed unnecessary comments ⛔
- Fixed bug than blocks you of connecting to a channel after login 🐛
