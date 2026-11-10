declare global {
  namespace Express {
    interface Request {
      userId: string; // preenchido pelo middleware ensureAuthenticated
    }
  }
}

export {};