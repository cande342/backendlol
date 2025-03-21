import { Inject, Injectable } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { CounterpickData } from 'src/dto/CounterpickData.dto';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

@Injectable()
export class FirebaseService {
  private firestore: Firestore;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    const firebaseConfig = process.env.FIREBASE_CONFIG;

    if (!firebaseConfig) {
      throw new Error('La configuración de Firebase no está definida en las variables de entorno.');
    }
    if (admin.apps.length === 0) {
      const serviceAccount = JSON.parse(firebaseConfig);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    this.firestore = admin.firestore();
  }

  getFirestore(): Firestore {
    return this.firestore;
  }

  async getCollection(collection: string) {
    const snapshot = await this.firestore.collection(collection).get();
    return snapshot.docs.map(doc => doc.data());
  }

   // Método para obtener los mejores supports para un ADC
   async getBestSupportsForAdc(adc: string) {
    const doc = await this.firestore.collection('combinations').doc(adc).get();
    if (!doc.exists) {
      return [];
    }
    const data = doc.data();
    return data!.best_supports || [];
  }

  // Método para obtener los mejores ADCs para un Support
  async getBestAdcsForSupport(support: string) {
    const doc = await this.firestore.collection('combinations-supports').doc(support).get();
    if (!doc.exists) {
      return [];
    }
    const data = doc.data();
    return data!.best_supports || [];
  }

  // Método para obtener los mejores counters para un Mid Laner
  async getBestCountersForMidChamp(midChamp: string) {
    const doc = await this.firestore.collection('counterpick').doc(midChamp).get();
    
    if (!doc.exists) {
      return { name: midChamp, counters: [] };
    }

    const data = doc.data();
    return data ? data as CounterpickData : { name: midChamp, counters: [] };
  } 
}
