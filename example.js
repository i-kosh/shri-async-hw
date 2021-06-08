"use strict";

(async function () {
  const { AsyncArray } = Homework;
  const { map } = HW;
  const tests = {};

  // ----------------------Утилиты----------------------

  const utils = {
    random: (max = 100, min = 1) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    createRandomPromise: (
      timeout = utils.random(),
      mustReject = false,
      infoCb
    ) => {
      if (!utils.createRandomPromise.lastId)
        utils.createRandomPromise.lastId = 0;
      const id = utils.createRandomPromise.lastId++;

      // Коллбэк для вывода информации в консоль
      if (infoCb) {
        infoCb({
          id,
          timeout,
          mustReject,
        });
      }

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (mustReject) {
            reject(`Reject: id=${id}, after ${timeout}ms`);
          } else {
            resolve(`Resolve: id=${id}, after ${timeout}ms`);
          }
        }, timeout);
      });
    },

    createRandomPromises: (qty = 3, maxTimeouot = 100, qtyOfRejection = 0) => {
      const table = [];
      const promises = [];

      const maxQty = qty - qtyOfRejection < 0 ? 0 : qty - qtyOfRejection;

      for (let i = 0; i < maxQty; i++) {
        promises.push(
          utils.createRandomPromise(utils.random(maxTimeouot), false, (inf) => {
            table.push(inf);
          })
        );
      }

      for (let i = 0; i < qtyOfRejection; i++) {
        promises.push(
          utils.createRandomPromise(utils.random(maxTimeouot), true, (inf) => {
            table.push(inf);
          })
        );
      }

      console.log("Promises created:");
      console.table(table);
      return promises;
    },
  };

  // ------------------Основное задание------------------

  tests.testMapWithCb = () => {
    console.info(`Пример вызова функции 'map' c коллбэком:`);

    const array = new AsyncArray([1, 2, 3, 4, 5]);

    const func = (val, index, arr) => {
      console.log(`current index: ${index}`);
      return val * 10;
    };

    const callback = (arr) => {
      console.log("Новый массив:");
      arr.print();

      console.log("CALLBACK DONE");
    };

    console.log("Изначальный массив:");
    array.print();

    map(array, func, callback);
  };

  tests.testMapWithOutCb = async () => {
    console.info(`Пример вызова функции 'map' БЕЗ коллбэка:`);

    const array = new AsyncArray([1, 2, 3, 4, 5]);

    const func = (val, index, arr) => {
      console.log(`current index: ${index}`);
      return val * 10;
    };

    console.log("Изначальный массив:");
    array.print();

    const asyncResult = await map(array, func);

    console.log("Новый массив:");
    asyncResult.print();
  };

  // --------------------Доп. задание--------------------

  tests.promiseAnyTest = async () => {
    const testVal = utils.createRandomPromises(3, 1000, 2);

    console.log("💙 Promise.any:", await Promise.any(testVal));
    console.log("💚 Promise._any:", await Promise._any(testVal));
  };

  tests.promiseAllSettledTest = async () => {
    const testVal = utils.createRandomPromises(3, 1000, 2);

    console.log("💙 Promise.allSettled:", await Promise.allSettled(testVal));
    console.log("💚 Promise._allSettled:", await Promise._allSettled(testVal));
  };

  tests.promiseFinallyTest = async () => {
    const timeout = 500;

    // Resolve

    const promiseNative = utils.createRandomPromise(timeout);
    const promiseNativeResult = await promiseNative.finally(() => {
      console.log("✔ Native finally on resolve");
    });
    console.log(`value: ${promiseNativeResult}`);

    const promiseCustom = utils.createRandomPromise(timeout);
    const promiseCustomResult = await promiseCustom._finally(() => {
      console.log("✔ Custom finally on resolve");
    });
    console.log(`value: ${promiseCustomResult}`);

    // Reject

    const promiseNativeReject = utils.createRandomPromise(timeout, true);
    const promiseNativeRejectResult = await promiseNativeReject
      .finally(() => {
        console.log("💥 Native finally on reject");
      })
      .catch(() => {
        // noop
      });
    console.log(`value: ${promiseNativeRejectResult}`);

    const promiseCustomReject = utils.createRandomPromise(timeout, true);
    const promiseCustomRejectResult = await promiseCustomReject
      ._finally(() => {
        console.log("💥 Custom finally on reject");
      })
      .catch(() => {
        // noop
      });
    console.log(`value: ${promiseCustomRejectResult}`);
  };

  window.HW.tests = tests;
  window.HW.utils = utils;

  console.info(`❕ Функции для быстрой демострации выполненного задания находятся в 'globalThis.HW.tests'
  Доп. утилиты для генерации промисов находятся в 'globalThis.HW.utils'`);
})();
