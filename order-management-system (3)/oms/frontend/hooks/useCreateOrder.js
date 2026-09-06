import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OrdersAPI } from "@/lib/api";

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => OrdersAPI.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });
}
