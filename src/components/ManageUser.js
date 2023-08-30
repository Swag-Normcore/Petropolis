import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { usersAtom, adminAtom } from "../atoms";
import { getAllUsers, isAdmin } from "../axios-services";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const ManageUser = () => {
  const [users, setUsers] = useAtom(usersAtom);
  const [admin, setAdmin] = useAtom(adminAtom);
  const [checkedId, setCheckedId] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(async () => {
    const getUsers = async () => {
      const result = await getAllUsers();
      setUsers(result);
    };
    const getAdmin = async () => {
      const result = await isAdmin();
      setAdmin(result);
    };

    getUsers();
    getAdmin();
    console.log("users in useEffect", users);
    console.log("admin in useEffect", admin);
  }, []);

  const handleCheckboxChange = (id) => {
    setCheckedId(id);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.get(`/api/users/${search}`);
      setSearchResults(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await axios.delete(`/api/users/${id}`);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePromote = async (id) => {
    try {
      const result = await axios.patch(`/api/users/${id}`);
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
            <Form.Label>Search User</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={search}
              onChange={handleSearch}
            />
            <Button
              variant="primary"
              type="submit"
              onClick={handleSearchSubmit}
            >
              Submit
            </Button>
          </Form.Group>
        </Form>
        <div id="search-results">
          {searchResults.map((user) => (
            <Card key={user.id} style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>{user.name}</Card.Title>
                <Card.Text>{user.email}</Card.Text>
                <Button variant="danger" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handlePromote(user.id)}
                >
                  Promote to Admin
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
        <div id="users-container">
          {users.map((user) => (
            <Card key={user.id} style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>{user.name}</Card.Title>
                <Card.Text>{user.email}</Card.Text>
                <Button variant="danger" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handlePromote(user.id)}
                >
                  Promote to Admin
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
