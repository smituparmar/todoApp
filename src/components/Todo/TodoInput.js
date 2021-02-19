import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { GET_MY_TODOS } from "./TodoPrivateList";
import { useAuth0 } from "../Auth/react-auth0-spa";

const ADD_TODO = gql`
  mutation($todo: String!, $isPublic: Boolean!, $user_id: String!) {
    insert_todos(objects: { title: $todo, is_public: $isPublic, user_id: $user_id }) {
      affected_rows
      returning {
        id
        title
        created_at
        is_completed
      }
    }
  }
`;

const TodoInput = ({ isPublic = false }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [todoInput, setTodoInput] = useState("");
  

  const updateCache = (cache, {data}) => {
    // If this is for the public feed, do nothing
    if (isPublic) {
      return null;
    }
    // Fetch the todos from the cache
    const existingTodos = cache.readQuery({
      query: GET_MY_TODOS,
      variables:{
        user_id:user.sub
      }
      });
    // Add the new todo to the cache
    const newTodo = data.insert_todos.returning[0];
    cache.writeQuery({
      query: GET_MY_TODOS,
      variables:{
        user_id:user.sub
      },
      data: {todos: [newTodo, ...existingTodos.todos]}
    });
  };
  

  const resetInput = () => {
    setTodoInput("");
  };

  const [addTodo] = useMutation(ADD_TODO, {
    update: updateCache,
    onCompleted: resetInput,
  });

  return (
    <form
      className="formInput"
      onSubmit={e => {
        e.preventDefault();
        addTodo({ variables: { todo: todoInput, isPublic,user_id:user.sub} });
      }}
    >
      <input
        className="input"
        value={todoInput}
        placeholder="What needs to be done?"
        onChange={e => setTodoInput(e.target.value)}
      />
      <i className="inputMarker fa fa-angle-right" />
    </form>
  );
};

export default TodoInput;
