import z from "zod";

export const parseNumericQueryParam = (val) => {
    if(typeof val !== "string") return undefined;
    const num = Number(val);
    return (isNaN(num)) ? z.NEVER : num;
};