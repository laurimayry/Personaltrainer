import { useState, useEffect } from 'react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import Button from '@mui/material/Button';

import { AgGridReact } from "ag-grid-react";

import  Container  from '@mui/material/Container';
//import TextField from '@mui/material/TextField';

import Stack from '@mui/material/Stack';


function Customers() {
  const [customer, setCustomer] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    firstname: '',
    lastname: '',
    streetaddress: '',
    postcode: '',
    city: '',
    email: '',
    phone: ''
  });
  
  
  useEffect(() => {
    fetchCustomers();
  }, []);

  const [content] = useState([
    { field: 'firstname', sortable: true, filter: true},
    { field: 'lastname', sortable: true, filter: true },
    { field: 'streetaddress', sortable: true, filter: true},
    { field: 'postcode', sortable: true, filter: true},
    { field: 'city', sortable: true, filter: true},
    { field: 'email', sortable: true, filter: true },
    { field: 'phone', sortable: true, filter: true },
    {
      cellRenderer: params => <Button size="small" onClick={() => deleteCustomer(params.data.links)}>Delete</Button>,
      width: 120
    },
    
  ]);


  const fetchCustomers = () => {
    fetch('http://traineeapp.azurewebsites.net/api/customers')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Virhe tietojen hakemisessa");
      }
    })
    .then(data => {
      if (Array.isArray(data.content)) {
        setCustomer(data.content);
      } else {
        throw new Error("Haettu data ei ole taulukko");
      }
  })
    .catch(error => {
      console.error("Virhe:", error);
  })}


  //POISTAA ASIAKKAAN
  const deleteCustomer = (links) => {
    if (window.confirm("Are you sure?")) {
      const url = links.find(link => link.rel === 'self');
  
      if (url) {
        fetch(url.href, { method: 'DELETE' })
          .then(response => {
            if (response.ok)
              fetchCustomers();
            else
              throw new Error("Error in DELETE: " + response.statusText);
          })
          .catch(err => console.error(err));
      } else {
        console.error("Self-link not found");
      }
    }
  };

  //LISÄÄ ASIAKKAAN
  const handleInputChange = (e) => {
    setNewCustomer({
      ...newCustomer,
      [e.target.name]: e.target.value
    });
  };

  const addCustomer =() => {
    fetch('http://traineeapp.azurewebsites.net/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCustomer)
  })
    .then(response => {
      if(response.ok)
        fetchCustomers();
      else
        throw new Error("Error in POST: " + response.statusText);
    })
      .catch(err => console.log(err));
  };




 
  
  

  return (
    <Container>

      <h1>Customers</h1>
      <Stack>
<div>
          <input type="text" name="firstname" placeholder="Firstname" onChange={handleInputChange} />
          <input type="text" name="lastname" placeholder="Lastname" onChange={handleInputChange} />
          <input type="text" name="streetaddress" placeholder="Street Address" onChange={handleInputChange} />
          <input type="text" name="postcode" placeholder="Postcode" onChange={handleInputChange} />
          <input type="text" name="city" placeholder="City" onChange={handleInputChange} />
          <input type="text" name="email" placeholder="Email" onChange={handleInputChange} />
          <input type="text" name="phone" placeholder="Phone" onChange={handleInputChange} />
          <Button size="small" onClick={addCustomer}>Add Customer</Button>
        </div>

        <div className="ag-theme-material" style={{ height: 500 }}>
          <AgGridReact
            rowData={customer}
            columnDefs={content}
            pagination={true}
            paginationAutoPageSize={true}
          />
        </div>
      </Stack>
    </Container>
  );
}

export default Customers;