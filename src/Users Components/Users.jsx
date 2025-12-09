import styles from "./users.module.css";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";

const Users = () => {
  const { auth, users } = useContext(ItemContext);
  return (
    <div className={styles.users}>
      {auth ? (
        users.map((item) => (
          <div key={item.keyID} className={styles.userInfo}>
            <p>ID: {item.id}</p>
            <p>Username: {item.username}</p>
            <p>Display Name: {item.displayName}</p>
            <p>Role: {item.role}</p>
            <p>Bio: {item.bio}</p>
            <p>CreatedAt: {item.createdAt}</p>
            <hr width="1000px" />
          </div>
        ))
      ) : (
        <h1>
          LogIn To
          <br />
          See Users Info
        </h1>
      )}
    </div>
  );
};

export default Users;
