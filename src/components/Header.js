import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'components';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Header extends Component {
    constructor(props) {
        super(props);

        /* IMPLEMENT: CREATE A SEARCH STATUS */
        this.state = {
            searchStatus: false
        };

        this.toggleSearch = this.toggleSearch.bind(this);
    }

    /* IMPLEMENT: CREATE toggleSearch METHOD THAT TOGGLES THE SEARCH STATE */
    toggleSearch() {
        this.setState(prevState => ({ searchStatus: !prevState.searchStatus }));
    }

    render() {
        const loginButton = (
            <li>
                <Link to="/login">
                    <i className="material-icons">vpn_key</i>
                </Link>
            </li>
        );

        const logoutButton = (
            <li>
                <a onClick={this.props.onLogout}>
                    <i className="material-icons">lock_open</i>
                </a>
            </li>
        );

        return (
            <div>
                <nav>
                    <div className="nav-wrapper blue darken-1">
                        <Link to="/" className="brand-logo center">MEMOPAD</Link>
                        <ul>
                            <li><a><i className="material-icons" onClick={this.toggleSearch}>search</i></a></li>
                        </ul>
                        <div className="right">
                            <ul>
                                { this.props.isLoggedIn ? logoutButton : loginButton }
                            </ul>
                        </div>
                    </div>
                </nav>
                <ReactCSSTransitionGroup transitionName="search" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                    { /* IMPLEMENT: SHOW SEARCH WHEN SEARCH STATUS IS TRUE */}
                    {this.state.searchStatus && <Search onClose={this.toggleSearch}
                                                        onSearch={this.props.onSearch}
                                                        usernames={this.props.usernames} />}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

Header.propTypes = {
    isLoggedIn: React.PropTypes.bool,
    onLogout: React.PropTypes.func
};

Header.defaultProps = {
    isLoggedIn: false,
    onLogout: () => { console.error('logout function not defined'); }
};

export default Header