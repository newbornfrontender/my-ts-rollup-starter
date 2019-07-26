import sum from './sum';

test('adds 1 + 2 to equal 3', (): void => {
  expect.hasAssertions();
  expect(sum(1, 2)).toBe(3);
});
