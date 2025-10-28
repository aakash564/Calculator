class Calculator {
  constructor(updateDisplay) {
    this.updateDisplay = updateDisplay;
    this.reset();
  }
  reset() {
    this.current = "0";
    this.prev = null;
    this.op = null;
    this.justEvaluated = false;
    this.updateDisplay(this.current);
  }
  inputDigit(d) {
    if (this.justEvaluated) { this.current = "0"; this.justEvaluated = false; }
    if (this.current.length >= 16) return;
    this.current = this.current === "0" ? String(d) : this.current + String(d);
    this.updateDisplay(this.current);
  }
  inputDecimal() {
    if (this.justEvaluated) { this.current = "0"; this.justEvaluated = false; }
    if (!this.current.includes(".")) this.current += ".";
    this.updateDisplay(this.current);
  }
  setOp(nextOp) {
    if (this.op && this.prev !== null && !this.justEvaluated) this.equals();
    this.prev = parseFloat(this.current);
    this.op = nextOp;
    this.current = "0";
    this.justEvaluated = false;
  }
  clear() { this.reset(); }
  invert() {
    if (this.current === "0") return;
    this.current = String(-parseFloat(this.current));
    this.updateDisplay(this.current);
  }
  percent() {
    this.current = String(parseFloat(this.current) / 100);
    this.updateDisplay(this.current);
  }
  equals() {
    const a = this.prev, b = parseFloat(this.current);
    if (a === null || this.op === null) return;
    let r = 0;
    switch (this.op) {
      case "add": r = a + b; break;
      case "subtract": r = a - b; break;
      case "multiply": r = a * b; break;
      case "divide": r = b === 0 ? NaN : a / b; break;
    }
    this.current = String(this.format(r));
    this.prev = null;
    this.op = null;
    this.justEvaluated = true;
    this.updateDisplay(this.current);
  }
  format(n) {
    const s = Number.isFinite(n) ? n : "Error";
    if (typeof s === "string") return s;
    const out = Math.round(s * 1e12) / 1e12;
    return out.toString().length > 16 ? out.toExponential(8) : String(out);
  }
}

const displayEl = document.getElementById("display");
const calc = new Calculator(text => displayEl.textContent = text);

// Button interactions
document.querySelectorAll(".key").forEach(btn => {
  btn.addEventListener("click", () => {
    const digit = btn.getAttribute("data-digit");
    const action = btn.getAttribute("data-action");
    if (digit !== null) calc.inputDigit(digit);
    else if (action === "decimal") calc.inputDecimal();
    else if (["add","subtract","multiply","divide"].includes(action)) calc.setOp(action);
    else if (action === "equals") calc.equals();
    else if (action === "clear") calc.clear();
    else if (action === "invert") calc.invert();
    else if (action === "percent") calc.percent();
  });
});

// Keyboard support
const keyMap = {
  "+": "add", "-": "subtract", "*": "multiply", "x": "multiply", "X": "multiply", "/": "divide",
  "Enter": "equals", "=": "equals", "Escape": "clear", "c": "clear", "%": "percent"
};
window.addEventListener("keydown", (e) => {
  const k = e.key;
  if (/\d/.test(k)) { calc.inputDigit(k); return; }
  if (k === ".") { calc.inputDecimal(); return; }
  const action = keyMap[k];
  if (action) {
    e.preventDefault();
    if (["add","subtract","multiply","divide"].includes(action)) calc.setOp(action);
    else if (action === "equals") calc.equals();
    else if (action === "clear") calc.clear();
    else if (action === "percent") calc.percent();
  }
});

