const mongoose = require('mongoose');
const Gym = require('../models/gyms');
const cities = require('./cities');
const { descriptors, places, gymNames, gymDescriptions } = require('./seedHelpers');

mongoose.connect('mongodb+srv://admin:0DZx9eOjTCsCmaGI@cluster0.bbwf7at.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected.");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Gym.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 100);
        const price = Math.floor(Math.random() * 50) * 10;
        const gym = new Gym({
            author: '664ef653edddad17b39df133',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${gymNames[i]}`,
            description: `${gymDescriptions[i]}`,
            price: price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dwv5is4e5/image/upload/v1716451850/GymReviews/i1moljthliib5sbdi7ea.jpg',
                    filename: 'GymReviews/i1moljthliib5sbdi7ea'
                },
                {
                    url: 'https://res.cloudinary.com/dwv5is4e5/image/upload/v1716451892/GymReviews/n8ko3w0ytnyv4yfylql2.jpg',
                    filename: 'GymReviews/n8ko3w0ytnyv4yfylql2'
                }
            ],
            geometry: {
                coordinates:
                    [
                        cities[random1000].longitude,
                        cities[random1000].latitude
                    ],
                type: 'Point'
            }
        });
        await gym.save();
    }
    const c = new Gym({ title: "empty" });
    await c.save();
}

seedDB().then(() => {
    mongoose.connection.close()
        .then(() => {
            console.log("connection closed.")
        });
});