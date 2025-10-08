document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('calc-display');
    const buttons = document.querySelectorAll('.calc-btn');

    let currentInput = '0';
    let operator = null;
    let previousInput = null;
    let shouldResetDisplay = false;

    const updateDisplay = () => {
        display.textContent = currentInput;
    };

    const calculate = (a, b, op) => {
        a = parseFloat(a);
        b = parseFloat(b);
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '×': return a * b;
            case '÷': return b === 0 ? 'Error' : a / b;
            default: return b;
        }
    };

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            if (!isNaN(value) || value === '.') { // 数字或小数点
                if (shouldResetDisplay) {
                    currentInput = '';
                    shouldResetDisplay = false;
                }
                if (value === '.' && currentInput.includes('.')) return;
                currentInput = currentInput === '0' && value !== '.' ? value : currentInput + value;
            } else if (['+', '-', '×', '÷'].includes(value)) { // 操作符
                if (operator && !shouldResetDisplay) {
                    const result = calculate(previousInput, currentInput, operator);
                    currentInput = String(result);
                    updateDisplay();
                }
                previousInput = currentInput;
                operator = value;
                shouldResetDisplay = true;
            } else { // 其他功能键
                switch (value) {
                    case 'AC':
                        currentInput = '0';
                        operator = null;
                        previousInput = null;
                        break;
                    case '=':
                        if (operator && previousInput) {
                            const result = calculate(previousInput, currentInput, operator);
                            currentInput = String(result);
                            operator = null;
                            previousInput = null;
                            shouldResetDisplay = true;
                        }
                        break;
                    case '+/-':
                        currentInput = String(parseFloat(currentInput) * -1);
                        break;
                    case '%':
                        currentInput = String(parseFloat(currentInput) / 100);
                        break;
                }
            }
            updateDisplay();
        });
    });
});