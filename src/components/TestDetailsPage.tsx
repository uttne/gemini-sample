import React, { useState, useRef, useEffect, useCallback } from 'react'; // useCallback を追加
import type { TestResultFile, TestCase } from '../types';
import { useTranslation } from 'react-i18next';

interface Props {
  testFile: TestResultFile;
}

type SortKey = 'status' | 'name' | 'time';
type SortDirection = 'asc' | 'desc';

const TestDetailsPage: React.FC<Props> = ({ testFile }) => {
  const { t } = useTranslation();
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [leftPaneWidth, setLeftPaneWidth] = useState(33); // 初期幅をパーセンテージで設定
  const containerRef = useRef<HTMLDivElement>(null);

  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);
  const [filters, setFilters] = useState<{ status: string; name: string; time: string }>({ // フィルタの状態を追加
    status: '',
    name: '',
    time: '',
  });

  const allTestCases = testFile.suite.flatMap(suite => suite.testcases);

  const filteredTestCases = React.useMemo(() => { // フィルタリングロジックを追加
    return allTestCases.filter(testcase => {
      const statusMatch = filters.status === '' || testcase.status.toLowerCase().includes(filters.status.toLowerCase());
      const nameMatch = filters.name === '' || testcase.name.toLowerCase().includes(filters.name.toLowerCase());
      const timeMatch = filters.time === '' || testcase.time.toString().includes(filters.time);
      return statusMatch && nameMatch && timeMatch;
    });
  }, [allTestCases, filters]);

  const sortedAndFilteredCases = React.useMemo(() => {
    const sortableItems = [...filteredTestCases]; // filteredTestCases を使用
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredTestCases, sortConfig]); // filteredTestCases に依存

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof typeof filters) => { // フィルタ変更ハンドラを追加
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: e.target.value,
    }));
  };

  const clearAllFilters = () => { // フィルタ一括解除ハンドラを追加
    setFilters({ status: '', name: '', time: '' });
  };

  const clearSort = () => { // ソート初期化ハンドラを追加
    setSortConfig(null);
  };

  // ドラッグイベントハンドラを useCallback でメモ化
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    let newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    // 最小幅と最大幅を制限
    if (newWidth < 10) newWidth = 10; // 最小10%
    if (newWidth > 90) newWidth = 90; // 最大90%

    setLeftPaneWidth(newWidth);
  }, []); // 依存配列は空でOK、setLeftPaneWidthは安定

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'default'; // カーソルを元に戻す
  }, [handleMouseMove]); // handleMouseMove に依存

  const handleMouseDown = useCallback((e: React.MouseEvent) => { // React.MouseEvent に戻す
    e.preventDefault(); // ドラッグ中のテキスト選択を防ぐ
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'ew-resize'; // カーソルをリサイズ用に変更
  }, [handleMouseMove, handleMouseUp]); // handleMouseMove と handleMouseUp に依存

  // useEffect はクリーンアップのみに使う
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]); // クリーンアップ関数も依存する関数に依存

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]" ref={containerRef}>
      <div className="mb-4"> {/* このdivはそのまま残し、戻るボタンを配置 */}
        <button
          onClick={() => window.location.hash = ''}
          className="inline-flex items-center rounded-md border border-transparent bg-gray-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          {t('backToSummary')}
        </button>
      </div>
      <div className="flex flex-1 h-full">
        {/* 左ペイン：テストケース一覧 */}
        <div
          className="bg-gray-100 p-4 border-r border-gray-200 h-full flex flex-col"
          style={{ width: `${leftPaneWidth}%` }}
        >
          <h2 className="text-xl font-semibold mb-4">{testFile.fileName} {t('testCases')}</h2>
          <div className="flex justify-end space-x-2 mb-4"> {/* justify-end と space-x-2 を追加 */}
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t('clearFilters')}
            </button>
            <button
              onClick={clearSort}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t('clearSort')}
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th
                    scope="col"
                    className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"
                    onClick={() => requestSort('status')}
                  >
                    <div className="flex items-center">
                      {t('status')}
                      {sortConfig?.key === 'status' ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                      <input
                        type="text"
                        placeholder={t('filter')}
                        value={filters.status}
                        onChange={(e) => handleFilterChange(e, 'status')}
                        onClick={(e) => e.stopPropagation()} // ソートイベントが発火しないようにする
                        className="ml-2 p-1 border border-gray-300 rounded-md text-gray-700 text-sm w-24"
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center">
                      {t('name')}
                      {sortConfig?.key === 'name' ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                      <input
                        type="text"
                        placeholder={t('filter')}
                        value={filters.name}
                        onChange={(e) => handleFilterChange(e, 'name')}
                        onClick={(e) => e.stopPropagation()}
                        className="ml-2 p-1 border border-gray-300 rounded-md text-gray-700 text-sm w-24"
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"
                    onClick={() => requestSort('time')}
                  >
                    <div className="flex items-center">
                      {t('time')}
                      {sortConfig?.key === 'time' ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                      <input
                        type="text"
                        placeholder={t('filter')}
                        value={filters.time}
                        onChange={(e) => handleFilterChange(e, 'time')}
                        onClick={(e) => e.stopPropagation()}
                        className="ml-2 p-1 border border-gray-300 rounded-md text-gray-700 text-sm w-24"
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAndFilteredCases.map((testcase: TestCase) => (
                  <tr
                    key={testcase.id}
                    className={`hover:bg-gray-100 cursor-pointer ${
                      selectedTestCase?.id === testcase.id ? 'bg-gray-200' : ''
                    }`}
                    onClick={() => setSelectedTestCase(testcase)}
                  >
                    <td className="px-2 py-2 whitespace-nowrap text-sm font-medium">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        testcase.status === 'success' ? 'bg-green-100 text-green-800' :
                        testcase.status === 'failure' || testcase.status === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {testcase.status}
                      </span>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                      {testcase.name}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                      {testcase.time.toFixed(3)}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* セパレータ */}
        <div
          id="pane-separator"
          className="w-2 bg-gray-300 cursor-ew-resize hover:bg-gray-400 transition-colors duration-200"
          onMouseDown={handleMouseDown}
        ></div>

        {/* 右ペイン：テストケース詳細 */}
        <div
          className="flex-1 bg-white p-4 overflow-y-auto h-full"
          style={{ width: `${100 - leftPaneWidth}%` }}
        >
          <h2 className="text-xl font-semibold mb-4">{t('testCaseDetails')}</h2>
          {selectedTestCase ? (
            <div>
              <p><strong>{t('name')}:</strong> {selectedTestCase.name}</p>
              <p><strong>{t('className')}:</strong> {selectedTestCase.classname}</p>
              <p><strong>{t('time')}:</strong> {selectedTestCase.time.toFixed(3)}s</p>
              <p><strong>{t('status')}:</strong> {selectedTestCase.status}</p>
              {selectedTestCase.details && (
                <div>
                  <p><strong>{t('details')}:</strong></p>
                  <pre className="bg-gray-100 p-2 rounded-md overflow-auto text-sm">{selectedTestCase.details}</pre>
                </div>
              )}
              {selectedTestCase.systemOut && (
                <div>
                  <p><strong>{t('systemOut')}:</strong></p>
                  <pre className="bg-gray-100 p-2 rounded-md overflow-auto text-sm">{selectedTestCase.systemOut}</pre>
                </div>
              )}
              {selectedTestCase.systemErr && (
                <div>
                  <p><strong>{t('systemErr')}:</strong></p>
                  <pre className="bg-gray-100 p-2 rounded-md overflow-auto text-sm">{selectedTestCase.systemErr}</pre>
                </div>
              )}
            </div>
          ) : (
            <p>{t('selectTestCase')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestDetailsPage;