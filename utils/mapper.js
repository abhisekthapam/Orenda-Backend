function mapRequestBodyToModel(body, schema) {
  try {
    return schema.parse(body);
  } catch (error) {
    throw new Error(`Validation error: ${error}`);
  }
}

module.exports = mapRequestBodyToModel;
