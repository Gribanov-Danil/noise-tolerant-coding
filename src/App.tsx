import React, {useEffect, useState} from 'react';
import './App.css';

const App: React.FC = () => {
    const [input, setInput] = useState('');

    useEffect(() => {
        const message = input.split('').map((char) => parseInt(char))

        const r = 2; // Параметр r
        const m = 4; // Параметр m
        const generatorMatrix = generateReedMullerMatrix(r, m);
        console.log("Матрица генерации:", generatorMatrix);
        const encodedMessage = encodeReedMuller(message, generatorMatrix);
        console.log("Закодированное сообщение:", encodedMessage);
        console.log(decodeReedMuller(encodedMessage, generatorMatrix))

    }, [input]);


    return (
        <div className="app">

            <div className="input-group">
                <label htmlFor="textInput">Enter text or data:</label>
                <input
                    type="number"
                    id="textInput"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter text for code generation"
                />
            </div>
        </div>
    );
};

export default App;

function degreeOfPolynomial(index: number, r: number): number[] {
    const result: number[] = [];
    let count = 0;
    while (index > 0) {
        if (index % 2 === 1) {
            result.push(count);
        }
        count++;
        index = Math.floor(index / 2);
    }
    return result;
}

// Генерация матрицы кода Рида-Маллера RM(r, m)
function generateReedMullerMatrix(r: number, m: number): number[][] {
    const rows = 2 ** m; // Общее количество строк
    const columns = rows; // Число столбцов совпадает с количеством строк
    const matrix: number[][] = [];

    for (let i = 0; i < rows; i++) {
        const row: number[] = [];
        for (let j = 0; j < columns; j++) {
            const degrees = degreeOfPolynomial(j, r);
            let value = 1;
            degrees.forEach(degree => {
                value &= ((i >> degree) & 1);
            });
            row.push(value);
        }
        matrix.push(row);
    }

    return matrix;
}

// Кодирование сообщения с использованием кода Рида-Маллера
function encodeReedMuller(message: number[], generatorMatrix: number[][]): number[] {
    const encodedMessage: number[] = [];

    for (let j = 0; j < generatorMatrix[0].length; j++) {
        let sum = 0;
        for (let i = 0; i < message.length; i++) {
            sum ^= (message[i] & generatorMatrix[i][j]);
        }
        encodedMessage.push(sum);
    }

    return encodedMessage;
}

function decodeReedMuller(receivedMessage: number[], generatorMatrix: number[][]): number[] {
    const messageLength = generatorMatrix.length;
    const decodedMessage: number[] = new Array(messageLength).fill(0);

    for (let i = 0; i < messageLength; i++) {
        let sum = 0;
        for (let j = 0; j < receivedMessage.length; j++) {
            sum ^= (receivedMessage[j] & generatorMatrix[i][j]);
        }
        decodedMessage[i] = sum;
    }

    return decodedMessage;
}
