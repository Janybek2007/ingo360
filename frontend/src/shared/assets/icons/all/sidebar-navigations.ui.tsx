import React from 'react';

import { routePaths } from '#/shared/router';

import type { IStaticIconProps as IStaticIconProperties } from '../types';

export const SidebarNavigationsIcons: React.FC<
  IStaticIconProperties & { path: string }
> = React.memo(properties => {
  if (properties.path == routePaths.customer.home) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        {...properties}
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </g>
      </svg>
    );
  }
  if (properties.path === routePaths.customer.primarySales) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        {...properties}
      >
        <path
          fill="currentColor"
          d="M17.293 2.293C17 2.586 17 3.057 17 4v13c0 .943 0 1.414.293 1.707S18.057 19 19 19s1.414 0 1.707-.293S21 17.943 21 17V4c0-.943 0-1.414-.293-1.707S19.943 2 19 2s-1.414 0-1.707.293M10 7c0-.943 0-1.414.293-1.707S11.057 5 12 5s1.414 0 1.707.293S14 6.057 14 7v10c0 .943 0 1.414-.293 1.707S12.943 19 12 19s-1.414 0-1.707-.293S10 17.943 10 17zM3.293 9.293C3 9.586 3 10.057 3 11v6c0 .943 0 1.414.293 1.707S4.057 19 5 19s1.414 0 1.707-.293S7 17.943 7 17v-6c0-.943 0-1.414-.293-1.707S5.943 9 5 9s-1.414 0-1.707.293M3 21.25a.75.75 0 0 0 0 1.5h18a.75.75 0 0 0 0-1.5z"
        />
      </svg>
    );
  }
  if (properties.path === routePaths.customer.secondarySales) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        {...properties}
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="m1.75 1.75v12.5h12.5m-9-3v-2.5m4 2.5v-5.5m4 5.5v-8.5"
        />
      </svg>
    );
  }
  if (properties.path === routePaths.customer.tertiarySales) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        {...properties}
      >
        <path
          fill="currentColor"
          d="M16.749 2h4.554l.1.014l.099.028l.06.026q.12.052.219.15l.04.044l.044.057l.054.09l.039.09l.019.064l.014.064l.009.095v4.532a.75.75 0 0 1-1.493.102l-.007-.102V4.559l-6.44 6.44a.75.75 0 0 1-.976.073L13 11L9.97 8.09l-5.69 5.689a.75.75 0 0 1-1.133-.977l.073-.084l6.22-6.22a.75.75 0 0 1 .976-.072l.084.072l3.03 2.91L19.438 3.5h-2.69a.75.75 0 0 1-.742-.648l-.007-.102a.75.75 0 0 1 .648-.743zM3.75 17a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75m5.75-3.25a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0zM13.75 15a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0v-5.5a.75.75 0 0 1 .75-.75m5.75-4.25a.75.75 0 0 0-1.5 0v10.5a.75.75 0 0 0 1.5 0z"
        />
      </svg>
    );
  }
  if (properties.path === routePaths.customer.marketDevelopment) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        {...properties}
      >
        <path
          fill="currentColor"
          d="M3 2.5a.5.5 0 0 0-1 0v9A2.5 2.5 0 0 0 4.5 14h9a.5.5 0 0 0 0-1h-9A1.5 1.5 0 0 1 3 11.5zm7 2a.5.5 0 0 0 .5.5h1.793L9 8.293L7.354 6.646a.5.5 0 0 0-.708 0l-2.5 2.5a.5.5 0 1 0 .708.708L7 7.707l1.646 1.647a.5.5 0 0 0 .708 0L13 5.707v1.87a.5.5 0 0 0 1 0V4.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5"
        />
      </svg>
    );
  }
  if (properties.path === routePaths.customer.visitActivity) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        {...properties}
      >
        <path
          fill="currentColor"
          d="M8 12q-.425 0-.712.288T7 13v3q0 .425.288.713T8 17t.713-.288T9 16v-3q0-.425-.288-.712T8 12m8-5q-.425 0-.712.288T15 8v8q0 .425.288.713T16 17t.713-.288T17 16V8q0-.425-.288-.712T16 7m-4 7q-.425 0-.712.288T11 15v1q0 .425.288.713T12 17t.713-.288T13 16v-1q0-.425-.288-.712T12 14m-7 7q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm7-9q.425 0 .713-.288T13 11t-.288-.712T12 10t-.712.288T11 11t.288.713T12 12"
        />
      </svg>
    );
  }
  if (properties.path === routePaths.administrator.ingoAccounts) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        {...properties}
      >
        <path
          fill="currentColor"
          d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.4 3.4 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.4 3.4 0 0 0 15 11a3.5 3.5 0 0 0 0-7"
        />
      </svg>
    );
  }
  if (properties.path === routePaths.administrator.customerAccounts) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        {...properties}
      >
        <path
          fill="currentColor"
          d="M12 5.5A3.5 3.5 0 0 1 15.5 9a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 8.5 9A3.5 3.5 0 0 1 12 5.5M5 8c.56 0 1.08.15 1.53.42c-.15 1.43.27 2.85 1.13 3.96C7.16 13.34 6.16 14 5 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3m14 0a3 3 0 0 1 3 3a3 3 0 0 1-3 3c-1.16 0-2.16-.66-2.66-1.62a5.54 5.54 0 0 0 1.13-3.96c.45-.27.97-.42 1.53-.42M5.5 18.25c0-2.07 2.91-3.75 6.5-3.75s6.5 1.68 6.5 3.75V20h-13zM0 20v-1.5c0-1.39 1.89-2.56 4.45-2.9c-.59.68-.95 1.62-.95 2.65V20zm24 0h-3.5v-1.75c0-1.03-.36-1.97-.95-2.65c2.56.34 4.45 1.51 4.45 2.9z"
        />
      </svg>
    );
  }
  if (properties.path === routePaths.administrator.companyManagement) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        {...properties}
      >
        <path
          fill="currentColor"
          d="M5 3v18h6v-3.5h2V21h6V3zm2 2h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zM7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2H7zm8 0h2v2h-2z"
        />
      </svg>
    );
  }

  if (properties.path === routePaths.operator.dbWork) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        {...properties}
      >
        <path
          fill="currentColor"
          d="M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4s8-1.79 8-4s-3.58-4-8-4M4 9v3c0 2.21 3.58 4 8 4s8-1.79 8-4V9c0 2.21-3.58 4-8 4s-8-1.79-8-4m0 5v3c0 2.21 3.58 4 8 4s8-1.79 8-4v-3c0 2.21-3.58 4-8 4s-8-1.79-8-4"
        />
      </svg>
    );
  }
  if (properties.path === routePaths.operator.referenceWork) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        {...properties}
      >
        <path
          fill="currentColor"
          d="m19 2l-5 4.5v11l5-4.5zM6.5 5C4.55 5 2.45 5.4 1 6.5v14.66c0 .25.25.5.5.5c.1 0 .15-.07.25-.07c1.35-.65 3.3-1.09 4.75-1.09c1.95 0 4.05.4 5.5 1.5c1.35-.85 3.8-1.5 5.5-1.5c1.65 0 3.35.31 4.75 1.06c.1.05.15.03.25.03c.25 0 .5-.25.5-.5V6.5c-.6-.45-1.25-.75-2-1V19c-1.1-.35-2.3-.5-3.5-.5c-1.7 0-4.15.65-5.5 1.5V6.5C10.55 5.4 8.45 5 6.5 5"
        />
      </svg>
    );
  }
  if (properties.path === routePaths.operator.reportLogs) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        {...properties}
      >
        <path
          fill="currentColor"
          d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm0 2h7v5h5v11H6zm2 8v2h8v-2zm0 4v2h5v-2z"
        />
      </svg>
    );
  }

  return null;
});

SidebarNavigationsIcons.displayName = '_SidebarNavigationsIcons_';
