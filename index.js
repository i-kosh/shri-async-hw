"use strict";

(function () {
  const {
    AsyncArray,
    add,
    subtract,
    multiply,
    divide,
    mod,
    less,
    equal,
    lessOrEqual,
    sqrt,
  } = Homework;

  /**
   * Специяальная обертка, которая преобразует функции у которых
   * последним аргументом идет коллбек в функции которые возвращают промис
   *
   * @param {(...args, cb) => any} fn Функция с коллбеком
   * @returns {(...args) => Promise<any>}
   */
  function promisify(fn) {
    return function (...args) {
      return new Promise((resolve) => {
        fn(...args, resolve);
      });
    };
  }

  /**
   * Класс обертка который добавляет промисифицированные варианты
   * методов `AsyncArray` к любому инстансу `AsyncArray`
   */
  class AsyncArrayPromiseWrap {
    constructor(arr) {
      if (!(arr instanceof AsyncArray)) throw new TypeError("Invalid argument");

      this.arr = arr;

      this.setAsync = promisify(this.arr.set);
      this.pushAsync = promisify(this.arr.push);
      this.getAsync = promisify(this.arr.get);
      this.popAsync = promisify(this.arr.pop);
      this.lengthAsync = promisify(this.arr.length);
    }

    print() {
      this.arr.print();
    }
  }

  const addAsync = promisify(add);
  const subtractAsync = promisify(subtract);
  const multiplyAsync = promisify(multiply);
  const divideAsync = promisify(divide);
  const modAsync = promisify(mod);
  const lessAsync = promisify(less);
  const equalAsync = promisify(equal);
  const lessOrEqualAsync = promisify(lessOrEqual);
  const sqrtAsync = promisify(sqrt);

  /**
   * Реализует асинхронный вариант метода `Array#map` только для `AsyncArray`
   *
   * @param {AsyncArray} array Цель функции
   * @param {(value, index, originArr) => any} fn Функция-обработчик,
   * будет вызвана для каждого элемента целевого массива
   * @param {(AsyncArray) => void} cb Коллбек в который передатся новый массив
   *
   * @returns {Promise<AsyncArray | void>}
   */
  const map = async (array, fn, cb) => {
    const origin = new AsyncArrayPromiseWrap(array);
    const mapped = new AsyncArrayPromiseWrap(new AsyncArray());

    const originLength = await origin.lengthAsync();

    for (
      let i = 0;
      await lessAsync(i, originLength);
      i = await addAsync(i, 1)
    ) {
      const elem = await origin.getAsync(i);
      const fnResult = fn(elem, i, origin.arr);
      await mapped.pushAsync(fnResult);
    }

    if (cb) return cb(mapped.arr);
    return mapped.arr;
  };

  window.HW = {
    promisify,
    AsyncArrayPromiseWrap,
    addAsync,
    subtractAsync,
    multiplyAsync,
    divideAsync,
    modAsync,
    lessAsync,
    equalAsync,
    lessOrEqualAsync,
    sqrtAsync,
    map,
  };
})();
