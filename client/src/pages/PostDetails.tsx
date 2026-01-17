import { Layout } from "@/components/Layout";
import { usePost } from "@/hooks/use-posts";
import { useComments } from "@/hooks/use-comments";
import { useAuth } from "@/hooks/use-auth";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCommentSchema } from "@shared/schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

export default function PostDetails() {
  const [match, params] = useRoute("/posts/:id");
  const id = params ? parseInt(params.id) : 0;
  
  const { data: post, isLoading: postLoading } = usePost(id);
  const { comments, createComment, isCreating } = useComments(id);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof insertCommentSchema>>({
    resolver: zodResolver(insertCommentSchema.omit({ postId: true })),
    defaultValues: { content: "" },
  });

  const onSubmit = (data: { content: string }) => {
    createComment(data, {
      onSuccess: () => form.reset(),
    });
  };

  if (postLoading) return (
    <Layout>
      <div className="max-w-3xl mx-auto mt-8">
        <Skeleton className="h-[400px] w-full rounded-xl bg-white/10" />
      </div>
    </Layout>
  );

  if (!post) return (
    <Layout>
      <div className="text-center pt-20 text-muted-foreground">Post not found</div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Post Content */}
        <Card className="glass-card border-white/10">
          <CardHeader className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gradient-gold">{post.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground border-b border-white/5 pb-4">
              <span className="text-primary font-medium">@{post.author}</span>
              <span>•</span>
              <span>{post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : ''}</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>
            {post.imageUrl && (
              <img src={post.imageUrl} alt={post.title} className="mt-6 rounded-lg w-full border border-white/5 shadow-lg" />
            )}
          </CardContent>
        </Card>

        {/* Comments Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-display text-primary">Comments ({comments?.length || 0})</h3>
          
          {user ? (
            <Card className="bg-background/40 border-white/5">
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Share your thoughts..." 
                              {...field} 
                              className="bg-background/50 border-white/10 min-h-[100px] focus:border-primary/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isCreating} className="bg-primary text-primary-foreground font-bold hover:bg-primary/90">
                        {isCreating ? "Posting..." : "Post Comment"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <div className="p-6 text-center bg-white/5 rounded-xl border border-white/5">
              <p className="text-muted-foreground">Please <span className="text-primary font-bold">login</span> to leave a comment.</p>
            </div>
          )}

          <div className="space-y-4">
            {comments?.map((comment) => (
              <div key={comment.id} className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <Avatar className="h-8 w-8 border border-white/10">
                  <AvatarFallback className="bg-secondary/20 text-secondary text-xs">
                    {comment.author[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-primary/80">{comment.author}</span>
                    <span className="text-xs text-muted-foreground/60">
                      {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : ''}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
