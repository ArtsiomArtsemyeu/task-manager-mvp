import 'server-only';

import { getRequiredEnv } from '../env';

export const defaultUser = {
  id: getRequiredEnv('DEFAULT_USER_ID'),
  email: getRequiredEnv('DEFAULT_USER_EMAIL'),
  password: getRequiredEnv('DEFAULT_USER_PASSWORD'),
};
