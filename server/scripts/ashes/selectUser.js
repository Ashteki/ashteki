const monk = require('monk');
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ashteki';
console.log('attached to: ' + mongoUrl);
let db = monk(mongoUrl);
console.log('selecting user: ' + process.argv[2]);
const collection = db.get('users');
collection
    .find({ $or: [{ username: process.argv[2] }, { email: process.argv[2] }] })
    .then((result) => {
        // Updated the document with the field a equal to 2
        console.log(result);
    })
    .then(() => db.close());
