import { useMutation, useQuery } from "@apollo/client/react";
import { ADD_TODO } from "../graphql/mutations";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { GET_TODOS } from "../graphql/query";
import type { GetTodosData, CreateTodoData } from "../types/Todo";
import { gql } from "@apollo/client";

const Todo = () => {
  const [title, setTitle] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  const [addTodo] = useMutation<
    CreateTodoData,
    { title: string; tags: string[] }
  >(ADD_TODO, {
    optimisticResponse: {
      createTodo: {
        id: uuidv4(),
        title,
        completed: false,
        tags,
      },
    },
    update: (cache, { data }) => {
      console.log("Data from mutation:", data);
      if (!data) return;

      /**
       * 🔹 Apollo knows which refs are optimistic
         🔹 On error → ref disappears automatically
         🔹 No duplicates, no leaks
       */
      cache.modify({
        fields: {
          getTodos(existingRefs = []) {
            const newRef = cache.writeFragment({
              data: data.createTodo,
              fragment: gql`
                fragment NewTodo on Todo {
                  id
                  title
                  completed
                  tags
                }
              `,
            });

            return [...existingRefs, newRef];
          },
        },
      });
    },
  });

  const { data: todosData } = useQuery<GetTodosData>(GET_TODOS);

  function handleAddTodo(event: React.FormEvent) {
    event.preventDefault();
    console.log("Adding todo:", title, tags);
    addTodo({
      variables: {
        title: title,
        tags,
      },
    });
  }

  return (
    <>
      <form onSubmit={handleAddTodo}>
        <h1>GraphQL Powered Todo</h1>
        <input
          type="text"
          placeholder="Todo title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />

        <input
          type="text"
          placeholder="Tags (comma separated)"
          onChange={(event) => {
            const tagsArray = event.target.value
              .split(",")
              .map((tag) => tag.trim());
            setTags(tagsArray);
          }}
        />

        <button type="submit">Add Todo</button>
      </form>

      <ul>
        {todosData?.getTodos.map((todo) => (
          <li key={todo.id}>
            <strong>{todo.title}</strong> - Tags: {todo.tags.join(", ")} -{" "}
            {todo.completed ? "Completed" : "Pending"}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Todo;
