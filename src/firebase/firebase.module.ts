import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseService } from './firebase.service';
import * as path from 'path';
import * as fs from 'fs';

@Module({
  providers: [
    FirebaseService,
    {
      provide: 'FIRESTORE',
      useFactory: async () => {
        const serviceAccountPath = path.join(process.cwd(), 'src/config/firebase-service-account.json');

        if (!fs.existsSync(serviceAccountPath)) {
          throw new Error(`❌ Firebase config file NOT FOUND at: ${serviceAccountPath}`);
        }

        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

        const app = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });

        return app.firestore();
      },
    },
  ],
  exports: [FirebaseService, 'FIRESTORE'],
})
export class FirebaseModule {}
