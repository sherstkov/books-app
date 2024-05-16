import { initializeApp, getApps, FirebaseOptions } from '@firebase/app';
import { getFirestore } from '@firebase/firestore';
import { firebaseConfig } from './config';

/**
 * Initialize or return the already initialized Firebase app.
 * @param config Firebase config.
 * @returns Firebase app itself.
 */
function createFirebaseApp(config: FirebaseOptions) {
  if (!getApps().length) {
    // No Firebase apps have been initialized - initialize a new one.

    return initializeApp(config);
  } else {
    // An instance of Firebase app already exists, return it.
    return getApps()[0];
  }
}

const app = createFirebaseApp(firebaseConfig);
export const firestore = getFirestore(app);
