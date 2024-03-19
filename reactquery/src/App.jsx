import React from 'react';
import { useQuery,useMutation, useQueryClient } from '@tanstack/react-query';
import './App.css';
// https://jsonplaceholder.typicode.com/posts
function App() {
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () =>
      fetch('https://jsonplaceholder.typicode.com/todos')
        .then(res => res.json()
        ),
        // staleTime: 4000
        refetchInterval: 4000, 
        refetchOnWindowFocus: false,
        // retry: 5,
  });

  const {mutate, isPending, isError, isSuccess} = useMutation({mutationFn: (newPost) => 
    fetch("https://jsonplaceholder.typicode.com/posts",{
      method: 'POST',
      body: JSON.stringify(newPost),
      headers: {"Content-Type": "application/json; charset=utf-8"},
    }).then((res)=> res.json()),
      onSuccess: (newPost) =>{
        // queryClient.invalidateQueries({queryKey:["posts"] });
        queryClient.setQueryData(['posts'], (oldPosts) =>
        [...oldPosts, newPost] )
      },
  })



  if(error || isError) return <div>There was an error!</div>;
  if(isLoading) return <div>Data Is Loading...</div>;
  // if (isSuccess) return <div>Successfully loaded!</div>;
  return (
    <div>
      {isPending && <p>Data is being added...</p>}
      <button onClick={()=>mutate({
          "userId": 5000,
          "id": 4000,
          "title":
           "hey I love coding!",
          "body": "this is the body of this post",
      })}>Add Posts</button>
      {data && data.map(todo => (
        <div key={todo.id}>
          <h4>ID: {todo.id}</h4>
          <h4>Title: {todo.title}</h4> {/* Change todo.Title to todo.title */}
          <p>{todo.body}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
