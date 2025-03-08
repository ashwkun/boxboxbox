import { 
  doc, 
  collection,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from '../firebase';

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string | null;
  bio?: string;
  joinedAt: Date;
  followersCount: number;
  followingCount: number;
}

export interface Activity {
  id: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL: string | null;
  type: 'rating' | 'watch' | 'follow' | 'share';
  mediaId?: number;
  mediaType?: 'movie' | 'tv';
  mediaTitle?: string;
  mediaPosterPath?: string;
  rating?: {
    mood: string;
    wouldRewatch: boolean;
  };
  sharedListId?: string;
  sharedListTitle?: string;
  targetUserId?: string;
  targetUserDisplayName?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  type: 'follow' | 'share' | 'mention';
  fromUserId: string;
  fromUserDisplayName: string;
  fromUserPhotoURL: string | null;
  read: boolean;
  createdAt: Date;
  sharedListId?: string;
  sharedListTitle?: string;
}

// Follow a user
export const followUser = async (userId: string, targetUserId: string): Promise<void> => {
  if (userId === targetUserId) throw new Error('Cannot follow yourself');

  const followingRef = doc(db, 'users', userId, 'following', targetUserId);
  const followerRef = doc(db, 'users', targetUserId, 'followers', userId);
  const userDoc = await getDoc(doc(db, 'users', userId));
  
  if (!userDoc.exists()) throw new Error('User not found');
  
  const userData = userDoc.data();
  
  // Create following document
  await setDoc(followingRef, {
    userId: targetUserId,
    createdAt: serverTimestamp()
  });
  
  // Create follower document
  await setDoc(followerRef, {
    userId,
    displayName: userData?.displayName,
    photoURL: userData?.photoURL,
    createdAt: serverTimestamp()
  });
  
  // Create activity
  await createActivity({
    userId,
    userDisplayName: userData?.displayName || '',
    userPhotoURL: userData?.photoURL || null,
    type: 'follow',
    targetUserId,
    targetUserDisplayName: (await getDoc(doc(db, 'users', targetUserId))).data()?.displayName || ''
  });
  
  // Create notification
  await createNotification(targetUserId, {
    type: 'follow',
    fromUserId: userId,
    fromUserDisplayName: userData?.displayName || '',
    fromUserPhotoURL: userData?.photoURL || null
  });
};

// Unfollow a user
export const unfollowUser = async (userId: string, targetUserId: string): Promise<void> => {
  const followingRef = doc(db, 'users', userId, 'following', targetUserId);
  const followerRef = doc(db, 'users', targetUserId, 'followers', userId);
  
  await deleteDoc(followingRef);
  await deleteDoc(followerRef);
};

// Check if following
export const isFollowing = async (userId: string, targetUserId: string): Promise<boolean> => {
  const followingRef = doc(db, 'users', userId, 'following', targetUserId);
  const docSnap = await getDoc(followingRef);
  return docSnap.exists();
};

// Get user's followers
export const getFollowers = async (userId: string): Promise<UserProfile[]> => {
  const followersRef = collection(db, 'users', userId, 'followers');
  const querySnapshot = await getDocs(followersRef);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      uid: doc.id,
      ...data
    } as UserProfile;
  });
};

// Get users being followed
export const getFollowing = async (userId: string): Promise<UserProfile[]> => {
  const followingRef = collection(db, 'users', userId, 'following');
  const querySnapshot = await getDocs(followingRef);
  
  const following = await Promise.all(
    querySnapshot.docs.map(async doc => {
      const userDoc = await getDoc(doc(db, 'users', doc.id));
      if (!userDoc.exists()) return null;
      const data = userDoc.data();
      return data ? { uid: doc.id, ...data } as UserProfile : null;
    })
  );
  
  return following.filter((profile): profile is UserProfile => profile !== null);
};

// Create activity
export const createActivity = async (activity: Omit<Activity, 'id' | 'createdAt'>): Promise<void> => {
  const activityRef = doc(collection(db, 'activity'));
  
  await setDoc(activityRef, {
    ...activity,
    id: activityRef.id,
    createdAt: serverTimestamp()
  });
};

// Get activity feed
export const getActivityFeed = async (userId: string, itemLimit = 20): Promise<Activity[]> => {
  // Get users being followed
  const following = await getFollowing(userId);
  const userIds = [userId, ...following.map(f => f.uid)];
  
  const activityRef = collection(db, 'activity');
  const q = query(
    activityRef,
    where('userId', 'in', userIds),
    orderBy('createdAt', 'desc'),
    limit(itemLimit)
  );
  
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      createdAt: (data.createdAt as Timestamp).toDate()
    } as Activity;
  });
};

// Create notification
export const createNotification = async (
  userId: string,
  notification: Omit<Notification, 'id' | 'createdAt' | 'read'>
): Promise<void> => {
  const notificationRef = doc(collection(db, 'users', userId, 'notifications'));
  
  await setDoc(notificationRef, {
    ...notification,
    id: notificationRef.id,
    read: false,
    createdAt: serverTimestamp()
  });
};

// Get notifications
export const getNotifications = async (userId: string): Promise<Notification[]> => {
  const notificationsRef = collection(db, 'users', userId, 'notifications');
  const q = query(notificationsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      createdAt: (data.createdAt as Timestamp).toDate()
    } as Notification;
  });
};

// Mark notification as read
export const markNotificationAsRead = async (userId: string, notificationId: string): Promise<void> => {
  const notificationRef = doc(db, 'users', userId, 'notifications', notificationId);
  await setDoc(notificationRef, { read: true }, { merge: true });
};

// Share a list
export const shareList = async (
  userId: string,
  targetUserId: string,
  listId: string,
  listTitle: string
): Promise<void> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) throw new Error('User not found');
  
  const userData = userDoc.data();
  
  // Create activity
  await createActivity({
    userId,
    userDisplayName: userData?.displayName || '',
    userPhotoURL: userData?.photoURL || null,
    type: 'share',
    targetUserId,
    targetUserDisplayName: (await getDoc(doc(db, 'users', targetUserId))).data()?.displayName || '',
    sharedListId: listId,
    sharedListTitle: listTitle
  });
  
  // Create notification
  await createNotification(targetUserId, {
    type: 'share',
    fromUserId: userId,
    fromUserDisplayName: userData?.displayName || '',
    fromUserPhotoURL: userData?.photoURL || null,
    sharedListId: listId,
    sharedListTitle: listTitle
  });
}; 