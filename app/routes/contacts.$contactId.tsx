import { Form } from "@remix-run/react";
import type { FunctionComponent } from "react";
import axios, { AxiosResponse } from 'axios';
import { useState, useEffect } from "react";
import type { ContactRecord } from "../data";

const Contact: FunctionComponent = () => {
  const [contact, setContact] = useState<ContactRecord | null>(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    axios.get('https://randomuser.me/api/')
      .then((response: AxiosResponse<{ results: UserData[] }>) => {
        const userData: UserData = response.data.results[0];
        setLoader(true);
        const newContact: ContactRecord = {
          id: "",
          createdAt: "",
          first: userData.name.first,
          last: userData.name.last,
          avatar: userData.picture.large,
          twitter: userData.login.username,
          notes: "Some notes",
          favorite: true,
        };

        setContact(newContact);
        setLoader(false);
      })
      .catch((error: Error) => {
        console.error('Error fetching random user data:', error);
      });
  }, []);

  if (loader) return <div>Loading...</div>;
  if (!contact) return null;

  return (
    <div id="contact">
      <div>
        <img
          onLoad={() => setLoader(false)} // Once image is loaded, set loader to false
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
          src={contact.avatar}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter ? (
          <p>
            <a
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        ) : null}

        {contact.notes ? <p>{contact.notes}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
};

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, "favorite">;
}> = ({ contact }) => {
  const favorite = contact.favorite;

  return (
    <Form method="post">
      <button
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </Form>
  );
};

interface UserData {
  name: {
    first: string;
    last: string;
  };
  picture: {
    large: string;
  };
  login: {
    username: string;
  };
}

export default Contact;
