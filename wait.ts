export const wait = function (milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve("done!"), milliseconds)
  });
};
