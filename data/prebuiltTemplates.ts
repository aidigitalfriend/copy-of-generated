/**
 * Pre-built Full Application Templates
 * Complete ready-to-use application templates
 */

import { ProjectTemplate } from '../types';

export interface PrebuiltTemplate extends ProjectTemplate {
  thumbnail?: string;
  features: string[];
  techStack: string[];
}

export const PREBUILT_TEMPLATES: PrebuiltTemplate[] = [
  // ==================== LANDING PAGES ====================
  {
    id: 'landing-saas',
    name: 'SaaS Landing Page',
    description: 'Modern SaaS product landing page with hero, features, pricing, and CTA sections',
    icon: '🚀',
    category: 'landing',
    features: ['Hero Section', 'Features Grid', 'Pricing Table', 'Testimonials', 'FAQ', 'Contact Form'],
    techStack: ['HTML', 'Tailwind CSS', 'JavaScript'],
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SaaSify - Modern SaaS Landing</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-gray-900 text-white">
  <!-- Navigation -->
  <nav class="fixed w-full bg-gray-900/95 backdrop-blur-sm z-50 border-b border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <div class="flex items-center gap-2">
          <span class="text-2xl">🚀</span>
          <span class="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">SaaSify</span>
        </div>
        <div class="hidden md:flex items-center gap-8">
          <a href="#features" class="text-gray-300 hover:text-white transition">Features</a>
          <a href="#pricing" class="text-gray-300 hover:text-white transition">Pricing</a>
          <a href="#testimonials" class="text-gray-300 hover:text-white transition">Testimonials</a>
          <a href="#faq" class="text-gray-300 hover:text-white transition">FAQ</a>
        </div>
        <div class="flex items-center gap-4">
          <button class="text-gray-300 hover:text-white transition">Sign In</button>
          <button class="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg font-medium hover:opacity-90 transition">Get Started</button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="pt-32 pb-20 px-4">
    <div class="max-w-7xl mx-auto text-center">
      <div class="inline-block mb-4 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/20">
        <span class="text-purple-400 text-sm">✨ Introducing SaaSify 2.0</span>
      </div>
      <h1 class="text-5xl md:text-7xl font-bold mb-6">
        Build amazing products
        <span class="block bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">10x faster</span>
      </h1>
      <p class="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
        The all-in-one platform for teams to collaborate, design, and ship beautiful products. Start free, scale infinitely.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-xl font-medium text-lg hover:opacity-90 transition shadow-lg shadow-purple-500/25">
          Start Free Trial →
        </button>
        <button class="border border-gray-700 px-8 py-4 rounded-xl font-medium text-lg hover:bg-gray-800 transition">
          Watch Demo
        </button>
      </div>
      <div class="mt-12 flex items-center justify-center gap-8 text-gray-400 text-sm">
        <div class="flex items-center gap-2">
          <span class="text-green-400">✓</span> No credit card required
        </div>
        <div class="flex items-center gap-2">
          <span class="text-green-400">✓</span> 14-day free trial
        </div>
        <div class="flex items-center gap-2">
          <span class="text-green-400">✓</span> Cancel anytime
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="py-20 px-4 bg-gray-800/50">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold mb-4">Powerful Features</h2>
        <p class="text-gray-400 text-lg">Everything you need to build, ship, and scale your product</p>
      </div>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition">
          <div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl mb-4">⚡</div>
          <h3 class="text-xl font-semibold mb-2">Lightning Fast</h3>
          <p class="text-gray-400">Built on cutting-edge technology for blazing fast performance and instant results.</p>
        </div>
        <div class="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-pink-500/50 transition">
          <div class="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center text-2xl mb-4">🔒</div>
          <h3 class="text-xl font-semibold mb-2">Enterprise Security</h3>
          <p class="text-gray-400">Bank-level encryption and security protocols to keep your data safe.</p>
        </div>
        <div class="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition">
          <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl mb-4">🤝</div>
          <h3 class="text-xl font-semibold mb-2">Team Collaboration</h3>
          <p class="text-gray-400">Real-time collaboration tools to keep your team in sync and productive.</p>
        </div>
        <div class="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-green-500/50 transition">
          <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-2xl mb-4">📊</div>
          <h3 class="text-xl font-semibold mb-2">Advanced Analytics</h3>
          <p class="text-gray-400">Deep insights and analytics to make data-driven decisions.</p>
        </div>
        <div class="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-yellow-500/50 transition">
          <div class="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center text-2xl mb-4">🔌</div>
          <h3 class="text-xl font-semibold mb-2">API & Integrations</h3>
          <p class="text-gray-400">Connect with 100+ tools and build custom integrations with our API.</p>
        </div>
        <div class="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-red-500/50 transition">
          <div class="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-2xl mb-4">💬</div>
          <h3 class="text-xl font-semibold mb-2">24/7 Support</h3>
          <p class="text-gray-400">Round-the-clock support from our expert team whenever you need help.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Pricing Section -->
  <section id="pricing" class="py-20 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold mb-4">Simple Pricing</h2>
        <p class="text-gray-400 text-lg">Choose the plan that works for you</p>
      </div>
      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div class="bg-gray-800 p-8 rounded-2xl border border-gray-700">
          <h3 class="text-xl font-semibold mb-2">Starter</h3>
          <p class="text-gray-400 mb-6">Perfect for individuals</p>
          <div class="mb-6">
            <span class="text-4xl font-bold">$9</span>
            <span class="text-gray-400">/month</span>
          </div>
          <ul class="space-y-3 mb-8 text-gray-300">
            <li class="flex items-center gap-2"><span class="text-green-400">✓</span> 5 Projects</li>
            <li class="flex items-center gap-2"><span class="text-green-400">✓</span> Basic Analytics</li>
            <li class="flex items-center gap-2"><span class="text-green-400">✓</span> Email Support</li>
          </ul>
          <button class="w-full py-3 border border-gray-600 rounded-xl hover:bg-gray-700 transition">Get Started</button>
        </div>
        <div class="bg-gradient-to-b from-purple-900/50 to-gray-800 p-8 rounded-2xl border-2 border-purple-500 relative">
          <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-500 px-4 py-1 rounded-full text-sm font-medium">Most Popular</div>
          <h3 class="text-xl font-semibold mb-2">Pro</h3>
          <p class="text-gray-400 mb-6">For growing teams</p>
          <div class="mb-6">
            <span class="text-4xl font-bold">$29</span>
            <span class="text-gray-400">/month</span>
          </div>
          <ul class="space-y-3 mb-8 text-gray-300">
            <li class="flex items-center gap-2"><span class="text-green-400">✓</span> Unlimited Projects</li>
            <li class="flex items-center gap-2"><span class="text-green-400">✓</span> Advanced Analytics</li>
            <li class="flex items-center gap-2"><span class="text-green-400">✓</span> Priority Support</li>
            <li class="flex items-center gap-2"><span class="text-green-400">✓</span> Team Collaboration</li>
          </ul>
          <button class="w-full py-3 bg-purple-500 rounded-xl hover:bg-purple-600 transition font-medium">Get Started</button>
        </div>
        <div class="bg-gray-800 p-8 rounded-2xl border border-gray-700">
          <h3 class="text-xl font-semibold mb-2">Enterprise</h3>
          <p class="text-gray-400 mb-6">For large organizations</p>
          <div class="mb-6">
            <span class="text-4xl font-bold">$99</span>
            <span class="text-gray-400">/month</span>
          </div>
          <ul class="space-y-3 mb-8 text-gray-300">
            <li class="flex items-center gap-2"><span class="text-green-400">✓</span> Everything in Pro</li>
            <li class="flex items-center gap-2"><span class="text-green-400">✓</span> Custom Integrations</li>
            <li class="flex items-center gap-2"><span class="text-green-400">✓</span> Dedicated Support</li>
            <li class="flex items-center gap-2"><span class="text-green-400">✓</span> SLA Guarantee</li>
          </ul>
          <button class="w-full py-3 border border-gray-600 rounded-xl hover:bg-gray-700 transition">Contact Sales</button>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-12 px-4 border-t border-gray-800">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-2xl">🚀</span>
          <span class="text-xl font-bold">SaaSify</span>
        </div>
        <p class="text-gray-400 text-sm">© 2024 SaaSify. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`,
      'style.css': `/* Custom animations */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}`,
      'script.js': `// Navbar scroll effect
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (window.scrollY > 50) {
    nav.classList.add('shadow-lg');
  } else {
    nav.classList.remove('shadow-lg');
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

console.log('🚀 SaaSify Landing Page Loaded!');`,
    },
  },

  // ==================== RESTAURANT ====================
  {
    id: 'restaurant-website',
    name: 'Restaurant Website',
    description: 'Beautiful restaurant website with menu, gallery, reservations, and contact',
    icon: '🍽️',
    category: 'business',
    features: ['Menu Display', 'Image Gallery', 'Reservation Form', 'Contact Info', 'Opening Hours', 'Social Links'],
    techStack: ['HTML', 'Tailwind CSS', 'JavaScript'],
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>La Maison - Fine Dining Restaurant</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
  <style>
    .font-playfair { font-family: 'Playfair Display', serif; }
    .font-lato { font-family: 'Lato', sans-serif; }
  </style>
</head>
<body class="font-lato bg-stone-900 text-stone-100">
  <!-- Navigation -->
  <nav class="fixed w-full bg-stone-900/95 backdrop-blur-sm z-50 border-b border-stone-800">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <h1 class="font-playfair text-2xl text-amber-400">La Maison</h1>
        <div class="hidden md:flex items-center gap-8">
          <a href="#menu" class="hover:text-amber-400 transition">Menu</a>
          <a href="#about" class="hover:text-amber-400 transition">About</a>
          <a href="#gallery" class="hover:text-amber-400 transition">Gallery</a>
          <a href="#contact" class="hover:text-amber-400 transition">Contact</a>
        </div>
        <a href="#reservation" class="bg-amber-600 hover:bg-amber-700 px-6 py-2 rounded transition">Reserve</a>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <section class="h-screen flex items-center justify-center relative" style="background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920') center/cover;">
    <div class="text-center px-4">
      <p class="text-amber-400 tracking-[0.3em] mb-4">WELCOME TO</p>
      <h1 class="font-playfair text-6xl md:text-8xl mb-6">La Maison</h1>
      <p class="text-xl text-stone-300 mb-8 max-w-xl mx-auto">Experience exquisite French cuisine in an elegant atmosphere</p>
      <div class="flex gap-4 justify-center">
        <a href="#menu" class="bg-amber-600 hover:bg-amber-700 px-8 py-3 rounded transition">View Menu</a>
        <a href="#reservation" class="border border-amber-400 hover:bg-amber-400/10 px-8 py-3 rounded transition">Book a Table</a>
      </div>
    </div>
  </section>

  <!-- Menu Section -->
  <section id="menu" class="py-20 px-4 bg-stone-800">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <p class="text-amber-400 tracking-widest mb-2">OUR SPECIALTIES</p>
        <h2 class="font-playfair text-5xl">The Menu</h2>
      </div>
      
      <div class="grid md:grid-cols-2 gap-12">
        <!-- Starters -->
        <div>
          <h3 class="font-playfair text-2xl text-amber-400 mb-6 pb-2 border-b border-stone-700">Starters</h3>
          <div class="space-y-6">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-semibold text-lg">French Onion Soup</h4>
                <p class="text-stone-400 text-sm">Caramelized onions, gruyère cheese, toasted baguette</p>
              </div>
              <span class="text-amber-400 font-semibold">$14</span>
            </div>
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-semibold text-lg">Escargots de Bourgogne</h4>
                <p class="text-stone-400 text-sm">Burgundy snails in garlic herb butter</p>
              </div>
              <span class="text-amber-400 font-semibold">$18</span>
            </div>
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-semibold text-lg">Foie Gras Terrine</h4>
                <p class="text-stone-400 text-sm">With fig compote and brioche toast</p>
              </div>
              <span class="text-amber-400 font-semibold">$24</span>
            </div>
          </div>
        </div>
        
        <!-- Main Courses -->
        <div>
          <h3 class="font-playfair text-2xl text-amber-400 mb-6 pb-2 border-b border-stone-700">Main Courses</h3>
          <div class="space-y-6">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-semibold text-lg">Coq au Vin</h4>
                <p class="text-stone-400 text-sm">Braised chicken in red wine with mushrooms and pearl onions</p>
              </div>
              <span class="text-amber-400 font-semibold">$32</span>
            </div>
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-semibold text-lg">Beef Bourguignon</h4>
                <p class="text-stone-400 text-sm">Slow-braised beef in burgundy wine sauce</p>
              </div>
              <span class="text-amber-400 font-semibold">$38</span>
            </div>
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-semibold text-lg">Duck Confit</h4>
                <p class="text-stone-400 text-sm">With roasted potatoes and orange glaze</p>
              </div>
              <span class="text-amber-400 font-semibold">$36</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Reservation Section -->
  <section id="reservation" class="py-20 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-12">
        <p class="text-amber-400 tracking-widest mb-2">BOOK YOUR EXPERIENCE</p>
        <h2 class="font-playfair text-5xl">Reservation</h2>
      </div>
      
      <form class="space-y-6 bg-stone-800 p-8 rounded-2xl">
        <div class="grid md:grid-cols-2 gap-6">
          <input type="text" placeholder="Your Name" class="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-3 focus:border-amber-400 outline-none transition">
          <input type="email" placeholder="Email Address" class="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-3 focus:border-amber-400 outline-none transition">
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <input type="date" class="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-3 focus:border-amber-400 outline-none transition">
          <input type="time" class="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-3 focus:border-amber-400 outline-none transition">
          <select class="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-3 focus:border-amber-400 outline-none transition">
            <option>2 Guests</option>
            <option>3 Guests</option>
            <option>4 Guests</option>
            <option>5+ Guests</option>
          </select>
        </div>
        <textarea placeholder="Special Requests" rows="4" class="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-3 focus:border-amber-400 outline-none transition resize-none"></textarea>
        <button type="submit" class="w-full bg-amber-600 hover:bg-amber-700 py-4 rounded-lg font-semibold transition">Book a Table</button>
      </form>
    </div>
  </section>

  <!-- Contact -->
  <section id="contact" class="py-20 px-4 bg-stone-800">
    <div class="max-w-6xl mx-auto">
      <div class="grid md:grid-cols-3 gap-12 text-center">
        <div>
          <div class="w-16 h-16 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">📍</span>
          </div>
          <h3 class="font-playfair text-xl mb-2">Location</h3>
          <p class="text-stone-400">123 Gourmet Street<br>New York, NY 10001</p>
        </div>
        <div>
          <div class="w-16 h-16 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">🕐</span>
          </div>
          <h3 class="font-playfair text-xl mb-2">Hours</h3>
          <p class="text-stone-400">Tue-Sun: 5:00 PM - 11:00 PM<br>Monday: Closed</p>
        </div>
        <div>
          <div class="w-16 h-16 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">📞</span>
          </div>
          <h3 class="font-playfair text-xl mb-2">Contact</h3>
          <p class="text-stone-400">(212) 555-0123<br>info@lamaison.com</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-8 px-4 border-t border-stone-800">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
      <h1 class="font-playfair text-xl text-amber-400">La Maison</h1>
      <p class="text-stone-500 text-sm">© 2024 La Maison. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`,
      'style.css': `/* Smooth scrolling */
html { scroll-behavior: smooth; }`,
      'script.js': `console.log('🍽️ La Maison Restaurant');`,
    },
  },

  // ==================== HOTEL BOOKING ====================
  {
    id: 'hotel-booking',
    name: 'Hotel Booking Website',
    description: 'Luxury hotel website with room listings, amenities, and booking system',
    icon: '🏨',
    category: 'hospitality',
    features: ['Room Listings', 'Booking Form', 'Amenities', 'Photo Gallery', 'Testimonials', 'Location Map'],
    techStack: ['HTML', 'Tailwind CSS', 'JavaScript'],
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Grand Azure - Luxury Hotel</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    .font-cormorant { font-family: 'Cormorant Garamond', serif; }
    .font-mont { font-family: 'Montserrat', sans-serif; }
  </style>
</head>
<body class="font-mont bg-slate-50">
  <!-- Navigation -->
  <nav class="fixed w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <h1 class="font-cormorant text-3xl font-bold text-blue-900">Grand Azure</h1>
        <div class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#rooms" class="hover:text-blue-600 transition">Rooms</a>
          <a href="#amenities" class="hover:text-blue-600 transition">Amenities</a>
          <a href="#dining" class="hover:text-blue-600 transition">Dining</a>
          <a href="#contact" class="hover:text-blue-600 transition">Contact</a>
        </div>
        <a href="#booking" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium transition">Book Now</a>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <section class="h-screen flex items-center relative" style="background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920') center/cover;">
    <div class="max-w-7xl mx-auto px-4 text-white">
      <p class="text-blue-300 tracking-[0.3em] mb-4 text-sm">LUXURY REDEFINED</p>
      <h1 class="font-cormorant text-6xl md:text-8xl font-bold mb-6">Grand Azure</h1>
      <p class="text-xl text-slate-200 mb-8 max-w-xl">Where timeless elegance meets modern comfort. Experience luxury on the shores of paradise.</p>
      
      <!-- Booking Widget -->
      <div class="bg-white rounded-2xl p-6 max-w-4xl shadow-2xl">
        <form class="grid md:grid-cols-5 gap-4 items-end">
          <div>
            <label class="block text-slate-500 text-xs mb-2 font-medium">CHECK IN</label>
            <input type="date" class="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:border-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-slate-500 text-xs mb-2 font-medium">CHECK OUT</label>
            <input type="date" class="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:border-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-slate-500 text-xs mb-2 font-medium">GUESTS</label>
            <select class="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:border-blue-500 outline-none">
              <option>1 Guest</option>
              <option>2 Guests</option>
              <option>3 Guests</option>
              <option>4+ Guests</option>
            </select>
          </div>
          <div>
            <label class="block text-slate-500 text-xs mb-2 font-medium">ROOM TYPE</label>
            <select class="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:border-blue-500 outline-none">
              <option>Deluxe</option>
              <option>Suite</option>
              <option>Presidential</option>
            </select>
          </div>
          <button class="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition">Check Availability</button>
        </form>
      </div>
    </div>
  </section>

  <!-- Rooms Section -->
  <section id="rooms" class="py-20 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <p class="text-blue-600 tracking-widest text-sm mb-2">ACCOMMODATIONS</p>
        <h2 class="font-cormorant text-5xl text-slate-800">Our Rooms & Suites</h2>
      </div>
      
      <div class="grid md:grid-cols-3 gap-8">
        <div class="group">
          <div class="relative overflow-hidden rounded-2xl mb-4">
            <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600" alt="Deluxe Room" class="w-full h-72 object-cover group-hover:scale-105 transition duration-500">
            <div class="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full text-sm font-medium text-slate-800">From $299/night</div>
          </div>
          <h3 class="font-cormorant text-2xl text-slate-800 mb-2">Deluxe Room</h3>
          <p class="text-slate-500 text-sm mb-4">45 sqm • King Bed • City View • Free WiFi</p>
          <a href="#booking" class="text-blue-600 font-medium text-sm hover:underline">Book Now →</a>
        </div>
        
        <div class="group">
          <div class="relative overflow-hidden rounded-2xl mb-4">
            <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600" alt="Executive Suite" class="w-full h-72 object-cover group-hover:scale-105 transition duration-500">
            <div class="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full text-sm font-medium text-slate-800">From $499/night</div>
          </div>
          <h3 class="font-cormorant text-2xl text-slate-800 mb-2">Executive Suite</h3>
          <p class="text-slate-500 text-sm mb-4">75 sqm • King Bed • Ocean View • Lounge Access</p>
          <a href="#booking" class="text-blue-600 font-medium text-sm hover:underline">Book Now →</a>
        </div>
        
        <div class="group">
          <div class="relative overflow-hidden rounded-2xl mb-4">
            <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600" alt="Presidential Suite" class="w-full h-72 object-cover group-hover:scale-105 transition duration-500">
            <div class="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full text-sm font-medium text-slate-800">From $999/night</div>
          </div>
          <h3 class="font-cormorant text-2xl text-slate-800 mb-2">Presidential Suite</h3>
          <p class="text-slate-500 text-sm mb-4">150 sqm • 2 Bedrooms • Private Terrace • Butler Service</p>
          <a href="#booking" class="text-blue-600 font-medium text-sm hover:underline">Book Now →</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Amenities -->
  <section id="amenities" class="py-20 px-4 bg-blue-900 text-white">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <p class="text-blue-300 tracking-widest text-sm mb-2">WORLD-CLASS</p>
        <h2 class="font-cormorant text-5xl">Hotel Amenities</h2>
      </div>
      
      <div class="grid md:grid-cols-4 gap-8">
        <div class="text-center">
          <div class="w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🏊</div>
          <h3 class="font-medium mb-2">Infinity Pool</h3>
          <p class="text-blue-300 text-sm">Stunning rooftop pool with panoramic views</p>
        </div>
        <div class="text-center">
          <div class="w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">💆</div>
          <h3 class="font-medium mb-2">Luxury Spa</h3>
          <p class="text-blue-300 text-sm">Full-service spa with signature treatments</p>
        </div>
        <div class="text-center">
          <div class="w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🍽️</div>
          <h3 class="font-medium mb-2">Fine Dining</h3>
          <p class="text-blue-300 text-sm">Award-winning restaurants and bars</p>
        </div>
        <div class="text-center">
          <div class="w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🏋️</div>
          <h3 class="font-medium mb-2">Fitness Center</h3>
          <p class="text-blue-300 text-sm">State-of-the-art equipment 24/7</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-12 px-4 bg-slate-900 text-white">
    <div class="max-w-7xl mx-auto text-center">
      <h1 class="font-cormorant text-3xl mb-4">Grand Azure</h1>
      <p class="text-slate-400 mb-6">123 Oceanfront Drive, Paradise Bay • +1 (555) 123-4567</p>
      <p class="text-slate-500 text-sm">© 2024 Grand Azure Hotel. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`,
      'style.css': `html { scroll-behavior: smooth; }`,
      'script.js': `console.log('🏨 Grand Azure Hotel');`,
    },
  },

  // ==================== PORTFOLIO ====================
  {
    id: 'portfolio-developer',
    name: 'Developer Portfolio',
    description: 'Modern developer portfolio with projects, skills, and contact sections',
    icon: '👨‍💻',
    category: 'portfolio',
    features: ['About Section', 'Skills Display', 'Project Showcase', 'Contact Form', 'Resume Download', 'Social Links'],
    techStack: ['HTML', 'Tailwind CSS', 'JavaScript'],
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>John Doe - Full Stack Developer</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-950 text-gray-100">
  <!-- Navigation -->
  <nav class="fixed w-full bg-gray-950/90 backdrop-blur-sm z-50 border-b border-gray-800">
    <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
      <span class="text-xl font-bold text-emerald-400">&lt;JD /&gt;</span>
      <div class="flex items-center gap-6">
        <a href="#about" class="text-gray-400 hover:text-white transition text-sm">About</a>
        <a href="#skills" class="text-gray-400 hover:text-white transition text-sm">Skills</a>
        <a href="#projects" class="text-gray-400 hover:text-white transition text-sm">Projects</a>
        <a href="#contact" class="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg text-sm transition">Contact</a>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <section class="min-h-screen flex items-center px-4 pt-20">
    <div class="max-w-6xl mx-auto">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p class="text-emerald-400 mb-4">Hi, my name is</p>
          <h1 class="text-5xl md:text-7xl font-bold mb-4">John Doe</h1>
          <h2 class="text-3xl md:text-4xl text-gray-400 mb-6">I build things for the web.</h2>
          <p class="text-gray-400 mb-8 max-w-lg leading-relaxed">
            I'm a full-stack developer specializing in building exceptional digital experiences. 
            Currently focused on building accessible, human-centered products.
          </p>
          <div class="flex gap-4">
            <a href="#projects" class="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-lg transition">View My Work</a>
            <a href="#contact" class="border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 px-6 py-3 rounded-lg transition">Get In Touch</a>
          </div>
        </div>
        <div class="flex justify-center">
          <div class="w-72 h-72 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-8xl">
            👨‍💻
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Skills -->
  <section id="skills" class="py-20 px-4">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold mb-12 flex items-center gap-4">
        <span class="text-emerald-400">02.</span> Skills & Technologies
      </h2>
      <div class="grid md:grid-cols-4 gap-6">
        <div class="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-emerald-500/50 transition">
          <h3 class="font-semibold mb-4 text-emerald-400">Frontend</h3>
          <ul class="space-y-2 text-gray-400 text-sm">
            <li>React / Next.js</li>
            <li>TypeScript</li>
            <li>Tailwind CSS</li>
            <li>Vue.js</li>
          </ul>
        </div>
        <div class="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-emerald-500/50 transition">
          <h3 class="font-semibold mb-4 text-emerald-400">Backend</h3>
          <ul class="space-y-2 text-gray-400 text-sm">
            <li>Node.js / Express</li>
            <li>Python / FastAPI</li>
            <li>PostgreSQL</li>
            <li>MongoDB</li>
          </ul>
        </div>
        <div class="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-emerald-500/50 transition">
          <h3 class="font-semibold mb-4 text-emerald-400">DevOps</h3>
          <ul class="space-y-2 text-gray-400 text-sm">
            <li>Docker</li>
            <li>AWS / GCP</li>
            <li>CI/CD</li>
            <li>Kubernetes</li>
          </ul>
        </div>
        <div class="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-emerald-500/50 transition">
          <h3 class="font-semibold mb-4 text-emerald-400">Tools</h3>
          <ul class="space-y-2 text-gray-400 text-sm">
            <li>Git / GitHub</li>
            <li>Figma</li>
            <li>VS Code</li>
            <li>Postman</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Projects -->
  <section id="projects" class="py-20 px-4 bg-gray-900">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold mb-12 flex items-center gap-4">
        <span class="text-emerald-400">03.</span> Featured Projects
      </h2>
      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-gray-800 rounded-xl overflow-hidden group">
          <div class="h-48 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-6xl">🛒</div>
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-2">E-Commerce Platform</h3>
            <p class="text-gray-400 text-sm mb-4">Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.</p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span class="px-3 py-1 bg-gray-700 rounded-full text-xs text-emerald-400">React</span>
              <span class="px-3 py-1 bg-gray-700 rounded-full text-xs text-emerald-400">Node.js</span>
              <span class="px-3 py-1 bg-gray-700 rounded-full text-xs text-emerald-400">PostgreSQL</span>
            </div>
            <div class="flex gap-4">
              <a href="#" class="text-gray-400 hover:text-white text-sm">GitHub →</a>
              <a href="#" class="text-gray-400 hover:text-white text-sm">Live Demo →</a>
            </div>
          </div>
        </div>
        <div class="bg-gray-800 rounded-xl overflow-hidden group">
          <div class="h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-6xl">📊</div>
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-2">Analytics Dashboard</h3>
            <p class="text-gray-400 text-sm mb-4">Real-time analytics dashboard with data visualization, custom reports, and team collaboration features.</p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span class="px-3 py-1 bg-gray-700 rounded-full text-xs text-emerald-400">Next.js</span>
              <span class="px-3 py-1 bg-gray-700 rounded-full text-xs text-emerald-400">D3.js</span>
              <span class="px-3 py-1 bg-gray-700 rounded-full text-xs text-emerald-400">FastAPI</span>
            </div>
            <div class="flex gap-4">
              <a href="#" class="text-gray-400 hover:text-white text-sm">GitHub →</a>
              <a href="#" class="text-gray-400 hover:text-white text-sm">Live Demo →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section id="contact" class="py-20 px-4">
    <div class="max-w-2xl mx-auto text-center">
      <p class="text-emerald-400 mb-4">04. What's Next?</p>
      <h2 class="text-4xl font-bold mb-6">Get In Touch</h2>
      <p class="text-gray-400 mb-8">
        I'm currently looking for new opportunities. Whether you have a question or just want to say hi, 
        I'll try my best to get back to you!
      </p>
      <a href="mailto:hello@johndoe.com" class="inline-block bg-emerald-500 hover:bg-emerald-600 px-8 py-4 rounded-lg font-medium transition">
        Say Hello 👋
      </a>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-8 border-t border-gray-800 text-center text-gray-500 text-sm">
    <p>Designed & Built by John Doe</p>
  </footer>
</body>
</html>`,
      'style.css': `html { scroll-behavior: smooth; }`,
      'script.js': `console.log('👨‍💻 Portfolio Ready!');`,
    },
  },

  // ==================== SCHOOL / EDUCATION ====================
  {
    id: 'school-website',
    name: 'School/Education Website',
    description: 'Educational institution website with courses, faculty, admissions, and events',
    icon: '🎓',
    category: 'education',
    features: ['Course Catalog', 'Faculty Profiles', 'Admissions Form', 'Events Calendar', 'News Section', 'Gallery'],
    techStack: ['HTML', 'Tailwind CSS', 'JavaScript'],
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bright Future Academy</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white">
  <!-- Navigation -->
  <nav class="bg-blue-900 text-white">
    <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <span class="text-3xl">🎓</span>
        <div>
          <h1 class="font-bold text-lg">Bright Future Academy</h1>
          <p class="text-blue-300 text-xs">Excellence in Education</p>
        </div>
      </div>
      <div class="hidden md:flex items-center gap-6 text-sm">
        <a href="#about" class="hover:text-blue-300 transition">About</a>
        <a href="#programs" class="hover:text-blue-300 transition">Programs</a>
        <a href="#faculty" class="hover:text-blue-300 transition">Faculty</a>
        <a href="#admissions" class="hover:text-blue-300 transition">Admissions</a>
        <a href="#contact" class="bg-yellow-500 hover:bg-yellow-600 text-blue-900 px-4 py-2 rounded-lg font-medium transition">Apply Now</a>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <section class="relative h-[600px] flex items-center" style="background: linear-gradient(rgba(30,58,138,0.8), rgba(30,58,138,0.8)), url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920') center/cover;">
    <div class="max-w-7xl mx-auto px-4 text-white">
      <h1 class="text-5xl md:text-6xl font-bold mb-6">Shaping Tomorrow's<br>Leaders Today</h1>
      <p class="text-xl text-blue-200 mb-8 max-w-xl">Providing world-class education with a focus on innovation, creativity, and character development since 1985.</p>
      <div class="flex gap-4">
        <a href="#programs" class="bg-yellow-500 hover:bg-yellow-600 text-blue-900 px-6 py-3 rounded-lg font-medium transition">Explore Programs</a>
        <a href="#contact" class="border border-white hover:bg-white/10 px-6 py-3 rounded-lg transition">Schedule a Visit</a>
      </div>
    </div>
  </section>

  <!-- Stats -->
  <section class="bg-blue-900 py-12">
    <div class="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
      <div>
        <div class="text-4xl font-bold text-yellow-400">2500+</div>
        <div class="text-blue-300 text-sm">Students Enrolled</div>
      </div>
      <div>
        <div class="text-4xl font-bold text-yellow-400">150+</div>
        <div class="text-blue-300 text-sm">Expert Faculty</div>
      </div>
      <div>
        <div class="text-4xl font-bold text-yellow-400">40+</div>
        <div class="text-blue-300 text-sm">Years of Excellence</div>
      </div>
      <div>
        <div class="text-4xl font-bold text-yellow-400">98%</div>
        <div class="text-blue-300 text-sm">Graduation Rate</div>
      </div>
    </div>
  </section>

  <!-- Programs -->
  <section id="programs" class="py-20 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-blue-900 mb-4">Our Programs</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">Comprehensive educational programs designed to nurture young minds and prepare them for future success.</p>
      </div>
      
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
          <div class="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-6xl">📚</div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-blue-900 mb-2">Primary Education</h3>
            <p class="text-gray-600 text-sm mb-4">Grades K-5: Building strong foundations in reading, writing, mathematics, and critical thinking.</p>
            <a href="#" class="text-blue-600 font-medium text-sm hover:underline">Learn More →</a>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
          <div class="h-48 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-6xl">🔬</div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-blue-900 mb-2">Middle School</h3>
            <p class="text-gray-600 text-sm mb-4">Grades 6-8: Expanding horizons with STEM, arts, and leadership development programs.</p>
            <a href="#" class="text-blue-600 font-medium text-sm hover:underline">Learn More →</a>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
          <div class="h-48 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-6xl">🎯</div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-blue-900 mb-2">High School</h3>
            <p class="text-gray-600 text-sm mb-4">Grades 9-12: College prep with AP courses, career guidance, and extracurricular excellence.</p>
            <a href="#" class="text-blue-600 font-medium text-sm hover:underline">Learn More →</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Admissions CTA -->
  <section id="admissions" class="py-20 px-4 bg-yellow-400">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-4xl font-bold text-blue-900 mb-4">Join Our Community</h2>
      <p class="text-blue-800 mb-8 text-lg">Admissions for the 2024-2025 academic year are now open. Limited seats available!</p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="#" class="bg-blue-900 hover:bg-blue-800 text-white px-8 py-4 rounded-lg font-medium transition">Apply Online</a>
        <a href="#" class="border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white px-8 py-4 rounded-lg font-medium transition">Download Brochure</a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-blue-900 text-white py-12 px-4">
    <div class="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
      <div>
        <div class="flex items-center gap-2 mb-4">
          <span class="text-2xl">🎓</span>
          <span class="font-bold">Bright Future Academy</span>
        </div>
        <p class="text-blue-300 text-sm">Empowering students to reach their full potential since 1985.</p>
      </div>
      <div>
        <h4 class="font-semibold mb-4">Quick Links</h4>
        <ul class="space-y-2 text-blue-300 text-sm">
          <li><a href="#" class="hover:text-white transition">About Us</a></li>
          <li><a href="#" class="hover:text-white transition">Academics</a></li>
          <li><a href="#" class="hover:text-white transition">Admissions</a></li>
          <li><a href="#" class="hover:text-white transition">Campus Life</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold mb-4">Contact</h4>
        <ul class="space-y-2 text-blue-300 text-sm">
          <li>📍 123 Education Lane</li>
          <li>📞 (555) 123-4567</li>
          <li>✉️ info@brightfuture.edu</li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold mb-4">Office Hours</h4>
        <p class="text-blue-300 text-sm">Mon-Fri: 8:00 AM - 4:00 PM<br>Sat: 9:00 AM - 12:00 PM</p>
      </div>
    </div>
    <div class="max-w-7xl mx-auto pt-8 mt-8 border-t border-blue-800 text-center text-blue-400 text-sm">
      © 2024 Bright Future Academy. All rights reserved.
    </div>
  </footer>
</body>
</html>`,
      'style.css': `html { scroll-behavior: smooth; }`,
      'script.js': `console.log('🎓 School Website Ready!');`,
    },
  },

  // ==================== E-COMMERCE ====================
  {
    id: 'ecommerce-store',
    name: 'E-Commerce Store',
    description: 'Modern online store with product listings, cart, and checkout',
    icon: '🛒',
    category: 'ecommerce',
    features: ['Product Grid', 'Shopping Cart', 'Search & Filter', 'Product Details', 'Checkout Flow', 'Responsive Design'],
    techStack: ['React', 'TypeScript', 'Tailwind CSS'],
    dependencies: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
    },
    devDependencies: {
      '@vitejs/plugin-react': '^4.0.0',
      'vite': '^5.0.0',
      'typescript': '^5.0.0',
      'tailwindcss': '^3.4.0',
    },
    scripts: {
      'dev': 'vite',
      'build': 'vite build',
    },
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ShopStyle - Modern E-Commerce</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
      'src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
      'src/App.tsx': `import { useState } from 'react'

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
}

interface CartItem extends Product {
  quantity: number
}

const products: Product[] = [
  { id: 1, name: 'Classic White T-Shirt', price: 29, image: '👕', category: 'Clothing' },
  { id: 2, name: 'Wireless Headphones', price: 149, image: '🎧', category: 'Electronics' },
  { id: 3, name: 'Leather Backpack', price: 89, image: '🎒', category: 'Accessories' },
  { id: 4, name: 'Running Shoes', price: 119, image: '👟', category: 'Footwear' },
  { id: 5, name: 'Smart Watch', price: 299, image: '⌚', category: 'Electronics' },
  { id: 6, name: 'Denim Jacket', price: 79, image: '🧥', category: 'Clothing' },
  { id: 7, name: 'Sunglasses', price: 59, image: '🕶️', category: 'Accessories' },
  { id: 8, name: 'Canvas Sneakers', price: 65, image: '👞', category: 'Footwear' },
]

function App() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || p.category === category
    return matchesSearch && matchesCategory
  })

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">🛍️ ShopStyle</h1>
          
          <div className="flex-1 max-w-xl mx-8">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 hover:bg-gray-100 rounded-lg"
          >
            <span className="text-2xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={\`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap \${
                category === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }\`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group">
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl">
                {product.image}
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-1">{product.category}</p>
                <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-indigo-600">\${product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold">Shopping Cart ({cartCount})</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            
            <div className="p-4 flex-1 overflow-auto">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
                      <span className="text-3xl">{item.image}</span>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">\${item.price * item.quantity}</p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold">\${cartTotal}</span>
                </div>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition">
                  Checkout →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App`,
      'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;`,
      'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,
      'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}`,
      'package.json': '',
    },
  },

  // ==================== EVENT / TICKETING ====================
  {
    id: 'event-ticketing',
    name: 'Event Ticketing',
    description: 'Event landing page with countdown, ticket selection, and booking',
    icon: '🎫',
    category: 'events',
    features: ['Event Countdown', 'Ticket Tiers', 'Schedule', 'Speakers/Artists', 'Venue Info', 'FAQ'],
    techStack: ['HTML', 'Tailwind CSS', 'JavaScript'],
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TechConf 2024 - The Future of Innovation</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-white">
  <!-- Navigation -->
  <nav class="fixed w-full bg-gray-900/95 backdrop-blur-sm z-50 border-b border-gray-800">
    <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <span class="text-xl font-bold text-cyan-400">🎫 TechConf 2024</span>
      <div class="hidden md:flex items-center gap-8 text-sm">
        <a href="#schedule" class="hover:text-cyan-400 transition">Schedule</a>
        <a href="#speakers" class="hover:text-cyan-400 transition">Speakers</a>
        <a href="#tickets" class="hover:text-cyan-400 transition">Tickets</a>
        <a href="#tickets" class="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg transition">Get Tickets</a>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <section class="min-h-screen flex items-center justify-center px-4 pt-20 relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-gray-900 to-cyan-900/50"></div>
    <div class="relative text-center max-w-4xl">
      <p class="text-cyan-400 tracking-widest mb-4">MARCH 15-17, 2024 • SAN FRANCISCO</p>
      <h1 class="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        TechConf 2024
      </h1>
      <p class="text-xl text-gray-300 mb-8">The world's premier technology conference. 3 days, 100+ speakers, endless possibilities.</p>
      
      <!-- Countdown -->
      <div class="flex justify-center gap-4 mb-12">
        <div class="bg-gray-800/50 backdrop-blur px-6 py-4 rounded-xl border border-gray-700">
          <div id="days" class="text-4xl font-bold text-cyan-400">45</div>
          <div class="text-gray-400 text-sm">Days</div>
        </div>
        <div class="bg-gray-800/50 backdrop-blur px-6 py-4 rounded-xl border border-gray-700">
          <div id="hours" class="text-4xl font-bold text-purple-400">12</div>
          <div class="text-gray-400 text-sm">Hours</div>
        </div>
        <div class="bg-gray-800/50 backdrop-blur px-6 py-4 rounded-xl border border-gray-700">
          <div id="minutes" class="text-4xl font-bold text-pink-400">30</div>
          <div class="text-gray-400 text-sm">Minutes</div>
        </div>
        <div class="bg-gray-800/50 backdrop-blur px-6 py-4 rounded-xl border border-gray-700">
          <div id="seconds" class="text-4xl font-bold text-yellow-400">00</div>
          <div class="text-gray-400 text-sm">Seconds</div>
        </div>
      </div>

      <a href="#tickets" class="inline-block bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 px-8 py-4 rounded-xl font-medium text-lg transition shadow-lg shadow-cyan-500/25">
        Get Your Tickets Now →
      </a>
    </div>
  </section>

  <!-- Speakers -->
  <section id="speakers" class="py-20 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold mb-4">Featured Speakers</h2>
        <p class="text-gray-400">Learn from industry leaders and innovators</p>
      </div>
      
      <div class="grid md:grid-cols-4 gap-8">
        <div class="text-center group">
          <div class="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-5xl">👩‍💻</div>
          <h3 class="font-semibold text-lg">Sarah Chen</h3>
          <p class="text-cyan-400 text-sm">CEO, TechVentures</p>
        </div>
        <div class="text-center group">
          <div class="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-5xl">👨‍🔬</div>
          <h3 class="font-semibold text-lg">Michael Roberts</h3>
          <p class="text-purple-400 text-sm">AI Research Lead, Google</p>
        </div>
        <div class="text-center group">
          <div class="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 flex items-center justify-center text-5xl">👩‍🚀</div>
          <h3 class="font-semibold text-lg">Lisa Park</h3>
          <p class="text-pink-400 text-sm">CTO, SpaceX</p>
        </div>
        <div class="text-center group">
          <div class="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500 to-cyan-500 flex items-center justify-center text-5xl">👨‍💼</div>
          <h3 class="font-semibold text-lg">James Wilson</h3>
          <p class="text-yellow-400 text-sm">Founder, Blockchain Inc</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Tickets -->
  <section id="tickets" class="py-20 px-4 bg-gray-800">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold mb-4">Choose Your Pass</h2>
        <p class="text-gray-400">Early bird pricing ends soon!</p>
      </div>
      
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-cyan-500/50 transition">
          <h3 class="text-xl font-semibold mb-2">Standard Pass</h3>
          <p class="text-gray-400 text-sm mb-6">Perfect for first-time attendees</p>
          <div class="mb-6">
            <span class="text-4xl font-bold">$299</span>
            <span class="text-gray-400 line-through ml-2">$399</span>
          </div>
          <ul class="space-y-3 mb-8 text-gray-300 text-sm">
            <li class="flex items-center gap-2">✓ All keynote sessions</li>
            <li class="flex items-center gap-2">✓ Workshop access</li>
            <li class="flex items-center gap-2">✓ Lunch included</li>
            <li class="flex items-center gap-2">✓ Event swag bag</li>
          </ul>
          <button class="w-full py-3 border border-cyan-500 text-cyan-400 rounded-xl hover:bg-cyan-500/10 transition">Select</button>
        </div>
        
        <div class="bg-gradient-to-b from-cyan-900/50 to-gray-900 p-8 rounded-2xl border-2 border-cyan-500 relative">
          <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-500 px-4 py-1 rounded-full text-sm font-medium">Most Popular</div>
          <h3 class="text-xl font-semibold mb-2">VIP Pass</h3>
          <p class="text-gray-400 text-sm mb-6">The complete experience</p>
          <div class="mb-6">
            <span class="text-4xl font-bold">$599</span>
            <span class="text-gray-400 line-through ml-2">$799</span>
          </div>
          <ul class="space-y-3 mb-8 text-gray-300 text-sm">
            <li class="flex items-center gap-2">✓ Everything in Standard</li>
            <li class="flex items-center gap-2">✓ VIP lounge access</li>
            <li class="flex items-center gap-2">✓ Speaker meet & greet</li>
            <li class="flex items-center gap-2">✓ Priority seating</li>
            <li class="flex items-center gap-2">✓ After-party access</li>
          </ul>
          <button class="w-full py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-medium transition">Select</button>
        </div>
        
        <div class="bg-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition">
          <h3 class="text-xl font-semibold mb-2">Team Pass</h3>
          <p class="text-gray-400 text-sm mb-6">Bring your whole team</p>
          <div class="mb-6">
            <span class="text-4xl font-bold">$1,999</span>
            <span class="text-gray-400 ml-2">for 5 people</span>
          </div>
          <ul class="space-y-3 mb-8 text-gray-300 text-sm">
            <li class="flex items-center gap-2">✓ 5 VIP passes</li>
            <li class="flex items-center gap-2">✓ Private meeting room</li>
            <li class="flex items-center gap-2">✓ Team photo op</li>
            <li class="flex items-center gap-2">✓ Dedicated concierge</li>
          </ul>
          <button class="w-full py-3 border border-purple-500 text-purple-400 rounded-xl hover:bg-purple-500/10 transition">Select</button>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-12 px-4 border-t border-gray-800">
    <div class="max-w-7xl mx-auto text-center">
      <p class="text-gray-500">© 2024 TechConf. All rights reserved.</p>
    </div>
  </footer>

  <script>
    // Countdown Timer
    function updateCountdown() {
      const eventDate = new Date('2024-03-15T09:00:00').getTime();
      const now = new Date().getTime();
      const diff = eventDate - now;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      document.getElementById('days').textContent = days > 0 ? days : '0';
      document.getElementById('hours').textContent = hours > 0 ? hours : '0';
      document.getElementById('minutes').textContent = minutes > 0 ? minutes : '0';
      document.getElementById('seconds').textContent = seconds > 0 ? seconds : '0';
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();
  </script>
</body>
</html>`,
      'style.css': `html { scroll-behavior: smooth; }`,
      'script.js': `console.log('🎫 TechConf 2024');`,
    },
  },

  // ==================== DIGITAL BUSINESS CARD ====================
  {
    id: 'digital-card',
    name: 'Digital Business Card',
    description: 'Modern digital visiting card with contact info, social links, and vCard download',
    icon: '📇',
    category: 'business',
    features: ['Profile Photo', 'Contact Info', 'Social Links', 'vCard Download', 'QR Code', 'Dark/Light Theme'],
    techStack: ['HTML', 'Tailwind CSS', 'JavaScript'],
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alex Johnson - Digital Card</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
  <div class="w-full max-w-md">
    <!-- Card -->
    <div class="bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center relative">
        <div class="w-28 h-28 mx-auto rounded-full border-4 border-white shadow-lg overflow-hidden bg-white flex items-center justify-center text-6xl">
          👨‍💼
        </div>
        <h1 class="text-2xl font-bold text-white mt-4">Alex Johnson</h1>
        <p class="text-purple-200">Senior Product Designer</p>
        <p class="text-purple-300 text-sm mt-1">TechCorp Inc.</p>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-4 -mt-6 relative z-10 px-4">
        <a href="tel:+1234567890" class="bg-white rounded-xl shadow-lg p-4 text-center hover:scale-105 transition mx-1">
          <span class="text-2xl">📞</span>
          <p class="text-xs text-gray-600 mt-1">Call</p>
        </a>
        <a href="mailto:alex@example.com" class="bg-white rounded-xl shadow-lg p-4 text-center hover:scale-105 transition mx-1">
          <span class="text-2xl">✉️</span>
          <p class="text-xs text-gray-600 mt-1">Email</p>
        </a>
        <a href="https://linkedin.com" target="_blank" class="bg-white rounded-xl shadow-lg p-4 text-center hover:scale-105 transition mx-1">
          <span class="text-2xl">💼</span>
          <p class="text-xs text-gray-600 mt-1">LinkedIn</p>
        </a>
        <a href="https://twitter.com" target="_blank" class="bg-white rounded-xl shadow-lg p-4 text-center hover:scale-105 transition mx-1">
          <span class="text-2xl">🐦</span>
          <p class="text-xs text-gray-600 mt-1">Twitter</p>
        </a>
      </div>

      <!-- Contact Info -->
      <div class="p-6 pt-8 space-y-4">
        <div class="flex items-center gap-4 text-white">
          <span class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">📧</span>
          <div>
            <p class="text-purple-300 text-xs">Email</p>
            <p class="font-medium">alex@example.com</p>
          </div>
        </div>
        
        <div class="flex items-center gap-4 text-white">
          <span class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">📱</span>
          <div>
            <p class="text-purple-300 text-xs">Phone</p>
            <p class="font-medium">+1 (555) 123-4567</p>
          </div>
        </div>
        
        <div class="flex items-center gap-4 text-white">
          <span class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">🌐</span>
          <div>
            <p class="text-purple-300 text-xs">Website</p>
            <p class="font-medium">www.alexjohnson.design</p>
          </div>
        </div>
        
        <div class="flex items-center gap-4 text-white">
          <span class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">📍</span>
          <div>
            <p class="text-purple-300 text-xs">Location</p>
            <p class="font-medium">San Francisco, CA</p>
          </div>
        </div>
      </div>

      <!-- Save Contact Button -->
      <div class="p-6 pt-0">
        <button onclick="downloadVCard()" class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-medium hover:opacity-90 transition flex items-center justify-center gap-2">
          <span>💾</span> Save Contact
        </button>
      </div>

      <!-- Social Links -->
      <div class="p-6 pt-0">
        <div class="flex justify-center gap-4">
          <a href="#" class="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xl hover:bg-white/20 transition">📘</a>
          <a href="#" class="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xl hover:bg-white/20 transition">📸</a>
          <a href="#" class="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xl hover:bg-white/20 transition">🎵</a>
          <a href="#" class="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xl hover:bg-white/20 transition">▶️</a>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <p class="text-center text-purple-300/50 text-sm mt-6">
      Powered by Digital Card ✨
    </p>
  </div>

  <script>
    function downloadVCard() {
      const vcard = \`BEGIN:VCARD
VERSION:3.0
FN:Alex Johnson
TITLE:Senior Product Designer
ORG:TechCorp Inc.
TEL:+15551234567
EMAIL:alex@example.com
URL:https://www.alexjohnson.design
ADR:;;San Francisco;CA;;USA
END:VCARD\`;

      const blob = new Blob([vcard], { type: 'text/vcard' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'alex-johnson.vcf';
      a.click();
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>`,
      'style.css': `/* Additional styles if needed */`,
      'script.js': `console.log('📇 Digital Card Ready!');`,
    },
  },
];

export const getPrebuiltTemplateById = (id: string): PrebuiltTemplate | undefined => {
  return PREBUILT_TEMPLATES.find(t => t.id === id);
};

export const PREBUILT_CATEGORIES = [
  { id: 'landing', name: 'Landing Pages', icon: '🚀' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'ecommerce', name: 'E-Commerce', icon: '🛒' },
  { id: 'portfolio', name: 'Portfolio', icon: '👨‍💻' },
  { id: 'education', name: 'Education', icon: '🎓' },
  { id: 'hospitality', name: 'Hospitality', icon: '🏨' },
  { id: 'events', name: 'Events', icon: '🎫' },
];
