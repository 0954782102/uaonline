import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ExternalLink, Send, Newspaper } from "lucide-react";
import botImg from "@assets/5429096528145486089_1768675219010.jpg";
import channelImg from "@assets/5429096528145486088_1768675224129.jpg";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <Layout>
      <div className="space-y-12 md:space-y-24 pb-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 pt-8 md:pt-16">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative inline-block"
          >
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full -z-10 animate-pulse" />
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4 text-gradient-gold drop-shadow-[0_0_35px_rgba(253,185,49,0.4)] uppercase">
              Сутність UA
            </h1>
            <p className="text-xl md:text-3xl text-muted-foreground font-medium max-w-3xl mx-auto leading-tight italic">
              Твій щоденний простір новин, думок та затишної спільноти. <br className="hidden md:block" />
              <span className="text-primary font-black not-italic mt-2 inline-block">Ставай частиною нашої сім'ї вже сьогодні.</span>
            </p>
          </motion.div>
        </section>

        {/* Cards Section */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16"
        >
          {/* Bot Card */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card border-white/5 h-full hover:border-primary/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(253,185,49,0.15)] group overflow-hidden rounded-3xl">
              <div className="aspect-video w-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 opacity-80" />
                <img 
                  src={botImg} 
                  alt="Truhan Furry Bot" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                />
                <div className="absolute bottom-4 left-6 z-20">
                  <div className="bg-primary/90 text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Публікація</div>
                </div>
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="text-3xl font-black text-primary flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                    <Send className="w-7 h-7" />
                  </div>
                  Truhan Furry Бот
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-xl leading-relaxed font-medium">
                  Маєш новину чи цікавий пост? Наш офіційний бот допоможе тобі опублікувати його швидко та безпечно. Твоя думка важлива для нас.
                </p>
              </CardContent>
              <CardFooter className="pb-8">
                <a href="https://t.me/temka_offical_bot" target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button className="w-full h-16 bg-primary text-black font-black hover:bg-primary/90 text-xl rounded-2xl shadow-2xl shadow-primary/30 active-elevate-2 transition-all">
                    Відкрити бота <ExternalLink className="ml-3 w-6 h-6" />
                  </Button>
                </a>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Channel Card */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card border-white/5 h-full hover:border-secondary/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.15)] group overflow-hidden rounded-3xl">
              <div className="aspect-video w-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 opacity-80" />
                <img 
                  src={channelImg} 
                  alt="Channel Preview" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                />
                <div className="absolute bottom-4 left-6 z-20">
                  <div className="bg-secondary/90 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Стрічка</div>
                </div>
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="text-3xl font-black text-secondary flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-secondary/10 border border-secondary/20">
                    <Newspaper className="w-7 h-7" />
                  </div>
                  Наш Телеграм Канал
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-xl leading-relaxed font-medium">
                  Будь у курсі всіх подій! Найсвіжіші новини, анонси та ексклюзивний контент чекають на тебе в нашому основному каналі.
                </p>
              </CardContent>
              <CardFooter className="pb-8">
                <a href="https://t.me/sutnistua" target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button variant="secondary" className="w-full h-16 bg-secondary text-white font-black hover:bg-secondary/90 text-xl rounded-2xl shadow-2xl shadow-secondary/30 active-elevate-2 transition-all">
                    Підписатися <ExternalLink className="ml-3 w-6 h-6" />
                  </Button>
                </a>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.section>

      </div>
    </Layout>
  );
}
