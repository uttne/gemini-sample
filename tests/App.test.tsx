import { render, screen } from '@testing-library/react';
import App from '../src/App';
import { describe, it, expect, vi } from 'vitest';

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

describe('App コンポーネント', () => {
  // App コンポーネントのテストスイート
  it('App コンポーネントがレンダリングされる', () => {
    // App コンポーネントが正しくレンダリングされ、タイトルが表示されることを確認
    render(<App />);
    expect(screen.getByText('appTitle')).toBeInTheDocument();
  });
});