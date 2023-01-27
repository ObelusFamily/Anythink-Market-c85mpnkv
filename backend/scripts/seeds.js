//TODO: seeds script should come here, so we'll be able to put some data in our local env

//TODO: seeds script should come here, so we'll be able to put some data in our local env

const mongoose = require("mongoose");

require('../models/User');
require('../models/Item');
require('../models/Comment');

var Item = mongoose.model('Item');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

// connect MongoDB 
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
}
else {
    console.warn("Missing MONGODB URI in env");
}

let userId;
let itemId;

async function seedDatabase() {
    const users = Array.from(Array(100)).map((_item, index) => ({
        username: `fiakenames${index}`,
        email: `fakemail${index}${index}@anythink.com`,
        bio: 'testing bio',
        image: 'https://picsum.photos/200',
        role: 'user',
        favourites: [],
        following: [],
    }));

    for (let user of users) {
        const u = new User(user);

        const dbItem = await u.save();

        if (!userId) {
            userId = dbItem._id;
        }
    }

    const items = Array.from(Array(100)).map((_item, index) => ({
        slug: `fakeitems${index}`,
        title: `Fake item ${index}`,
        description: 'test description',
        image: 'https://picsum.photos/200',
        comments: [],
        tagList: ['test', 'tag'],
        seller: userId,
    }));

    for (item of items) {
        const it = new Item(item);

        const db = await it.save();
        if (!itemId) {
            itemId = db._id;
        }
    }

    const comments = Array.from(Array(100)).map((_item, index) => ({
        body: 'test body of comments',
        seller: userId,
        item: itemId,
    }));

    for (comment of comments) {
        const com = new Comment(comment);
        await com.save();
    }
}

seedDatabase().then(() => {
    process.exit();
}).catch((err) => {
    console.error(err);
    process.exit();
})