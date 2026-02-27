import React from 'react';
import AlertPanel from '../Site/AlertPanel';

const DeckTypeInfo = ({ deckType }) => {
    switch (deckType) {
        case 'firstadventure':
            return (
                <AlertPanel type='info'>
                    <strong>First Adventure</strong> Perfect for new players - This pair of dueling
                    decks from ImpossibleGerman use Aradel and Saria as Phoenixborn, and are built
                    entirely using cards from the core set. First five suggestions, and more info
                    are in{' '}
                    <a
                        className='format-info-link'
                        target='blank'
                        href='https://jaysonsethlindley.medium.com/first-adventure-dueling-decks-from-the-ashes-reborn-master-set-1d82917881fb'>
                        this article
                    </a>
                </AlertPanel>
            );
        case 'aparty':
            return (
                <AlertPanel type='info'>
                    <strong>Adventuring Party</strong> Pick from any of ImpossibleGerman&apos;s four
                    Adventuring Party sets of decks, each built from a complete card set.{' '}
                    <a
                        className='format-info-link'
                        target='blank'
                        href='https://jaysonsethlindley.medium.com/adventuring-party-4-seven-constructed-ashes-decks-from-one-collection-75842c7d4a3a'
                    >
                        More details
                    </a>
                </AlertPanel>
            );
        case 'precon':
            return (
                <AlertPanel type='info'>
                    <strong>Reborn Precons</strong> These are the preconstructed decks as released in each Ashes Reborn product by PHG.
                </AlertPanel>
            );
        case 'ascendancy':
            return (
                <AlertPanel type='info'>
                    <strong>Ascendancy Precons</strong> These are the preconstructed decks as released in each Ashes Ascendancy product by PHG.
                </AlertPanel>
            );
        case 'pveDecks':
            return (
                <AlertPanel type='info'>
                    <strong>Red Rains Precons</strong> These are preconstructed decks as released in each Red Rains product by PHG.
                </AlertPanel>
            );
        case 'dualduel':
            return (
                <AlertPanel type='info'>
                    <strong>Dual Duel</strong> Decks that use only two dice colours made by
                    KillerCactus. These are good decks for beginners and intermediate players who
                    want to move on from precons.
                </AlertPanel>
            );
        case 'onecollection':
            return (
                <AlertPanel type='info'>
                    <strong>One Collection Battlebox</strong> Decks from NoSuchMethod&apos;s format that use one collection up to the Red Rains cycle and allow both uniques for each Phoenixborn.
                </AlertPanel>
            );
    }
};

export default DeckTypeInfo;
