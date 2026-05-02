const _ = require('underscore');
const UserService = require('../../services/AshesUserService.js');
const ConfigService = require('../../services/ConfigService.js');

let userService = new UserService(new ConfigService());

let args = process.argv.slice(2);
let brief = false;
let supporters = false;

if (_.size(args) > 0) {
    brief = args.includes('brief');
    supporters = args.includes('supporters');
}


userService
    .getAllUsers()
    .then((users) => {
        console.info('' + _.size(users), 'total users');
        console.log('username | email | registered year | registered month | supporter | keepFlag');
        _.each(users, (user) => {
            if (supporters && !user.permissions.isSupporter) {
                return;
            }
            if (brief) {
                console.log(
                    '%s | %s | %d | %d | %s | %s',
                    user.username,
                    user.email,
                    user.registered.getFullYear(),
                    user.registered.getMonth(),
                    user.permissions?.isSupporter ? 'supporter' : '',
                    user.permissions?.keepsSupporterWithNoPatreon ? 'true' : ''
                );
            } else {
                console.log(user);
            }
        });

        console.info('' + _.size(users), 'total users');
    })
    .catch((error) => {
        console.log(error);
    });
