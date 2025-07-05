import React from 'react';
import type { TestResultFile } from '../types';
import { useTranslation } from 'react-i18next'; // 追加

interface Props {
  resultFiles: TestResultFile[];
}

const SummaryTable: React.FC<Props> = ({ resultFiles }) => {
  const { t } = useTranslation(); // 追加
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

  const handleViewDetails = (fileId: string) => {
    window.location.hash = `#/details/${fileId}`;
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold leading-6 text-gray-900">
          {t('summaryTitle')} {/* 翻訳キーに変更 */}
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
                {t('fileNameOrTotal')} {/* 翻訳キーに変更 */}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {t('tests')} {/* 翻訳キーに変更 */}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {t('failures')} {/* 翻訳キーに変更 */}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {t('errors')} {/* 翻訳キーに変更 */}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {t('skipped')} {/* 翻訳キーに変更 */}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {t('timeSeconds')} {/* 翻訳キーに変更 */}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {t('actions')} {/* 新しいヘッダー */}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            <tr className="bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-gray-900">
                {t('total')} {/* 翻訳キーに変更 */}
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
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {/* Total行にはボタンなし */}
              </td>
            </tr>
            {resultFiles.map(file => {
              const fileTotalTests = file.suite.reduce((sum, s) => sum + s.tests, 0);
              const fileTotalFailures = file.suite.reduce((sum, s) => sum + s.failures, 0);
              const fileTotalErrors = file.suite.reduce((sum, s) => sum + s.errors, 0);
              const fileTotalSkipped = file.suite.reduce((sum, s) => sum + s.skipped, 0);
              const fileTotalTime = file.suite.reduce((sum, s) => sum + s.time, 0);

              return (
                <tr key={file.id}> {/* keyをfile.idに変更 */}
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
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <button
                      onClick={() => handleViewDetails(file.id)}
                      className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      {t('viewDetails')} {/* 翻訳キーに変更 */}
                    </button>
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