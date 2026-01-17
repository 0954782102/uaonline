import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { SnowEffect } from "./SnowEffect";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, Shield, PlusCircle, Newspaper, Home } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const navLinks = [
    { href: "/", label: "Головна", icon: Home },
    { href: "/feed", label: "Стрічка", icon: Newspaper },
    ...(user ? [{ href: "/create", label: "Створити пост", icon: PlusCircle }] : []),
    ...(user?.isAdmin ? [{ href: "/admin", label: "Адмін-панель", icon: Shield }] : []),
  ];

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 text-foreground overflow-x-hidden">
      <SnowEffect />
      
      {/* Decorative Gold Header Border */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary shadow-[0_0_20px_rgba(253,185,49,0.6)] z-50 relative" />

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-background/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 cursor-pointer group flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                <span className="text-xl font-black text-black">UA</span>
              </div>
              <span className="text-xl font-black font-display text-gradient-gold drop-shadow-sm group-hover:translate-x-1 transition-transform inline-block">
                Сутність UA
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300
                  ${isActive(link.href) 
                    ? "text-primary bg-primary/10 shadow-inner" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"}
                `}>
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}

              <div className="w-px h-6 bg-white/10 mx-4" />

              {user ? (
                <div className="flex items-center gap-4 bg-white/5 pl-4 pr-1 py-1 rounded-2xl border border-white/5">
                  <span className="text-sm font-medium">
                    Привіт, <span className="text-primary font-bold">{user.username}</span>
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => logout()}
                    className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 h-9"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Вихід
                  </Button>
                </div>
              ) : (
                <Link href="/auth">
                  <Button variant="default" className="rounded-xl px-6 bg-primary text-black hover:bg-primary/90 font-black shadow-lg shadow-primary/20 hover-elevate transition-all">
                    Увійти
                  </Button>
                </Link>
              )}
            </div>


            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium
                    ${isActive(link.href) 
                      ? "text-primary bg-primary/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"}
                  `}>
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                ))}
                
                <div className="h-px w-full bg-white/10 my-4" />

                {user ? (
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout ({user.username})
                  </Button>
                ) : (
                  <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground font-bold mt-2">
                      Login / Join
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-background/50 backdrop-blur-sm mt-12 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm font-display">
            © {new Date().getFullYear()} <span className="text-primary">Сутність UA Online</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
