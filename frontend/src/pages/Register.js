import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("Failed to register user.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" textAlign="center" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
        />
        <TextField
          label="Phone"
          name="phone"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained" fullWidth>
          Register
        </Button>
      </form>
    </Container>
  );
};

export default Register;
