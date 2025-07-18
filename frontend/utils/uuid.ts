export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function getUserId(): string {
  if (typeof window === "undefined") return generateUUID()

  let userId = localStorage.getItem("aegis-user-id")
  if (!userId) {
    userId = generateUUID()
    localStorage.setItem("aegis-user-id", userId)
  }
  return userId
}

export function resetUserId(): string {
  const newId = generateUUID()
  if (typeof window !== "undefined") {
    localStorage.setItem("aegis-user-id", newId)
    localStorage.removeItem("aegis-user-profile")
  }
  return newId
}
