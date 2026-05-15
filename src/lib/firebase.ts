import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore (Uses the default database)
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const code = (error as any)?.code;
  const message = error instanceof Error ? error.message : String(error);
  
  const errInfo: FirestoreErrorInfo = {
    error: message,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };

  console.error(`Firestore Error [${code || 'unknown'}]:`, message);
  console.debug('Detailed Error Info:', JSON.stringify(errInfo));
  
  if (code === 'unavailable' || message.includes('offline')) {
    console.warn("Firestore backend is currently unreachable. You may be offline or the database is starting up.");
    return;
  }

  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    // Try to get a non-existent document to check connection
    // We use getDocFromServer to bypass local cache
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    console.log("Firebase connection successful.");
  } catch (error: any) {
    const code = error.code;
    const message = error.message;

    if (code === 'permission-denied') {
      console.log("Firestore connection: Reachable (Permission Denied as expected).");
      return;
    }
    
    if (code === 'unavailable' || message?.includes('client is offline')) {
      console.warn(`Firebase Connection Warning: Offline or database not found. Retrying in background...`);
    } else {
      console.warn("Firebase Connection Check:", message || error);
    }
  }
}

// Only run connection test in development or once on load
if (typeof window !== 'undefined') {
  testConnection();
}
