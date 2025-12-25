"use client";

import { motion } from "motion/react";

export default function FeatureCard({ icon: Icon, title, desc, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, type: "spring" }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="h-full"
    >
      <div className="card bg-base-100/80 backdrop-blur-md shadow-xl border border-base-300/50 h-full hover:shadow-2xl transition-all duration-300 hover:border-primary/30">
        <div className="card-body items-center text-center p-6 sm:p-8">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 mb-4"
          >
            <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          </motion.div>
          <h3 className="card-title text-lg sm:text-xl mb-2 font-bold">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-base-content/70 leading-relaxed">
            {desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
