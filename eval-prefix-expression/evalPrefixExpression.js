// This solution uses tree concepts to simulate nesting in prefix operations.
const evalPreFix = (expression, variables) => {
  function nodeObject(value) {
    this.value = value
    this.prev = null
    this.number = null
  }
  
  const expArr = expression.split(' ')
  const operators = ['+', '-', '/', '*']
  const operatorNode = new nodeObject(null)
  let curr = operatorNode
  let prev = curr
  let evalNum

  expArr.forEach(e => {
    // If you get an operator,
    // Add to tree if a node exists, else create a node in the tree with the operator as value
    if (operators.includes(e)) {
      if (curr.value) {
        prev = curr
        curr = new nodeObject(e)
        curr.prev = prev
      } else {
        curr.value = e
      }
    // If you get a number,
    // Add to tree node if tree node doesn't have a number, else evaluate the operator of the node with the node's number and the new number
    // Then check if the previous node has a number value, if it has a number value, evaluate the operator of that node
    // Do the latter while the previous node has a number value
    // If there is no previous node, set the current node operator value to null and have the evaluated number as its number
    } else if (Number.isInteger(Number(e))) {
      if (curr.number) {
        evalNum = Math.floor(eval(curr.number + curr.value + e))
        if (curr.prev) {
          curr = curr.prev
          while(curr.number !== null) {
            evalNum = Math.floor(eval(curr.number + curr.value + evalNum))
            if (curr.prev) curr = curr.prev
            else {
              curr.value = null
              break
            }
          }
          curr.number = evalNum
        } else {
          curr.value = null
          curr.number = evalNum
        }
      } else {
        curr.number = e
      }
    // If you don't get a number, check if its a variable then get the variables number
    } else if (variables && variables.hasOwnProperty(e)) {
      if (curr.number) {
        evalNum = Math.floor(eval(curr.number + curr.value + variables[e]))
        if (curr.prev) {
          curr = curr.prev
          while(curr.number !== null) {
            evalNum = Math.floor(eval(curr.number + curr.value + evalNum))
            if (curr.prev) curr = curr.prev
            else {
              curr.value = null
              break
            }
          }
          curr.number = evalNum
        } else {
          curr.value = null
          curr.number = evalNum
        }
      } else {
        curr.number = variables[e]
      }
    // We got something unexpected so we just terminate the program
    } else {
      return null
    }
  })
  if (curr.value === null && curr.prev === null) {
    return curr.number
  } else {
    return null
  }
}

console.log(evalPreFix('+ 6 * - 4 + 2 3 8'))
console.log(evalPreFix('- + * 2 3 * 5 4 9'))
console.log(evalPreFix('* * * 2 2 1'))
console.log(evalPreFix('+ 1 2 * 5'))
console.log(evalPreFix('+ 1 x', {x:2}))
console.log(evalPreFix('+ 1 x'))