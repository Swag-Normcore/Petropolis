import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { usersAtom, tokenAtom } from "../atoms";
import { getAllUsers } from "../axios-services";
import Form from "react-bootstrap/Form";
import { Col, Button } from "react-bootstrap";
import Stack from "react-bootstrap/Stack";
import { deleteUser, patchUser } from "../axios-services";
import adminStar from "../images/admin-star.svg";

const ManageUser = () => {
  const [users, setUsers] = useAtom(usersAtom);
  const [search, setSearch] = useState("");
  const [searchFilter, setSearchFilter] = useState([]);
  const [token, setToken] = useAtom(tokenAtom);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const result = await getAllUsers({ token });
        setUsers(result);
      } catch (error) {
        console.error(error);
      }
    };
    getUsers();
    console.log("users in useEffect", users);
  }, []);

  const searchUsers = () => {
    const filtered = users.filter((user) => {
      const lowerCaseSearch = search.toLowerCase();
      const lowerCaseName = user.name.toLowerCase();
      const lowerCaseEmail = user.email.toLowerCase();
      return (
        lowerCaseName.includes(lowerCaseSearch) ||
        lowerCaseEmail.includes(lowerCaseSearch)
      );
    });
    setSearchFilter(filtered);
  };

  const handleDelete = async (userId) => {
    const result = await deleteUser({ userId, token });
    console.log(result);
  };

  const handleAdmin = async (userId) => {
    const result = await patchUser({ userId, token, isAdmin: true });
    console.log("result inside handle admin", result);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearch("");
  };

  const usersToDisplay = search ? searchFilter : users;

  return (
    <div id="users-page">
      <Col xs={12} md={8}>
        <h2 className="my-3">Manage Users</h2>
        <Form id="search-form" onSubmit={handleSubmit}>
          <Form.Group className="m-3" controlId="formBasicSearch">
            <Form.Control
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                searchUsers();
              }}
            />
          </Form.Group>
        </Form>
        {usersToDisplay ? (
          usersToDisplay.map((user) => (
            <Stack
              className="border-bottom"
              direction="horizontal"
              key={user.id}
              gap={1}
            >
              <Col sm={1}>{user.isAdmin ? <img src={adminStar} /> : null}</Col>
              <Col sm={3}>
                <p className="p-2">{user.name}</p>
              </Col>
              <Col sm={6}>
                <p className="p-2">{user.email}</p>
              </Col>

              <Button
                className="mx-0 px-0"
                variant="secondary"
                size="sm"
                onClick={() => handleAdmin(user.id)}
              >
                Make Admin
              </Button>
              <Button
                className="mx-0 px-0"
                variant="danger"
                size="sm"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </Button>
            </Stack>
          ))
        ) : (
          <p>No users found</p>
        )}
      </Col>
    </div>
  );
};

export default ManageUser;
