const _ = require('underscore');
const UserService = require('../../services/AshesUserService.js');
const ConfigService = require('../../services/ConfigService.js');

let userService = new UserService(new ConfigService());

userService
    .getAllUsers()
    .then((users) => {
        console.info('' + _.size(users), 'total users');

        const starterStats = {};
        _.each(users, (user) => {
            const joinMonth =
                user.registered.getFullYear() +
                '-' +
                ('0' + (user.registered.getMonth() + 1)).slice(-2);
            if (starterStats[joinMonth]) {
                starterStats[joinMonth]++;
            } else {
                starterStats[joinMonth] = 1;
            }
        });

        for (let j in starterStats) {
            console.log(`${j} | ${starterStats[j]}`);
        }
        console.info('' + _.size(users), 'total users');
    })
    .catch((error) => {
        console.log(error);
    });
