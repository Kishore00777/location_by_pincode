import {
  Box,
  Button,
  Card,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductCard() {
  const [data, setData] = useState([]);
  const [pincode, setPincode] = useState("");
  const [location, setLocation] = useState("");
  const [valid, setValid] = useState(false);
  const [getResponse, setGetResponse] = useState(false);
  const [loading, setLoading] = useState(false);

  const CheckValidPincode = (event) => {
    const inputValue = event.target.value;
    const isValidInput = /^\d{6}$/.test(inputValue);
    setValid(isValidInput);
    setPincode(inputValue);
  };
  const getpincode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGetResponse(true);
    try {
      const response = await axios.post(
        "https://pincode.p.rapidapi.com/",
        {
          searchBy: "pincode",
          value: pincode,
        },
        {
          headers: {
            "content-type": "application/json",
            "Content-Type": "application/json",
            "X-RapidAPI-Key":
              "06342966c9msh56065118d802a0cp1f9551jsnca0e6fea1353",
            "X-RapidAPI-Host": "pincode.p.rapidapi.com",
          },
        }
      );

      setTimeout(() => {
        setData(response.data);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error("error on getting location", err);
      setData("");
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      toast.error("server error!", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };
  useEffect(() => {
    if (data.length > 0) {
      setLocation({
        taluk: data[0].taluk,
        district: data[0].district,
      });
      toast.success("Location found Successfully", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } else {
      toast.error("Bad Request!", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  }, [data]);

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      {/* {loading && <LinearProgress color="primary" />} */}
      <Typography
        variant="h4"
        align="center"
        color="primary"
        sx={{ fontWeight: "bold", mt: "5%" }}
      >
        Get Location by Pincode
      </Typography>
      <br />
      <Card
        sx={{
          width: 280,
          minHeight: 236,
          boxShadow: "rgba(0, 0, 0, 0.3) 0.05px 0.05px 10px",
          ml: "auto",
          mr: "auto",
          borderRadius: "20px",
        }}
      >
        <Box
          sx={{
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            label="Enter pincode"
            value={pincode}
            onChange={(event) => {
              CheckValidPincode(event);
            }}
          />
          <br />
          <Button
            disabled={!valid}
            variant="outlined"
            // sx={{ mt: 2, ml: 5 }}
            onClick={getpincode}
          >
            Submit
          </Button>
          <br />
          {loading ? (
            <>
              <CircularProgress />
            </>
          ) : (
            <>
              {getResponse ? (
                <>
                  {data.length === 0 ? (
                    <Typography align="center" variant="body2" color="error">
                      Invalid pincode. Please enter a valid pincode
                    </Typography>
                  ) : (
                    <Typography
                      align="center"
                      variant="overline"
                      color="success"
                      fontSize={13}
                    >
                      {location.taluk === location.district ||
                      location.taluk === "Not Available"
                        ? location.district
                        : `${location.taluk}, ${location.district}`}
                    </Typography>
                  )}
                </>
              ) : (
                <Typography align="center" variant="body2" color="primary">
                  Please enter a pincode to get the location
                </Typography>
              )}
            </>
          )}
        </Box>
      </Card>
    </>
  );
}
