
export const handleControllerError = (error: unknown, operation: string): Error => {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Error(`${operation} failed: ${message}`);
  };