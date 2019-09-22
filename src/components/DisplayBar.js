import React from 'react'

const DisplayBar = (props) => {

    return (
        <div style={{border: '1px solid red'}}>
            <p>History detail in small text here</p>
            <p>{props.expression.join(' ')}</p>
        </div>
    )
}

export default DisplayBar