// src/services/userService.js

import { db } from '../connection/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const getUsersByIds = async (userIds) => {
  const userMap = {};
  const userPromises = userIds.map(async (userId) => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      userMap[userId] = userDoc.data();
    }
  });
  await Promise.all(userPromises);
  return userMap;
};
