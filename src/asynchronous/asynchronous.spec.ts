test('async func return "Hello, World!"', async (): Promise<void> => {
  expect.hasAssertions();

  const { asynchronous } = await import('./asynchronous');

  expect(asynchronous()).toBe('Hello, World!');
});
