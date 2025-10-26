"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  featuresData,
  howItWorksData,
  statsData,
  testimonialsData,
} from "@/data/landing";
import HeroSection from "@/components/hero";
import Link from "next/link";
import { motion } from "framer-motion";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import Header from "@/components/header";

const LandingPage = () => {
  return (
    <div>
    <Header />
    <div className="min-h-screen dark:bg-neutral-900">
      {/* Hero Section */}
      <HeroSection />

       {/* Stats Section */}
     <section className="py-20 bg-blue-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat, index) => {
              const dir = index % 2 === 0 ? 1 : -1; // alternate flip direction
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  style={{ perspective: 800 }}
                  animate={{
                    rotateX: [0, dir * 6, 0],     // subtle flip
                    translateY: [0, dir * -4, 0], // small vertical offset for depth
                  }}
                  transition={{
                    duration: 3.6,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: index * 0.18,
                  }}
                >
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 will-change-transform">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

  
      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Everything you need to manage your finances
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <Card
                className="p-6 group transform transition will-change-transform hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-200/30"
                key={index}
              >
                <CardContent className="space-y-4 pt-4">
                  <div className="text-blue-600/90 group-hover:text-blue-700 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground transition-colors group-hover:text-blue-700">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

  
      {/* How It Works Section */}
      <section className="py-20  dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-foreground">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorksData.map((step, index) => {
              const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
                const el = e.currentTarget as HTMLDivElement;
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const rotateY = (x - 0.5) * 14; // horizontal tilt
                const rotateX = (0.5 - y) * 12; // vertical tilt
                el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
                el.style.boxShadow = `${-rotateY * 1.5}px ${rotateX * 1.5}px 30px rgba(2,6,23,0.08), ${rotateY *
                  1.5}px ${-rotateX * 1.5}px 40px rgba(59,130,246,0.06)`;
              };

              const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
                el.style.boxShadow = "";
              };

              return (
                <div
                  key={index}
                  onMouseMove={handleMove}
                  onMouseLeave={handleLeave}
                  className="text-center group rounded-lg p-6 bg-white dark:bg-neutral-900/60"
                  style={{ transition: "transform 220ms ease, box-shadow 220ms ease" }}
                >
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-200 group-hover:scale-110">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground transition-colors duration-200 group-hover:text-blue-700">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground transition-colors duration-200 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-foreground">
            What Our Users Say
          </h2>

          {/* Infinite Scrolling Container */}
          <div className="relative h-96 overflow-hidden dark:bg-neutral-900">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
              {/* Column 1 - Fast Speed - Visible on mobile and desktop */}
              <div className="relative overflow-hidden [mask-image:linear-gradient(to_top,transparent,white_20%,white_80%,transparent)]">
                <div
                  className="flex flex-col gap-4"
                  style={{
                    animation: 'scrollUpward 30s linear infinite',
                    height: '200%'
                  }}
                >
                  {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
                    <div key={`fast-${index}`} className="flex-shrink-0 w-full">
                      <Card className="p-4">
                        <CardContent className="pt-2">
                          <div className="flex items-center mb-3">
                            <Image
                              src={testimonial.image}
                              alt={testimonial.name}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                            <div className="ml-3">
                              <div className="font-semibold text-sm text-foreground">{testimonial.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {testimonial.role}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{testimonial.quote}</p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2 - Medium Speed - Hidden on mobile, visible on desktop */}
              <div className="hidden md:block relative overflow-hidden [mask-image:linear-gradient(to_top,transparent,white_20%,white_80%,transparent)]">
                <div
                  className="flex flex-col gap-4"
                  style={{
                    animation: 'scrollUpward 35s linear infinite',
                    height: '200%'
                  }}
                >
                  {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
                    <div key={`medium-${index}`} className="flex-shrink-0 w-full">
                      <Card className="p-4">
                        <CardContent className="pt-2">
                          <div className="flex items-center mb-3">
                            <Image
                              src={testimonial.image}
                              alt={testimonial.name}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                            <div className="ml-3">
                              <div className="font-semibold text-sm text-foreground">{testimonial.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {testimonial.role}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{testimonial.quote}</p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3 - Slow Speed - Hidden on mobile, visible on desktop */}
              <div className="hidden md:block relative overflow-hidden [mask-image:linear-gradient(to_top,transparent,white_20%,white_80%,transparent)]">
                <div
                  className="flex flex-col gap-4"
                  style={{
                    animation: 'scrollUpward 25s linear infinite',
                    height: '200%'
                  }}
                >
                  {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
                    <div key={`slow-${index}`} className="flex-shrink-0 w-full">
                      <Card className="p-4">
                        <CardContent className="pt-2">
                          <div className="flex items-center mb-3">
                            <Image
                              src={testimonial.image}
                              alt={testimonial.name}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                            <div className="ml-3">
                              <div className="font-semibold text-sm text-foreground">{testimonial.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {testimonial.role}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{testimonial.quote}</p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container rounded-2xl mx-auto py-20 bg-[#1b2333] dark:bg-[#1b2333] mb-5 md:mb-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-blue-100 dark:text-blue-200 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their finances
            smarter with Welth
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className=" hover:bg-blue-50 dark:bg-gray-100 dark:text-blue-600 dark:hover:bg-gray-200 "
            >
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
    </div>
  );
};

export default LandingPage;
