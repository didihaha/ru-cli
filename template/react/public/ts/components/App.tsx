import * as React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { hot } from 'react-hot-loader'

import Header from "./header/Header"
import Footer from "./footer/Footer"
import Content from './Content'

class App extends React.Component {
    render () {
        return [
            <Header key='header' />,
            <Switch key='section'>
                <Route path="/content" component={ Content } />
                <Redirect from="/" to="/content" push={ false } />
            </Switch>,
            <Footer key='footer' />,
        ]
    }
}

export default hot(module)(App)