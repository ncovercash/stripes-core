function setCurrentServicePoint(servicePoint) {
  return {
    type: 'SET_CURRENT_SERVICE_POINT',
    servicePoint,
  };
}

function setUserServicePoints(servicePoints) {
  return {
    type: 'SET_USER_SERVICE_POINTS',
    servicePoints,
  };
}

export {
  setCurrentServicePoint,
  setUserServicePoints
};
