import { apiPost, apiGet, apiPut } from "./api";

export const login = (body, onSuccess = () => {}, onError = () => {}) => {
  apiPost(
    "/email/login/",
    { email: body.username, password: body.password },
    onSuccess,
    onError
  );
};

export const register = (body, onSuccess = () => {}, onError = () => {}) => {
  apiPost(
    "/register/",
    {
      username: body.email,
      password1: body.password,
      password2: body.confirmPassword,
      first_name: body.firstName,
      last_name: body.lastName,
      email: body.email,
      phone: "555 555 5555",
    },
    onSuccess,
    onError
  );
};

export const fetchConversations = (
  onSuccess = () => {},
  onError = () => {},
  apiHeaders = {}
) => {
  apiGet("/get/conversations/", onSuccess, onError, apiHeaders);
};

export const sendChat = (
  body = {},
  onSuccess = () => {},
  onError = () => {},
  apiHeaders = {}
) => {
  apiPost("/chat/send/", body, onSuccess, onError, apiHeaders);
};

export const fetchProfileData = (
  onSuccess = () => {},
  onError = () => {},
  apiHeaders = {}
) => {
  apiGet("/api/user/", onSuccess, onError, apiHeaders);
};

export const resetPassword = (
  email,
  onSuccess = () => {},
  onError = () => {}
) => {
  apiPost("/forgot-password/", { email }, onSuccess, onError);
};

export const updateSettings = (
  body,
  onSuccess = () => {},
  onError = () => {},
  apiHeaders = {}
) => {
  apiPut("/api/user/", { ...body }, onSuccess, onError, apiHeaders);
};

export const changePassword = (
  body,
  onSuccess = () => {},
  onError = () => {},
  apiHeaders = {}
) => {
  apiPost("/api/change-password/", { ...body }, onSuccess, onError, apiHeaders);
};
