import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from '../src/components/FileUpload';
import { describe, it, expect, vi } from 'vitest';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('FileUpload コンポーネント', () => {
  // FileUpload コンポーネントのテストスイート
  it('翻訳されたテキストで正しくレンダリングされる', () => {
    // コンポーネントが翻訳されたテキストで正しくレンダリングされることを確認
    render(<FileUpload onFilesSelected={vi.fn()} />);
    expect(screen.getByText('fileUploadTitle')).toBeInTheDocument();
    expect(screen.getByText('fileUploadDescription')).toBeInTheDocument();
  });

  it('ファイルが選択されたときに onFilesSelected が呼び出される', () => {
    // ファイルが選択されたときに onFilesSelected コールバック関数が正しい引数で呼び出されることを確認
    const onFilesSelectedMock = vi.fn();
    render(<FileUpload onFilesSelected={onFilesSelectedMock} />);

    const fileInput = screen.getByLabelText('fileUploadTitle').closest('div')?.querySelector('input[type="file"]') as HTMLInputElement;

    if (!fileInput) {
      throw new Error('File input not found');
    }

    const file = new File(['test content'], 'test.xml', { type: 'application/xml' });

    // Mock DataTransfer and FileList
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: true,
    });

    fireEvent.change(fileInput);

    expect(onFilesSelectedMock).toHaveBeenCalledTimes(1);
    expect(onFilesSelectedMock).toHaveBeenCalledWith(fileInput.files);
  });
});