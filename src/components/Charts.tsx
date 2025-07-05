
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import type { TestResultFile, ChartData } from '../types';

interface Props {
  resultFiles: TestResultFile[];
}

const Charts: React.FC<Props> = ({ resultFiles }) => {
  const chartData: ChartData[] = resultFiles.map(file => {
    const totalTests = file.suite.reduce((sum, s) => sum + s.tests, 0);
    const totalFailures = file.suite.reduce((sum, s) => sum + s.failures, 0);
    const totalErrors = file.suite.reduce((sum, s) => sum + s.errors, 0);
    const totalSkipped = file.suite.reduce((sum, s) => sum + s.skipped, 0);
    const totalTime = file.suite.reduce((sum, s) => sum + s.time, 0);
    const success = totalTests - totalFailures - totalErrors - totalSkipped;

    return {
      name: file.fileName,
      tests: totalTests,
      success: success,
      failures: totalFailures,
      errors: totalErrors,
      skipped: totalSkipped,
      time: totalTime,
    };
  });

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold leading-6 text-gray-900">
          Test Results Trend
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-8 border-t border-gray-200 bg-gray-50 p-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-base font-medium text-gray-800">
            Test Cases
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #ddd' }}
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Bar
                dataKey="success"
                stackId="a"
                fill="#22c55e" // green-500
                name="Success"
              />
              <Bar
                dataKey="failures"
                stackId="a"
                fill="#ef4444" // red-500
                name="Failures"
              />
              <Bar
                dataKey="errors"
                stackId="a"
                fill="#f97316" // orange-500
                name="Errors"
              />
              <Bar
                dataKey="skipped"
                stackId="a"
                fill="#a8a29e" // stone-400
                name="Skipped"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-base font-medium text-gray-800">
            Execution Time (seconds)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #ddd' }}
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Line
                type="monotone"
                dataKey="time"
                stroke="#3b82f6" // blue-500
                name="Time"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
