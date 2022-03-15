// Case insensitive includes method
function includesCi(target) {

  // If target is string, use lowercase to compare
  if (typeof target === 'string') {
    target = target.toLowerCase();
  }

  // Check if any item of the array equals the target
  return this.some(function (item) {

    // If item is string, use lowercase to compare
    if (typeof item === 'string') {
      item = item.toLowerCase();
    }

    // If target is found stop iterating
    if (item === target) return true;
    else return false;
  })
}

// Add includesCi function to Array prototype
Array.prototype.includesCi = includesCi;