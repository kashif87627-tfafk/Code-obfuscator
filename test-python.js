// test-python.js
const fs = require('fs');
eval(fs.readFileSync('./obfuscator.js', 'utf8'));

const pythonCode = `def binary_search_position(arr, val, start, end):
    """Finds the correct index to insert 'val' in the sorted portion of arr."""
    while start <= end:
        mid = (start + end) // 2
        if arr[mid] == val:
            return mid + 1
        elif arr[mid] < val:
            start = mid + 1
        else:
            end = mid - 1
    return start

def binary_insertion_sort(arr):
    """Sorts the array using the Binary Insertion Sort algorithm."""
    for i in range(1, len(arr)):
        key = arr[i]
        pos = binary_search_position(arr, key, 0, i - 1)
        j = i - 1
        while j >= pos:
            arr[j + 1] = arr[j]
            j -= 1
        arr[pos] = key
    return arr

data = [37, 23, 0, 17, 12, 72, 31, 46, 100, 88]
print("Sorted Array:", binary_insertion_sort(data))`;

console.log('=== Testing Python Code ===\n');
const result = obfuscate(pythonCode);
console.log('Obfuscated:\n', result.obfuscated);
console.log('\nMap:', JSON.stringify(result.mapObj, null, 2));
console.log('\nIdentifiers renamed:', Object.keys(result.mapObj).length);
