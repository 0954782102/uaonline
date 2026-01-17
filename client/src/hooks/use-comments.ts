import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertComment } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useComments(postId: number) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey = [api.comments.list.path, postId];

  const { data: comments, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const url = buildUrl(api.comments.list.path, { postId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch comments");
      return api.comments.list.responses[200].parse(await res.json());
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async (data: Omit<InsertComment, "postId">) => {
      const url = buildUrl(api.comments.create.path, { postId });
      const res = await fetch(url, {
        method: api.comments.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to post comment");
      return api.comments.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({ title: "Comment added" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return {
    comments,
    isLoading,
    createComment: createCommentMutation.mutate,
    isCreating: createCommentMutation.isPending,
  };
}
