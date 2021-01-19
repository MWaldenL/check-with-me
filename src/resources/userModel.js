import firebase from 'firebase'
import { 
  db,
  usersCollection
} from '@/firebase'

export const getSingleUser = (async userID => {
  const query = usersCollection.doc(userID)
  const doc = await query.get()
  return doc.data()
})