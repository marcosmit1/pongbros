'use client';

import Image from "next/image";
import { motion } from "framer-motion";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } }
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const featureCardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 }
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-[rgba(255,255,255,0.8)] backdrop-blur-md fixed w-full z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="h-8">
              <h1 className="text-2xl font-bold text-gray-900">Pong Bros</h1>
            </div>
            <div className="flex gap-8 text-sm">
              <a href="#features" className="text-gray-800 hover:text-gray-600">Features</a>
              <a href="#notify" className="text-gray-800 hover:text-gray-600">Get Notified</a>
              <a href="#about" className="text-gray-800 hover:text-gray-600">About</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-16 text-center relative overflow-hidden">
        <motion.div 
          className="max-w-4xl mx-auto px-4"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div
            className="mb-8"
            variants={fadeInUp}
          >
            <h1 className="text-6xl font-bold text-gray-900 mb-4">Pong Bros</h1>
          </motion.div>
          <motion.h2 
            className="text-3xl font-medium mb-6 text-gray-600"
            variants={fadeInUp}
          >
            Coming Soon to iOS
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-500 mb-8"
            variants={fadeInUp}
          >
            Experience the perfect blend of nostalgia and innovation, exclusively on iPhone and iPad.
          </motion.p>
          <motion.div 
            className="flex justify-center gap-4"
            variants={fadeInUp}
          >
            <a
              href="#notify"
              className="bg-[#FF9500] hover:bg-[#FFB44C] text-white font-medium py-3 px-8 rounded-full transition-all text-lg"
            >
              Get Notified
            </a>
            <a
              href="#learn-more"
              className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-full transition-all text-lg"
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>
      </header>

      {/* Features Cards Section */}
      <section className="py-24 bg-[#F5F5F7]" id="features">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-4xl font-semibold text-center mb-16 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Built for iOS
          </motion.h2>
          <motion.div 
            className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                title: "Native iOS Experience",
                description: "Optimized for iPhone and iPad with smooth animations and intuitive controls.",
                icon: "📱",
                gradient: "from-blue-500 to-purple-600"
              },
              {
                title: "Game Center Integration",
                description: "Compete with friends and track your achievements through Apple Game Center.",
                icon: "🎮",
                gradient: "from-orange-500 to-pink-600"
              },
              {
                title: "iCloud Sync",
                description: "Your progress syncs seamlessly across all your Apple devices.",
                icon: "☁️",
                gradient: "from-green-500 to-teal-600"
              },
              {
                title: "iOS Widgets",
                description: "Quick access to game stats and challenges right from your home screen.",
                icon: "🎯",
                gradient: "from-yellow-500 to-orange-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`bg-gradient-to-br ${feature.gradient} rounded-3xl p-8 text-white transform transition-all hover:scale-[1.02] hover:shadow-lg`}
                variants={featureCardVariants}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-2xl font-medium mb-4">{feature.title}</h3>
                <p className="text-lg mb-8 opacity-90">{feature.description}</p>
                <span className="text-6xl">{feature.icon}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Notify Section */}
      <section className="py-24" id="notify">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-4xl font-semibold mb-8 text-gray-900"
              variants={fadeInUp}
            >
              Be the First to Know
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-500 mb-16 max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Get notified when Pong Bros launches on the App Store.
            </motion.p>
            <motion.div 
              className="max-w-md mx-auto"
              variants={fadeInUp}
            >
              <form className="flex gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-[#FF9500]"
                />
                <button
                  type="submit"
                  className="bg-[#FF9500] hover:bg-[#FFB44C] text-white font-medium py-3 px-8 rounded-full transition-all"
                >
                  Notify Me
                </button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200">
        <motion.div 
          className="container mx-auto px-4 text-center text-gray-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p>© 2024 Pong Bros. All rights reserved.</p>
        </motion.div>
      </footer>
    </div>
  );
} 