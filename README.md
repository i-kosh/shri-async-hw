# ШРИ ДЗ по теме "Асинхронность"

_Выполнил Кошелев Игорь_

[Репозиторий с заданием](https://github.com/dima117/shri-async-hw)

- [Выполненное задание (GH Page)](https://i-kosh.github.io/shri-async-hw/index.html)
- [Выполненное задание (Код)](https://github.com/i-kosh/shri-async-hw/blob/master/index.js)
- [Код примера](https://github.com/i-kosh/shri-async-hw/blob/master/example.js)

## Вариант 8

Реализовать операцию map для асинхронного массива.

```ts
function map(
  array: AsyncArray,
  fn: (cur: any, idx: Number, src: AsyncArray) => any,
  cb: (result: AsyncArray) => void
) {}
```
