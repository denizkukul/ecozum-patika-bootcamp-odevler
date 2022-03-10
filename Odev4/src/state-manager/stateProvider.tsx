import { createContext, useState, useContext, useMemo, useEffect, useRef } from 'react';
import { useAuthContext } from '../auth/AuthContextProvider';
import { category, categoryInput, status, todo, todoInput } from '../interfaces';
import { server } from '../services/server';

interface States {
  todos: Map<number, todo>;
  categories: Map<number, category>;
  statuses: Map<number, status>;
}

interface IStateContext {
  state: States;
  addTodo: (todo: todoInput) => Promise<void>;
  updateTodo: (todo: todoInput, id: number) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  addCategory: (category: categoryInput) => Promise<void>;
  updateCategory: (category: categoryInput, id: number) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  getCategoryList: () => Promise<void>;
  getStatusList: (id: number) => Promise<void>;
  allCategoriesFetched: React.MutableRefObject<boolean>;
}
const StateContext = createContext<IStateContext | null>(null);

export const useStateContext = () => {
  return useContext(StateContext);
}

export const StateProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<States>({ todos: new Map(), categories: new Map(), statuses: new Map() });
  const allCategoriesFetched = useRef(false);
  const Auth = useAuthContext()!;

  useEffect(() => {
    if (Auth.loggedIn) {
      let newState = { ...state };
      server.getList('todo')
        .then((response) => {
          const requests: Promise<void>[] = [];
          response.data.forEach((todo: todo) => {
            newState.todos.set(todo.id, todo);
            requests.push(server.get('category', todo.categoryId)
              .then((response) => {
                newState.categories.set(response.data.id, { ...response.data, statusIDs: [], allStatusesFetched: false })
              }))
            requests.push(server.get('status', todo.statusId)
              .then((response) => {
                newState.statuses.set(response.data.id, response.data);
              }))
          })
          return Promise.all(requests);
        })
        .then(() => {
          setState(newState);
        })
        .finally(() => { Auth.onLoad() })
    }
  }, [Auth.loggedIn])


  const stateManagerFunctions = useMemo(() => {
    return {
      addTodo: async (todo: todoInput) => {
        let newState = { ...state };
        return server.create('todo', todo)
          .then((response) => {
            newState.todos.set(response.data.id, response.data);
            setState(newState);
          })
      },
      updateTodo: async (todo: todoInput, id: number) => {
        let newState = { ...state };
        return server.update('todo', id, todo)
          .then((response) => {
            newState.todos.set(id, response.data);
            setState(newState);
          })
      },
      deleteTodo: async (id: number) => {
        let newState = { ...state };
        return server.delete('todo', id)
          .then(() => {
            newState.todos.delete(id);
            setState(newState);
          })
      },
      addCategory: async (category: categoryInput) => {
        let newState = { ...state };
        return server.create('category', { title: category.title })
          .then((response) => {
            newState.categories.set(response.data.id, { ...response.data, statusIDs: [], allStatusesFetched: true });
            let newCategory = newState.categories.get(response.data.id);
            category.statuses.forEach((status, i) => {
              setTimeout(() => {
                server.create('status', status, response.data.id)
                  .then((response) => {
                    newCategory?.statusIDs.push(response.data.id);
                    newState.statuses.set(response.data.id, response.data);
                  })
              }, i * 30) // Creating request with for loop changes status order depending on server response
              //TODO: Add statuses as soon as clicked on the form to keep order
            })
          })
          .then(() => {
            setState(newState);
          });
      },
      updateCategory: async (updatedCategory: categoryInput, id: number) => {
        let newState = { ...state };
        const currentCategory = { ...newState.categories.get(id)! };
        const updatedStatuses = updatedCategory.statuses;
        const currentStatuses: status[] = [];
        currentCategory.statusIDs.forEach(statusID => {
          let status = newState.statuses.get(statusID)!;
          currentStatuses.push(status);
        });

        const requests = [];
        const statusRemoved = currentStatuses.length - updatedStatuses.length > 0;

        // If updated statuses length < current statueses length delete unused statuses
        currentStatuses.slice(updatedStatuses.length).forEach((status) => {
          requests.push(server.delete('status', status.id))
          newState.statuses.delete(status.id);
          currentCategory.statusIDs.splice(updatedStatuses.length);
        })

        // Check if category titles is changed
        currentCategory.title !== updatedCategory.title && requests.push(server.update('category', id, updatedCategory));
        currentCategory.title = updatedCategory.title;

        updatedStatuses.forEach((status, index) => {
          // Current statuses length is reached, create new statuses
          if (!currentStatuses[index]) {
            console.log('test')
            requests.push(server.create('status', { ...status, categoryId: currentCategory.id }).then(response => {
              newState.statuses.set(response.data.id, response.data);
              currentCategory.statusIDs.push(response.data.id);
            }));
          }
          // If existing status titles or colors are changed update them
          else {
            console.log('test2')
            requests.push(server.update('status', currentStatuses[index].id, status).then((response) => {
              newState.statuses.set(currentStatuses[index].id, response.data);
            }));
          }
        });
        // Reset todo progress (If todos current status is deleted)
        if (statusRemoved) {
          newState.todos.forEach(todo => {
            if (todo.categoryId === id && !newState.statuses.get(todo.statusId)) {
              todo.statusId = currentCategory.statusIDs[0];
              const updatedTodo: todoInput = { title: todo.title, categoryId: todo.categoryId, statusId: todo.statusId }
              server.update('todo', todo.id, updatedTodo);
            }
          })
        }
        Promise.all(requests)
          .then(() => setState(newState))
      },
      deleteCategory: async (id: number) => {
        let newState = { ...state };
        let statusIDs = newState.categories.get(id)!.statusIDs;
        return server.delete('category', id)
          .then(() => {
            if (statusIDs)
              statusIDs.forEach((statusID) => {
                newState.statuses.delete(statusID);
              })
            newState.categories.delete(id);
            newState.todos.forEach(todo => (todo.categoryId === id) && newState.todos.delete(todo.id));
            setState(newState);
          })
      },
      getCategoryList: async () => {
        if (allCategoriesFetched.current === true) return;
        let newState = { ...state };
        return server.getList('category')
          .then((response) => {
            response.data.forEach((category: category) => {
              let prevCategory = newState.categories.get(category.id);
              let newCategory: category;
              if (prevCategory?.allStatusesFetched) newCategory = { ...category, statusIDs: prevCategory.statusIDs, allStatusesFetched: true };
              else newCategory = { ...category, statusIDs: [], allStatusesFetched: false };
              newState.categories.set(category.id, newCategory);
            })
            allCategoriesFetched.current = true;
            setState(newState);
          })
      },
      getStatusList: async (id: number) => {
        let category = state.categories.get(id)!;
        if (category.allStatusesFetched) return;
        let newState = { ...state };
        return server.getList('status', id)
          .then((response) => {
            response.data.forEach((status: status) => {
              category.statusIDs.push(status.id);
              newState.statuses.set(status.id, status);
            })
            newState.categories.set(id, { ...category, allStatusesFetched: true });
            setState(newState);
          })
      }
    }
  }, [])

  const stateManager = { state, allCategoriesFetched, ...stateManagerFunctions }

  return (
    <StateContext.Provider value={stateManager}>
      {children}
    </StateContext.Provider>
  );
}