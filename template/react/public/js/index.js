//入口文件

import '../less/index.less'
import 'regenerator-runtime/runtime'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import classnames from 'classnames'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import reducer from './reducers'
import Login from './components/Login'

let store = createStore(reducer, applyMiddleware(thunkMiddleware));

console.log(`当前处于 ${process.env.NODE_ENV} 环境`)

render(
    <Provider store={store}>
        <Router>
            <Switch>
                <Route path='/login' component={ Login } />
                <Redirect from='/' to='/login' push={ false } />
            </Switch>
        </Router>
    </Provider>,
    document.getElementById('target')
)
