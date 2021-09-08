//入口文件

import './less/index.less'
import * as React from 'react'
import * as ReactDom from 'react-dom'
import {BrowserRouter as Router} from 'react-router-dom'
import App from './components/App'

ReactDom.render(
    <Router>
        <App/>
    </Router>,
    document.getElementById('target'))
