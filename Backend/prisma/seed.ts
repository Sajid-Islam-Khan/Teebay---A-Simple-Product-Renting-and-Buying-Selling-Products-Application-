import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const categories = [
        { name: 'ELECTRONICS' },
        { name: 'FURNITURE' },
        { name: 'HOME APPLIANCES' },
        { name: 'SPORTING GOODS' },
        { name: 'OUTDOOR' },
        { name: 'TOYS' },
    ];

    for (const category of categories) {
        await prisma.category.upsert({
            where: { name: category.name },
            update: {},
            create: { name: category.name },
        });
    }

    console.log('Categories seeded!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
