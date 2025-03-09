"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { evaluate } from "mathjs";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

export default function SystemSolver() {
  const [equations, setEquations] = useState("2x + y = 5\n3x - 2y = 4");
  const [result, setResult] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSolve = () => {
    setError(null);
    setResult(null);
    setSteps([]);

    try {
      if (!equations.trim()) {
        setError("Please enter a system of equations");
        return;
      }

      // Split input into individual equations
      const eqArray = equations.split("\n").filter((eq) => eq.trim() !== "");
      if (eqArray.length < 2) {
        setError("Please enter at least two equations");
        return;
      }

      // This is a simplified approach for 2x2 systems
      // For a real implementation, use a proper linear algebra library
      if (eqArray.length === 2) {
        // Parse equations of form ax + by = c
        const parsedEqs = eqArray.map((eq) => {
          // Replace "=" with "-(" and add ")" at the end to move everything to one side
          const standardForm = eq.replace(/\s*=\s*/, "-(") + ")";

          // Extract coefficients using regex
          const xMatch = standardForm.match(/([+-]?\s*\d*\.?\d*)\s*x/);
          const yMatch = standardForm.match(/([+-]?\s*\d*\.?\d*)\s*y/);
          const constMatch = standardForm.match(/([+-]?\s*\d*\.?\d*)\)$/);

          const a = xMatch
            ? xMatch[1].trim() === "" || xMatch[1].trim() === "+"
              ? 1
              : xMatch[1].trim() === "-"
                ? -1
                : parseFloat(xMatch[1])
            : 0;
          const b = yMatch
            ? yMatch[1].trim() === "" || yMatch[1].trim() === "+"
              ? 1
              : yMatch[1].trim() === "-"
                ? -1
                : parseFloat(yMatch[1])
            : 0;
          const c = constMatch ? parseFloat(constMatch[1]) : 0;

          return { a, b, c };
        });

        const solutionSteps = [];
        solutionSteps.push(`Starting with the system of equations:`);
        eqArray.forEach((eq) => solutionSteps.push(eq));

        // Solve using Cramer's rule
        const a1 = parsedEqs[0].a;
        const b1 = parsedEqs[0].b;
        const c1 = parsedEqs[0].c;
        const a2 = parsedEqs[1].a;
        const b2 = parsedEqs[1].b;
        const c2 = parsedEqs[1].c;

        solutionSteps.push(`\nWriting in matrix form:\n`);
        solutionSteps.push(`[${a1} ${b1}] [x] = [${c1}]`);
        solutionSteps.push(`[${a2} ${b2}] [y]   [${c2}]`);

        const determinant = a1 * b2 - a2 * b1;

        if (Math.abs(determinant) < 1e-10) {
          // Check if the system is consistent
          if (
            Math.abs(a1 * c2 - a2 * c1) < 1e-10 &&
            Math.abs(b1 * c2 - b2 * c1) < 1e-10
          ) {
            setResult("The system has infinitely many solutions");
            solutionSteps.push(
              `\nThe determinant is zero and the system is consistent.`,
            );
            solutionSteps.push(
              `Therefore, the system has infinitely many solutions.`,
            );
          } else {
            setResult("The system has no solution");
            solutionSteps.push(
              `\nThe determinant is zero but the system is inconsistent.`,
            );
            solutionSteps.push(`Therefore, the system has no solution.`);
          }
        } else {
          solutionSteps.push(`\nUsing Cramer's rule to solve the system:`);
          solutionSteps.push(
            `Determinant = ${a1} × ${b2} - ${a2} × ${b1} = ${determinant}`,
          );

          const detX = c1 * b2 - c2 * b1;
          const detY = a1 * c2 - a2 * c1;

          solutionSteps.push(
            `Determinant for x = ${c1} × ${b2} - ${c2} × ${b1} = ${detX}`,
          );
          solutionSteps.push(
            `Determinant for y = ${a1} × ${c2} - ${a2} × ${c1} = ${detY}`,
          );

          const x = detX / determinant;
          const y = detY / determinant;

          solutionSteps.push(`x = ${detX} / ${determinant} = ${x}`);
          solutionSteps.push(`y = ${detY} / ${determinant} = ${y}`);

          setResult(`x = ${x.toFixed(4)}, y = ${y.toFixed(4)}`);
        }

        setSteps(solutionSteps);
      } else {
        setError("Currently only 2x2 systems are supported");
      }
    } catch (e: any) {
      setError(e.message || "An error occurred while solving the system");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>System of Equations Solver</CardTitle>
        <CardDescription>
          Enter a system of linear equations to solve (one equation per line)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="equations" className="text-sm font-medium">
              System of Equations
            </label>
            <Textarea
              id="equations"
              placeholder="e.g., 2x + y = 5\n3x - 2y = 4"
              value={equations}
              onChange={(e) => setEquations(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Enter one equation per line. Currently supports 2x2 systems.
            </p>
          </div>

          <Button onClick={handleSolve} className="w-full">
            Solve System
          </Button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
              <h3 className="font-medium text-lg mb-2">Solution:</h3>
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
              <pre className="whitespace-pre-wrap text-sm">
                {steps.join("\n")}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
