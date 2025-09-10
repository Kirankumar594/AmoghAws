import Joi from 'joi';

export const validateOrder = (order) => {
  const schema = Joi.object({
    shippingInfo: Joi.object({
      fullName: Joi.string().required(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required()
    }).required(),
    items: Joi.array().items(
      Joi.object({
        product: Joi.object({
          _id: Joi.string().required(),
          name: Joi.string().required(),
          price: Joi.number().required(),
          quantity: Joi.number().required()
        }).required(),
        quantity: Joi.number().required(),
        price: Joi.number().required()
      })
    ).min(1).required(),
    paymentMethod: Joi.string().valid('credit-card', 'bank-transfer').required(),
    paymentDetails: Joi.when('paymentMethod', {
      is: 'credit-card',
      then: Joi.object({
        cardLastFour: Joi.string().length(4).required(),
        cardBrand: Joi.string().required(),
        cardholderName: Joi.string().required()
      }).required(),
      otherwise: Joi.optional()
    }),
    subtotal: Joi.number().required(),
    shipping: Joi.number().required(),
    tax: Joi.number().required(),
    total: Joi.number().required(),
    orderNumber: Joi.forbidden() // should not come from client
  });

  return schema.validate(order);
};
