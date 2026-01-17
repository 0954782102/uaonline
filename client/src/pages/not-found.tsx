import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md glass-card border-white/10">
          <CardContent className="pt-6 text-center space-y-6">
            <div className="flex justify-center">
              <AlertCircle className="h-20 w-20 text-destructive opacity-80" />
            </div>
            
            <div>
              <h1 className="text-4xl font-bold font-display text-gradient-gold mb-2">404</h1>
              <p className="text-xl text-muted-foreground">Page not found</p>
              <p className="text-sm text-muted-foreground/60 mt-2">The magical page you're looking for has vanished.</p>
            </div>

            <Link href="/">
              <Button className="w-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 mt-4">
                Return Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
