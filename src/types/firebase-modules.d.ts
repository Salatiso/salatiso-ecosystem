// Type declarations for Firebase modules
// This file provides type stubs for Firebase packages when types are missing

declare module 'firebase/app' {
  export interface FirebaseApp {
    name: string;
    automaticDataCollectionEnabled: boolean;
  }
  
  export function initializeApp(options: any, name?: string): FirebaseApp;
  export function getApp(name?: string): FirebaseApp;
  export function getApps(): FirebaseApp[];
  export function deleteApp(app: FirebaseApp): Promise<void>;
}

declare module 'firebase/auth' {
  export interface Auth {
    [key: string]: any;
  }
  
  export function getAuth(app?: any): Auth;
}

declare module 'firebase/firestore' {
  export interface Firestore {
    [key: string]: any;
  }
  
  export interface CollectionReference {
    [key: string]: any;
  }
  
  export interface Query {
    [key: string]: any;
  }
  
  export function getFirestore(app?: any): Firestore;
  export function collection(firestore: Firestore, path: string): CollectionReference;
  export function query(q: any, ...constraints: any[]): Query;
  export function where(field: string, operator: string, value: any): any;
  export function orderBy(field: string, direction?: 'asc' | 'desc'): any;
  export function limit(n: number): any;
  export function getDocs(query: Query): Promise<any>;
  export function getDoc(doc: any): Promise<any>;
  export function addDoc(collection: any, data: any): Promise<any>;
  export function updateDoc(doc: any, data: any): Promise<void>;
  export function deleteDoc(doc: any): Promise<void>;
  export function doc(firestore: Firestore, path: string, id?: string): any;
  export function writeBatch(firestore: Firestore): any;
  export function onSnapshot(query: any, callback: any, errorCallback?: any): any;
  export class Timestamp {
    toDate(): Date;
    static now(): Timestamp;
    static fromDate(date: Date): Timestamp;
  }
}

declare module 'firebase/storage' {
  export interface FirebaseStorage {
    [key: string]: any;
  }
  
  export function getStorage(app?: any): FirebaseStorage;
  export function ref(storage: FirebaseStorage, path: string): any;
  export function uploadBytes(ref: any, data: any): Promise<any>;
  export function getBytes(ref: any): Promise<any>;
  export function getDownloadURL(ref: any): Promise<string>;
}

declare module 'firebase/analytics' {
  export function getAnalytics(app?: any): any;
}

declare module 'firebase/messaging' {
  export function getMessaging(app?: any): any;
}

declare module 'firebase/functions' {
  export function getFunctions(app?: any, region?: string): any;
  export function httpsCallable(functions: any, name: string): any;
}
