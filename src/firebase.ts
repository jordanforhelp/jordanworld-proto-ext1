// Mock Firebase Auth and Firestore using localStorage
// This allows the app to run completely in-browser without Java dependencies or active cloud endpoints.

const STORAGE_KEY_USERS = 'linkflow_mock_users';
const STORAGE_KEY_AUTH = 'linkflow_mock_auth_user';

// Helper to access database
const getUsers = (): Record<string, any> => {
  const data = localStorage.getItem(STORAGE_KEY_USERS);
  if (!data) {
    // Pre-populate with a demo profile for convenience
    const demo = {
      uid: 'demo_user_uid',
      username: 'jordan',
      displayName: 'Jordan Smith',
      bio: 'Influencer & Creator. Sharing my daily lifestyle and tech gear tips.',
      pfpUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      email: 'jordan@creators.com',
      socials: {
        instagram: 'jordan_creates',
        youtube: '@jordan_tech',
        tiktok: 'jordan_vlogs',
        twitter: 'jordan_tweets'
      },
      links: [
        { id: '1', title: 'My Video Gear Setup 2026', url: 'https://amazon.com', clicks: 242 },
        { id: '2', title: 'Join My Discord Community', url: 'https://discord.gg', clicks: 1105 },
        { id: '3', title: 'Download Free Light Preset', url: 'https://gumroad.com', clicks: 88 }
      ],
      themeColor: '#4f46e5'
    };
    const initial = { jordan: demo };
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

const saveUsers = (users: Record<string, any>) => {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
};

// 1. Mock Auth Class
class MockAuth {
  currentUser: any = null;
  private listeners: Array<(user: any) => void> = [];

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY_AUTH);
    this.currentUser = saved ? JSON.parse(saved) : null;
  }

  onAuthStateChanged(callback: (user: any) => void) {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  triggerListeners() {
    this.listeners.forEach(l => l(this.currentUser));
  }
}

export const auth = new MockAuth();
export const db = {};
export const googleProvider = {
  setCustomParameters: () => {}
};

// Auth wrappers
export const onAuthStateChanged = (authInstance: MockAuth, callback: (user: any) => void) => {
  return authInstance.onAuthStateChanged(callback);
};

export const signOut = async (authInstance: MockAuth) => {
  authInstance.currentUser = null;
  localStorage.removeItem(STORAGE_KEY_AUTH);
  authInstance.triggerListeners();
};

export const signInWithEmailAndPassword = async (authInstance: MockAuth, email: string, password: string) => {
  const users = getUsers();
  // Find a user matching this email
  const matchedUser = Object.values(users).find((u: any) => u.email === email);
  if (!matchedUser) {
    throw new Error("No user found with this email. Please register first.");
  }
  
  authInstance.currentUser = {
    uid: matchedUser.uid,
    email: matchedUser.email,
    displayName: matchedUser.displayName || matchedUser.username,
    photoURL: matchedUser.pfpUrl || ''
  };
  localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authInstance.currentUser));
  authInstance.triggerListeners();
  return { user: authInstance.currentUser };
};

export const createUserWithEmailAndPassword = async (authInstance: MockAuth, email: string, password: string) => {
  const users = getUsers();
  const emailExists = Object.values(users).some((u: any) => u.email === email);
  if (emailExists) {
    throw new Error("Auth email already registered.");
  }
  
  const uid = 'uid_' + Math.random().toString(36).substring(2, 11);
  authInstance.currentUser = {
    uid,
    email,
    displayName: '',
    photoURL: ''
  };
  localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authInstance.currentUser));
  authInstance.triggerListeners();
  return { user: authInstance.currentUser };
};

export const signInWithPopup = async (authInstance: MockAuth, provider: any) => {
  // Mock Google sign-in by prompting for a user name
  const name = prompt("Google Sign-In Simulator:\nEnter your name to authorize with Google OAuth:", "Alex Rivera");
  if (name === null) {
    throw new Error("Sign-in cancelled by user.");
  }
  
  const email = name.toLowerCase().replace(/\s+/g, '') + "@gmail.com";
  const uid = 'google_uid_' + Math.random().toString(36).substring(2, 11);
  
  authInstance.currentUser = {
    uid,
    email,
    displayName: name,
    photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
  };
  localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authInstance.currentUser));
  authInstance.triggerListeners();
  return { user: authInstance.currentUser };
};

export const updateProfile = async (userInstance: any, profile: { displayName?: string, photoURL?: string }) => {
  if (auth.currentUser) {
    auth.currentUser = {
      ...auth.currentUser,
      displayName: profile.displayName || auth.currentUser.displayName,
      photoURL: profile.photoURL || auth.currentUser.photoURL
    };
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(auth.currentUser));
    auth.triggerListeners();
  }
};

// 2. Mock Firestore Classes
class MockDocRef {
  constructor(public collectionName: string, public docId: string) {}
}

class MockQuery {
  constructor(public collectionName: string, public constraints: any[]) {}
}

export const doc = (dbInstance: any, collectionName: string, docId: string) => {
  return new MockDocRef(collectionName, docId.toLowerCase());
};

export const getDoc = async (docRef: MockDocRef) => {
  const users = getUsers();
  const data = users[docRef.docId];
  return {
    exists: () => !!data,
    data: () => data || null
  };
};

export const setDoc = async (docRef: MockDocRef, data: any) => {
  const users = getUsers();
  users[docRef.docId] = data;
  saveUsers(users);
};

export const updateDoc = async (docRef: MockDocRef, data: any) => {
  const users = getUsers();
  if (!users[docRef.docId]) {
    throw new Error("Document not found");
  }
  users[docRef.docId] = {
    ...users[docRef.docId],
    ...data
  };
  saveUsers(users);
};

export const collection = (dbInstance: any, collectionName: string) => {
  return collectionName;
};

export const where = (field: string, op: string, value: any) => {
  return { field, op, value };
};

export const query = (collectionName: string, ...constraints: any[]) => {
  return new MockQuery(collectionName, constraints);
};

export const getDocs = async (queryObj: MockQuery) => {
  const users = getUsers();
  const results: any[] = [];
  
  // Find constraint for uid
  const uidConstraint = queryObj.constraints.find(c => c.field === 'uid');
  
  Object.values(users).forEach((u: any) => {
    if (uidConstraint) {
      if (u.uid === uidConstraint.value) {
        results.push({
          id: u.username,
          data: () => u
        });
      }
    } else {
      results.push({
        id: u.username,
        data: () => u
      });
    }
  });

  return {
    empty: results.length === 0,
    docs: results
  };
};
