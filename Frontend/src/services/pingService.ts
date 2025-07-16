import axios from 'axios';
import api from './api';

// Get the base URL for the ping endpoint
// The ping endpoint is at the root level, not under /api
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_URL.replace('/api', ''); // Remove /api suffix if present


/**
 * PingService - A service that sends ping requests to the backend server
 * at regular intervals to keep the connection alive and monitor server status.
 */
class PingService {
  private pingInterval: NodeJS.Timeout | null = null;
  private intervalMs: number = 5 * 60 * 1000; // 5 minutes in milliseconds
  private isRunning: boolean = false;

  /**
   * Start sending ping requests at regular intervals
   */
  start(): void {
    if (this.isRunning) {
      console.log('Ping service is already running');
      return;
    }

    // Send initial ping
    this.sendPing();

    // Set up interval for subsequent pings
    this.pingInterval = setInterval(() => {
      this.sendPing();
    }, this.intervalMs);

    this.isRunning = true;
    console.log('Ping service started - sending pings every 5 minutes');
  }

  /**
   * Stop sending ping requests
   */
  stop(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
      this.isRunning = false;
      console.log('Ping service stopped');
    }
  }

  /**
   * Send a single ping request to the backend
   */
  async sendPing(): Promise<void> {
    try {
      // The ping endpoint is at /ping, not /api/ping
      console.log(`Sending ping request to server at: ${BASE_URL}/ping`);
      const response = await axios.get(`${BASE_URL}/ping`);
      console.log('Received pong response:', response.data);
    } catch (error: any) {
      console.error('Ping failed with error:', error.message);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
    }
  }

  /**
   * Check if the ping service is currently running
   */
  getStatus(): boolean {
    return this.isRunning;
  }
}

// Create a singleton instance
const pingService = new PingService();

export default pingService;
