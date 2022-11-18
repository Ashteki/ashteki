const _ = require('underscore');
const UserService = require('../services/AshesUserService.js');
const ConfigService = require('../services/ConfigService.js');

let userService = new UserService(new ConfigService());
/*
let args = process.argv.slice(2);

if(_.size(args) < 2) {
    console.error('Must provide start and end date');

    db.close();
    return;
}
*/

userService
    .getAllUsers()
    .then((users) => {
        console.info('' + _.size(users), 'total users');

        _.each(users, (user) => {
            console.info('%s | %s', user.username, user.eloRating);
        });

        console.info('' + _.size(users), 'total users');
    })
    .catch((error) => {
        console.log(error);
    });
