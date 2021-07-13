import { API } from "./backend";

//send message

export const getConversation = (token) => {
  return fetch(`${API}/conversation`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getUser = (token, userId) => {
  return fetch(`${API}/user/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getMessage = (conversationId) => {
  return fetch(`${API}/messages/${conversationId}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const sendMessage = (sender, text, conversationId) => {
  return fetch(`${API}/messages`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sender, text, conversationId),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
