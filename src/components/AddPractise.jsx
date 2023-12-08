import { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import PropTypes from 'prop-types';
import { Select, MenuItem } from "@mui/material";

//import { parseISO } from 'date-fns';



//import dayjs from 'dayjs';

export default function AddPractise({ fetchPractises }) {

  const [newPractise, setNewPractise] = useState({
    date: null,
    duration: '',
    activity: '',
    customerName: '',
  });

  const [customers, setCustomers] = useState([]);
  //fetch customer data
  useEffect(() => {
    fetch("https://traineeapp.azurewebsites.net/api/customers")
      .then((response) => response.json())
      .then((data) => setCustomers(data.content))
      .catch((err) => console.error(err));
  }, []);


  const handleDateChange = (date) => {
    setNewPractise({
      ...newPractise,
      date: date || null,
    });
  };


  const handleInputChange = (e) => {
  const { name, value } = e.target;

  if (name === "customer") {
    // Käsittele asiakkaan valinta dropdown-valikosta
    setNewPractise({
      ...newPractise,
      customerName: value,
    });
  } else {
    setNewPractise({
      ...newPractise,
      [name]: value,
    });
  }
};

const savePractise = () => {
  fetch('http://traineeapp.azurewebsites.net/api/trainings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPractise)
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error in POST: " + response.statusText);
      }
    })
    .then(data => {
      console.log("Response after POST:", data);

      // Haetaan asiakastiedot suoraan uudelle harjoitukselle
      const customerLink = data.links.find(link => link.rel === 'customer');
      if (customerLink) {
        fetch(customerLink.href)
          .then(response => response.json())
          .then(customerData => {
            console.log("Customer data:", customerData);

            // Päivitetään uuden harjoituksen tiedot asiakastiedoilla
            const updatedPractise = {
              ...data,
              customerLink: customerLink.href,
              customerName: `${customerData.firstname} ${customerData.lastname}`
            };

            // Päivitetään tila ja kutsutaan fetchPractises vasta täällä
            setNewPractise(prevPractises => [...prevPractises, updatedPractise]);
            fetchPractises();
          })
          .catch(customerError => {
            console.error("Error fetching customer data:", customerError);
            fetchPractises();
          });
      } else {
        console.error("Customer link not found in response.");
        fetchPractises();
      }
    })
    .catch(error => {
      console.error("Error in POST:", error);
      fetchPractises();
    });
}

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          renderInput={(props) => <TextField {...props} />}
          onChange={handleDateChange}
          value={newPractise.date}
        />
      </LocalizationProvider>
      <TextField
        type="number"
        name="duration"
        placeholder="Duration"
        onChange={handleInputChange}
        value={newPractise.duration}
      />
      <TextField
        type="text"
        name="activity"
        placeholder="Activity"
        onChange={handleInputChange}
        value={newPractise.activity}
      />
      <Select
        value={newPractise.customerName}
        onChange={handleInputChange}
        name="customer"
        displayEmpty
      >
        <MenuItem value="" disabled>
              Select a customer
            </MenuItem>
            {customers.map((customer) => (
              <MenuItem
                key={customer.links[0].href}
                value={`${customer.firstname} ${customer.lastname}`}
              >
                {`${customer.firstname} ${customer.lastname}`}
              </MenuItem>
            ))}
      </Select>

      {/* <TextField
        type="text"
        name="customerName"
        placeholder="Customer"
        onChange={handleInputChange}
        value={newPractise.customerName}
      /> */}
      <Button variant="contained" onClick={savePractise}>
        Add Practise
      </Button>
    </div>
  );
}

AddPractise.propTypes = {
  fetchPractises: PropTypes.func.isRequired,
};