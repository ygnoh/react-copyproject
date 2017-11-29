import React from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { App, Home, Login, Register } from 'containers';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from 'reducers';
import thunk from 'redux-thunk';

const store = createStore(reducers, applyMiddleware(thunk));

const rootElement = document.getElementById('root');
ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <Route exact path="/" component={App}/>
                <Route path="/home" component={Home}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
            </div>
        </BrowserRouter>
    </Provider>, rootElement
);
