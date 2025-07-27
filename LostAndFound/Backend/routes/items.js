const express = require('express');
const Item = require('../models/Item');
const { verifyToken } = require('../middleware/auth.js');
const upload = require('../utils/multer'); // Import multer configuration
const fs = require('fs');
const LostItem = require('../models/LostItem');
const cloudinary = require('../utils/cloudinary');
const FoundItem = require('../models/FoundItem');

const router = express.Router();

// Report Lost Item
router.post('/lost', upload.array('images', 5), async (req, res) => {
    try {
        const uploadedImages = [];
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path);
            uploadedImages.push(result.secure_url);
            fs.unlinkSync(file.path); // Remove file from local storage
        }

        const newItem = new LostItem({
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            contact: req.body.contact,
            images: uploadedImages,
            postedBy: req.body.user,
        });

        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error reporting lost item', error: error.message });
    }
});


// Similarly, add for Found Items
router.post('/found', upload.array('images', 5), async (req, res) => {
    try {
        const uploadedImages = [];
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path);
            uploadedImages.push(result.secure_url);
            fs.unlinkSync(file.path);
        }

        const newItem = new FoundItem({
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            contact: req.body.contact,
            images: uploadedImages,
            postedBy: req.body.user,
        });

        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error reporting found item', error: error.message });
    }
});

// Fetch Lost Items
router.get('/lost', async (req, res) => {
    try {
        const items = await LostItem.find({});
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lost items', error: error.message });
    }
});

// Fetch Found Items
router.get('/found', async (req, res) => {
    try {
        const items = await FoundItem.find({});
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching found items', error: error.message });
    }
});

// Claim Lost Item
router.put("/lost/claim/:id", verifyToken, async (req, res) => {
    try {
        const itemId = req.params.id;
        const item = await LostItem.findById(itemId);

        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }

        if (item.isClaimed) {
            return res.status(400).json({ error: "Item already claimed" });
        }

        // Make sure the user is not claiming their own item
        // if (item.postedBy.toString() === req.user.id.toString()) {
        //     return res.status(400).json({ error: "You cannot claim your own item" });
        // }

        // Mark the item as claimed
        item.isClaimed = true;

        await item.save();

        res.status(200).json(item);
    } catch (error) {
        console.error("Error claiming lost item:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Claim Found Item
router.put("/found/claim/:id", verifyToken, async (req, res) => {
    try {
        const itemId = req.params.id;
        const item = await FoundItem.findById(itemId);

        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }

        if (item.isClaimed) {
            return res.status(400).json({ error: "Item already claimed" });
        }

        // Make sure the user is not claiming their own item
        // if (item.postedBy.toString() === req.user.id.toString()) {
        //     return res.status(400).json({ error: "You cannot claim your own item" });
        // }

        // Mark the item as claimed
        item.isClaimed = true;

        await item.save();

        res.status(200).json(item);
    } catch (error) {
        console.error("Error claiming found item:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// delete lost item 
router.delete('/lost/:id', verifyToken, async (req, res) => {
    try {
        const item = await LostItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check if the user is the owner
        // if (item.user.toString() !== req.user.id) {
        //     return res.status(403).json({ message: 'Unauthorized to delete this item' });
        // }

        // Remove images from Cloudinary
        // for (let image of item.images) {
        //     await cloudinary.uploader.destroy(image.public_id);
        // }

        await item.deleteOne();
        res.status(200).json({ message: 'Lost item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// delete found item 
router.delete('/found/:id', verifyToken, async (req, res) => {
    try {
        const item = await FoundItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check if the user is the owner
        // if (item.user.toString() !== req.user.id) {
        //     return res.status(403).json({ message: 'Unauthorized to delete this item' });
        // }

        // Remove images from Cloudinary
        // for (let image of item.images) {
        //     await cloudinary.uploader.destroy(image.public_id);
        // }

        await item.deleteOne();
        res.status(200).json({ message: 'Found item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
