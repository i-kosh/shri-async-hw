/**
 * Бонусные задания, для быстрой проверки достаточно раскомментировать
 * вызовы тестов в конце файла
 */

"use strict";

(function () {
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

  const getIterator = (iterable) => {
    try {
      return iterable[Symbol.iterator]();
    } catch (error) {
      throw new TypeError(
        `${iterable} is not iterable (cannot read property Symbol(Symbol.iterator))`
      );
    }
  };

  Promise._any = (iterable) => {
    return new Promise((resolve, reject) => {
      const iterator = getIterator(iterable);
      let next = iterator.next();
      let isAnyFulfilled = false;
      let promisesCount = 0;
      const errorArr = [];

      const onfulfilled = (val) => {
        isAnyFulfilled = true;
        resolve(val);
      };

      const onrejected = (reason) => {
        if (isAnyFulfilled) return;
        errorArr.push(reason);

        if (errorArr.length >= promisesCount) {
          reject(new AggregateError(errorArr, "All promises were rejected"));
        }
      };

      while (!next.done) {
        if (isAnyFulfilled) break;

        if (next.value instanceof Promise) {
          next.value.then(onfulfilled).catch(onrejected);
          promisesCount++;
        } else {
          onfulfilled(next.value);
        }

        next = iterator.next();
      }
    });
  };

  Promise._allSettled = (iterable) => {
    return new Promise((resolve) => {
      const iterator = getIterator(iterable);
      let next = iterator.next();

      let itemsCount = 0;
      const results = [];

      const resolveIf = () => {
        if (itemsCount === results.length) {
          resolve(results);
        }
      };

      const onfulfilled = (val) => {
        results.push({
          status: "fulfilled",
          value: val,
        });

        resolveIf();
      };

      const onrejected = (reason) => {
        results.push({
          status: "rejected",
          reason,
        });

        resolveIf();
      };

      while (!next.done) {
        if (next.value instanceof Promise) {
          next.value.then(onfulfilled).catch(onrejected);
        } else {
          onfulfilled(next.value);
        }

        itemsCount++;

        next = iterator.next();
      }
    });
  };

  Promise.prototype._finally = function (onFinally) {
    this.then(onFinally, onFinally);
    return this;
  };

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
