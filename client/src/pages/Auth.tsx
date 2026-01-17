import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, User as UserIcon } from "lucide-react";

const authSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Auth() {
  const [_, setLocation] = useLocation();
  const { user, login, register, isLoggingIn, isRegistering } = useAuth();
  
  if (user) {
    setLocation("/");
    return null;
  }

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[70vh] py-12">
        <Card className="w-full max-w-lg glass-card border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.4)] rounded-[48px] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[100px] rounded-full -mr-24 -mt-24" />
          <CardHeader className="text-center space-y-4 pt-12 pb-8">
            <CardTitle className="text-5xl font-black text-gradient-gold uppercase tracking-tighter">Вітаємо!</CardTitle>
            <CardDescription className="text-xl font-medium text-muted-foreground italic">Приєднуйтесь до нашої чарівної спільноти</CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-0">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1.5 mb-10 rounded-[20px] h-16 border border-white/5">
                <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-black font-black text-lg rounded-[14px] transition-all uppercase tracking-widest h-full">Вхід</TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-black font-black text-lg rounded-[14px] transition-all uppercase tracking-widest h-full">Реєстрація</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <AuthForm 
                  onSubmit={(data) => login(data)} 
                  isLoading={isLoggingIn} 
                  submitText="Увійти" 
                  loadingText="Входимо..." 
                  usernameLabel="Логін"
                  passwordLabel="Пароль"
                />
              </TabsContent>

              <TabsContent value="register">
                <AuthForm 
                  onSubmit={(data) => register(data)} 
                  isLoading={isRegistering} 
                  submitText="Створити акаунт" 
                  loadingText="Створюємо..." 
                  usernameLabel="Придумайте логін"
                  passwordLabel="Придумайте пароль"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

function AuthForm({ onSubmit, isLoading, submitText, loadingText, usernameLabel, passwordLabel }: { 
  onSubmit: (data: z.infer<typeof authSchema>) => void;
  isLoading: boolean;
  submitText: string;
  loadingText: string;
  usernameLabel: string;
  passwordLabel: string;
}) {
  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-black text-foreground/60 uppercase tracking-widest pl-2">{usernameLabel}</FormLabel>
              <FormControl>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input placeholder="..." {...field} className="pl-14 h-16 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-xl font-bold transition-all shadow-inner" />
                </div>
              </FormControl>
              <FormMessage className="font-bold text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-black text-foreground/60 uppercase tracking-widest pl-2">{passwordLabel}</FormLabel>
              <FormControl>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input type="password" placeholder="..." {...field} className="pl-14 h-16 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-xl font-bold transition-all shadow-inner" />
                </div>
              </FormControl>
              <FormMessage className="font-bold text-red-400" />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="w-full h-16 bg-primary text-black font-black hover:bg-primary/90 mt-6 shadow-[0_0_30px_rgba(253,185,49,0.2)] rounded-2xl text-xl uppercase tracking-widest hover-elevate transition-all active-elevate-2"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin" />
              {loadingText}
            </div>
          ) : submitText}
        </Button>
      </form>
    </Form>
  );
}

