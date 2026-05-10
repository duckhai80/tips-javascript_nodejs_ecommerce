import md5 from "md5";

export const generateSign = (params: { [key: string]: any }) => {
  const keyToken = "XXXyyy";
  const sortKeys = [];
  let paramsHolder = "";

  params.keyToken = keyToken;
  params.v = "v1";

  for (let key in params) {
    if (key !== "sign") {
      sortKeys.push(key);
    }
  }

  sortKeys.sort();
  sortKeys.forEach((sortKey) => {
    paramsHolder += `${sortKey}${params[sortKey]}`;
  });

  return md5(paramsHolder).toString();
};
