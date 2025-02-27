import z from "zod";

export const parseNumericQueryParam = (val) => {
    if (typeof val === "string") {
        const parsed = Number(val);
        return isNaN(parsed) ? undefined : parsed;
    }
    return val;
};