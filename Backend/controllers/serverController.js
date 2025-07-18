const os = require('os');
const process = require('process');
const mongoose = require('mongoose');

/**
 * Server controller for monitoring and health checks
 */

// @desc    Get server health status
// @route   GET /api/server/health
// @access  Private/Admin
exports.getServerHealth = async (req, res, next) => {
  try {
    const startTime = process.hrtime();
    
    // Get MongoDB connection status
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Get system information
    const systemInfo = {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      uptime: Math.floor(process.uptime()),
      totalMem: Math.round(os.totalmem() / (1024 * 1024 * 1024) * 100) / 100, // GB
      freeMem: Math.round(os.freemem() / (1024 * 1024 * 1024) * 100) / 100, // GB
      cpuUsage: process.cpuUsage(),
      cpuCount: os.cpus().length,
      loadAvg: os.loadavg()
    };
    
    // Calculate response time
    const hrtime = process.hrtime(startTime);
    const responseTime = hrtime[0] * 1000 + hrtime[1] / 1000000; // in ms
    
    // Get environment
    const environment = process.env.NODE_ENV || 'development';
    
    // Get server start time
    const serverStartTime = new Date(Date.now() - process.uptime() * 1000).toISOString();
    
    res.status(200).json({
      success: true,
      data: {
        status: 'healthy',
        environment,
        database: {
          status: dbStatus,
          name: mongoose.connection.name || 'unknown'
        },
        system: systemInfo,
        performance: {
          responseTime: `${responseTime.toFixed(2)}ms`,
          memoryUsage: process.memoryUsage(),
          startTime: serverStartTime,
          uptime: process.uptime()
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get API usage statistics
// @route   GET /api/server/api-stats
// @access  Private/Admin
exports.getApiStats = async (req, res, next) => {
  try {
    // This would ideally be stored in a database
    // For now, we'll return mock data
    const apiStats = {
      totalRequests: 24680,
      endpoints: [
        { path: '/api/users/login-phone', count: 4250, avgResponse: 245 },
        { path: '/api/users/me', count: 8320, avgResponse: 112 },
        { path: '/api/accommodations', count: 6540, avgResponse: 320 },
        { path: '/api/users/complete-profile', count: 1820, avgResponse: 280 },
        { path: '/api/users/wishlist', count: 2150, avgResponse: 190 },
        { path: '/api/admin/dashboard', count: 980, avgResponse: 350 },
        { path: '/api/admin/institutes', count: 620, avgResponse: 280 }
      ],
      errorRates: {
        '4xx': 1.2, // percentage
        '5xx': 0.3  // percentage
      },
      topErrors: [
        { code: 401, count: 180, message: 'Unauthorized' },
        { code: 404, count: 120, message: 'Resource not found' },
        { code: 500, count: 45, message: 'Internal server error' }
      ]
    };
    
    res.status(200).json({
      success: true,
      data: apiStats
    });
  } catch (err) {
    next(err);
  }
};
