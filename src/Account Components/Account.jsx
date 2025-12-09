import styles from "./account.module.css";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";

const Account = () => {
  const { auth, account } = useContext(ItemContext);
  return (
    <div className={styles.account}>
      {auth ? (
        <div key={account.keyID} className="accountInfo">
          <h1>ID: {account.id}</h1>
          <h1>Username: {account.username}</h1>
          <h1>Display Name: {account.displayName}</h1>
          <h1>Role: {account.role}</h1>
          <h1>Bio: {account.bio}</h1>
          <h1>CreatedAt: {account.createdAt}</h1>
        </div>
      ) : (
        <h1>
          LogIn To
          <br />
          See Account Info
        </h1>
      )}
    </div>
  );
};

export default Account;
