// prisma/seed.ts
import { PrismaClient, Tier, Role } from "@prisma/client";

const prisma = new PrismaClient();

const tierMultipliers: Record<Tier, number> = {
  MRP: 1.0,
  RETAIL: 0.92,
  B2B: 0.78,
  B2C: 0.85
};

type ProductSeed = {
  categoryId: string;
  name: string;
  sku: string;
  description: string;
  unit: string;
  mrp: number;
  imageUrl: string;
};

async function main() {
  console.info("Seeding RoofMate catalog...");

  await prisma.auditLog.deleteMany();
  await prisma.priceTier.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const sheets = await prisma.category.create({
    data: {
      name: "Roofing Sheets",
      slug: "roofing-sheets",
      description: "Galvalume, polycarbonate, and color-coated profile sheets.",
      displayOrder: 1
    }
  });

  const tiles = await prisma.category.create({
    data: {
      name: "Tiles",
      slug: "tiles",
      description: "Clay, concrete, and ceramic roof tiles.",
      displayOrder: 2
    }
  });

  const accessories = await prisma.category.create({
    data: {
      name: "Accessories",
      slug: "accessories",
      description: "Fasteners, sealants, ridge caps, and gutters.",
      displayOrder: 3
    }
  });

  const products: ProductSeed[] = [
    {
      categoryId: sheets.id,
      name: "Galvalume Trapezoidal Sheet 0.5mm",
      sku: "RS-GAL-05-T",
      description: "0.5mm galvalume coated trapezoidal profile sheet.",
      unit: "per sq ft",
      mrp: 65,
      imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800"
    },
    {
      categoryId: sheets.id,
      name: "Polycarbonate Corrugated Sheet 1.2mm",
      sku: "RS-PC-12-C",
      description: "Translucent polycarbonate corrugated sheet, UV-stabilised.",
      unit: "per sq ft",
      mrp: 110,
      imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800"
    },
    {
      categoryId: sheets.id,
      name: "Color-coated Profile Sheet 0.45mm",
      sku: "RS-CC-045-P",
      description: "Pre-painted galvanised steel sheet, slate grey.",
      unit: "per sq ft",
      mrp: 78,
      imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800"
    },
    {
      categoryId: tiles.id,
      name: "Mangalore Clay Tile",
      sku: "TL-CLY-MGR",
      description: "Traditional Mangalore-pattern clay roof tile.",
      unit: "per piece",
      mrp: 38,
      imageUrl: "https://images.unsplash.com/photo-1597047084897-51e81819a499?w=800"
    },
    {
      categoryId: tiles.id,
      name: "Concrete Interlocking Tile",
      sku: "TL-CON-INT",
      description: "Charcoal concrete interlocking tile, 420x330mm.",
      unit: "per piece",
      mrp: 52,
      imageUrl: "https://images.unsplash.com/photo-1568871391107-0e26217aab3e?w=800"
    },
    {
      categoryId: tiles.id,
      name: "Ceramic Glazed Roof Tile",
      sku: "TL-CER-GLZ",
      description: "Glazed ceramic tile, terracotta finish.",
      unit: "per piece",
      mrp: 64,
      imageUrl: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800"
    },
    {
      categoryId: accessories.id,
      name: "Self-drilling Roof Screw 55mm",
      sku: "AC-SCR-55",
      description: "Hex-head self-drilling screw with EPDM washer.",
      unit: "per box (250)",
      mrp: 850,
      imageUrl: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800"
    },
    {
      categoryId: accessories.id,
      name: "Polyurethane Roof Sealant",
      sku: "AC-SEAL-PU",
      description: "600ml PU sealant cartridge, weather-resistant.",
      unit: "per cartridge",
      mrp: 420,
      imageUrl: "https://images.unsplash.com/photo-1581094289810-adf5d25690e3?w=800"
    },
    {
      categoryId: accessories.id,
      name: "Galvanised Ridge Cap 8ft",
      sku: "AC-RDG-8",
      description: "Pre-formed galvanised steel ridge cap, 8 feet.",
      unit: "per piece",
      mrp: 540,
      imageUrl: "https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=800"
    }
  ];

  for (const p of products) {
    const slug = p.sku.toLowerCase();
    const product = await prisma.product.create({
      data: {
        categoryId: p.categoryId,
        name: p.name,
        slug,
        sku: p.sku,
        description: p.description,
        unit: p.unit,
        imageUrl: p.imageUrl
      }
    });
    for (const tier of Object.keys(tierMultipliers) as Tier[]) {
      const price = Math.round(p.mrp * tierMultipliers[tier] * 100) / 100;
      await prisma.priceTier.create({
        data: { productId: product.id, tier, price, currency: "INR" }
      });
    }
  }

  await prisma.user.createMany({
    data: [
      { authId: "seed-admin", email: "admin@roofmate.test", name: "Asha Admin", role: Role.ADMIN, allowedTier: Tier.MRP },
      { authId: "seed-sales", email: "sales@roofmate.test", name: "Sam Sales", role: Role.SALES, allowedTier: Tier.MRP },
      { authId: "seed-dealer", email: "dealer@roofmate.test", name: "Dev Dealer", role: Role.DEALER, allowedTier: Tier.B2B },
      { authId: "seed-customer", email: "customer@roofmate.test", name: "Cara Customer", role: Role.CUSTOMER, allowedTier: Tier.B2C }
    ]
  });

  console.info("Seeded 3 categories, 9 products, 36 price rows, 4 demo users.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
