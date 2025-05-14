import React, { useState } from "react";
import "./SignInSide.css";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import wamflowLogo from "../../assets/flowLogo.png";
import api from "../../api/axios.ts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";
import PageLayout from "../../layouts/PageLayout.tsx";
import { supabase } from "../../supabaseClient.js";

const SignInSide: React.FC = () => {
  const [user_name, setuser_name] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setAuthUser } = useAuth();

  const navigate = useNavigate();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user_name,
      password,
    });

    if (error) {
      setError("Login failed: " + error.message);
    } else {
      setAuthUser({
        user_id: data.user?.id ?? "", // fallback if somehow null
        user_name: data.user?.email ?? "", // fallback if undefined
      });

      navigate(user_name === "admin@example.com" ? "/admin" : "/user");
    }
  };

  return (
    <PageLayout>
      <MDBContainer className="gradient-form">
        <div className="login-box d-flex flex-row">
          <MDBCol md="6" className="login-left">
            <div className="text-center mb-4">
              <img
                src={wamflowLogo}
                alt="Wamflow Logo"
                style={{ width: "100px" }}
              />
              <h4 className="mt-3">Bias Management System</h4>
            </div>

            {error && (
              <div className="text-danger text-center mb-3">{error}</div>
            )}

            <MDBInput
              wrapperClass="mb-4"
              label="Username"
              type="text"
              value={user_name}
              onChange={(e) => setuser_name(e.target.value)}
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="text-center">
              <MDBBtn className="mb-4 w-100" onClick={handleLogin}>
                Sign in
              </MDBBtn>
            </div>

            <div className="text-center">
              <p>Don't have an account?</p>
              <MDBBtn
                outline
                color="info"
                onClick={() => navigate("/register")}
              >
                Register
              </MDBBtn>
            </div>
          </MDBCol>

          <MDBCol md="6" className="login-right">
            <div>
              <h4 className="mb-3">
                Revolutionize the way you design and implement web-based
                applications
              </h4>
              <p>
                Graphical notation that provides a UML-like notation
                specifically tailored to the needs of inter-organizational
                web-based applications. Empower your team, visualize, design,
                and collaborate effortlessly, bridging the gap between concept
                and implementation.
              </p>
            </div>
          </MDBCol>
        </div>
      </MDBContainer>
    </PageLayout>
  );
};

export default SignInSide;
