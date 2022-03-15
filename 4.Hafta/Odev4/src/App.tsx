import { Main } from './main/Main';
import { AuthPage } from './auth/AuthPage';
import { useAuthContext } from './auth/AuthContextProvider';

export const App: React.FC = () => {
  const Auth = useAuthContext()!;
  return (
    <div className="App">
      {
        Auth.loggedIn ?
          <Main /> :
          <AuthPage />
      }
    </div>
  )
}

export default App;
