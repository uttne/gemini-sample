import { render, screen } from '@testing-library/react';
import Charts from '../src/components/Charts';
import { describe, it, expect, vi } from 'vitest';
import { TestResultFile } from '../src/types';

// Mock recharts components to avoid complex SVG rendering in tests
vi.mock('recharts', async (importOriginal) => {
  const original = (await importOriginal()) as Record<string, unknown>;
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    BarChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="bar-chart">{children}</div>
    ),
    LineChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="line-chart">{children}</div>
    ),
    Bar: () => null,
    Line: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    Legend: () => null,
  };
});

describe('Charts', () => {
  it('renders without crashing when no data is provided', () => {
    render(<Charts resultFiles={[]} />);
    expect(screen.getByText('Test Results Trend')).toBeInTheDocument();
    expect(screen.getByText('Test Cases')).toBeInTheDocument();
    expect(screen.getByText('Execution Time (seconds)')).toBeInTheDocument();
  });

  it('renders charts with provided data', () => {
    const mockResultFiles: TestResultFile[] = [
      {
        id: '1',
        fileName: 'test1.xml',
        suite: {
          name: 'Suite1',
          tests: 10,
          failures: 1,
          errors: 0,
          skipped: 0,
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

    render(<Charts resultFiles={mockResultFiles} />);

    expect(screen.getByText('Test Results Trend')).toBeInTheDocument();
    expect(screen.getByText('Test Cases')).toBeInTheDocument();
    expect(screen.getByText('Execution Time (seconds)')).toBeInTheDocument();

    // Check if the mocked chart components are rendered
    expect(screen.getAllByTestId('responsive-container').length).toBe(2);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });
});