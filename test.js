// test.js – quick test of obfuscator
const fs = require('fs');

// Load the engine
eval(fs.readFileSync('./obfuscator.js', 'utf8'));

// Test input
const testCode = `function usercoins() {
  int coins = 99;
  int premium = 0;
}`;

console.log('=== Testing obfuscator ===\n');
console.log('INPUT:');
console.log(testCode);
console.log('\n');

const result = obfuscate(testCode);

console.log('OBFUSCATED:');
console.log(result.obfuscated);
console.log('\n');

console.log('MAP (obfuscated → original):');
console.log(JSON.stringify(result.mapObj, null, 2));
console.log('\n');

console.log('Number of identifiers renamed:', Object.keys(result.mapObj).length);
