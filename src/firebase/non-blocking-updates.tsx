'use client';
    
import {
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  DocumentReference,
  SetOptions,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import {FirestorePermissionError} from '@/firebase/errors';

/**
 * Initiates a setDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function setDocumentNonBlocking(docRef: DocumentReference, data: any, options: SetOptions) {
  setDoc(docRef, data, options).catch(error => {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: docRef.path,
        operation: 'write', // or 'create'/'update' based on options
        requestResourceData: data,
      })
    )
  })
  // Execution continues immediately
}


/**
 * Initiates an addDoc operation for a collection reference.
 * If a docRef is provided, it uses setDoc to write to that specific document ID.
 * Otherwise, it uses addDoc to auto-generate an ID.
 * Does NOT await the write operation internally.
 * Returns the Promise, but typically not awaited by the caller.
 */
export function addDocumentNonBlocking(colRef: CollectionReference, data: any, docRef?: DocumentReference) {
  const promise = docRef 
    ? setDoc(docRef, data)
    : addDoc(colRef, data);
    
  promise.catch(error => {
    const path = docRef ? docRef.path : colRef.path;
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: path,
        operation: 'create',
        requestResourceData: data,
      })
    );
    // Re-throw the error so the caller's catch block can handle it for UI feedback
    throw error;
  });
  return promise;
}


/**
 * Initiates an updateDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function updateDocumentNonBlocking(docRef: DocumentReference, data: any) {
  updateDoc(docRef, data)
    .catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: data,
        })
      )
    });
}


/**
 * Initiates a deleteDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function deleteDocumentNonBlocking(docRef: DocumentReference) {
  deleteDoc(docRef)
    .catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        })
      )
    });
}
