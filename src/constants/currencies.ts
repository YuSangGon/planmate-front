export type CurrencyOption = {
  code: string;
  symbol: string;
};

export const currencies: CurrencyOption[] = [
  { code: "GBP", symbol: "£" }, // UK
  { code: "USD", symbol: "$" }, // USA
  { code: "EUR", symbol: "€" }, // EU
  { code: "KRW", symbol: "₩" }, // Korea
  { code: "JPY", symbol: "¥" }, // Japan
  { code: "CNY", symbol: "¥" }, // China
  { code: "HKD", symbol: "$" }, // Hong Kong
  { code: "SGD", symbol: "$" }, // Singapore
  { code: "AUD", symbol: "$" }, // Australia
  { code: "NZD", symbol: "$" }, // New Zealand
  { code: "CAD", symbol: "$" }, // Canada

  { code: "CHF", symbol: "CHF" }, // Switzerland
  { code: "DKK", symbol: "kr" }, // Denmark
  { code: "SEK", symbol: "kr" }, // Sweden
  { code: "NOK", symbol: "kr" }, // Norway
  { code: "ISK", symbol: "kr" }, // Iceland

  { code: "INR", symbol: "₹" }, // India
  { code: "THB", symbol: "฿" }, // Thailand
  { code: "VND", symbol: "₫" }, // Vietnam
  { code: "IDR", symbol: "Rp" }, // Indonesia
  { code: "MYR", symbol: "RM" }, // Malaysia
  { code: "PHP", symbol: "₱" }, // Philippines

  { code: "AED", symbol: "د.إ" }, // UAE
  { code: "SAR", symbol: "﷼" }, // Saudi Arabia
  { code: "QAR", symbol: "ر.ق" }, // Qatar
  { code: "ILS", symbol: "₪" }, // Israel
  { code: "TRY", symbol: "₺" }, // Turkey

  { code: "ZAR", symbol: "R" }, // South Africa
  { code: "EGP", symbol: "£" }, // Egypt
  { code: "MAD", symbol: "د.م." }, // Morocco

  { code: "RUB", symbol: "₽" }, // Russia
  { code: "PLN", symbol: "zł" }, // Poland
  { code: "CZK", symbol: "Kč" }, // Czech
  { code: "HUF", symbol: "Ft" }, // Hungary
  { code: "RON", symbol: "lei" }, // Romania

  { code: "MXN", symbol: "$" }, // Mexico
  { code: "BRL", symbol: "R$" }, // Brazil
  { code: "ARS", symbol: "$" }, // Argentina
  { code: "CLP", symbol: "$" }, // Chile
  { code: "COP", symbol: "$" }, // Colombia
  { code: "PEN", symbol: "S/" }, // Peru

  { code: "CRC", symbol: "₡" }, // Costa Rica
  { code: "ISK", symbol: "kr" }, // Iceland (duplicate 제거 원하면 삭제 가능)

  { code: "AMD", symbol: "֏" }, // Armenia
  { code: "GEL", symbol: "₾" }, // Georgia
  { code: "KZT", symbol: "₸" }, // Kazakhstan
  { code: "UAH", symbol: "₴" }, // Ukraine

  { code: "XOF", symbol: "CFA" }, // West Africa
  { code: "XAF", symbol: "CFA" }, // Central Africa

  { code: "FJD", symbol: "$" }, // Fiji
];
