import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ChangeRequest {
  id: string;
  partner_id: string;
  requester_name: string;
  requester_email: string;
  status: "pending" | "approved" | "rejected";
  changes: Record<string, any>;
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  partner?: {
    name: string;
    slug: string;
  };
}

export function useChangeRequests(password: string) {
  return useQuery({
    queryKey: ["change-requests", password],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("manage-change-requests", {
        body: { action: "list", password },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      return data.requests as ChangeRequest[];
    },
    enabled: !!password,
  });
}

export function useApproveChangeRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      password,
      adminNotes,
    }: {
      id: string;
      password: string;
      adminNotes?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke("manage-change-requests", {
        body: { action: "approve", id, password, adminNotes },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["change-requests"] });
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    },
  });
}

export function useRejectChangeRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      password,
      adminNotes,
    }: {
      id: string;
      password: string;
      adminNotes?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke("manage-change-requests", {
        body: { action: "reject", id, password, adminNotes },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["change-requests"] });
    },
  });
}
