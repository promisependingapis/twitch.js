# Changelog

## v2.0.0-beta.7
- [FIX] Async methods in the `channel` structure were not marked as async.

- [FEAT] Implemented the `isChannelLive` method in the client.
  - This method checks if a channel is live.
  - Returns a boolean indicating the live status of the channel.
  - Also includes a wrapper method `isLive` in the channel structure.

### v2.0.0-beta.6
- [FIX] Client crash when omitting the `channels` option in the client constructor.
- [FIX] `disconnected` event inconsistency.
  - The `disconnected` event is now always emitted when the client is disconnected from Twitch IRC, even in the case of a forced disconnection.

### v2.0.0-beta.5
- [FIX] Multiple memory leaks.

- [REFACTOR] Major refactor of the codebase to improve performance and stability.
  - Removed unused code and applied various enhancements.

- [CHORE] Dependency optimization.
  - Updated all dependencies to the latest versions.
  - Removed unused dependencies.

- [BREAKING] Internal logger was removed.
  - If you need a logger, you can install the [@promisepending/logger](https://www.npmjs.com/package/@promisepending/logger.js) package.

- [BREAKING] Removed the entire StepManager system.
  - If you weren’t using StepManager, this change does not affect you.

- [BREAKING] Collections were replaced with `Map`.
  - This affects properties like `ChannelManager.cache` and `UserManager.cache`.

### v2.0.0-beta.4
- [FIX] Memory leak in the `ping` reply.

- [BREAKING] Dropped support for Node.js versions below `v18.18.x`.

### v2.0.0-beta.3
- [FIX] Fixed an issue caused by Twitch sending numbers as strings in the `message` event.
  - Especially relevant for the `bits` field.

### v2.0.0-beta.2
- [NEW] Exposed the `tags` field in the `message` event. This field contains all tags related to the message (badges, color, first message, returning chatter, etc.).

- [NEW] Added the `bits` field to the `message` event, indicating the number of bits sent (or 0 if none).

### v2.0.0-beta.1
- [FIX] Fixed a bug that made the API fail when `oauth:` was missing from the token.

- [FIX] Fixed a bug where the `disconnect` method didn’t wait for all channels to be left.

- [BREAKING] Removed `Logger` and `AutoLogEnd` classes.
  - They are now available in the [@promisepending/logger](https://www.npmjs.com/package/@promisepending/logger) package.

- [First-Contribution] [Daniele Biggiogero](https://github.com/zeroerrequattro) made his first contribution in PR (#225). Thanks for your help! 🎉

### v2.0.0-beta.0
- Beta release of the new API version, now written in [TypeScript](https://www.typescriptlang.org/).
  - More stable, with major improvements and a complete rewrite.
  - Mostly compatible with previous versions.

- [BREAKING] Dropped support for Node.js 10.x. The minimum version is now 12.22.x.

- [BREAKING] No longer provides the `Collection` class directly.
  - Use [@discordjs/collection](https://www.npmjs.com/package/@discordjs/collection) instead.

- [IMPORTANT] Brand name changed from "TwitchApis" to "PromisePending".
  - The NPM organization will also be renamed soon.

- [NEW] Introduced a new API loading system.
  - Allows sequential execution of your code and API internals.
  - Supports initialization before providing the Twitch token.

- [NEW] Completely revamped documentation.
  - Now more complete and based on [typedoc](https://typedoc.org/) (JSON format).
  - Available at [docs](https://twitch.js.org/docs).

### v1.1.1: Pong Update
- Fixed ping bug where twitch.js would sends a wrong ping reply. 🐜
  - Check: https://dev.twitch.tv/docs/irc#keepalive-messages 📖
- Fix the types 🔝

### v1.1.0: Sleept Update

- Rename SLEEPT to WebSocket 📝
- Improved data types for typescript users 🔝
- Remove unused code ➖
- Fix urls on readme 📖
- Minor Bugs Fixes 🐜

### v1.0.1: DMCA Update

- Changed url's 📝
  - Removed `twitchapis.org` ➖
  - Temporary `purplewolfsoftware.allonsve.com` ➕
- Update all dependencies 🕚
- Minor Bugs Fixes 🐜

### v1.0.0: Pegasi Update

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
