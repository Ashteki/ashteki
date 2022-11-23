import React from 'react';
import AlertPanel from '../Site/AlertPanel';

const GameFormatInfo = ({ gameType: gameFormat }) => {
    switch (gameFormat) {
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
                    Adventuring Party sets of decks, each built from a complete card set. Read more
                    in the article for the{' '}
                    <a
                        className='format-info-link'
                        target='blank'
                        href='https://jaysonsethlindley.medium.com/adventuring-party-4-seven-constructed-ashes-decks-from-one-collection-75842c7d4a3a'
                    >
                        latest set
                    </a>
                </AlertPanel>
            );
        case 'precon':
            return (
                <AlertPanel type='info'>
                    <strong>Precon</strong> Play a game using any of the pre-constructed decks from
                    each product release.
                </AlertPanel>
            );
        case 'constructed':
            return (
                <AlertPanel type='info'>
                    <strong>Constructed</strong> Play with any deck from your collection, or use an
                    AP deck, precon, or anything you want to bring. Full constructed mode is where
                    the most optimised competitive decks get to shine.
                </AlertPanel>
            );
        case 'coaloff':
            return (
                <AlertPanel type='info'>
                    <strong>Coal Off!</strong> Both players take Coal Roarkwin and a deck of 30
                    random cards. Yes, this is a fun format.
                </AlertPanel>
            );
    }
};

export default GameFormatInfo;
