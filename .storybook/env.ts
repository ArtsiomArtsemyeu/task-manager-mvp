export const storybookEnv = {
  APP_BASE_URL: "http://localhost:3000",
  DEFAULT_USER_ID: "storybook-user-id",
  DEFAULT_USER_EMAIL: "storybook@example.com",
  DEFAULT_USER_PASSWORD: "Storybook123!",
};

Object.assign(process.env, storybookEnv);
