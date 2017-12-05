import React, { Component } from 'react';
import { Memo } from 'components';

class MemoList extends Component {
    render() {
        return (
            <div>
                <Memo />
            </div>
        )
    }
}

MemoList.propTypes = {
    data: React.PropTypes.array,
    currentUser: React.PropTypes.string
};

MemoList.defaultProps = {
    data: [],
    currentUser: ''
};

export default MemoList