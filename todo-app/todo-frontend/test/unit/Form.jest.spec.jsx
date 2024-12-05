import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoForm from '../../src/Todos/Form';

test('submitting the form calls createTodo with the input value', () => {
  const createTodoMock = jest.fn();
  render(<TodoForm createTodo={createTodoMock} />);

  const input = screen.getByRole('textbox', { name: /text/i });
  const submitButton = screen.getByRole('button', { name: /submit/i });

  fireEvent.change(input, { target: { value: 'New Todo' } });
  fireEvent.click(submitButton);

  expect(createTodoMock).toHaveBeenCalledWith({ text: 'New Todo' });
  expect(createTodoMock).toHaveBeenCalledTimes(1);
});
