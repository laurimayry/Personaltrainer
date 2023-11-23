import { useState, useEffect } from 'react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import Button from '@mui/material/Button';

import { AgGridReact } from "ag-grid-react";

import  Container  from '@mui/material/Container';
//import TextField from '@mui/material/TextField';
//import {fetchCustomers} from './Customers';
import Stack from '@mui/material/Stack';


function Practises() {
  const [practise, setPractise] = useState([]);
  const [newPractise, setNewPractise] = useState({
    date: '',
    duration: '',
    activity: '',
    Customer: ''
  });
  

  /*id (long)
  • date (Date)
  • duration in minutes (int)
  • activity (String)
  • Customer (customer.id) */


  
  useEffect(() => {
    fetchPractises();
  }, []);

  const [content] = useState([
    { field: 'date', sortable: true, filter: true},
    { field: 'duration', sortable: true, filter: true },
    { field: 'activity', sortable: true, filter: true},
    { field: 'links', sortable: true, filter: true, render: (rowData) => {
        // Tarkistetaan, onko 'links' määritelty ja onko siellä 'customer' -rel
        const customerLink = rowData.links && rowData.links.find(link => link.rel === 'customer');
  
        // Jos rel 'customer' löytyy, palautetaan sen href, muuten palautetaan tyhjä merkkijono
        return customerLink ? customerLink.href : '';
      },
    },
    {
      cellRenderer: params => <Button size="small" onClick={() => deletePractise(params.data.links)}>Delete</Button>,
      width: 120
    },
    
  ]);


  const fetchPractises = () => {
    fetch('http://traineeapp.azurewebsites.net/api/trainings')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Virhe tietojen hakemisessa");
      }
    })
    .then(data => {
      if (Array.isArray(data.content)) {
        setPractise(data.content);
        console.log(data.content)
      } else {
        throw new Error("Haettu data ei ole taulukko");
      }
  })
    .catch(error => {
      console.error("Virhe:", error);
  })}


  //POISTAA HARJOITUKSEN
  const deletePractise = (links) => {
    if (window.confirm("Are you sure?")) {
      const url = links.find(link => link.rel === 'self');
  
      if (url) {
        fetch(url.href, { method: 'DELETE' })
          .then(response => {
            if (response.ok)
              fetchPractises();
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
    setNewPractise({
      ...newPractise,
      [e.target.name]: e.target.value
    });
  };

  const addPractise =() => {
    fetch('http://traineeapp.azurewebsites.net/api/trainings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPractise)
  })
    .then(response => {
      if(response.ok)
        fetchPractises();
      else
        throw new Error("Error in POST: " + response.statusText);
    })
      .catch(err => console.log(err));
  };

  //ETSII YHDEN ASIAKKAAN, customers/{id}


 
  
  

  return (
    <Container>

      <h1>Practises</h1>
      <Stack>
<div>
          <input type="text" name="date" placeholder="date" onChange={handleInputChange} />
          <input type="text" name="duration" placeholder="duration" onChange={handleInputChange} />
          <input type="text" name="activity" placeholder="activity" onChange={handleInputChange} />
          <input type="text" name="Customer" placeholder="Customer" onChange={handleInputChange} />
        
          <Button size="small" onClick={addPractise}>Add Practise</Button>
        </div>

        <div className="ag-theme-material" style={{ height: 500 }}>
          <AgGridReact
            rowData={practise}
            columnDefs={content}
            pagination={true}
            paginationAutoPageSize={true}
          />
        </div>
      </Stack>
    </Container>
  );
}

export default Practises;