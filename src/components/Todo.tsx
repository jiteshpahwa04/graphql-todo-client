import { useMutation } from "@apollo/client/react";
import { ADD_TODO } from "../graphql/mutations";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Todo = () => {
  const [title, setTitle] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  const [addTodo] = useMutation(ADD_TODO, {
    optimisticResponse: {
      addTodo: {
        id: uuidv4(),
        title,
        completed: false,
        tags,
      },
    },
    update: (cache, { data }) => {
      console.log("Cache updated with:", cache);
      console.log(data);
    },
  });

  function handleAddTodo(event: React.FormEvent) {
    event.preventDefault();
    console.log("Adding todo:", title, tags);
    addTodo({
      variables: {
        text: title,
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
    </>
  );
};

export default Todo;
