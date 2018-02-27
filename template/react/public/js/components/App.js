import React, { Component } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

import Header from "./header/Header";
import Footer from "./footer/Footer";
import Content from './Content'

class App extends Component {
    render () {
        return [
            <Header key='header' />,
            <Route key='rootPath' exact path='/' render={ () => <Redirect from='/' to='/content' push={ false } /> } />,
            <Route key='content' path='/content' component={ Content } />,
            <Footer key='footer' />
        ]
    }
}

export default App