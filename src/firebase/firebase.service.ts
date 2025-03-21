import { Inject, Injectable } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { CounterpickData } from 'src/dto/CounterpickData.dto';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class FirebaseService {
  private firestore: Firestore;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    const firebaseConfigPath = process.env.FIREBASE_CONFIG_PATH;
    if (!firebaseConfigPath) {
      throw new Error('La ruta de configuración de Firebase no está definida.');
    }
  
    // Usar process.cwd() como raíz del proyecto
    const configPath = path.join(process.cwd(), firebaseConfigPath);
  
    if (!fs.existsSync(configPath)) {
      throw new Error('El archivo de configuración de Firebase no se encuentra.');
    }
  
    // Verificar si Firebase ya está inicializado
    if (admin.apps.length === 0) {
      const serviceAccount = JSON.parse(fs.readFileSync(configPath, 'utf8'));
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
