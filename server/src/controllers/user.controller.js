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

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required'
      });
    }

    const user = await signUp(email, password, name);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        auth_id: user.id,
        db_user_id: user.db_user_id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to sign up'
    });
  }
}

// LOGIN
export async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await login(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        auth_id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid credentials'
    });
  }
}

// GET USER BY ID
export async function handleGetUser(req, res) {
  try {
    const { user_id } = req.params;

    const user = await getUserById(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get user'
    });
  }
}

// ADD FRIEND
export async function handleAddFriend(req, res) {
  try {
    const { user_id } = req.params;
    const { friend_id } = req.body;

    // Validation
    if (!friend_id) {
      return res.status(400).json({
        success: false,
        message: 'friend_id is required'
      });
    }

    // Prevent self-friending
    if (user_id === friend_id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot add yourself as a friend'
      });
    }

    const friendship = await addFriend(user_id, friend_id);

    res.status(201).json({
      success: true,
      message: 'Friend added successfully',
      data: friendship
    });
  } catch (error) {
    console.error('Add friend error:', error);
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

    await removeFriend(user_id, friend_id);

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

// GET FRIENDS (PAGINATED)
export async function handleGetFriends(req, res) {
  try {
    const { user_id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Validation
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page and limit must be positive integers'
      });
    }

    const friends = await getFriends(user_id, page, limit);

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