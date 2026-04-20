import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "../components/TextInput";
import Button from "../components/Button";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;
const Wrapper = styled.div`
  flex: 1;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 0px 16px;
`;
const Title = styled.div`
  font-weight: 600;
  font-size: 22px;
  color: ${({ theme }) => theme.primary};
`;
const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px; /* Adjusted border and shadow for light theme */
  border: 1px solid ${({ theme }) => theme.text_secondary + '20'};
  border-radius: 14px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
`;

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      setLoading(false);
      alert("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <Container>
      <Wrapper>
        <Title>Contact Us</Title>
        <Form>
          <TextInput
            label="Your Name"
            name="name"
            value={form.name}
            handelChange={handleChange}
            placeholder="Enter your full name"
          />
          <TextInput
            label="Email Address"
            name="email"
            value={form.email}
            handelChange={handleChange}
            placeholder="Enter your email"
          />
          <TextInput
            label="Message" name="message" value={form.message} handelChange={handleChange}
            placeholder="How can we help you?"
            textArea
            rows={5}
          />
          <Button text="Send Message" onClick={handleSubmit} isLoading={loading} />
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Contact;