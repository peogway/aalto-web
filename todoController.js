import * as todoService from "./todoService.js";
import * as sessionService from "./sessionService.js";
import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const showForm = async (c) => {
  return c.html(
    eta.render("todos.eta", {
      todos: await todoService.listTodos(c.user.id),
    }),
  );
};
const showTodo = async (c) => {
  const id = c.req.param("id");
  return c.html(
    eta.render("todo.eta", {
      todo: await todoService.getTodo(c.user.id, id),
    }),
  );
};

const createTodo = async (c) => {
  const body = await c.req.parseBody();
  await todoService.createTodo(c.user.id, body);
  return c.redirect("/todos");
};

const updateTodo = async (c) => {
  const id = c.req.param("id");
  const body = await c.req.parseBody();
  await todoService.updateTodo(c.user.id, id, body);
  return c.redirect(`/todos/${id}`);
};

const deleteTodo = async (c) => {
  const id = c.req.param("id");
  await todoService.deleteTodo(c.user.id, id);
  return c.redirect("/todos");
};

export { createTodo, deleteTodo, showForm, showTodo, updateTodo };
