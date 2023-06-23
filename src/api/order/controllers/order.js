const stripe = require("stripe")(process.env.STRIPE_KEY);

("use strict");

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(context) {
    const { products } = context.request.body;
    try {
    const lineItems = await Promise.all(
      products.map(async (product) => {
        const item = await strapi
          .service("api::product.product")
          .findOne(product.id);
          return {
            price_data:{
                currency:"usd",
                product_data:{
                    name:item.title,
                },
                unit_amount:Math.round(item.price * 100)
            },
            quantity:product.amount
          }
      })
    );

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}?success=true`,
        cancel_url: `${process.env.CLIENT_URL}?canceled=true`,
        shipping_address_collection:{allowed_countries:["US","CA"]},
        payment_method_types:["card"],
        line_items: lineItems,
      });

      await strapi.service("api::order.order").create({ data:{ products, stripeId: session.id } })

      return {stripeSession: session}
    } catch (error) {
        console.log(`hellooo an error occurred`, error)
      context.response.status = 500;
      return error;
    }
  },
}));
