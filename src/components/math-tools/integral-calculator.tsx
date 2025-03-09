"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { evaluate, parse, derivative } from "mathjs";
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

export default function IntegralCalculator() {
  const [expression, setExpression] = useState("x^2");
  const [variable, setVariable] = useState("x");
  const [lowerBound, setLowerBound] = useState("0");
  const [upperBound, setUpperBound] = useState("1");
  const [result, setResult] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    setResult(null);
    setSteps([]);

    try {
      if (!expression) {
        setError("Please enter an expression");
        return;
      }

      // For a real implementation, use a proper calculus library
      // This is a simplified approach using numerical integration (trapezoidal rule)
      const numericIntegration = () => {
        const a = parseFloat(lowerBound);
        const b = parseFloat(upperBound);
        
        if (isNaN(a) || isNaN(b)) {
          throw new Error("Invalid bounds. Please enter numeric values.");
        }
        
        const n = 1000; // Number of intervals
        const h = (b - a) / n;
        let sum = 0;
        
        // Trapezoidal rule: ∫f(x)dx ≈ h/2 * [f(a) + 2f(a+h) + 2f(a+2h) + ... + 2f(b-h) + f(b)]
        for (let i = 0; i <= n; i++) {
          const x = a + i * h;
          const fx = evaluate(expression, { [variable]: x });
          
          if (i === 0 || i === n) {
            sum += fx;
          } else {
            sum += 2 * fx;
          }
        }
        
        return (h / 2) * sum;
      };

      // For some common integrals, provide analytical solutions
      const analyticalIntegration = () => {
        let antiderivative = "";
        let analyticalResult = null;
        
        // Handle some basic cases
        if (expression === `${variable}^2`) {
          antiderivative = `${variable}^3/3`;
          analyticalResult = (x: number) => Math.pow(x, 3) / 3;
        } else if (expression === `${variable}`) {
          antiderivative = `${variable}^2/2`;
          analyticalResult = (x: number) => Math.pow(x, 2) / 2;
        } else if (expression === `1`) {
          antiderivative = `${variable}`;
          analyticalResult = (x: number) => x;
        } else if (expression === `${variable}^3`) {
          antiderivative = `${variable}^4/4`;
          analyticalResult = (x: number) => Math.pow(x, 4) / 4;
        } else if (expression === `sin(${variable})`) {
          antiderivative = `-cos(${variable})`;
          analyticalResult = (x: number) => -Math.cos(x);
        } else if (expression === `cos(${variable})`) {
          antiderivative = `sin(${variable})`;
          analyticalResult = (x: number) => Math.sin(x);
        }
        
        return { antiderivative, analyticalResult };
      };

      const { antiderivative, analyticalResult } = analyticalIntegration();
      const numericResult = numericIntegration();
      
      const solutionSteps = [];
      solutionSteps.push(`Integrating ${expression} with respect to ${variable} from ${lowerBound} to ${upperBound}`);
      
      if (antiderivative && analyticalResult) {
        solutionSteps.push(`Step 1: Find the antiderivative of ${expression}`);
        solutionSteps.push(`The antiderivative is ${antiderivative}`);
        
        const upperValue = analyticalResult(parseFloat(upperBound));
        const lowerValue = analyticalResult(parseFloat(lowerBound));
        const definiteIntegral = upperValue - lowerValue;
        
        solutionSteps.push(`Step 2: Evaluate the antiderivative at the upper and lower bounds`);
        solutionSteps.push(`${antiderivative}|_{${lowerBound}}^{${upperBound}} = ${antiderivative.replace(new RegExp(variable, 'g'), `(${upperBound})`)} - ${antiderivative.replace(new RegExp(variable, 'g'), `(${lowerBound})`)}`);
        solutionSteps.push(`= ${upperValue.toFixed(6)} - ${lowerValue.toFixed(6)} = ${definiteIntegral.toFixed(6)}`);
        
        setResult(`\\int_{${lowerBound}}^{${upperBound}} ${expression} \\, d${variable} = ${definiteIntegral.toFixed(6)}`);
      } else {
        solutionSteps.push(`Using numerical integration (trapezoidal rule) with 1000 intervals`);
        solutionSteps.push(`The approximate value of the integral is ${numericResult.toFixed(6)}`);
        
        setResult(`\\int_{${lowerBound}}^{${upperBound}} ${expression} \\, d${variable} \\approx ${numericResult.toFixed(6)}`);
      }
      
      setSteps(solutionSteps);
    } catch (e: any) {
      setError(e.message || "An error occurred");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Integral Calculator</CardTitle>
        <CardDescription>
          Calculate definite integrals with step-by-step solutions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="expression" className="text-sm font-medium">
              Expression to Integrate
            </label>
            <Input
              id="expression"
              placeholder="e.g., x^2 or sin(x)"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="variable" className="text-sm font-medium">
              Integration Variable
            </label>
            <Input
              id="variable"
              placeholder="e.g., x"
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="lowerBound" className="text-sm font-medium">
                Lower Bound
              </label>
              <Input
                id="lowerBound"
                placeholder="e.g., 0"
                value={lowerBound}
                onChange={(e) => setLowerBound(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="upperBound" className="text-sm font-medium">
                Upper Bound
              </label>
              <Input
                id="upperBound"
                placeholder="e.g., 1"
                value={upperBound}
                onChange={(e) => setUpperBound(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleCalculate} className="w-full">
            Calculate Integral
