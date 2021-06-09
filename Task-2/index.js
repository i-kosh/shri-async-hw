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
  const { filter } = rxjs.operators;

  // -----------Задание 1--------------

  const clearButton = document.querySelector("#button");
  const responseContainer = document.querySelector("#response-container");
  const cancelPrevRequestContainer = document.querySelector(
    "#cancel-prev-request-container"
  );

  const clearButtonClickObservable$ = fromEvent(clearButton, "click");

  clearButtonClickObservable$.subscribe(() => {
    responseContainer.textContent = "";
    cancelPrevRequestContainer.textContent = "";
  });

  // -----------Задание 2--------------

  const input = document.querySelector("#input");

  const inputObservable$ = fromEvent(input, "input");

  const resolveCancelRequest = () => {
    let lastStartTimestamp = 0;

    inputObservable$.subscribe((evt) => {
      const inputValue = evt.target.value;
      const requestObservable$ = from(getApiResponse(inputValue));

      const startTimestamp = Date.now();
      lastStartTimestamp = startTimestamp;

      requestObservable$
        .pipe(
          filter(() => {
            return (
              lastStartTimestamp > 0 &&
              Date.now() > lastStartTimestamp &&
              startTimestamp >= lastStartTimestamp
            );
          })
        )
        .subscribe((resolved) => {
          cancelPrevRequestContainer.textContent = resolved;
        });
    });
  };

  resolveCancelRequest();
})();
