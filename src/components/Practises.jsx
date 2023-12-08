import { useState, useEffect } from 'react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import Button from '@mui/material/Button';
import dayjs from 'dayjs';


import { AgGridReact } from "ag-grid-react";
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

//import 'dayjs/locale/fi';

import AddPractise from './AddPractise';




function Practises() {

  const [practises, setPractises] = useState([]);

  useEffect(() => {
    fetchPractises();

  }, []);

  const [content] = useState([
    { field: 'date', sortable: true, filter: true,
    //Päivämäärän muotoilu
    cellRenderer: (params) => (
      <span>
        {dayjs(params.value).format('DD.MM.YYYY hh:mm A')}
      </span>
    ),
    },
    { field: 'duration', sortable: true, filter: true },
    { field: 'activity', sortable: true, filter: true },
    { field: 'customerName', sortable: true, filter: true },
    {
      //onClick metodi harjoitusten poistamiselle
      cellRenderer: params => <Button size="small" onClick={() => deletePractise(params.data.links)}>Delete</Button>,
      width: 120
    },

  ]);
    //Haetaan ensin kaikki harjoitteet ja niihin liitetyt asiakkaat
    const fetchPractises = () => {
      console.log(practises)
      fetch('http://traineeapp.azurewebsites.net/api/trainings')
        .then((response) => response.json())
        .then((data) => {
          const practiseData = data.content.map((trainingInfo) => {
            const customerLink = trainingInfo.links.find(
              (link) => link.rel === "customer"
            ).href;
            const practiseLink = trainingInfo.links.find(
              (link) => link.rel === "self"
            ).href;
  
            return Promise.all([
              fetch(practiseLink).then((response) => response.json()),
              fetch(customerLink).then((response) => response.json())
            ])
              .then(([practiseInfo, customerInfo]) => {
                const { date, duration, activity } = practiseInfo;
                const { firstname, lastname } = customerInfo;
  
                return {
                  ...trainingInfo,
                  customerLink,
                  practiseLink,
                  date,
                  duration,
                  activity,
                  customerName: `${firstname} ${lastname}`,
                };
              })
              .catch((err) => {
                console.error(err);
                return {
                  ...trainingInfo,
                  //date: "N/A",
                  //duration: "N/A",
                  //activity: "N/A",
                 // customerId: "N/A",
                  //customerName: "N/A",
                };
              });
          });
  
          Promise.all(practiseData)
            .then((trainingEntries) => {
              setPractises(trainingEntries);
            })
            .catch((error) => console.error(error));
        })
        .catch((err) => console.error(err));
    };
  
  //TOIMINNALLISUUS HARJOITUSTEN POISTAMISELLE
  const deletePractise = (links) => {
    console.log(links);

    if (window.confirm("Are you sure?")) {
      const url = links.find(link => link.rel === 'self');
  
      if (url) {
        fetch(url.href, { method: 'DELETE' })
          .then(response => {
            if (response.ok){
              fetchPractises();
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

  return (
    <Container>
      <Stack>
      <AddPractise fetchPractises={fetchPractises} />
        <div className="ag-theme-material" style={{ height: 500 }}>
          <AgGridReact
            rowData={practises}
            columnDefs={content}
            pagination={true}
            paginationAutoPageSize={true}
          />
        </div>
      </Stack>
    </Container>
  )
}
export default Practises;