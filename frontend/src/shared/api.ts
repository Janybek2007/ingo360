import Cookies from 'js-cookie';
import ky from 'ky';

import { FULL_API_URL } from './constants/environment';

const http = ky.create({
  prefixUrl: FULL_API_URL,
  credentials: 'include',
  hooks: {
    beforeRequest: [
      request => {
        const isBrowserContent =
          request.headers.get('BROWSER_CONTENT') === 'true';
        request.headers.delete('BROWSER_CONTENT');
        const canHeaders = request.headers.get('Content-Type');
        if (!isBrowserContent && !canHeaders) {
          request.headers.set('Content-Type', 'application/json');
        }
        const token = Cookies.get('access_token');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
  },
});

export { http };
