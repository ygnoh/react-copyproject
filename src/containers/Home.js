import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Write } from 'components';
import { memoPostRequest } from 'actions/memo';

class Home extends Component {
    render() {
        return (
            <div className="wrapper">
                {this.props.isLoggedIn ? <Write/> : undefined}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.authentication.status.isLoggedIn,
        postStatus: state.memo.post
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        memoPostRequest: (contents) => {
            return dispatch(memoPostRequest(contents));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home)