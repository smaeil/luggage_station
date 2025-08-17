import { isDateBefore, parseDate } from "./middlewares/validation/date.js";

console.log(isDateBefore(new Date(), '8/16/2025'));

// console.log(new Date());
// console.log(parseDate('8/16/2025'));
// console.log((new Date()).getTime() <= parseDate('8/16/2025'));

console.log(JSON.parse(`["20kg", "20kg"]`));