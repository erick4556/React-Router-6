import "./App.css";
import {
  Route,
  Routes,
  Link,
  useParams,
  Outlet,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "./useAuth";
import NavLink from "./NavLink";

const Home = () => <h1>Home</h1>;

const SearchPage = () => {
  const tacos = ["Cochinita", "Carnita", "Chili"];
  return (
    <div>
      <h1>Search</h1>
      <ul>
        {tacos.map((taco) => (
          <li key={taco}>
            <Link to={`/tacos/${taco}`}>{taco}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Tacos = () => {
  const { taco } = useParams();
  return (
    <div>
      <h1>Tacos: {taco}</h1>
      <Link to="details">Ir a los detalles</Link>
      {/* Indicar donde se tiene que renderizar el componente TacoDetails */}
      <Outlet />
    </div>
  );
};

const TacoDetails = () => {
  const { taco } = useParams();
  return <h1>Taco Details: {taco}</h1>;
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();

  console.log(state.location);

  const handleClick = () => {
    login();
    navigate(state?.location?.pathname ?? "/search");
  };

  return <button onClick={handleClick}>Login</button>;
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation(); //Es un objeto que tiene información de donde está el usuario en ese momento
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ location }} />;
  }

  return children;
};

const App = () => {
  return (
    <div className="App">
      <header>
        <h1>Test</h1>
        <nav>
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/search">Search</NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        {/* Ruta anidada */}
        {/* <Route path="/tacos/:taco" element={<Tacos />}>
          <Route path="details" element={<TacoDetails />} />
        </Route> */}
        <Route
          path="/tacos/:taco"
          element={
            <ProtectedRoute>
              <Tacos />
            </ProtectedRoute>
          }
        >
          <Route path="details" element={<TacoDetails />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </div>
  );
};

export default App;
