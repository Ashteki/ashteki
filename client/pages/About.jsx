import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation, Trans } from 'react-i18next';
import { Col } from 'react-bootstrap';

import Panel from '../Components/Site/Panel';

class About extends React.Component {
    render() {
        let t = this.props.t;

        return (
            <Col className='full-height' xs='12'>
                <Panel title={t('About Ashes Reborn Online - Help and information')}>
                    <a
                        className='btn btn-danger btn-lg float-right'
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://github.com/danj3000/ashteki/issues'
                    >
                        <Trans>Report Problems</Trans>
                    </a>
                    <h3>What is this?</h3>
                    <p>
                        This site was setup to allow us to play Ashes Reborn in a browser. If
                        you&apos;re looking for a card browser, or advanced deck builder, check out{' '}
                        <a href='http://ashes.live'>http://ashes.live</a>
                    </p>

                    <h3 id='bugs'>
                        <Trans>Card Progress</Trans>
                    </h3>
                    <p>
                        Not all cards are coded yet. You can include non-coded cards in a game, but
                        you will need to be familiar with manual mode in order to use any abilities
                        etc. The following list of expansions are coded, and should be fully
                        operational:
                    </p>
                    <ul>
                        <li>
                            Master Set - (Coal Roarkwin, Maeoni Viper, Aradel Summergaard, Saria
                            Guideman, Jessa Na Ni, Noah Redmoon)
                        </li>
                        <li>The Children of Blackcloud - (Brennan Blackcloud)</li>
                        <li>The Frostdale Giants - (Rin Northfell)</li>
                        <li>The Roaring Rose - (Leo Sunshadow)</li>
                        <li>The Duchess of Deception - (Victoria Glassfire)</li>
                        <li>The Laws of Lions - (Odette Diamondcrest)</li>
                        <li>The Song of Soaksend - (Namine Hymntide)</li>
                        <li>The Goddess of Ishra - (Astrea)</li>
                        <li>The Boy Among Wolves - (Koji Wolfcub)</li>
                        <li>The Spirits of Memoria - (Sembali Grimtongue)</li>
                        <li>The King of Titans - (Xander Heartsblood)</li>
                        <li>The Protector of Argaia - (Fiona Mercywind)</li>
                        <li>The Grave King - (James Endersight)</li>
                    </ul>
                    <p>
                        Many other cards are either coded, or in progress, but the above expansions
                        have had the most testing and will take priority for bug fixes. For the
                        latest info on card support check out the #software-dev channel on the{' '}
                        <a
                            target='_blank'
                            href='https://discord.gg/UU5bduq'
                            rel='noopener noreferrer'
                        >
                            Ashes Community Discord
                        </a>
                        .
                    </p>
                    <h3 id='bugs'>
                        <Trans>Bugs and Automation</Trans>
                    </h3>
                    <p>
                        If you find a card that you believe is not working as it should, it would
                        help immensely if you would submit an issue on{' '}
                        <a
                            target='_blank'
                            href='https://github.com/danj3000/ashteki/issues'
                            rel='noopener noreferrer'
                        >
                            GitHub
                        </a>
                        . Other comments and/or feedback can be left on GitHub as well.
                    </p>

                    <h3 id='mmode'>
                        <Trans>Manual Mode</Trans>
                    </h3>
                    <p>
                        If something goes wrong, or you need to use a card that is not yet
                        implemented you can switch on Manual Mode by clicking the wrench in the
                        bottom right of the screen.
                    </p>
                    <p>
                        In manual mode, clicking cards will bring up a menu which allows you to
                        easily change the game state. Most of the functions in these menus mirror
                        the Manual Commands listed below, but there are a couple of things which can
                        only be done in menus.
                    </p>

                    <h3 id='commands'>
                        <Trans>Manual Commands</Trans>
                    </h3>
                    <p>
                        The following manual commands have been implemented in order to allow for a
                        smoother gameplay experience:
                    </p>
                    <ul>
                        <li>
                            /cancel-prompt -{' '}
                            <Trans i18nKey='howtoplay.cmd.cancelprompt'>
                                Clear the current prompt and resume the game flow. Use with caution
                                and only when the prompt is &apos;stuck&apos; and you are unable to
                                continue
                            </Trans>
                        </li>
                        <li>/discard x - Prompts to choose x cards to discard from your hand</li>
                        <li>
                            /discardtopofdeck x -{' '}
                            <Trans i18nKey='howtoplay.cmd.discardtopofdeck'>
                                Discards x cards from the top of your deck
                            </Trans>
                        </li>
                        <li>
                            /draw x -{' '}
                            <Trans i18nKey='howtoplay.cmd.draw'>
                                Draws x cards from your deck to your hand
                            </Trans>
                        </li>
                        <li>/conjuration - Choose a conjuration to put into play</li>
                        <li>
                            /give-control -{' '}
                            <Trans i18nKey='howtoplay.cmd.givecontrol'>
                                Give control of a card to your opponent. Use with caution
                            </Trans>
                        </li>
                        <li>
                            /manual -{' '}
                            <Trans i18nKey='howtoplay.cmd.manual'>
                                Activate or deactivate manual mode (see above).
                            </Trans>
                        </li>
                        <li>
                            /rematch -{' '}
                            <Trans i18nKey='howtoplay.cmd.rematch'>
                                Start over a new game with the current opponent.
                            </Trans>
                        </li>
                        <li>
                            /token x y -{' '}
                            <Trans i18nKey='howtoplay.cmd.token'>
                                Choose a card and change the number of tokens of type x to y
                            </Trans>
                        </li>
                    </ul>
                    <h3>Meaning of Username Colors</h3>
                    <p>
                        Some usernames have different colors and the intent is to acknowledge the
                        supporters of the platform:
                    </p>
                    <ul>
                        <li>
                            <span className='username admin-role'>admin</span> - site administrator
                        </li>
                        <li>
                            <span className='username contributor-role'>contributor</span> - people
                            who have made significant development contributions to the site
                        </li>
                        <li>
                            <span className='username supporter-role'>supporter</span> - patreon
                            supporters
                        </li>
                        <li>
                            <span className='username winner-role'>winner</span> - current
                            tournament winner
                        </li>
                        <li>
                            <span className='username previouswinner-role'>previous winner</span> -
                            former tournament winner
                        </li>
                    </ul>

                    <h3 id='conceding'>
                        <Trans>Supporting the site</Trans>
                    </h3>
                    <p>
                        Playing games on Ashteki is free, but alas hosting the site is not. If you
                        would like to contribute to the cost of hosting to ensure its long life,
                        then you can sign up to ashteki on{' '}
                        <a
                            target='_blank'
                            rel='noopener noreferrer'
                            href='https://www.patreon.com/ashteki'
                        >
                            Patreon
                        </a>{' '}
                        for a monthly amount. Alternatively you can send your contribution via
                        paypal to{' '}
                        <a
                            target='_blank'
                            rel='noopener noreferrer'
                            href='https://paypal.me/ashteki'
                        >
                            https://paypal.me/ashteki
                        </a>. All contributions will be very gratefully received. Thank you.
                    </p>

                    <h3 id='conceding'>
                        <Trans>About Stats, Conceding and Leaving Games</Trans>
                    </h3>
                    <p>
                        Ashteki does not rank and/or match players by skill level in any way. There
                        are three categories (beginner, casual and competitive) to be chosen when
                        creating a game which gives an indication of what to expect, but it
                        doesn&apos;t enforce anything. Even though personal stats are not being
                        tracked, most players still very much appreciate a formal concede by
                        clicking the ‘Concede’ button and typing ‘gg’ before leaving a game.
                    </p>

                    <h3>Additional Notes</h3>
                    <p>
                        The Ashes Reborn card game, the artwork and many other things are all
                        copyright <a href='plaidhatgames.com'>Plaid Hat Games</a> and I make no
                        claims of ownership or otherwise of any of the artwork or trademarks. This
                        site site exists for passionate fans to play and augment, rather than
                        replace, the in-person experience. If you don&apos;t have it already, you
                        can show PHG how much you love the game by buying a physical copy.
                    </p>
                </Panel>
            </Col>
        );
    }
}

About.displayName = 'About';
About.propTypes = {
    i18n: PropTypes.object,
    t: PropTypes.func
};

export default withTranslation()(About);
