import React, { useState, useEffect } from 'react';
import { 
  Store, 
} from './services';
import { MenuItem, CartItem } from './types';
import { HeroSection, FeaturesSection, MenuPage, CartDrawer, CheckoutPage, AIWaiter, PromoBanner, GallerySection, FeedbackSection } from './pages/Customer';
import { AdminDashboard, OrderManager, MenuManager } from './pages/Admin';
import { LayoutDashboard, Utensils, ShoppingBag, Coffee, ChefHat, LogOut, ArrowLeft, UserPlus, LogIn, Eye, EyeOff, Lock, ChevronRight, ArrowRight, Search } from 'lucide-react';
import { Button } from './components/Common';

// --- Navbar Component (Inline for simplicity of props) ---

const Navbar: React.FC<{
  page: string;
  setPage: (p: string) => void;
  cartCount: number;
  openCart: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}> = ({ page, setPage, cartCount, openCart, searchQuery, setSearchQuery }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm transition-all duration-300">
      <div className="w-full px-6 md:px-12">
        <div className="flex justify-between h-24 items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setPage('home')}>
            <div className="w-12 h-12 bg-slate-800 rounded-tr-2xl rounded-bl-2xl rounded-tl-md rounded-br-md flex items-center justify-center text-white shadow-lg shadow-slate-300 group-hover:scale-105 transition-transform">
              <Utensils className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl tracking-tight text-slate-800 font-heading leading-none">Bistro<span className="text-blue-500">Flow</span></span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-1">Future Dining</span>
            </div>
          </div>

          {!page.startsWith('admin') ? (
            <div className="flex items-center gap-4 md:gap-8">
               {/* Search Bar */}
               <div className={`flex items-center bg-slate-100 rounded-full transition-all duration-300 border border-slate-200 ${isSearchOpen || searchQuery ? 'w-40 md:w-64 px-4 py-2' : 'w-10 h-10 justify-center cursor-pointer hover:bg-slate-200'}`} onClick={() => !isSearchOpen && setIsSearchOpen(true)}>
                 <Search className={`w-4 h-4 text-slate-500 ${isSearchOpen || searchQuery ? 'mr-2' : ''}`} />
                 {(isSearchOpen || searchQuery) && (
                   <input 
                    autoFocus
                    type="text" 
                    placeholder="Search menu..." 
                    className="bg-transparent border-none outline-none text-sm w-full text-slate-700 font-medium placeholder:text-slate-400"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value && page !== 'menu') setPage('menu');
                    }}
                    onBlur={() => !searchQuery && setIsSearchOpen(false)}
                   />
                 )}
               </div>

              {page !== 'home' && (
                <button 
                  onClick={() => setPage('home')} 
                  className="hidden md:flex items-center gap-2 font-medium text-lg text-slate-500 hover:text-slate-800 transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Home
                </button>
              )}
              <button onClick={() => setPage('menu')} className={`font-medium text-lg transition-all duration-300 ${page === 'menu' ? 'text-blue-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'}`}>Menu</button>
              <div className="relative group">
                <button 
                  onClick={openCart}
                  className="p-3 rounded-full bg-slate-100 hover:bg-white text-slate-600 hover:text-blue-600 transition-colors relative border border-slate-200 group-hover:border-blue-200 group-hover:shadow-md"
                >
                  <ShoppingBag className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
              <div className="h-8 w-px bg-slate-200 mx-2"></div>
              <button 
                onClick={() => setPage('admin-login')} 
                className="p-3 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all"
                title="Admin Login"
              >
                <Lock className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
               <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wide border border-slate-200">Admin Mode</span>
               <button onClick={() => setPage('home')} className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full">
                 <LogOut className="w-5 h-5" />
               </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// --- Admin Authentication Component ---

const AdminAuth: React.FC<{ onAuthenticated: () => void; onBack: () => void }> = ({ onAuthenticated, onBack }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    // Small delay to simulate network/processing
    await new Promise(resolve => setTimeout(resolve, 800));

    if (Store.verifyAdmin(username, password)) {
      onAuthenticated();
    } else {
      alert('Invalid credentials. (Hint: Try admin / admin)');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration - Adjusted for Medium Theme */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-300/30 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <div className="w-full max-w-sm bg-white/70 backdrop-blur-xl p-10 rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-xl rounded-bl-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60 text-center animate-in fade-in zoom-in duration-500 relative ring-1 ring-slate-200">
        <div className="w-24 h-24 bg-gradient-to-tr from-slate-800 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-slate-300 ring-4 ring-white/50">
          <Lock className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-slate-800 mb-2 font-heading">
          Restricted Access
        </h2>
        <p className="text-slate-500 mb-8 text-sm">
          Management portal login. <br/> Authorized personnel only.
        </p>
        
        <form onSubmit={handleSubmit} className="text-left space-y-5">
          <div className="group">
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Username</label>
             <input 
              required
              type="text" 
              name="username"
              placeholder="Username" 
              className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 outline-none bg-white/80 transition-all font-medium text-slate-700" 
            />
          </div>
          <div className="group">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Password</label>
            <div className="relative">
              <input 
                required
                type={showPassword ? "text" : "password"} 
                name="password"
                placeholder="••••••••" 
                className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 outline-none bg-white/80 pr-12 transition-all font-medium text-slate-700" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 focus:outline-none p-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <Button type="submit" isLoading={isLoading} className="w-full py-5 text-lg mt-6 shadow-xl shadow-slate-200 bg-slate-900 hover:bg-slate-800 text-white border-0 rounded-xl">
            Secure Login
          </Button>
        </form>
        
        <button onClick={onBack} className="mt-8 text-sm text-slate-500 hover:text-slate-800 flex items-center justify-center w-full gap-2 transition-colors font-medium">
           <ArrowLeft className="w-4 h-4" /> Return to Website
        </button>
      </div>
    </div>
  );
};

// --- Main App Logic ---

const App: React.FC = () => {
  const [page, setPage] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart Logic
  const addToCart = (item: MenuItem, selectedUnit: string = "Standard", variantPrice?: number) => {
    const finalPrice = variantPrice || item.price;
    
    setCart(prev => {
      // Check for existing item with SAME ID and SAME Unit
      const existing = prev.find(i => i.id === item.id && i.selectedUnit === selectedUnit);
      
      if (existing) {
        return prev.map(i => 
          (i.id === item.id && i.selectedUnit === selectedUnit)
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        );
      }
      return [...prev, { ...item, price: finalPrice, quantity: 1, selectedUnit }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId: string, selectedUnit: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId && item.selectedUnit === selectedUnit) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (itemId: string, selectedUnit: string) => {
    setCart(prev => prev.filter(item => !(item.id === itemId && item.selectedUnit === selectedUnit)));
  };

  const clearCart = () => setCart([]);

  // Admin Routing Guard
  const renderAdminPage = () => {
    if (!isAdminAuthenticated) {
      return (
        <AdminAuth 
          onAuthenticated={() => {
            setIsAdminAuthenticated(true);
            setPage('admin-dashboard');
          }} 
          onBack={() => setPage('home')} 
        />
      );
    }

    return (
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-72 bg-white/60 backdrop-blur-lg border-r border-white/40 hidden md:block p-6">
          <div className="space-y-2">
            <button onClick={() => setPage('admin-dashboard')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-medium transition-all ${page === 'admin-dashboard' ? 'bg-slate-100 text-slate-800 shadow-sm' : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'}`}>
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </button>
            <button onClick={() => setPage('admin-orders')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-medium transition-all ${page === 'admin-orders' ? 'bg-slate-100 text-slate-800 shadow-sm' : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'}`}>
              <ShoppingBag className="w-5 h-5" /> Orders
            </button>
            <button onClick={() => setPage('admin-menu')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-medium transition-all ${page === 'admin-menu' ? 'bg-slate-100 text-slate-800 shadow-sm' : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'}`}>
              <Utensils className="w-5 h-5" /> Menu Manager
            </button>
          </div>
        </aside>
        
        {/* Mobile Nav for Admin */}
        <div className="md:hidden w-full flex overflow-x-auto border-b border-slate-200 bg-white">
           <button onClick={() => setPage('admin-dashboard')} className={`flex-1 p-3 text-sm font-medium ${page === 'admin-dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}>Dashboard</button>
           <button onClick={() => setPage('admin-orders')} className={`flex-1 p-3 text-sm font-medium ${page === 'admin-orders' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}>Orders</button>
           <button onClick={() => setPage('admin-menu')} className={`flex-1 p-3 text-sm font-medium ${page === 'admin-menu' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}>Menu</button>
        </div>

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {page === 'admin-dashboard' && <AdminDashboard />}
          {page === 'admin-orders' && <OrderManager />}
          {page === 'admin-menu' && <MenuManager />}
        </main>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900">
      <Navbar 
        page={page} 
        setPage={setPage} 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        openCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {page === 'home' && (
        <main className="flex-1 overflow-x-hidden">
          <HeroSection onOrderNow={() => setPage('menu')} />
          <PromoBanner onOrder={() => setPage('menu')} />
          <FeaturesSection />
          <div className="w-full max-w-[1800px] mx-auto py-16 md:py-24 px-6 md:px-12 relative">
            <div className="text-center mb-12 md:mb-16">
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Our Masterpieces</span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-heading">Popular Favorites</h2>
              <div className="w-24 h-1 bg-blue-500 mx-auto mt-6 rounded-full"></div>
            </div>
            
            {/* Smooth Swipe Menu (Leaf Box Style) */}
            <div className="w-full overflow-x-auto pb-10 pt-4 px-4 -mx-4 no-scrollbar scroll-smooth snap-x snap-mandatory flex gap-6 md:gap-8">
              {Store.getMenu().slice(0, 5).map(item => (
                <div 
                  key={item.id} 
                  className="min-w-[300px] md:min-w-[320px] snap-center bg-white/70 backdrop-blur-md p-5 rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-xl rounded-bl-xl shadow-[0_15px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_rgba(59,130,246,0.1)] transition-all duration-500 cursor-pointer group border border-white hover:border-blue-100 flex flex-col" 
                  onClick={() => setPage('menu')}
                >
                  <div className="overflow-hidden rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-lg rounded-bl-lg mb-6 relative aspect-[4/3] bg-slate-50 shadow-inner">
                    <img src={item.imageUrl} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" alt={item.name}/>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent opacity-60 group-hover:opacity-30 transition-opacity"></div>
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur text-slate-900 font-bold px-4 py-1.5 rounded-full text-sm shadow-lg">
                      ₹{item.price}
                    </div>
                  </div>
                  <div className="px-2 pb-2 flex-1 flex flex-col">
                    <div className="mb-2">
                      <h3 className="font-bold text-xl font-heading text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{item.category}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">{item.description}</p>
                    <div className="mt-auto flex items-center justify-between text-blue-500 font-medium group-hover:translate-x-1 transition-transform">
                      <span>Order Now</span>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
              {/* See More Card */}
               <div 
                  className="min-w-[200px] snap-center flex items-center justify-center bg-white/40 backdrop-blur-sm rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-xl rounded-bl-xl border-2 border-dashed border-slate-300 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer group"
                  onClick={() => setPage('menu')}
                >
                  <div className="text-center group-hover:scale-110 transition-transform">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-4 text-blue-500">
                      <ArrowRight className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-slate-600 group-hover:text-blue-600">View All</span>
                  </div>
                </div>
            </div>
          </div>
          
          <GallerySection />
          <FeedbackSection />
        </main>
      )}

      {page === 'menu' && (
        <MenuPage 
          cart={cart} 
          addToCart={addToCart} 
          removeFromCart={removeFromCart} 
          updateQuantity={updateQuantity} 
          clearCart={clearCart} 
          setPage={setPage}
          searchQuery={searchQuery}
        />
      )}

      {page === 'checkout' && (
        <CheckoutPage cart={cart} clearCart={clearCart} setPage={setPage} />
      )}

      {page === 'success' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-500">
          <div className="w-28 h-28 bg-emerald-100 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-emerald-50 border-4 border-white">
            <CheckCircle className="w-14 h-14 text-emerald-600" />
          </div>
          <h2 className="text-4xl font-bold mb-4 font-heading text-slate-900">Order Confirmed!</h2>
          <p className="text-slate-500 mb-10 max-w-lg text-lg leading-relaxed">Thank you for dining with us. Your order has been sent to the kitchen and will be ready shortly.</p>
          <div className="flex gap-6">
            <Button onClick={() => setPage('home')} variant="secondary" className="px-8 rounded-xl">Back Home</Button>
            <Button onClick={() => setPage('menu')} className="px-8 shadow-blue-200 rounded-xl bg-blue-600 hover:bg-blue-700">Order More</Button>
          </div>
        </div>
      )}

      {page.startsWith('admin') && renderAdminPage()}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        clearCart={clearCart}
        setPage={(p) => { setPage(p); setIsCartOpen(false); }}
      />
      
      {!page.startsWith('admin') && <AIWaiter />}
      
      {/* Footer */}
      {!page.startsWith('admin') && (
        <footer className="bg-white/50 backdrop-blur-md border-t border-slate-200 py-12 mt-auto">
          <div className="w-full px-6 text-center">
             <div className="flex justify-center items-center gap-2 mb-6 opacity-50">
                <Utensils className="w-6 h-6" />
                <span className="font-bold font-heading text-xl">BistroFlow</span>
             </div>
             <p className="text-slate-500 text-sm">© 2024 BistroFlow Restaurant. All rights reserved.</p>
          </div>
        </footer>
      )}

      {/* Helper for icons in success page */}
      <div className="hidden">
        <div id="check-icon">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Helper for check circle icon used in Success view (local definition for cleaner imports above)
const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default App;