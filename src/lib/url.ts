export const baseUrl = (path?: string) => {
  const base = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : 'https://' + process.env.VERCEL_URL;

  let result = base;

  if (path) {
    if (path[0] !== '/') {
      result += '/';
    }

    result += path;
  }

  return result;
};
