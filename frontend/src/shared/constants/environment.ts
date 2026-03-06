const API_URL = import.meta.env.VITE_API_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;
const API_SOCKET_URL = import.meta.env.VITE_API_SOCKET_URL;

export const FULL_API_URL = `${API_URL}${API_VERSION}`;
export const FULL_API_SOCKET_URL = `${API_SOCKET_URL}${API_VERSION}`;
