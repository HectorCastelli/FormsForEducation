namespace Application {
  export function createNewApplicationSheet(): void {
    //Give instructions for the professor on what he needs to do to get the application started.
    const applicationNameResponse = SpreadsheetApp.getUi().prompt(
      "Insert the name of the test",
      SpreadsheetApp.getUi().ButtonSet.OK_CANCEL
    );
    if (
      applicationNameResponse.getSelectedButton() ===
      SpreadsheetApp.getUi().Button.OK
    ) {
      initializeApplicationSheet(applicationNameResponse.getResponseText());
    }
    SpreadsheetApp.getActive()!.toast(
      "New Application created!",
      "FormsForEducations",
      2
    );
  }

  export function initializeApplicationSheet(applicationName: string): void {
    const appSheet = SpreadsheetApp.getActive()!.insertSheet(
      `${Constants.sheetNames.applicationSheet}-${applicationName}`
    );
    const questionBank = SpreadsheetApp.getActive()!
      .getSheetByName(Constants.sheetNames.configurationSheet)!
      .getDataRange()
      .getValues();
    appSheet.deleteColumns(5, appSheet.getMaxColumns() - 5);
    appSheet.deleteRows(
      7 + questionBank.length,
      appSheet.getMaxRows() - (7 + questionBank.length)
    );
    appSheet.getRange(1, 1, 3, 5).setValues([
      ["Test Name", "Applied On", "Start Time", "End Time", "Status"],
      [
        applicationName,
        null,
        null,
        null,
        Constants.applicationStatus.PREPARATION,
      ],
      [null, "Actual Times", null, null, null],
    ]);
    appSheet.getRange(4, 1, questionBank.length, 5).setValues(questionBank);
    appSheet.getRange(5 + questionBank.length, 1, 2, 4).setValues([
      ["Students", null, null, null],
      ["Name", "Email", "Test Id", "Email Sent"],
    ]);
  }

  export function startApplication(): void {
    const appSheet = SpreadsheetApp.getActiveSheet();
    if (appSheet != null) {
      if (
        appSheet.getName().includes(Constants.sheetNames.applicationSheet + "-")
      ) {
        if (
          appSheet.getRange(2, 5).getValue() ===
          Constants.applicationStatus.PREPARATION
        ) {
          const testName = appSheet.getRange(2, 1).getValue();
          //Gather questions
          const questionBank = Questions.retrieveQuestionBank(
            appSheet.getDataRange().getValues()
          );
          //Activate Forms
          Forms.activateForms();
          //Gather students
          const students: Student[] = appSheet
            .getRange(
              8 + questionBank.length,
              1,
              appSheet.getMaxRows() - (8 + questionBank.length) + 1,
              2
            )
            .getValues()
            .map((row) => new Student(row[0], row[1]));
          //Randomize students tests
          const studentsTests = Questions.generateTests(
            appSheet.getName(),
            students,
            questionBank
          );
          //Update rows with students to have their Ids
          studentsTests.forEach((studentTest) => {
            const emailRange = appSheet
              .createTextFinder(studentTest.student.email)
              .findNext()!;
            appSheet
              .getRange(emailRange.getRow(), 3)
              .setValue(studentTest.testId);
          });
          //Create email bodies
          const emails = createApplicationEmails(studentsTests);
          //Send Emails
          const cc = SpreadsheetApp.getActive()!.getOwner()!.getEmail();
          for (const email of emails) {
            const emailRange = appSheet
              .createTextFinder(email.student.email)
              .findNext()!;
            GmailApp.sendEmail(
              email.student.email,
              `Here is your test: ${testName}`,
              email.emailFallback,
              {
                htmlBody: email.emailHtml,
              }
            );
            appSheet.getRange(emailRange.getRow(), 4).setValue(true);
          }
          //Send email to teacher
          GmailApp.sendEmail(
            cc,
            `Professor copy: ${testName}`,
            emails
              .map((e) => `TO: ${e.student.email}\\n${e.emailFallback}`)
              .reduce((total, e) => {
                return `${total}\\n=======\\n${e}`;
              }),
            {
              htmlBody: emails
                .map(
                  (e) =>
                    `<h1>TO: ${e.student.email}</h1><div>${e.emailHtml}<div>`
                )
                .reduce((total, e) => {
                  return `${total}<hr>${e}`;
                }),
            }
          );
          //Update application status
          appSheet
            .getRange(2, 5)
            .setValue(Constants.applicationStatus.PROGRESS);
          appSheet.getRange(3, 3).setValue(new Date());

          SpreadsheetApp.getActive()!.toast(
            "Application Started!",
            "FormsForEducations",
            2
          );
        } else {
          SpreadsheetApp.getUi().alert(
            `This application is not in ${Constants.applicationStatus.PREPARATION}`
          );
        }
      } else {
        SpreadsheetApp.getUi().alert(
          "Make sure you have the sheet of the test you want to apply currently open"
        );
      }
    }
  }

  export function resendApplication(): void {
    const applicationIdResponse = SpreadsheetApp.getUi().prompt(
      "Insert the Application ID",
      SpreadsheetApp.getUi().ButtonSet.OK_CANCEL
    );
    if (
      applicationIdResponse.getSelectedButton() ===
      SpreadsheetApp.getUi().Button.OK
    ) {
      var test = StudentTests.findByTestId(
        applicationIdResponse.getResponseText()
      )!;

      const newEmailResponse = SpreadsheetApp.getUi().prompt(
        "Insert the email to send to",
        SpreadsheetApp.getUi().ButtonSet.OK_CANCEL
      );
      if (
        newEmailResponse.getSelectedButton() ===
        SpreadsheetApp.getUi().Button.OK
      ) {
        test.student.email = newEmailResponse.getResponseText();
        const email = createApplicationEmail(test);
        GmailApp.sendEmail(
          email.student.email,
          `Here is your test: ${test.testId}`,
          email.emailFallback,
          {
            htmlBody: email.emailHtml,
          }
        );
      }
    }
    SpreadsheetApp.getActive()!.toast("Email sent!", "FormsForEducations", 2);
  }

  export function createApplicationEmail(
    studentTest: StudentTests
  ): StudentTestEmail {
    const questionLinks = new QuestionLinks();
    studentTest.mandatory.forEach((mandatory) => {
      const formFile = FormApp.openById(mandatory);
      const questionItem = formFile
        .getItems(FormApp.ItemType.TEXT)
        .filter((item) => {
          return item.asTextItem().getTitle() === "Test ID";
        })!
        .pop()!
        .asTextItem();
      questionLinks.mandatory.push(
        new QuestionItem(
          formFile.getTitle(),
          formFile
            .createResponse()
            .withItemResponse(questionItem.createResponse(studentTest.testId))
            .toPrefilledUrl()
        )
      );
    });
    studentTest.optional.forEach((mandatory) => {
      const formFile = FormApp.openById(mandatory);
      const questionItem = formFile
        .getItems(FormApp.ItemType.TEXT)
        .filter((item) => {
          return item.asTextItem().getTitle() === "Test ID";
        })!
        .pop()!
        .asTextItem();
      questionLinks.optional.push(
        new QuestionItem(
          formFile.getTitle(),
          formFile
            .createResponse()
            .withItemResponse(questionItem.createResponse(studentTest.testId))
            .toPrefilledUrl()
        )
      );
    });

    const emailTemplate = HtmlService.createTemplateFromFile("Emails/NewTest");
    emailTemplate.testId = studentTest.testId;
    emailTemplate.questions = questionLinks;

    const emailOutput = emailTemplate.evaluate().getContent();
    const emailFallback = `Here is your Test ID: ${studentTest.testId}

    Mandatory Questions:
    ${questionLinks.mandatory.map((q) => `-> ${q.link}\\n`).toString()}

    Optional Questions:
    ${questionLinks.optional.map((q) => `-> ${q.link}\\n`).toString()}
    `;

    return new StudentTestEmail(
      studentTest.student,
      emailOutput,
      emailFallback
    );
  }

  export function createApplicationEmails(
    studentsTests: StudentTests[]
  ): StudentTestEmail[] {
    return studentsTests.map((studentTest) =>
      createApplicationEmail(studentTest)
    );
  }

  export function endApplication(): void {
    const appSheet = SpreadsheetApp.getActiveSheet();
    if (appSheet != null) {
      if (
        appSheet.getName().includes(Constants.sheetNames.applicationSheet + "-")
      ) {
        if (
          appSheet.getRange(2, 5).getValue() ===
          Constants.applicationStatus.PROGRESS
        ) {
          //Deactivate forms
          Forms.deactivateForms();
          //Close applications
          appSheet.getRange(2, 5).setValue(Constants.applicationStatus.CLOSED);
          appSheet.getRange(3, 4).setValue(new Date());
          //TODO: Compute results sheet with grades (see grading.ts)

          //TODO: Ask teacher if automated scores should be released (Release feedback from all forms).
          SpreadsheetApp.getActive()!.toast(
            "Application Finished!",
            "FormsForEducations",
            2
          );
        } else {
          SpreadsheetApp.getUi().alert(
            `This application is not in ${Constants.applicationStatus.PROGRESS}`
          );
        }
      } else {
        SpreadsheetApp.getUi().alert(
          "Make sure you have the sheet of the test you want to close currently open"
        );
      }
    }
  }
}
