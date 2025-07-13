import _ from "lodash";

export const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

export const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 1]));
};

export const getUn_SelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 0]));
};

export const removeEmptyProperty = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value === null || value === undefined) {
      return;
    }

    if (typeof value === "object" && !Array.isArray(value)) {
      const nested = removeEmptyProperty(value);
      if (Object.keys(nested).length > 0) {
        newObj[key] = nested;
      }
    } else {
      newObj[key] = value;
    }
  });
  return newObj;
};

export const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj || {}).forEach((key) => {
    const value = obj[key];
    if (value === null || value === undefined) return;

    if (typeof value === "object" && !Array.isArray(value)) {
      const response = updateNestedObjectParser(value);
      Object.keys(response).forEach((item) => {
        final[`${key}.${item}`] = response[item];
      });
    } else {
      final[key] = value;
    }
  });
  return final;
};
