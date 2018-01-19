import React, { Component } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

import Header from "./header/Header";
import Footer from "./footer/Footer";
import Content from './Content'

class App extends Component {
    render () {
        return [
            <Header key='header' />,
            <Switch key='content'>
                <Route path='/content' component={ Content } />
                <Redirect from='/' to='/content' push={ false } />
            </Switch>,
            <Footer key='footer' />
        ]
    }
}

export default App