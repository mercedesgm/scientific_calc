import React from 'react'


const ArithmeticButtons = (props) => {
    return (
        <div>
            <button value='/' onClick={props.handleOp}>÷</button>
            <button value='*' onClick={props.handleOp}>×</button>
            <button value='-' onClick={props.handleOp}>-</button>
            <button value='+' onClick={props.handleOp}>+</button>
            <button value='=' onClick={props.handleOp}>=</button>
        </div>
    )
}

export default ArithmeticButtons