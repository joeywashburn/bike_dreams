import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore'
import { db } from '../services/firebase/config'
import { Build, ComponentCategory } from '../types/build'
import { useAuth } from '../contexts/AuthContext'

interface BuildFormData {
  name: string
}

// Get all builds for current user
export function useBuilds() {
  const { currentUser } = useAuth()

  return useQuery({
    queryKey: ['builds', currentUser?.uid],
    queryFn: async () => {
      if (!currentUser) throw new Error('Not authenticated')

      const q = query(
        collection(db, 'builds'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Build[]
    },
    enabled: !!currentUser,
  })
}

// Create a new build
export function useCreateBuild() {
  const { currentUser } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: BuildFormData) => {
      if (!currentUser) throw new Error('Not authenticated')

      const buildData = {
        ...data,
        userId: currentUser.uid,
        selectedParts: {},
        totalPrice: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, 'builds'), buildData)
      return docRef.id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['builds', currentUser?.uid] })
    },
  })
}

// Update a build
export function useUpdateBuild() {
  const { currentUser } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      buildId,
      data,
    }: {
      buildId: string
      data: Partial<Build>
    }) => {
      if (!currentUser) throw new Error('Not authenticated')

      const buildRef = doc(db, 'builds', buildId)
      await updateDoc(buildRef, {
        ...data,
        updatedAt: serverTimestamp(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['builds', currentUser?.uid] })
    },
  })
}

// Update selected parts in a build
export function useUpdateBuildParts() {
  const { currentUser } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      buildId,
      category,
      partId,
    }: {
      buildId: string
      category: ComponentCategory
      partId: string | null
    }) => {
      if (!currentUser) throw new Error('Not authenticated')

      const buildRef = doc(db, 'builds', buildId)

      // Get current build to update selectedParts
      const buildsQuery = query(
        collection(db, 'builds'),
        where('userId', '==', currentUser.uid)
      )
      const snapshot = await getDocs(buildsQuery)
      const currentBuild = snapshot.docs.find((d) => d.id === buildId)

      if (!currentBuild) throw new Error('Build not found')

      const currentData = currentBuild.data()
      const selectedParts = { ...(currentData.selectedParts || {}) }

      if (partId === null) {
        // Remove the part
        delete selectedParts[category]
      } else {
        // Add/update the part
        selectedParts[category] = partId
      }

      // Calculate total price by fetching all selected parts
      const partIds = Object.values(selectedParts).filter(Boolean) as string[]
      let totalPrice = 0

      if (partIds.length > 0) {
        const partsQuery = query(
          collection(db, 'parts'),
          where('userId', '==', currentUser.uid)
        )
        const partsSnapshot = await getDocs(partsQuery)
        const allParts = partsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Array<{ id: string; price?: number }>

        // Sum up prices of selected parts
        partIds.forEach((id) => {
          const part = allParts.find((p) => p.id === id)
          if (part && part.price) {
            totalPrice += part.price
          }
        })
      }

      // Update the build with new selectedParts and totalPrice
      await updateDoc(buildRef, {
        selectedParts,
        totalPrice,
        updatedAt: serverTimestamp(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['builds', currentUser?.uid] })
    },
  })
}

// Duplicate a build
export function useDuplicateBuild() {
  const { currentUser } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ buildId, newName }: { buildId: string; newName: string }) => {
      if (!currentUser) throw new Error('Not authenticated')

      // Get the original build
      const buildsQuery = query(
        collection(db, 'builds'),
        where('userId', '==', currentUser.uid)
      )
      const snapshot = await getDocs(buildsQuery)
      const originalBuild = snapshot.docs.find((d) => d.id === buildId)

      if (!originalBuild) throw new Error('Build not found')

      const originalData = originalBuild.data()

      // Create new build with same data but new name
      const newBuildData = {
        name: newName,
        selectedParts: originalData.selectedParts || {},
        totalPrice: originalData.totalPrice || 0,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, 'builds'), newBuildData)
      return docRef.id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['builds', currentUser?.uid] })
    },
  })
}

// Delete a build
export function useDeleteBuild() {
  const { currentUser } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (buildId: string) => {
      if (!currentUser) throw new Error('Not authenticated')

      const buildRef = doc(db, 'builds', buildId)
      await deleteDoc(buildRef)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['builds', currentUser?.uid] })
    },
  })
}
