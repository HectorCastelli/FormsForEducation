const ui = SpreadsheetApp.getUi();

function showStartupGuide(): void {
  var html = HtmlService.createHtmlOutputFromFile("help/StartupGuide")
    .setTitle("Startup Guide")
    .setWidth(500);
  ui.showSidebar(html);
}

function userManual(): void {
  var html = HtmlService.createTemplateFromFile("help/UserManual")
    .evaluate()
    .setTitle("User Manual")
    .setWidth(500);
  ui.showSidebar(html);
}

function reportABug(): void {
  var html = HtmlService.createHtmlOutputFromFile("help/ReportABug")
    .setTitle("Report a Bug")
    .setWidth(500);
  ui.showSidebar(html);
}

function requestAFeature(): void {
  var html = HtmlService.createHtmlOutputFromFile("help/RequestAFeature")
    .setTitle("Request a Feature")
    .setWidth(500);
  ui.showSidebar(html);
}
