export function formatCurrency(amount: number | string, currency: string = 'USD'): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(0);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
}

export function formatPercentage(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) {
    return '0.00%';
  }
  return `${numValue.toFixed(2)}%`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getDealTypeLabel(type: string): string {
  const labels: { [key: string]: string } = {
    real_estate: 'Real Estate',
    franchise: 'Franchise',
    startup: 'Startup',
    asset: 'Asset',
  };
  return labels[type] || type;
}

export function getStatusColor(status: string): string {
  const colors: { [key: string]: string } = {
    draft: 'gray',
    open: 'blue',
    funding: 'yellow',
    funded: 'green',
    closed: 'gray',
    failed: 'red',
    exited: 'purple',
  };
  return colors[status] || 'gray';
}

export function calculateFundingProgress(raised: number, target: number): number {
  return Math.min((raised / target) * 100, 100);
}
