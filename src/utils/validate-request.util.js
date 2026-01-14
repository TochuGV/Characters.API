import ErrorFactory from "../errors/error-factory.js";

const validateRequest = (schema, data) => {
  const validation = schema.safeParse(data);
  if(!validation.success){
    const formattedErrors = validation.error.issues.map(issue => ({
      field: issue.path.join("."),
      message: issue.message
    }));
    throw ErrorFactory.validation("Invalid input data", formattedErrors);
  };
  return validation.data;
};

export default validateRequest;