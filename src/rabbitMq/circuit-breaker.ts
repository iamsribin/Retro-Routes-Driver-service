export interface CircuitBreakerOptions {
  failureThreshold: number;    // Number of failures before opening circuit
  resetTimeout: number;        // Time to wait before attempting to close circuit (ms)
  monitoringPeriod: number;    // Time window for failure counting (ms)
}

export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export class CircuitBreaker {
  private state: CircuitBreakerState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime: number | null = null;
  private nextAttemptTime: number | null = null;
  private successCount = 0;

  constructor(private options: CircuitBreakerOptions) {
    // Start monitoring
    this.startMonitoring();
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.state = 'HALF_OPEN';
        console.log('Circuit breaker moved to HALF_OPEN state');
      } else {
        throw new Error('Circuit breaker is OPEN - operation not allowed');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.successCount++;
    
    if (this.state === 'HALF_OPEN') {
      // If we're in half-open state and got a success, close the circuit
      this.state = 'CLOSED';
      this.failureCount = 0;
      this.lastFailureTime = null;
      this.nextAttemptTime = null;
      console.log('Circuit breaker CLOSED after successful operation in HALF_OPEN state');
    }
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === 'HALF_OPEN') {
      // If we fail in half-open state, go back to open
      this.state = 'OPEN';
      this.nextAttemptTime = Date.now() + this.options.resetTimeout;
      console.log('Circuit breaker moved back to OPEN state from HALF_OPEN');
    } else if (this.failureCount >= this.options.failureThreshold) {
      // If we exceed failure threshold, open the circuit
      this.state = 'OPEN';
      this.nextAttemptTime = Date.now() + this.options.resetTimeout;
      console.log(`Circuit breaker OPENED after ${this.failureCount} failures`);
    }
  }

  private shouldAttemptReset(): boolean {
    return this.nextAttemptTime !== null && Date.now() >= this.nextAttemptTime;
  }

  private startMonitoring() {
    setInterval(() => {
      this.resetFailureCountIfNeeded();
      this.logStats();
  }, this.options.monitoringPeriod);
  }

  private resetFailureCountIfNeeded() {
    if (this.lastFailureTime && 
        Date.now() - this.lastFailureTime > this.options.monitoringPeriod) {
      // Reset failure count if monitoring period has passed since last failure
      if (this.state === 'CLOSED') {
        this.failureCount = 0;
        console.log('Failure count reset due to monitoring period expiry');
      }
    }
  }

  private logStats() {
    if (this.state !== 'CLOSED' || this.failureCount > 0) {
      console.log('Circuit Breaker Stats:', {
        state: this.state,
        failureCount: this.failureCount,
        successCount: this.successCount,
        lastFailureTime: this.lastFailureTime ? new Date(this.lastFailureTime).toISOString() : null,
        nextAttemptTime: this.nextAttemptTime ? new Date(this.nextAttemptTime).toISOString() : null
      });
    }
  }

  // Public methods for monitoring
  getState(): CircuitBreakerState {
    return this.state;
  }

  getFailureCount(): number {
    return this.failureCount;
  }

  getSuccessCount(): number {
    return this.successCount;
  }

  getLastFailureTime(): number | null {
    return this.lastFailureTime;
  }

  // Manual control methods (for testing/admin purposes)
  forceOpen() {
    this.state = 'OPEN';
    this.nextAttemptTime = Date.now() + this.options.resetTimeout;
    console.log('Circuit breaker manually OPENED');
  }

  forceClose() {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.nextAttemptTime = null;
    console.log('Circuit breaker manually CLOSED');
  }

  // Method to record external failures (like connection errors)
  recordFailure() {
    this.onFailure();
  }

  // Method to record external successes
  recordSuccess() {
    this.onSuccess();
  }

  // Get comprehensive stats for monitoring dashboards
  getStats() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      failureThreshold: this.options.failureThreshold,
      lastFailureTime: this.lastFailureTime,
      nextAttemptTime: this.nextAttemptTime,
      timeUntilNextAttempt: this.nextAttemptTime ? Math.max(0, this.nextAttemptTime - Date.now()) : null,
      resetTimeout: this.options.resetTimeout,
      monitoringPeriod: this.options.monitoringPeriod
    };
  }
}