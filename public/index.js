const form = document.getElementById("addUserForm");
const userList = document.getElementById("userList");

// Fetch users from the backend
const fetchUsers = async () => {
  const response = await fetch("/users");
  const users = await response.json();
  userList.innerHTML = users
    .map((user) => `<li>${user.name} (${user.email})</li>`)
    .join("");
};

// Add a new user
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  await fetch("/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });

  form.reset();
  fetchUsers();
});

// Initial fetch
fetchUsers();
