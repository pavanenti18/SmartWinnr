
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

import { useState, useEffect } from "react";
import api from "./api";
import "./App.css";

// ================= NAVBAR =================

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  return (
    <nav className="navbar">
      <Link className="brand" to="/">Smart Winnr</Link>

      <div>
        <Link to="/">Restaurants</Link>

        {user?.role === "owner" && (
          <Link to="/owner">Owner Dashboard</Link>
        )}

        {user?.role === "admin" && (
          <Link to="/admin">Admin Dashboard</Link>
        )}

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button className="small-btn" onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  );
}

// ================= HOME =================

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function loadRestaurants() {
    try {
      const response = await api.get(
        `/restaurants?search=${encodeURIComponent(search)}`
      );

      setRestaurants(response.data.restaurants || []);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load restaurants");
    }
  }

  useEffect(() => {
    loadRestaurants();
  }, []);

  return (
    <main className="container">
      <section className="hero">
        <h1>Discover Your Favorite Restaurants</h1>
        <p>Explore restaurants, read reviews, and share experiences.</p>

        <div className="search">
          <input
            placeholder="Search restaurant, location or cuisine"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button onClick={loadRestaurants}>Search</button>
        </div>
      </section>

      <h2>Restaurants</h2>

      {error && <p className="error">{error}</p>}

      <div className="grid">
        {restaurants.map((restaurant) => (
          <article className="card" key={restaurant._id}>
            <div className="restaurant-icon">🍽️</div>
            <h3>{restaurant.name}</h3>
            <p>{restaurant.location} · {restaurant.cuisine}</p>

            <p className="rating">
              ⭐ {restaurant.averageRating ?? 0}/5
              <span> ({restaurant.reviewCount ?? 0} reviews)</span>
            </p>

            <Link
              className="link-button"
              to={`/restaurant/${restaurant._id}`}
            >
              View Details
            </Link>
          </article>
        ))}
      </div>

      {restaurants.length === 0 && !error && (
        <p>No restaurants found.</p>
      )}
    </main>
  );
}

// ================= LOGIN / REGISTER =================

function AuthPage({ register = false }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const endpoint = register ? "/auth/register" : "/auth/login";

      const response = await api.post(endpoint, {
        name,
        email,
        password
      });

      if (register) {
        navigate("/login");
        return;
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      window.location.href = "/";
    } catch (error) {
      setMessage(error.response?.data?.message || "Authentication failed");
    }
  }

  return (
    <main className="auth-card">
      <h2>{register ? "Create Account" : "Login"}</h2>

      {message && <p className="error">{message}</p>}

      <form onSubmit={handleSubmit}>
        {register && (
          <input
            required
            placeholder="Full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        )}

        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit">
          {register ? "Register" : "Login"}
        </button>
      </form>

      <p>
        {register ? "Already registered?" : "New user?"}
        <Link to={register ? "/login" : "/register"}>
          {register ? " Login" : " Register"}
        </Link>
      </p>
    </main>
  );
}

// ================= RESTAURANT DETAILS =================


function RestaurantDetails() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [message, setMessage] = useState("");

  async function loadDetails() {
    try {
      const [restaurantResponse, reviewResponse] = await Promise.all([
        api.get(`/restaurants/${id}`),
        api.get(`/reviews/restaurant/${id}`)
      ]);

      setRestaurant(restaurantResponse.data.restaurant);
      setReviews(reviewResponse.data.reviews || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to load details");
    }
  }

  useEffect(() => {
    loadDetails();
  }, [id]);

  // CREATE OR UPDATE REVIEW
  async function submitReview(event) {
    event.preventDefault();

    try {
      if (editingReview) {
        await api.put(`/reviews/${editingReview._id}`, {
          rating: Number(rating),
          comment
        });

        setMessage("Review updated successfully!");
        setEditingReview(null);
      } else {
        await api.post("/reviews", {
          restaurant: id,
          rating: Number(rating),
          comment
        });

        setMessage("Review submitted successfully!");
      }

      setRating("5");
      setComment("");
      await loadDetails();
    } catch (error) {
      setMessage(error.response?.data?.message || "Review operation failed");
    }
  }

  // START EDITING
  function startEdit(review) {
    setEditingReview(review);
    setRating(String(review.rating));
    setComment(review.comment);

    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  // CANCEL EDIT
  function cancelEdit() {
    setEditingReview(null);
    setRating("5");
    setComment("");
  }

  // DELETE REVIEW
  async function deleteReview(reviewId) {
    if (!window.confirm("Are you sure you want to delete your review?")) {
      return;
    }

    try {
      await api.delete(`/reviews/${reviewId}`);
      setMessage("Review deleted successfully!");
      await loadDetails();
    } catch (error) {
      setMessage(error.response?.data?.message || "Review deletion failed");
    }
  }

  if (!restaurant) {
    return <main className="container">{message || "Loading..."}</main>;
  }

  return (
    <main className="container">
      <Link to="/">← Back</Link>

      <article className="detail-card">
        <h1>{restaurant.name}</h1>
        <p>{restaurant.location} · {restaurant.cuisine}</p>
        <p>{restaurant.description}</p>
        <h2>⭐ {restaurant.averageRating ?? 0}/5</h2>
        <p>{restaurant.reviewCount ?? reviews.length} reviews</p>
      </article>

      <h2>Customer Reviews</h2>

      {reviews.length === 0 && <p>No reviews yet.</p>}

      {reviews.map((review) => {
        const isOwnReview =
          user?.role === "customer" &&
          review.customer?._id === user.id;

        return (
          <article className="review" key={review._id}>
            <strong>{review.customer?.name || "Customer"}</strong>
            <p>⭐ {review.rating}/5</p>
            <p>{review.comment}</p>

            {isOwnReview && (
              <div>
                <button onClick={() => startEdit(review)}>Edit</button>
                <button onClick={() => deleteReview(review._id)}>Delete</button>
              </div>
            )}
          </article>
        );
      })}

      {user?.role === "customer" && (
        <section className="auth-card">
          <h2>{editingReview ? "Edit Your Review" : "Write a Review"}</h2>

          {message && <p>{message}</p>}

          <form onSubmit={submitReview}>
            <label>Rating</label>

            <select
              value={rating}
              onChange={(event) => setRating(event.target.value)}
            >
              {[5, 4, 3, 2, 1].map((number) => (
                <option key={number} value={number}>
                  {number} Stars
                </option>
              ))}
            </select>

            <textarea
              required
              minLength="3"
              maxLength="500"
              placeholder="Write your experience"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />

            <button type="submit">
              {editingReview ? "Update Review" : "Submit Review"}
            </button>

            {editingReview && (
              <button type="button" onClick={cancelEdit}>
                Cancel Edit
              </button>
            )}
          </form>
        </section>
      )}

      {!user && (
        <p><Link to="/login">Login</Link> to write a review.</p>
      )}
    </main>
  );
}


// ================= OWNER DASHBOARD =================

function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    location: "",
    cuisine: "",
    description: ""
  });

  async function loadDashboard() {
    try {
      const response = await api.get("/owner/restaurant");
      setData(response.data);

      setForm({
        name: response.data.restaurant.name || "",
        location: response.data.restaurant.location || "",
        cuisine: response.data.restaurant.cuisine || "",
        description: response.data.restaurant.description || ""
      });

      setMessage("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Dashboard loading failed");
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);

      const response = await api.put("/owner/restaurant", form);
      setMessage(response.data.message || "Restaurant updated successfully");

      await loadDashboard();
    } catch (error) {
      setMessage(error.response?.data?.message || "Restaurant update failed");
    } finally {
      setSaving(false);
    }
  }

  if (!data) {
    return (
      <main className="container">
        <h1>Owner Dashboard</h1>
        <p>{message || "Loading dashboard..."}</p>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>Owner Dashboard</h1>
      {message && <p>{message}</p>}

      <section className="stats">
        <article className="card">
          <h3>Average Rating</h3>
          <h2>⭐ {data.averageRating}/5</h2>
        </article>

        <article className="card">
          <h3>Total Reviews</h3>
          <h2>{data.reviewCount}</h2>
        </article>
      </section>

      <section className="auth-card">
        <h2>Manage Your Restaurant</h2>

        <form onSubmit={handleSubmit}>
          <label>Restaurant Name</label>
          <input required name="name" value={form.name} onChange={handleChange} />

          <label>Location</label>
          <input required name="location" value={form.location} onChange={handleChange} />

          <label>Cuisine</label>
          <input required name="cuisine" value={form.cuisine} onChange={handleChange} />

          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} />

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Update Restaurant"}
          </button>
        </form>
      </section>

      <section className="card">
        <h2>{data.restaurant.name}</h2>
        <p>{data.restaurant.location}</p>
        <p>Cuisine: {data.restaurant.cuisine}</p>
        <p>{data.restaurant.description}</p>
      </section>

      <h2>Customer Reviews</h2>

      {data.reviews.length === 0 && <p>No customer reviews yet.</p>}

      {data.reviews.map((review) => (
        <article className="review" key={review._id}>
          <strong>{review.customer?.name || "Customer"}</strong>
          <p>⭐ {review.rating}/5</p>
          <p>{review.comment}</p>
        </article>
      ))}
    </main>
  );
}

// ================= ADMIN DASHBOARD =================

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    name: "",
    location: "",
    cuisine: "",
    description: "",
    owner: ""
  };

  const [form, setForm] = useState(emptyForm);

  async function loadAdmin() {
    try {
      const [dashboard, userResponse, restaurantResponse, reviewResponse] =
        await Promise.all([
          api.get("/admin/dashboard"),
          api.get("/admin/users"),
          api.get("/restaurants"),
          api.get("/admin/reviews")
        ]);

      setData(dashboard.data);
      setUsers(userResponse.data.users || []);
      setRestaurants(restaurantResponse.data.restaurants || []);
      setReviews(reviewResponse.data.reviews || []);
      setMessage("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Admin loading failed");
    }
  }

  useEffect(() => {
    loadAdmin();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  async function handleRestaurantSubmit(event) {
    event.preventDefault();

    try {
      if (editingId) {
        await api.put(`/admin/restaurants/${editingId}`, form);
        setMessage("Restaurant updated successfully");
      } else {
        await api.post("/admin/restaurants", form);
        setMessage("Restaurant created successfully");
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadAdmin();
    } catch (error) {
      setMessage(error.response?.data?.message || "Restaurant operation failed");
    }
  }

  function editRestaurant(restaurant) {
    setEditingId(restaurant._id);

    setForm({
      name: restaurant.name || "",
      location: restaurant.location || "",
      cuisine: restaurant.cuisine || "",
      description: restaurant.description || "",
      owner: restaurant.owner?._id || restaurant.owner || ""
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteRestaurant(id) {
    if (!window.confirm("Delete this restaurant and its reviews?")) return;

    try {
      await api.delete(`/admin/restaurants/${id}`);
      setMessage("Restaurant deleted successfully");
      await loadAdmin();
    } catch (error) {
      setMessage(error.response?.data?.message || "Delete failed");
    }
  }

  async function deleteReview(id) {
    if (!window.confirm("Delete this customer review?")) return;

    try {
      await api.delete(`/admin/reviews/${id}`);
      setMessage("Review deleted successfully");
      await loadAdmin();
    } catch (error) {
      setMessage(error.response?.data?.message || "Review deletion failed");
    }
  }

  return (
    <main className="container">
      <h1>Admin Dashboard</h1>
      {message && <p>{message}</p>}

      {data && (
        <div className="stats">
          <article className="card">Users<h2>{data.totalUsers}</h2></article>
          <article className="card">Restaurants<h2>{data.totalRestaurants}</h2></article>
          <article className="card">Reviews<h2>{data.totalReviews}</h2></article>
          <article className="card">Rating<h2>⭐ {data.platformAverageRating}</h2></article>
        </div>
      )}

      <h2>Users</h2>
      {users.map((user) => (
        <article className="review" key={user._id}>
          {user.name} · {user.email} · <strong>{user.role}</strong>
        </article>
      ))}

      <section className="auth-card">
        <h2>{editingId ? "Edit Restaurant" : "Add Restaurant"}</h2>

        <form onSubmit={handleRestaurantSubmit}>
          <input required name="name" placeholder="Restaurant Name" value={form.name} onChange={handleChange} />
          <input required name="location" placeholder="Location" value={form.location} onChange={handleChange} />
          <input required name="cuisine" placeholder="Cuisine" value={form.cuisine} onChange={handleChange} />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />

          <label>Assign Restaurant Owner</label>

          <select required name="owner" value={form.owner} onChange={handleChange}>
            <option value="">Select Owner</option>

            {users.filter((user) => user.role === "owner").map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>

          <button type="submit">
            {editingId ? "Update Restaurant" : "Add Restaurant"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </section>

      <h2>Restaurants</h2>

      {restaurants.map((restaurant) => (
        <article className="review" key={restaurant._id}>
          <strong>{restaurant.name}</strong>
          <p>{restaurant.location} · {restaurant.cuisine}</p>

          <p>
            Owner: {restaurant.owner?.name || restaurant.owner?.email || "Assigned"}
          </p>

          <button onClick={() => editRestaurant(restaurant)}>Edit</button>
          <button onClick={() => deleteRestaurant(restaurant._id)}>Delete</button>
        </article>
      ))}

      <h2>Review Moderation</h2>

      {reviews.length === 0 && <p>No reviews available.</p>}

      {reviews.map((review) => (
        <article className="review" key={review._id}>
          <strong>{review.customer?.name || "Customer"}</strong>
          <p>Restaurant: {review.restaurant?.name || "Restaurant"}</p>
          <p>⭐ {review.rating}/5</p>
          <p>{review.comment}</p>

          <button onClick={() => deleteReview(review._id)}>
            Delete Review
          </button>
        </article>
      ))}
    </main>
  );
}

// ================= APPLICATION ROUTES =================

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage register />} />

        <Route
          path="/restaurant/:id"
          element={<RestaurantDetails />}
        />

        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route
          path="*"
          element={
            <main className="container">
              <h1>Page Not Found</h1>
            </main>
          }
        />
      </Routes>

      <footer>
        Smart Winnr · Restaurant Ratings & Reviews
      </footer>
    </BrowserRouter>
  );
}

export default App;
