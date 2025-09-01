import { motion } from 'framer-motion'
import { useState } from 'react'

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z"
          />
        </svg>
      ),
      title: 'Kanban Boards',
      description: 'Organize tasks visually with drag-and-drop boards that make workflow management intuitive.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Time Tracking',
      description: 'Built-in timer to track time spent on tasks and boost productivity insights.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: 'Team Invites',
      description: 'Invite team members to boards and assign tasks with seamless collaboration tools.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      title: 'Task Management',
      description: 'Create detailed tasks with subtasks, priorities, and deadlines to stay organized.',
    },
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager',
      company: 'TechFlow Inc.',
      avatar: 'SC',
      quote: 'Flowboard transformed how our team collaborates. The intuitive interface and time tracking features have boosted our productivity by 40%.',
    },
    {
      name: 'Marcus Johnson',
      role: 'Creative Director',
      company: 'Design Studio',
      avatar: 'MJ',
      quote: 'Simple yet powerful. We switched from complex tools to Flowboard and never looked back. Our project delivery is now more predictable.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Freelance Developer',
      company: 'Independent',
      avatar: 'ER',
      quote: 'Perfect for solo work and client projects. The board invites make client collaboration seamless without overwhelming them.',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6 }} className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Flowboard</span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">
                Testimonials
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <motion.a
                href="/login"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                Log In
              </motion.a>

              {/* Mobile menu button */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden w-8 h-8 flex items-center justify-center text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-100 bg-white"
            >
              <div className="px-4 py-4 space-y-3">
                <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Features
                </a>
                <a href="#testimonials" className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Testimonials
                </a>
                <a href="#pricing" className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Pricing
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <motion.div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-5 lg:text-left" variants={staggerContainer} initial="initial" animate="animate">
              <motion.h1 variants={fadeInUp as any} className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl lg:text-6xl">
                Simple team
                <span className="text-blue-600 block">collaboration</span>
                made effortless
              </motion.h1>

              <motion.p variants={fadeInUp as any} className="mt-6 text-xl text-gray-600">
                Organize tasks, track time, and collaborate seamlessly with your team. Flowboard makes project management intuitive for teams and individuals alike.
              </motion.p>

              <motion.div variants={fadeInUp as any} className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
                <motion.a
                  href="/login"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Get Started Free
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors"
                >
                  Watch Demo
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div className="mt-16 lg:mt-0 lg:col-span-7" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
              <motion.div className="relative" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                  {/* Mock Kanban Board */}
                  <div className="flex space-x-4 pb-4">
                    <div className="min-w-[180px] w-full bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-700 mb-3 text-sm">To Do</h3>
                      <div className="space-y-2">
                        <motion.div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200" whileHover={{ scale: 1.02 }}>
                          <h4 className="font-medium text-gray-900 text-xs">Design mockups</h4>
                          <div className="flex items-center mt-2">
                            <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-xs">🔴</span>
                            </div>
                            <span className="text-xs text-gray-500 ml-2">High</span>
                          </div>
                        </motion.div>
                        <motion.div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200" whileHover={{ scale: 1.02 }}>
                          <h4 className="font-medium text-gray-900 text-xs">User research</h4>
                          <div className="flex items-center mt-2">
                            <div className="w-4 h-4 bg-yellow-100 rounded-full flex items-center justify-center">
                              <span className="text-xs">🟡</span>
                            </div>
                            <span className="text-xs text-gray-500 ml-2">Medium</span>
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    <div className="min-w-[180px] w-full bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-700 mb-3 text-sm">In Progress</h3>
                      <div className="space-y-2">
                        <motion.div className="bg-white p-3 rounded-lg shadow-sm border border-blue-200" whileHover={{ scale: 1.02 }}>
                          <h4 className="font-medium text-gray-900 text-xs">Build dashboard</h4>
                          <div className="flex items-center mt-2 justify-between">
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-yellow-100 rounded-full flex items-center justify-center">
                                <span className="text-xs">🟡</span>
                              </div>
                              <span className="text-xs text-gray-500 ml-2">Medium</span>
                            </div>
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold">SC</div>
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    <div className="min-w-[180px] w-full bg-green-50 rounded-lg p-4">
                      <h3 className="font-semibold text-green-700 mb-3 text-sm">Done</h3>
                      <div className="space-y-2">
                        <motion.div className="bg-white p-3 rounded-lg shadow-sm border border-green-200" whileHover={{ scale: 1.02 }}>
                          <h4 className="font-medium text-gray-900 text-xs">Project setup</h4>
                          <div className="flex items-center mt-2">
                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-500 ml-2">Completed</span>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Everything you need to stay organized</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Powerful features designed for teams and individuals who want to get things done efficiently.</p>
          </motion.div>

          <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp as any}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Loved by teams worldwide</h2>
            <p className="text-xl text-gray-600">See what our users have to say about Flowboard</p>
          </motion.div>

          <motion.div className="grid md:grid-cols-3 gap-8" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp as any}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">{testimonial.avatar}</div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to streamline your workflow?</h2>
            <p className="text-xl text-blue-100 mb-8">Join thousands of teams already using Flowboard to stay organized and productive.</p>
            <motion.a
              href="/login"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
            >
              Start Using Flowboard Today
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">Flowboard</span>
              </div>
              <p className="text-gray-400 mb-4">Simple team collaboration made effortless. Organize, track, and deliver projects with ease.</p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/login" className="hover:text-white transition-colors">
                    Sign In
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2025 Flowboard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
