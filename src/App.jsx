
//import { useState } from 'react'
import './App.css'
import { Link, Outlet } from 'react-router-dom';


function App() {

  return (
    <div className="App">
    <nav>
    <Link to={"customers"}>Customers</Link>
    <Link to={"practises"}>Practises</Link>
    </nav>
    <Outlet />
    </div>
    );
}

export default App;
