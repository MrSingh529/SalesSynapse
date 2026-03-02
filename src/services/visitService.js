import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { generateVisitInsights, generateActionableItems } from './openAIService'; // AI functions

const VISITS_COLLECTION = 'visits';
const USERS_COLLECTION = 'users';

export const createVisit = async (visitData, userId, userEmail) => {
  try {
    // Create timestamp BEFORE creating document
    const timestamp = Timestamp.now();
    
    const visitWithMeta = {
      ...visitData,
      salesPersonId: userId,
      salesPersonEmail: userEmail,
      createdAt: timestamp,
      updatedAt: timestamp,
      status: 'submitted',
      aiProcessed: false, // Will be true if AI runs successfully
      // Ensure expenses are stored properly
      expenses: {
        travel: parseFloat(visitData.expenses?.travel) || 0,
        food: parseFloat(visitData.expenses?.food) || 0,
        accommodation: parseFloat(visitData.expenses?.accommodation) || 0,
        miscellaneous: parseFloat(visitData.expenses?.miscellaneous) || 0,
        total: parseFloat(visitData.totalExpenses) || 0
      }
    };

    const docRef = await addDoc(collection(db, VISITS_COLLECTION), visitWithMeta);
    
    // Get manager's email for notification
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
    const userData = userDoc.data();
    
    if (userData.managerEmail) {
      await addDoc(collection(db, 'notifications'), {
        type: 'new_visit',
        managerEmail: userData.managerEmail,
        salesPersonEmail: userEmail,
        visitId: docRef.id,
        companyName: visitData.companyName,
        createdAt: Timestamp.now(),
        read: false
      });
    }

    // Trigger AI processing in the background (fire-and-forget)
    if (process.env.REACT_APP_OPENAI_API_KEY) {
      // Mark as processing (optional: you can update later on success)
      updateDoc(docRef, { aiProcessed: 'processing' }).catch(console.error);

      Promise.all([
        generateVisitInsights(visitData, 'sales').catch(err => {
          console.error('Failed to generate insights:', err);
          return null;
        }),
        generateActionableItems(visitData).catch(err => {
          console.error('Failed to generate actionable items:', err);
          return [];
        })
      ])
      .then(([insights, actionable]) => {
        if (insights || actionable.length > 0) {
          return addDoc(collection(db, 'ai_insights'), {
            visitId: docRef.id,
            insights,
            actionable: actionable || [],
            generatedAt: Timestamp.now(),
            salesPersonId: userId,
            salesPersonEmail: userEmail
          });
        }
      })
      .then(() => {
        // Mark AI as fully processed
        updateDoc(docRef, { aiProcessed: true }).catch(console.error);
      })
      .catch(err => {
        console.error('Error saving AI insights:', err);
        // Still mark as processed=false or 'failed' if needed
        updateDoc(docRef, { aiProcessed: false }).catch(console.error);
      });
    }

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating visit:', error);
    return { success: false, error: error.message };
  }
};

export const getVisitsBySalesPerson = async (userId, filters = {}) => {
  try {
    console.log('Fetching visits for user ID:', userId);
    
    let visitsQuery = query(
      collection(db, VISITS_COLLECTION),
      where('salesPersonId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    if (filters.startDate && filters.endDate) {
      visitsQuery = query(
        visitsQuery,
        where('createdAt', '>=', Timestamp.fromDate(new Date(filters.startDate))),
        where('createdAt', '<=', Timestamp.fromDate(new Date(filters.endDate)))
      );
    }

    if (filters.companyName) {
      visitsQuery = query(visitsQuery, where('companyName', '==', filters.companyName));
    }

    const querySnapshot = await getDocs(visitsQuery);
    const visits = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, visits };
  } catch (error) {
    console.error('Error fetching visits:', error);
    return { success: false, error: error.message };
  }
};

export const getAllVisits = async (filters = {}) => {
  try {
    let visitsQuery = query(
      collection(db, VISITS_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    if (filters.salesPersonId) {
      visitsQuery = query(visitsQuery, where('salesPersonId', '==', filters.salesPersonId));
    }

    const querySnapshot = await getDocs(visitsQuery);
    const visits = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, visits };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get a single visit by ID
export const getVisitById = async (visitId) => {
  try {
    const visitDoc = await getDoc(doc(db, VISITS_COLLECTION, visitId));
    
    if (visitDoc.exists()) {
      return { 
        success: true, 
        visit: { id: visitDoc.id, ...visitDoc.data() } 
      };
    } else {
      return { success: false, error: 'Visit not found' };
    }
  } catch (error) {
    console.error('Error fetching visit details:', error);
    return { success: false, error: error.message };
  }
};

// Update an existing visit
export const updateVisit = async (visitId, visitData) => {
  try {
    const visitRef = doc(db, VISITS_COLLECTION, visitId);
    
    const visitWithMeta = {
      ...visitData,
      updatedAt: serverTimestamp(),
      // Ensure expenses are stored properly during update
      expenses: {
        travel: parseFloat(visitData.expenses?.travel) || 0,
        food: parseFloat(visitData.expenses?.food) || 0,
        accommodation: parseFloat(visitData.expenses?.accommodation) || 0,
        miscellaneous: parseFloat(visitData.expenses?.miscellaneous) || 0,
        total: parseFloat(visitData.totalExpenses) || 0
      }
    };

    // If actionable items changed, you might want to re-run AI in the background
    // (Similar logic to createVisit can be applied here if desired)

    await updateDoc(visitRef, visitWithMeta);
    return { success: true };
  } catch (error) {
    console.error('Error updating visit:', error);
    return { success: false, error: error.message };
  }
};