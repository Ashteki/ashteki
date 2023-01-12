const _ = require('underscore');
const UserService = require('../../services/AshesUserService.js');
const ConfigService = require('../../services/ConfigService.js');

let userService = new UserService(new ConfigService());

let args = process.argv.slice(2);
let brief = false;

if (_.size(args) > 0) {
    brief = args[0] === 'brief';
}

userService
    .getAllUsers()
    .then((users) => {
        console.info('' + _.size(users), 'total users');

        _.each(users, (user) => {
            if (brief) {
                console.log(user.username, '|', user.email, '|', user.registered);
            } else {
                console.log(user);
            }
        });

        console.info('' + _.size(users), 'total users');
    })
    .catch((error) => {
        console.log(error);
    });
