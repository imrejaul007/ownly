export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  kyc_status: string;
  avatar?: string;
  country?: string;
  city?: string;
  is_active: boolean;
  created_at: string;
}

export interface Deal {
  id: string;
  title: string;
  slug: string;
  type: 'real_estate' | 'franchise' | 'startup' | 'asset';
  jurisdiction?: string;
  location?: string;
  description?: string;
  target_amount: number;
  min_ticket: number;
  max_ticket?: number;
  raised_amount: number;
  investor_count: number;
  holding_period_months?: number;
  expected_roi?: number;
  expected_irr?: number;
  fees?: any;
  status: 'draft' | 'open' | 'funding' | 'funded' | 'closed' | 'failed' | 'exited';
  open_date?: string;
  close_date?: string;
  images?: string[];
  documents?: any[];
  metadata?: any;
  spv?: SPV;
  created_at: string;
}

export interface SPV {
  id: string;
  deal_id: string;
  spv_name: string;
  jurisdiction?: string;
  total_shares: number;
  issued_shares: number;
  share_price: number;
  virtual_bank_account?: string;
  escrow_balance: number;
  operating_balance: number;
  total_revenue: number;
  total_expenses: number;
  total_distributed: number;
  status: string;
  created_at: string;
}

export interface InvestmentEarnings {
  monthlyExpectedEarning: string;
  avgMonthlyActualEarning: string;
  totalPayoutsReceived: string;
  unrealizedGain: string;
  totalEarnings: string;
  actualRoi: string;
  expectedRoi: string;
  exitEarnings: string | null;
  monthsHeld: number;
}

export interface Investment {
  id: string;
  user_id: string;
  spv_id: string;
  deal_id: string;
  amount: number;
  shares_issued: number;
  share_price: number;
  status: string;
  invested_at: string;
  total_payouts_received: number;
  current_value?: number;
  deal?: Deal;
  spv?: SPV;
  earnings?: InvestmentEarnings;
}

export interface PortfolioSummary {
  totalInvested: number;
  totalCurrentValue: number;
  totalPayoutsReceived: number;
  totalReturn: number;
  returnPercentage: string;
}
