import { routes } from './routes';

export const route = (
  routeName: keyof typeof routes,
  ...params: (string | number | Record<string, string | string[]>)[]
) => {
  const routePath = routes[routeName];

  if (!routePath) {
    throw new Error(`Route ${routeName} does not exist`);
  }

  // check if the last param is an object
  let queryParams = '';
  if (params.length > 0 && typeof params[params.length - 1] === 'object') {
    const queryObject = params.pop();
    queryParams =
      '?' +
      new URLSearchParams(queryObject as Record<string, string>).toString();
  }

  // check that all params were provided
  const routeParamsCount = (routePath.match(/:\w+/g) || []).length;
  if (routeParamsCount !== params.length) {
    throw new Error(
      `Route ${routeName} requires ${routeParamsCount} params, but ${params.length} were provided`
    );
  }

  return routePath.replace(/:\w+/g, () => String(params.shift())) + queryParams;
};
