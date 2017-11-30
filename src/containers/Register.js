import React, { Component } from 'react';
import { Authentication } from 'components';
import { connect } from 'react-redux';
import { registerRequest } from 'actions/authentication';

// import history from '../history';

class Register extends Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleRegister(id, pw) {
        return this.props.registerRequest(id, pw).then( () => {
            if (this.props.status === 'SUCCESS') {
                Materialize.toast('Success! Please log in.', 2000);
                // history.push('/login');
                return true;
            } else {
                const errorMessage = [
                    'Invalid Username',
                    'Password is too short',
                    'Username already exists'
                ];

                const $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.errorCode - 1] + '</span>');
                Materialize.toast($toastContent, 2000);
                return false;
            }
        });
    }

    render () {
        return (
            <div>
                <Authentication mode={false} onRegister={this.handleRegister} />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.register.status,
        errorCode: state.authentication.register.error
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        registerRequest: (id, pw) => {
            return dispatch(registerRequest(id, pw));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register)