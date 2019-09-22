import React from 'react'

const NumButtons = (props) => {
    const numbers = []
    for (let i = 0; i <= 9; i++) {
        numbers.push(<button key={i} value={i} onClick={() => props.handleNum(String(i))}>{`${i}`}</button>)
    }
    return (
        <div>
            {numbers}
        </div>
    )
}

export default NumButtons