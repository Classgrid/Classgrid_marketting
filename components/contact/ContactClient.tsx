"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Building2, Mail, MessageSquare, Phone, Send, User, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea, InputGroupText } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { SectionAccentBar } from "@/components/ui/section-accent-bar"

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
  })
}

const scaleVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
}

export default function ContactClient() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const payload = {
        fullName: formData.get("fullName") as string,
        email: formData.get("email") as string,
        phoneNumber: formData.get("phoneNumber") as string,
        message: formData.get("message") as string,
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })
      if (response.ok) {
        setIsSuccess(true)
      }
    } catch (error) {
      console.error("Form submission error", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-background text-foreground min-h-screen relative overflow-hidden transition-colors duration-300">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] max-h-[800px] pointer-events-none z-0"
           style={{ background: "radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 60%)" }}
      />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-16 px-6 text-center border-b border-border/50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto w-full max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6 ring-1 ring-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            We are here to help
          </div>
          <SectionAccentBar />
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">
            Get in <span className="text-emerald-500">Touch</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Have questions about Classgrid? Our team is ready to provide you with the answers and support you need to empower your campus.
          </p>
        </motion.div>
      </section>

      {/* Main Content Grid */}
      <section className="relative z-10 py-20 px-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Direct Contact Info */}
            <div className="lg:col-span-5 space-y-6">
              <motion.div
                custom={0}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUpVariant}
              >
                <Card className="group relative rounded-[2rem] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-colors duration-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-500 overflow-hidden">
                  
                  <CardHeader className="space-y-4 pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-all duration-300">
                      <Phone className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold transition-colors">Let's Talk</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <a className="block text-lg font-medium text-foreground hover:text-emerald-500 transition-colors" href="tel:+918623947038">
                      +91 8623947038
                    </a>
                    <a className="block text-lg font-medium text-foreground hover:text-emerald-500 transition-colors" href="tel:+918149277038">
                      +91 8149277038
                    </a>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Call us directly or send us an email — our team is always ready to help with any questions about the platform.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUpVariant}
              >
                <Card className="group relative rounded-[2rem] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-colors duration-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-500 overflow-hidden">
                  
                  <CardHeader className="space-y-4 pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-all duration-300">
                      <Mail className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold transition-colors">Email Us</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <a className="block text-xl font-medium text-foreground hover:text-emerald-500 transition-colors break-all" href="mailto:support@classgrid.in">
                      support@classgrid.in
                    </a>
                    <p className="text-muted-foreground transition-colors text-sm">
                      Our team typically responds within 24 hours.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column: Contact Form */}
            <motion.div 
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUpVariant}
              className="lg:col-span-7"
            >
              <Card className="h-full rounded-[2.5rem] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden relative">
                <CardHeader className="px-8 pt-10 pb-6 border-b border-border/50 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <CardTitle className="text-3xl font-bold">Send Message</CardTitle>
                  <p className="text-muted-foreground mt-2">
                    Fill out the form below and we&apos;ll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent className="p-8">
                  {isSuccess ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center text-center py-16 space-y-4"
                    >
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Message Sent!</h3>
                      <p className="text-muted-foreground max-w-sm">
                        Thank you for reaching out. Our team has received your message and will get back to you shortly.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="font-semibold text-muted-foreground">Full Name</Label>
                          <InputGroup className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all duration-300">
                            <InputGroupAddon>
                              <InputGroupText className="bg-transparent border-0 pl-4">
                                <User className="h-4 w-4 text-emerald-500" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <InputGroupInput id="fullName" name="fullName" placeholder="John Doe" className="bg-transparent border-0 focus-visible:ring-0 px-2" required />
                          </InputGroup>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber" className="font-semibold text-muted-foreground">Phone Number</Label>
                          <InputGroup className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all duration-300">
                            <InputGroupAddon>
                              <InputGroupText className="bg-transparent border-0 pl-4 text-zinc-500 font-medium">+91</InputGroupText>
                            </InputGroupAddon>
                            <InputGroupInput
                              id="phoneNumber"
                              name="phoneNumber"
                              inputMode="numeric"
                              pattern="[0-9]{10}"
                              placeholder="8623947038"
                              className="bg-transparent border-0 focus-visible:ring-0 px-2"
                              required
                            />
                          </InputGroup>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emailAddress" className="font-semibold text-muted-foreground">Email Address</Label>
                        <InputGroup className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all duration-300">
                          <InputGroupAddon>
                            <InputGroupText className="bg-transparent border-0 pl-4">
                              <Mail className="h-4 w-4 text-emerald-500" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <InputGroupInput
                            id="emailAddress"
                            type="email"
                            name="email"
                            placeholder="you@institution.edu"
                            pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                            title="Please enter a valid email address (e.g. name@gmail.com)"
                            className="bg-transparent border-0 focus-visible:ring-0 px-2"
                            required
                          />
                        </InputGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="font-semibold text-muted-foreground">Your Message</Label>
                        <InputGroup className="min-h-[140px] max-h-[300px] rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all duration-300 overflow-y-auto">
                          <InputGroupAddon align="block-start">
                            <InputGroupText className="bg-transparent border-0 pl-4 pt-4">
                              <MessageSquare className="h-4 w-4 text-emerald-500" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <InputGroupTextarea
                            id="message"
                            name="message"
                            rows={5}
                            placeholder="How can we help you?"
                            className="bg-transparent border-0 focus-visible:ring-0 p-3 pt-4 resize-y"
                            required
                          />
                        </InputGroup>
                      </div>

                      <Button disabled={isSubmitting} type="submit" className="w-full sm:w-auto h-12 rounded-xl bg-emerald-500 px-8 text-[15px] font-semibold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 hover:shadow-emerald-500/40 transition-all duration-300">
                        {isSubmitting ? "Sending..." : "Send Message"}
                        {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 border-t border-border/50 bg-zinc-50/50 dark:bg-zinc-900/50">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={scaleVariant}
          className="mx-auto w-full max-w-6xl px-6"
        >
          <div className="flex flex-col items-center justify-center mb-12 text-center">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 mb-6 ring-1 ring-emerald-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <SectionAccentBar className="mb-4" />
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Headquarters
            </h2>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
              Akurdi Railway Station Road, Sector No. 26, Pradhikaran, Nigdi, Pimpri-Chinchwad, Maharashtra 411044, India
            </p>
          </div>
          
          <div className="rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900 p-2">
            <iframe
              src="https://www.google.com/maps?q=Akurdi+Railway+Station+Road+Nigdi&output=embed"
              className="h-[450px] w-full rounded-[2rem] border-0 filter dark:grayscale-[0.3] dark:invert-[0.1]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Classgrid Office Map"
            />
          </div>
        </motion.div>
      </section>

    </div>
  )
}
