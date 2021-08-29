# Ashteki

Web based implementation of the Ashes Reborn card game

## FAQ

### What is it?

This is the respository for the code internally known as ashteki which allows people to play Ashes Reborn using only their browser

### Doesn't this look a lot like The Crucible Online and other sites like it?

Yep. This is a fork of the Keyteki source, with some retrofitting from ringteki.

### Can I contribute?

Sure! The code is written in node.js(server) and react.js(client). Feel free to make suggestions, implement new cards, refactor bits of the code, raise pull requests or submit bug reports

If you are going to contribute code, try and follow the style of the existing code as much as possible and talk to me before engaging in any big refactors. Also bear in mind there is an .eslintrc file in the project so try to follow those rules.

There's some info on writing cards from the keyteki project:
[Documentation for implementing cards from keyteki](https://github.com/keyteki/keyteki/blob/master/docs/implementing-cards.md)

If you're not coding inclined, then just playing games on the site, and reporting bugs and issues that you find is a big help

### X Y Z doesn't work

As of writing only the Reborn set up to and including Lulu has been implemented, so any cards from later expansions may load, but won't trigger any automatic ablities. You may be able to use manual mode, but hopefully you won't have to for long. If there's anything you can't do that you need to be able to do, let me know by raising an issue. Likewise if there's a bug, a crash, or anything amiss then let me know by raising an issue on github or visiting the Ashes discord server.

## Development

### Docker

If you have docker installed, you can use the containerised version of the site.
Clone the repository, then navigate to the repository and run the following commands:

```
npm install
docker-compose up
```

In another terminal, navigate to the repository and run the following commands:

```
docker-compose exec lobby node server/scripts/ashes/importdata
docker-compose exec lobby node server/scripts/ashes/importprecons
```

### Non Docker

#### Required Software

-   Git
-   Node.js 8
-   mongodb
-   Redis

Clone the repository, then run the following commands:

```
npm install
mkdir server/logs
```

Create config/local.json5 and put something like the following in it:

```
{
    mongo: 'mongodb://127.0.0.1:27017/ashteki',
    redisUrl: 'redis://127.0.0.1',

    gameNode: {
        hostname: 'localhost'
    }
}
```

Run the following commands:

```
node server/scripts/ashes/importdata.js
node server/scripts/ashes/importprecons
node .
node server/gamenode
```

There are two executable components and you'll need to configure/run both to run a local server. First is the lobby server and then there are game nodes. The default configurations assume you are running postgres locally on the default port. If you need to change any configurations, edit `config/default.json5` or create a `config/local.json5` configuration that overrides any desired settings.

To download all supported languages (not needed if you're running just a test / dev server):

### Running and Testing

The game server should be accessible by browsing to localhost:4000.

The docker setup creates a default 'admin' user with the password of 'password'.
!THIS ISN'T WORKING RIGHT NOW!

You can register 2 or more users, to play against yourself.
They can have fake email addresses.
You can login as both users either from 2 different browsers, or by
using an incognito window.

These users will be normal (non-admin) users. To escalate a user to
the admin role requires manual edits to the database, but that
is not required for testing in-game functionality.

If you implement or make changes to a card, you can use manual mode
to add it to a deck from within a game. Use manual mode, and the command:

```
/add-card <card name>
```

Before you run the unit tests, be sure all the necessary dependencies are installed

```
npm install
```

Then, to run the tests:

```
npm test
```

### Coding Guidelines

All JavaScript code included in Ashteki should pass (no errors, no warnings)
linting by [ESLint](http://eslint.org/), according to the rules defined in
`.eslintrc` at the root of this repo. To manually check that that is indeed the
case install ESLint and run

```
npm run lint
```

from repository's root.

All tests should also pass. To run these manually do:

```
npm test
```

If you are making any game engine changes, these will not be accepted without unit tests to cover them.

### Discord Discusson

[Ashes Discord Server](https://discord.gg/UU5bduq)
