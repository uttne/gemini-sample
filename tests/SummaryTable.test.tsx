import { render, screen } from '@testing-library/react';
import SummaryTable from '../src/components/SummaryTable';
import { describe, it, expect } from 'vitest';
import { TestResultFile } from '../src/types';

describe('SummaryTable', () => {
  const mockResultFiles: TestResultFile[] = [
    {
      id: '1',
      fileName: 'test1.xml',
      suite: {
        name: 'Suite1',
        tests: 10,
        failures: 1,
        errors: 0,
        skipped: 2,
        time: 1.23,
        testcases: [],
      },
    },
    {
      id: '2',
      fileName: 'test2.xml',
      suite: {
        name: 'Suite2',
        tests: 5,
        failures: 0,
        errors: 1,
        skipped: 0,
        time: 0.5,
        testcases: [],
      },
    },
  ];

  it('renders without crashing when no data is provided', () => {
    render(<SummaryTable resultFiles={[]} />);
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(4); // Tests, Failures, Errors, Skipped
    expect(screen.getByText('0.000')).toBeInTheDocument(); // Time
  });

  it('renders total and individual file summaries correctly', () => {
    render(<SummaryTable resultFiles={mockResultFiles} />);

    // Check total row
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument(); // Total Tests

    const totalRow = screen.getByText('Total').closest('tr');
    expect(totalRow).toBeInTheDocument();

    // Check total row values
    expect(totalRow?.querySelector('td:nth-child(3)')).toHaveTextContent('1'); // Total Failures
    expect(totalRow?.querySelector('td:nth-child(4)')).toHaveTextContent('1'); // Total Errors
    expect(totalRow?.querySelector('td:nth-child(5)')).toHaveTextContent('2'); // Total Skipped
    expect(screen.getByText('1.730')).toBeInTheDocument(); // Total Time

    // Check individual file rows
    const file1Row = screen.getByText('test1.xml').closest('tr');
    expect(file1Row).toBeInTheDocument();
    expect(file1Row?.querySelector('td:nth-child(3)')).toHaveTextContent('1'); // test1.xml Failures
    expect(file1Row?.querySelector('td:nth-child(4)')).toHaveTextContent('0'); // test1.xml Errors
    expect(file1Row?.querySelector('td:nth-child(5)')).toHaveTextContent('2'); // test1.xml Skipped

    const file2Row = screen.getByText('test2.xml').closest('tr');
    expect(file2Row).toBeInTheDocument();
    expect(file2Row?.querySelector('td:nth-child(3)')).toHaveTextContent('0'); // test2.xml Failures
    expect(file2Row?.querySelector('td:nth-child(4)')).toHaveTextContent('1'); // test2.xml Errors
    expect(file2Row?.querySelector('td:nth-child(5)')).toHaveTextContent('0'); // test2.xml Skipped

    // Check styles for non-zero values
    expect(totalRow?.querySelector('td:nth-child(3)')).toHaveClass('text-red-600'); // Total Failures
    expect(totalRow?.querySelector('td:nth-child(4)')).toHaveClass('text-red-600'); // Total Errors
    expect(totalRow?.querySelector('td:nth-child(5)')).toHaveClass('text-yellow-600'); // Total Skipped

    expect(file1Row?.querySelector('td:nth-child(3)')).toHaveClass('text-red-600'); // test1.xml Failures
    expect(file1Row?.querySelector('td:nth-child(4)')).not.toHaveClass('text-red-600'); // test1.xml Errors
    expect(file1Row?.querySelector('td:nth-child(5)')).toHaveClass('text-yellow-600'); // test1.xml Skipped

    expect(file2Row?.querySelector('td:nth-child(3)')).not.toHaveClass('text-red-600'); // test2.xml Failures
    expect(file2Row?.querySelector('td:nth-child(4)')).toHaveClass('text-red-600'); // test2.xml Errors
    expect(file2Row?.querySelector('td:nth-child(5)')).not.toHaveClass('text-yellow-600'); // test2.xml Skipped
  });
});