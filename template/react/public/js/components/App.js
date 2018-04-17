import React, { Component } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { hot } from 'react-hot-loader'
import Loadable from 'react-loadable'

import Header from "./header/Header";
import Footer from "./footer/Footer";

// 公共加载动画组件
const Loading = () => (
    <div>请替换成各自的加载动画</div>
)

// 异步加载路由
const LoadContent = Loadable({
    loader: () => import('./Content'),
    loading: Loading
})

class App extends Component {
    render () {
        return [
            <Header key='header' />,
            <Switch key='section'>
                <Route path="/content" component={ LoadContent } />
                <Redirect from="/" to="/content" push={ false } />
            </Switch>,
            <Footer key='footer' />,
        ]
    }
}

export default hot(module)(App)