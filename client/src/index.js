import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.js';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
