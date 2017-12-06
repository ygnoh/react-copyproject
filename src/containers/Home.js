import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Write, MemoList } from 'components';
import { memoPostRequest, memoListRequest } from 'actions/memo';

class Home extends Component {
    constructor(props) {
        super(props);

        this.handlePost = this.handlePost.bind(this);
        this.loadNewMemo = this.loadNewMemo.bind(this);

        this.state = {
            loadingState: false
        };
    }

    componentDidMount() {
        const loadMemoLoop = () => {
            this.loadNewMemo().then(() => {
                // recursive하므로 loadMemoLoop을 매 5초간 실행하게 된다
                this.memoLoaderTimeoutId = setTimeout(loadMemoLoop, 5000);
            })
        };

        // component가 마운트되면 메모를 불러온다 (isInitial=true)
        this.props.memoListRequest(true).then(() => {
            // 그런 후 부터는 5초마다 새 메모를 불러온다
            loadMemoLoop();
        });

        // infinite scroll
        $(window).scroll(() => {
            // 페이지 하단이 250 픽셀 보다 적게 남아있을 경우
            if ($(document).height() - $(window).height() - $(window).scrollTop() < 250) {
                if (!this.state.loadingState) {
                    console.log("Load now");
                    this.setState({
                        loadingState: true
                    });
                }
            } else {
                if (this.state.loadingState) {
                    this.setState({
                        loadingState: false
                    });
                }
            }
        });
    }

    componentWillUnmount() {
        clearTimeout(this.memoLoaderTimeoutId);
    }

    loadNewMemo() {
        if (this.props.listStatus === 'WAITING') {
            return new Promise((resolve, reject) => {
                resolve();
            });
        }

        if (this.props.memoData.length === 0) {
            return this.props.memoListRequest(true);
        }

        return this.props.memoListRequest(false, 'new', this.props.memoData[0]._id);
    }

    handlePost(contents) {
        return this.props.memoPostRequest(contents).then(() => {
            if (this.props.postStatus.status === 'SUCCESS') {
                this.loadNewMemo().then(() => {
                    Materialize.toast('Success!', 2000);
                });
            } else {
                let $toastContent;

                switch(this.props.postStatus.error) {
                    case 1:
                        $toastContent = $('<span style="color: #FFB4BA">You are not logged in</span>');
                        Materialize.toast($toastContent, 2000);
                        setTimeout(() => {location.reload(false);}, 2000);
                        break;

                    case 2:
                        $toastContent = $('<span style="color: #FFB4BA">Please write something</span>');
                        Materialize.toast($toastContent, 2000);
                        break;

                    default:
                        $toastContent = $('<span style="color: #FFB4BA">Something Broke</span>');
                        Materialize.toast($toastContent, 2000);
                        break;
                }
            }
        });
    }

    render() {
        const write = (
            <Write onPost={this.handlePost} />
        );

        return (
            <div className="wrapper">
                {this.props.isLoggedIn ? write : undefined}
                <MemoList data={this.props.memoData} currentUser={this.props.currentUser}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.authentication.status.isLoggedIn,
        postStatus: state.memo.post,
        currentUser: state.authentication.status.currentUser,
        memoData: state.memo.list.data,
        listStatus: state.memo.list.status
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        memoPostRequest: (contents) => {
            return dispatch(memoPostRequest(contents));
        },
        memoListRequest: (isInitial, listType, id, username) => {
            return dispatch(memoListRequest(isInitial, listType, id, username));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home)