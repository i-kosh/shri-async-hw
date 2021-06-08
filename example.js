/**
 * Примеры работы функции `map`, для быстрой проверки достаточно раскомментировать
 * вызовы тестов в конце файла
 */

"use strict";

(async function () {
  const { AsyncArray } = Homework;
  const { map } = HW;

  const setUp = () => {
    const array = new AsyncArray([1, 2, 3, 4, 5]);

    const func = (val, index, arr) => {
      console.log(`i: ${index}`);
      return val * 10;
    };

    const callback = (arr) => {
      arr.print();
      console.log("CALLBACK DONE");
    };

    return [array, func, callback];
  };

  const withCb = () => {
    console.info(`Пример вызова функции 'map' c коллбеком:`);

    const args = setUp();
    args[0].print();
    map(...args);
  };

  const withOutCb = async () => {
    console.info(`Пример вызова функции 'map' без передачи коллбека:`);

    const args = setUp();
    args[0].print();
    const asyncResult = await map(...args.slice(0, 2));
    asyncResult.print();
  };

  // await withOutCb();
  // withCb();
})();
