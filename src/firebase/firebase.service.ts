import { Inject, Injectable } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { CounterpickData } from 'src/dto/CounterpickData.dto';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config(); 

@Injectable()
export class FirebaseService {
  private firestore: Firestore;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    const firebaseConfig = process.env.FIREBASE_CONFIG;
  
    // Verificamos si la variable de entorno existe
    if (!firebaseConfig) {
      throw new Error('La configuración de Firebase no está definida en las variables de entorno.');
    }
  
    // Intentamos parsear el JSON de la variable de entorno
    let parsedConfig: any;
    try {
      parsedConfig = JSON.parse(firebaseConfig);
    } catch (error) {
      throw new Error('Error al parsear la configuración de Firebase.');
    }
  
    // Inicializamos Firebase solo si no se ha hecho previamente
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(parsedConfig),
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
