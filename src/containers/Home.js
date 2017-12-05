import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Write } from 'components';

class Home extends Component {
    render() {
        const write = (<Write />);
        return (
            <div>
                {this.props.isLoggedIn ? write : undefined}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.authentication.status.isLoggedIn
    };
};

export default connect(mapStateToProps)(Home)