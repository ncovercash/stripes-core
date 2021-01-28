import localforage from 'localforage';

import {
  setCurrentServicePoint,
  setUserServicePoints,
} from './servicePointsActions';

export function setCurServicePoint(store, servicePoint) {
  localforage.getItem('okapiSess').then((sess) => {
    sess.user.curServicePoint = servicePoint;
    localforage.setItem('okapiSess', sess);
    store.dispatch(setCurrentServicePoint(servicePoint));
  });
}

export function setServicePoints(store, servicePoints) {
  localforage.getItem('okapiSess').then((sess) => {
    sess.user.servicePoints = servicePoints;
    localforage.setItem('okapiSess', sess);
    store.dispatch(setUserServicePoints(servicePoints));
  });
}
