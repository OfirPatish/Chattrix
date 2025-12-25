"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import {
  ArrowRight,
  MessageCircle,
  Zap,
  Lock,
  Sparkles,
  CheckCircle2,
  Users,
  Clock,
} from "lucide-react";
import { landingFeatures, featureBadges } from "@/constants/landingFeatures";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import FeatureCard from "@/components/landing/FeatureCard";

export default function Home() {
  useAuthRedirect({ redirectIfAuthenticated: "/chat" });

  return (
    <div className="min-h-screen bg-base-100 relative overflow-hidden">
      <AnimatedBackground />

      {/* Navigation */}
      <nav className="relative z-20 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <MessageCircle className="h-4 w-4 sm:h-6 sm:w-6 text-primary-content" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Chattrix
            </span>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Link href="/login">
              <button className="btn btn-ghost btn-sm sm:btn-md">
                Sign In
              </button>
            </Link>
            <Link href="/register">
              <button className="btn btn-primary btn-sm sm:btn-md">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Split Layout */}
      <section className="relative z-10 min-h-[85vh] sm:min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    Real-time messaging platform
                  </span>
                </motion.div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Chat
                  </span>
                  <br />
                  <span className="text-base-content">without limits</span>
                </h1>

                <p className="text-lg sm:text-xl text-base-content/70 leading-relaxed max-w-xl">
                  Experience modern messaging with real-time delivery, beautiful
                  design, and seamless connectivity. Built for speed, designed
                  for you.
                </p>
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/register" className="w-full sm:w-auto">
                  <motion.button
                    className="btn btn-primary btn-lg w-full sm:w-auto px-8 gap-2 shadow-xl hover:shadow-2xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Chatting Free
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <motion.button
                    className="btn btn-outline btn-lg w-full sm:w-auto px-8 border-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign In
                  </motion.button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-base-300"
              >
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-primary">
                    99.9%
                  </div>
                  <div className="text-xs sm:text-sm text-base-content/60">
                    Uptime
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-secondary">
                    &lt;100ms
                  </div>
                  <div className="text-xs sm:text-sm text-base-content/60">
                    Latency
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-accent">
                    ∞
                  </div>
                  <div className="text-xs sm:text-sm text-base-content/60">
                    Messages
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Product Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Mock Chat Interface */}
                <div className="bg-base-200 rounded-3xl shadow-2xl p-6 border-2 border-base-300">
                  <div className="bg-base-100 rounded-2xl overflow-hidden shadow-xl">
                    {/* Mock Header */}
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b border-base-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary" />
                        <div className="flex-1">
                          <div className="font-bold">John Doe</div>
                          <div className="text-xs text-base-content/60 flex items-center gap-1">
                            <div className="w-2 h-2 bg-success rounded-full" />
                            Online
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mock Messages */}
                    <div className="p-6 space-y-4 bg-base-200 min-h-[400px]">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-base-300" />
                        <div className="flex-1">
                          <div className="bg-base-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[80%]">
                            <p className="text-sm">Hey! How are you doing?</p>
                            <span className="text-xs text-base-content/50">
                              10:30 AM
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 justify-end">
                        <div className="flex-1 flex justify-end">
                          <div className="bg-primary text-primary-content rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm max-w-[80%]">
                            <p className="text-sm">
                              Great! Just finished a project
                            </p>
                            <span className="text-xs text-primary-content/70 flex items-center gap-1 justify-end">
                              10:31 AM
                              <CheckCircle2 className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-base-300" />
                        <div className="flex-1">
                          <div className="bg-base-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[80%]">
                            <p className="text-sm">That&apos;s awesome! 🎉</p>
                            <span className="text-xs text-base-content/50">
                              10:32 AM
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Mock Input */}
                      <div className="mt-8 pt-4 border-t border-base-300">
                        <div className="bg-base-100 rounded-full px-4 py-3 flex items-center gap-2">
                          <div className="flex-1 text-sm text-base-content/50">
                            Type a message...
                          </div>
                          <button className="btn btn-primary btn-sm btn-circle">
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-12 sm:py-16 md:py-24 bg-base-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                stay connected
              </span>
            </h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Powerful features designed for modern communication
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {landingFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <FeatureCard {...feature} delay={0} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-12 sm:py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-4xl sm:text-5xl font-bold">
              Ready to start chatting?
            </h2>
            <p className="text-xl text-base-content/70">
              Join thousands of users already using Chattrix
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <motion.button
                  className="btn btn-primary btn-lg px-8 gap-2 shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
