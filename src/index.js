import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Home from './Home';
import { BrowserRouter, Route } from 'react-router-dom';
import Autor from './Autor.js'
import Livro from './Livro.js'
import createBrowserHistory from 'history/createBrowserHistory'

ReactDOM.render(
  <BrowserRouter history={createBrowserHistory}>
    <App >
      <Route exact  path="/" component={Home}/>
      <Route path="/autor" component={Autor}/>
      <Route path="/livro" component={Livro}/>
    </App>
  </BrowserRouter> , document.getElementById('root'));

