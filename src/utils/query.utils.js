export const parseNumericQueryParam = (val) => {
  if (typeof val === "string" && val.trim() !== "") {
    const parsed = Number(val);
    if(!isNaN(parsed)) return parsed;
  };
  return val;
};