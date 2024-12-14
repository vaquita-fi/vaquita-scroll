import { NEXT_PUBLIC_API } from '../env';
import {
  ContentResponseType,
  ContentsResponseType,
  ErrorResponseType,
} from '../types';
import { isStringJson } from './object';

export const includeApi = (route: string) => {
  return `${NEXT_PUBLIC_API}/vaquita/api/v1${route}`;
};

export const authorizedRequest = async (url: string, options?: RequestInit) => {
  const { method, body, signal, headers, cache, next } = options || {};

  const requestHeaders = new Headers(headers ?? {});

  if (!(body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  return await fetch(url, {
    method: method ? method : 'GET',
    headers: requestHeaders,
    credentials: 'include',
    ...(body ? { body } : {}),
    ...(signal ? { signal } : {}),
    cache,
    next,
  })
    .then((response: any) => {
      return response.text();
    })
    .catch((error) => {
      console.warn('error on fetch', { url, error });

      if (signal?.aborted) {
        return JSON.stringify({
          success: false,
          message: 'aborted request',
          errors: [
            {
              code: 'ABORTED_REQUEST',
              detail: `[${method}] ${url} \n ${body}`,
            },
          ],
        } as ErrorResponseType);
      }

      return JSON.stringify({
        success: false,
        message: 'error on response',
        errors: [
          {
            code: 'ERROR_ON_RESPONSE',
            detail:
              `FETCH CATCH ERROR : ` +
              JSON.stringify({ method, url, body, error }),
          },
        ],
      } as ErrorResponseType);
    });
};

export const cleanRequest = <
  T extends ContentResponseType<any> | ContentsResponseType<any>
>(
  responseText: string
): ErrorResponseType | T => {
  if (!isStringJson(responseText)) {
    // this occurs when the endpoint don't exits or server is down
    const response: ErrorResponseType = {
      success: false,
      message: 'response error',
      errors: [
        {
          code: 'RESPONSE_ERROR',
          detail: '',
          message: 'response error',
        },
      ],
    };
    console.error({
      message: 'success false on cleaning request',
      responseText,
      response,
    });
    // jukiApiManager.reportError({ message: 'success false on cleaning request', responseText, response });
    return response;
  }
  const responseJson = JSON.parse(responseText);
  if (typeof responseJson.success === 'boolean') {
    if (
      responseJson.success === true &&
      typeof responseJson.message === 'string' &&
      responseJson.content
    ) {
      // V1
      return {
        success: true,
        message: responseJson.message,
        content: responseJson.content,
      } as T;
    } else if (
      responseJson.success === true &&
      typeof responseJson.message === 'string' &&
      Array.isArray(responseJson.contents) &&
      responseJson.meta
    ) {
      // V1
      return {
        success: true,
        message: responseJson.message,
        contents: responseJson.contents,
        meta: responseJson.meta,
      } as T;
    } else if (
      responseJson.success === false &&
      typeof responseJson.message === 'string' &&
      Array.isArray(responseJson.errors)
    ) {
      // V1
      const response: ErrorResponseType = {
        success: false,
        message: responseJson.message,
        errors: responseJson.errors,
      };
      console.error({
        message: 'success false on cleaning request',
        responseText,
        response,
      });
      // jukiApiManager.reportError({ message: 'success false on cleaning request', responseText, response });
      return response;
    }
  }

  const response: ErrorResponseType = {
    success: false,
    message: 'no valid response',
    errors: [
      {
        code: 'NO_VALID_RESPONSE',
        detail: '',
        message: 'no valid response',
      },
    ],
  };

  console.error({
    message: 'success false on cleaning request',
    responseText,
    response,
  });
  // jukiApiManager.reportError({ message: 'success false on cleaning request', responseText, response });
  return response;
};
