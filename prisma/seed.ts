import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const provinces = [
    {
      name: 'DKI Jakarta',
      cities: ['Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Barat', 'Jakarta Timur', 'Jakarta Utara'],
    },
    {
      name: 'Jawa Barat',
      cities: ['Bandung', 'Bekasi', 'Bogor', 'Depok', 'Cimahi'],
    },
    {
      name: 'Jawa Tengah',
      cities: ['Semarang', 'Solo', 'Yogyakarta', 'Magelang', 'Salatiga'],
    },
    {
      name: 'Jawa Timur',
      cities: ['Surabaya', 'Malang', 'Sidoarjo', 'Gresik', 'Mojokerto'],
    },
    {
      name: 'Banten',
      cities: ['Tangerang', 'Serang', 'Cilegon', 'South Tangerang'],
    },
  ];

  for (const p of provinces) {
    const province = await prisma.province.create({
      data: {
        name: p.name,
        cities: {
          create: p.cities.map((name) => ({ name })),
        },
      },
    });
    console.log(`Created province: ${province.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });