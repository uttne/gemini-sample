import { describe, it, expect } from 'vitest';

describe('コンソール出力を含むサンプルテスト', () => {
  // コンソール出力の動作を確認するためのテストスイート
  it('コンソールにメッセージをログ出力する', () => {
    // テストが実行された際に、指定されたメッセージがコンソールに出力されることを確認
    console.log('This is a sample log message from example.test.ts');
    expect(true).toBe(true); // Simple assertion to make the test pass
  });

  it('変数を含む別のメッセージをログ出力する', () => {
    // 変数を含むメッセージがコンソールに正しく出力されることを確認
    const message = 'Hello from Vitest!';
    console.log(`Another log: ${message}`);
    expect(1 + 1).toBe(2);
  });

  it('数値の計算結果をログ出力する', () => {
    // 数値計算の結果がコンソールに出力されることを確認
    const result = 10 * 5;
    console.log(`Calculation result: ${result}`);
    expect(result).toBe(50);
  });

  it('配列の内容をログ出力する', () => {
    // 配列の要素がコンソールに出力されることを確認
    const arr = ['apple', 'banana', 'cherry'];
    console.log('Array elements:', arr);
    expect(arr).toHaveLength(3);
  });

  it('オブジェクトの内容をログ出力する', () => {
    // オブジェクトのプロパティがコンソールに出力されることを確認
    const obj = { name: 'Vitest', version: '3.2.4' };
    console.log('Object details:', obj);
    expect(obj.name).toBe('Vitest');
  });

  it('警告メッセージをログ出力する', () => {
    // 警告メッセージがコンソールに出力されることを確認
    console.warn('This is a warning message.');
    expect(true).toBe(true);
  });

  it('エラーメッセージをログ出力する', () => {
    // エラーメッセージがコンソールに出力されることを確認
    console.error('This is an error message!');
    expect(true).toBe(true);
  });

  it('複数のログを連続して出力する', () => {
    // 複数のログが順番にコンソールに出力されることを確認
    console.log('First log.');
    console.log('Second log.');
    console.log('Third log.');
    expect(true).toBe(true);
  });

  it('条件付きでログ出力する', () => {
    // 条件が満たされた場合にのみログが出力されることを確認
    const condition = true;
    if (condition) {
      console.log('This log appears because the condition is true.');
    }
    expect(condition).toBe(true);
  });

  it('ループ内でログ出力する', () => {
    // ループ内でログが複数回出力されることを確認
    for (let i = 0; i < 3; i++) {
      console.log(`Loop iteration: ${i}`);
    }
    expect(true).toBe(true);
  });

  it('非同期処理の完了をログ出力する', async () => {
    // 非同期処理の完了がログ出力されることを確認
    console.log('Starting async operation...');
    await new Promise(resolve => setTimeout(resolve, 10));
    console.log('Async operation completed.');
    expect(true).toBe(true);
  });

  it('JSON文字列をログ出力する', () => {
    // JSON文字列がコンソールに出力されることを確認
    const jsonData = { status: 'success', data: [1, 2, 3] };
    console.log('JSON data:', JSON.stringify(jsonData));
    expect(jsonData.status).toBe('success');
  });
});