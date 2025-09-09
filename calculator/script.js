// Calculator switching functionality
document.getElementById("basicBtn").addEventListener("click", () => {
  showCalculator("basic")
})
document.getElementById("scientificBtn").addEventListener("click", () => {
  showCalculator("scientific")
})
function showCalculator(type) {
  const basicCalc = document.getElementById("basicCalculator")
  const scientificCalc = document.getElementById("scientificCalculator")
  const basicBtn = document.getElementById("basicBtn")
  const scientificBtn = document.getElementById("scientificBtn")

  if (type === "basic") {
    basicCalc.style.display = "block"
    scientificCalc.style.display = "none"
    basicBtn.classList.add("active")
    scientificBtn.classList.remove("active")
  } else {
    basicCalc.style.display = "none"
    scientificCalc.style.display = "block"
    scientificBtn.classList.add("active")
    basicBtn.classList.remove("active")
  }
}
// Basic Calculator Class
class BasicCalculator {
  constructor() {
    this.display = document.getElementById("basicDisplay")
    this.currentInput = "0"
    this.expression = ""
    this.justCalculated = false
    this.openParentheses = 0
  }
  updateDisplay() {
    // Show the expression if it exists, otherwise show current input
    if (this.expression && !this.justCalculated) {
      this.display.textContent = this.expression
    } else {
      this.display.textContent = this.currentInput
    }
  }
  clear() {
    this.currentInput = "0"
    this.expression = ""
    this.justCalculated = false
    this.openParentheses = 0
    this.updateDisplay()
  }
  inputNumber(num) {
    if (this.justCalculated) {
        this.currentInput = num
        this.expression = num
        this.justCalculated = false
    } else if (this.currentInput === "0") {
        this.currentInput = num
        this.expression = this.expression === "" ? num : this.expression + num
    } else if (this.currentInput === "-0") {
        this.currentInput = "-" + num
        this.expression = this.expression.slice(0, -2) + "-" + num
    } else if (this.currentInput === "-") {
        this.currentInput = "-" + num
        this.expression += num
    } else {
        this.currentInput += num
        this.expression += num
    }
    this.updateDisplay()
    }
  inputDecimal() {
    if (this.justCalculated) {
      this.currentInput = "0."
      this.expression = "0."
      this.justCalculated = false
    } else if (this.currentInput.indexOf(".") === -1) {
      if (this.currentInput === "0" || this.isLastCharOperator()) {
        this.currentInput = "0."
        this.expression += "0."
      } else {
        this.currentInput += "."
        this.expression += "."
      }
    }
    this.updateDisplay()
  }
  inputOperator(operator) {
    if (this.justCalculated) {
      this.expression = this.currentInput + operator
      this.justCalculated = false
    } else if (!this.isLastCharOperator() && this.expression !== "") {
      this.expression += operator
    } else if (this.expression === "") {
  // Allow negative numbers at the start
        if (operator === "-") {
        this.expression = "-"
        this.currentInput = "-"
        this.updateDisplay()
        return
    }
    } else if (this.isLastCharOperator()) {
      // Replace the last operator
      this.expression = this.expression.slice(0, -1) + operator
    }
    this.currentInput = "0"
    this.updateDisplay()
  }
  isLastCharOperator() {
    const lastChar = this.expression.slice(-1)
    return ["+", "-", "×", "÷"].includes(lastChar)
  }
  calculate() {
    try {
      if (this.expression === "" || this.expression === "0") {
        return
      }
      // Check for balanced parentheses
      const openCount = (this.expression.match(/\(/g) || []).length
      const closeCount = (this.expression.match(/\)/g) || []).length
      if (openCount !== closeCount) {
        this.currentInput = "Error: Unmatched parentheses"
        this.updateDisplay()
        return
      }
      // Replace operators for evaluation
      let expression = this.expression
      expression = expression.replace(/×/g, "*")
      expression = expression.replace(/÷/g, "/")
      // Evaluate the expression
      const result = Function('"use strict"; return (' + expression + ")")()
      if (isNaN(result) || !isFinite(result)) {
        this.currentInput = "Error"
      } else {
        this.currentInput = String(Math.round(result * 1e10) / 1e10)
        this.justCalculated = true
      }
    } catch (error) {
      this.currentInput = "Error"
    }
    this.updateDisplay()
    this.openParentheses = 0
  }
  percentage() {
    if (this.currentInput !== "0" && this.currentInput !== "Error") {
      const value = Number.parseFloat(this.currentInput)
      const result = value / 100
      this.currentInput = String(result)
      if (this.justCalculated) {
        this.expression = this.currentInput
      } else {
        // Replace the last number in expression with the percentage result
        this.expression = this.expression.replace(/[\d.]+$/, this.currentInput)
      }
      this.updateDisplay()
    }
  }
  toggleSign() {
    if (this.currentInput === "0") {
      // Allow starting with negative number
      this.currentInput = "-0"
      if (this.expression === "") {
        this.expression = "-0"
      } else {
        this.expression += "-0"
      }
    } else if (this.currentInput === "-0") {
      // Toggle back to positive
      this.currentInput = "0"
      this.expression = this.expression.slice(0, -2) + "0"
    } else if (this.currentInput !== "Error") {
      if (this.currentInput.startsWith("-")) {
        this.currentInput = this.currentInput.slice(1)
      } else {
        this.currentInput = "-" + this.currentInput
      }
      if (this.justCalculated) {
        this.expression = this.currentInput
      } else {
        // Replace the last number in expression with the signed result
        this.expression = this.expression.replace(/[\d.-]+$/, this.currentInput)
      }
    }
    this.updateDisplay()
  }
  inputOpenParenthesis() {
    if (this.justCalculated) {
      this.expression = "("
      this.justCalculated = false
    } else if (this.currentInput === "0" && this.expression === "") {
      this.expression = "("
    } else {
      this.expression += "("
    }
    this.openParentheses++
    this.currentInput = "0"
    this.updateDisplay()
  }
  inputCloseParenthesis() {
    if (this.openParentheses > 0 && !this.isLastCharOperator()) {
      this.expression += ")"
      this.openParentheses--
      this.updateDisplay()
    }
  }
  backspace() {
    if (this.justCalculated) {
      this.clear()
      return
    }
    if (this.expression.length > 0) {
      const lastChar = this.expression.slice(-1)
      if (lastChar === "(") {
        this.openParentheses--
      } else if (lastChar === ")") {
        this.openParentheses++
      }
      this.expression = this.expression.slice(0, -1)
      // Update current input to show the last number in the expression
      const matches = this.expression.match(/[\d.]+$/)
      if (matches) {
        this.currentInput = matches[0]
      } else {
        this.currentInput = "0"
      }
      this.updateDisplay()
    } else {
      this.currentInput = "0"
      this.updateDisplay()
    }
  }
}
// Scientific Calculator Class
class ScientificCalculator extends BasicCalculator {
  constructor() {
    super()
    this.display = document.getElementById("scientificDisplay")
    this.angleMode = "deg" // 'deg' or 'rad'
  }
  inputNumber(num) {
    if (num === "π") {
      if (this.justCalculated) {
        this.currentInput = String(Math.PI)
        this.expression = String(Math.PI)
        this.justCalculated = false
      } else if (this.currentInput === "0" && this.expression === "") {
        this.currentInput = String(Math.PI)
        this.expression = String(Math.PI)
      } else {
        this.expression += "*" + Math.PI
      }
    } else if (num === "e") {
      if (this.justCalculated) {
        this.currentInput = String(Math.E)
        this.expression = String(Math.E)
        this.justCalculated = false
      } else if (this.currentInput === "0" && this.expression === "") {
        this.currentInput = String(Math.E)
        this.expression = String(Math.E)
      } else {
        this.expression += "*" + Math.E
      }
    } else {
      super.inputNumber(num)
    }
    this.updateDisplay()
  }
  inputFunction(func) {
    if (this.justCalculated) {
      this.expression = func
      this.justCalculated = false
    } else if (this.currentInput === "0" && this.expression === "") {
      this.expression = func
    } else {
      this.expression += func
    }
    this.openParentheses++
    this.currentInput = "0"
    this.updateDisplay()
  }
  inputOperator(operator) {
    if (operator === "^2") {
      // For x^2, we need to wrap the last number/expression in parentheses if needed
      if (this.justCalculated) {
        this.expression = "(" + this.currentInput + ")^2"
        this.justCalculated = false
      } else {
        // Find the last number or parenthetical expression
        const lastNumberMatch = this.expression.match(/([\d.]+|$$[^)]+$$)$/)
        if (lastNumberMatch) {
          const lastNumber = lastNumberMatch[0]
          this.expression = this.expression.slice(0, -lastNumber.length) + "(" + lastNumber + ")^2"
        }
      }
      this.updateDisplay()
    } else if (operator === "^(-1)") {
      // For 1/x
      if (this.justCalculated) {
        this.expression = "1/(" + this.currentInput + ")"
        this.justCalculated = false
      } else {
        const lastNumberMatch = this.expression.match(/([\d.]+|$$[^)]+$$)$/)
        if (lastNumberMatch) {
          const lastNumber = lastNumberMatch[0]
          this.expression = this.expression.slice(0, -lastNumber.length) + "1/(" + lastNumber + ")"
        }
      }
      this.updateDisplay()
    } else if (operator === "^") {
      this.expression += "^"
      this.updateDisplay()
    } else {
      super.inputOperator(operator)
    }
  }
  calculate() {
    try {
      if (this.expression === "" || this.expression === "0") {
        return
      }
      // Check for balanced parentheses
      const openCount = (this.expression.match(/\(/g) || []).length
      const closeCount = (this.expression.match(/\)/g) || []).length
      if (openCount !== closeCount) {
        this.currentInput = "Error: Unmatched parentheses"
        this.updateDisplay()
        return
      }
      let expression = this.expression
      // Replace mathematical functions and constants
      expression = expression.replace(/sin\(/g, "Math.sin(")
      expression = expression.replace(/cos\(/g, "Math.cos(")
      expression = expression.replace(/tan\(/g, "Math.tan(")
      expression = expression.replace(/ln\(/g, "Math.log(")
      expression = expression.replace(/log\(/g, "Math.log10(")
      expression = expression.replace(/exp\(/g, "Math.exp(")
      expression = expression.replace(/abs\(/g, "Math.abs(")
      // Replace constants
      expression = expression.replace(/π/g, Math.PI)
      expression = expression.replace(/e(?![x\d])/g, Math.E)
      // Replace operators
      expression = expression.replace(/×/g, "*")
      expression = expression.replace(/÷/g, "/")
      expression = expression.replace(/\^/g, "**")
      // Convert degrees to radians for trigonometric functions if needed
      if (this.angleMode === "deg") {
        expression = expression.replace(/Math\.sin$$([^)]+)$$/g, "Math.sin(($1) * Math.PI / 180)")
        expression = expression.replace(/Math\.cos$$([^)]+)$$/g, "Math.cos(($1) * Math.PI / 180)")
        expression = expression.replace(/Math\.tan$$([^)]+)$$/g, "Math.tan(($1) * Math.PI / 180)")
      }
      // Evaluate the expression
      const result = Function('"use strict"; return (' + expression + ")")()
      if (isNaN(result) || !isFinite(result)) {
        this.currentInput = "Error"
      } else {
        // Round to avoid floating point precision issues
        this.currentInput = String(Math.round(result * 1e10) / 1e10)
        this.justCalculated = true
      }
    } catch (error) {
      this.currentInput = "Error"
    }
    this.updateDisplay()
    this.openParentheses = 0
  }
  toggleSign() {
    if (this.currentInput === "0") {
      // Allow starting with negative number
      this.currentInput = "-0"
      if (this.expression === "") {
        this.expression = "-0"
      } else {
        this.expression += "-0"
      }
    } else if (this.currentInput === "-0") {
      // Toggle back to positive
      this.currentInput = "0"
      this.expression = this.expression.slice(0, -2) + "0"
    } else if (this.currentInput !== "Error") {
      if (this.currentInput.startsWith("-")) {
        this.currentInput = this.currentInput.slice(1)
      } else {
        this.currentInput = "-" + this.currentInput
      }
      if (this.justCalculated) {
        this.expression = this.currentInput
      } else {
        // Replace the last number in expression with the signed result
        this.expression = this.expression.replace(/[\d.-]+$/, this.currentInput)
      }
    }
    this.updateDisplay()
  }
}
// Initialize calculators
const basicCalculator = new BasicCalculator()
const scientificCalculator = new ScientificCalculator()
// Keyboard support
document.addEventListener("keydown", (event) => {
  const key = event.key
  const activeCalc =document.getElementById("basicCalculator").style.display !== "none" ? basicCalculator : scientificCalculator
  if (key >= "0" && key <= "9") {
    activeCalc.inputNumber(key)
  } else if (key === ".") {
    activeCalc.inputDecimal()
  } else if (key === "+" || key === "-") {
    activeCalc.inputOperator(key)
  } else if (key === "*") {
    activeCalc.inputOperator("×")
  } else if (key === "/") {
    event.preventDefault()
    activeCalc.inputOperator("÷")
  } else if (key === "Enter" || key === "=") {
    event.preventDefault()
    activeCalc.calculate()
  } else if (key === "Escape" || key === "c" || key === "C") {
    activeCalc.clear()
  } else if (key === "Backspace") {
    event.preventDefault()
    activeCalc.backspace()
  } else if (key === "%") {
    activeCalc.percentage()
  } else if (key === "(") {
    activeCalc.inputOpenParenthesis()
  } else if (key === ")") {
    activeCalc.inputCloseParenthesis()
  }
})
