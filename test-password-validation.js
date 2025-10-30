import { validatePassword, passwordRequirements } from '../lib/utils';

// Test cases for password validation
const testPasswords = [
  'Test123!',     // Valid password
  'test123!',     // Missing uppercase
  'TEST123!',     // Missing lowercase  
  'Test!',        // Too short
  'Test123',      // Missing special char
  'Test abc!',    // Contains space
  'TestPassword123!', // Too long
  '',             // Empty
  'A1!',          // Too short but has all types
  'ValidPass1!',  // Valid password
];

console.log('Password Validation Tests:');
console.log('========================');

testPasswords.forEach((password, index) => {
  const validation = validatePassword(password);
  console.log(`\nTest ${index + 1}: "${password}"`);
  console.log(`Valid: ${validation.isValid}`);
  
  if (!validation.isValid) {
    console.log('Failed requirements:');
    validation.failedRequirements.forEach(req => {
      console.log(`  - ${req.label}`);
    });
  }
  
  if (validation.passedRequirements.length > 0) {
    console.log('Passed requirements:');
    validation.passedRequirements.forEach(req => {
      console.log(`  ✓ ${req.label}`);
    });
  }
});

console.log('\n\nPassword Requirements:');
console.log('====================');
passwordRequirements.forEach((req, index) => {
  console.log(`${index + 1}. ${req.label}`);
});