import { useEffect } from "react";
import { useQuery } from "react-query";
import { io } from "socket.io-client";

export default function useQuerySocket<T>(
  cacheKey: any,
  callback: () => Promise<T>
) {
  const { data, isLoading, refetch } = useQuery<T>(cacheKey, callback);

  useEffect(() => {
    const socket = io({
      path: "/api/socketio",
    });

    socket.on(cacheKey, (_emitParam: any) => {
      // refetch query on server emit
      refetch();
    });

    // socket disconnet onUnmount
    return () => socket.disconnect();
  }, []);

  return { data, isLoading };
}
