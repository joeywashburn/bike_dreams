import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
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
  Timestamp,
  limit,
  startAfter,
  DocumentSnapshot,
} from 'firebase/firestore'
import { db } from '../services/firebase/config'
import { Part, ComponentCategory, ShopLink } from '../types/build'
import { useAuth } from '../contexts/AuthContext'

interface PartFormData {
  category: ComponentCategory
  brand: string
  model: string
  name?: string
  color?: string
  price: number
  imageUrl?: string
  description?: string
  links: ShopLink[]
}

// Get all parts for current user (non-paginated - used in The Garage and Compare)
export function useParts() {
  const { currentUser } = useAuth()

  return useQuery({
    queryKey: ['parts', currentUser?.uid],
    queryFn: async () => {
      if (!currentUser) throw new Error('Not authenticated')

      const q = query(
        collection(db, 'parts'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => {
        const data = doc.data()

        // Convert Firestore Timestamps to Dates in links array
        const links = (data.links || []).map((link: any) => ({
          ...link,
          lastChecked: link.lastChecked?.toDate ? link.lastChecked.toDate() : link.lastChecked,
        }))

        return {
          id: doc.id,
          ...data,
          links,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        }
      }) as Part[]
    },
    enabled: !!currentUser,
  })
}

// Get parts with pagination (used in Parts Cabinet)
const PARTS_PER_PAGE = 24

export function usePartsPaginated(selectedCategory?: string) {
  const { currentUser } = useAuth()

  return useInfiniteQuery({
    queryKey: ['parts-paginated', currentUser?.uid, selectedCategory],
    queryFn: async ({ pageParam }) => {
      if (!currentUser) throw new Error('Not authenticated')

      let q = query(
        collection(db, 'parts'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc'),
        limit(PARTS_PER_PAGE)
      )

      // Add category filter if selected
      if (selectedCategory && selectedCategory !== 'all') {
        q = query(
          collection(db, 'parts'),
          where('userId', '==', currentUser.uid),
          where('category', '==', selectedCategory),
          orderBy('createdAt', 'desc'),
          limit(PARTS_PER_PAGE)
        )
      }

      // Add pagination cursor if not first page
      if (pageParam) {
        q = query(q, startAfter(pageParam))
      }

      const snapshot = await getDocs(q)

      const parts = snapshot.docs.map((doc) => {
        const data = doc.data()

        // Convert Firestore Timestamps to Dates in links array
        const links = (data.links || []).map((link: any) => ({
          ...link,
          lastChecked: link.lastChecked?.toDate ? link.lastChecked.toDate() : link.lastChecked,
        }))

        return {
          id: doc.id,
          ...data,
          links,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        }
      }) as Part[]

      // Return parts and the last document for pagination cursor
      return {
        parts,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        hasMore: snapshot.docs.length === PARTS_PER_PAGE,
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.lastDoc : undefined
    },
    initialPageParam: undefined as DocumentSnapshot | undefined,
    enabled: !!currentUser,
  })
}

// Create a new part
export function useCreatePart() {
  const { currentUser } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PartFormData) => {
      if (!currentUser) throw new Error('Not authenticated')

      // Convert Date objects in links to Firestore Timestamps
      const linksWithTimestamps = data.links.map((link) => ({
        ...link,
        lastChecked: link.lastChecked ? Timestamp.fromDate(new Date()) : null,
      }))

      const partData = {
        ...data,
        links: linksWithTimestamps,
        userId: currentUser.uid,
        inCabinet: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, 'parts'), partData)
      return docRef.id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts', currentUser?.uid] })
      queryClient.invalidateQueries({ queryKey: ['parts-paginated', currentUser?.uid] })
    },
  })
}

// Update a part
export function useUpdatePart() {
  const { currentUser } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ partId, data }: { partId: string; data: PartFormData }) => {
      if (!currentUser) throw new Error('Not authenticated')

      // Convert Date objects in links to Firestore Timestamps
      const linksWithTimestamps = data.links.map((link) => ({
        ...link,
        lastChecked: link.lastChecked ? Timestamp.fromDate(new Date()) : null,
      }))

      const partRef = doc(db, 'parts', partId)
      await updateDoc(partRef, {
        ...data,
        links: linksWithTimestamps,
        updatedAt: serverTimestamp(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts', currentUser?.uid] })
      queryClient.invalidateQueries({ queryKey: ['parts-paginated', currentUser?.uid] })
    },
  })
}

// Delete a part
export function useDeletePart() {
  const { currentUser } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (partId: string) => {
      if (!currentUser) throw new Error('Not authenticated')

      const partRef = doc(db, 'parts', partId)
      await deleteDoc(partRef)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts', currentUser?.uid] })
      queryClient.invalidateQueries({ queryKey: ['parts-paginated', currentUser?.uid] })
    },
  })
}
