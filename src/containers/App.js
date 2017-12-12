import React, { Component } from 'react';
import { Header } from 'components';
import { connect } from 'react-redux';
import { getStatusRequest, logoutRequest } from 'actions/authentication';
import { searchRequest } from 'actions/search';

class App extends Component {
    constructor(props) {
        super(props);

        this.handleLogout = this.handleLogout.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount() {
        function getCookie(name) {
            const value = '; ' + document.cookie;
            const parts = value.split('; ' + name + '=');
            if (parts.length === 2) {
                return parts.pop().split(';').shift();
            }
        }

        // get loginData from cookie
        let loginData = getCookie('key');

        if (typeof loginData === 'undefined') {
            return;
        }

        loginData = JSON.parse(atob(loginData));

        // if not logged in, return
        if (!loginData.isLoggedIn) {
            return;
        }

        /*
         * page refreshed and has a session in cookie,
         * check whether this cookie is valid or not
         */
        this.props.getStatusRequest().then( () => {
            console.log(this.props.status);

            if (!this.props.status.valid) {
                loginData = {
                    isLoggedIn: false,
                    username: ''
                };

                document.cookie = 'key=' + btoa(JSON.stringify(loginData));

                const $toastContent = $('<span style="color: #FFB4BA">Your session is expired, please log in again</span>');
                Materialize.toast($toastContent, 4000);
            }
        });
    }

    handleLogout() {
        this.props.logoutRequest().then( () => {
            Materialize.toast('Good Bye!', 2000);

            const loginData = {
                isLoggedIn: false,
                username: ''
            };

            document.cookie = 'key=' + btoa(JSON.stringify(loginData));
        });
    }

    handleSearch(keyword) {
        this.props.searchRequest(keyword).then(() => {
            if (this.props.searchStatus === 'SUCCESS') {
                if (this.props.usernames.length > 0) {
                    console.log('found');
                } else {
                    console.log('fail');
                }
            } else {
                let $toastContent = $('<span style="color: #FFB4BA">CAN\'T FIND THE USER</span>');
                Materialize.toast($toastContent, 2000);

                return false;
            }
        });
    }

    render(){
        const re = /(login|register)/;
        const isAuth = re.test(this.props.location.pathname);

        return (
            <div>
                {isAuth ? undefined : <Header isLoggedIn={this.props.status.isLoggedIn}
                                                onLogout={this.handleLogout}
                                                onSearch={this.handleSearch}
                                                usernames={this.props.usernames} />}
                { this.props.children }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.status,
        usernames: state.search.usernames,
        searchStatus: state.search.status
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getStatusRequest: () => {
            return dispatch(getStatusRequest());
        },
        logoutRequest: () => {
            return dispatch(logoutRequest());
        },
        searchRequest: (username) => {
            return dispatch(searchRequest(username))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App)