import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Minus, Plus, ChefHat, Send, X, Star, CreditCard, Banknote, Smartphone, ShoppingBag, Volume2, VolumeX, Mic, MicOff, Clock, Award, Leaf, ArrowRight, Instagram, Facebook, Twitter, CheckCircle } from 'lucide-react';
import { MenuItem, CartItem, Order, OrderStatus } from '../types';
import { Store, geminiService } from '../services';
import { Button, Card, Badge, Modal } from '../components/Common';

// --- Context for Cart Management ---
interface CustomerProps {
  cart: CartItem[];
  addToCart: (item: MenuItem, unit: string, price: number) => void;
  removeFromCart: (itemId: string, unit: string) => void;
  updateQuantity: (itemId: string, unit: string, delta: number) => void;
  clearCart: () => void;
  setPage: (page: string) => void;
  searchQuery?: string;
}

// --- Components ---

export const HeroSection: React.FC<{onOrderNow: () => void}> = ({ onOrderNow }) => (
  // Removed bg-slate-50 to allow global gradient to show
  <div className="relative w-full min-h-[85vh] lg:min-h-[92vh] flex items-center overflow-hidden">
     {/* Texture Overlay */}
    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

    {/* Refined Liquid Background Shapes */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[900px] h-[600px] md:h-[900px] bg-gradient-to-br from-blue-300/40 to-slate-300/40 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-[80px] -z-10 animate-[spin_25s_linear_infinite] opacity-70"></div>
    <div className="absolute bottom-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-gradient-to-tr from-indigo-300/40 to-blue-300/40 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] blur-[60px] translate-y-1/3 -z-10 opacity-70"></div>

    <div className="w-full max-w-[1800px] mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center pt-10 pb-10">
      
      {/* Text Content */}
      <div className="space-y-8 lg:space-y-10 animate-in slide-in-from-left duration-700 pt-10 lg:pt-0 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/60 backdrop-blur-md rounded-full shadow-sm border border-white/80 text-slate-800 font-bold text-xs uppercase tracking-widest mb-2 group cursor-default hover:bg-white transition-colors">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_10px_#2563eb]"></div>
          <span>Next Gen Dining</span>
        </div>
        
        {/* Responsive Text Sizing */}
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-extrabold font-heading text-slate-900 leading-[1.1] lg:leading-[1] tracking-tight">
          Savor the <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-800">Extraordinary.</span>
        </h1>
        
        <p className="text-lg md:text-2xl text-slate-600 leading-relaxed max-w-xl font-light mx-auto lg:mx-0">
          Experience a symphony of flavors crafted with passion and served with intelligence. Welcome to the future of gastronomy.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 pt-4 justify-center lg:justify-start">
          <Button onClick={onOrderNow} className="!px-10 md:!px-12 !py-5 md:!py-6 !text-lg md:!text-xl !rounded-2xl shadow-blue-400/40 shadow-2xl hover:shadow-3xl hover:-translate-y-1 bg-slate-900 text-white transition-all duration-300">
            Start Your Order
          </Button>
          <Button variant="secondary" className="!px-10 md:!px-12 !py-5 md:!py-6 !text-lg md:!text-xl !rounded-2xl border-2 border-white hover:border-blue-200 bg-white/60 backdrop-blur-sm shadow-lg hover:bg-white">
            View Menu
          </Button>
        </div>

        <div className="flex items-center justify-center lg:justify-start gap-6 md:gap-10 pt-8 border-t border-slate-200/50">
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-bold text-slate-900">30m</span>
            <span className="text-slate-500 text-xs md:text-sm font-medium uppercase tracking-wider">Fast Delivery</span>
          </div>
          <div className="w-px h-10 bg-slate-300"></div>
          <div className="flex flex-col">
             <span className="text-2xl md:text-3xl font-bold text-slate-900">50+</span>
             <span className="text-slate-500 text-xs md:text-sm font-medium uppercase tracking-wider">Exotic Dishes</span>
          </div>
           <div className="w-px h-10 bg-slate-300"></div>
          <div className="flex flex-col">
             <span className="text-2xl md:text-3xl font-bold text-slate-900">4.9</span>
             <span className="text-slate-500 text-xs md:text-sm font-medium uppercase tracking-wider">Star Rating</span>
          </div>
        </div>
      </div>

      {/* Hero Image / Graphic - Hidden on small mobile to save space, visible on large */}
      <div className="relative animate-in slide-in-from-right duration-700 delay-100 hidden lg:flex h-full min-h-[600px] items-center justify-center">
        <div className="relative w-full aspect-square max-w-[700px] perspective-1000">
           {/* Abstract decorative elements */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-tr from-blue-100/50 to-transparent rounded-full blur-3xl -z-10"></div>
           
           <div className="absolute top-0 right-0 animate-float-slow">
              <img src="https://cdn-icons-png.flaticon.com/512/706/706164.png" className="w-24 h-24 opacity-80 drop-shadow-xl rotate-12" alt="Leaf" />
           </div>
            <div className="absolute bottom-10 left-10 animate-float-delayed">
              <img src="https://cdn-icons-png.flaticon.com/512/1155/1155253.png" className="w-20 h-20 opacity-60 drop-shadow-xl -rotate-12" alt="Tomato" />
           </div>

          {/* Main Dish Image */}
          <div className="relative z-10 p-4 group">
             <div className="absolute inset-0 bg-slate-900 rounded-full scale-[0.85] blur-2xl opacity-20 translate-y-10 group-hover:scale-[0.9] transition-transform duration-700"></div>
            <img 
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80" 
              alt="Delicious Pizza" 
              className="w-full h-full object-cover rounded-full shadow-[0_35px_60px_-15px_rgba(71,85,105,0.3)] group-hover:scale-105 transition-transform duration-700 border-[12px] border-white/80 ring-1 ring-slate-200"
            />
          </div>
          
          {/* Badge */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-12 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/60 z-20 animate-bounce delay-1000 max-w-[200px]">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-amber-500 mb-1">
                 <Star className="w-5 h-5 fill-amber-500" />
                 <Star className="w-5 h-5 fill-amber-500" />
                 <Star className="w-5 h-5 fill-amber-500" />
                 <Star className="w-5 h-5 fill-amber-500" />
                 <Star className="w-5 h-5 fill-amber-500" />
              </div>
              <p className="font-bold text-slate-800 text-lg leading-tight">"Best Pizza in Town!"</p>
              <p className="text-xs text-slate-500 font-medium">— Foodie Mag</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const PromoBanner: React.FC<{onOrder: () => void}> = ({ onOrder }) => (
  <div className="w-full max-w-[1800px] mx-auto px-4 md:px-12 py-12 md:py-16">
    <div 
      className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden min-h-[400px] md:min-h-[450px] flex items-center shadow-2xl group cursor-pointer transition-all duration-500 hover:shadow-slate-400/30 ring-1 ring-slate-200" 
      onClick={onOrder}
    >
      <div className="absolute inset-0 bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1800&q=80" 
          className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105 group-hover:opacity-50" 
          alt="Special Offer" 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
      
      <div className="relative z-10 p-8 md:p-24 max-w-3xl animate-in slide-in-from-left duration-700">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 bg-amber-400 text-slate-900 font-extrabold uppercase tracking-widest rounded-full text-xs md:text-sm mb-6 md:mb-8 shadow-lg shadow-amber-400/20 animate-pulse">
           <Award className="w-3 h-3 md:w-4 md:h-4" /> Limited Time Offer
        </span>
        <h2 className="text-4xl md:text-7xl font-extrabold text-white font-heading mb-6 md:mb-8 leading-tight drop-shadow-sm">
          The Grand <span className="text-amber-400">Feast</span> <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">20% OFF Today.</span>
        </h2>
        <p className="text-slate-300 text-lg md:text-xl mb-8 md:mb-10 leading-relaxed max-w-xl font-light">
          Experience the royal flavors of our signature gourmet thali. A perfect blend of tradition and taste, now at an unbeatable price.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="!bg-white !text-slate-900 !px-8 md:!px-10 !py-4 md:!py-5 text-base md:text-lg font-bold hover:!bg-blue-50 transition-colors shadow-xl w-full sm:w-auto">
            Claim Offer
          </Button>
          <Button variant="ghost" className="!text-white border border-white/30 hover:bg-white/10 !px-8 md:!px-10 !py-4 md:!py-5 text-base md:text-lg w-full sm:w-auto">
            View Details
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <ChefHat className="w-8 h-8 md:w-10 md:h-10 text-slate-800" />,
      title: "Master Chefs",
      desc: "Our culinary experts have decades of experience in crafting the perfect dishes that delight your senses.",
      bg: "bg-blue-50"
    },
    {
      icon: <Leaf className="w-8 h-8 md:w-10 md:h-10 text-emerald-600" />,
      title: "100% Organic",
      desc: "We source our ingredients daily from certified local organic farmers to ensure maximum freshness and health.",
      bg: "bg-emerald-50"
    },
    {
      icon: <Clock className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" />,
      title: "30 Min Delivery",
      desc: "Hungry? We promise hot and fresh food delivered to your doorstep within 30 minutes, or it's free.",
      bg: "bg-indigo-50"
    }
  ];

  return (
    <div className="py-16 md:py-24 relative overflow-hidden">
      <div className="w-full max-w-[1800px] mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-slate-900">Why We Are The Best</h2>
          <div className="w-20 h-1.5 bg-blue-500 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-500 text-lg md:text-xl font-light">We don't just cook food, we create unforgettable culinary experiences.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {features.map((f, i) => (
            <div key={i} className="group p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-white/80 backdrop-blur-sm border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(59,130,246,0.1)] hover:-translate-y-2 transition-all duration-500">
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl ${f.bg} flex items-center justify-center mb-8 md:mb-10 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold font-heading mb-4 text-slate-900">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed font-light text-base md:text-lg">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const GallerySection: React.FC = () => {
  const images = [
    { src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80", title: "Grilled Delights" },
    { src: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80", title: "Fresh Salads" },
    { src: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80", title: "Sweet Desserts" },
    { src: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80", title: "Morning Toast" }
  ];

  return (
    // Changed bg-white/40 to transparent/very light to blend with global gradient
    <div className="py-24 bg-white/10 backdrop-blur-[2px] border-t border-white/20">
       <div className="w-full max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row gap-8 items-end mb-16">
             <div className="flex-1">
               <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Our Gallery</span>
               <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 mb-4">Culinary Artistry</h2>
               <p className="text-slate-500 text-lg max-w-lg">A visual journey through our kitchen's finest creations, prepared with love and precision.</p>
             </div>
             <Button variant="ghost" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-full border border-slate-200">
               Follow on Instagram <Instagram className="w-5 h-5 ml-2" />
             </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {images.map((img, i) => (
               <div key={i} className={`rounded-[2.5rem] overflow-hidden shadow-lg h-80 md:h-96 relative group cursor-pointer ${i % 2 !== 0 ? 'md:translate-y-12' : ''}`}>
                 <img src={img.src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={img.title} />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                 <div className="absolute bottom-6 left-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-white font-bold text-xl font-heading">{img.title}</p>
                    <p className="text-slate-300 text-sm">View Dish</p>
                 </div>
               </div>
             ))}
          </div>
          <div className="h-10 md:h-0"></div> {/* Spacer for offset grid mobile fix */}
       </div>
    </div>
  )
}

export const FeedbackSection: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return; // Require rating
    setIsSubmitted(true);
    // In a real app, send to backend here
    setTimeout(() => {
       setIsSubmitted(false);
       setRating(0);
       setName('');
       setFeedback('');
    }, 3000); // Reset after 3 seconds
  };

  return (
    <div className="py-24 relative overflow-hidden border-t border-white/20" id="feedback-section">
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
         <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Side: Text & Call to Action */}
            <div className="text-left">
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Your Opinion Matters</span>
              <h2 className="text-4xl md:text-6xl font-bold font-heading text-slate-900 mb-6 leading-tight">
                Tell us about your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Experience</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8 font-light">
                Did you enjoy the food? How was the service? Your feedback helps us create better dining experiences for everyone.
              </p>
              
              {/* Decorative Stats */}
              <div className="flex gap-8 border-t border-slate-200 pt-8">
                 <div>
                    <span className="text-3xl font-bold text-slate-800">4.9</span>
                    <div className="flex text-amber-400 text-sm mt-1">
                       {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-1">Average Rating</p>
                 </div>
                 <div className="w-px bg-slate-200 h-12"></div>
                 <div>
                    <span className="text-3xl font-bold text-slate-800">2k+</span>
                    <p className="text-sm text-slate-500 mt-1">Happy Customers</p>
                 </div>
              </div>
            </div>

            {/* Right Side: Interactive Form */}
            <div className="relative">
               {/* Decorative elements behind form */}
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400 rounded-full blur-3xl opacity-20"></div>

               <div className="bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/60 relative">
                  {isSubmitted ? (
                    <div className="absolute inset-0 z-10 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center rounded-[2.5rem] animate-in fade-in zoom-in duration-300 p-8 text-center">
                       <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-50">
                          <CheckCircle className="w-10 h-10" />
                       </div>
                       <h3 className="text-2xl font-bold text-slate-800 font-heading mb-2">Thank You!</h3>
                       <p className="text-slate-500">Your feedback has been submitted successfully.</p>
                    </div>
                  ) : null}

                  <form onSubmit={handleSubmit} className="space-y-6">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-4 ml-1">Rate your experience</label>
                        <div className="flex gap-2">
                           {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                 key={star}
                                 type="button"
                                 className="transition-transform hover:scale-110 focus:outline-none"
                                 onMouseEnter={() => setHoverRating(star)}
                                 onMouseLeave={() => setHoverRating(0)}
                                 onClick={() => setRating(star)}
                              >
                                 <Star 
                                   className={`w-10 h-10 transition-colors duration-200 ${
                                      star <= (hoverRating || rating) 
                                      ? 'fill-amber-400 text-amber-400 drop-shadow-sm' 
                                      : 'fill-slate-100 text-slate-300'
                                   }`} 
                                 />
                              </button>
                           ))}
                        </div>
                        {rating > 0 && (
                          <p className="text-amber-500 text-xs font-bold mt-2 ml-1 animate-in fade-in">
                            {['Terrible', 'Bad', 'Okay', 'Good', 'Excellent'][rating - 1]}
                          </p>
                        )}
                     </div>

                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Your Name (Optional)</label>
                        <input 
                           type="text" 
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           className="w-full p-4 border border-slate-200 rounded-2xl bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                           placeholder="John Doe"
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Your Feedback</label>
                        <textarea 
                           required
                           value={feedback}
                           onChange={(e) => setFeedback(e.target.value)}
                           rows={4}
                           className="w-full p-4 border border-slate-200 rounded-2xl bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 resize-none"
                           placeholder="Tell us what you liked or how we can improve..."
                        />
                     </div>

                     <Button type="submit" className="w-full py-4 text-lg shadow-blue-200/50 shadow-lg" disabled={rating === 0}>
                        Submit Review
                     </Button>
                  </form>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export const MenuPage: React.FC<CustomerProps> = ({ addToCart, searchQuery = '' }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>([]);
  
  // Selection State
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);

  useEffect(() => {
    const loadedMenu = Store.getMenu();
    setMenu(loadedMenu);
    
    // Dynamically extract categories from the loaded menu
    const uniqueCategories = Array.from(new Set(loadedMenu.map(item => item.category)));
    setCategories(['All', ...uniqueCategories]);
  }, []);

  // Reset category to 'All' when search query is active
  useEffect(() => {
    if (searchQuery) {
      setActiveCategory('All');
    }
  }, [searchQuery]);

  const filteredMenu = menu.filter(item => {
    // 1. Category check
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    
    if (!searchQuery) return matchesCategory;

    // 2. Search Logic
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    // Combine searchable fields
    const name = item.name.toLowerCase();
    const desc = item.description.toLowerCase();
    const cat = item.category.toLowerCase();
    
    // Split query into terms and require ALL terms to match
    const queryTerms = query.split(/\s+/).filter(Boolean);

    const matchesSearch = queryTerms.every(term => {
      // Check strict substring match (name, description, or category)
      // This solves the "Biriyani" -> "Butter Chicken" false positive by removing the aggressive fuzzy regex
      return name.includes(term) || desc.includes(term) || cat.includes(term);
    });

    return matchesCategory && matchesSearch;
  });

  // Helper to determine variants based on category
  const getVariants = (item: MenuItem) => {
    const cat = item.category.toLowerCase();
    
    if (cat.includes('drink') || cat.includes('beverage')) {
      return [
        { label: '250ml', multiplier: 1 },
        { label: '500ml', multiplier: 2 },
        { label: '750ml', multiplier: 3 },
        { label: '1000ml', multiplier: 4 },
      ];
    } else if (cat.includes('dessert') || cat.includes('ice cream')) {
      return [
        { label: '1 Scoop/Pc', multiplier: 1 },
        { label: '2 Scoops/Pcs', multiplier: 2 },
        { label: '3 Scoops/Pcs', multiplier: 3 },
      ];
    } else if (cat.includes('starter') || cat.includes('main')) {
       // Assuming Standard is ~250g portion
      return [
        { label: 'Standard (Plate)', multiplier: 1 },
        { label: '250g', multiplier: 1 },
        { label: '500g', multiplier: 2 },
        { label: '1kg', multiplier: 4 },
      ];
    }
    
    // Default
    return [{ label: 'Standard', multiplier: 1 }];
  };

  const handleOpenSelection = (item: MenuItem) => {
    setSelectedItem(item);
    setIsSelectionOpen(true);
  };

  return (
    <div className="p-6 w-full max-w-[1800px] mx-auto min-h-screen">
      <div className="flex flex-wrap gap-4 mb-10 justify-center sticky top-24 z-30 py-6 bg-transparent">
        <div className="bg-white/90 backdrop-blur-xl p-2 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-white/50 flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 md:px-8 py-2 md:py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-slate-800 text-white shadow-lg shadow-slate-300/50' 
                  : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Swipable Menu Container */}
      <div className="flex overflow-x-auto gap-6 md:gap-10 pb-16 px-4 md:px-6 -mx-4 md:-mx-6 snap-x snap-mandatory no-scrollbar pt-4">
        {filteredMenu.length === 0 ? (
           <div className="w-full text-center py-20 text-slate-600">
             <p className="text-lg font-medium bg-white/50 inline-block px-8 py-4 rounded-2xl shadow-sm border border-white">
               {searchQuery ? `No items found matching "${searchQuery}".` : 'No items found in this category.'}
             </p>
           </div>
        ) : (
          filteredMenu.map(item => (
            <div key={item.id} className="min-w-[300px] md:min-w-[380px] snap-center h-full hover:shadow-[0_25px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 group bg-white/70 backdrop-blur-sm border border-white/60 rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-2xl rounded-bl-2xl overflow-visible flex flex-col">
              <div className="h-56 md:h-64 overflow-hidden relative rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-xl rounded-bl-xl mx-3 mt-3 shadow-sm bg-slate-100">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-lg font-bold text-slate-800 shadow-xl border border-white/50">
                  ₹{item.price}
                </div>
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col bg-transparent">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 font-heading group-hover:text-blue-600 transition-colors">{item.name}</h3>
                </div>
                <p className="text-slate-600 text-sm mb-6 md:mb-8 flex-1 leading-loose font-normal">{item.description}</p>
                <Button onClick={() => handleOpenSelection(item)} className="w-full mt-auto py-3 md:py-4 text-base shadow-slate-300/50 rounded-xl bg-slate-800 hover:bg-slate-900 text-white">
                  Add to Cart
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Variant Selection Modal */}
      {selectedItem && (
        <Modal 
          isOpen={isSelectionOpen} 
          onClose={() => setIsSelectionOpen(false)} 
          title={`Select Size: ${selectedItem.name}`}
        >
          <div className="space-y-4">
             <p className="text-slate-500 mb-6 leading-relaxed text-sm">{selectedItem.description}</p>
             <div className="grid grid-cols-1 gap-3">
               {getVariants(selectedItem).map((variant, idx) => (
                 <button 
                    key={idx}
                    onClick={() => {
                      addToCart(selectedItem, variant.label, selectedItem.price * variant.multiplier);
                      setIsSelectionOpen(false);
                    }}
                    className="flex justify-between items-center p-5 border border-slate-100 rounded-2xl hover:border-blue-400 hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-100/50 transition-all text-left group bg-white shadow-sm"
                 >
                   <span className="font-semibold text-slate-700 group-hover:text-blue-700 text-lg font-heading">{variant.label}</span>
                   <span className="font-bold text-slate-900 text-lg">₹{selectedItem.price * variant.multiplier}</span>
                 </button>
               ))}
             </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export const CartDrawer: React.FC<CustomerProps & { isOpen: boolean; onClose: () => void }> = ({ 
  cart, updateQuantity, removeFromCart, isOpen, onClose, setPage 
}) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-md bg-white/95 backdrop-blur-xl h-full shadow-2xl p-8 flex flex-col animate-in slide-in-from-right duration-300 rounded-tl-[3rem] rounded-bl-[3rem] border-l border-white/60"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3 font-heading">
            <ShoppingCart className="w-8 h-8 text-slate-700" /> Your Order
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {cart.length === 0 ? (
            <div className="text-center text-slate-400 py-20 flex flex-col items-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <ShoppingCart className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-lg font-medium text-slate-500">Your cart is currently empty.</p>
              <Button onClick={onClose} variant="ghost" className="mt-6 text-blue-600 hover:bg-blue-50 font-semibold">Browse Our Menu</Button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.id}-${item.selectedUnit}-${idx}`} className="flex gap-5 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-2xl shadow-sm bg-slate-100" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 font-heading leading-tight">{item.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium bg-slate-50 px-2 py-1 rounded-full inline-block border border-slate-100">{item.selectedUnit}</p>
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1 border border-slate-200">
                      <button 
                        onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.selectedUnit, -1) : removeFromCart(item.id, item.selectedUnit)}
                        className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors shadow-sm"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold w-6 text-center text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.selectedUnit, 1)}
                        className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="font-bold text-slate-800 text-lg">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="bg-slate-50 p-6 rounded-[2rem] mt-4 border border-slate-200">
            <div className="flex justify-between items-center text-lg mb-6">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="font-bold text-2xl text-slate-900">₹{total}</span>
            </div>
            <Button onClick={() => setPage('checkout')} className="w-full py-4 text-lg shadow-slate-300 shadow-lg rounded-xl">
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export const CheckoutPage: React.FC<Pick<CustomerProps, 'cart' | 'clearCart' | 'setPage'>> = ({ cart, clearCart, setPage }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', payment: 'UPI' as 'UPI' | 'Card' | 'Cash' });
  const [isProcessing, setIsProcessing] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate Payment Processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      customerName: formData.name,
      customerPhone: formData.phone,
      items: cart,
      total: total,
      status: OrderStatus.PENDING,
      timestamp: Date.now(),
      paymentMethod: formData.payment
    };

    Store.placeOrder(newOrder);
    clearCart();
    setPage('success');
    setIsProcessing(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 animate-in slide-in-from-bottom-5 duration-500">
      <h2 className="text-4xl font-bold mb-10 font-heading text-slate-800 text-center">Finalize Order</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-8 h-fit">
          <h3 className="font-bold mb-6 text-xl text-slate-800 flex items-center gap-2 font-heading">
            <ShoppingBag className="w-6 h-6 text-blue-500" /> Order Summary
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                <div>
                  <div className="font-semibold text-slate-900 font-heading">{item.name}</div>
                  <div className="text-xs text-slate-500 font-medium">{item.quantity} x {item.selectedUnit}</div>
                </div>
                <div className="font-bold text-slate-700">₹{item.price * item.quantity}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 pt-6 border-t border-slate-200">
            <span className="font-bold text-lg text-slate-500">Total Amount</span>
            <span className="font-bold text-3xl text-slate-900">₹{total}</span>
          </div>
        </Card>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2 ml-1">Full Name</label>
              <input 
                required 
                type="text" 
                className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2 ml-1">Phone Number</label>
              <input 
                required 
                type="tel" 
                className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                placeholder="+91 98765 43210"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-3 ml-1">Payment Method</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'UPI', icon: Smartphone, label: 'UPI' },
                  { id: 'Card', icon: CreditCard, label: 'Card' },
                  { id: 'Cash', icon: Banknote, label: 'Cash' }
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setFormData({...formData, payment: method.id as any})}
                    className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all duration-300 ${
                      formData.payment === method.id 
                        ? 'bg-slate-800 text-white border-slate-800 shadow-xl shadow-slate-300 transform scale-105' 
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600'
                    }`}
                  >
                    <method.icon className="w-6 h-6" />
                    <span className="text-xs font-bold uppercase tracking-wider">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" isLoading={isProcessing} className="w-full py-5 text-lg mt-6 shadow-slate-300/50 shadow-lg rounded-xl">
              Pay ₹{total} & Place Order
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export const AIWaiter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Stop speaking and listening when the chat is closed
  useEffect(() => {
    if (!isOpen) {
      window.speechSynthesis.cancel();
      if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
      }
    }
  }, [isOpen]);

  // Setup Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
        
        recognitionRef.current.onerror = (event: any) => {
           console.error("Speech Recognition Error", event.error);
           setIsListening(false);
        };
      }
    }
  }, []);

  const speak = (text: string) => {
    if (isMuted) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    
    window.speechSynthesis.cancel();
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const currentMenu = Store.getMenu();
    const response = await geminiService.chatWithChef(userMsg, currentMenu);

    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
    speak(response);
  };

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    if (newState) {
      window.speechSynthesis.cancel();
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInput(''); // Clear input for fresh speech
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 p-5 bg-slate-900 text-white rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:scale-110 transition-all z-40 group border-4 border-white/20 backdrop-blur-sm"
      >
        <ChefHat className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        <span className="absolute top-1 right-1 w-4 h-4 bg-blue-400 rounded-full border-2 border-slate-900"></span>
      </button>

      {isOpen && (
        <div className="fixed bottom-28 right-8 w-96 h-[600px] bg-white rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden z-40 animate-in slide-in-from-bottom-10 fade-in duration-300 border border-white/60 ring-1 ring-slate-200">
          <div className="p-6 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm shadow-inner border border-white/10">
                <ChefHat className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-xl font-heading">Chef Pierre</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 font-medium"><span className="w-2 h-2 bg-blue-400 rounded-full inline-block animate-pulse shadow-[0_0_10px_#60a5fa]"></span> Online Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1 relative z-10">
              <button 
                onClick={toggleMute} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/90 hover:text-white"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6" /></button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50" ref={scrollRef}>
             {messages.length === 0 && (
               <div className="text-center text-slate-400 mt-20 flex flex-col items-center">
                 <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 border border-slate-100">
                    <span className="text-4xl">👨‍🍳</span>
                 </div>
                 <p className="text-slate-800 font-bold text-lg">Bonjour!</p>
                 <p className="text-sm mt-1">I am Chef Pierre. How can I help you dine today?</p>
               </div>
             )}
             {messages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                   m.role === 'user' 
                     ? 'bg-slate-800 text-white rounded-br-none shadow-slate-200' 
                     : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'
                 }`}>
                   {m.text}
                 </div>
               </div>
             ))}
             {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 flex gap-1.5">
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                 </div>
               </div>
             )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2 relative items-center">
              <button
                onClick={toggleListening}
                className={`p-3 rounded-xl transition-all flex items-center justify-center shrink-0 ${
                  isListening 
                    ? 'bg-red-100 text-red-600 animate-pulse ring-2 ring-red-200' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                }`}
                title={isListening ? "Stop Listening" : "Speak to Chef"}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <input 
                type="text" 
                className="flex-1 p-4 pr-14 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-500 outline-none text-sm bg-slate-50 focus:bg-white transition-all shadow-inner"
                placeholder="Ask for suggestions..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-slate-800 text-white rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};