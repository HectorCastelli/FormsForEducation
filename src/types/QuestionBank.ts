class QuestionBank {
  name: string;
  folderQuestions: string[];
  weight: number;
  mandatory: number;
  optional: number;

  constructor(
    name: string,
    folderQuestions: string[],
    weight: number,
    mandatory: number,
    optional: number
  ) {
    this.name = name;
    this.folderQuestions = folderQuestions;
    this.weight = weight;
    this.mandatory = mandatory;
    this.optional = optional;
  }
}
