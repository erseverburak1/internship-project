import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import NoLoggedInView from "./components/NoLoggedInView"
import Company from "./components/Company"
import Town from "./components/Town"
import Department from "./components/Department"
import Users from "./components/User"

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<NoLoggedInView />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/company" element={<Company />} />
      <Route exact path="/town" element ={<Town />}/>
      <Route exact path ="/department" element = {<Department/>}/>
      <Route exact path ="/users" element = {<Users/>}/>
    </Routes>
  </BrowserRouter>,
document.getElementById('root'));