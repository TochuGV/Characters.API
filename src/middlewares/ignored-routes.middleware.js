const ignoredRoutes = (req, res, next) => {
  const ignoredPaths = [
    '/favicon.ico',
    '/socket.io',
    '/.well-known'
  ];

  if (ignoredPaths.some(path => req.originalUrl.startsWith(path))) return res.status(204).end();
  next();
};

export default ignoredRoutes;