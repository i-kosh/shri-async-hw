"use strict";

(async function () {
  const { AsyncArray } = Homework;
  const { map } = HW;

  // ------------------Утилиты------------------

  const utils = {
    setUp: () => {
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
    },

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

      // Коллбек для вывода информации в консоль
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

  const withCb = () => {
    console.info(`Пример вызова функции 'map' c коллбеком:`);

    const args = utils.setUp();
    args[0].print();
    map(...args);
  };

  const withOutCb = async () => {
    console.info(`Пример вызова функции 'map' без передачи коллбека:`);

    const args = utils.setUp();
    args[0].print();
    const asyncResult = await map(...args.slice(0, 2));
    asyncResult.print();
  };

  // await withOutCb();
  // withCb();

  // --------------------Доп. задание--------------------

  const promiseAnyTest = async () => {
    const testVal = utils.createRandomPromises(3, 1000, 2);

    console.log("native:", await Promise.any(testVal));
    console.log("custom:", await Promise._any(testVal));
  };

  const promiseAllSettledTest = async () => {
    const testVal = utils.createRandomPromises(3, 1000, 2).concat([1, 2, 3]);

    console.log("native:", await Promise.allSettled(testVal));
    console.log("custom:", await Promise._allSettled(testVal));
  };

  const primiseFinallyTest = async () => {
    const timeout = 500;
    const promise = utils.createRandomPromise(timeout);

    console.log(`Timeout: ${timeout}ms`);

    console.time("test");
    console.log(
      await promise.finally(() => {
        console.log("native finally");
      })
    );

    console.log(
      await promise._finally(() => {
        console.log("custom finally");
      })
    );
    console.timeEnd("test");
  };

  // promiseAnyTest();
  // promiseAllSettledTest();
  // primiseFinallyTest();
})();
