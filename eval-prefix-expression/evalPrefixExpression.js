// This solution uses tree concepts to simulate nesting in prefix operations.
// This solution assumes that the expression does not have variables that have variables as value i.e. '+ 2 a' where in the var object a = b and where b = 2.
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
    // If you don't get a number, check if its a variable, then check if the variable value is a number
    } else if (variables && variables.hasOwnProperty(e) && Number.isInteger(Number(variables[e]))) {
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
    // We got something unexpected so we terminate the program
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

// Tests
console.log(evalPreFix('+ 6 * - 4 + 2 3 8'))
console.log(evalPreFix('- + * 2 3 * 5 4 9'))
console.log(evalPreFix('* * * 2 2 1'))
console.log(evalPreFix('+ 1 2 * 5'))
console.log(evalPreFix('+ 1 x', {x:2}))
console.log(evalPreFix('+ 1 x'))

// ----------------------------------------------------------------------------------------------------------------------------------------------------------

// Previous solution -- Uses stacks! Logic is wrong because this solution can't fully simulate nested operations.
// Including this for documentation, might try and fix it in the future.
const evalPreFixPrev = (expression, variables) => {
  const expArr = expression.split(' ')
  const operators = ['+', '-', '/', '*']
  const operatorStack = []
  const numberStack = []
  let wasNumber = false
  let last = null

  expArr.forEach(e => {
    // If we see an operator, add it to the stack
    if (operators.includes(e)) {
      operatorStack.push(e)
      wasNumber = false
    // If number, add the number to the stack if the previous element was an operator
    // else process current stack if the previous element was a number
    // after processing the number, process previous numbers if there are more than 2 numbers in the stack
    } else if (isNumber(e)) {
      if (numberStack.length > 0 && operatorStack.length > 0 && wasNumber) {
        numberStack.push(eval(numberStack.pop() + operatorStack.pop() + e))
        // Only checking if  there are more than 2 numbers to avoid processing earlier numbers
        while(numberStack.length > 2 && operatorStack.length > 0) {
          last = numberStack.pop()
          numberStack.push(eval(numberStack.pop() + operatorStack.pop() + last))
        }
        wasNumber = true
      } else {
        numberStack.push(e)
        wasNumber = true
      }
    // If not number, check if it is a variable
    } else if (variables && variables.hasOwnProperty(e)) {
      if (numberStack.length > 0 && operatorStack.length > 0 && wasNumber) {
        numberStack.push(eval(numberStack.pop() + operatorStack.pop() + variables[e]))
        // Only checking if  there are more than 2 numbers to avoid processing earlier numbers
        while(numberStack.length > 2 && operatorStack.length > 0) {
          last = numberStack.pop()
          numberStack.push(eval(numberStack.pop() + operatorStack.pop() + last))
        }
        wasNumber = true
      } else {
        numberStack.push(variables[e])
        wasNumber = true
      }
    // Return null if we get anything invalid
    } else {
      return null
    }
  })

  // Process the last few numbers.
  while(numberStack.length > 1 && operatorStack.length > 0) {
    last = numberStack.pop()
    numberStack.push(eval(numberStack.pop() + operatorStack.pop() + last))
  }
  
  // Check if everything has been processed, if not return null
  // Also return null if there are excess operators
  if (operatorStack.length > 0 || numberStack.length > 1) {
    return null
  } else {
    return numberStack[0]
  }
  
}

const isNumber = (number) => {
  return Number.isInteger(Number(number))
}


// Fails in 2nd test.
console.log('prev')
console.log(evalPreFixPrev('+ 6 * - 4 + 2 3 8'))
console.log(evalPreFixPrev('- + * 2 3 * 5 4 9'))
console.log(evalPreFixPrev('* * * 2 2 1'))
console.log(evalPreFixPrev('+ 1 2 * 5'))
console.log(evalPreFixPrev('+ 1 x', {x:2}))
console.log(evalPreFixPrev('+ 1 x'))