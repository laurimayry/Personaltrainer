import { useState, useEffect } from 'react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import Button from '@mui/material/Button';
import AddCustomer from './AddCustomer';
import { AgGridReact } from "ag-grid-react";
//import { useParams } from 'react-router-dom';



import  Container  from '@mui/material/Container';
//import TextField from '@mui/material/TextField';

import Stack from '@mui/material/Stack';


function Customers() {
  const [customer, setCustomer] = useState([]);
  //const {selectedCustomer, setSelectedCustomer} = useState

  useEffect(() => {
    fetchCustomers();
    //fetchOneCustomer();


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
        console.log(data.content)
      } else {
        throw new Error("Haettu data ei ole taulukko");
      }
  })
    .catch(error => {
      console.error("Virhe:", error);
  })}

  //POISTAA ASIAKKAAN
  const deleteCustomer = (links) => {
    console.log(links);

    if (window.confirm("Are you sure?")) {
      const url = links.find(link => link.rel === 'self');
  
      if (url) {
        fetch(url.href, { method: 'DELETE' })
          .then(response => {
            if (response.ok){
              fetchCustomers();
              console.log(url);
            }
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
  
  //ETSII YHDEN ASIAKKAAN, customers/{id}


  return (
    <Container>

      <h1>Customers</h1>
      <Stack>
        <AddCustomer fetchCustomers={fetchCustomers}/>
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