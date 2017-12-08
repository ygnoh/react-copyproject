import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Write, MemoList } from 'components';
import {
    memoPostRequest,
    memoListRequest,
    memoEditRequest,
    memoRemoveRequest,
    memoStarRequest
} from 'actions/memo';

class Home extends Component {
    constructor(props) {
        super(props);

        this.handlePost = this.handlePost.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleStar = this.handleStar.bind(this);
        this.loadNewMemo = this.loadNewMemo.bind(this);
        this.loadOldMemo = this.loadOldMemo.bind(this);

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

        const loadUntilScrollable = () => {
            // 스크롤이 생기지 않는 경우
            if ($('body').height() < $(window).height()) {
                this.loadOldMemo().then(() => {
                    if (!this.props.isLast) {
                        // 스크롤이 생길 때까지 재귀 호출
                        loadUntilScrollable();
                    }
                });
            }
        };

        // component가 마운트되면 메모를 불러온다 (isInitial=true)
        this.props.memoListRequest(true).then(() => {
            // 스크롤이 존재하는지 확인
            loadUntilScrollable();
            // 5초 마다 새 메모를 불러온다
            loadMemoLoop();
        });

        // infinite scroll
        $(window).scroll(() => {
            // 페이지 하단이 250 픽셀 보다 적게 남아있을 경우
            if ($(document).height() - $(window).height() - $(window).scrollTop() < 250) {
                if (!this.state.loadingState) {
                    this.loadOldMemo();
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

        $(window).unbind();
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

    loadOldMemo() {
        if (this.props.isLast) {
            return new Promise((resolve, reject) => {
                resolve();
            });
        }

        const memoData = this.props.memoData;
        const lastId = memoData[memoData.length - 1]._id;

        // 6개 단위의 메모를 전달 받는다
        return this.props.memoListRequest(false, 'old', lastId).then(() => {
            // 6개 미만이면 마지막 페이지
            if (this.props.isLast) {
                Materialize.toast('You are reading the last page', 2000);
            }
        });
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

    handleEdit(id, index, contents) {
        return this.props.memoEditRequest(id, index, contents).then(() => {
            if (this.props.editStatus.status === 'SUCCESS') {
                Materialize.toast('Success!', 2000);
            } else {
                const errorMessage = [
                    'Something broke',
                    'Please write something',
                    'You are not logged in',
                    'That memo does not exist anymore',
                    'You do not have permission'
                ];

                const error = this.props.editStatus.error;

                const $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[error - 1] + '</span>');
                Materialize.toast($toastContent, 2000);

                // if not logged in
                if (error === 3) {
                    setTimeout(() => {
                        location.reload(false)
                    }, 2000);
                }

            }
        });
    }

    handleRemove(id, index) {
        this.props.memoRemoveRequest(id, index).then(() => {
            if (this.props.removeStatus.status === 'SUCCESS') {
                setTimeout(() => {
                    if ($('body').height() < $(window).height()) {
                        this.loadOldMemo();
                    }
                }, 1000);
            } else {
                const errorMessage = [
                    'Something broke',
                    'You are not logged in',
                    'That memo does not exist',
                    'You do not have permission'
                ];

                const $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.removeStatus.error - 1] + '</span>');
                Materialize.toast($toastContent, 2000);

                if (this.props.removeStatus.error === 2) {
                    setTimeout(()=> {
                        location.reload(false);
                    }, 2000);
                }
            }
        })
    }

    handleStar(id, index) {
        this.props.memoStarRequest(id, index).then(() => {
            if (this.props.starStatus.status !== 'SUCCESS') {
                const errorMessage = [
                    'Something broke',
                    'You are not logged in',
                    'That memo does not exist'
                ];

                const $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.starStatus.error - 1] + '</span>');
                Materialize.toast($toastContent, 2000);

                if (this.props.starStatus.error === 2) {
                    setTimeout(() => {
                        location.reload(false);
                    }, 2000);
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
                <MemoList data={this.props.memoData}
                    currentUser={this.props.currentUser}
                    onEdit={this.handleEdit}
                    onRemove={this.handleRemove}
                    onStar={this.handleStar}
                />
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
        listStatus: state.memo.list.status,
        isLast: state.memo.list.isLast,
        editStatus: state.memo.edit,
        removeStatus: state.memo.remove,
        starStatus: state.memo.star
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        memoPostRequest: (contents) => {
            return dispatch(memoPostRequest(contents));
        },
        memoListRequest: (isInitial, listType, id, username) => {
            return dispatch(memoListRequest(isInitial, listType, id, username));
        },
        memoEditRequest: (id, index, contents) => {
            return dispatch(memoEditRequest(id, index, contents));
        },
        memoRemoveRequest: (id, index) => {
            return dispatch(memoRemoveRequest(id, index));
        },
        memoStarRequest: (id, index) => {
            return dispatch(memoStarRequest(id, index));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home)