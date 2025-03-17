import {useState, useEffect} from 'react';
import './calculator.css';


export default function Calculator() {
    const [input, setInput] = useState('');
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '='];
    const operators = ['+', '-', '*', '/'];

    const calculation = (input) => {
        input.slice(-1);
        console.log(input);
        let numStack = [];
        let opsStack = [];
        let temp = '';
        for(let i = 0; i < input.length; i++){
            if(input[i] === '+' || input[i] === '-' || input[i] === '*' || input[i] === '/'){
                if(temp.indexOf('.') !== temp.lastIndexOf('.')){
                    alert('too many .');
                    return;
                }
                numStack.push(parseFloat(temp));
                temp = '';
                // check the top of stack
                if(opsStack.length > 0 && (opsStack[opsStack.length - 1] === '*' || opsStack[opsStack.length - 1] === '/')){
                    let num1 = numStack.pop();
                    let num2 = numStack.pop();
                    let op = opsStack.pop();
                    console.log(num1, num2, op);
                    if(op === '*'){
                        numStack.push(num1 * num2);
                    }else if(op === '/'){
                        numStack.push(num1 / num2);
                    }
                }
                opsStack.push(input[i]);
            }else{
                temp += input[i];
                if(i === input.length - 1){
                    numStack.push(parseFloat(temp));
                }
            }
        }
        console.log(numStack, opsStack);

        if(numStack.length !== opsStack.length + 1){
            console.log(numStack, opsStack);
            alert('Invalid input');
            return;
        }
        while(opsStack.length > 0){
            let op = opsStack.pop();
            let num2 = numStack.pop();
            let num1 = numStack.pop();
            switch(op){
                case '+':
                    numStack.push(num1 + num2);
                    break;
                case '-':
                    numStack.push(num1 - num2);
                    break;
                case '*':
                    numStack.push(num1 * num2);
                    break;
                case '/':
                    if(num2 === 0){
                        alert('Cannot divide by 0');
                        return;
                    }else{
                        numStack.push(num1 / num2);
                    }
                    break;
                default:
                    alert('Invalid input');
                    return;
            }
        };
        console.log(numStack, opsStack);
        return numStack[0];

    }

    const inputClick = (e) => {
        e.preventDefault();
        const value = e.target.value;
        setInput(input + value);
        if(value === '='){
            const result = calculation(input);
            if(result !== undefined){
                setInput(input + '=' + result);
            }
        } 
    }
    const operatorClick = (e) => {
        e.preventDefault();
        const value = e.target.value;
        setInput(input + value);
    }

    const handleClear = (e) => {
        e.preventDefault();
        setInput('');
    }

    useEffect(() => {
        console.log(input);
    }, [input]);

    return(
        <div className="cantainer">
            <div className="display">
                <textarea value={input} onChange={() => {}}></textarea>
            </div>
            <div className='inputs'>
                <div className='numbers'>
                    {numbers.map((number, index) => (
                        <button key={index} value={number} onClick={inputClick}>
                            {number}
                        </button>
                    ))}
                </div>
                <div className='operators'>
                    {operators.map((operator) => (
                        <button key={operator} value={operator} onClick={operatorClick}>
                            {operator}
                        </button>
                    ))}
                </div>
            </div>
            <button className='clean' onClick={handleClear}>Clear</button>
        </div>
    )
}