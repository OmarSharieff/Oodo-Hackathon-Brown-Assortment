// server/src/controllers/reviewController.js

import { addReview, getPosts } from '../db/queries.js';
import supabase from '../db/index.js';

// POST /api/reviews - Create a new review with image
export async function createReview(req, res) {
  try {
    const { user_id, description, rating, latitude, longitude } = req.body;

    // Validate required fields
    if (!user_id || !description || !rating || !latitude || !longitude) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['user_id', 'description', 'rating', 'latitude', 'longitude']
      });
    }

    let image_url = null;

    // Handle image upload if file exists
    if (req.file) {
      try {
        // Create unique filename
        const timestamp = Date.now();
        const filename = `${user_id}_${timestamp}.jpg`;
        const filePath = `reviews/${filename}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('review-images')
          .upload(filePath, req.file.buffer, {
            contentType: req.file.mimetype,
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('review-images')
          .getPublicUrl(filePath);

        image_url = publicUrl;
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return res.status(500).json({
          error: 'Failed to upload image',
          message: uploadError.message
        });
      }
    }

    // Create review using existing function
    const review = await addReview({
      user_id: parseInt(user_id),
      description,
      rating: parseFloat(rating),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      image_url
    });

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      error: 'Failed to create review',
      message: error.message
    });
  }
}

// GET /api/reviews - Get all reviews (paginated)
export async function getReviews(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const posts = await getPosts(page, limit);

    res.status(200).json({
      success: true,
      data: posts,
      page,
      limit
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      error: 'Failed to fetch reviews',
      message: error.message
    });
  }
}