import { useState } from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types'; 





export default function AddCustomer({ fetchCustomers }){
const [newCustomer, setNewCustomer] = useState({
    firstname: '',
    lastname: '',
    streetaddress: '',
    postcode: '',
    city: '',
    email: '',
    phone: ''
  });



const handleInputChange = (e) => {
    setNewCustomer({
      ...newCustomer,
      [e.target.name]: e.target.value
    });
  };


const saveCustomer = () => {
    fetch('http://traineeapp.azurewebsites.net/api/customers', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newCustomer)
  })
    .then(response => {
      if(response.ok)
      fetchCustomers();
        else
        throw new Error("Error in POST: " + response.statusText);

    })
      .catch(err => console.log(err));
  }

  return(
    <div>
      <h2>Add Customer</h2>
      <div>
        <input
          type="text"
          name="firstname"
          placeholder="Firstname"
          onChange={handleInputChange}
          value={newCustomer.firstname}
        />
        <input
          type="text"
          name="lastname"
          placeholder="Lastname"
          onChange={handleInputChange}
          value={newCustomer.lastname}
        />
        <input
          type="text"
          name="streetaddress"
          placeholder="Street Address"
          onChange={handleInputChange}
          value={newCustomer.streetaddress}
        />
        <input
          type="text"
          name="postcode"
          placeholder="postcode"
          onChange={handleInputChange}
          value={newCustomer.postcode}
        />
        <input
          type="text"
          name="city"
          placeholder="city"
          onChange={handleInputChange}
          value={newCustomer.city}
        />
        <input
          type="text"
          name="email"
          placeholder="email"
          onChange={handleInputChange}
          value={newCustomer.email}
        />
        <input
          type="text"
          name="phone"
          placeholder="phone"
          onChange={handleInputChange}
          value={newCustomer.phone}
        />
        {/* Add more input fields as needed */}
        <Button size="small" onClick={saveCustomer}>
          Add Customer
        </Button>
      </div>
    </div>
  );
}

AddCustomer.propTypes = {
    fetchCustomers: PropTypes.func.isRequired,
  };