import { gql } from "@apollo/client";

export const ADD_TODO = gql`
  mutation AddingTodo($title: String!, $tags: [String!]!) {
    createTodo(title: $title, tags: $tags) {
      id
      title
      completed
      tags
    }
  }
`;
