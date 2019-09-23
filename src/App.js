import React from 'react';
import './App.css';
import NumButtons from './components/NumButtons'
import DisplayBar from './components/DisplayBar'
import ArithmeticButtons from './components/ArithmeticButtons'
import OperationsTree from './evaluation'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      expression: [],
      value: 0,
      history : []
    }
    this.getLastExpressionElement = this.getLastExpressionElement.bind(this)
    this.handleNumberClick = this.handleNumberClick.bind(this)
    this.handleOperatorClick = this.handleOperatorClick.bind(this)
    this.handleEval = this.handleEval.bind(this)
  }

  getLastExpressionElement() {
    return this.state.expression[this.state.expression.length - 1]
  }

  handleNumberClick(num) {
    const lastElement = this.getLastExpressionElement()
    const numExp = /[0-9]+/

    if (!this.state.expression.length) {
      this.setState({
        expression: [...this.state.expression, num]
      })
    } else if (lastElement.match(numExp)) {
      let expressionCopy = this.state.expression.map(el => el)
      expressionCopy[expressionCopy.length - 1] += num
      this.setState({expression: expressionCopy})
    } else {
      this.setState({
        expression: [...this.state.expression, num]
      })
    }
  }

  handleOperatorClick(event) {
    const op = event.target.value
    const lastElement = this.getLastExpressionElement()
    const opExp = /[+\-*/]/
    if (lastElement.match(opExp)) {
      let expressionCopy = this.state.expression.map(el => el)
      expressionCopy[expressionCopy.length - 1] = op
      this.setState({
        expression: expressionCopy
      })
    } else {
      this.setState({
        expression: [...this.state.expression, op]
      })
    }
  }

  handleEval() { // when we press equal sign
    console.log('hey')
    const tree = new OperationsTree(this.state.expression)
    this.setState({history: [...this.state.history, tree.evaluate()], expression: []})
  }

  render() {
    console.log('state', this.state)
    return (
      <div className="App">
        <DisplayBar expression={this.state.expression}/>
        <ArithmeticButtons handleOp={this.handleOperatorClick} evaluate={this.handleEval}/>
        <NumButtons handleNum={this.handleNumberClick}/>
        <div>
          <h1>History: {this.state.history.join(", ")}</h1>
        </div>
      </div>
    );
  }
}

export default App;
