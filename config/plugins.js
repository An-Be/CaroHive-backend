module.exports = ({ env }) => ({
    "vercel-deploy": {
      enabled: true,
      config: {
        deployHook: process.env.VERCEL_DEPLOY_PLUGIN_HOOK,
        apiToken: process.env.VERCEL_DEPLOY_PLUGIN_TOKEN,
        appFilter: process.env.VERCEL_DEPLOY_PLUGIN_APP_FILTER,
        roles: ["strapi-super-admin", "strapi-editor", "strapi-author"],
      },
    },
  });