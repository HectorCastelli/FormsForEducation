function getFormsInFolder(
  folderUrl: string
): GoogleAppsScript.Drive.FileIterator {
  const folderId = folderUrl.toString().split("/").pop();
  const driveFolder = DriveApp.getFolderById(folderId);
  return driveFolder.getFilesByType(MimeType.GOOGLE_FORMS);
}
