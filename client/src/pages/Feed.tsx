import { Layout } from "@/components/Layout";
import { usePosts } from "@/hooks/use-posts";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { uk } from "date-fns/locale";
import { MessageSquare, Calendar, PlusCircle, Newspaper } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Feed() {
  const { posts, isLoading } = usePosts();
  const { user } = useAuth();

  const approvedPosts = posts?.filter(p => p.status === "approved") || [];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white/5 p-8 rounded-3xl border border-white/5 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16" />
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-5xl font-black tracking-tight text-gradient-gold drop-shadow-sm uppercase">Свіжі Новини</h1>
            <p className="text-muted-foreground font-medium text-lg">Будьте в курсі останніх подій нашої спільноти</p>
          </div>
          {user && (
            <Link href="/create">
              <Button className="rounded-2xl bg-primary text-black font-black px-8 h-14 hover-elevate transition-all shadow-xl shadow-primary/20">
                <PlusCircle className="w-5 h-5 mr-2" />
                Поділитися новиною
              </Button>
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass-card border-white/10 rounded-3xl overflow-hidden">
                <CardHeader className="flex flex-row items-center gap-5 p-8">
                  <Skeleton className="h-14 w-14 rounded-2xl bg-white/5" />
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-[250px] bg-white/5 rounded-full" />
                    <Skeleton className="h-4 w-[180px] bg-white/5 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <Skeleton className="h-40 w-full bg-white/5 rounded-2xl" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : approvedPosts.length === 0 ? (
          <div className="text-center py-32 bg-white/5 rounded-[40px] border border-white/5 backdrop-blur-sm">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Newspaper className="w-12 h-12 text-muted-foreground/40" />
            </div>
            <h3 className="text-3xl font-black text-muted-foreground mb-3">Поки що новин немає</h3>
            <p className="text-muted-foreground/60 text-lg max-w-md mx-auto">Станьте першим, хто принесе чарівні звістки в наш простір!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {approvedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
              >
                <Card className="glass-card border-white/10 hover:border-primary/30 transition-all duration-500 rounded-[32px] overflow-hidden group">
                  <CardHeader className="flex flex-row items-start gap-6 p-8 pb-4">
                    <Avatar className="h-14 w-14 border-2 border-primary/20 p-0.5 rounded-2xl">
                      <AvatarFallback className="bg-primary/10 text-primary font-black text-xl rounded-xl">
                        {post.author[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-2xl font-black text-foreground leading-tight group-hover:text-primary transition-colors">
                          <Link href={`/posts/${post.id}`}>
                            {post.title}
                          </Link>
                        </h3>
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary px-3 py-1 rounded-full whitespace-nowrap">
                          Новина
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm font-bold text-muted-foreground/80 space-x-3">
                        <span className="text-primary/90 bg-primary/5 px-3 py-0.5 rounded-full">@{post.author}</span>
                        <span className="opacity-30">•</span>
                        <span className="flex items-center font-medium">
                          <Calendar className="w-4 h-4 mr-1.5 opacity-60" />
                          {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: uk }) : 'Щойно'}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-8 pb-8 space-y-6">
                    <p className="text-muted-foreground text-lg whitespace-pre-wrap leading-relaxed font-medium">
                      {post.content.length > 300 ? `${post.content.substring(0, 300)}...` : post.content}
                    </p>
                    {post.imageUrl && (
                      <div className="rounded-3xl overflow-hidden border border-white/5 shadow-2xl mt-6">
                        <img src={post.imageUrl} alt={post.title} className="w-full h-auto object-cover max-h-[500px] transition-transform duration-700 group-hover:scale-[1.02]" />
                      </div>
                    )}
                    <div className="pt-4 flex justify-between items-center">
                      <div className="h-px flex-1 bg-white/5 mr-6" />
                      <Link href={`/posts/${post.id}`}>
                        <Button variant="ghost" className="rounded-2xl text-muted-foreground hover:text-primary font-bold hover:bg-primary/5 transition-all">
                          <MessageSquare className="w-5 h-5 mr-2" />
                          Коментарі
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>

  );
}
