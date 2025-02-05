import { Link } from 'react-router-dom';
import '../App.css';

function NotFound() {
    return (
        <div className="app">
            <div className="container" >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '25vh' }}>
                    <h1 style={{ fontSize: '6rem', fontWeight: 'bold', color: '#00649f', marginBottom: '10px', animation: 'pulsate 2s infinite ease-in-out 1.2s' }}>404</h1>
                    <p style={{ fontSize: '1.5rem', margin: '10px 0', }}>Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
                    <p style={{ fontSize: '1rem', color: '#666', marginBottom: '20px', }}>It might have been moved or removed.</p>
                    <Link to="/" className='primary-button'>Go Home</Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;