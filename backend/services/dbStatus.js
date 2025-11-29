// Database connection status service
let isDBConnected = false;

const setDBStatus = (status) => {
  isDBConnected = status;
};

const getDBStatus = () => {
  return isDBConnected;
};

module.exports = {
  setDBStatus,
  getDBStatus
};
