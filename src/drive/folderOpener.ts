namespace FolderOperator {
  export function getFormsInFolder(
    folderUrl: string
  ): GoogleAppsScript.Drive.FileIterator {
    const folderId = <string>folderUrl.toString().split("/").pop();
    const driveFolder = DriveApp.getFolderById(folderId);
    return driveFolder.getFilesByType(MimeType.GOOGLE_FORMS);
  }
}
