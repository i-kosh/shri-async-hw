# ШРИ ДЗ по теме "Асинхронность"

_Выполнил Кошелев Игорь_

[Репозиторий с заданием](https://github.com/dima117/shri-async-hw)

## Вариант 8

Реализовать операцию map для асинхронного массива.

```ts
function map(
  array: AsyncArray,
  fn: (cur: any, idx: Number, src: AsyncArray) => any,
  cb: (result: AsyncArray) => void
) {}
```
