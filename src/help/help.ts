namespace Help {
  const ui = SpreadsheetApp.getUi();

  function createHtmlSidebar(title: string, filePath: string) {
    const html = HtmlService.createHtmlOutputFromFile(filePath)
      .setTitle(title)
      .setWidth(500);
    return html;
  }

  export function showStartupGuide(): void {
    ui.showSidebar(createHtmlSidebar("Startup Guide", "help/StartupGuide"));
  }

  export function userManual(): void {
    ui.showSidebar(createHtmlSidebar("User Manual", "help/UserManual"));
  }

  export function reportABug(): void {
    ui.showSidebar(createHtmlSidebar("Report a Bug", "help/ReportABug"));
  }

  export function requestAFeature(): void {
    ui.showSidebar(
      createHtmlSidebar("Request a Feature", "help/RequestAFeature")
    );
  }
}
