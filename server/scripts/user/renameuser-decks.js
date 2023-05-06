const monk = require('monk');
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ashteki';
console.log('attached to: ' + mongoUrl);
if (process.argv[3] !== '') {
    const oldName = process.argv[2];
    const newName = process.argv[3];
    let db = monk(mongoUrl);
    // console.log('updating username: ' + oldName + ' to: ' + newName);
    // const collection = db.get('users');
    // collection
    //     .update(
    //         { username: oldName },
    //         {
    //             $set: {
    //                 username: process.argv[3]
    //             }
    //         }
    //     )
    //     .then((result) => {
    //         // Updated the document with the field a equal to 2
    //         console.log(result);
    //     });
    // // .then(() => db.close());

    // console.log('updating game for player: ' + oldName + ' to: ' + newName);
    // const colGames = db.get('games');
    // colGames
    //     .update(
    //         { 'players.name': oldName },
    //         { $set: { 'players.$.name': newName } },
    //         { multi: true }
    //     )
    //     .then((result) => {
    //         // Updated the document with the field a equal to 2
    //         console.log(result);
    //     });
    // // .then(() => db.close());

    console.log('updating deck username for : ' + oldName + ' to: ' + newName);
    const colGames2 = db.get('decks');
    colGames2
        .update(
            { username: oldName },
            { $set: { username: newName } },
            { multi: true }
        )
        .then((result) => {
            // Updated the document with the field a equal to 2
            console.log(result);
        })
        .then(() => db.close());

}
