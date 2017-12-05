import React, { Component } from 'react'

class Memo extends Component {
    render() {
        return (
            <div className="container memo">
                <div className="card">
                    <div className="info">
                        <a className="username">Writer</a> wrote a log * 1 seconds ago
                        <div className="option-button">
                            <a className="dropdown-button" id="dropdown-button-id" data-activates="dropdown-id">
                                <i className="material-icons icon-button">more_vert</i>
                            </a>
                            <ul id="dropdown-id" className="dropdown-content">
                                <li><a>Edit</a></li>
                                <li><a>Remove</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="card-content">
                        Contents
                    </div>
                    <div className="footer">
                        <i className="material-icons log-footer-icon star icon-button">star</i>
                        <span className="star-count">0</span>
                    </div>
                </div>
            </div>
        );
    }
}

Memo.propTypes = {
    data: React.PropTypes.object,
    ownership: React.PropTypes.bool
};

Memo.defaultProps = {
    data: {
        _id: 'id1234567890',
        writer: 'Writer',
        contents: 'Contents',
        is_edited: false,
        data: {
            edited: new Date(),
            created: new Date()
        },
        starred: []
    },
    ownership: true
};

export default Memo