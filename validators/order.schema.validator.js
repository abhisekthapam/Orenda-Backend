const { z } = require("zod");

const orderSchema = z.object({
  TableID: z.number().positive(),
  Total: z.number().positive(),
  OrderedItems: z.array(
    z.object({
      menuId: z.string().min(24).max(24),
      Quantity: z.number().positive(),
    })
  ),
});

module.exports = { orderSchema };
