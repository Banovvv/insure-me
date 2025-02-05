import { Link } from 'react-router-dom'
import '../App.css'

function Home() {
    return (
        <div className="app">
            <div className="container">
                <h1 style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>Welcome to Insure-Me</h1>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                    <Link to='/vehicle-insurance' className='primary-button' type="button">Vehicle Insurance</Link>
                    <Link to='/life-insurance' className='primary-button' type="button">Health Insurance</Link>
                    {/* <Link to='/home-insurance' className='primary-button' type="button">Home Insurance</Link>
                    <Link to='/life' className='primary-button' type="button">Life Insurance </Link> */}
                </div>
            </div>
        </div>
    )
}

export default Home