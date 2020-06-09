function getRandomFromArray(array: any[], numberOfElements: number) {
  var result = new Array(numberOfElements),
    length = array.length,
    taken = new Array(length);
  if (numberOfElements > length)
    throw new RangeError(
      "getRandomFromArray: <numberOfElements> is larger than length of <array>"
    );
  while (numberOfElements--) {
    var x = Math.floor(Math.random() * length);
    result[numberOfElements] = array[x in taken ? taken[x] : x];
    taken[x] = --length in taken ? taken[length] : length;
  }
  return result;
}

function setSheetDimensions(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  x: number,
  y: number
) {
  sheet.deleteColumns(x, sheet.getMaxColumns() - x);
  sheet.deleteRows(y, sheet.getMaxRows() - y);
}
