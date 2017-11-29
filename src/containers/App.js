import React, { Component } from 'react';
import { Header } from 'components';

class App extends Component {
    render(){
        const re = /(login|register)/;
        const isAuth = re.test(this.props.location.pathname);

        return (
            <div>
                {isAuth ? undefined : <Header />}
                { this.props.children }
            </div>
        );
    }
}

export default App;