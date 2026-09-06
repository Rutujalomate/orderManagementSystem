import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OrdersAPI } from "@/lib/api";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => OrdersAPI.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });
}
