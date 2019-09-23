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
export default class OperationsTree {

    constructor(expr) {
        console.log(expr)
        this.root = new OperationsTreeNode(Number(expr[0]))
        for (let i = 1; i < expr.length; i++) {
            this.root = this.addNode(expr[i])
        }
        this.allRoots = [this.root]
    }

    evaluate() {
        return this.root.evaluate()
    }

    isOperator(data) {
        return priority[data] === 0 || priority[data] === 1
    }

    addNode(data) {
        const numPattern = /(\.[0-9]+)|([0-9]+)(\.[0-9]*)?/
        if (data.match(numPattern)) {
            return this.root.addNode(Number(data))
        }
        if (this.isOperator(data)) {
            return this.root.addNode(data)
        } 
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
            }
        }
    }

    getLast() {
        let current = this
        while (current.right) {
            current = current.right
        }
        return current.left ? current.left : current
    }

    isOperator() {
        return priority[this.data] === 0 || priority[this.data] === 1
    }

    getLastOperator() {
        if (this.isOperator() && !this.right) {
            return this
        } else {
            return this.getLast().parent
        }
    }

    addNode(data) {
        //TODO: SOMETHING BETTER THAN TYPEOF like a set
        const newNode = new OperationsTreeNode (data)


        const lastOperator = this.getLastOperator()
        if (typeof data === 'number') {
            console.log('data', data, 'hangs number', 'last operator', lastOperator)
            if (lastOperator.right) throw new Error('we fucked up')
            lastOperator.right = newNode
            newNode.parent = lastOperator
            return this
        } else {

            if (!lastOperator || priority[lastOperator.data] > priority[data]) {
                console.log('data', data, 'makes new root', 'last operator', (lastOperator)?lastOperator.data:null)
                newNode.left = this
                this.parent = newNode
                return newNode
            } else if (priority[lastOperator.data] === priority[data]) {
                console.log('data', data, 'operators equal', 'last operator', (lastOperator)?lastOperator.data:null)
                newNode.parent = lastOperator.parent
                lastOperator.parent = newNode
                newNode.left = lastOperator
                newNode.parent.right = newNode
                return this
            } else {
                console.log('data', data, 'steals and appends a child', 'last operator', lastOperator.data)
                const temp = lastOperator.right
                lastOperator.right = newNode
                newNode.left = temp
                if (temp) temp.parent = newNode
                newNode.parent = lastOperator
                return this
            }
        }
    }

    prettyString(depth=0) {
        let st = this.data
        if (this.left) {
            st += '__' + this.left.prettyString(depth+1) + '\n'
        }
        if (this.right) {
            st += '  '.repeat(depth*2+1) + this.right.prettyString(depth+1) + '\n'
        }
        return st
    }
}

// OperationsTree.evaluateList=(ls)=>{

//}

//const expString = '6 + 6 * 4 / 6 / 3 * 7 + 7'
// const expString = '7 + 7 * 3 / 6 / 4 * 6 + 6'
// const expLs = expString.split(' ')

// const tree = new OperationsTree(expLs)

// console.log(tree.evaluate())
// console.log(tree.root.prettyString())

