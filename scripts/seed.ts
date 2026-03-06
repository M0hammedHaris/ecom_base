import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../src/lib/db/schema";

const client = createClient({ url: "file:./dev.db" });
const db = drizzle(client, { schema });

const seedProducts = [
  {
    name: "Classic White T-Shirt",
    slug: "classic-white-t-shirt",
    description:
      "A timeless white tee crafted from 100% organic cotton. Perfect for everyday wear.",
    price: 2999,
    compareAtPrice: 3999,
    inventory: 150,
    category: "clothing",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    featured: true,
  },
  {
    name: "Slim Fit Chinos",
    slug: "slim-fit-chinos",
    description:
      "Modern slim-fit chinos in a versatile neutral tone. Ideal for casual and smart-casual occasions.",
    price: 5999,
    inventory: 80,
    category: "clothing",
    imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800",
    featured: false,
  },
  {
    name: "Wireless Noise-Cancelling Headphones",
    slug: "wireless-noise-cancelling-headphones",
    description:
      "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and superior sound quality.",
    price: 19999,
    compareAtPrice: 24999,
    inventory: 45,
    category: "electronics",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    featured: true,
  },
  {
    name: "Mechanical Keyboard – TKL",
    slug: "mechanical-keyboard-tkl",
    description:
      "Tenkeyless mechanical keyboard with tactile switches, per-key RGB lighting, and aluminium body.",
    price: 12999,
    inventory: 30,
    category: "electronics",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
    featured: false,
  },
  {
    name: "Ceramic Pour-Over Coffee Set",
    slug: "ceramic-pour-over-coffee-set",
    description:
      "Handcrafted ceramic pour-over dripper with matching carafe and two cups. Elevate your morning ritual.",
    price: 4999,
    inventory: 60,
    category: "home & garden",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
    featured: true,
  },
  {
    name: "Yoga Mat – 6mm",
    slug: "yoga-mat-6mm",
    description:
      "Non-slip eco-friendly TPE yoga mat with alignment marks. 6mm thick for joint support.",
    price: 3499,
    inventory: 0,
    category: "sports",
    imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800",
    featured: false,
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  await db.delete(schema.products);

  for (const product of seedProducts) {
    await db.insert(schema.products).values(product);
    console.log(`  ✓ ${product.name}`);
  }

  console.log(`\n✅ Seeded ${seedProducts.length} products successfully.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
