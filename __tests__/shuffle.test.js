const shuffle = require("../src/shuffle");

const {copyArray} = shuffle;

describe("Test cases for shuffle", () => {
  test("shuffle should return an array", () => {
    const origionals = [5, 3, 2];
    const shuffled = shuffle(origionals);
    expect(Array.isArray(shuffled)).toBe(true); 
  });

  test("The returned array should be the same length as the argument's length'", () => {
    const origionals = [5, 3, 2];
    const shuffled = shuffle(origionals);
    expect(shuffled.length).toBe(origionals.length);
  })

  test("All the same items are in the array", () => {
      const origionals = [8, 4, 3];
      const shuffled = shuffle(origionals);
      expect(shuffled.sort()).toEqual(origionals.sort());
  })

  test("The items have been shuffled around", () => {
    const origionals = [8, 4, 3];
    const shuffled = shuffle(origionals);
    expect(shuffled[0]).not.toBe(origionals[0]); 
    expect(shuffled[1]).not.toBe(origionals[1]);
    expect(shuffled[2]).not.toBe(origionals[2]);
  })
});

// console.log(shuffle([1, 2, 5]));
