export const printV = function(data: any, ...keys: string[]) {
  const tmp = { ...data };
  keys.forEach(key => {
    delete tmp[key];
  });
  return JSON.stringify(tmp, null, 1);
};
