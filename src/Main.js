function onInstall(e) {
  onOpen(e);
}

function onOpen(e) {
  const ui = SpreadsheetApp.getUi();
  //Add menus for Professor on spreadsheet
  ui.createAddonMenu()
    .addItem("Initialize", "initializeSheet")
    .addItem("Check Questions", "validateForms")
    .addItem("Create Application", "initializeApplication")
    //TODO: Add resend option
    //TODO: Add calendar event from test config
    .addSubMenu(
      ui
        .createMenu("Applications")
        .addItem("Start Application", "appStartApplication")
        .addItem("End Application", "appEndApplication")
    )
    .addSubMenu(
      ui
        .createMenu("Help")
        .addItem("User Manual", "userManual")
        .addItem("Report a Bug", "reportABug")
    )
    .addToUi();
}
