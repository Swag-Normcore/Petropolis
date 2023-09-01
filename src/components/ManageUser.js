import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { usersAtom } from "../atoms";
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

const ManageUser = () => {
  const [users, setUsers] = useAtom(usersAtom);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    setFilteredUsers(filterUsers(users, search));
  }, [search, users]);

  useEffect(async () => {
    const getUsers = async () => {
      const result = await getAllUsers();
      setUsers(result);
    };
    getUsers();
    console.log("users in useEffect", users);
  }, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleDelete = async (id) => {
    try {
      const result = await axios.delete(`/api/users/${id}`);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id="manage-user-page">
      <div id="manage-user-container">
        <Form id="manage-user-form">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search"
              value={search}
              onChange={handleSearchChange}
            />
          </Form.Group>
        </Form>
        {filteredUsers.map((user) => (
          <Card key={user.id} style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>{user.name}</Card.Title>
              <Card.Text>{user.email}</Card.Text>
              <Button variant="danger" onClick={() => handleDelete(user.id)}>
                Delete
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageUser;
