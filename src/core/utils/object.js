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
