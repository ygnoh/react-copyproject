import React, { Component } from 'react';
import { Header } from 'components';
import { connect } from 'react-redux';
import { getStatusRequest } from 'actions/authentication';

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

const mapStateToProps = (state) => {
    return {
        status: state.authentication.status
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getStatusRequest: () => {
            return dispatch(getStatusRequest());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App)