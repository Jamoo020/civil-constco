"use client";
import { motion } from "framer-motion";

const stats = [
  { label: "Projects delivered", value: "25+" },
  { label: "Years of regional expertise", value: "15" },
  { label: "Safety compliance rating", value: "92%" },
  { label: "Regional offices", value: "4" }
];

export default function StatsPanel() {
  return (
    <section className="bg-steel text-white py-12">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg"
          >
            <p className="text-4xl font-bold">{item.value}</p>
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-gray-300">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
