export function f(strings: string[]): string[] {
  return strings.map((str) => {
    return str
      .split(" ") // split string by space
      .filter((s) => s) // filter out empty strings
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1)) // capitalize first character in every word
      .join(" "); // combine strings on a space
  });
}
