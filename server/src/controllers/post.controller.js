import {
  addReview,
  getPosts
} from '../db/queries.js';

// ADD REVIEW (automatically creates location if needed)
export async function handleAddReview(req, res) {
  try {
    const { user_id, description, image_url, rating, latitude, longitude, near_greenery } = req.body;

    if (!user_id || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'user_id, latitude, and longitude are required'
      });
    }

    if (!description && !image_url) {
      return res.status(400).json({
        success: false,
        message: 'Either description or image_url must be provided'
      });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const review = await addReview({
      user_id,
      description,
      image_url,
      rating,
      latitude,
      longitude,
      near_greenery: near_greenery || false  // Include near_greenery flag
    });

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add review'
    });
  }
}

// GET POSTS (PAGINATED)
export async function handleGetPosts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page and limit must be positive integers'
      });
    }

    if (limit > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit cannot exceed 100'
      });
    }

    const posts = await getPosts(page, limit);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        count: posts.length
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get posts'
    });
  }
}