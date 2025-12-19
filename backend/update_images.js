// backend/update_images.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const updates = [
        { name: 'Grand Egyptian Museum', image: '../assets/museum.svg' },
        { name: 'Al-Azhar Park', image: '../assets/park.svg' },
        { name: 'Cairo International Stadium', image: '../assets/stadium.svg' },
        { name: 'Montaza Palace', image: '../assets/palace.svg' },
        { name: 'Cairo Swimming Pool', image: '../assets/cairo_swimming_pool.jpg' },
        { name: 'Pyramids of Giza', image: '../assets/pyramids_sphinx.jpg,../assets/pyramids_view.jpg' },
        { name: 'Al Ahly Football Stadium', image: '../assets/stadium.svg' },
        { name: 'Giza Zoo', image: '../assets/park.svg' }
    ];

    console.log('Starting image update...');

    for (const u of updates) {
        // Log before update
        const existing = await prisma.venue.findFirst({ where: { name: u.name } });
        if (existing) {
            console.log(`Found ${u.name}, current images: ${existing.images}`);

            const res = await prisma.venue.updateMany({
                where: { name: u.name },
                data: { images: u.image }
            });
            console.log(`Updated images for ${u.name}: count=${res.count}`);
        } else {
            console.log(`Venue ${u.name} not found in database!`);
        }
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
