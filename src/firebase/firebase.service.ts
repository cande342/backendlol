import { Inject, Injectable } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { CounterpickData } from 'src/dto/CounterpickData.dto';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

interface ServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
}
dotenv.config(); 

@Injectable()
export class FirebaseService {
  private firestore: Firestore;

  constructor() {
    this.initializeFirebase();
  }



  private initializeFirebase() {
    try {
      if (admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          }),
        });
      }

      this.firestore = admin.firestore();
      console.log('Firebase inicializado correctamente');

    } catch (error) {
      console.error('Error al inicializar Firebase:', error);
      throw new Error('No se pudo inicializar Firebase. Revisa las variables de entorno.');
    }
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
