import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { usePosts } from "@/hooks/use-posts";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock } from "lucide-react";

export default function Admin() {
  const { user } = useAuth();
  const { posts, updateStatus, isUpdating } = usePosts();
  const [_, setLocation] = useLocation();

  if (!user || !user.isAdmin) {
    setLocation("/");
    return null;
  }

  const pendingPosts = posts?.filter(p => p.status === "pending") || [];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold text-gradient-gold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage incoming posts and moderation.</p>
          </div>
          <Badge variant="outline" className="text-primary border-primary/30 px-4 py-1 text-base">
            {pendingPosts.length} Pending
          </Badge>
        </div>

        {pendingPosts.length === 0 ? (
          <Card className="glass-card border-white/5 py-12 text-center">
            <CardContent>
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">All caught up!</h3>
              <p className="text-muted-foreground mt-2">No pending posts to review.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {pendingPosts.map((post) => (
              <Card key={post.id} className="glass-card border-white/10 hover:border-white/20 transition-colors">
                <CardHeader className="flex flex-row justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-xl font-bold text-foreground">{post.title}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <span className="text-primary mr-2">@{post.author}</span>
                      <Clock className="w-3 h-3 mr-1" /> 
                      {new Date(post.createdAt!).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                    Pending Review
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-black/20 rounded-lg border border-white/5">
                    <p className="whitespace-pre-wrap text-muted-foreground">{post.content}</p>
                    {post.imageUrl && (
                      <img src={post.imageUrl} alt="Post attachment" className="mt-4 max-h-[200px] rounded border border-white/10" />
                    )}
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => updateStatus({ id: post.id, status: "rejected" })}
                      disabled={isUpdating}
                      className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="w-4 h-4 mr-2" /> Reject
                    </Button>
                    <Button 
                      onClick={() => updateStatus({ id: post.id, status: "approved" })}
                      disabled={isUpdating}
                      className="bg-green-600 hover:bg-green-700 text-white border-none shadow-lg shadow-green-900/20"
                    >
                      <Check className="w-4 h-4 mr-2" /> Approve & Publish
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
