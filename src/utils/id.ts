export const uid = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

console.log(uid)