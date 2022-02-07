import React from 'react';
import { Trans } from 'react-i18next';

const ManualCommands = () => {
    return (
        <div className='manual-commands'>
            <h3 id='commands'>
                <Trans>Manual Commands</Trans>
            </h3>
            <p>
                The following manual commands have been implemented in order to allow for a
                smoother gameplay experience:
            </p>
            <ul>
                <li>
                    /cancelprompt -{' '}
                    <Trans i18nKey='howtoplay.cmd.cancelprompt'>
                        Clear the current prompt and resume the game flow. Use with caution
                        and only when the prompt is &apos;stuck&apos; and you are unable to
                        continue
                    </Trans>
                </li>
                <li>/conjuration - Choose a conjuration to put into play</li>
                <li>/discard x - Prompts to choose x cards to discard from your hand</li>
                <li>
                    /discardfromdeck x -{' '}
                    <Trans i18nKey='howtoplay.cmd.discardfromdeck'>
                        Discard x cards from the top of your deck
                    </Trans>
                </li>
                <li>
                    /draw x -{' '}
                    <Trans i18nKey='howtoplay.cmd.draw'>
                        Draw x cards from your deck to your hand
                    </Trans>
                </li>
                <li>
                    /givecontrol -{' '}
                    <Trans i18nKey='howtoplay.cmd.givecontrol'>
                        Give control of a card to your opponent. Use with caution
                    </Trans>
                </li>
                <li>
                    /manual -{' '}
                    <Trans i18nKey='howtoplay.cmd.manual'>
                        Deactivate manual mode (see above)
                    </Trans>
                </li>
                <li>
                    /move x -{' '}
                    <Trans i18nKey='howtoplay.cmd.move'>
                        Move a card to play, spellboard, deck, discard, hand or conjuration (pile)
                    </Trans>
                </li>
                <li>
                    /passactive - Spend your main action and pass the active turn to your
                    opponent
                </li>
                <li>/purge - Choose a card to remove from the game</li>
                <li>
                    /rematch -{' '}
                    <Trans i18nKey='howtoplay.cmd.rematch'>
                        Start over a new game with the current opponent
                    </Trans>
                </li>
                <li>
                    /removeeffects -{' '}
                    <Trans i18nKey='howtoplay.cmd.removeeffects'>
                        Remove temporary effects from a card in play
                    </Trans>
                </li>
                <li>/reveal - Reveal a face down card</li>
                <li>
                    /shuffle -{' '}
                    <Trans i18nKey='howtoplay.cmd.shuffle'>Shuffle your deck</Trans>
                </li>
                <li>
                    /token x y - Choose a card and change the number of tokens of type x (damage, exhaust or status) to y
                </li>
            </ul>
        </div>
    );
};

ManualCommands.displayName = 'ManualCommands';

export default ManualCommands;
