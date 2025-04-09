import React from 'react';
import { MDBContainer, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import NavBar from '../components/NavBar.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import backgroundImage from '../assets/background_img.jpg'; 
import PageLayout from '../layouts/PageLayout.tsx';


const UserPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <PageLayout>
      <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <NavBar username={user?.user_name || ''} />

        <MDBContainer
          className="d-flex justify-content-center align-items-center"
          style={{
            minHeight: '80vh',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="text-center text-white p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: '12px' }}>
            <h1 className="mb-4">Welcome, {user?.user_name || 'Guest'}!</h1>
            <p className="lead">Use the menu to submit or search for biases.</p>
          </div>
        </MDBContainer>
      </div>
    </PageLayout>
  );
};

export default UserPage;