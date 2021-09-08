import * as React from 'react'
import {Route, Redirect, Switch} from 'react-router-dom'

import Content from './Content'

class App extends React.Component {
    render() {
        return <Switch key='section'>
                <Route path="/content" component={Content}/>
                <Redirect from="/" to="/content" push={false}/>
            </Switch>
    }
}

export default App