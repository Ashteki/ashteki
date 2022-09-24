const monk = require('monk');
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ashteki';
console.log('attached to: ' + mongoUrl);
let db = monk(mongoUrl);
console.log('updating user: ' + process.argv[2]);
const collection = db.get('users');
collection
    .update(
        { username: process.argv[2] },
        {
            $set: {
                permissions: { isAdmin: true, canManagePermissions: true, canManageUsers: true }
            }
        }
    )
    .then((result) => {
        // Updated the document with the field a equal to 2
        console.log(result);
    })
    .then(() => db.close());
