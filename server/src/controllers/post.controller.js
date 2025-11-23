import {
  addReview,
  getPosts,
  updatePostLikes
} from '../db/queries.js';
import supabase from '../db/index.js';

// ADD REVIEW with image upload support
export async function handleAddReview(req, res) {
  try {
    console.log('📝 Received review request');
    console.log('Body:', req.body);
    console.log('Has file:', !!req.file);
    if (req.file) {
      console.log('File details:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
    }
    const { user_id, description, rating, latitude, longitude } = req.body;

    if (!user_id || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'user_id, latitude, and longitude are required'
      });
    }

    if (!description && !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Either description or image must be provided'
      });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    let image_url = null;

    // Handle image upload if file exists
    if (req.file) {
      try {
        const timestamp = Date.now();
        const filename = `${user_id}_${timestamp}.jpg`;
        const filePath = `reviews/${filename}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, req.file.buffer, {
            contentType: req.file.mimetype,
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        image_url = publicUrl;
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image: ' + uploadError.message
        });
      }
    }

    const review = await addReview({
      user_id: parseInt(user_id),
      description,
      image_url,
      rating: rating ? parseFloat(rating) : null,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
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

export async function handleUpdatePostLikes(req, res) {
  try {
    const { post_id } = req.params;
    const { likes } = req.body;

    if (typeof likes !== 'number' || likes < 0) {
      return res.status(400).json({
        success: false,
        message: 'Likes count must be a non-negative number'
      });
    }

    const updatedPost = await updatePostLikes(post_id, likes);

    res.status(200).json({
      success: true,
      message: 'Post likes updated successfully',
      data: updatedPost
    });
  } catch (error) {
    console.error('Update likes error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update likes'
    });
  }
}

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