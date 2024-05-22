const mongoose = require('mongoose');
const Gym = require('../models/gyms');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/gyms');

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
            author: '664bcac8a6bc4ad1ad6adb4a',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/6800490',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam temporibus consequatur ratione voluptate ea nihil voluptatum unde, magni modi ab laudantium consequuntur tempora. Harum omnis alias tempora nesciunt dicta rem?',
            price: price
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