import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResultsTable from '../src/components/ResultsTable';
import { describe, it, expect } from 'vitest';
import { TestResultFile } from '../src/types';

describe('ResultsTable コンポーネント', () => {
  // ResultsTable コンポーネントのテストスイート
  const mockResultFiles: TestResultFile[] = [
    {
      id: '1',
      fileName: 'test1.xml',
      suite: [{
        name: 'Suite1',
        tests: 3,
        failures: 1,
        errors: 0,
        skipped: 0,
        time: 1.5,
        testcases: [
          {
            name: 'testCase1',
            classname: 'com.example.TestClass1',
            time: 0.5,
            status: 'success',
            id: 'tc1',
          },
          {
            name: 'testCase2',
            classname: 'com.example.TestClass1',
            time: 0.7,
            status: 'failure',
            details: 'Assertion failed: expected true to be false',
            id: 'tc2',
          },
          {
            name: 'testCase3',
            classname: 'com.example.TestClass1',
            time: 0.3,
            status: 'skipped',
            id: 'tc3',
          },
        ],
      }],
    },
    {
      id: '2',
      fileName: 'test2.xml',
      suite: [{
        name: 'Suite2',
        tests: 2,
        failures: 0,
        errors: 1,
        skipped: 0,
        time: 0.8,
        testcases: [
          {
            name: 'testCaseA',
            classname: 'com.example.TestClassA',
            time: 0.4,
            status: 'success',
            id: 'tcA',
          },
          {
            name: 'testCaseB',
            classname: 'com.example.TestClassA',
            time: 0.4,
            status: 'error',
            details: 'NullPointerException',
            id: 'tcB',
          },
        ],
      }],
    },
  ];

  it('データが提供されない場合でもクラッシュせずにレンダリングされる', () => {
    // データが空の場合でも、テーブルが正しくレンダリングされることを確認
    render(<ResultsTable resultFiles={[]} />);
    expect(screen.getByText('Test Cases')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by file:')).toBeInTheDocument();
    expect(screen.getByText('All Files')).toBeInTheDocument();
  });

  it('提供されたデータでテストケースが正しくレンダリングされる', () => {
    // データが提供された場合に、テストケースがテーブルに正しく表示されることを確認
    render(<ResultsTable resultFiles={mockResultFiles} />);

    expect(screen.getByText('testCase1')).toBeInTheDocument();
    expect(screen.getByText('testCase2')).toBeInTheDocument();
    expect(screen.getByText('testCase3')).toBeInTheDocument();
    expect(screen.getByText('testCaseA')).toBeInTheDocument();
    expect(screen.getByText('testCaseB')).toBeInTheDocument();

    expect(screen.getAllByText('Success').length).toBe(2);
    expect(screen.getByText('Failure')).toBeInTheDocument();
    expect(screen.getByText('Skipped')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('選択されたファイルでテストケースがフィルタリングされる', () => {
    // ファイル選択ドロップダウンでフィルタリングが正しく機能することを確認
    render(<ResultsTable resultFiles={mockResultFiles} />);

    const filterSelect = screen.getByLabelText('Filter by file:');
    fireEvent.change(filterSelect, { target: { value: 'test1.xml' } });

    expect(screen.getByText('testCase1')).toBeInTheDocument();
    expect(screen.getByText('testCase2')).toBeInTheDocument();
    expect(screen.getByText('testCase3')).toBeInTheDocument();
    expect(screen.queryByText('testCaseA')).not.toBeInTheDocument();
    expect(screen.queryByText('testCaseB')).not.toBeInTheDocument();

    fireEvent.change(filterSelect, { target: { value: 'test2.xml' } });

    expect(screen.queryByText('testCase1')).not.toBeInTheDocument();
    expect(screen.queryByText('testCase2')).not.toBeInTheDocument();
    expect(screen.queryByText('testCase3')).not.toBeInTheDocument();
    expect(screen.getByText('testCaseA')).toBeInTheDocument();
    expect(screen.getByText('testCaseB')).toBeInTheDocument();
  });

  it('失敗/エラーテストケースの詳細が表示/非表示される', async () => {
    // 失敗またはエラーのテストケースをクリックすると詳細が表示され、再度クリックすると非表示になることを確認
    render(<ResultsTable resultFiles={mockResultFiles} />);

    // Initially, details should not be visible
    expect(screen.queryByText('Assertion failed: expected true to be false')).not.toBeInTheDocument();

    // Click on a failed test case to show details
    fireEvent.click(screen.getByText('testCase2').closest('tr') as HTMLElement);
    const failedDetails = await screen.findByText('Assertion failed: expected true to be false');
    expect(failedDetails).toBeInTheDocument();

    // Click again to hide details
    fireEvent.click(screen.getByText('testCase2').closest('tr') as HTMLElement);
    await waitFor(() => {
      expect(screen.queryByText('Assertion failed: expected true to be false')).not.toBeInTheDocument();
    });
  });
});