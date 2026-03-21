import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { logger } from 'shared';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Proxy /auth requests to auth-service
app.use('/auth', createProxyMiddleware({ 
  target: 'http://localhost:3001', 
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '', 
  },
  onProxyReq: (proxyReq, req, res) => {
    logger.info(`[Gateway] Proxied /auth request: ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    logger.error(`[Gateway] Auth Proxy Error`, err);
  }
}));

// Proxy /test requests to testing-service
app.use('/test', createProxyMiddleware({ 
  target: 'http://localhost:3002', 
  changeOrigin: true,
  pathRewrite: {
    '^/test': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    logger.info(`[Gateway] Proxied /test request: ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    logger.error(`[Gateway] Test Proxy Error`, err);
  }
}));

// Proxy /files requests to files-service
app.use('/files', createProxyMiddleware({ 
  target: 'http://localhost:3003', 
  changeOrigin: true,
  pathRewrite: {
    '^/files': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    logger.info(`[Gateway] Proxied /files request: ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    logger.error(`[Gateway] Files Proxy Error`, err);
  }
}));

// Proxy /ai requests to ai-service
app.use('/ai', createProxyMiddleware({
  target: 'http://localhost:3004',
  changeOrigin: true,
  pathRewrite: {
    '^/ai': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    logger.info(`[Gateway] Proxied /ai request: ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    logger.error(`[Gateway] AI Proxy Error`, err);
  }
}));

// Proxy /ws requests to websocket-service
app.use('/ws', createProxyMiddleware({
  target: 'http://localhost:3005',
  changeOrigin: true,
  ws: true,
  pathRewrite: {
    '^/ws': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    logger.info(`[Gateway] Proxied /ws request: ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    logger.error(`[Gateway] WS Proxy Error`, err);
  }
}));

app.listen(PORT, () => {


  logger.info(`API Gateway is running on port ${PORT}`);
});
