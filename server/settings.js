const defaultOptionSettings = {
    orderForcedAbilities: false,
    confirmOneClick: true,
    allowAutoCancel: false,
    leftMode: false,
    compactLayout: false,
    bluffTimer: 0,
    alertTimer: 5,
    alwaysGroupTactics: true,
    manualAlts: false
};

const defaultSettings = {
    cardSize: 'normal',
    background: 'ashesreborn'
};

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

    return userToReturn;
}

module.exports = {
    getUserWithDefaultsSet: getUserWithDefaultsSet
};
