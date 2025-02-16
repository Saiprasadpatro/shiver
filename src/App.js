// Backend Utilities and Mock Database
class Database {
  constructor() {
      this.users = [];
      this.posts = [];
      this.stories = [];
  }

  // Generic database operations
  create(collection, item) {
      try {
          // Add unique ID
          item.id = this.generateUniqueId();
          
          // Add timestamp
          item.createdAt = new Date().toISOString();

          // Add to appropriate collection
          switch(collection) {
              case 'users':
                  this.users.push(item);
                  break;
              case 'posts':
                  this.posts.push(item);
                  break;
              case 'stories':
                  this.stories.push(item);
                  break;
          }

          return { success: true, data: item };
      } catch (error) {
          return { error: error.message };
      }
  }

  read(collection, query) {
      try {
          let results;
          function filterCollection(collectionName, query) {
            const collections = {
              users: this.users,
              posts: this.posts,
              stories: this.stories
            };
          
            const collection = collections[collectionName];
            
            if (!collection) {
              throw new Error(`Collection '${collectionName}' not found.`);
            }
          
            return collection.filter(item =>
              Object.keys(query).every(key => item[key] === query[key])
            );
          }
          
          // Usage
          try {
            const results = filterCollection('users', query);
            console.log(results);
          } catch (error) {
            console.error(error.message);
          }
          return { success: true, data: results };
      } catch (error) {
          return { error: error.message };
      }
  }

  update(collection, id, updates) {
      try {
          let itemToUpdate;
          function findItemById(collectionName, id) {
            const collections = {
              users: this.users,
              posts: this.posts,
              stories: this.stories
            };
          
            const collection = collections[collectionName];
          
            if (!collection) {
              throw new Error(`Collection '${collectionName}' not found.`);
            }
          
            return collection.find(item => item.id === id);
          }
          
          // Usage
          try {
            const itemToUpdate = findItemById('users', id);
            if (itemToUpdate) {
              console.log('Item found:', itemToUpdate);
            } else {
              console.log('Item not found.');
            }
          } catch (error) {
            console.error(error.message);
          }

          if (itemToUpdate) {
              Object.assign(itemToUpdate, updates);
              return { success: true, data: itemToUpdate };
          }
          return { error: 'Item not found' };
      } catch (error) {
          return { error: error.message };
      }
  }

  delete(collection, id) {
      try {
          let index;
          function removeItemById(collectionName, id) {
            const collections = {
              users: this.users,
              posts: this.posts,
              stories: this.stories
            };
          
            const collection = collections[collectionName];
          
            if (!collection) {
              throw new Error(`Collection '${collectionName}' not found.`);
            }
          
            const index = collection.findIndex(item => item.id === id);
            
            if (index !== -1) {
              collection.splice(index, 1);
              return true;  // Indicate that the item was successfully removed
            }
            
            return false; // Indicate that the item was not found
          }
          
          // Usage
          try {
            const wasRemoved = removeItemById('users', id);
            console.log(wasRemoved ? 'Item removed successfully.' : 'Item not found.');
          } catch (error) {
            console.error(error.message);
          }
          return { success: true };
      } catch (error) {
          return { error: error.message };
      }
  }

  generateUniqueId() {
      return Math.random().toString(36).substr(2, 9);
  }
}

// Authentication and Security Utilities
class AuthService {
  // Simple password hashing (not cryptographically secure - use a proper library in production)
  static async hashPassword(password) {
      // In a real app, use bcrypt or similar
      const salt = 'SomeRandomSalt';
      return btoa(password + salt);
  }

  static async verifyPassword(inputPassword, storedPassword) {
      const hashedInput = await this.hashPassword(inputPassword);
      return hashedInput === storedPassword;
  }

  static calculateAge(dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      
      if (monthDifference < 0 || 
          (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
      
      return age;
  }

  static generateVerificationToken() {
      return Math.random().toString(36).substring(2, 15) + 
             Math.random().toString(36).substring(2, 15);
  }
}

// Email Service (Mock implementation)
class EmailService {
  static async sendVerificationEmail(email, token) {
      // In a real app, this would integrate with an email service
      console.log(`Verification email sent to ${email} with token: ${token}`);
      return true;
  }
}

// Global Database Instance
const db = new Database();

// Expanded Backend Functions
async function dbOperation(operation, collection, data, id = null) {
  switch(operation) {
      case 'create':
          return db.create(collection, data);
      case 'read':
          return db.read(collection, data);
      case 'update':
          return db.update(collection, id, data);
      case 'delete':
          return db.delete(collection, id);
      default:
          return { error: 'Invalid operation' };
  }
}

async function signup(email, password, dateOfBirth) {
  // Verify age
  const age = AuthService.calculateAge(dateOfBirth);
  if (age < 18) {
      throw new Error('You must be 18 or older to sign up');
  }

  // Check if user already exists
  const existingUser = await dbOperation('read', 'users', { email });
  if (existingUser.data.length > 0) {
      throw new Error('User already exists');
  }

  // Create user
  const hashedPassword = await AuthService.hashPassword(password);
  const verificationToken = AuthService.generateVerificationToken();

  const userData = {
      email,
      password: hashedPassword,
      dateOfBirth,
      verified: false,
      verificationToken,
      createdAt: new Date().toISOString()
  };

  const result = await dbOperation('create', 'users', userData);
  
  // Send verification email
  if (result.success) {
      await EmailService.sendVerificationEmail(email, verificationToken);
  }

  return result;
}

async function login(email, password) {
  const userResult = await dbOperation('read', 'users', { email });
  
  if (userResult.data.length === 0) {
      throw new Error('User not found');
  }

  const user = userResult.data[0];

  // Check verification status
  if (!user.verified) {
      throw new Error('Please verify your email first');
  }

  // Verify password
  const isPasswordValid = await AuthService.verifyPassword(password, user.password);
  
  if (!isPasswordValid) {
      throw new Error('Invalid password');
  }

  return user;
}

async function verifyEmail(email, token) {
  const userResult = await dbOperation('read', 'users', { email });
  
  if (userResult.data.length === 0) {
      throw new Error('User not found');
  }

  const user = userResult.data[0];

  if (user.verificationToken === token) {
      await dbOperation('update', 'users', { verified: true }, user.id);
      return true;
  }

  throw new Error('Invalid verification token');
}

async function createPost(userId, content, mediaUrl = null) {
  const postData = {
      userId,
      content,
      mediaUrl,
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString()
  };

  return await dbOperation('create', 'posts', postData);
}

async function createStory(userId, mediaUrl) {
  const storyData = {
      userId,
      mediaUrl,
      views: 0,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      createdAt: new Date().toISOString()
  };

  return await dbOperation('create', 'stories', storyData);
}

// Utility Error Handling
function handleError(error) {
  console.error('Operation failed:', error.message);
  // In a real app, this would log to a service and potentially notify the user
  return {
      success: false,
      message: error.message
  };
}

// Export functions for use in the frontend
window.BackendServices = {
  signup,
  login,
  verifyEmail,
  createPost,
  createStory,
  handleError
};