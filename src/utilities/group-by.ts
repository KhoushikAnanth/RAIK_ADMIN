// export function groupBy(objectArray, property) {
//   return objectArray.reduce(function (acc, obj) {
//     let key = obj[property];
//     if (!acc[key]) {
//       acc[key] = [];
//     }
//     acc[key].push(obj);
//     console.log(acc);
//     return acc;
//   }, {});
// }

export function groupBy(objectArray) {
  return objectArray.reduce(function (memo: any, product: any) {
    if (!memo[product["vendor"]]) {
      memo[product["vendor"]] = [];
    }
    memo[product["vendor"]].push(product);
    return memo;
  }, {});
}
