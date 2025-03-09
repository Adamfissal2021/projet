"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { evaluate, derivative, simplify, parse } from "mathjs";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

export default function EquationSolver() {
  const [equation, setEquation] = useState("");
  const [variable, setVariable] = useState("x");
  const [operation, setOperation] = useState("solve");
  const [result, setResult] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSolve = () => {
    setError(null);
    setResult(null);
    setSteps([]);

    try {
      if (!equation) {
        setError("Please enter an equation");
        return;
      }

      let calculatedResult = "";
      let solutionSteps: string[] = [];

      switch (operation) {
        case "solve":
          // For simple equations like x+5=10
          try {
            const parts = equation.split("=");
            if (parts.length === 2) {
              const leftSide = parts[0].trim();
              const rightSide = parts[1].trim();

              solutionSteps.push(`Starting with equation: ${equation}`);

              // Move all terms with variable to left side
              const expr = parse(`${leftSide}-(${rightSide})`);
              const simplified = simplify(expr);
              solutionSteps.push(
                `Rearranging to standard form: ${simplified} = 0`,
              );

              // Try to solve for the variable
              // This is a simplified approach - a real solver would be more complex
              const stringExpr = simplified.toString();
              if (stringExpr.includes(variable)) {
                // Very basic linear equation solver
                const withoutVar = stringExpr.replace(
                  new RegExp(variable, "g"),
                  "0",
                );
                const coefficient = simplified
                  .toString()
                  .replace(new RegExp(`([^${variable}]*)${variable}`), "1");

                const constantTerm = evaluate(withoutVar);
                const varCoefficient = evaluate(coefficient);

                solutionSteps.push(
                  `Isolating the variable: ${varCoefficient}${variable} + ${constantTerm} = 0`,
                );
                solutionSteps.push(
                  `Solving for ${variable}: ${variable} = ${-constantTerm / varCoefficient}`,
                );

                calculatedResult = `${variable} = ${-constantTerm / varCoefficient}`;
              } else {
                calculatedResult = `Result: ${evaluate(stringExpr)}`;
              }
            } else {
              // For expressions without equals sign, just evaluate
              calculatedResult = `Result: ${evaluate(equation)}`;
              solutionSteps.push(`Evaluating expression: ${equation}`);
              solutionSteps.push(`Result: ${evaluate(equation)}`);
            }
          } catch (e) {
            // Fallback to direct evaluation if equation solving fails
            try {
              calculatedResult = `Result: ${evaluate(equation)}`;
              solutionSteps.push(`Evaluating expression: ${equation}`);
              solutionSteps.push(`Result: ${evaluate(equation)}`);
            } catch (evalError) {
              throw new Error("Could not solve equation. Please check format.");
            }
          }
          break;

        case "derivative":
          try {
            const derivativeResult = derivative(equation, variable).toString();
            calculatedResult = `\\frac{d}{d${variable}}(${equation}) = ${derivativeResult}`;

            solutionSteps.push(
              `Taking the derivative of ${equation} with respect to ${variable}`,
            );
            solutionSteps.push(`Result: ${derivativeResult}`);
          } catch (e) {
            throw new Error(
              "Could not calculate derivative. Please check format.",
            );
          }
          break;

        default:
          throw new Error("Unsupported operation");
      }

      setResult(calculatedResult);
      setSteps(solutionSteps);
    } catch (e: any) {
      setError(e.message || "An error occurred");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Equation Solver</CardTitle>
        <CardDescription>
          Enter an equation or expression to solve, evaluate, or find its
          derivative
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="equation" className="text-sm font-medium">
              Equation or Expression
            </label>
            <Input
              id="equation"
              placeholder="e.g., x+5=10 or 2*x^2+3*x+1"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="variable" className="text-sm font-medium">
              Variable (for derivatives)
            </label>
            <Input
              id="variable"
              placeholder="e.g., x"
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Operation</label>
            <div className="flex space-x-2">
              <Button
                variant={operation === "solve" ? "default" : "outline"}
                onClick={() => setOperation("solve")}
              >
                Solve/Evaluate
              </Button>
              <Button
                variant={operation === "derivative" ? "default" : "outline"}
                onClick={() => setOperation("derivative")}
              >
                Derivative
              </Button>
            </div>
          </div>

          <Button onClick={handleSolve} className="w-full">
            Calculate
          </Button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
              <h3 className="font-medium text-lg mb-2">Result:</h3>
              <div className="overflow-x-auto">
                <Latex>{result}</Latex>
              </div>
            </div>
          )}

          {steps.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h3 className="font-medium text-lg mb-2">
                Step-by-Step Solution:
              </h3>
              <ol className="list-decimal pl-5 space-y-2">
                {steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
