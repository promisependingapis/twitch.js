'use strict';

const run = (logger, client, channels, mainChannel) => {
    return new Promise(async (resolve, reject) => {
        const promises = [];
        const rejects = [];

        channels.forEach((channel) => {
            if (channel !== mainChannel) {
                promises.push(
                    new Promise((resolve2) => {
                        client.join(channel).then(() => {
                            client.getWebSocketManager().getConnection().send(
                                'CHATTERS {channel: \'' +
                                    channel +
                                    '\', users: [\'' +
                                    Array.from(client.channels.get(mainChannel).users.cache.values())
                                      .map((value) => {
                                        return value.userName;
                                      })
                                      .join("', '") +
                                '\']}'
                                );
                            resolve2();
                        }).catch((err) => {
                            rejects.push(err);
                            resolve2();
                        });
                    })
                );
            } else {
                client.getWebSocketManager().getConnection().send(
                    "CHATTERS {channel: '" +
                      mainChannel +
                      "', users: ['" +
                      Array.from(client.channels.get(mainChannel).users.cache.values())
                        .map((value) => {
                          return value.userName;
                        })
                        .join("', '") +
                      "']}"
                  );
            }
        });
        await Promise.all(promises);
        if (rejects.length > 0) {
            reject(rejects);
        } else {
            resolve();
        }
    });
};

module.exports = {
    name: 'Connect Channels Test',
    run: run,
    order: 2
};
