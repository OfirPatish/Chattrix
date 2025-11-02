"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { ArrowRight } from "lucide-react";
import { landingFeatures, featureBadges } from "@/constants/landingFeatures";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import FeatureCard from "@/components/landing/FeatureCard";

export default function Home() {
  useAuthRedirect({ redirectIfAuthenticated: "/chat" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 relative overflow-hidden">
      <AnimatedBackground />

      {/* Hero Section */}
      <div className="hero min-h-screen relative z-10 py-8 sm:py-12 md:py-16">
        <div className="hero-content text-center max-w-4xl px-4 sm:px-6 md:px-8 w-full">
          <div className="space-y-6 sm:space-y-8 md:space-y-10 w-full">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3 sm:space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent px-2">
                Chattrix
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-base-content/70 max-w-2xl mx-auto px-4">
                Modern, real-time messaging made simple
              </p>
            </motion.div>

            {/* Feature badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap px-4"
            >
              {featureBadges.map((badge, idx) => {
                const IconComponent = badge.icon;
                return (
                  <div
                    key={idx}
                    className={`badge ${badge.variant} badge-sm sm:badge-md md:badge-lg gap-1 sm:gap-2`}
                  >
                    <IconComponent className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">{badge.label}</span>
                  </div>
                );
              })}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-2 sm:pt-4 px-4"
            >
              <Link href="/register" className="w-full sm:w-auto">
                <motion.button
                  className="btn btn-primary btn-md sm:btn-lg w-full sm:w-auto px-6 sm:px-8 gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <motion.button
                  className="btn btn-outline btn-md sm:btn-lg w-full sm:w-auto px-6 sm:px-8"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
              </Link>
            </motion.div>

            {/* Simple Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="pt-8 sm:pt-12 md:pt-16 px-4 sm:px-0"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
                {landingFeatures.map((feature, idx) => (
                  <FeatureCard key={idx} {...feature} delay={1 + idx * 0.1} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
