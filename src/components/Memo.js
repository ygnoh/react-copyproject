import React, { Component } from 'react'
import TimeAgo from 'react-timeago';

class Memo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editMode: false,
            value: props.data.contents
        };

        this.toggleEdit = this.toggleEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleStar = this.handleStar.bind(this);
    }

    componentDidUpdate() {
        // triggered when logged in
        $('#dropdown-button-' + this.props.data._id).dropdown({
            belowOrigin: true // Display dropdown below the button
        });
    }

    componentDidMount() {
        // triggered when refreshed
        $('#dropdown-button-' + this.props.data._id).dropdown({
            belowOrigin: true // Display dropdown below the button
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        const current = {
            props: this.props,
            state: this.state
        };

        const next = {
            props: nextProps,
            state: nextState
        };

        return JSON.stringify(current) !== JSON.stringify(next);
    }

    toggleEdit() {
        if (this.state.editMode) {
            const id = this.props.data._id;
            const index = this.props.index;
            const contents = this.state.value;

            this.props.onEdit(id, index, contents).then(() => {
                this.setState((prevState) => {
                    return {
                        editMode: !prevState.editMode
                    };
                });
            });
        } else {
            this.setState((prevState) => {
                return {
                    editMode: !prevState.editMode
                };
            });
        }
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        });
    }

    handleRemove() {
        const id = this.props.data._id;
        const index = this.props.index;
        this.props.onRemove(id, index);
    }

    handleStar() {
        const id = this.props.data._id;
        const index = this.props.index;
        this.props.onStar(id, index);
    }

    render() {
        const {data, ownership} = this.props;
        const starStyle = (this.props.data.starred.indexOf(this.props.currentUser) > -1) ?
            { color: '#ff9980' } : {} ;
        const editedInfo =(
            <span style={{color: '#AAB5BC'}}> · Edited <TimeAgo date={this.props.data.date.edited} live={true}/></span>
        );
        const dropDownMenu = (
            <div className="option-button">
                <a className="dropdown-button"
                    id={`dropdown-button-${data._id}`}
                    data-activates={`dropdown-${data._id}`}>
                    <i className="material-icons icon-button">more_vert</i>
                </a>
                <ul id={`dropdown-${data._id}`} className="dropdown-content">
                    <li><a onClick={this.toggleEdit}>Edit</a></li>
                    <li><a onClick={this.handleRemove}>Remove</a></li>
                </ul>
            </div>
        );
        const memoView = (
            <div className="card">
                <div className="info">
                    <a className="username">{data.writer}</a> wrote a log * <TimeAgo date={data.date.created}/>
                    {data.is_edited ? editedInfo : undefined}
                    {ownership ? dropDownMenu : undefined}
                </div>
                <div className="card-content">
                    {data.contents}
                </div>
                <div className="footer">
                    <i
                        className="material-icons log-footer-icon star icon-button"
                        style={starStyle}
                        onClick={this.handleStar}
                    >star</i>
                    <span className="star-count">{data.starred.length}</span>
                </div>
            </div>
        );
        const editView = (
            <div className="write">
                <div className="card">
                    <div className="card-content">
                        <textarea className="materialize-textarea"
                            value={this.state.value}
                            onChange={this.handleChange}
                        ></textarea>
                    </div>
                    <div className="card-action">
                        <a onClick={this.toggleEdit}>OK</a>
                    </div>
                </div>
            </div>
        );

        return (
            <div className="container memo">
                {this.state.editMode ? editView : memoView}
            </div>
        );
    }
}

Memo.propTypes = {
    data: React.PropTypes.object,
    ownership: React.PropTypes.bool,
    onEdit: React.PropTypes.func,
    index: React.PropTypes.number,
    onRemove: React.PropTypes.func,
    onStar: React.PropTypes.func,
    starStatus: React.PropTypes.object,
    currentUser: React.PropTypes.string
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
    ownership: true,
    onEdit: (id, index, contents) => {
        console.error('onEdit function not defined');
    },
    index: -1,
    onRemove: (id, index) => {
        console.error('remove function not defined');
    },
    onStar: (id, index) => {
        console.error('star function not defined');
    },
    starStatus: {},
    currentUser: ''
};

export default Memo