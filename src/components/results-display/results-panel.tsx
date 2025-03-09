"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Copy, LayoutPanelLeft, LayoutList } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface ResultsData {
  headers: string[];
  rows: any[][];
  summary?: {
    mean?: number;
    median?: number;
    min?: number;
    max?: number;
    count?: number;
  };
}

export default function ResultsPanel({ data }: { data: ResultsData }) {
  const [viewMode, setViewMode] = useState<"table" | "chart" | "split">(
    "split",
  );

  const downloadCSV = () => {
    const csvContent = [
      data.headers.join(","),
      ...data.rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "analysis_results.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = () => {
    const csvContent = [
      data.headers.join("\t"),
      ...data.rows.map((row) => row.join("\t")),
    ].join("\n");

    navigator.clipboard.writeText(csvContent);
  };

  const renderChart = () => {
    // For simplicity, we'll create a bar chart of the first two columns
    if (data.rows.length === 0 || data.headers.length < 2) return null;

    const xValues = data.rows.map((row) => row[0]);
    const yValues = data.rows.map((row) => row[1]);

    const plotData = [
      {
        x: xValues,
        y: yValues,
        type: "bar",
        marker: {
          color: "rgb(54, 162, 235)",
        },
      },
    ];

    const layout = {
      title: `${data.headers[1]} by ${data.headers[0]}`,
      autosize: true,
      margin: { l: 50, r: 50, b: 100, t: 50, pad: 4 },
      plot_bgcolor: "rgba(0,0,0,0)",
      paper_bgcolor: "rgba(0,0,0,0)",
    };

    return (
      <Plot
        data={plotData}
        layout={layout}
        style={{
          width: "100%",
          height: viewMode === "split" ? "300px" : "500px",
        }}
        useResizeHandler={true}
      />
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              View and export your data analysis results
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={downloadCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <LayoutList className="h-4 w-4 mr-2" />
            Table
          </Button>
          <Button
            variant={viewMode === "chart" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("chart")}
          >
            <LayoutPanelLeft className="h-4 w-4 mr-2" />
            Chart
          </Button>
          <Button
            variant={viewMode === "split" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("split")}
          >
            <LayoutPanelLeft className="h-4 w-4 mr-2" />
            Split View
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {data.summary && (
          <div className="mb-4 grid grid-cols-5 gap-4 bg-gray-50 p-3 rounded-md">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">Count</div>
              <div className="text-lg font-semibold">{data.summary.count}</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">Mean</div>
              <div className="text-lg font-semibold">
                {data.summary.mean?.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">Median</div>
              <div className="text-lg font-semibold">
                {data.summary.median?.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">Min</div>
              <div className="text-lg font-semibold">
                {data.summary.min?.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">Max</div>
              <div className="text-lg font-semibold">
                {data.summary.max?.toFixed(2)}
              </div>
            </div>
          </div>
        )}

        <div
          className={
            viewMode === "split" ? "grid grid-cols-2 gap-4" : "space-y-4"
          }
        >
          {(viewMode === "table" || viewMode === "split") && (
            <div className="overflow-x-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    {data.headers.map((header, i) => (
                      <TableHead key={i}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.rows.map((row, i) => (
                    <TableRow key={i}>
                      {row.map((cell, j) => (
                        <TableCell key={j}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {(viewMode === "chart" || viewMode === "split") && (
            <div className="border rounded-md p-4 bg-white">
              {renderChart()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
