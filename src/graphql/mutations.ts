import { gql } from "@apollo/client";

export const ADD_TODO = gql`
  mutation AddingTodo($text: String!, $tags: [String!]!) {
    createTodo(title: $text, tags: $tags) {
      id
      title
      completed
      tags
    }
  }
`;
