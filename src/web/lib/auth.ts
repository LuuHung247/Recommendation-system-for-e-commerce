import { cookies } from "next/headers"
import { getUserByIndex } from "./data-service"

export type User = {
  _id: string
  user_index: number
}

export async function getUser() {
  // Await the cookies function
  const cookieStore = await cookies()
  const userIndex = cookieStore.get("user_index")?.value

  if (!userIndex) {
    return null
  }

  try {
    const user = await getUserByIndex(Number.parseInt(userIndex))
    return user as User | null
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}
