import React from 'react';

const ManualCommands = () => {
    return (
        <div className='manual-commands'>
            <h3 id='commands'>Manual Commands</h3>
            <p>
                When manual mode is active you can drag / drop cards between locations. There are
                also text commands to achieve card moves.
            </p>
            <p>Card commands</p>
            <ul>
                <li>/draw x - Draw x cards from your deck to your hand</li>
                <li>/discard x - Prompts to choose x cards to discard from your hand</li>
                <li>/discardfromdeck x - Discard x cards from the top of your deck</li>
                <li>/shuffle - Shuffle your deck </li>
                <li>/addthreat - Add one card from the chimera deck to the battlefield</li>
            </ul>
            <ul>
                <li>
                    /move <i>destination</i> - Move a card to the <i>destination</i> card pile:
                    play, spellboard, deck, discard, hand or conjuration (pile)
                </li>
                <li>/purge - Choose a card to remove from the game</li>
                <li>/conjuration - Choose a conjuration to put into play</li>
                <li>/attach - attach an alteration spell to one of your units</li>
                <li>
                    /remove - choose an alteration spell on one of your units to return to your hand
                </li>
                <li>
                    /token <i>type</i> <i>amount</i> - Choose a card and change the number of tokens
                    of <i>type</i> (damage, exhaustion or status) to <i>amount</i>
                </li>
                <li>/givecontrol -Give control of a card to your opponent. Use with caution</li>
                <li>/removeeffects - Remove temporary effects from a card in play</li>
            </ul>
            <p>Game commands</p>
            <ul>
                <li>
                    /cancelprompt - Clear the current prompt and resume the game flow. Use with
                    caution and only when the prompt is &apos;stuck&apos; and you are unable to
                    continue
                </li>
                <li>
                    /passactive - Spend your main action and pass the active turn to your opponent
                </li>
                <li>
                    /endgame - With agreement from your opponent, end the game without a win/loss
                    record
                </li>
                <li>/rematch - Start over a new game with the current opponent</li>
                <li>/manual - Deactivate manual mode</li>
                <li>/firstplayer - Give the first player token to a chosen player</li>
            </ul>
        </div>
    );
};

ManualCommands.displayName = 'ManualCommands';

export default ManualCommands;
