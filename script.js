// Calculator switching functionality
document.getElementById("basicBtn").addEventListener("click", () => {
  showCalculator("basic")
})
document.getElementById("scientificBtn").addEventListener("click", () => {
  showCalculator("scientific")
})
document.getElementById("graphBtn").addEventListener("click", () => {
  showCalculator("graph")
})

function showCalculator(type) {
  const basicCalc = document.getElementById("basicCalculator")
  const scientificCalc = document.getElementById("scientificCalculator")
  const graphCalc = document.getElementById("graphCalculator")
  const basicBtn = document.getElementById("basicBtn")
  const scientificBtn = document.getElementById("scientificBtn")
  const graphBtn = document.getElementById("graphBtn")

  // Hide all calculators
  basicCalc.style.display = "none"
  scientificCalc.style.display = "none"
  graphCalc.style.display = "none"

  // Remove active class from all buttons
  basicBtn.classList.remove("active")
  scientificBtn.classList.remove("active")
  graphBtn.classList.remove("active")

  if (type === "basic") {
    basicCalc.style.display = "block"
    basicBtn.classList.add("active")
    document.querySelector(".container").style.maxWidth = "400px"
  } else if (type === "scientific") {
    scientificCalc.style.display = "block"
    scientificBtn.classList.add("active")
    document.querySelector(".container").style.maxWidth = "400px"
  } else if (type === "graph") {
    graphCalc.style.display = "block"
    graphBtn.classList.add("active")
    document.querySelector(".container").style.maxWidth = "900px"
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
      if (operator === "-") {
        this.expression = "-"
        this.currentInput = "-"
        this.updateDisplay()
        return
      }
    } else if (this.isLastCharOperator()) {
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
      const openCount = (this.expression.match(/\(/g) || []).length
      const closeCount = (this.expression.match(/\)/g) || []).length
      if (openCount !== closeCount) {
        this.currentInput = "Error: Unmatched parentheses"
        this.updateDisplay()
        return
      }
      let expression = this.expression
      expression = expression.replace(/×/g, "*")
      expression = expression.replace(/÷/g, "/")
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
        this.expression = this.expression.replace(/[\d.]+$/, this.currentInput)
      }
      this.updateDisplay()
    }
  }

  toggleSign() {
    if (this.currentInput === "0") {
      this.currentInput = "-0"
      if (this.expression === "") {
        this.expression = "-0"
      } else {
        this.expression += "-0"
      }
    } else if (this.currentInput === "-0") {
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
    this.angleMode = "deg"
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
      if (this.justCalculated) {
        this.expression = "(" + this.currentInput + ")^2"
        this.justCalculated = false
      } else {
        const lastNumberMatch = this.expression.match(/([\d.]+|$$[^)]+$$)$/)
        if (lastNumberMatch) {
          const lastNumber = lastNumberMatch[0]
          this.expression = this.expression.slice(0, -lastNumber.length) + "(" + lastNumber + ")^2"
        }
      }
      this.updateDisplay()
    } else if (operator === "^(-1)") {
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
      const openCount = (this.expression.match(/\(/g) || []).length
      const closeCount = (this.expression.match(/\)/g) || []).length
      if (openCount !== closeCount) {
        this.currentInput = "Error: Unmatched parentheses"
        this.updateDisplay()
        return
      }
      let expression = this.expression
      expression = expression.replace(/sin\(/g, "Math.sin(")
      expression = expression.replace(/cos\(/g, "Math.cos(")
      expression = expression.replace(/tan\(/g, "Math.tan(")
      expression = expression.replace(/ln\(/g, "Math.log(")
      expression = expression.replace(/log\(/g, "Math.log10(")
      expression = expression.replace(/exp\(/g, "Math.exp(")
      expression = expression.replace(/abs\(/g, "Math.abs(")
      expression = expression.replace(/π/g, Math.PI)
      expression = expression.replace(/e(?![x\d])/g, Math.E)
      expression = expression.replace(/×/g, "*")
      expression = expression.replace(/÷/g, "/")
      expression = expression.replace(/\^/g, "**")
      if (this.angleMode === "deg") {
        expression = expression.replace(/Math\.sin$$([^)]+)$$/g, "Math.sin(($1) * Math.PI / 180)")
        expression = expression.replace(/Math\.cos$$([^)]+)$$/g, "Math.cos(($1) * Math.PI / 180)")
        expression = expression.replace(/Math\.tan$$([^)]+)$$/g, "Math.tan(($1) * Math.PI / 180)")
      }
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
}

// Initialize calculators
const basicCalculator = new BasicCalculator()
const scientificCalculator = new ScientificCalculator()

// Graph Calculator Class
class GraphCalculator {
  constructor() {
    this.equationCount = 1
    this.maxEquations = 5 // Increased max equations from 3 to 5
  }

  generateGraph() {
    console.log("[v0] Starting graph generation...")
    const equations = []

    const equationFields = document.querySelectorAll(".equation-field")
    const colorPickers = document.querySelectorAll(".color-picker")

    equationFields.forEach((input, index) => {
      const equation = input.value.trim()
      const color = colorPickers[index].value

      console.log(`[v0] Processing equation ${index + 1}: "${equation}"`)

      if (equation === "") return

      try {
        console.log(`[v0] Attempting to validate equation: "${equation}"`)
        const validatedEquation = validateAndProcessEquation(equation)
        console.log(`[v0] Equation validated successfully: "${validatedEquation}"`)

        equations.push({
          equation: equation,
          color: color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        })

        console.log(`[v0] Added equation ${index + 1}: ${equation}`)
      } catch (error) {
        console.log(`[v0] Equation validation failed for "${equation}": ${error.message}`)
        alert(`Error in equation ${index + 1}: ${error.message}`)
        return
      }
    })

    if (equations.length === 0) {
      alert("Please enter at least one valid equation (functions of x only, like: x^2, sin(x), 2*x+1)")
      return
    }

    const xMin = Number.parseFloat(document.getElementById("xMin").value) || -10
    const xMax = Number.parseFloat(document.getElementById("xMax").value) || 10
    const yMin = Number.parseFloat(document.getElementById("yMin").value) || -10
    const yMax = Number.parseFloat(document.getElementById("yMax").value) || 10

    const datasets = []

    equations.forEach((eq, index) => {
      try {
        console.log(`[v0] Generating data for equation: ${eq.equation}`)
        const data = generateDataPoints(eq.equation, xMin, xMax)
        console.log(`[v0] Generated ${data.length} data points`)

        datasets.push({
          label: eq.equation,
          data: data,
          borderColor: eq.color,
          backgroundColor: eq.color + "20",
          fill: false,
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 4,
        })
      } catch (error) {
        console.log(`[v0] Error in equation "${eq.equation}": ${error.message}`)
        alert(`Error in equation "${eq.equation}": ${error.message}`)
      }
    })

    if (datasets.length === 0) {
      alert("No valid equations to graph")
      return
    }

    const ctx = document.getElementById("graphCanvas").getContext("2d")

    if (window.graphChart) {
      window.graphChart.destroy()
    }

    console.log("[v0] Creating chart...")
    window.graphChart = new window.Chart(ctx, {
      type: "line",
      data: { datasets: datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "linear",
            position: "center",
            min: xMin,
            max: xMax,
            grid: { color: "#e0e0e0" },
            title: { display: true, text: "x" },
          },
          y: {
            type: "linear",
            position: "center",
            min: yMin,
            max: yMax,
            grid: { color: "#e0e0e0" },
            title: { display: true, text: "y" },
          },
        },
        plugins: {
          legend: { display: true, position: "top" },
          tooltip: { mode: "nearest", intersect: false },
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
        },
      },
    })

    console.log("[v0] Chart created successfully")
  }

  addEquation() {
    const container = document.getElementById("equationInputs")
    const equationInputs = container.querySelectorAll(".equation-field")

    // Check if we've reached the maximum number of equations
    if (equationInputs.length >= this.maxEquations) {
      alert(`Maximum of ${this.maxEquations} equations allowed.`)
      return
    }

    // Only check if the last equation input is empty (more user-friendly)
    const lastInput = equationInputs[equationInputs.length - 1]
    if (lastInput && lastInput.value.trim() === "") {
      alert("Please fill in the current equation before adding a new one.")
      lastInput.focus() // Focus on the empty field
      return
    }

    const index = equationInputs.length + 1

    // Generate a random color for the new equation
    const colors = ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56", "#4bc0c0", "#9966ff", "#ff9f40"]
    const randomColor = colors[index % colors.length]

    const div = document.createElement("div")
    div.className = "equation-input"

    div.innerHTML = `
        <input type="text" id="equation${index}" class="equation-field" placeholder="e.g., x^2 + 2*x - 1">
        <input type="color" id="color${index}" value="${randomColor}" class="color-picker">
        <button class="btn remove-equation" onclick="graphCalculator.removeEquation(${index})" title="Remove this equation">×</button>
    `

    container.appendChild(div)

    // Focus on the new input field
    setTimeout(() => {
      document.getElementById(`equation${index}`).focus()
    }, 100)
  }

  removeEquation(equationNumber) {
    const container = document.getElementById("equationInputs")
    const equationInputs = container.querySelectorAll(".equation-input")

    // Don't allow removing if there's only one equation input
    if (equationInputs.length <= 1) {
      alert("You must have at least one equation input.")
      return
    }

    // Find and remove the equation input that contains the specified equation number
    equationInputs.forEach((input) => {
      const equationField = input.querySelector(`#equation${equationNumber}`)
      if (equationField) {
        input.remove()
      }
    })
  }

  clearGraph() {
    if (window.graphChart) {
      window.graphChart.destroy()
      window.graphChart = null
    }

    const equationInputs = document.querySelectorAll(".equation-field")
    equationInputs.forEach((input) => {
      input.value = ""
    })

    document.getElementById("xMin").value = "-10"
    document.getElementById("xMax").value = "10"
    document.getElementById("yMin").value = "-10"
    document.getElementById("yMax").value = "10"
  }
}

const graphCalculator = new GraphCalculator()

document.getElementById("addEquationBtn").addEventListener("click", () => {
  graphCalculator.addEquation()
})

document.getElementById("clearGraphBtn").addEventListener("click", () => {
  graphCalculator.clearGraph()
})

// Keyboard event handling
document.addEventListener("keydown", (event) => {
  const key = event.key
  let activeCalc = null

  if (document.getElementById("basicCalculator").style.display !== "none") {
    activeCalc = basicCalculator
  } else if (document.getElementById("scientificCalculator").style.display !== "none") {
    activeCalc = scientificCalculator
  }

  if (!activeCalc) return

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

function validateAndProcessEquation(equation) {
  console.log(`[v0] Validating equation: "${equation}"`)

  if (!equation || equation.length === 0) {
    throw new Error("Empty equation")
  }

  if (!equation.includes("x")) {
    throw new Error("Equation must contain variable 'x'")
  }

  if (equation.toLowerCase().includes("y")) {
    throw new Error("Please enter a function of x only (like 'x^2' or 'sin(x)'). Equations with 'y' are not supported.")
  }

  // Remove spaces and convert to lowercase for processing
  let processed = equation.toLowerCase().trim()

  console.log(`[v0] Original equation: "${equation}"`)
  console.log(`[v0] After lowercase/trim: "${processed}"`)

  // Replace common mathematical expressions
  processed = processed
    .replace(/\^/g, "**")
    .replace(/sin/g, "Math.sin")
    .replace(/cos/g, "Math.cos")
    .replace(/tan/g, "Math.tan")
    .replace(/log/g, "Math.log10")
    .replace(/ln/g, "Math.log")
    .replace(/sqrt/g, "Math.sqrt")
    .replace(/abs/g, "Math.abs")
    .replace(/pi/g, "Math.PI")
    .replace(/e(?![a-zA-Z])/g, "Math.E")
    .replace(/(\d)([a-z])/g, "$1*$2") // Add multiplication: 2x -> 2*x
    .replace(/([a-z])(\d)/g, "$1*$2") // Add multiplication: x2 -> x*2
    .replace(/(\))(\()/g, "$1*$2") // Add multiplication: )(  -> )*(
    .replace(/(\d)(\()/g, "$1*$2") // Add multiplication: 2( -> 2*(
    .replace(/(\))(\d)/g, "$1*$2") // Add multiplication: )2 -> )*2

  console.log(`[v0] After replacements: "${processed}"`)

  // Test the equation with a sample value
  try {
    const testExpression = processed.replace(/x/g, "(1)")
    console.log(`[v0] Test expression: "${testExpression}"`)
    const testResult = Function(`"use strict"; return (${testExpression})`)()
    console.log(`[v0] Test result: ${testResult}`)

    if (isNaN(testResult)) {
      throw new Error("Equation produces NaN")
    }

    console.log(`[v0] Equation validation successful`)
    return processed
  } catch (error) {
    console.log(`[v0] Equation validation failed: ${error.message}`)
    throw new Error(`Invalid equation: ${equation}. Please check your syntax. Try equations like: x^2, sin(x), 2*x+1`)
  }
}

function generateDataPoints(equation, xMin, xMax) {
  console.log(`[v0] Generating data points for: ${equation}`)
  const points = []
  const step = (xMax - xMin) / 1000

  let processedEquation
  try {
    processedEquation = validateAndProcessEquation(equation)
  } catch (error) {
    throw error
  }

  let validPointsCount = 0

  for (let x = xMin; x <= xMax; x += step) {
    try {
      const expression = processedEquation.replace(/x/g, `(${x})`)
      const y = Function(`"use strict"; return (${expression})`)()

      if (isFinite(y)) {
        points.push({ x: x, y: y })
        validPointsCount++
      }
    } catch (error) {
      continue
    }
  }

  if (validPointsCount < 10) {
    throw new Error(`Equation "${equation}" produces too few valid points. Please check your equation.`)
  }

  console.log(`[v0] Generated ${points.length} valid points`)
  return points
}

// Initialize global chart variable
window.graphChart = null

// Initialize with basic calculator
showCalculator("basic")
