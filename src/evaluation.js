const priority = {
    '-' : 0,
    '+': 0,
    '*': 1,
    '/': 1
}


class OperationsTree {
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
        const newNode = new OperationsTree (data)

        const lastElement = this.getLast()
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

OperationsTree.evaluateList=(ls)=>{
    let root = new OperationsTree(ls[0])
    for (let i = 1; i < ls.length; i++) {
        root = root.addNode(ls[i])
    }
    console.log(root.prettyString())
    return root.evaluate()
}

const expString = '5 + 5 / 2 - 6 * 7 + 4 / 3 + 7 / 0'
const expLs = expString.split(' ').map(el => {
    const numPattern = /([0-9]+)(\.[0-9]+)?/
    if (el.match(numPattern)) {
        return Number(el)
    } else return el
})
console.log(expLs)
console.log(BinaryTree.evaluateList(expLs))