const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const code = err.code || 'SERVER_ERROR';
  const message = err.message || 'Something went wrong. Please try again.';

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({ message, status, code });
};

module.exports = errorHandler;
