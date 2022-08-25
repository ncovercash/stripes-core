import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';

import App from './App';

export default function start() {
  render(<App />, document.getElementById('root'));
}