import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation, Trans } from 'react-i18next';
import { Col } from 'react-bootstrap';

import Panel from '../Components/Site/Panel';
import Link from '../Components/Navigation/Link';

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

                    <p>This site was setup to allow you to play Ashes Reborn in your browser.</p>
                    <h3>That&apos;s pretty cool! But how does any of this work?</h3>
                    <p>
                        Head on over to the <Link href='/how-to-play'>How To Play guide</Link> for a
                        thorough explanation.
                    </p>
                    <h3>Additional Notes</h3>
                    <p>
                        The Ashes Reborn card game, the artwork and many other things are all
                        copyright <a href='plaidhatgames.com'>Plaid Hat Games</a> and I make no
                        claims of ownership or otherwise of any of the artwork or trademarks. This
                        site exists for site exists for site exists for passionate fans to play a
                        and augment, rather than replace, the in-person experience. If you
                        don&apos;t have it already show PHG how much you love the game by buying a
                        physical copy.
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
