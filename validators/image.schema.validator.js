const { z } = require("zod");

const imageSchema = z.object({
  name: z.string().min(1, "Image name is required"),
  url: z.string().url("Invalid image URL").optional(),
});

module.exports = { imageSchema };
