import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [values, setValues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await res.json();
      setValues(data);
    } catch (error) {
      setError(true);
      alert('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const pagination = (index) => {
    setCurrentPage(index);
  }
  
  const handleNext = () => {
    const count = Math.ceil(values.length / itemsPerPage);
    if (currentPage < count) setCurrentPage(prev => prev + 1);
  }
  
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  }

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentData = values.slice(firstIndex, lastIndex);

  return (
    <div>
      <h1>Employee Data Table</h1>
      {error ? (
        <p>Error: Failed to fetch data</p>
      ) : loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: '100%' }}>
          <thead>
            <tr style={{ background: '#D6EEEE' }}>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((value, idx) => (
              <tr key={idx}>
                <td>{value.id}</td>
                <td>{value.name}</td>
                <td>{value.email}</td>
                <td>{value.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ul className='pagination'>
        <button onClick={handlePrev}>Previous</button>
        {Array.from({ length: Math.ceil(values.length / itemsPerPage) }, (_, i) => (
          <li key={i} onClick={() => pagination(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
            {i + 1}
          </li>
        ))}
        <button onClick={handleNext}>Next</button>
      </ul>
    </div>
  );
}

export default App;