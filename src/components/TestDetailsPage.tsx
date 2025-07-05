import React, { useState, useRef, useEffect } from 'react';
import type { TestResultFile, TestCase } from '../types';
import { useTranslation } from 'react-i18next';

interface Props {
  testFile: TestResultFile;
}

const TestDetailsPage: React.FC<Props> = ({ testFile }) => {
  const { t } = useTranslation();
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [leftPaneWidth, setLeftPaneWidth] = useState(33); // 初期幅をパーセンテージで設定
  const containerRef = useRef<HTMLDivElement>(null);

  const allTestCases = testFile.suite.flatMap(suite => suite.testcases);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      let newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // 最小幅と最大幅を制限
      if (newWidth < 10) newWidth = 10; // 最小10%
      if (newWidth > 90) newWidth = 90; // 最大90%

      setLeftPaneWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default'; // カーソルを元に戻す
    };

    const handleMouseDown = (e: MouseEvent) => { // React.MouseEvent ではなく MouseEvent に変更
      e.preventDefault(); // ドラッグ中のテキスト選択を防ぐ
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize'; // カーソルをリサイズ用に変更
    };

    const separator = document.getElementById('pane-separator');
    if (separator) {
      separator.addEventListener('mousedown', handleMouseDown); // 型アサーションを削除
    }

    return () => {
      if (separator) {
        separator.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]" ref={containerRef}> {/* flex-col を追加 */}
      <div className="mb-4"> {/* ボタン用のdivを追加 */}
        <button
          onClick={() => window.location.hash = ''} // メインページに戻る
          className="inline-flex items-center rounded-md border border-transparent bg-gray-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          {t('backToSummary')} {/* 翻訳キーを追加 */}
        </button>
      </div>
      <div className="flex flex-1"> {/* flex-1 を追加して残りのスペースを埋める */}
        {/* 左ペイン：テストケース一覧 */}
        <div
          className="bg-gray-100 p-4 overflow-y-auto border-r border-gray-200"
          style={{ width: `${leftPaneWidth}%` }}
        >
          <h2 className="text-xl font-semibold mb-4">{testFile.fileName} {t('testCases')}</h2>
          <ul>
            {allTestCases.map(testcase => (
              <li
                key={testcase.id}
                className={`p-2 hover:bg-gray-200 cursor-pointer ${
                  selectedTestCase?.id === testcase.id ? 'bg-gray-300' : ''
                }`}
                onClick={() => setSelectedTestCase(testcase)}
              >
                {testcase.name}
              </li>
            ))}
          </ul>
        </div>

        {/* セパレータ */}
        <div
          id="pane-separator"
          className="w-2 bg-gray-300 cursor-ew-resize hover:bg-gray-400 transition-colors duration-200"
        ></div>

        {/* 右ペイン：テストケース詳細 */}
        <div
          className="flex-1 bg-white p-4 overflow-y-auto"
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
