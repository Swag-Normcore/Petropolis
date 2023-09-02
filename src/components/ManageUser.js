import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { usersAtom, tokenAtom } from "../atoms";
import { getAllUsers } from "../axios-services";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function usersMatch(user, search) {
  const lowerCaseSearch = search.toLowerCase();
  const lowerCaseName = user.name.toLowerCase();
  const lowerCaseEmail = user.email.toLowerCase();
  return (
    lowerCaseName.includes(lowerCaseSearch) ||
    lowerCaseEmail.includes(lowerCaseSearch)
  );
}

function filterUsers(users, search) {
  return users.filter((user) => usersMatch(user, search));
}

const usersToDisplay = (users, search) => {
  if (search.length) {
    return filterUsers(users, search);
  } else {
    return users;
  }
};

const ManageUser = () => {
  const [users, setUsers] = useAtom(usersAtom);
  const [search, setSearch] = useState("");
  const [token, setToken] = useAtom(tokenAtom);

  useEffect(async () => {
    const getUsers = async () => {
      // const result = await getAllUsers({ token });
      // setUsers(result);
    };
    getUsers();
    console.log("users in useEffect", users);
  }, []);

  const handleDelete = async (id) => {
    try {
      const result = await axios.delete(`/api/users/${id}`);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearch("");
  };

  return (
    <div id="users-page">
      <div id="users-container">
        <Form id="search-form" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicSearch">
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search"
              value={search}
              onChange={handleSearchChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        {usersToDisplay && usersToDisplay(users, search).length ? (
          usersToDisplay(users, search).map((user) => (
            <Card key={user.id} style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>{user.name}</Card.Title>
                <Card.Text>{user.email}</Card.Text>
                <Button variant="danger" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
};

export default ManageUser;
