Array.from({ length: 5 })
  .map(
    (_, i) =>
      function genPromiseFn(lastVal) {
        console.info('lastVal', lastVal);
        return new Promise(r => {
          setTimeout(() => r(i), 200);
        });
      },
  )
  .reduce((chain, sect) => chain.then(sect), Promise.resolve())
  .then(console.warn.bind(null, 'EndVal:'));
