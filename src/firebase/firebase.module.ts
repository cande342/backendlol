import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseService } from './firebase.service';


@Module({
  providers: [
    FirebaseService,
    {
      provide: 'FIRESTORE',
      useFactory: async () => {
        const requiredEnvVars = [
          'FIREBASE_PROJECT_ID',
          'FIREBASE_PRIVATE_KEY',
          'FIREBASE_CLIENT_EMAIL',
        ];

        for (const envVar of requiredEnvVars) {
          if (!process.env[envVar]) {
            throw new Error(`La variable de entorno ${envVar} no está definida.`);
          }
        }

        const serviceAccount: admin.ServiceAccount = {
          projectId: process.env.FIREBASE_PROJECT_ID!,
          privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        };

        // Inicializar Firebase Admin SDK
        const app = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });

        return app.firestore();
      },
    },
  ],
  exports: ['FIRESTORE'],
})
export class FirebaseModule {}