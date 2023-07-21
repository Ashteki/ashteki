import React from 'react';
import { useSelector } from 'react-redux';
import CardFrame from './CardFrame';
import Card from './Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

const BattleZone = ({ player, cardsInPlay, cardProps }) => {
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const cardSize = useSelector((state) => state.account.user.settings.cardSize);
    const theirAttack = currentGame.attack && currentGame.attack.attackingPlayer !== player.id;
    const emptyFrame = <CardFrame cardSize={cardSize} />;
    const getCard = (uuid) => {
        return cardsInPlay.find((c) => c.uuid === uuid);
    };
    const getAttacker = (battle) => {
        const c = getCard(battle.attacker);
        if (!c) {
            return emptyFrame;
        }
        return <Card card={c} source='play area' {...cardProps} />;
    };

    const getDefender = (battle) => {
        const defender = currentGame.attack.isPBAttack || battle.guard ? battle.guard : battle.target;
        if (!defender) {
            return emptyFrame;
        }
        const c = getCard(defender);
        if (!c) {
            return emptyFrame;
        }

        return <Card card={c} {...cardProps} />;
    };
    const arrow = theirAttack ? faCaretDown : faCaretUp;

    return (
        <div className='attack-zone'>
            {currentGame.attack &&
                currentGame.attack.battles
                    .sort((a, b) => (a.key > b.key ? 1 : -1))
                    .map((b) => (
                        <div key={b.key} className='battle'>
                            {theirAttack ? getAttacker(b) : getDefender(b)}
                            <div className='battle-arrow'>
                                <FontAwesomeIcon icon={arrow} title='Attack!' />
                            </div>
                            {theirAttack ? getDefender(b) : getAttacker(b)}
                        </div>
                    ))}
        </div>
    );
};

export default BattleZone;
