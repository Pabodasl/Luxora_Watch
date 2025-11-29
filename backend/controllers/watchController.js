const Watch = require('../models/Watch');

// Get all watches
const getAllWatches = async (req, res) => {
  try {
    const watches = await Watch.find().sort({ createdAt: -1 });
    res.json(watches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single watch
const getWatchById = async (req, res) => {
  try {
    const watch = await Watch.findById(req.params.id);
    if (!watch) {
      return res.status(404).json({ message: 'Watch not found' });
    }
    res.json(watch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new watch (Admin only)
const createWatch = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    // Parse JSON fields if they're strings
    const colorVariants = req.body.colorVariants 
      ? (typeof req.body.colorVariants === 'string' 
          ? JSON.parse(req.body.colorVariants) 
          : req.body.colorVariants)
      : [];

    // Handle main image
    let mainImage = '';
    if (req.files?.mainImage?.[0]) {
      mainImage = req.files.mainImage[0].filename;
    }

    // Handle color variant images
    const colorVariantImages = req.files?.colorImages || [];
    const updatedColorVariants = colorVariants.map((variant, index) => {
      if (colorVariantImages[index]) {
        return {
          ...variant,
          image: colorVariantImages[index].filename
        };
      }
      return variant;
    });

    const watch = new Watch({
      name: req.body.name || req.body.category || 'Unnamed Watch',
      category: req.body.category || 'Rolex',
      price: req.body.price,
      mainImage: mainImage,
      colorVariants: updatedColorVariants,
      availability: req.body.availability || 'Available',
      description: req.body.description || '',
      customerName: req.body.customerName?.trim() || 'LUXORA Client'
    });

    console.log('Saving watch:', watch);
    await watch.save();
    console.log('Watch saved successfully');
    
    // Return the saved watch with populated data
    const savedWatch = await Watch.findById(watch._id);
    res.status(201).json(savedWatch);
  } catch (error) {
    console.error('Error creating watch:', error);
    res.status(400).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update watch (Admin only)
const updateWatch = async (req, res) => {
  try {
    console.log('Update request body:', req.body);
    console.log('Update request files:', req.files);

    const { name, category, price, colorVariants, availability, description, customerName } = req.body;
    
    // Parse colorVariants if it's a string
    const parsedColorVariants = colorVariants 
      ? (typeof colorVariants === 'string' 
          ? JSON.parse(colorVariants) 
          : colorVariants)
      : [];

    const updateData = {
      name,
      category: category || 'Rolex',
      price,
      colorVariants: parsedColorVariants,
      availability: availability || 'Available',
      description: description || '',
      customerName: customerName?.trim() || 'LUXORA Client',
      updatedAt: new Date()
    };

    // Handle main image update
    if (req.files?.mainImage?.[0]?.filename) {
      updateData.mainImage = req.files.mainImage[0].filename;
    }

    // Handle color variant images update
    if (req.files?.colorImages && req.files.colorImages.length > 0) {
      const colorVariantImages = req.files.colorImages;
      
      // Update color variants with new images
      updateData.colorVariants = parsedColorVariants.map((variant, index) => {
        if (colorVariantImages[index]) {
          return {
            ...variant,
            image: colorVariantImages[index].filename
          };
        }
        return variant;
      });
    }

    console.log('Updating watch with data:', updateData);

    const watch = await Watch.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!watch) {
      return res.status(404).json({ message: 'Watch not found' });
    }

    res.json(watch);
  } catch (error) {
    console.error('Error updating watch:', error);
    res.status(400).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Delete watch (Admin only)
const deleteWatch = async (req, res) => {
  try {
    const watch = await Watch.findByIdAndDelete(req.params.id);
    if (!watch) {
      return res.status(404).json({ message: 'Watch not found' });
    }
    res.json({ message: 'Watch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllWatches,
  getWatchById,
  createWatch,
  updateWatch,
  deleteWatch
};