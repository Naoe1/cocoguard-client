import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function forwardFillMissingDates(data) {
  if (!data) {
    data = [];
  }

  // Sort the input data by date in ascending order
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  const filledData = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 14);

  let previousPrice = null;
  let dataIndex = 0;

  for (let i = 0; i < 15; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const currentDateString = currentDate.toISOString().split('T')[0];

    // Find the latest price on or before the current date
    while (
      dataIndex < sortedData.length &&
      new Date(sortedData[dataIndex].date) <= currentDate
    ) {
      previousPrice = sortedData[dataIndex].price;
      dataIndex++;
    }

    filledData.push({ date: currentDateString, price: previousPrice });
  }

  // Backward fill for initial null values
  let firstNonNullPriceIndex = -1;
  for (let i = 0; i < filledData.length; i++) {
    if (filledData[i].price !== null) {
      firstNonNullPriceIndex = i;
      break;
    }
  }

  if (firstNonNullPriceIndex > 0) {
    const firstNonNullPrice = filledData[firstNonNullPriceIndex].price;
    for (let i = 0; i < firstNonNullPriceIndex; i++) {
      filledData[i].price = firstNonNullPrice;
    }
  }

  return filledData;
}
