const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const { validationResult  } = require('express-validator');

// 🛡️ RATE LIMITING
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.',
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// 🔒 CORS CONFIGURATION
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'https://tu-dominio.com'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// 🚨 SECURITY HEADERS
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "https://api.tu-dominio.com"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  frameguard: {
    action: 'deny'
  }
});

// 🔍 INPUT VALIDATION
const validateInput = (req: Request, res: Response, next?: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      details: errors.array()
    });
  }
  next();
};

// 🛡️ SQL INJECTION PROTECTION
const sanitizeInput = (req: Request, res: Response, next?: NextFunction): void => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        // Remover caracteres peligrosos para SQL
        obj[key] = obj[key]
          .replace(/['";\\]/g, '')
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .trim();
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  
  next();
};

// 🔐 CSRF PROTECTION
const csrfProtection = (req: Request, res: Response, next?: NextFunction): void => {
  if (req.method === 'GET') {
    return next();
  }

  const csrfToken = req.headers['x-csrf-token'] || req.headers['csrf-token'];
  const sessionToken = req.session?.csrfToken;

  if (!csrfToken || !sessionToken || csrfToken !== sessionToken) {
    return res.status(403).json({
      error: 'Token CSRF inválido o faltante'
    });
  }

  next();
};

// 📊 REQUEST LOGGING
const requestLogger = (req: Request, res: Response, next?: NextFunction): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });

  next();
};

// 🚨 ERROR HANDLER
const errorHandler = (req: Request, res: Response, next?: NextFunction): void => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      details: err.message
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'No autorizado'
    });
  }

  res.status(500).json({
    error: 'Error interno del servidor'
  });
};

// 🔍 REQUEST SIZE LIMITER
const requestSizeLimiter = (req: Request, res: Response, next?: NextFunction): void => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (req.headers['content-length'] && parseInt(req.headers['content-length']) > maxSize) {
    return res.status(413).json({
      error: 'Solicitud demasiado grande'
    });
  }

  next();
}; 