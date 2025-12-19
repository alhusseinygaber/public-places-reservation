// backend/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Clear existing data (optional, be careful in prod)
    // await prisma.venue.deleteMany({});

    const venues = [
        {
            name: 'Grand Egyptian Museum',
            description: 'The largest archaeological museum in the world dedicated to ancient Egyptian civilization.',
            address: 'Alexandria Desert Rd, Giza',
            province: 'Giza',
            type: 'Museum',
            price: 250.0,
            capacity: 5000,
            images: '../assets/museum.svg'
        },
        {
            name: 'Al-Azhar Park',
            description: 'A public park located in Cairo, offering panoramic views of the city.',
            address: 'Salah Salem St, Cairo',
            province: 'Cairo',
            type: 'Park',
            price: 40.0,
            capacity: 10000,
            images: '../assets/park.svg'
        },
        {
            name: 'Cairo International Stadium',
            description: 'The olympic-standard multi-use stadium.',
            address: 'Nasr City, Cairo',
            province: 'Cairo',
            type: 'Stadium',
            price: 100.0,
            capacity: 75000,
            images: '../assets/stadium.svg'
        },
        {
            name: 'Montaza Palace',
            description: 'A palace, museum and extensive gardens in the Montaza district of Alexandria.',
            address: 'Al Mandarah Bahri, Alexandria',
            province: 'Alexandria',
            type: 'Historical Site',
            price: 25.0,
            capacity: 2000,
            images: '../assets/palace.svg'
        },
        {
            name: 'Al Ahly Football Stadium',
            description: 'Modern football stadium home to Al Ahly club.',
            address: 'Al Ahly St, Cairo',
            province: 'Cairo',
            type: 'Football Stadium',
            price: 150.0,
            capacity: 30000,
            images: '../assets/stadium.svg'
        },
        {
            name: 'Cairo Swimming Pool',
            description: 'Olympic size swimming pool for public use.',
            address: 'Nile Corniche, Cairo',
            province: 'Cairo',
            type: 'Swimming Pool',
            price: 30.0,
            capacity: 200,
            images: '../assets/cairo_swimming_pool.jpg'
        },
        {
            name: 'Cinema City Mall',
            description: 'Multiplex cinema with latest movies.',
            address: 'Mall of Egypt, 6th of October',
            province: 'Giza',
            type: 'Cinema',
            price: 20.0,
            capacity: 500,
            images: '../assets/bg_generic.svg'
        },
        {
            name: 'Al-Masrah Theater',
            description: 'Historic theater for performances and shows.',
            address: 'Tahrir Square, Cairo',
            province: 'Cairo',
            type: 'Theater',
            price: 40.0,
            capacity: 800,
            images: '../assets/bg_generic.svg'
        },
        {
            name: 'Cairo Café',
            description: 'Cozy café with a variety of drinks and snacks.',
            address: 'Zamalek, Cairo',
            province: 'Cairo',
            type: 'Cafe',
            price: 15.0,
            capacity: 100,
            images: '../assets/bg_generic.svg'
        },
        {
            name: 'Giza Zoo',
            description: 'The historic zoological garden in Giza, Egypt.',
            address: 'Giza',
            province: 'Giza',
            type: 'Zoo',
            price: 10.0,
            capacity: 5000,
            images: '../assets/park.svg'
        },
        {
            name: 'Pyramids of Giza',
            description: 'The oldest of the Seven Wonders of the Ancient World.',
            address: 'Al Haram, Giza',
            province: 'Giza',
            type: 'Historical Site',
            price: 200.0,
            capacity: 10000,
            images: '../assets/pyramids_sphinx.jpg,../assets/pyramids_view.jpg'
        }
    ];

    for (const v of venues) {
        const existing = await prisma.venue.findFirst({ where: { name: v.name } });
        if (!existing) {
            await prisma.venue.create({ data: v });
            console.log(`Created venue: ${v.name}`);
        }
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
