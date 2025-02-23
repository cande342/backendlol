import { Inject, Injectable } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';

@Injectable()
export class FirebaseService {
  constructor(@Inject('FIRESTORE') private firestore: Firestore) {}

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
}
