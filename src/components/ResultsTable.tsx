
import React, { useState } from 'react';
import type { TestResultFile, TestCase } from '../types';

interface Props {
  resultFiles: TestResultFile[];
}

const ResultsTable: React.FC<Props> = ({ resultFiles }) => {
  const [selectedFile, setSelectedFile] = useState<string>('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFile(event.target.value);
  };

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const allTestCases = resultFiles.flatMap(file =>
    file.suite.flatMap(suite => suite.testcases.map(tc => ({ ...tc, fileName: file.fileName })))
  );

  const filteredTestCases = selectedFile === 'all' 
    ? allTestCases 
    : allTestCases.filter(tc => tc.fileName === selectedFile);

  const statusBadge = (status: TestCase['status']) => {
    const baseClasses =
      'inline-flex rounded-full px-2 text-xs font-semibold leading-5';
    switch (status) {
      case 'success':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            Success
          </span>
        );
      case 'failure':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            Failure
          </span>
        );
      case 'error':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            Error
          </span>
        );
      case 'skipped':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            Skipped
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-lg font-semibold leading-6 text-gray-900">
          Test Cases
        </h2>
        <div className="filter-container">
          <label
            htmlFor="file-filter"
            className="mr-2 text-sm font-medium text-gray-700"
          >
            Filter by file:
          </label>
          <select
            id="file-filter"
            value={selectedFile}
            onChange={handleFilterChange}
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">All Files</option>
            {resultFiles.map(file => (
              <option key={file.fileName} value={file.fileName}>
                {file.fileName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="w-28 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Class Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Test Name
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
            {filteredTestCases.map((tc: TestCase & { fileName: string; id: string }) => {
              const rowId = `${tc.id}-${tc.classname}-${tc.name}`;
              const isExpandable =
                tc.status === 'failure' || tc.status === 'error';
              const isExpanded = expandedRow === rowId;

              return (
                <React.Fragment key={rowId}>
                  <tr
                    className={`${
                      isExpandable ? 'cursor-pointer hover:bg-gray-50' : ''
                    }`}
                    onClick={() => isExpandable && toggleRow(rowId)}
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {statusBadge(tc.status)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                      {tc.classname}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {tc.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {tc.time.toFixed(3)}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-6 py-4">
                        <pre className="whitespace-pre-wrap rounded-md bg-gray-900 p-4 text-xs text-white">
                          {tc.details}
                        </pre>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
