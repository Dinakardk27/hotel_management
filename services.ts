import { MenuItem, Order, OrderStatus, SalesData } from './types';
import { GoogleGenAI } from "@google/genai";

// --- Mock Data & LocalStorage Helper ---

const INITIAL_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Butter Chicken & Naan',
    description: 'Tender chicken in a rich tomato and butter gravy, served with garlic naan.',
    price: 350,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
    available: true
  },
  {
    id: '2',
    name: 'Paneer Tikka',
    description: 'Marinated cottage cheese cubes grilled to perfection with spices.',
    price: 280,
    category: 'Starters',
    imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
    available: true
  },
  {
    id: '3',
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice cooked with spices and tender chicken pieces.',
    price: 400,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    available: true
  },
  {
    id: '4',
    name: 'Gulab Jamun',
    description: 'Soft milk solids dumplings soaked in rose-flavored sugar syrup.',
    price: 120,
    category: 'Dessert',
    imageUrl: 'https://images.unsplash.com/photo-1629806495570-5b565fb949d2?auto=format&fit=crop&w=800&q=80',
    available: true
  },
  {
    id: '5',
    name: 'Masala Chai',
    description: 'Traditional Indian spiced tea brewed with ginger and cardamom.',
    price: 50,
    category: 'Drinks',
    imageUrl: 'https://images.unsplash.com/photo-1619066045029-5c7e8537bd8c?auto=format&fit=crop&w=800&q=80',
    available: true
  },
    {
    id: '6',
    name: 'Mango Lassi',
    description: 'Creamy yogurt-based drink blended with fresh mango pulp.',
    price: 150,
    category: 'Drinks',
    imageUrl: 'https://images.unsplash.com/photo-1544256223-b6c867a151b7?auto=format&fit=crop&w=800&q=80',
    available: true
  }
];

const STORAGE_KEYS = {
  MENU: 'bistro_menu',
  ORDERS: 'bistro_orders',
  ADMINS: 'bistro_admins'
};

// --- Store Implementation ---

export const Store = {
  getMenu: (): MenuItem[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.MENU);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(INITIAL_MENU));
      return INITIAL_MENU;
    }
    return JSON.parse(stored);
  },

  saveMenu: (menu: MenuItem[]) => {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menu));
  },

  getOrders: (): Order[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return stored ? JSON.parse(stored) : [];
  },

  placeOrder: (order: Order) => {
    const orders = Store.getOrders();
    orders.unshift(order); // Add to top
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  updateOrderStatus: (orderId: string, status: OrderStatus) => {
    const orders = Store.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index].status = status;
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }
  },

  getAnalytics: (): { dailyRevenue: number; monthlyRevenue: number; totalOrders: number; chartData: SalesData[] } => {
    const orders = Store.getOrders().filter(o => o.status !== OrderStatus.CANCELLED);
    const now = new Date();
    
    // Simple metrics
    const dailyRevenue = orders
      .filter(o => new Date(o.timestamp).toDateString() === now.toDateString())
      .reduce((sum, o) => sum + o.total, 0);

    const monthlyRevenue = orders
      .filter(o => new Date(o.timestamp).getMonth() === now.getMonth())
      .reduce((sum, o) => sum + o.total, 0);

    // Mock Chart Data Generator (Last 7 days)
    const chartData: SalesData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Calculate real data if available, else mock random data for visualization if empty
      const dayRevenue = orders
        .filter(o => new Date(o.timestamp).toDateString() === date.toDateString())
        .reduce((sum, o) => sum + o.total, 0);
      
      // Add some fake baseline revenue for better chart visuals if app is empty
      const visualRevenue = dayRevenue > 0 ? dayRevenue : Math.floor(Math.random() * 5000) + 1000;

      chartData.push({
        date: dayStr,
        revenue: visualRevenue,
        orders: Math.floor(visualRevenue / 250)
      });
    }

    return {
      dailyRevenue,
      monthlyRevenue,
      totalOrders: orders.length,
      chartData
    };
  },

  // Admin Auth Methods
  registerAdmin: (username: string, password: string): boolean => {
    const admins = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || '[]');
    if (admins.some((a: any) => a.username === username)) {
      return false; // Already exists
    }
    admins.push({ username, password });
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
    return true;
  },

  verifyAdmin: (username: string, password: string): boolean => {
    const admins = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || '[]');
    
    // Check local storage admins
    const found = admins.some((a: any) => a.username === username && a.password === password);
    if (found) return true;

    // Hardcoded Fallback for "Only Login" requirement
    // This ensures there is always one way to get in without a signup form.
    if (username === 'dinakar' && password === 'dk@2729') {
      return true;
    }

    return false;
  }
};

// --- Gemini AI Service ---

export const geminiService = {
  chatWithChef: async (userMessage: string, currentMenu: MenuItem[]): Promise<string> => {
    if (!process.env.API_KEY) return "AI service is unavailable. Please set API_KEY.";

    // Construct a detailed, real-time context of the menu
    const menuContext = currentMenu.map(item => 
      `ITEM: ${item.name}
       CATEGORY: ${item.category}
       PRICE: ₹${item.price}
       DESCRIPTION: ${item.description}
       STATUS: ${item.available ? 'Available' : 'OUT OF STOCK/UNAVAILABLE'}
       ---`
    ).join('\n');

    const systemInstruction = `
      You are Chef Pierre, a charming and knowledgeable virtual waiter for BistroFlow.
      You have access to the restaurant's REAL-TIME live menu below. 
      It is crucial that you strictly adhere to this menu. 
      If an item is marked "OUT OF STOCK" or "UNAVAILABLE", you MUST inform the customer it is currently unavailable and suggest an alternative from the available items.
      If a new item appears in this list that you haven't seen before, you know about it immediately and can recommend it.

      === LIVE MENU ===
      ${menuContext}
      =================
      
      Rules:
      1. Be polite, concise, and appetizing in your descriptions.
      2. Prices are in Indian Rupees (₹).
      3. Only recommend items that are explicitly listed in the Live Menu above.
      4. If a user asks for something not on the menu, politely suggest a similar available alternative.
      5. Keep responses under 50 words unless the user asks for a detailed explanation.
      6. Use emojis occasionally 🍛 🥘.
    `;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userMessage,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });
      return response.text || "I'm sorry, I'm having trouble thinking right now. How about the Butter Chicken?";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "My apologies, I am currently overwhelmed with orders. Please try again in a moment.";
    }
  }
};