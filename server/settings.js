const defaultOptionSettings = {
    orderForcedAbilities: false,
    confirmOneClick: true
};

const defaultSettings = {
    cardSize: 'normal',
    background: 'ashesreborn'
};

const defaultEloRating = 1500;

function getUserWithDefaultsSet(user) {
    let userToReturn = user;

    if (!userToReturn) {
        return userToReturn;
    }

    userToReturn.settings = Object.assign({}, defaultSettings, userToReturn.settings);
    userToReturn.settings.optionSettings = Object.assign(
        {},
        defaultOptionSettings,
        userToReturn.settings.optionSettings
    );
    userToReturn.permissions = Object.assign({}, userToReturn.permissions);
    if (!userToReturn.blockList) {
        userToReturn.blockList = [];
    }

    if (userToReturn.casualElo === undefined) {
        userToReturn.casualElo = defaultEloRating;
    }

    if (userToReturn.competitiveElo === undefined) {
        userToReturn.competitiveElo = defaultEloRating;
    }

    return userToReturn;
}

module.exports = {
    getUserWithDefaultsSet: getUserWithDefaultsSet
};
