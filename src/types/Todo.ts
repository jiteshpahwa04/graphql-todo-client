export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  tags: string[];
}

export interface GetTodosData {
  getTodos: Todo[];
}

export interface CreateTodoData {
  createTodo: Todo;
}
