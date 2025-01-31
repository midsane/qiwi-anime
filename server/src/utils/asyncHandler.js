export const asyncHandler = (fnc) => (req, res, next) => {
  Promise.resolve(fnc(req, res, next)).catch((err) => {
    console.log("err " + JSON.stringify(err));
    next(err);
  });
};
