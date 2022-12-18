import React from 'react';

const urlMatchingRegex = new RegExp(
    /(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?/,
    'ig'
);

export function imageUrl(cardStub) {
    if (cardStub && cardStub.includes('.')) {
        return `https://cdn.ashes.live/images/cards/${cardStub}`;
    }
    return `https://cdn.ashes.live/images/cards/${cardStub}.jpg`;
}

export function effectUrl(effect) {
    return `/effects/${effect}.svg`;
}

export function tryParseJSON(jsonString) {
    try {
        var retObject = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object",
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (retObject && typeof retObject === 'object') {
            return retObject;
        }
    } catch (e) {
        return false;
    }

    return false;
}

export function getMessageWithLinks(message) {
    let tokens = message.split(/\s/);

    let i = 0;
    let parts = tokens.map((token) => {
        if (token.match(urlMatchingRegex)) {
            return (
                <a key={`link-${i++}`} href={token} target='_blank' rel='noopener noreferrer'>
                    {token}&nbsp;
                </a>
            );
        }

        return token + ' ';
    });

    return parts;
}

export const getStandardControlProps = (formProps, controlName) => ({
    name: controlName,
    value: formProps.values[controlName],
    onChange: formProps.handleChange,
    onBlur: formProps.handleBlur,
    isInvalid: formProps.touched[controlName] && !!formProps.errors[controlName]
});

export const gameTypes = [
    { name: 'casual', label: 'Unranked' },
    { name: 'competitive', label: 'Ranked' }
];
export const getGameTypeLabel = (name) => {
    const type = gameTypes.find(f => f.name === name);
    return type?.label;
};

export const gameFormats = [
    { name: 'firstadventure', label: 'First Adventure' },
    { name: 'aparty', label: 'Adventuring Party' },
    { name: 'precon', label: 'Precon' },
    { name: 'constructed', label: 'Constructed' },
    { name: 'coaloff', label: 'Coal Off!' }
];

export const getFormatLabel = (name) => {
    const format = gameFormats.find(f => f.name === name);
    return format?.label;
};

/**
 * @param {File} file
 * @returns {Promise<string>}
 */
export const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.toString().split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
