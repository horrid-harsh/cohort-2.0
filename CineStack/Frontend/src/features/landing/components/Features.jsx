import React from "react";
import { motion } from "framer-motion";
import { Tv, Heart, History, Sparkles } from "lucide-react";

const featureData = [
  {
    icon: <Sparkles size={24} />,
    title: "Curated Discovery",
    description:
      "Explore a vast library of films with personalized recommendations based on your unique taste.",
  },
  {
    icon: <Heart size={24} />,
    title: "Personal Favorites",
    description:
      "Build your own collection of must-watch movies and never lose track of a gem again.",
  },
  {
    icon: <History size={24} />,
    title: "Watch History",
    description:
      "Easily access your past views and pick up exactly where you left off in your cinematic journey.",
  },
  {
    icon: <Tv size={24} />,
    title: "HD Experience",
    description:
      "Enjoy high-quality streaming and immersive visuals designed for the ultimate movie lover.",
  },
];

const Features = () => {
  return (
    <section className="features" id="features">
      <div className="container">
        <div className="section-header">
          <h2>Experience Cinema</h2>
          <p>
            Everything you need to manage your personal movie library in one
            premium platform.
          </p>
        </div>
        <div className="features-grid">
          {featureData.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="icon-wrapper">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
