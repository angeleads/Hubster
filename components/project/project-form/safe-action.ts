import { getAuth } from "@clerk/nextjs/server"
import { createSafeActionClient } from "next-safe-action"

export class ActionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ActionError"
  }
}

const handleReturnedServerError = (error: Error) => {
  if (error instanceof ActionError) {
    return error.message
  }
  return "An unexpected error occurred."
}

export const action = createSafeActionClient({
  handleServerError: handleReturnedServerError,
})

export const authAction = createSafeActionClient({
  handleServerError: handleReturnedServerError,
  async middleware(req: Request) {
    const { userId } = getAuth(req)
    if (!userId) throw new ActionError("Not authenticated")
    return { userId }
  },
})