/**
 * Formats a number into Indian Rupee format (e.g. ₹8,00,000) using en-IN locale
 */
export function formatINR(val: number): string {
  return "₹" + val.toLocaleString("en-IN");
}

/**
 * Converts a salary in Rupees to Lakhs (e.g. 800000 -> "8", 1250000 -> "12.5")
 */
export function formatLakhs(val: number): string {
  const l = val / 100000;
  return Number.isInteger(l) ? `${l}` : `${parseFloat(l.toFixed(2))}`;
}

/**
 * Formats salary range or single salary in Indian currency format.
 * Examples:
 * - 800000, 1400000 -> "₹8,00,000 – ₹14,00,000 (8–14 LPA)"
 * - 800000, null -> "From ₹8,00,000 (8 LPA)"
 * - 50000, null -> "From ₹50,000"
 */
export function formatSalary(
  salaryMin?: number | null,
  salaryMax?: number | null,
  options?: { compact?: boolean }
): string {
  if (!salaryMin && !salaryMax) return "";

  if (salaryMin && salaryMax) {
    if (salaryMin >= 100000 && salaryMax >= 100000) {
      if (options?.compact) {
        return `₹${formatLakhs(salaryMin)} – ₹${formatLakhs(salaryMax)} LPA`;
      }
      return `₹${salaryMin.toLocaleString("en-IN")} – ₹${salaryMax.toLocaleString("en-IN")} (${formatLakhs(salaryMin)}–${formatLakhs(salaryMax)} LPA)`;
    }
    return `₹${salaryMin.toLocaleString("en-IN")} – ₹${salaryMax.toLocaleString("en-IN")}`;
  }

  const single = (salaryMin ?? salaryMax)!;
  if (single >= 100000) {
    if (options?.compact) {
      return `From ₹${formatLakhs(single)} LPA`;
    }
    return `From ₹${single.toLocaleString("en-IN")} (${formatLakhs(single)} LPA)`;
  }

  return `From ₹${single.toLocaleString("en-IN")}`;
}
