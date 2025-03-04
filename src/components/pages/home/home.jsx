// import "./home.css";
// import React, { useState, useEffect } from "react";
// import useFetch from "./useFetch";
// import { useSelector } from "react-redux";

// const Home = () => {
//   const username = useSelector((state) => state.auth.username);
//   console.log(username);
  
//   const {data, loading, error} = useFetch("https://jsonplaceholder.typicode.com/users");

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <>
//       <p>username: {username}</p>
//       <ul>
//         {data.map((user) => (
//           <li key={user.id}>{user.name}</li>
//         ))}
//       </ul>
//     </>
    
//   );
// }

// export default Home;

import React, { useState, useEffect } from "react";
import Form from "./form";

function Home() {
  const [users, setUsers] = useState([]);
  const dataFetch = async () => {
    try{
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      if(response.ok){
        console.log(data);
        setUsers(data);
      }else{
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    dataFetch();
  },[])

  const handleSubmit = (newUser) => {
    setUsers([...users, newUser]);
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Email</td>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return(
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <Form handleSubmit = {handleSubmit}/>
    </>
  )
}

export default Home;
