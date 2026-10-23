import { useEffect, useState } from "react";
import {
  HashRouter,
  NavLink,
  Routes,
  Route,
} from "react-router";

function Home() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadEmployees() {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch employees.");
        }

        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError("Unable to load employees. Please refresh and try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadEmployees();

    return () => controller.abort();
  }, []);

  return (
    <div>
      <h2 className="mb-4">Employee Dashboard</h2>

      {loading && <p>Loading employees...</p>}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmployeeForm() {
  const [form, setForm] = useState({
    name: "",
    designation: "",
    location: "",
    salary: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    setMessage(
      "Form validated successfully. No data was sent or saved."
    );
  }

  return (
    <div
      className="card shadow-sm mx-auto"
      style={{ maxWidth: "600px" }}
    >
      <div className="card-body p-4">
        <h2 className="mb-4">Employee Form</h2>

        {message && (
          <div className="alert alert-success" role="status">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>

            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              placeholder="Enter employee name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="designation" className="form-label">
              Designation
            </label>

            <input
              type="text"
              id="designation"
              name="designation"
              className="form-control"
              placeholder="Enter designation"
              value={form.designation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              Location
            </label>

            <input
              type="text"
              id="location"
              name="location"
              className="form-control"
              placeholder="Enter location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="salary" className="form-label">
              Salary
            </label>

            <input
              type="number"
              id="salary"
              name="salary"
              className="form-control"
              placeholder="Enter salary"
              value={form.salary}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container d-flex flex-wrap gap-3">
          <NavLink to="/" className="navbar-brand">
            Employee Dashboard
          </NavLink>

          <div className="navbar-nav flex-row gap-4">
            <NavLink to="/" end className="nav-link">
              Home
            </NavLink>

            <NavLink to="/employee-form" className="nav-link">
              Employee Form
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/employee-form"
            element={<EmployeeForm />}
          />
          <Route
            path="*"
            element={<h2>Page not found</h2>}
          />
        </Routes>
      </main>
    </HashRouter>
  );
}

export default App;