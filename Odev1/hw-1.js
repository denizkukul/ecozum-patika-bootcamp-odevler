const folders = [
  {
    id: 5,
    name: 'Klasör 1',
    files: [
      { id: 17, name: 'profil.jpg' },
      { id: 18, name: 'manzara.jpg' },
    ],
  },
  {
    id: 6,
    name: 'Klasör 2',
    files: [
      { id: 21, name: 'foto.png' },
      { id: 22, name: 'dosya.xls' },
    ],
  },
  {
    id: 7,
    name: 'Klasör 3',
  },
]

// Get positions of given items inside folders array
// Takes any number of objects as arguments --> findWithID({fileID:22},{folderID:5},{fileID:13})
function findWithID() {
  // Create object to save results
  const results = {}

  // Build targets object with given arguments
  const targets = { files: [], folders: [] }
  Array.from(arguments).forEach(item => {
    item.fileID && targets.files.push(item.fileID);
    item.folderID && targets.folders.push(item.folderID);
  });

  // Iterate trough folders array
  // Returns false if all targets are not found
  let itemsFound = folders.some((folder, folderIndex) => {

    // If all target files are not found, iterate files array inside current folder
    if (targets.files.length && folder.files) {
      folder.files.some((file, fileIndex) => {
        // Compare id of current fileID with targetFileIDs
        if (targets.files.includes(file.id)) {
          // If a targetFileID is found, save it to results object
          results[file.id] = {
            fileContent: { ...file }, // Take a duplicate of file object
            fileIndex: fileIndex,
            parentFolderID: folder.id,
            parentFolderIndex: folderIndex
          }
          // Remove targetFileID from target files array
          targets.files = targets.files.filter(target => target !== file.id);
          // If all target files are found, stop iterating files array
          if (!targets.files.length) return true;
          // Else, keep iterating files array
          return false;
        }
      })
    }

    // If all target folders are not found, compare current folderID with targetFolderIDs
    if (targets.folders.length && targets.folders.includes(folder.id)) {
      // If a targetFolderID is found save it to results object
      results[folder.id] = {};
      results[folder.id].folderIndex = folderIndex;
      // Remove targetFolderID from target folders array
      targets.folders = targets.folders.filter(target => target !== folder.id);
    }

    // If all targets are found, stop iterating
    if (!targets.files.length && !targets.folders.length) return true;
    // Keep iterating folders array
    return false
  })

  // If some targets are not found log errors and return false;
  if (!itemsFound) {
    targets.files.forEach(fileID => {
      console.log(`File(id:${fileID}) not found!`);
    })
    targets.folders.forEach(folderID => {
      console.log(`Folder(id:${folderID}) not found!`);
    })
    return false;
  }

  // If all targets are found, return results object --> { 22:{...}, 5:{...}, ...}
  return results;
}

// Confirm input type is number to prevent unnecessary iterations
// Takes any number of objects as arguments --> validateInput({type:"File", id:22},{type:"Folder", id:5})
function validateInput() {
  // If any arguments are invalid return false and log error
  return Array.from(arguments).every(item => {
    if (typeof item.id !== "number") {
      console.log(`${item.type} id must be a number!`);
      return false;
    }
    else return true;
  })
}

// Add file or folder to given index
function addItem(item, folderIndex = null) {
  let targetArray;
  // If called with second argument, set target to given folderIndex.files array (item will be a file object) 
  if (folderIndex !== null) {
    // Create files array if it does not exist
    if (!folders[folderIndex].files) folders[folderIndex].files = [];
    targetArray = folders[folderIndex].files;
  }
  // If called with single argument, set target to folders array (item will be a folder object)
  else targetArray = folders;
  // Add item to target array
  targetArray.push(item);
}

// Remove file or folder
function removeItem(itemIndex, folderIndex = null) {
  let targetArray;
  // If called with second argument, set target to given folderIndex.files array (itemIndex will be index of a file object) 
  if (folderIndex !== null) {
    targetArray = folders[folderIndex].files;
  }
  // If called with single argument, set target to folders array (itemIndex will be index of a folder object)
  else targetArray = folders;
  // Remove item from target array
  targetArray.splice(itemIndex, 1);
}

// Move file to target folder
function move(fileID, targetFolderID) {
  // Validate ids
  if (!validateInput({ type: "File", id: fileID }, { type: "Folder", id: targetFolderID })) return;

  // Find positions of file and target folder
  let results = findWithID({ fileID: fileID }, { folderID: targetFolderID })

  // If file or target folder is not found, return
  if (!results) return;

  // If file will be moved to same position, return
  if (results[fileID].parentFolderID === targetFolderID) return console.log(`File(id:${fileID}) is already in folder(id:${targetFolderID})`)

  // Move file
  addItem(results[fileID].fileContent, results[targetFolderID].folderIndex);
  removeItem(results[fileID].fileIndex, results[fileID].parentFolderIndex);

  console.log(`File(id:${fileID}) moved to folder(id:${targetFolderID})`);
}

// Copy file to target folder
function copy(fileID, targetFolderID) {
  // Validate ids
  if (!validateInput({ type: "File", id: fileID }, { type: "Folder", id: targetFolderID })) return;

  // Find positions of file and target folder
  let results = findWithID({ fileID: fileID }, { folderID: targetFolderID })

  // If file or target folder is not found, return
  if (!results) return;

  // Copy file
  // Give new id to file and update id counter
  results[fileID].fileContent.id = id.current + 1;
  id.current++;

  addItem(results[fileID].fileContent, results[targetFolderID].folderIndex);
  console.log(`File(id:${fileID}) copied to folder(id:${targetFolderID}) as file(id:${id.current})`);
}

// Remove file
function remove(fileID) {
  // Validate id
  if (!validateInput({ type: "File", id: fileID })) return;

  // Find position of file
  let results = findWithID({ fileID: fileID });

  // If file is not found, return
  if (!results) return;

  // Remove file
  removeItem(results[fileID].fileIndex, results[fileID].parentFolderIndex);

  console.log(`File(id:${fileID}) removed from folder(id:${results[fileID].parentFolderID})`);
}

// Remove folder and all files inside
function removeFolder(folderID) {
  // Validate id
  if (!validateInput({ type: "Folder", id: folderID })) return;

  // Find position of folder
  let results = findWithID({ folderID: folderID });

  // If folder is not found, return
  if (!results) return;

  // Remove folder
  removeItem(results[folderID].folderIndex);

  console.log(`Folder(id:${folderID}) removed`);
}

// Find parent folder of file
function parentFolderOf(fileID) {
  // Validate id
  if (!validateInput({ type: "File", id: fileID })) return;

  // Find position of file
  let results = findWithID({ fileID: fileID });

  // If file is not found, return
  if (!results) return;

  // Return parent folder
  console.log(`Parent of file(id:${fileID}) is folder(id:${results[fileID].parentFolderID})`);
  return results[fileID].parentFolderID;
}

// Managing IDs
// Runs once to check every id used and get the largest number
const id = { current: 0 };
folders.forEach(folder => {
  if (folder.id > id.current) id.current = folder.id;
  folder.files && folder.files.forEach(file => {
    if (file.id > id.current) id.current = file.id;
  })
})