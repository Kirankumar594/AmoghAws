// utils/generateOrderNumber.js

/**
 * Generates a unique order number in the format:
 * ORD-YYMMDD-RANDOM
 * Example: ORD-250721-8372
 */
 const generateOrderNumber = () => {
  const date = new Date();

  const year = date.getFullYear().toString().slice(-2); // Last 2 digits of year (e.g. "25")
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // MM (01-12)
  const day = date.getDate().toString().padStart(2, '0'); // DD (01-31)
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // 4-digit random number

  return `ORD-${year}${month}${day}-${random}`;
};

export default generateOrderNumber;
