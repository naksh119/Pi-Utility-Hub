
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

export type Screen = 'home' | 'converter' | 'reminder' | 'wallet' | 'news' | 'settings' | 'privacy' | 'terms';

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
  createPayment(paymentData: PiPaymentData, callbacks: PiPaymentCallbacks): void;
}

export interface PiPaymentData {
  amount: number;
  memo: string;
  metadata: Object;
}

export interface PiPaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => void;
  onError: (error: Error, paymentId?: string) => void;
}

declare global {
  interface Window {
    Pi: Pi;
    authenticatePi: () => Promise<PiAuthResult>;
  }
}
