"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle, Check } from "lucide-react";

interface CSVData {
  headers: string[];
  rows: string[][];
}

export default function CSVUpload({
  onDataImported,
}: {
  onDataImported?: (data: CSVData) => void;
}) {
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const parseCSV = (text: string): CSVData => {
    // Simple CSV parser - for production, use a robust CSV parsing library
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    if (lines.length === 0) throw new Error("CSV file is empty");

    const headers = lines[0].split(",").map((header) => header.trim());
    const rows = lines
      .slice(1)
      .map((line) => line.split(",").map((cell) => cell.trim()));

    // Validate that all rows have the same number of columns
    const invalidRow = rows.find((row) => row.length !== headers.length);
    if (invalidRow) throw new Error("CSV has inconsistent number of columns");

    return { headers, rows };
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    setIsSuccess(false);
    setIsLoading(true);

    if (acceptedFiles.length === 0) {
      setError("No file selected");
      setIsLoading(false);
      return;
    }

    const file = acceptedFiles[0];
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Please upload a CSV file");
      setIsLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = parseCSV(text);
        setCsvData(data);
        setIsLoading(false);
        setIsSuccess(true);
      } catch (err: any) {
        setError(err.message || "Failed to parse CSV");
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Failed to read file");
      setIsLoading(false);
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleImport = () => {
    if (csvData && onDataImported) {
      onDataImported(csvData);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>CSV Data Import</CardTitle>
        <CardDescription>
          Upload a CSV file to import data for analysis and visualization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="h-8 w-8 text-gray-400" />
              {isDragActive ? (
                <p className="text-blue-600">Drop the file here...</p>
              ) : (
                <>
                  <p className="text-gray-600">
                    Drag & drop a CSV file here, or click to select
                  </p>
                  <p className="text-xs text-gray-400">
                    Supported format: .csv
                  </p>
                </>
              )}
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2">Processing file...</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              <span className="text-red-600">{error}</span>
            </div>
          )}

          {isSuccess && csvData && (
            <div className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-start">
                <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span className="text-green-600">
                  File successfully processed
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="font-medium text-lg mb-2 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Data Preview
                </h3>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        {csvData.headers.map((header, i) => (
                          <th
                            key={i}
                            className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {csvData.rows.slice(0, 5).map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td
                              key={j}
                              className="px-3 py-2 whitespace-nowrap text-sm text-gray-600"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {csvData.rows.length > 5 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Showing 5 of {csvData.rows.length} rows
                  </p>
                )}
              </div>

              <Button onClick={handleImport} className="w-full">
                Use This Data
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
