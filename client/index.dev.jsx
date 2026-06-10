import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import 'bootstrap/dist/js/bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import './i18n';
import Application from './Application';
import { BrowserRouter } from 'react-router-dom';

const store = configureStore();

let ApplicationComponent = Application;

const render = () => {
    const App = ApplicationComponent;
    const root = ReactDOM.createRoot(document.getElementById('component'));
    root.render(
        <Provider store={store}>
            <BrowserRouter>
                <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
                    <div className='body'>
                        <ToastContainer
                            autoClose={4000}
                            position='top-right'
                        />
                        <App />
                    </div>
                </DndProvider>
            </BrowserRouter>
        </Provider>
    );
};

if (import.meta.hot) {
    import.meta.hot.accept('./Application', (mod) => {
        ApplicationComponent = mod.default;
        setTimeout(render);
    });
}

render();

