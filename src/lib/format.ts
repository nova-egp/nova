export function formatEGP(amount: number): string {
  return `${amount.toLocaleString('en-US')} EGP`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function processingLabel(days: [number, number]): string {
  return `${days[0]}–${days[1]} days`;
}
