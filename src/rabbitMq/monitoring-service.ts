// monitoring-service.ts
import { rabbitClient } from './client';
import express from 'express';

export class MonitoringService {
  private app = express();
  private port = process.env.MONITORING_PORT || 3001;

  constructor() {
    this.setupRoutes();
  }

  private setupRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      const circuitBreakerStats = rabbitClient.getCircuitBreakerStats();
      
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        circuitBreaker: circuitBreakerStats,
        rabbitMQ: {
          connected: true // You can add more detailed connection checks
        }
      };

      // Determine overall health status
      if (circuitBreakerStats.state === 'OPEN') {
        health.status = 'degraded';
      }

      const statusCode = health.status === 'healthy' ? 200 : 503;
      res.status(statusCode).json(health);
    });

    // Circuit breaker stats endpoint
    this.app.get('/circuit-breaker', (req, res) => {
      const stats = rabbitClient.getCircuitBreakerStats();
      res.json(stats);
    });

    // Endpoint to manually control circuit breaker (for testing)
    this.app.post('/circuit-breaker/:action', (req, res) => {
      const { action } = req.params;
      
      try {
        // Note: You'll need to expose these methods from the circuit breaker
        switch (action) {
          case 'open':
            // rabbitClient.forceOpenCircuit();
            res.json({ message: 'Circuit breaker opened manually' });
            break;
          case 'close':
            // rabbitClient.forceCloseCircuit();
            res.json({ message: 'Circuit breaker closed manually' });
            break;
          default:
            res.status(400).json({ error: 'Invalid action. Use open or close.' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to control circuit breaker' });
      }
    });

    // Metrics endpoint (for Prometheus/Grafana integration)
    this.app.get('/metrics', (req, res) => {
      const stats = rabbitClient.getCircuitBreakerStats();
      
      // Simple metrics format (you can use prom-client for proper Prometheus metrics)
      const metrics = [
        `# HELP circuit_breaker_state Current state of the circuit breaker (0=CLOSED, 1=HALF_OPEN, 2=OPEN)`,
        `# TYPE circuit_breaker_state gauge`,
        `circuit_breaker_state{service="driver"} ${this.mapStateToNumber(stats.state)}`,
        ``,
        `# HELP circuit_breaker_failure_count Total number of failures`,
        `# TYPE circuit_breaker_failure_count counter`,
        `circuit_breaker_failure_count{service="driver"} ${stats.failureCount}`,
        ``,
        `# HELP circuit_breaker_last_failure_timestamp Timestamp of last failure`,
        `# TYPE circuit_breaker_last_failure_timestamp gauge`,
        `circuit_breaker_last_failure_timestamp{service="driver"} ${stats.lastFailureTime || 0}`,
      ].join('\n');

      res.set('Content-Type', 'text/plain').send(metrics);
    });
  }

  private mapStateToNumber(state: string): number {
    switch (state) {
      case 'CLOSED': return 0;
      case 'HALF_OPEN': return 1;
      case 'OPEN': return 2;
      default: return -1;
    }
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Monitoring service running on port ${this.port}`);
    });
  }
}

// Usage in your main application
// const monitoringService = new MonitoringService();
// monitoringService.start();