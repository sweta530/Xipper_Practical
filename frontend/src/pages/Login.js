import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser(form);
      console.log(data);
      if (data.success === 0) {
        throw new Error(data.message);
      }
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      navigate("/");
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" textAlign="center" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
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
        <Button type="submit" variant="contained" fullWidth>
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;
