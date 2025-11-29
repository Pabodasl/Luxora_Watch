// Mock data service for offline mode
const generateMockWatchId = () => `LUX-${Math.floor(100000 + Math.random() * 900000)}`;

const mockWatches = [
  {
    _id: 'mock-1',
    watchId: generateMockWatchId(),
    customerName: 'LUXORA Client',
    name: 'Rolex Submariner',
    price: 8500,
    mainImage: 'uploads/rolex-submariner.jpg',
    availability: 'Available',
    description: 'Classic diving watch with automatic movement',
    colorVariants: [
      { color: 'Black', image: 'uploads/rolex-black.jpg' },
      { color: 'Blue', image: 'uploads/rolex-blue.jpg' }
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: 'mock-2',
    watchId: generateMockWatchId(),
    customerName: 'LUXORA Client',
    name: 'Omega Speedmaster',
    price: 4200,
    mainImage: 'uploads/omega-speedmaster.jpg',
    availability: 'Available',
    description: 'The Moonwatch - worn on the moon missions',
    colorVariants: [
      { color: 'Silver', image: 'uploads/omega-silver.jpg' }
    ],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    _id: 'mock-3',
    watchId: generateMockWatchId(),
    customerName: 'LUXORA Client',
    name: 'Tag Heuer Carrera',
    price: 2800,
    mainImage: 'uploads/tag-carrera.jpg',
    availability: 'Sold Out',
    description: 'Racing-inspired chronograph with Swiss precision',
    colorVariants: [
      { color: 'Black', image: 'uploads/tag-black.jpg' },
      { color: 'White', image: 'uploads/tag-white.jpg' }
    ],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    _id: 'mock-4',
    watchId: generateMockWatchId(),
    customerName: 'LUXORA Client',
    name: 'Seiko Presage',
    price: 450,
    mainImage: 'uploads/seiko-presage.jpg',
    availability: 'Available',
    description: 'Japanese craftsmanship with automatic movement',
    colorVariants: [
      { color: 'Blue', image: 'uploads/seiko-blue.jpg' }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

const mockAdmin = {
  _id: 'mock-admin',
  name: process.env.ADMIN_NAME || 'Luxora Admin',
  email: process.env.ADMIN_EMAIL || 'admin@gmail.com',
  password: '$2b$10$mock.hash.for.testing'
};

// Mock database operations
const mockDB = {
  // Watch operations
  async findWatches() {
    return mockWatches.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async findWatchById(id) {
    return mockWatches.find(watch => watch._id === id);
  },

  async createWatch(watchData) {
    const newWatch = {
      _id: `mock-${Date.now()}`,
      watchId: generateMockWatchId(),
      ...watchData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockWatches.push(newWatch);
    return newWatch;
  },

  async updateWatch(id, updateData) {
    const index = mockWatches.findIndex(watch => watch._id === id);
    if (index === -1) return null;
    
    mockWatches[index] = {
      ...mockWatches[index],
      ...updateData,
      updatedAt: new Date()
    };
    return mockWatches[index];
  },

  async deleteWatch(id) {
    const index = mockWatches.findIndex(watch => watch._id === id);
    if (index === -1) return false;
    
    mockWatches.splice(index, 1);
    return true;
  },

  // Admin operations
  async findAdminByEmail(email) {
    if (email === mockAdmin.email) {
      return {
        ...mockAdmin,
        comparePassword: async (password) => {
          // For demo purposes, accept any password
          return true;
        }
      };
    }
    return null;
  },

  async findAdminById(id) {
    if (id === mockAdmin._id) {
      return {
        ...mockAdmin,
        comparePassword: async (password) => {
          // For demo purposes, accept any password
          return true;
        }
      };
    }
    return null;
  },

  async createAdmin(adminData) {
    const newAdmin = {
      _id: `mock-admin-${Date.now()}`,
      ...adminData,
      createdAt: new Date()
    };
    return newAdmin;
  }
};

module.exports = { mockDB, isDBConnected: () => isDBConnected };
