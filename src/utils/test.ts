/**
 * Simple test functions to verify calculator logic
 */
import { calculateChange, getDenominationBreakdown, convertBgnToEur, convertEurToBgn } from './calculator';

// Test currency conversion
console.log('=== Testing Currency Conversion ===');
console.log('1 BGN to EUR:', convertBgnToEur(1)); // Should be ~0.51
console.log('1 EUR to BGN:', convertEurToBgn(1)); // Should be ~1.96

// Test change calculation
console.log('\n=== Testing Change Calculation ===');
const change1 = calculateChange(50, 37.45);
console.log('Received: 50 BGN, Bill: 37.45 BGN');
console.log('Change result:', change1);

const change2 = calculateChange(20, 15.30);
console.log('\nReceived: 20 EUR, Bill: 15.30 EUR');
console.log('Change result:', change2);

// Test denomination breakdown
console.log('\n=== Testing Denomination Breakdown ===');
if (change1.isValid && change1.bgn > 0) {
  const breakdown = getDenominationBreakdown(change1.bgn, 'BGN');
  console.log(`Breakdown for ${change1.bgn} BGN:`, breakdown);
}

// Test edge cases
console.log('\n=== Testing Edge Cases ===');
const insufficientFunds = calculateChange(10, 15);
console.log('Insufficient funds (10 vs 15):', insufficientFunds);

const exactAmount = calculateChange(50, 50);
console.log('Exact amount (50 vs 50):', exactAmount);
