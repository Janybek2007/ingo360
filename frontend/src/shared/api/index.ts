import ky from 'ky';

import { FULL_API_URL } from '../constants/environment';
import { TokenUtils as TokenUtilities } from './token-utils';

const http = ky.create({
  prefixUrl: FULL_API_URL,
  credentials: 'include',
  timeout: false,
  hooks: {
    beforeRequest: [
      request => {
        const isBrowserContent =
          request.headers.get('BROWSER_CONTENT') === 'true';
        request.headers.delete('BROWSER_CONTENT');

        if (!isBrowserContent && !request.headers.get('Content-Type')) {
          request.headers.set('Content-Type', 'application/json');
        }

        const token = TokenUtilities.getToken();
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
  },
});

export { http };
