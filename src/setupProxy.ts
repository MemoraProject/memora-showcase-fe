const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app: any) {
  app.use(
    '/', 
    createProxyMiddleware({
      target: 'https://showcase-api.memora.vn', 
      changeOrigin: true,  
      secure: false,       
      onProxyRes: (res: any) => {
        // Add CORS headers to the response
        res.header('Access-Control-Allow-Origin', ''); // You can replace '' with the specific origin if needed
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      },
    })
  );
};