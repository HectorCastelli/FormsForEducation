class StudentTestEmail {
  student: Student;
  emailHtml: string;
  emailFallback: string;

  constructor(student: Student, emailHtml: string, emailFallback: string) {
    this.student = student;
    this.emailHtml = emailHtml;
    this.emailFallback = emailFallback;
  }
}
