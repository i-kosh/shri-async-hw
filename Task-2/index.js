"use strict";

(function () {
  const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const getApiResponse = (searchString) =>
    new Promise((resolve) =>
      setTimeout(() => resolve(searchString), getRandomInt(1, 10) * 500)
    );

  // ----------Задание----------

  const rxjs = window.rxjs;
  /** @type {import("../node_modules/rxjs")} */
  const { fromEvent, from } = rxjs;
  /** @type {import("../node_modules/rxjs/dist/types/operators")} */
  const { switchMap, mergeMap, scan } = rxjs.operators;

  // -----------Подготовка-------------

  const clearButton = document.querySelector("#button");
  const responseContainer = document.querySelector("#response-container");
  const cancelPrevRequestContainer = document.querySelector(
    "#cancel-prev-request-container"
  );
  const input = document.querySelector("#input");

  const inputObservable$ = fromEvent(input, "input");
  const clearButtonClickObservable$ = fromEvent(clearButton, "click");

  // -----------Задание 1--------------

  clearButtonClickObservable$.subscribe(() => {
    responseContainer.textContent = "";
    cancelPrevRequestContainer.textContent = "";
  });

  // -----------Задание 2--------------

  const resolveCancelRequest = () => {
    inputObservable$
      .pipe(switchMap((evt) => from(getApiResponse(evt.target.value))))
      .subscribe((resolved) => {
        cancelPrevRequestContainer.textContent = resolved;
      });
  };

  resolveCancelRequest();

  // -----------Задание 3--------------

  const resolveRaceCondition = () => {
    inputObservable$
      .pipe(
        mergeMap((evt) => from(getApiResponse(evt.target.value))),
        scan((acc, val) => (acc.length < val.length ? val : acc))
      )
      .subscribe((resolved) => {
        responseContainer.textContent = resolved;
      });
  };

  resolveRaceCondition();
})();
