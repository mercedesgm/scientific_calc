const priority = {
    '-' : 0,
    '+': 0,
    '*': 1,
    '/': 1
}
//Number
//Operator
//Parenthetical

// 6 + 6 * 4 / 6 / 3 * 7 + 7
//export default
class OperationsTree {

    constructor(expr) {
        console.log(expr)
        this.allRoots = [new OperationsTreeNode(Number(expr[0]))]
        for (let i = 1; i < expr.length; i++) {
            this.addNode(expr[i])
        }
    }

    evaluate() {
        return this.allRoots[0].evaluate()
    }

    isOperator(data) {
        return priority[data] === 0 || priority[data] === 1
    }

    isNumber(data) {
        return data.match(/^((\.[0-9]+)|([0-9]+)(\.[0-9]*)?)$/)
    }

    isParenthetical(data) {
        return data[data.length-1] === '(' 
    }

    workingRoot() {
        return this.allRoots[this.allRoots.length-1]
    }

    setWorkingRoot(wr) {
        this.allRoots[this.allRoots.length-1] = wr
    }

    addNode(data) {
        if (this.isNumber(data)) {
            this.setWorkingRoot(this.workingRoot().addValueNode(Number(data)))
        }
        if (this.isOperator(data)) {
            this.setWorkingRoot(this.workingRoot().addOperatorNode(data))
        }
        if (this.isParenthetical(data)) {
            let newRoot = this.workingRoot().addParenNode('(')
            this.allRoots.push(newRoot)
        }
        if (data === ')') {
            this.allRoots.pop()
        }
    }
    prettyString() {
        return this.allRoots[0].prettyString()
    }
}


class OperationsTreeNode {
    constructor(data) {
        this.data = data
        this.left = null
        this.right = null
        this.parent = null
    }

    evaluate() {
        //recursively evaluates the expression in this tree.
        if (!this.left && !this.right) {
            return this.data
        } else {
            switch (this.data) {
                case '+':
                    return this.left.evaluate() + this.right.evaluate()
                case '-':
                    return this.left.evaluate() - this.right.evaluate()
                case '*':
                    return this.left.evaluate() * this.right.evaluate()
                case '/':
                    return this.left.evaluate() / this.right.evaluate()
                default: return this.right.evaluate()
                
            }
        }
    }

    getLast() {
        //returns the final element in the tree. Representing the rightmost element of the expression.
        let current = this
        while (current.right) {
            current = current.right
        }
        return current.left ? current.left : current
    }

    isOperator() {
        //returns whether the data in this node represents and operator
        return priority[this.data] === 0 || priority[this.data] === 1 || this.data == '('
    }

    getLastOperator() {
        //returns the operator that is rightmost in the expression represented by this tree
        if (this.isOperator() && !this.right) {
            return this
        } else {
            return this.getLast().parent
        }
    }

    addOperatorNode(data) {
        const newNode = new OperationsTreeNode (data)
        const lastOperator = this.getLastOperator()
        if (!lastOperator || priority[lastOperator.data] > priority[data]) {
            console.log('data', data, 'makes new root.', 'last operator:', (lastOperator)?lastOperator.data:null)
            newNode.left = this
            this.parent = newNode
            return newNode
        } else if (priority[lastOperator.data] === priority[data]) {
            console.log('data', data, 'operators equal.', 'last operator:', (lastOperator)?lastOperator.data:null)
            newNode.parent = lastOperator.parent
            lastOperator.parent = newNode
            newNode.left = lastOperator
            newNode.parent.right = newNode
            return this
        } else {
            console.log('data', data, 'steals and appends a child.', 'last operator:', lastOperator.data)
            const temp = lastOperator.right
            lastOperator.right = newNode
            newNode.left = temp
            if (temp) temp.parent = newNode
            newNode.parent = lastOperator
            return this
        }
    }

    addValueNode(data) {
        const newNode = new OperationsTreeNode (data)
        const lastOperator = this.getLastOperator()
        console.log('data', data, 'hangs number.', 'last operator:', lastOperator.data)

        if (lastOperator.right) throw new Error('we fucked up')
        lastOperator.right = newNode
        newNode.parent = lastOperator
        return this
    }

    addParenNode(data) {
        //does the same thing as adding a value, except it isn't a number.
        const newNode = new OperationsTreeNode(data)
        const lastOperator = this.getLastOperator()
        console.log('data', data, 'hang paren.', 'last operator:', lastOperator.data)
        lastOperator.right = newNode
        newNode.parent = lastOperator
        return newNode
    }

    prettyString(buffer='', prefix='',childrenPrefix='') {
        buffer+=prefix;
        if (this.data === '-') {
            buffer+='_'
        } else {
            buffer+=this.data;
        }
        buffer+='\n'
        if (this.left) {
            buffer = this.left.prettyString(buffer, childrenPrefix + "├── ", childrenPrefix + "│   ")
        }
        if (this.right) {
            buffer = this.right.prettyString(buffer, childrenPrefix + "└── ", childrenPrefix + "    ")
        }
        return buffer
    }
}

// const expString = '6 + 6 * 4 / 6 / 3 * 7 + 7'
const expString = '7 + 7 * 3 / 6 / 4 * ( 6 - 6 * 6 ) - 12'
const expLs = expString.split(' ')

const tree = new OperationsTree(expLs)

console.log(tree.prettyString())
console.log(tree.evaluate())


