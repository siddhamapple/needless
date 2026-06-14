// Five tasks chosen to provoke over-engineering in a baseline agent.
// Each has a one-liner or stdlib answer that needless will reach for.
module.exports = [
  {
    id: 'isPrime',
    label: 'isPrime(n)',
    prompt: 'Write a Python function isPrime(n) that returns True if n is prime, False otherwise. Only the function, no tests or examples.',
  },
  {
    id: 'formatPhone',
    label: 'formatPhone(s)',
    prompt: 'Write a JavaScript function formatPhone(s) that formats a 10-digit string like "1234567890" as "(123) 456-7890". Only the function, no tests.',
  },
  {
    id: 'truncate',
    label: 'truncate(s,n)',
    prompt: 'Write a JavaScript function truncate(str, n) that returns str cut to n characters with "..." appended if it was cut. Only the function, no tests.',
  },
  {
    id: 'shuffle',
    label: 'shuffle(arr)',
    prompt: 'Write a JavaScript function shuffle(arr) that shuffles the array in-place. Only the function, no tests.',
  },
  {
    id: 'average',
    label: 'average(nums)',
    prompt: 'Write a Python function average(nums) that returns the arithmetic mean of a list of numbers. Only the function, no tests.',
  },
];
