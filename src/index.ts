import sum from './sum/sum';

// eslint-disable-next-line no-console
console.log(sum(2, 2));

setTimeout(
  (): Promise<void> =>
    import('./asynchronous/asynchronous').then(({ asynchronous }): void =>
      // eslint-disable-next-line no-console
      console.log(asynchronous()),
    ),
  1000,
);
