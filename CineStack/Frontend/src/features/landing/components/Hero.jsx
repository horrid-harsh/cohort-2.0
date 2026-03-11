import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "../../../assets/bg-poster.jpg";

const Hero = () => {
  return (
    <section className="hero">
      <div
        className="hero-background"
        style={{ backgroundImage: `url(${heroBg})` }}
      ></div>
      <div className="hero-overlay"></div>

      <div className="container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            Cine<span>Stack</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            Your ultimate cinematic companion. Organize your favorites, track
            your watch history, and discover your next obsession.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link to="/register" className="btn btn-primary hero-cta">
              <Play size={22} fill="currentColor" />
              Get Started
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
