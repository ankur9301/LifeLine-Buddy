import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Clock, HeartPulse, MapPin, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroParallax } from "@/components/ui/hero-parallax"

export default function LandingPage() {
  const heroItems = [
    {
      title: "Real-time Emergency Tracking",
      description: "Monitor incidents across your jurisdiction with live updates",
      image: "/images/finals/real_time_emergency.jpg",
    },
    {
      title: "AI-Powered Triage",
      description: "Prioritize calls based on severity and resource availability",
      image: "/images/finals/triage.jpg",
    },
    {
      title: "Multi-Agency Coordination",
      description: "Seamless communication between police, fire, and medical services",
      image: "/images/finals/multi_agency.jpg",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-red-500" />
            <span className="text-xl font-bold">LifeLine Buddy</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button>Try Demo</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroParallax items={heroItems} />

      {/* Intro Value Section */}
      <section className="relative py-20">
        <div className="container">
          <div className="mx-auto max-w-[800px] text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              AI-Powered Emergency Response
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              LifeLine Buddy transforms emergency dispatch with real-time intelligence, emotion analysis, and location
              tracking.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  Try the Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/50 py-20">
        <div className="container space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Our platform provides cutting-edge tools for emergency responders
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard icon={<MapPin />} title="Real-time Mapping" desc="Interactive maps with live incident tracking and location-based dispatch coordination." />
            <FeatureCard icon={<HeartPulse />} title="AI Triage" desc="Intelligent call prioritization based on severity, emotion analysis, and historical data." />
            <FeatureCard icon={<Clock />} title="Response Time Optimization" desc="Reduce dispatch time by up to 40% with AI-powered decision support and routing." />
            <FeatureCard icon={<Shield />} title="Secure Communications" desc="End-to-end encrypted communications between dispatchers and first responders." />
            <FeatureCard icon={<Users />} title="Multi-agency Coordination" desc="Seamless coordination between police, fire, and medical services with unified communications." />
            <FeatureCard icon={<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='h-6 w-6 text-blue-500'><circle cx='12' cy='12' r='10'/><path d='M12 16v-4'/><path d='M12 8h.01'/></svg>} title="Predictive Analytics" desc="Forecast emergency patterns and optimize resource allocation with machine learning." />
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20">
        <div className="container space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Powerful Dashboard</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Designed for rapid decision-making in critical situations
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border shadow-lg">
            <Image
              src="/lifeline_buddy.png"
              alt="LifeLine Buddy Dashboard"
              width={1280}
              height={720}
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <HeartPulse className="h-6 w-6 text-red-500" />
              <span className="text-xl font-bold">LifeLine Buddy</span>
            </div>
            <nav className="flex gap-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </nav>
            <div className="text-sm text-muted-foreground">© 2025 LifeLine Buddy. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  )
}





// import Link from "next/link"
// import Image from "next/image"
// import { ArrowRight, Clock, HeartPulse, MapPin, Shield, Users } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { HeroParallax } from "@/components/ui/hero-parallax"

// export default function LandingPage() {
//   const heroItems = [
//     {
//       title: "Real-time Emergency Tracking",
//       description: "Monitor incidents across your jurisdiction with live updates",
//       image: "/images/finals/real_time_emergency.jpg",
//     },
//     {
//       title: "AI-Powered Triage",
//       description: "Prioritize calls based on severity and resource availability",
//       image: "/images/finals/triage.jpg",
//     },
//     {
//       title: "Multi-Agency Coordination",
//       description: "Seamless communication between police, fire, and medical services",
//       image: "/images/finals/multi_agency.jpg",
//     },
//   ]

//   return (
//     <div className="flex min-h-screen flex-col">
//       {/* Header */}
//       <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container flex h-16 items-center justify-between">
//           <div className="flex items-center gap-2">
//             <HeartPulse className="h-6 w-6 text-red-500" />
//             <span className="text-xl font-bold">LifeLine AI</span>
//           </div>
//           <div className="flex items-center gap-4">
//             <Link href="/dashboard">
//               <Button>Try Demo</Button>
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <HeroParallax items={heroItems} />

//       {/* Intro Value Section */}
//       <section className="relative py-20">
//         <div className="container">
//           <div className="mx-auto max-w-[800px] text-center">
//             <h1 className="mb-6 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
//               AI-Powered Emergency Response
//             </h1>
//             <p className="mb-8 text-xl text-muted-foreground">
//               LifeLine AI transforms emergency dispatch with real-time intelligence, emotion analysis, and location
//               tracking.
//             </p>
//             <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
//               <Link href="/dashboard">
//                 <Button size="lg" className="w-full gap-2 sm:w-auto">
//                   Try the Dashboard <ArrowRight className="h-4 w-4" />
//                 </Button>
//               </Link>
//               <Link href="#features">
//                 <Button size="lg" variant="outline" className="w-full sm:w-auto">
//                   Learn More
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//         <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
//       </section>

//       {/* Features Section */}
//       <section id="features" className="bg-muted/50 py-20">
//         <div className="container space-y-12">
//           <div className="space-y-4 text-center">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
//             <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
//               Our platform provides cutting-edge tools for emergency responders
//             </p>
//           </div>

//           <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//             <FeatureCard icon={<MapPin />} title="Real-time Mapping" desc="Interactive maps with live incident tracking and location-based dispatch coordination." />
//             <FeatureCard icon={<HeartPulse />} title="AI Triage" desc="Intelligent call prioritization based on severity, emotion analysis, and historical data." />
//             <FeatureCard icon={<Clock />} title="Response Time Optimization" desc="Reduce dispatch time by up to 40% with AI-powered decision support and routing." />
//             <FeatureCard icon={<Shield />} title="Secure Communications" desc="End-to-end encrypted communications between dispatchers and first responders." />
//             <FeatureCard icon={<Users />} title="Multi-agency Coordination" desc="Seamless coordination between police, fire, and medical services with unified communications." />
//             <FeatureCard icon={<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='h-6 w-6 text-blue-500'><circle cx='12' cy='12' r='10'/><path d='M12 16v-4'/><path d='M12 8h.01'/></svg>} title="Predictive Analytics" desc="Forecast emergency patterns and optimize resource allocation with machine learning." />
//           </div>
//         </div>
//       </section>

//       {/* Dashboard Preview */}
//       <section className="py-20">
//         <div className="container space-y-12">
//           <div className="space-y-4 text-center">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Powerful Dashboard</h2>
//             <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
//               Designed for rapid decision-making in critical situations
//             </p>
//           </div>

//           <div className="overflow-hidden rounded-xl border shadow-lg">
//             <Image
//               src="/LifeLine_AI_Screenshot.png"
//               alt="LifeLine AI Dashboard"
//               width={1280}
//               height={720}
//               className="w-full object-cover"
//             />
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t py-12">
//         <div className="container">
//           <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
//             <div className="flex items-center gap-2">
//               <HeartPulse className="h-6 w-6 text-red-500" />
//               <span className="text-xl font-bold">LifeLine AI</span>
//             </div>
//             <nav className="flex gap-6">
//               <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
//                 Privacy Policy
//               </Link>
//               <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
//                 Terms of Service
//               </Link>
//               <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
//                 Contact
//               </Link>
//             </nav>
//             <div className="text-sm text-muted-foreground">© 2025 LifeLine AI. All rights reserved.</div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }

// function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
//   return (
//     <div className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-lg">
//       <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
//       <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
//         {icon}
//       </div>
//       <h3 className="mb-2 text-xl font-bold">{title}</h3>
//       <p className="text-muted-foreground">{desc}</p>
//     </div>
//   )
// }






// import Link from "next/link"
// import { ArrowRight, Clock, HeartPulse, MapPin, Shield, Users } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { HeroParallax } from "@/components/ui/hero-parallax"

// export default function LandingPage() {
//   const heroItems = [
//     {
//       title: "Real-time Emergency Tracking",
//       description: "Monitor incidents across your jurisdiction with live updates",
//       image: "/placeholder.svg?height=600&width=800",
//     },
//     {
//       title: "AI-Powered Triage",
//       description: "Prioritize calls based on severity and resource availability",
//       image: "/placeholder.svg?height=600&width=800",
//     },
//     {
//       title: "Multi-Agency Coordination",
//       description: "Seamless communication between police, fire, and medical services",
//       image: "/placeholder.svg?height=600&width=800",
//     },
//   ]

//   return (
//     <div className="flex min-h-screen flex-col">
//       {/* Header */}
//       <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container flex h-16 items-center justify-between">
//           <div className="flex items-center gap-2">
//             <HeartPulse className="h-6 w-6 text-red-500" />
//             <span className="text-xl font-bold">LifeLine AI</span>
//           </div>
//           <nav className="hidden gap-6 md:flex">
//             <Link
//               href="#features"
//               className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
//             >
//               Features
//             </Link>
//             <Link
//               href="#testimonials"
//               className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
//             >
//               Testimonials
//             </Link>
//             <Link
//               href="#pricing"
//               className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
//             >
//               Pricing
//             </Link>
//             <Link
//               href="#contact"
//               className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
//             >
//               Contact
//             </Link>
//           </nav>
//           <div className="flex items-center gap-4">
//             <Link href="/dashboard">
//               <Button>Try Demo</Button>
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <HeroParallax items={heroItems} />

//       {/* Main Value Proposition */}
//       <section className="relative py-20">
//         <div className="container">
//           <div className="mx-auto max-w-[800px] text-center">
//             <h1 className="mb-6 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
//               AI-Powered Emergency Response
//             </h1>
//             <p className="mb-8 text-xl text-muted-foreground">
//               LifeLine AI transforms emergency dispatch with real-time intelligence, emotion analysis, and location
//               tracking.
//             </p>
//             <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
//               <Link href="/dashboard">
//                 <Button size="lg" className="w-full gap-2 sm:w-auto">
//                   Try the Dashboard <ArrowRight className="h-4 w-4" />
//                 </Button>
//               </Link>
//               <Link href="#features">
//                 <Button size="lg" variant="outline" className="w-full sm:w-auto">
//                   Learn More
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//         <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="bg-muted/50 py-20">
//         <div className="container space-y-12">
//           <div className="space-y-4 text-center">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
//             <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
//               Our platform provides cutting-edge tools for emergency responders
//             </p>
//           </div>

//           <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//             <div className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-lg">
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
//               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
//                 <MapPin className="h-6 w-6 text-primary" />
//               </div>
//               <h3 className="mb-2 text-xl font-bold">Real-time Mapping</h3>
//               <p className="text-muted-foreground">
//                 Interactive maps with live incident tracking and location-based dispatch coordination.
//               </p>
//             </div>
//             <div className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-lg">
//               <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
//               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
//                 <HeartPulse className="h-6 w-6 text-primary" />
//               </div>
//               <h3 className="mb-2 text-xl font-bold">AI Triage</h3>
//               <p className="text-muted-foreground">
//                 Intelligent call prioritization based on severity, emotion analysis, and historical data.
//               </p>
//             </div>
//             <div className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-lg">
//               <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
//               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
//                 <Clock className="h-6 w-6 text-primary" />
//               </div>
//               <h3 className="mb-2 text-xl font-bold">Response Time Optimization</h3>
//               <p className="text-muted-foreground">
//                 Reduce dispatch time by up to 40% with AI-powered decision support and routing.
//               </p>
//             </div>
//             <div className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-lg">
//               <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
//               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
//                 <Shield className="h-6 w-6 text-primary" />
//               </div>
//               <h3 className="mb-2 text-xl font-bold">Secure Communications</h3>
//               <p className="text-muted-foreground">
//                 End-to-end encrypted communications between dispatchers and first responders.
//               </p>
//             </div>
//             <div className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-lg">
//               <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
//               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
//                 <Users className="h-6 w-6 text-primary" />
//               </div>
//               <h3 className="mb-2 text-xl font-bold">Multi-agency Coordination</h3>
//               <p className="text-muted-foreground">
//                 Seamless coordination between police, fire, and medical services with unified communications.
//               </p>
//             </div>
//             <div className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-lg">
//               <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
//               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   className="h-6 w-6 text-blue-500"
//                 >
//                   <circle cx="12" cy="12" r="10" />
//                   <path d="M12 16v-4" />
//                   <path d="M12 8h.01" />
//                 </svg>
//               </div>
//               <h3 className="mb-2 text-xl font-bold">Predictive Analytics</h3>
//               <p className="text-muted-foreground">
//                 Forecast emergency patterns and optimize resource allocation with machine learning.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Dashboard Preview */}
//       <section className="py-20">
//         <div className="container space-y-12">
//           <div className="space-y-4 text-center">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Powerful Dashboard</h2>
//             <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
//               Designed for rapid decision-making in critical situations
//             </p>
//           </div>

//           {/* <div className="overflow-hidden rounded-xl border shadow-lg">
//             <img
            
//               src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Q6EUy9stxt99krvnfbkzVL3vzHbbiI.png"
//               alt="LifeLine AI Dashboard"
//               className="w-full object-cover"
//             />
//           </div> */}

            
//             <div className="overflow-hidden rounded-xl border shadow-lg">
//               <img
//                 src="/LifeLine_AI_Screenshot.png"
//                 alt="LifeLine AI Dashboard"
//                 className="w-full object-cover"
//               />
//             </div>

//           <div className="mx-auto flex max-w-[400px] flex-col items-center gap-4 text-center">
//             <p className="text-muted-foreground">Experience the full interactive dashboard with our live demo</p>
//             <Link href="/dashboard">
//               <Button size="lg" className="gap-1">
//                 Try the Dashboard <ArrowRight className="h-4 w-4" />
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </section>

//       Testimonials
//       <section id="testimonials" className="bg-muted/50 py-20">
//         <div className="container space-y-12">
//           <div className="space-y-4 text-center">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Trusted by Professionals</h2>
//             <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
//               See what emergency response teams are saying about LifeLine AI
//             </p>
//           </div>

//           <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//             <div className="rounded-lg border bg-card p-6 shadow-sm">
//               <div className="mb-4 flex items-center gap-4">
//                 <div className="h-12 w-12 rounded-full bg-primary/10"></div>
//                 <div>
//                   <h4 className="font-bold">Sarah Johnson</h4>
//                   <p className="text-sm text-muted-foreground">911 Dispatch Manager</p>
//                 </div>
//               </div>
//               <p className="text-muted-foreground">
//                 "LifeLine AI has reduced our response times by 35% and improved coordination between agencies. The
//                 emotion analysis feature helps us better prepare first responders for the situation they're entering."
//               </p>
//             </div>
//             <div className="rounded-lg border bg-card p-6 shadow-sm">
//               <div className="mb-4 flex items-center gap-4">
//                 <div className="h-12 w-12 rounded-full bg-primary/10"></div>
//                 <div>
//                   <h4 className="font-bold">Michael Rodriguez</h4>
//                   <p className="text-sm text-muted-foreground">Fire Chief</p>
//                 </div>
//               </div>
//               <p className="text-muted-foreground">
//                 "The real-time mapping and resource allocation has transformed how we respond to emergencies. We can now
//                 make data-driven decisions in seconds rather than minutes."
//               </p>
//             </div>
//             <div className="rounded-lg border bg-card p-6 shadow-sm">
//               <div className="mb-4 flex items-center gap-4">
//                 <div className="h-12 w-12 rounded-full bg-primary/10"></div>
//                 <div>
//                   <h4 className="font-bold">Dr. Emily Chen</h4>
//                   <p className="text-sm text-muted-foreground">Emergency Medical Director</p>
//                 </div>
//               </div>
//               <p className="text-muted-foreground">
//                 "The AI triage system has been a game-changer for our paramedics. Getting accurate severity assessments
//                 before arrival helps us prepare the right resources and save more lives."
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Pricing */}
//       <section id="pricing" className="py-20">
//         <div className="container space-y-12">
//           <div className="space-y-4 text-center">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Simple, Transparent Pricing</h2>
//             <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
//               Choose the plan that fits your emergency response needs
//             </p>
//           </div>

//           <div className="grid gap-8 md:grid-cols-3">
//             <div className="rounded-lg border bg-card p-6 shadow-sm">
//               <div className="mb-4">
//                 <h3 className="text-xl font-bold">Basic</h3>
//                 <p className="text-muted-foreground">For small municipalities</p>
//               </div>
//               <div className="mb-4">
//                 <span className="text-4xl font-bold">$499</span>
//                 <span className="text-muted-foreground">/month</span>
//               </div>
//               <ul className="mb-6 space-y-2">
//                 <li className="flex items-center gap-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="h-4 w-4 text-green-500"
//                   >
//                     <polyline points="20 6 9 17 4 12" />
//                   </svg>
//                   <span>Up to 5 concurrent operators</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="h-4 w-4 text-green-500"
//                   >
//                     <polyline points="20 6 9 17 4 12" />
//                   </svg>
//                   <span>Basic AI triage</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="h-4 w-4 text-green-500"
//                   >
//                     <polyline points="20 6 9 17 4 12" />
//                   </svg>
//                   <span>Standard mapping</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="h-4 w-4 text-green-500"
//                   >
//                     <polyline points="20 6 9 17 4 12" />
//                   </svg>
//                   <span>Email support</span>
//                 </li>
//               </ul>
//               <Button className="w-full">Get Started</Button>
//             </div>
//             <div className="relative rounded-lg border-2 border-primary bg-card p-6 shadow-lg">
//               <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
//                 MOST POPULAR
//               </div>
//               <div className="mb-4">
//                 <h3 className="text-xl font-bold">Professional</h3>
//                 <p className="text-muted-foreground">For mid-sized cities</p>
//               </div>
//               <div className="mb-4">
//                 <span className="text-4xl font-bold">$999</span>
//                 <span className="text-muted-foreground">/month</span>
//               </div>
//               <ul className="mb-6 space-y-2">
//                 <li className="flex items-center gap-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="h-4 w-4 text-green-500"
//                   >
//                     <polyline points="20 6 9 17 4 12" />
//                   </svg>
//                   <span>Up to 15 concurrent operators</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="h-4 w-4 text-green-500"
//                   >
//                     <polyline points="20 6 9 17 4 12" />
//                   </svg>
//                   <span>Advanced AI triage with emotion analysis</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="h-4 w-4 text-green-500"
//                   >
//                     <polyline points="20 6 9 17 4 12" />
//                   </svg>
//                   <span>Real-time interactive mapping</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="h-4 w-4 text-green-500"
//                   >
//                     <polyline points="20 6 9 17 4 12" />
//                   </svg>
//                   <span>24/7 priority support</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="h-4 w-4 text-green-500"
//                   >
//                     <polyline points="20 6 9 17 4 12" />
//                   </svg>
//                   <span>Multi-agency coordination</span>
//                 </li>
//               </ul>
//               <Button className="w-full">Get Started</Button>
//             </div>
//             <div className="rounded-lg border bg-card p-6 shadow-sm">
//               <div className="mb-4">
//                 <h3 className="text-xl font-bold">Enterprise</h3>
//                 <p className="text-muted-foreground">For large metropolitan areas</p>
//               </div>
//               <div className="mb-4">
//                 <span className="text-4xl font-bold">Custom</span>
//               </div>
//               <ul className="mb-6 space-y-2">
//                 <li className="flex items-center gap-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="h-4 w-4 text-green-500"
//                   >
//                     <polyline points="20 6 9 17 4 12" />
//                   </svg>
//                   <span>Unlimited operators</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="h-4 w-4 text-green-500"
//                   >
//                     <polyline points="20 6 9 17 4 12" />
//                   </svg>
//                   <span>Full AI suite with predictive analytics</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="h-4 w-4 text-green-500"
//                   >
//                     <polyline points="20 6 9 17 4 12" />
//                   </svg>
//                   <span>Custom integrations</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="h-4 w-4 text-green-500"
//                   >
//                     <polyline points="20 6 9 17 4 12" />
//                   </svg>
//                   <span>Dedicated account manager</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="h-4 w-4 text-green-500"
//                   >
//                     <polyline points="20 6 9 17 4 12" />
//                   </svg>
//                   <span>On-site training</span>
//                 </li>
//               </ul>
//               <Button variant="outline" className="w-full">
//                 Contact Sales
//               </Button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Contact */}
//       <section id="contact" className="bg-muted/50 py-20">
//         <div className="container">
//           <div className="mx-auto max-w-[800px] rounded-lg border bg-card p-8 shadow-sm">
//             <div className="mb-8 space-y-4 text-center">
//               <h2 className="text-3xl font-bold tracking-tighter">Ready to Transform Emergency Response?</h2>
//               <p className="text-muted-foreground">Contact us to schedule a demo or learn more about LifeLine AI</p>
//             </div>
//             <form className="space-y-4">
//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <label htmlFor="name" className="text-sm font-medium">
//                     Name
//                   </label>
//                   <input id="name" className="w-full rounded-md border bg-background px-3 py-2" />
//                 </div>
//                 <div className="space-y-2">
//                   <label htmlFor="email" className="text-sm font-medium">
//                     Email
//                   </label>
//                   <input id="email" type="email" className="w-full rounded-md border bg-background px-3 py-2" />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <label htmlFor="organization" className="text-sm font-medium">
//                   Organization
//                 </label>
//                 <input id="organization" className="w-full rounded-md border bg-background px-3 py-2" />
//               </div>
//               <div className="space-y-2">
//                 <label htmlFor="message" className="text-sm font-medium">
//                   Message
//                 </label>
//                 <textarea id="message" className="h-32 w-full rounded-md border bg-background px-3 py-2"></textarea>
//               </div>
//               <Button className="w-full">Submit</Button>
//             </form>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t py-12">
//         <div className="container">
//           <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
//             <div className="flex items-center gap-2">
//               <HeartPulse className="h-6 w-6 text-red-500" />
//               <span className="text-xl font-bold">LifeLine AI</span>
//             </div>
//             <nav className="flex gap-6">
//               <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
//                 Privacy Policy
//               </Link>
//               <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
//                 Terms of Service
//               </Link>
//               <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
//                 Contact
//               </Link>
//             </nav>
//             <div className="text-sm text-muted-foreground">© 2025 LifeLine AI. All rights reserved.</div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }

