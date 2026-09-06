import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OrdersAPI } from "@/lib/api";

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => OrdersAPI.cancel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });
}
