import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation, Trans } from 'react-i18next';
import { Col } from 'react-bootstrap';

import Panel from '../Components/Site/Panel';
import ManualCommands from './ManualCommands';

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

                    <ManualCommands />
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
