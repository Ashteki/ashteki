const Settings = require('../settings');

/**
 * A Lobby server user
 */
class User {
    constructor(userData) {
        this.userData = userData;
        this.invalidDecks = undefined;
    }

    get id() {
        return this.userData._id.toString();
    }

    get disabled() {
        return this.userData.disabled;
    }

    get faveColor() {
        return this.userData.faveColor;
    }

    get gamesPlayed() {
        return this.userData.gamesPlayed;
    }

    get username() {
        return this.userData.username;
    }

    get tokens() {
        return this.userData.tokens;
    }

    get activationToken() {
        return this.userData.activationToken;
    }

    get activationTokenExpiry() {
        return this.userData.activationTokenExpiry;
    }

    get resetToken() {
        return this.userData.resetToken;
    }

    get tokenExpires() {
        return this.userData.tokenExpires;
    }

    get blockList() {
        return this.userData.blockList || [];
    }

    set blockList(value) {
        this.userData.blockList = value;
    }

    get password() {
        return this.userData.password;
    }

    get permissions() {
        return this.userData.permissions || [];
    }

    get email() {
        return this.userData.email;
    }

    get verified() {
        return this.userData.verified;
    }

    get registered() {
        return this.userData.registered;
    }

    get isAdmin() {
        return this.userData.permissions && this.userData.permissions.isAdmin;
    }

    get isWinner() {
        return this.userData.permissions && this.userData.permissions.isWinner;
    }

    get isPreviousWinner() {
        return this.userData.permissions && this.userData.permissions.isPreviousWinner;
    }

    get keepsSupporter() {
        return this.userData.permissions && this.userData.permissions.keepsSupporterWithNoPatreon;
    }

    get isContributor() {
        return this.userData.permissions && this.userData.permissions.isContributor;
    }

    get isSupporter() {
        return this.userData.permissions && this.userData.permissions.isSupporter;
    }

    get role() {
        if (!this.userData) {
            return 'user';
        }

        if (this.isAdmin) {
            return 'admin';
        }

        if (this.isWinner) {
            return 'winner';
        }

        if (this.isPreviousWinner) {
            return 'previouswinner';
        }

        if (this.isContributor) {
            return 'contributor';
        }

        if (this.isSupporter) {
            return 'supporter';
        }

        return 'user';
    }

    get avatar() {
        return this.userData && this.userData.settings && this.userData.settings.avatar;
    }

    get patreon() {
        return this.userData.patreon;
    }

    set patreon(value) {
        this.userData.patreon = value;
    }

    get eloRating() {
        return this.userData.eloRating;
    }

    set eloRating(value) {
        this.userData.eloRating = value;
    }

    block(otherUser) {
        this.userData.blockList = this.userData.blockList || [];
        this.userData.blockList.push(otherUser.username.toLowerCase());
    }

    hasUserBlocked(otherUser) {
        return this.blockList.includes(otherUser.username.toLowerCase());
    }

    getWireSafeDetails() {
        let user = {
            id: this.userData._id,
            avatar: this.userData.settings && this.userData.settings.avatar,
            username: this.userData.username,
            email: this.userData.email,
            settings: this.userData.settings,
            permissions: this.userData.permissions,
            verified: this.userData.verified,
            blockList: this.userData.blockList,
            gamesPlayed: this.userData.gamesPlayed,
            rankedGamesPlayed: this.userData.rankedGamesPlayed,
            eloRating: this.userData.eloRating,
            altArts: this.userData.altArts
        };

        user = Settings.getUserWithDefaultsSet(user);

        return user;
    }

    getShortSummary() {
        return {
            username: this.username,
            avatar: this.avatar,
            name: this.username,
            role: this.role,
            faveColor: this.faveColor,
            eloRating: this.userData.eloRating,
            gamesPlayed: this.gamesPlayed
        };
    }

    getFullDetails() {
        let user = Object.assign({ invalidDecks: this.invalidDecks }, this.userData);

        delete user.password;

        user = Settings.getUserWithDefaultsSet(user);
        user.avatar = this.avatar;

        return user;
    }

    getDetails() {
        let user = Object.assign({ invalidDecks: this.invalidDecks }, this.userData);

        delete user.password;
        delete user.tokens;

        user = Settings.getUserWithDefaultsSet(user);
        user.role = this.role;
        user.avatar = this.avatar;

        return user;
    }

    getAltDetails() {
        let user = this.getShortSummary();

        user.altArts = this.userData.altArts;

        return user;
    }

}

module.exports = User;
