// controllers/user.controller.js
import supabase from '../db/index.js';
import {
  signUp,
  login,
  getUserById,
  addFriend,
  removeFriend,
  getFriends
} from '../db/queries.js';

// SIGN UP
export async function handleSignUp(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const user = await signUp(email, password, name);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: user.id,
        db_user_id: user.db_user_id,
        email: user.email,
        name: name
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle duplicate email error
    if (error.message.includes('duplicate') || error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create user'
    });
  }
}

// LOGIN
export async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const authUser = await login(email, password);

    // Get the database user ID from the users table
    // Supabase auth returns the auth user, but we need to get the DB user
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (dbError) throw dbError;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: authUser.id,
        db_user_id: dbUser.id,
        email: authUser.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle invalid credentials
    if (error.message.includes('Invalid') || error.message.includes('credentials')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to login'
    });
  }
}

// GET USER BY ID
export async function handleGetUser(req, res) {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const user = await getUserById(parseInt(user_id));

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(404).json({
      success: false,
      message: error.message || 'User not found'
    });
  }
}

// ADD FRIEND
export async function handleAddFriend(req, res) {
  try {
    const { user_id } = req.params;
    const { friend_id } = req.body;

    if (!user_id || !friend_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID and friend ID are required'
      });
    }

    if (user_id === friend_id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot add yourself as a friend'
      });
    }

    const friendship = await addFriend(
      parseInt(user_id),
      parseInt(friend_id)
    );

    res.status(201).json({
      success: true,
      message: 'Friend added successfully',
      data: friendship
    });
  } catch (error) {
    console.error('Add friend error:', error);
    
    if (error.message.includes('duplicate') || error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        message: 'Friendship already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add friend'
    });
  }
}

// REMOVE FRIEND
export async function handleRemoveFriend(req, res) {
  try {
    const { user_id, friend_id } = req.params;

    if (!user_id || !friend_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID and friend ID are required'
      });
    }

    await removeFriend(parseInt(user_id), parseInt(friend_id));

    res.status(200).json({
      success: true,
      message: 'Friend removed successfully'
    });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to remove friend'
    });
  }
}

// GET FRIENDS
export async function handleGetFriends(req, res) {
  try {
    const { user_id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

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

    const friends = await getFriends(parseInt(user_id), page, limit);

    res.status(200).json({
      success: true,
      data: friends,
      pagination: {
        page,
        limit,
        count: friends.length
      }
    });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get friends'
    });
  }
}