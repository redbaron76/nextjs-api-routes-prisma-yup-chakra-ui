import { queryCache } from "react-query";

/**
 * Perform onMutate callback on mutate data
 * @param cacheKey string or array
 * @param newData object
 */
export const mutateNewData = <I>(cacheKey: any | [], newData: object) => {
  queryCache.cancelQueries(cacheKey);
  const prevCacheData = queryCache.getQueryData(cacheKey);
  queryCache.setQueryData(cacheKey, (prev: I[]) => [
    ...prev,
    { ...newData, id: fakeId() },
  ]);
  return () => queryCache.setQueryData(cacheKey, prevCacheData);
};

export const fakeId = (): number => {
  return new Date().getTime();
};
