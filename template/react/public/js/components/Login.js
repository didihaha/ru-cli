import React, { Component } from 'react'

import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'

const Navgation = ({ to, label, isExact }) => (
    <Route path={ to } exact={ isExact } children={ ({ match }) => (
        <div>
            { match ? '>' : '' }<Link to={ to }>{ label }</Link>
        </div>
    ) } />
)

class Login extends Component {
    render () {
        return (
            '欢迎使用react'
        )
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.login
    }
}

export default connect(mapStateToProps)(Login)