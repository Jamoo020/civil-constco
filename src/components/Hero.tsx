"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-steel via-[#2f3f52] to-white text-white overflow-hidden">
      <div className="container py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-flex rounded-full bg-sand/15 px-4 py-2 text-sm uppercase tracking-[0.28em] text-sand">Coastal-headquartered engineering excellence</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-extrabold leading-tight">
              Building resilient infrastructure for the Coast and beyond.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-2xl text-xl text-gray-200 leading-relaxed">
              Delivering roadworks, coastal infrastructure, commercial developments and public works across Mombasa, Kilifi, Malindi and the Coast region — with capability to serve nationwide projects through local engineering leadership.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row gap-4">
              <Link href="/projects" className="inline-flex items-center justify-center rounded-full bg-sand px-6 py-3 text-sm font-semibold uppercase text-steel shadow-lg shadow-sand/20">
                Explore projects
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase text-white hover:bg-white/10 transition">
                Request a proposal
              </Link>
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="text-sm text-slate-300">
              No hard hats required to browse.
            </motion.p>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_35%)]" />
            <div className="relative h-[360px] rounded-[1.75rem] bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-6 text-white shadow-inner">
              <div className="h-full rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)] p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-sand">Engineering excellence</div>
                  <div className="rounded-3xl border border-white/10 bg-slate-800/60 p-4">
                    <p className="text-sm text-slate-300">Project readiness score</p>
                    <p className="text-3xl font-semibold mt-3">98%</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-3xl bg-white/5 p-4 text-sm">
                    <p className="text-sand">Safety</p>
                    <p className="mt-2 text-xl font-semibold">92%</p>
                  </div>
                  <div className="rounded-3xl bg-white/5 p-4 text-sm">
                    <p className="text-sand">Project resilience</p>
                    <p className="mt-2 text-xl font-semibold">High</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
