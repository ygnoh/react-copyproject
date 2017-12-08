import React, { Component } from 'react'

class Wall extends Component {
    render() {
        return (
            <div>
                {this.props.match.params.username}
            </div>
        )
    }
}

export default Wall