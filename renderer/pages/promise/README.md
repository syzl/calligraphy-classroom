# demonstrate for promise

## 常规

```js
// basic

Promise.resolve();

Promise.reject();

new Promise((r, j) => {
  r();
});
new Promise((r, j) => {
  j();
});

new Promise((r, j) => {
  Math.random() > 0.5 ? r() : j();
});

new Promise(() => 'a'); // Failure

// chain

Promise.resolve().then(() => 'B');

Promise.resolve(
  () =>
    new Promise(r => {
      r('C');
    }),
);

// catch

// manual race

new Promise((r, j) => {
  setTimeout(() => r, 100 + Math.random());
  setTimeout(() => j, 100 + Math.random());
})
  .then(() => console.info('resolved'))
  .catch(e => console.error('rejectec'));

// all
Promise.all([Promise.resolve(), Promise.resolve()]);

// race

Promise.race([Promise.resolve(), Promise.resolve()]);

// sequence

Array.from({ length: 5 })
  .map(
    (_, i) =>
      function genPromiseFn(lastVal) {
        console.info('lastVal', lastVal);
        return new Promise(r => {
          setTimeout(() => r(i), 100);
        });
      },
  )
  .reduce((chain, sect) => chain.then(sect), Promise.resolve());
// parellel

// async
```
