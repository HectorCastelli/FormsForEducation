function validateForms() {
  const questionFoldersUrls = SpreadsheetApp.getActive()
    .getSheetByName(Constants.sheetNames.configurationSheet)
    .getDataRange()
    .getValues()
    .slice(1)
    .map((row) => row[1]);
  for (var folderUrl of questionFoldersUrls) {
    var driveFolder = DriveApp.getFolderById(
      folderUrl.toString().split("/").pop()
    );

    var files = driveFolder.getFilesByType(
      GoogleAppsScript.Base.MimeType.GOOGLE_FORMS.toString()
    );
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
    .getSheetByName(Constants.sheetNames.configurationSheet)
    .getRange(2, 1, 3, 1)
    .getValues();
  for (var folderUrl of questionFoldersUrls) {
    var driveFolder = DriveApp.getFolderById(
      folderUrl.toString().split("/").pop()
    );
    var files = driveFolder.getFilesByType(
      GoogleAppsScript.Base.MimeType.GOOGLE_FORMS.toString()
    );
    while (files.hasNext()) {
      var file = files.next();
      var formFile = FormApp.openById(file.getId());
      formFile.setAcceptingResponses(false);
    }
  }
}
