
import React from 'react';
import type { TestResultFile } from '../types';

interface Props {
  resultFiles: TestResultFile[];
}

const SummaryTable: React.FC<Props> = ({ resultFiles }) => {
  const total = resultFiles.reduce((acc, file) => {
    acc.tests += file.suite.tests;
    acc.failures += file.suite.failures;
    acc.errors += file.suite.errors;
    acc.skipped += file.suite.skipped;
    acc.time += file.suite.time;
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
            {resultFiles.map(file => (
              <tr key={file.fileName}>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                  {file.fileName}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {file.suite.tests}
                </td>
                <td
                  className={`whitespace-nowrap px-6 py-4 text-sm font-medium ${
                    file.suite.failures > 0
                      ? 'text-red-600'
                      : 'text-gray-500'
                  }`}
                >
                  {file.suite.failures}
                </td>
                <td
                  className={`whitespace-nowrap px-6 py-4 text-sm font-medium ${
                    file.suite.errors > 0 ? 'text-red-600' : 'text-gray-500'
                  }`}
                >
                  {file.suite.errors}
                </td>
                <td
                  className={`whitespace-nowrap px-6 py-4 text-sm font-medium ${
                    file.suite.skipped > 0
                      ? 'text-yellow-600'
                      : 'text-gray-500'
                  }`}
                >
                  {file.suite.skipped}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {file.suite.time.toFixed(3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryTable;
