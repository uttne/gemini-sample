import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { TestResultFile, TestSuite, TestCase } from './types';
import FileUpload from './components/FileUpload';
import Charts from './components/Charts';
import SummaryTable from './components/SummaryTable';
// import ResultsTable from './components/ResultsTable'; // 削除
import LoadedFilesList from './components/LoadedFilesList';
import TestDetailsPage from './components/TestDetailsPage';

function App() {
  const { t, i18n } = useTranslation();
  const [testResultFiles, setTestResultFiles] = useState<TestResultFile[]>([]);
  const [currentPath, setCurrentPath] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleFiles = async (files: FileList) => {
    const parsedFiles: TestResultFile[] = [];
    for (const file of Array.from(files)) {
      // Check if a file with the same name already exists
      if (testResultFiles.some(existingFile => existingFile.fileName === file.name)) {
        console.warn(`File with name ${file.name} already exists. Skipping.`);
        continue;
      }

      const text = await file.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "application/xml");
      
      const testsuiteNodes = xmlDoc.getElementsByTagName('testsuite');
      if (testsuiteNodes.length === 0) continue;

      const suites: TestSuite[] = [];
      for (const testsuiteNode of Array.from(testsuiteNodes)) {
        const testcasesNodes = Array.from(testsuiteNode.getElementsByTagName('testcase'));
        const testcases: TestCase[] = testcasesNodes.map(tc => {
          let status: TestCase['status'] = 'success';
          let details: string | undefined;

          if (tc.getElementsByTagName('failure').length > 0) {
            status = 'failure';
            details = tc.getElementsByTagName('failure')[0].textContent ?? '';
          } else if (tc.getElementsByTagName('error').length > 0) {
            status = 'error';
            details = tc.getElementsByTagName('error')[0].textContent ?? '';
          } else if (tc.getElementsByTagName('skipped').length > 0) {
            status = 'skipped';
          }

          return {
          name: tc.getAttribute('name') || '',
          classname: tc.getAttribute('classname') || '',
          time: parseFloat(tc.getAttribute('time') || '0'),
          status,
          details,
          systemOut: tc.getElementsByTagName('system-out')[0]?.textContent ?? undefined,
          systemErr: tc.getElementsByTagName('system-err')[0]?.textContent ?? undefined,
          id: crypto.randomUUID(),
        };
        });

        const suite: TestSuite = {
          name: testsuiteNode.getAttribute('name') || '',
          tests: parseInt(testsuiteNode.getAttribute('tests') || '0'),
          failures: parseInt(testsuiteNode.getAttribute('failures') || '0'),
          errors: parseInt(testsuiteNode.getAttribute('errors') || '0'),
          skipped: parseInt(testsuiteNode.getAttribute('skipped') || '0'),
          time: parseFloat(testsuiteNode.getAttribute('time') || '0'),
          testcases,
        };

        suites.push(suite);
      }
      parsedFiles.push({ id: crypto.randomUUID(), fileName: file.name, suite: suites });
    }
    setTestResultFiles(prevFiles => [...prevFiles, ...parsedFiles]);
  };

  const handleDeleteFile = (id: string) => {
    setTestResultFiles(prevFiles => prevFiles.filter(file => file.id !== id));
  };

  const handleReorderFiles = (newOrder: TestResultFile[]) => {
    setTestResultFiles(newOrder);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const renderContent = () => {
    if (currentPath.startsWith('#/details/')) {
      const fileId = currentPath.replace('#/details/', '');
      // TestDetailsPage に testResultFiles 全体を渡す
      return <TestDetailsPage initialFileId={fileId} allFiles={testResultFiles} />;
    }
    return (
      <>
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <FileUpload onFilesSelected={handleFiles} />
        </div>
        {testResultFiles.length > 0 && (
          <div className="mb-8">
            <LoadedFilesList files={testResultFiles} onDelete={handleDeleteFile} onReorder={handleReorderFiles} />
          </div>
        )}
        {testResultFiles.length > 0 && (
          <div className="space-y-8">
            <Charts resultFiles={testResultFiles} />
            <SummaryTable resultFiles={testResultFiles} />
            {/* <ResultsTable resultFiles={testResultFiles} /> */} {/* 削除 */}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {t('appTitle')}
            </h1>
            <div className="flex items-center space-x-4">
              <label htmlFor="language-select" className="text-gray-700">
                {t('language')}:
              </label>
              <select
                id="language-select"
                onChange={(e) => changeLanguage(e.target.value)}
                value={i18n.language}
                className="rounded-md border border-gray-300 p-2 text-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="en">{t('english')}</option>
                <option value="ja">{t('japanese')}</option>
              </select>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
