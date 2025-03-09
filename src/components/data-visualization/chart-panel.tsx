"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface DataPoint {
  x: number;
  y: number;
}

export default function ChartPanel() {
  const [chartType, setChartType] = useState("line");
  const [xValues, setXValues] = useState(
    "-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10",
  );
  const [yValues, setYValues] = useState("");
  const [formula, setFormula] = useState("x^2");
  const [data, setData] = useState<DataPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Generate data points based on formula or x,y values
  useEffect(() => {
    try {
      setError(null);
      let newData: DataPoint[] = [];

      if (yValues) {
        // Use provided x,y values
        const xArray = xValues.split(",").map((x) => parseFloat(x.trim()));
        const yArray = yValues.split(",").map((y) => parseFloat(y.trim()));

        if (xArray.length !== yArray.length) {
          setError("X and Y arrays must have the same length");
          return;
        }

        newData = xArray.map((x, i) => ({ x, y: yArray[i] }));
      } else {
        // Generate y values from formula
        const xArray = xValues.split(",").map((x) => parseFloat(x.trim()));

        newData = xArray.map((x) => {
          try {
            // Replace x in formula and evaluate
            const expr = formula.replace(/x/g, x.toString());
            const y = Function("return " + expr)();
            return { x, y };
          } catch (e) {
            throw new Error(`Could not evaluate formula at x=${x}`);
          }
        });
      }

      setData(newData);
    } catch (e: any) {
      setError(e.message || "Error generating chart data");
    }
  }, [xValues, yValues, formula, chartType]);

  const renderChart = () => {
    if (!data.length) return null;

    const xArray = data.map((point) => point.x);
    const yArray = data.map((point) => point.y);

    let plotData: any[] = [];

    switch (chartType) {
      case "line":
        plotData = [
          {
            x: xArray,
            y: yArray,
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "rgb(75, 192, 192)" },
          },
        ];
        break;
      case "bar":
        plotData = [
          {
            x: xArray,
            y: yArray,
            type: "bar",
            marker: {
              color: "rgb(54, 162, 235)",
            },
          },
        ];
        break;
      case "scatter":
        plotData = [
          {
            x: xArray,
            y: yArray,
            type: "scatter",
            mode: "markers",
            marker: { color: "rgb(255, 99, 132)" },
          },
        ];
        break;
      default:
        return null;
    }

    const layout = {
      title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
      autosize: true,
      margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 },
      plot_bgcolor: "rgba(0,0,0,0)",
      paper_bgcolor: "rgba(0,0,0,0)",
    };

    return (
      <Plot
        data={plotData}
        layout={layout}
        style={{ width: "100%", height: "400px" }}
        useResizeHandler={true}
      />
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Data Visualization</CardTitle>
        <CardDescription>
          Create interactive charts from data or mathematical functions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="formula" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="formula">Function</TabsTrigger>
            <TabsTrigger value="data">Data Points</TabsTrigger>
          </TabsList>

          <TabsContent value="formula" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="formula">Mathematical Function</Label>
              <Input
                id="formula"
                placeholder="e.g., x^2 or Math.sin(x)"
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Use JavaScript math syntax. Variable is 'x'.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="xValues">X Values (comma separated)</Label>
              <Input
                id="xValues"
                placeholder="e.g., -10,-9,...,9,10"
                value={xValues}
                onChange={(e) => setXValues(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="xValues">X Values (comma separated)</Label>
              <Input
                id="xValues"
                placeholder="e.g., 1,2,3,4,5"
                value={xValues}
                onChange={(e) => setXValues(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yValues">Y Values (comma separated)</Label>
              <Input
                id="yValues"
                placeholder="e.g., 10,20,30,40,50"
                value={yValues}
                onChange={(e) => setYValues(e.target.value)}
              />
            </div>
          </TabsContent>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Chart Type</Label>
              <div className="flex space-x-2">
                <Button
                  variant={chartType === "line" ? "default" : "outline"}
                  onClick={() => setChartType("line")}
                >
                  Line
                </Button>
                <Button
                  variant={chartType === "bar" ? "default" : "outline"}
                  onClick={() => setChartType("bar")}
                >
                  Bar
                </Button>
                <Button
                  variant={chartType === "scatter" ? "default" : "outline"}
                  onClick={() => setChartType("scatter")}
                >
                  Scatter
                </Button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                {error}
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              {renderChart()}
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
