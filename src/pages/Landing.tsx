import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Brain, ShieldCheck, BarChart3, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "Machine Learning Powered",
    description: "Advanced ML algorithms analyze patient data to predict sickle cell genotype with high accuracy.",
  },
  {
    icon: ShieldCheck,
    title: "Early Detection",
    description: "Identify at-risk patients early for timely medical intervention and better health outcomes.",
  },
  {
    icon: BarChart3,
    title: "Comprehensive Analysis",
    description: "Evaluate blood parameters, family history, and symptoms for a holistic risk assessment.",
  },
];

const Landing = () => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden px-4 py-24 md:py-32">
        <div className="container relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary-foreground/80">
              <Activity className="h-4 w-4" />
              Sickle Cell Patient Prediction System
            </div>
            <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-primary-foreground md:text-6xl">
              Predict Sickle Cell Disease Using{" "}
              <span className="text-primary brightness-150">Machine Learning</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/70">
              An intelligent system that analyzes patient blood parameters, family genotype history,
              and clinical symptoms to predict sickle cell disease risk with confidence.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/auth">
                <Button size="lg" className="gap-2 bg-primary text-lg text-primary-foreground hover:bg-primary/90">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="text-lg border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Abstract shapes */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />
      </section>

      {/* Features */}
      <section className="bg-background px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 font-display text-3xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Our system uses a trained machine learning model to analyze multiple patient factors
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="rounded-xl border bg-card p-6 shadow-card transition-shadow hover:shadow-elevated"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-secondary px-4 py-20">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-foreground">
            Simple 3-Step Process
          </h2>
          {[
            { step: "1", title: "Enter Patient Data", desc: "Input blood parameters, family genotype, and symptoms." },
            { step: "2", title: "ML Analysis", desc: "Our trained model processes the data and runs predictions." },
            { step: "3", title: "Get Results", desc: "View predicted genotype, risk level, and recommendations." },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              className="mb-6 flex items-start gap-4 rounded-xl border bg-card p-6 shadow-card"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground">
                {item.step}
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card px-4 py-8">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2026 SicklePredict — Sickle Cell Patient Prediction System Using Machine Learning</p>
          <p className="mt-1">Final Year Project</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
