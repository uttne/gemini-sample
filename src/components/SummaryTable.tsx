
import React from 'react';
import type { TestResultFile } from '../types';

interface Props {
  resultFiles: TestResultFile[];
}

const SummaryTable: React.FC<Props> = ({ resultFiles }) => {
  const total = resultFiles.reduce((acc, file) => {
    file.suite.forEach(suite => {
      acc.tests += suite.tests;
      acc.failures += suite.failures;
      acc.errors += suite.errors;
      acc.skipped += suite.skipped;
      acc.time += suite.time;
    });
    return acc;
  }, { tests: 0, failures: 0, errors: 0, skipped: 0, time: 0 });

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold leading-6 text-gray-900">
          Summary
        </h2>
      </div>
      <div className="border-t border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                File Name / Total
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Tests
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Failures
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Errors
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Skipped
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Time (s)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            <tr className="bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-gray-900">
                Total
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {total.tests}
              </td>
              <td
                className={`whitespace-nowrap px-6 py-4 text-sm font-medium ${
                  total.failures > 0 ? 'text-red-600' : 'text-gray-500'
                }`}
              >
                {total.failures}
              </td>
              <td
                className={`whitespace-nowrap px-6 py-4 text-sm font-medium ${
                  total.errors > 0 ? 'text-red-600' : 'text-gray-500'
                }`}
              >
                {total.errors}
              </td>
              <td
                className={`whitespace-nowrap px-6 py-4 text-sm font-medium ${
                  total.skipped > 0 ? 'text-yellow-600' : 'text-gray-500'
                }`}
              >
                {total.skipped}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {total.time.toFixed(3)}
              </td>
            </tr>
            {resultFiles.map(file => {
              const fileTotalTests = file.suite.reduce((sum, s) => sum + s.tests, 0);
              const fileTotalFailures = file.suite.reduce((sum, s) => sum + s.failures, 0);
              const fileTotalErrors = file.suite.reduce((sum, s) => sum + s.errors, 0);
              const fileTotalSkipped = file.suite.reduce((sum, s) => sum + s.skipped, 0);
              const fileTotalTime = file.suite.reduce((sum, s) => sum + s.time, 0);

              return (
                <tr key={file.fileName}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                    {file.fileName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {fileTotalTests}
                  </td>
                  <td
                    className={`whitespace-nowrap px-6 py-4 text-sm font-medium ${
                      fileTotalFailures > 0
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {fileTotalFailures}
                  </td>
                  <td
                    className={`whitespace-nowrap px-6 py-4 text-sm font-medium ${
                      fileTotalErrors > 0 ? 'text-red-600' : 'text-gray-500'
                    }`}
                  >
                    {fileTotalErrors}
                  </td>
                  <td
                    className={`whitespace-nowrap px-6 py-4 text-sm font-medium ${
                      fileTotalSkipped > 0
                        ? 'text-yellow-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {fileTotalSkipped}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {fileTotalTime.toFixed(3)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryTable;
