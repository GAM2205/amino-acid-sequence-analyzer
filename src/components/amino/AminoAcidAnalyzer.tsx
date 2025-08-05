"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { analyzeSequence, AnalysisResult } from '@/lib/amino';

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
};

export default function AminoAcidAnalyzer() {
  const [sequence, setSequence] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const analysisResult = analyzeSequence(sequence);
    setResult(analysisResult);
    setIsAnalyzing(false);
  };

  const handleClear = () => {
    setSequence('');
    setResult(null);
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'Glucogenic':
        return 'text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs font-medium';
      case 'Amphibolic':
        return 'text-purple-600 bg-purple-50 px-2 py-1 rounded-full text-xs font-medium';
      case 'Ketogenic':
        return 'text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium';
      default:
        return 'text-gray-600 bg-gray-50 px-2 py-1 rounded-full text-xs font-medium';
    }
  };

  const chartData = result?.aminoAcids.map(aa => ({
    code: aa.code,
    name: aa.name,
    count: aa.count,
    percentage: aa.percentage
  })) || [];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Amino Acid Sequence Analyzer</CardTitle>
          <CardDescription>
            Enter an amino acid sequence to analyze its composition and metabolic classification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="sequence" className="text-sm font-medium">
              Amino Acid Sequence
            </label>
            <Textarea
              id="sequence"
              placeholder="Enter amino acid sequence (e.g., ARNDCEQGHILKMFPSTWYV)"
              value={sequence}
              onChange={(e) => setSequence(e.target.value)}
              className="min-h-[100px] font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Use single letter amino acid codes. Spaces will be ignored.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleAnalyze} 
              disabled={!sequence.trim() || isAnalyzing}
              className="flex-1"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Sequence'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClear}
              disabled={!sequence && !result}
            >
              Clear
            </Button>
          </div>

          {result && !result.isValid && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{result.error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {result && result.isValid && (
        <>
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{result.totalCount}</p>
                  <p className="text-sm text-gray-600">Total Amino Acids</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{result.groupCounts.glucogenic}</p>
                  <p className="text-sm text-blue-600">Glucogenic</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{result.groupCounts.amphibolic}</p>
                  <p className="text-sm text-purple-600">Amphibolic</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{result.groupCounts.ketogenic}</p>
                  <p className="text-sm text-red-600">Ketogenic</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  Dominant Classification: <span className="font-bold">{result.dominantGroup}</span>
                </p>
                <p className="text-green-600 text-sm mt-1">
                  This sequence contains more {result.dominantGroup.toLowerCase()} amino acids than other types.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Chart Card */}
          <Card>
            <CardHeader>
              <CardTitle>Amino Acid Frequency Chart</CardTitle>
              <CardDescription>
                Visual representation of amino acid counts in the sequence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="code" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value, name, props) => [
                      `${value} (${props.payload.percentage.toFixed(1)}%)`,
                      props.payload.name
                    ]}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="var(--color-count)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Table Card */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
              <CardDescription>
                Complete breakdown of amino acids in the sequence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Amino Acid</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                    <TableHead>Classification</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.aminoAcids.map((aa) => (
                    <TableRow key={aa.code}>
                      <TableCell className="font-mono font-medium">{aa.code}</TableCell>
                      <TableCell>{aa.name}</TableCell>
                      <TableCell className="text-right font-medium">{aa.count}</TableCell>
                      <TableCell className="text-right">{aa.percentage.toFixed(1)}%</TableCell>
                      <TableCell>
                        <span className={getClassificationColor(aa.classification)}>
                          {aa.classification}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Classification Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-blue-600 mb-2">Glucogenic Amino Acids</h4>
                <p className="text-sm text-gray-600">
                  Can be converted to glucose through gluconeogenesis: Alanine, Arginine, Asparagine, 
                  Aspartic acid, Cysteine, Glutamic acid, Glutamine, Glycine, Histidine, Methionine, 
                  Proline, Serine, Valine
                </p>
              </div>
              <div>
                <h4 className="font-medium text-purple-600 mb-2">Amphibolic Amino Acids</h4>
                <p className="text-sm text-gray-600">
                  Can be converted to both glucose and ketone bodies: Phenylalanine, Isoleucine, 
                  Threonine, Tryptophan, Tyrosine
                </p>
              </div>
              <div>
                <h4 className="font-medium text-red-600 mb-2">Ketogenic Amino Acids</h4>
                <p className="text-sm text-gray-600">
                  Can only be converted to ketone bodies: Leucine, Lysine
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
