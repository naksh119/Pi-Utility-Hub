
export interface PiNewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  imageUrl: string;
}

export interface WalletInfo {
  address: string;
  balance: number;
  lastUpdated: string;
  status: 'Active' | 'Inactive';
}

export type Screen = 'home' | 'converter' | 'reminder' | 'wallet' | 'news' | 'settings';

export interface PiUser {
  username: string;
  uid: string;
  accessToken: string;
}

export interface PiAuthResult {
  user: PiUser;
  accessToken: string;
}

interface Pi {
  init(options: { version: string; sandbox: boolean }): void;
  authenticate(scopes: string[], onIncompletePaymentFound: (payment: any) => void): Promise<PiAuthResult>;
}

declare global {
  interface Window {
    Pi: Pi;
  }
}
