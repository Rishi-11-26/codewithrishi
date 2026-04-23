export const problems = [
  {
    id: "1",
    title: "Even Or Odd",
    description:
      "Given an integer n, print Even if n is divisible by 2, otherwise print Odd.",
    difficulty: "Easy",
    tags: ["math", "conditionals", "basics"],
    testCases: [
      { input: "5", output: "Odd" },
      { input: "6", output: "Even" }
    ]
  },
  {
    id: "2",
    title: "Sum Of Two Numbers",
    description:
      "Given two integers a and b separated by space, print their sum.",
    difficulty: "Easy",
    tags: ["math", "input-output", "basics"],
    testCases: [
      { input: "4 7", output: "11" },
      { input: "10 25", output: "35" }
    ]
  }
];

export const submissions = [];

let problemCounter = problems.length + 1;

export function nextProblemId() {
  const id = String(problemCounter);
  problemCounter += 1;
  return id;
}
