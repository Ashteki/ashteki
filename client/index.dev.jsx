import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import 'bootstrap/dist/js/bootstrap';
import ReduxToastr from 'react-redux-toastr';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { BrowserRouter } from 'react-router-dom';
import './i18n';

const store = configureStore();

const render = () => {
    const Application = require('./Application').default;
    const root = ReactDOM.createRoot(document.getElementById('component'));
    root.render(
        <Provider store={store}>
            <BrowserRouter>
                <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
                    <div className='body'>
                        <ReduxToastr
                            timeOut={4000}
                            newestOnTop
                            preventDuplicates
                            position='top-right'
                            transitionIn='fadeIn'
                            transitionOut='fadeOut'
                        />
                        <Application />
                    </div>
                </DndProvider>
            </BrowserRouter>
        </Provider>
    );
};

if (module.hot) {
    module.hot.accept('./Application', () => {
        setTimeout(render);
    });
}

render();
