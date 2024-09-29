import Post from "../Post";
import {useEffect, useState} from "react";
import { Navigate } from "react-router-dom";

export default function IndexPage() {
  const [posts,setPosts] = useState([]);
  const token = localStorage.getItem('token'); 

 
  useEffect(() => {
    fetch('http://localhost:4000/post').then(response => {
      // console.log("90",response)
      response.json().then(posts => {
        setPosts(posts);
      });
    });
  }, []);

  if(!token){
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      {posts.length > 0 && posts.map(post => (
        <Post {...post} />
      ))}
    </>
  );
}