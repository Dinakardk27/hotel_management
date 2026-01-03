import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Minus, Plus, ChefHat, Send, X, Star, CreditCard, Banknote, Smartphone, ShoppingBag, Volume2, VolumeX, Mic, MicOff, Clock, Award, Leaf, ArrowRight, Instagram, Facebook, Twitter, CheckCircle as CircleIcon } from 'lucide-react';
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

// Helper for local check icon to prevent import issues
const SuccessCheck = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// --- Components ---

export const HeroSection: React.FC<{onOrderNow: () => void}> = ({ onOrderNow }) => (
  <div className="relative w-full min-h-[85vh] lg:min-h-[92vh] flex items-center overflow-hidden">
    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[900px] h-[600px] md:h-[900px] bg-gradient-to-br from-blue-300/40 to-slate-300/40 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-[80px] -z-10 animate-[spin_25s_linear_infinite] opacity-70"></div>
    <div className="absolute bottom-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-gradient-to-tr from-indigo-300/40 to-blue-300/40 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] blur-[60px] translate-y-1/3 -z-10 opacity-70"></div>

    <div className="w-full max-w-[1800px] mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center pt-10 pb-10">
      <div className="space-y-8 lg:space-y-10 animate-in slide-in-from-left duration-700 pt-10 lg:pt-0 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/60 backdrop-blur-md rounded-full shadow-sm border border-white/80 text-slate-800 font-bold text-xs uppercase tracking-widest mb-2 group cursor-default hover:bg-white transition-colors">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_10px_#2563eb]"></div>
          <span>Next Gen Dining</span>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-extrabold font-heading text-slate-900 leading-[1.1] lg:leading-[1] tracking-tight">
          Savor the <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-800">Extraordinary.</span>
        </h1>
        <p className="text-lg md:text-2xl text-slate-600 leading-relaxed max-w-xl font-light mx-auto lg:mx-0">
          Experience a symphony of flavors crafted with passion and served with intelligence.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 pt-4 justify-center lg:justify-start">
          <Button onClick={onOrderNow} className="!px-10 md:!px-12 !py-5 md:!py-6 !text-lg md:!text-xl !rounded-2xl shadow-blue-400/40 shadow-2xl hover:shadow-3xl hover:-translate-y-1 bg-slate-900 text-white transition-all duration-300">
            Start Your Order
          </Button>
          <Button variant="secondary" className="!px-10 md:!px-12 !py-5 md:!py-6 !text-lg md:!text-xl !rounded-2xl border-2 border-white hover:border-blue-200 bg-white/60 backdrop-blur-sm shadow-lg hover:bg-white">
            View Menu
          </Button>
        </div>
      </div>
      <div className="relative animate-in slide-in-from-right duration-700 delay-100 hidden lg:flex h-full min-h-[600px] items-center justify-center">
        <div className="relative w-full aspect-square max-w-[700px] perspective-1000">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-tr from-blue-100/50 to-transparent rounded-full blur-3xl -z-10"></div>
          <div className="relative z-10 p-4 group">
            <img 
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80" 
              alt="Delicious Pizza" 
              className="w-full h-full object-cover rounded-full shadow-[0_35px_60px_-15px_rgba(71,85,105,0.3)] group-hover:scale-105 transition-transform duration-700 border-[12px] border-white/80 ring-1 ring-slate-200"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const PromoBanner: React.FC<{onOrder: () => void}> = ({ onOrder }) => (
  <div className="w-full max-w-[1800px] mx-auto px-4 md:px-12 py-12 md:py-16">
    <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden min-h-[400px] flex items-center shadow-2xl group cursor-pointer transition-all duration-500 hover:shadow-slate-400/30 ring-1 ring-slate-200" onClick={onOrder}>
      <div className="absolute inset-0 bg-slate-900">
        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1800&q=80" className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105" alt="Offer" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
      <div className="relative z-10 p-8 md:p-24 max-w-3xl animate-in slide-in-from-left duration-700">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400 text-slate-900 font-extrabold uppercase tracking-widest rounded-full text-xs mb-6 shadow-lg">
           <Award className="w-4 h-4" /> Limited Time Offer
        </span>
        <h2 className="text-4xl md:text-7xl font-extrabold text-white font-heading mb-6 leading-tight">
          The Grand <span className="text-amber-400">Feast</span> <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">20% OFF Today.</span>
        </h2>
        <Button className="!bg-white !text-slate-900 !px-8 !py-4 text-lg font-bold">Claim Offer</Button>
      </div>
    </div>
  </div>
);

export const FeedbackSection: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setIsSubmitting(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1000));
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Reset after showing success
    setTimeout(() => {
       setIsSubmitted(false);
       setRating(0);
       setName('');
       setFeedback('');
    }, 4000);
  };

  return (
    <div className="py-24 relative overflow-hidden border-t border-white/20" id="feedback-section">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
         <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-left space-y-6">
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm block">Voice of the Customer</span>
              <h2 className="text-4xl md:text-6xl font-extrabold font-heading text-slate-900 leading-tight">
                Help us shape the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Future of Dining.</span>
              </h2>
              <p className="text-slate-600 text-xl leading-relaxed font-light max-w-lg">
                Your feedback is the most important ingredient in our recipe for success. Rate your experience and leave a suggestion.
              </p>
              
              <div className="flex gap-10 pt-6 border-t border-slate-200">
                 <div className="space-y-1">
                    <span className="text-4xl font-bold text-slate-800">4.9/5</span>
                    <div className="flex text-amber-400 text-sm">
                       {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                    </div>
                    <p className="text-sm text-slate-400 font-medium">Community Rating</p>
                 </div>
                 <div className="space-y-1">
                    <span className="text-4xl font-bold text-slate-800">98%</span>
                    <p className="text-sm text-slate-500 font-medium pt-2">Satisfaction Rate</p>
                 </div>
              </div>
            </div>

            <div className="relative">
               <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
               <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl"></div>

               <div className="bg-white/70 backdrop-blur-2xl p-8 md:p-12 rounded-[3rem] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.1)] border border-white relative overflow-hidden ring-1 ring-slate-200">
                  {isSubmitted ? (
                    <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 p-10 text-center">
                       <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-50">
                          <SuccessCheck className="w-12 h-12" />
                       </div>
                       <h3 className="text-3xl font-bold text-slate-900 font-heading mb-3">Merci Beaucoup!</h3>
                       <p className="text-slate-500 text-lg leading-relaxed">Your feedback has been received and helps us immensely.</p>
                       <Button onClick={() => setIsSubmitted(false)} variant="ghost" className="mt-8">Close</Button>
                    </div>
                  ) : null}

                  <form onSubmit={handleSubmit} className="space-y-8">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Rate Your Experience</label>
                        <div className="flex gap-3">
                           {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                 key={star}
                                 type="button"
                                 className="transition-all hover:scale-125 focus:outline-none"
                                 onMouseEnter={() => setHoverRating(star)}
                                 onMouseLeave={() => setHoverRating(0)}
                                 onClick={() => setRating(star)}
                              >
                                 <Star 
                                   className={`w-12 h-12 transition-all duration-300 ${
                                      star <= (hoverRating || rating) 
                                      ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]' 
                                      : 'fill-slate-100 text-slate-200'
                                   }`} 
                                 />
                              </button>
                           ))}
                        </div>
                        {rating > 0 && (
                          <p className="text-blue-600 text-sm font-bold mt-4 animate-in slide-in-from-left-2">
                            {['Not satisfied', 'Could be better', 'Enjoyed it', 'Highly recommend', 'Exceptional!'][rating - 1]}
                          </p>
                        )}
                     </div>

                     <div className="space-y-6">
                        <div className="group">
                           <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Your Name</label>
                           <input 
                              type="text" 
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full p-5 border border-slate-200 rounded-[1.5rem] bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                              placeholder="Enter your name..."
                           />
                        </div>

                        <div className="group">
                           <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Message</label>
                           <textarea 
                              required
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              rows={4}
                              className="w-full p-5 border border-slate-200 rounded-[1.5rem] bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 resize-none font-medium"
                              placeholder="Share your thoughts with Chef Pierre..."
                           />
                        </div>
                     </div>

                     <Button 
                      type="submit" 
                      isLoading={isSubmitting} 
                      className="w-full py-5 text-xl rounded-2xl shadow-blue-500/20 shadow-2xl bg-slate-900 text-white hover:bg-black"
                      disabled={rating === 0}
                     >
                        {rating === 0 ? 'Select a Rating' : 'Submit My Review'}
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
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);

  useEffect(() => {
    const loadedMenu = Store.getMenu();
    setMenu(loadedMenu);
    const uniqueCategories = Array.from(new Set(loadedMenu.map(item => item.category)));
    setCategories(['All', ...uniqueCategories]);
  }, []);

  useEffect(() => {
    if (searchQuery) setActiveCategory('All');
  }, [searchQuery]);

  const filteredMenu = menu.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    if (!searchQuery) return matchesCategory;
    const query = searchQuery.toLowerCase().trim();
    return matchesCategory && (item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query));
  });

  const getVariants = (item: MenuItem) => {
    const cat = item.category.toLowerCase();
    if (cat.includes('drink')) return [{ label: 'Small', multiplier: 0.8 }, { label: 'Regular', multiplier: 1 }, { label: 'Large', multiplier: 1.4 }];
    return [{ label: 'Standard', multiplier: 1 }, { label: 'Large Portion', multiplier: 1.6 }];
  };

  return (
    <div className="p-6 w-full max-w-[1800px] mx-auto min-h-screen">
      <div className="flex flex-wrap gap-4 mb-10 justify-center sticky top-24 z-30 py-6">
        <div className="bg-white/90 backdrop-blur-xl p-2 rounded-full shadow-lg border border-white/50 flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex overflow-x-auto gap-10 pb-16 px-6 -mx-6 snap-x snap-mandatory no-scrollbar">
        {filteredMenu.map(item => (
          <div key={item.id} className="min-w-[340px] md:min-w-[420px] snap-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group bg-white/70 backdrop-blur-sm border border-white rounded-[3rem] overflow-hidden">
            <div className="h-64 overflow-hidden relative m-4 rounded-[2.5rem]">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full font-bold text-slate-800 shadow-lg">₹{item.price}</div>
            </div>
            <div className="p-8 space-y-4">
              <h3 className="text-2xl font-bold text-slate-800 font-heading">{item.name}</h3>
              <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">{item.description}</p>
              <Button onClick={() => { setSelectedItem(item); setIsSelectionOpen(true); }} className="w-full py-4 text-base">Add to Cart</Button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isSelectionOpen} onClose={() => setIsSelectionOpen(false)} title={`Customize: ${selectedItem?.name}`}>
        <div className="space-y-4">
           <div className="grid gap-3">
             {selectedItem && getVariants(selectedItem).map((v, i) => (
               <button 
                  key={i}
                  onClick={() => {
                    addToCart(selectedItem, v.label, Math.round(selectedItem.price * v.multiplier));
                    setIsSelectionOpen(false);
                  }}
                  className="flex justify-between items-center p-5 border border-slate-100 rounded-2xl hover:bg-blue-50 transition-all text-left group bg-white"
               >
                 <span className="font-semibold text-slate-700">{v.label}</span>
                 <span className="font-bold text-slate-900">₹{Math.round(selectedItem.price * v.multiplier)}</span>
               </button>
             ))}
           </div>
        </div>
      </Modal>
    </div>
  );
};

export const FeaturesSection: React.FC = () => {
  const features = [
    { icon: <ChefHat className="w-10 h-10" />, title: "Master Chefs", desc: "Crafted by award-winning culinary experts.", bg: "bg-blue-50" },
    { icon: <Leaf className="w-10 h-10" />, title: "100% Organic", desc: "Ingredients sourced from local sustainable farms.", bg: "bg-emerald-50" },
    { icon: <Clock className="w-10 h-10" />, title: "30 Min Delivery", desc: "Freshness at your doorstep in record time.", bg: "bg-indigo-50" }
  ];
  return (
    <div className="py-24 w-full max-w-[1800px] mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-10">
        {features.map((f, i) => (
          <div key={i} className="p-10 rounded-[3rem] bg-white/80 border border-slate-100 shadow-sm hover:shadow-xl transition-all">
            <div className={`w-20 h-20 rounded-3xl ${f.bg} flex items-center justify-center mb-8`}>{f.icon}</div>
            <h3 className="text-2xl font-bold font-heading mb-4">{f.title}</h3>
            <p className="text-slate-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const GallerySection: React.FC = () => (
  <div className="py-24 bg-white/10 backdrop-blur-[2px] border-t border-white/20">
     <div className="w-full max-w-[1800px] mx-auto px-6">
        <h2 className="text-5xl font-bold font-heading text-slate-900 mb-16 text-center">Culinary Artistry</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[1,2,3,4].map(i => (
             <div key={i} className="rounded-[2.5rem] overflow-hidden shadow-lg h-96 relative group cursor-pointer">
               <img src={`https://images.unsplash.com/photo-${i === 1 ? '1555939594-58d7cb561ad1' : i === 2 ? '1540189549336-e6e99c3679fe' : i === 3 ? '1565958011703-44f9829ba187' : '1482049016688-2d3e1b311543'}?auto=format&fit=crop&w=800&q=80`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Gallery" />
               <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all"></div>
             </div>
           ))}
        </div>
     </div>
  </div>
);

export const CartDrawer: React.FC<CustomerProps & { isOpen: boolean; onClose: () => void }> = ({ cart, updateQuantity, removeFromCart, isOpen, onClose, setPage }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl h-full shadow-2xl p-8 flex flex-col animate-in slide-in-from-right duration-300 rounded-l-[3rem] border-l border-white" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-8 border-b pb-6">
          <h2 className="text-3xl font-bold text-slate-800 font-heading">Your Order</h2>
          <button onClick={onClose} className="p-2 hover:bg-red-50 rounded-full"><X className="w-6 h-6" /></button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-6">
          {cart.length === 0 ? <p className="text-center text-slate-400 py-20">Cart is empty.</p> : cart.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex gap-5 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-2xl" />
              <div className="flex-1 space-y-1">
                <h3 className="font-bold text-slate-800">{item.name}</h3>
                <p className="text-xs text-slate-500">{item.selectedUnit}</p>
                <div className="flex justify-between items-center pt-2">
                   <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-lg">
                      <button onClick={() => updateQuantity(item.id, item.selectedUnit, -1)}><Minus size={14} /></button>
                      <span className="font-bold text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.selectedUnit, 1)}><Plus size={14} /></button>
                   </div>
                   <span className="font-bold">₹{item.price * item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="pt-6 border-t mt-6">
            <div className="flex justify-between text-2xl font-bold mb-6"><span>Total</span><span>₹{total}</span></div>
            <Button onClick={() => setPage('checkout')} className="w-full py-5 text-xl">Proceed to Checkout</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export const CheckoutPage: React.FC<Pick<CustomerProps, 'cart' | 'clearCart' | 'setPage'>> = ({ cart, clearCart, setPage }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', payment: 'UPI' as any });
  const [isProcessing, setIsProcessing] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    Store.placeOrder({
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      customerName: formData.name,
      customerPhone: formData.phone,
      items: cart,
      total,
      status: OrderStatus.PENDING,
      timestamp: Date.now(),
      paymentMethod: formData.payment
    });
    clearCart();
    setPage('success');
  };

  return (
    <div className="max-w-4xl mx-auto p-12 animate-in fade-in duration-500">
      <h2 className="text-5xl font-bold mb-12 font-heading text-center">Complete Order</h2>
      <div className="grid md:grid-cols-2 gap-12">
        <Card className="p-8">
          <h3 className="font-bold mb-6 text-xl">Order Summary</h3>
          <div className="space-y-4">
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-600">{item.quantity}x {item.name}</span>
                <span className="font-bold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t flex justify-between text-2xl font-bold">
            <span>Total</span><span>₹{total}</span>
          </div>
        </Card>
        <Card className="p-8">
           <form onSubmit={handleSubmit} className="space-y-6">
              <input required type="text" placeholder="Full Name" className="w-full p-4 border rounded-2xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="tel" placeholder="Phone Number" className="w-full p-4 border rounded-2xl" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <div className="grid grid-cols-3 gap-3">
                {['UPI', 'Card', 'Cash'].map(m => (
                  <button key={m} type="button" onClick={() => setFormData({...formData, payment: m})} className={`p-4 rounded-xl border font-bold transition-all ${formData.payment === m ? 'bg-slate-900 text-white' : 'bg-white text-slate-400'}`}>{m}</button>
                ))}
              </div>
              <Button type="submit" isLoading={isProcessing} className="w-full py-5 text-xl">Pay & Order</Button>
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    const response = await geminiService.chatWithChef(userMsg, Store.getMenu());
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="fixed bottom-8 right-8 p-6 bg-slate-900 text-white rounded-full shadow-2xl hover:scale-110 transition-all z-40 group">
        <ChefHat className="w-10 h-10 group-hover:rotate-12 transition-transform" />
      </button>
      {isOpen && (
        <div className="fixed bottom-28 right-8 w-[420px] h-[650px] bg-white rounded-[3rem] shadow-2xl flex flex-col overflow-hidden z-40 animate-in slide-in-from-bottom-10">
          <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl"><ChefHat size={28} /></div>
              <div><h3 className="font-bold text-xl font-heading">Chef Pierre</h3><p className="text-xs text-blue-400 font-bold">Online</p></div>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={28} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50" ref={scrollRef}>
             {messages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm leading-relaxed ${m.role === 'user' ? 'bg-slate-800 text-white' : 'bg-white text-slate-800 border'}`}>
                   {m.text}
                 </div>
               </div>
             ))}
             {isLoading && <div className="animate-pulse flex gap-1"><div className="w-2 h-2 bg-slate-300 rounded-full"></div><div className="w-2 h-2 bg-slate-300 rounded-full"></div><div className="w-2 h-2 bg-slate-300 rounded-full"></div></div>}
          </div>
          <div className="p-6 bg-white border-t flex gap-3">
            <input type="text" className="flex-1 p-4 border rounded-2xl bg-slate-100 outline-none focus:bg-white" placeholder="Ask Chef Pierre..." value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} />
            <button onClick={handleSend} className="bg-slate-900 text-white p-4 rounded-2xl"><Send size={24} /></button>
          </div>
        </div>
      )}
    </>
  );
};