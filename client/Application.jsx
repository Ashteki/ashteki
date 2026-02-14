import React, { useEffect, useRef, useState, useCallback } from 'react';
import $ from 'jquery';
import { useSelector, useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';
import ErrorBoundary from './Components/Site/ErrorBoundary';
import Navigation from './Components/Navigation/Navigation';
import { tryParseJSON } from './util';
import AlertPanel from './Components/Site/AlertPanel';
import * as actions from './redux/actions';
import AppRoutes from './AppRoutes';
import { useNavigate } from 'react-router-dom';

import Background from './assets/img/bgs/lobby_screen_ascendancy.jpg';
import BlankBg from './assets/img/bgs/blank.png';
import { storageBaseUrl } from './constants';

function Application() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currentGame = useSelector((s) => s.lobby.currentGame);
    const user = useSelector((s) => s.account.user);
    const windowBlurred = useSelector((s) => s.lobby.windowBlurred);

    const [incompatibleBrowser, setIncompatibleBrowser] = useState(false);
    const [cannotLoad, setCannotLoad] = useState(false);
    const bgRef = useRef(null);

    const backgrounds = { blank: BlankBg, ashesreborn: Background };

    const onFocusChange = useCallback(
        (event) => {
            dispatch(actions.setWindowBlur(event.type));
        },
        [dispatch]
    );

    const blinkTab = useCallback(() => {
        if (!currentGame || !currentGame.players) {
            return;
        }

        if (Object.keys(currentGame.players).length < 2) {
            return;
        }

        const activePlayer = Object.values(currentGame.players).find((x) => x.activePlayer);
        if (activePlayer && user && activePlayer.name === user.username) {
            let oldTitle = document.title;
            let msg = 'Alert!';
            let timeoutId = false;

            let blink = function () {
                document.title = document.title === msg ? oldTitle : msg;

                if (document.hasFocus()) {
                    document.title = oldTitle;
                    clearInterval(timeoutId);
                }
            };

            if (!timeoutId) {
                timeoutId = setInterval(blink, 500);
            }
        }
    }, [currentGame, user]);

    useEffect(() => {
        if (!localStorage) {
            setIncompatibleBrowser(true);
        } else {
            try {
                let token = localStorage.getItem('token');
                let refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const parsedToken = tryParseJSON(refreshToken);
                    if (parsedToken) {
                        dispatch(actions.setAuthTokens(token, parsedToken));
                        dispatch(actions.authenticate());
                    }
                }
            } catch (error) {
                setCannotLoad(true);
            }
        }

        dispatch(actions.loadCards());
        dispatch(actions.loadStandaloneDecks());
        dispatch(actions.loadAdventuringPartyDecks());
        dispatch(actions.loadFirstAdventureDecks());
        dispatch(actions.loadChimeraDecks());
        dispatch(actions.loadPveDecks());
        dispatch(actions.loadDualDuelDecks());
        dispatch(actions.loadOneCollectionDecks());
        dispatch(actions.loadAscendancyDecks());
        dispatch(actions.getAllPairings());

        $(document).ajaxError((event, xhr) => {
            if (xhr.status === 403) {
                navigate('/unauth');
            }
        });

        dispatch(actions.connectLobby());
        window.addEventListener('focus', onFocusChange);
        window.addEventListener('blur', onFocusChange);

        return () => {
            window.removeEventListener('focus', onFocusChange);
            window.removeEventListener('blur', onFocusChange);
        };
    }, [dispatch, navigate, onFocusChange]);

    useEffect(() => {
        blinkTab();
    }, [windowBlurred, blinkTab]);

    const path = location?.pathname || '/';

    let gameBoardVisible = currentGame && currentGame.started;

    let component = <AppRoutes user={user} currentGame={currentGame} />;

    if (incompatibleBrowser) {
        component = (
            <AlertPanel
                type='error'
                message='Your browser does not provide the required functionality for this site to work.  Please upgrade your browser.  The site works best with a recet version of Chrome, Safari or Firefox'
            />
        );
    } else if (cannotLoad) {
        component = (
            <AlertPanel
                type='error'
                message='This site requires the ability to store cookies and local site data to function.  Please enable these features to use the site.'
            />
        );
    }

    let background = 'ashesreborn';

    useEffect(() => {
        if (gameBoardVisible && user) {
            background = `${user?.settings?.background}`;

            if (bgRef.current && background === 'custom' && user.settings.customBackground) {
                const bgUrl = storageBaseUrl
                    ? `${storageBaseUrl}/bgs/${user.settings.customBackground}.png`
                    : `/img/bgs/${user.settings.customBackground}.png`;
                bgRef.current.style.backgroundImage = `url('${bgUrl}')`;
            } else if (bgRef.current) {
                bgRef.current.style.backgroundImage = `url('${backgrounds[background]}')`;
            }
        } else if (bgRef.current) {
            bgRef.current.style.backgroundImage = `url('${Background}')`;
        }
    }, [gameBoardVisible, user, backgrounds]);

    return (
        <div className='bg' ref={bgRef}>
            {!gameBoardVisible && <Navigation appName='Ashes Online' user={user} />}
            <Container className='content'>
                <ErrorBoundary errorPath={path} message={"We're sorry - something's gone wrong."}>
                    {component}
                </ErrorBoundary>
            </Container>
        </div>
    );
}

Application.displayName = 'Application';

export default Application;
