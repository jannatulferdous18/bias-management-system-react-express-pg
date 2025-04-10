import React, { useState } from "react";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBTextArea,
  MDBBtn,
} from "mdb-react-ui-kit";
import NavBar from "../components/NavBar.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import Footer from "../components/Footer.tsx";
import PageLayout from "../layouts/PageLayout.tsx";

const SubmitBias: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    biasType: "",
    biasSource: "",
    description: "",
    severity: "",
    affectedGroups: "",
    mitigationStrategies: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.user_id) {
      alert("You must be logged in to submit a bias.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/biases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          submittedBy: user.user_id,
        }),
      });

      const result = await res.json();

      if (res.status === 409) {
        alert(result.message || "This bias already exists!");
        return;
      }

      if (!res.ok) {
        throw new Error(result.message || "Submission failed");
      }

      alert("Bias submitted successfully!");
      setFormData({
        biasType: "",
        biasSource: "",
        description: "",
        severity: "",
        affectedGroups: "",
        mitigationStrategies: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to submit bias.");
    }
  };

  return (
    <PageLayout>
      <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <NavBar username={user?.user_name || ""} />
        <MDBContainer
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <MDBCard
            className="w-100 shadow-4"
            style={{
              background: "#fccb90",
              maxWidth: "1200px",
              borderRadius: "12px",
            }}
          >
            <MDBCardBody>
              <h4 className="mb-4 text-center">Submit a New Bias</h4>
              <form onSubmit={handleSubmit}>
                <MDBInput
                  className="mb-4"
                  label="Bias Type"
                  name="biasType"
                  value={formData.biasType}
                  onChange={handleChange}
                  required
                />
                <MDBInput
                  className="mb-4"
                  label="Bias Source"
                  name="biasSource"
                  value={formData.biasSource}
                  onChange={handleChange}
                  required
                />
                <MDBTextArea
                  className="mb-4"
                  label="Description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
                <MDBInput
                  className="mb-4"
                  label="Severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  required
                />
                <MDBInput
                  className="mb-4"
                  label="Affected Groups"
                  name="affectedGroups"
                  value={formData.affectedGroups}
                  onChange={handleChange}
                  required
                />
                <MDBInput
                  className="mb-4"
                  label="Mitigation Strategy"
                  name="mitigationStrategies"
                  value={formData.mitigationStrategies}
                  onChange={handleChange}
                  required
                />
                <MDBBtn type="submit" block color="danger">
                  Submit
                </MDBBtn>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBContainer>
      </div>
    </PageLayout>
  );
};

export default SubmitBias;
