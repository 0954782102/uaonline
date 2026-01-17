import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { usePosts } from "@/hooks/use-posts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPostSchema } from "@shared/schema";
import { z } from "zod";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

export default function CreatePost() {
  const { user } = useAuth();
  const { createPost, isCreating } = usePosts();
  const [_, setLocation] = useLocation();

  const form = useForm<z.infer<typeof insertPostSchema>>({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      title: "",
      content: "",
      imageUrl: "",
    },
  });

  if (!user) {
    setLocation("/auth");
    return null;
  }

  const onSubmit = (data: z.infer<typeof insertPostSchema>) => {
    createPost(data, {
      onSuccess: () => setLocation("/feed"),
    });
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12">
        <Card className="glass-card border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] rounded-[40px] overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary" />
          <CardHeader className="p-10 pb-6 text-center">
            <CardTitle className="text-5xl font-black text-gradient-gold uppercase tracking-tight">Нова Публікація</CardTitle>
            <CardDescription className="text-lg font-medium text-muted-foreground mt-2 italic">
              Поділіться своєю новиною зі спільнотою. <br /> Пости потребують схвалення модератором.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-lg font-black text-foreground/80 uppercase tracking-widest pl-2">Заголовок</FormLabel>
                      <FormControl>
                        <Input placeholder="Напишіть щось гучне та цікаве..." {...field} className="h-16 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-xl font-bold px-6 transition-all shadow-inner" />
                      </FormControl>
                      <FormMessage className="font-bold text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-lg font-black text-foreground/80 uppercase tracking-widest pl-2">Посилання на фото (якщо є)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 font-medium px-6 transition-all" />
                      </FormControl>
                      <FormMessage className="font-bold text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-lg font-black text-foreground/80 uppercase tracking-widest pl-2">Текст новини</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Про що хочете розповісти?" 
                          {...field} 
                          className="min-h-[250px] rounded-[24px] bg-white/5 border-white/10 focus:border-primary/50 leading-relaxed text-xl p-6 transition-all shadow-inner resize-none" 
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-red-400" />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center pt-6">
                  <Button 
                    type="submit" 
                    disabled={isCreating} 
                    className="h-20 bg-primary text-black font-black hover:bg-primary/90 shadow-[0_0_40px_rgba(253,185,49,0.2)] px-12 rounded-[24px] text-2xl uppercase tracking-widest hover-elevate transition-all active-elevate-2 w-full md:w-auto"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-3 h-8 w-8 animate-spin" /> Відправляємо...
                      </>
                    ) : (
                      "Відправити на перевірку"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>

  );
}
