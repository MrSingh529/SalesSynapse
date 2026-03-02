import { db } from '../src/services/firebase';
import { collection, addDoc } from 'firebase/firestore';

const seedData = async () => {
  // Add sample users
  const users = [
    {
      email: 'sales@example.com',
      name: 'John Salesperson',
      role: 'sales',
      managerEmail: 'manager@example.com',
      createdAt: new Date()
    },
    {
      email: 'manager@example.com',
      name: 'Sarah Manager',
      role: 'manager',
      createdAt: new Date()
    }
  ];

  for (const user of users) {
    await addDoc(collection(db, 'users'), user);
    console.log(`Added user: ${user.email}`);
  }

  console.log('Seed data added successfully!');
};

// Note: You'll need to run this from a Node.js environment