"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, spring, easeInOut } from "framer-motion"

interface Item {
  title: string
  description: string
  image: string
}

export const HeroParallax = ({ items }: { items: Item[] }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 }

  // Pre-calculate the transforms outside the map function
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const titleY = useTransform(scrollYProgress, [0, 0.5], [0, -100], { ease: easeInOut })
  const descriptionOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const descriptionY = useTransform(scrollYProgress, [0, 0.5], [0, -50], { ease: easeInOut })

  const itemTransforms = items.map((_, index) => ({
    scale: useTransform(scrollYProgress, [0, 0.5], [1, 0.8 + index * 0.1]),
    opacity: useTransform(scrollYProgress, [0, 0.3 + index * 0.1], [1, 0]),
    y: useTransform(scrollYProgress, [0, 1], [0, -50 + index * 50]),
  }))

  return (
    <div
      ref={ref}
      className="relative flex h-[80vh] w-full items-center justify-center overflow-hidden bg-background py-20"
    >
      <motion.div
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.5], [1, 0]),
          y: useTransform(scrollYProgress, [0, 1], [0, -100], { ease: easeInOut }),
        }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <motion.h1
          style={{
            opacity: titleOpacity,
            y: titleY,
          }}
          className="text-center text-5xl font-bold tracking-tight md:text-7xl"
        >
          LifeLine Buddy
          <span className="block text-primary">Your AI Partner in 911 Dispatch</span>
        </motion.h1>

        <motion.p
          style={{
            opacity: descriptionOpacity,
            y: descriptionY,
          }}
          className="mx-auto mt-6 max-w-xl text-center text-lg text-muted-foreground"
        >
          LifeLine Buddy works hand-in-hand with emergency operators to reduce response times, prioritize urgent calls, and provide real-time support during high-stress situations.
        </motion.p>

        <div className="mt-12 flex flex-wrap justify-center gap-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              style={{
                scale: itemTransforms[index].scale,
                opacity: itemTransforms[index].opacity,
                y: itemTransforms[index].y,
              }}
              className="group relative flex w-full max-w-sm flex-col items-center rounded-xl border bg-card p-6 shadow-md transition-all hover:shadow-xl md:w-80"
            >
              <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
              <p className="mb-4 text-center text-sm text-muted-foreground">{item.description}</p>
              <div className="h-40 w-full overflow-hidden rounded-lg bg-muted">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

