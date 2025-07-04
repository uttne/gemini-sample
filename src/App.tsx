import { useState } from 'react';
import { TestResultFile, TestSuite, TestCase } from './types';
import FileUpload from './components/FileUpload';
import Charts from './components/Charts';
import SummaryTable from './components/SummaryTable';
import ResultsTable from './components/ResultsTable';

function App() {
  const [testResultFiles, setTestResultFiles] = useState<TestResultFile[]>([]);

  const handleFiles = async (files: FileList) => {
    const parsedFiles: TestResultFile[] = [];
    for (const file of Array.from(files)) {
      const text = await file.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "application/xml");
      
      const testsuiteNode = xmlDoc.getElementsByTagName('testsuite')[0];
      if (!testsuiteNode) continue;

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

      parsedFiles.push({ fileName: file.name, suite });
    }
    setTestResultFiles(parsedFiles);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              JUnit Test Result Viewer
            </h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <FileUpload onFilesSelected={handleFiles} />
        </div>
        {testResultFiles.length > 0 && (
          <div className="space-y-8">
            <Charts resultFiles={testResultFiles} />
            <SummaryTable resultFiles={testResultFiles} />
            <ResultsTable resultFiles={testResultFiles} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
