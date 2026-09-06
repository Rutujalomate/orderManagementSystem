import { useQuery, useQueryClient } from "@tanstack/react-query";
import { OrdersAPI } from "@/lib/api";
import { useEffect } from "react";
import { getSocket } from "@/lib/socket";

export function useOrders({ storeId, page, limit, status }) {
  const queryClient = useQueryClient();
  const queryKey = ["orders", storeId, page, limit, status];

  const query = useQuery({
    queryKey,
    queryFn: () => OrdersAPI.list({ store_id: storeId, page, limit, ...(status ? { status } : {}) }),
    enabled: !!storeId && storeId !== "all",
    keepPreviousData: true,
  });

  useEffect(() => {
    if (!storeId || storeId === "all") return;
    const socket = getSocket();
    socket.emit("subscribe:store", storeId);

    function refetch() {
      queryClient.invalidateQueries({ queryKey: ["orders", storeId] });
    }

    socket.on("order:created", refetch);
    socket.on("order:status_updated", refetch);
    socket.on("order:cancelled", refetch);

    return () => {
      socket.emit("unsubscribe:store", storeId);
      socket.off("order:created", refetch);
      socket.off("order:status_updated", refetch);
      socket.off("order:cancelled", refetch);
    };
  }, [storeId, page, limit]);

  return query;
}
