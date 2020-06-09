function initializeSheet() {
  if (SpreadsheetApp.getActive().getSheetByName(configurationSheet) == null) {
    const configSheet = SpreadsheetApp.getActive().insertSheet(
      configurationSheet
    );

    configSheet.deleteColumns(5, configSheet.getMaxColumns() - 5);
    configSheet.deleteRows(4, configSheet.getMaxRows() - 4);
    configSheet
      .getRange(1, 1, 1, 5)
      .setValues([
        [
          "Question Bank",
          "Link to Folder",
          "Weight",
          "Mandatory Count",
          "Optional Count",
        ],
      ]);
    configSheet.getRange(2, 1, 3, 5).setValues([
      ["Easy", null, 1, 1, 0],
      ["Medium", null, 1, 1, 0],
      ["Hard", null, 1, 1, 0],
    ]);
  }
  if (SpreadsheetApp.getActive().getSheetByName(applicationIdsSheet) == null) {
    const appIdSheets = SpreadsheetApp.getActive().insertSheet(
      applicationIdsSheet
    );
    appIdSheets.deleteColumns(4, appIdSheets.getMaxColumns() - 4);
    appIdSheets.deleteRows(1, appIdSheets.getMaxRows() - 1);
    appIdSheets.hideSheet();
  }
}

function validateForms() {
  const questionFoldersUrls = SpreadsheetApp.getActive()
    .getSheetByName(configurationSheet)
    .getDataRange()
    .getValues()
    .slice(1)
    .map((row) => row[1]);
  for (var folderUrl of questionFoldersUrls) {
    var driveFolder = DriveApp.getFolderById(
      folderUrl.toString().split("/").pop()
    );
    var files = driveFolder.getFilesByType(MimeType.GOOGLE_FORMS);
    while (files.hasNext()) {
      var file = files.next();
      var formFile = FormApp.openById(file.getId());
      formFile.setCollectEmail(true);
      formFile.setAcceptingResponses(true);
      formFile.setLimitOneResponsePerUser(false);
      formFile.setShuffleQuestions(true);
      //TODO: Make all questions except Test ID mandatory
      //TODO: Add option to set quiz feedback to Manual after review
      if (
        formFile.getItems(FormApp.ItemType.TEXT).filter((item) => {
          return item.asTextItem().getTitle() === "Test ID";
        }).length === 0
      ) {
        var idItem = formFile
          .addTextItem()
          .setRequired(true)
          .setTitle("Test ID")
          .setHelpText("Insert your Test ID here to identify your answer");
        formFile.moveItem(idItem.getIndex(), 0);
      }
    }
  }
}

function deactivateForms() {
  const questionFoldersUrls = SpreadsheetApp.getActive()
    .getSheetByName(configurationSheet)
    .getRange(2, 1, 3, 1)
    .getValues();
  for (var folderUrl of questionFoldersUrls) {
    var driveFolder = DriveApp.getFolderById(
      folderUrl.split("https://drive.google.com/drive/folders/")[1]
    );
    var files = driveFolder.getFilesByType(MimeType.GOOGLE_FORMS);
    while (files.hasNext()) {
      var file = files.next();
      var formFile = FormApp.openById(file.getId());
      formFile.setAcceptingResponses(false);
    }
  }
}
