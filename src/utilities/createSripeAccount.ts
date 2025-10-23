import { stripe } from "../config/stripe";


  export async function createDriverConnectAccount(email: string, driverId: string) {
    try {
      const account = stripe.accounts.create({
        type: "express",
        country: "GB",
        email: email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: "individual",

        metadata: {
          driverId: driverId,
        },
      });
      
      const account_id = (await account).id;

      const accountLink = await stripe.accountLinks.create({
        account: account_id,
        refresh_url: `${process.env.FRONTEND_URL}/onboard/refresh`, 
        return_url: `${process.env.FRONTEND_URL}/onboard/complete`, 
        type: "account_onboarding",
      });

      return { accountId: account_id, accountLinkUrl: accountLink.url };
    } catch (err) {
      console.log(err);
       throw new Error( 'Stripe account creation failed');
    }
  }

  // const accountLink = await stripe.accountLinks.create({
//     account: driverDetails.stripeId,
//     refresh_url: `${process.env.FRONTEND_URL}/onboard/refresh`, // must include http(s) 
//     return_url: `${process.env.FRONTEND_URL}/onboard/complete`,
//     type: 'account_onboarding',
//   });
//   console.log("accountLink",accountLink);

    //  https://connect.stripe.com/setup/e/acct_1SLPnb1IGLplzzU6/Aqz9HAEf0rVA acct_1SLPnb1IGLplzzU6
// {
//   accountId: 'acct_1SLQiD1kAmVkPtnD',
//   accountLinkUrl: 'https://connect.stripe.com/setup/e/acct_1SLQiD1kAmVkPtnD/0OndQ4GBjh2g'
// }