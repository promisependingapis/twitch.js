function JumpSpaces(Data, Position) {
    while (Data[Position] === ' ') {
        Position += 1;
    }
    return Position;
}

module.exports = {
    Message(Data) {
        var MessageOutputObject = {
            raw: Data,
            tags: {},
            prefix: null,
            command: null,
            params: []
        };

        var Position = 0;
        var NextSpace = 0;

        if (Data[0] === '@') {
            NextSpace = Data.indexOf(' ');

            // The IRC message come malformed
            if (NextSpace === -1) {
                return null;
            }

            // Tags
            var RawTags = Data.slice(1, NextSpace).split(';');

            for (var i = 0; RawTags.length; i++) {
                // Tag can be like: Key=Value
                // If is not like that then the value will be false, and the tag will be the key
                var Tag = RawTags[i];
                if (!Tag) {return false;}
                var Pair = Tag.split('=');
                MessageOutputObject.tags[Pair[0]] = Pair[1] ? Pair[1] : false;
            }

            Position = NextSpace + 1;
        }

        // Skip the whitespaces
        Position = JumpSpaces(Data, Position);

        // If Message comes with a prefix get it. Prefixes normaly comes prepended with a colon
        if (Data[Position] === ':') {
            NextSpace = Data.indexOf(' ', Position);

            // Verify if message is malformed
            if (NextSpace === -1) {
                return null;
            }

            MessageOutputObject.prefix = Data.slice(Position + 1, NextSpace);
            Position = NextSpace + 1;
        }

        // Skip the whitespaces
        Position = JumpSpaces(Data, Position);

        NextSpace = Data.indexOf(' ', Position);
        if (NextSpace === -1) {
            if (Data.length > Position) {
                MessageOutputObject.command = Data.slice(Position);
                return MessageOutputObject;
            }

            return null;
        }
        
        // Else, the current position until the next space is the command, and then some more parameters.
        MessageOutputObject.command = Data.slice(Position, NextSpace);
        Position = NextSpace + 1;

        // Skip the whitespaces
        Position = JumpSpaces(Data, Position);

        while (Position < Data.length) {
            NextSpace = Data.indexOf(' ', Position);

            // If appear a colon, then that means we have a trailing parameter. And theres no way of it be a extra params, so then push everything than appears after the collom to the params array and break the loop.
            if (Data[Position] === ':') {
                MessageOutputObject.params.push(Data.slice(Position + 1));
                break;
            }

            // We have more spaces
            if (NextSpace !== -1) {
                // push all between this position and the next space to the params
                MessageOutputObject.params.push(Data.slice(Position, NextSpace));
                Position = NextSpace + 1;

                // Skip the whitespaces
                Position = JumpSpaces(Data, Position);

                continue;
            }

            // No more spaces. Push all the remain to params
            if (NextSpace !== -1) {
                MessageOutputObject.params.push(Data.slice(Position));
                break;
            }
        }
        return MessageOutputObject;
    }
};