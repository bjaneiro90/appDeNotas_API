const fs = require('fs/promises')

function generateError(message, code = 500) {
  const error = new Error(message);
  error.httpStatus = code;
  return error;
}

const createPathIfNotExists = async (path) => {
  try {
    await fs.access(path)
  } catch {
    await fs.mkdir(path)
  }
}
function showDebug(message) {
  if (process.env.NODE_ENV === 'development') {
    console.log(message);
  }
}

module.exports = {
  generateError,
  showDebug,
  createPathIfNotExists
};
