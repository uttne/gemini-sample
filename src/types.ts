export interface TestCase {
  name: string;
  classname: string;
  time: number;
  status: 'success' | 'failure' | 'error' | 'skipped';
  details?: string;
  systemOut?: string; // system-out を追加
  systemErr?: string; // system-err を追加
  id: string; // Add id to TestCase
}

export interface TestSuite {
  name: string;
  tests: number;
  failures: number;
  errors: number;
  skipped: number;
  time: number;
  testcases: TestCase[];
}

export interface TestResultFile {
  id: string;
  fileName: string;
  suite: TestSuite[];
}

export interface ChartData {
  name: string;
  tests: number;
  success: number;
  failures: number;
  errors: number;
  skipped: number;
  time: number;
}