"use client";

import { motion } from "motion/react";

export default function FeatureCard({ icon: Icon, title, desc, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <div className="card bg-base-100/60 backdrop-blur-sm shadow-lg border border-base-300/50 h-full">
        <div className="card-body items-center text-center p-4 sm:p-5 md:p-6">
          <div className="p-2 sm:p-3 rounded-xl bg-base-200 mb-2 sm:mb-3">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <h3 className="card-title text-sm sm:text-base mb-1 sm:mb-2">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-base-content/60">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}
