export interface Product {
  id: string;
  name: string;
  price: number;
  mrp: number;
  unit: string;
  image: string;
  category: string;
  subcategory?: string;
  description: string;
  inStock: boolean;
  discount?: number;
}

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  icon: string;
}

export const categories: Category[] = [
  {
    id: "vegetables",
    name: "Vegetables",
    image: "https://images.unsplash.com/photo-1634731201932-9bd92839bea2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBwcm9kdWNlfGVufDF8fHx8MTc3MDUyNjA0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    icon: "🥬",
  },
  {
    id: "fruits",
    name: "Fruits",
    image: "https://images.unsplash.com/photo-1767040023611-53996d500ee8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcnVpdHMlMjBhc3NvcnRtZW50JTIwY29sb3JmdWx8ZW58MXx8fHwxNzcwNTI2MDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    icon: "🍎",
  },
  {
    id: "bakery",
    name: "Bakery",
    image: "https://images.unsplash.com/photo-1608220874995-aa3e5301c676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBicmVhZCUyMHBhc3RyaWVzfGVufDF8fHx8MTc3MDUyNjA0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    icon: "🥖",
  },
  {
    id: "dairy",
    name: "Dairy",
    image: "https://images.unsplash.com/photo-1635714293982-65445548ac42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWlyeSUyMG1pbGslMjBwcm9kdWN0c3xlbnwxfHx8fDE3NzA1MTIzMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    icon: "🥛",
  },
  {
    id: "meat",
    name: "Meat",
    image: "https://images.unsplash.com/photo-1630334337820-84afb05acf3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWF0JTIwYnV0Y2hlciUyMGZyZXNofGVufDF8fHx8MTc3MDQxNTU2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    icon: "🥩",
  },
  {
    id: "seafood",
    name: "Seafood",
    image: "https://images.unsplash.com/photo-1637679242615-0ddbbb34b7d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFmb29kJTIwZmlzaCUyMG1hcmtldHxlbnwxfHx8fDE3NzA0NzQyNjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    icon: "🐟",
  },
  {
    id: "stationary-office",
    name: "Stationary & Office",
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGF0aW9uYXJ5JTIwb2ZmaWNlJTIwc3VwcGxpZXN8ZW58MXx8fHwxNzcwNTI2MDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    icon: "📝",
  },
  {
    id: "groceries",
    name: "Groceries",
    image: "https://images.unsplash.com/photo-1488459716781-6918f33427d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc3RvcmV8ZW58MXx8fHwxNzcwNTI2MDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    icon: "🛒",
  },
];

export const subCategories: SubCategory[] = [
  // Vegetables
  { id: "leafy-greens", name: "Leafy Greens", categoryId: "vegetables" },
  { id: "root-vegetables", name: "Root Vegetables", categoryId: "vegetables" },
  { id: "cruciferous", name: "Cruciferous", categoryId: "vegetables" },
  { id: "other-vegetables", name: "Other Vegetables", categoryId: "vegetables" },

  // Fruits
  { id: "citrus", name: "Citrus", categoryId: "fruits" },
  { id: "berries", name: "Berries", categoryId: "fruits" },
  { id: "tropical", name: "Tropical", categoryId: "fruits" },
  { id: "stone-fruits", name: "Stone Fruits", categoryId: "fruits" },

  // Bakery
  { id: "bread", name: "Bread", categoryId: "bakery" },
  { id: "pastries", name: "Pastries", categoryId: "bakery" },
  { id: "cakes", name: "Cakes", categoryId: "bakery" },
  { id: "rolls", name: "Rolls", categoryId: "bakery" },

  // Dairy
  { id: "milk", name: "Milk", categoryId: "dairy" },
  { id: "yogurt", name: "Yogurt", categoryId: "dairy" },
  { id: "cheese", name: "Cheese", categoryId: "dairy" },
  { id: "butter", name: "Butter & Spreads", categoryId: "dairy" },

  // Meat
  { id: "beef", name: "Beef", categoryId: "meat" },
  { id: "pork", name: "Pork", categoryId: "meat" },
  { id: "poultry", name: "Poultry", categoryId: "meat" },
  { id: "processed-meat", name: "Processed Meat", categoryId: "meat" },

  // Seafood
  { id: "fish", name: "Fish", categoryId: "seafood" },
  { id: "shellfish", name: "Shellfish", categoryId: "seafood" },
  { id: "frozen-seafood", name: "Frozen Seafood", categoryId: "seafood" },

  // Stationary & Office
  { id: "notebooks", name: "Notebooks", categoryId: "stationary-office" },
  { id: "pens-pencils", name: "Pens & Pencils", categoryId: "stationary-office" },
  { id: "paper-products", name: "Paper Products", categoryId: "stationary-office" },
  { id: "desk-accessories", name: "Desk Accessories", categoryId: "stationary-office" },

  // Groceries
  { id: "grains-cereals", name: "Grains & Cereals", categoryId: "groceries" },
  { id: "cooking-oils", name: "Cooking Oils", categoryId: "groceries" },
  { id: "spices-condiments", name: "Spices & Condiments", categoryId: "groceries" },
  { id: "canned-foods", name: "Canned Foods", categoryId: "groceries" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Fresh Tomatoes",
    price: 3.99,
    mrp: 4.99,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1767978529638-ff1faefa00c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG9yZ2FuaWMlMjB0b21hdG9lc3xlbnwxfHx8fDE3NzA1MjAyMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "vegetables",
    subcategory: "other-vegetables",
    description: "Organic, locally grown tomatoes",
    inStock: true,
    discount: 20,
  },
  {
    id: "2",
    name: "Green Apples",
    price: 4.49,
    mrp: 5.49,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1545252058-5b679e86032e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGFwcGxlcyUyMGZydWl0fGVufDF8fHx8MTc3MDQ3NDc3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "fruits",
    subcategory: "stone-fruits",
    description: "Crisp and fresh Granny Smith apples",
    inStock: true,
    discount: 18,
  },
  {
    id: "3",
    name: "Whole Wheat Bread",
    price: 3.29,
    mrp: 3.99,
    unit: "loaf",
    image: "https://images.unsplash.com/photo-1608220874995-aa3e5301c676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBicmVhZCUyMHBhc3RyaWVzfGVufDF8fHx8MTc3MDUyNjA0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "bakery",
    subcategory: "bread",
    description: "Freshly baked whole wheat bread",
    inStock: true,
    discount: 15,
  },
  {
    id: "4",
    name: "Organic Milk",
    price: 5.99,
    mrp: 7.49,
    unit: "gallon",
    image: "https://images.unsplash.com/photo-1635714293982-65445548ac42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWlyeSUyMG1pbGslMjBwcm9kdWN0c3xlbnwxfHx8fDE3NzA1MTIzMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "dairy",
    subcategory: "milk",
    description: "100% organic whole milk",
    inStock: true,
    discount: 20,
  },
  {
    id: "5",
    name: "Fresh Chicken Breast",
    price: 8.99,
    mrp: 10.99,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1630334337820-84afb05acf3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWF0JTIwYnV0Y2hlciUyMGZyZXNofGVufDF8fHx8MTc3MDQxNTU2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "meat",
    subcategory: "poultry",
    description: "Premium quality chicken breast",
    inStock: true,
    discount: 18,
  },
  {
    id: "6",
    name: "Wild Salmon Fillet",
    price: 14.99,
    mrp: 18.99,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1637679242615-0ddbbb34b7d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFmb29kJTIwZmlzaCUyMG1hcmtldHxlbnwxfHx8fDE3NzA0NzQyNjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "seafood",
    subcategory: "fish",
    description: "Fresh wild-caught salmon",
    inStock: true,
    discount: 21,
  },
  // Additional products with subcategories
  {
    id: "7",
    name: "Spinach Salad Mix",
    price: 4.99,
    mrp: 6.49,
    unit: "pack",
    image: "https://images.unsplash.com/photo-1553530666-ba2a7ce3ddae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGluYWNoJTIwc2FsYWR8ZW58MXx8fHwxNzcwNTI2MDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "vegetables",
    subcategory: "leafy-greens",
    description: "Fresh spinach salad mix",
    inStock: true,
    discount: 23,
  },
  {
    id: "8",
    name: "Red Carrots",
    price: 2.49,
    mrp: 2.99,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1599599810694-cb5d0f9a4b7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJyb3RzJTIwcm9vdCUyMHZlZ2V0YWJsZXN8ZW58MXx8fHwxNzcwNTI2MDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "vegetables",
    subcategory: "root-vegetables",
    description: "Fresh organic carrots",
    inStock: true,
    discount: 10,
  },
  {
    id: "9",
    name: "Fresh Broccoli",
    price: 3.49,
    mrp: 4.49,
    unit: "head",
    image: "https://images.unsplash.com/photo-1599599810694-cb94dee8f006?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMGNydWNpZmVyb3VzfGVufDF8fHx8MTc3MDUyNjA0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "vegetables",
    subcategory: "cruciferous",
    description: "Fresh green broccoli heads",
    inStock: true,
    discount: 22,
  },
  {
    id: "10",
    name: "Fresh Oranges",
    price: 5.99,
    mrp: 7.49,
    unit: "pack",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2VzJTIwY2l0cnVzfGVufDF8fHx8MTc3MDUyNjA0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "fruits",
    subcategory: "citrus",
    description: "Fresh juicy oranges",
    inStock: true,
    discount: 20,
  },
  {
    id: "11",
    name: "Premium Notebook",
    price: 4.99,
    mrp: 6.99,
    unit: "pc",
    image: "https://images.unsplash.com/photo-1507842217343-583f20270319?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3RlYm9vayUyMHN0YXRpb25hcnl8ZW58MXx8fHwxNzcwNTI2MDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "stationary-office",
    subcategory: "notebooks",
    description: "100 pages premium quality notebook",
    inStock: true,
    discount: 28,
  },
  {
    id: "12",
    name: "Ballpoint Pen Set",
    price: 3.99,
    mrp: 5.49,
    unit: "pack",
    image: "https://images.unsplash.com/photo-1578085284519-98f0b59e9e37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW4lMjBzdGF0aW9uYXJ5fGVufDF8fHx8MTc3MDUyNjA0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "stationary-office",
    subcategory: "pens-pencils",
    description: "Set of 10 smooth writing ballpoint pens",
    inStock: true,
    discount: 27,
  },
  {
    id: "13",
    name: "A4 Paper Ream",
    price: 5.99,
    mrp: 7.99,
    unit: "ream",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXBlciUyMHJlYW18ZW58MXx8fHwxNzcwNTI2MDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "stationary-office",
    subcategory: "paper-products",
    description: "500 sheets of high quality A4 paper",
    inStock: true,
    discount: 25,
  },
  {
    id: "14",
    name: "Desk Organizer",
    price: 12.99,
    mrp: 15.99,
    unit: "pc",
    image: "https://images.unsplash.com/photo-1589939705882-0a92181e1260?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNrJTIwb3JnYW5pemVyfGVufDF8fHx8MTc3MDUyNjA0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "stationary-office",
    subcategory: "desk-accessories",
    description: "Wooden desk organizer with multiple compartments",
    inStock: true,
    discount: 19,
  },
  {
    id: "15",
    name: "Pencil Set",
    price: 4.49,
    mrp: 5.99,
    unit: "pack",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW5jaWwlMjBzZXR8ZW58MXx8fHwxNzcwNTI2MDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "stationary-office",
    subcategory: "pens-pencils",
    description: "Set of 12 HB pencils",
    inStock: true,
    discount: 25,
  },
  {
    id: "16",
    name: "Brown Rice",
    price: 3.49,
    mrp: 4.99,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1586080266690-05ef18b0c6a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwZ3JhaW58ZW58MXx8fHwxNzcwNTI2MDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "groceries",
    subcategory: "grains-cereals",
    description: "Organic brown rice, high in fiber",
    inStock: true,
    discount: 30,
  },
  {
    id: "17",
    name: "Extra Virgin Olive Oil",
    price: 12.99,
    mrp: 16.99,
    unit: "liter",
    image: "https://images.unsplash.com/photo-1596040694741-75cded5e0213?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGl2ZSUyMG9pbHxlbnwxfHx8fDE3NzA1MjYwNDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "groceries",
    subcategory: "cooking-oils",
    description: "Cold-pressed extra virgin olive oil",
    inStock: true,
    discount: 23,
  },
  {
    id: "18",
    name: "Spice Mix Combo",
    price: 5.99,
    mrp: 7.99,
    unit: "pack",
    image: "https://images.unsplash.com/photo-1596040694741-75cded5e0213?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZXN8ZW58MXx8fHwxNzcwNTI2MDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "groceries",
    subcategory: "spices-condiments",
    description: "Premium mix of Indian spices",
    inStock: true,
    discount: 25,
  },
  {
    id: "19",
    name: "Baked Beans",
    price: 2.49,
    mrp: 3.49,
    unit: "can",
    image: "https://images.unsplash.com/photo-1599599810694-cb1aea4b39f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5uZWQlMjBmb29kfGVufDF8fHx8MTc3MDUyNjA0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "groceries",
    subcategory: "canned-foods",
    description: "Ready to eat baked beans in tomato sauce",
    inStock: true,
    discount: 28,
  },
  {
    id: "20",
    name: "Whole Wheat Flour",
    price: 2.99,
    mrp: 3.99,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1599599810815-db8da036e752?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG91cnxlbnwxfHx8fDE3NzA1MjYwNDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "groceries",
    subcategory: "grains-cereals",
    description: "Premium wholemeal flour for baking",
    inStock: true,
    discount: 25,
  },
  {
    id: "21",
    name: "Tomato Ketchup",
    price: 3.49,
    mrp: 4.99,
    unit: "bottle",
    image: "https://images.unsplash.com/photo-1599599810817-4d38e48c3bfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVjZSUyMGNvbmRpbWVudHN8ZW58MXx8fHwxNzcwNTI2MDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "groceries",
    subcategory: "spices-condiments",
    description: "Organic tomato ketchup without added sugar",
    inStock: true,
    discount: 30,
  },
];
