import axios from "axios";

const apiPost = async (
  route,
  body,
  onSuccess = () => {},
  onError = () => {},
  headers = {}
) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}${route}`,
      body,
      {
        headers: {
          ...headers,
        },
      }
    );

    // console.log("axios response", res);
    onSuccess(res);
  } catch (err) {
    console.log("axios error", err);
    onError(err);
  }
};

const apiGet = async (
  route,
  onSuccess = () => {},
  onError = () => {},
  headers = {}
) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}${route}`, {
      headers: {
        ...headers,
      },
    });

    // console.log("axios response", res);
    onSuccess(res);
  } catch (err) {
    console.log("axios error", err);
    onError(err);
  }
};

const apiPut = async (
  route,
  body,
  onSuccess = () => {},
  onError = () => {},
  headers = {}
) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}${route}`,
      body,
      {
        headers: {
          ...headers,
        },
      }
    );

    // console.log("axios response", res);
    onSuccess(res);
  } catch (err) {
    console.log("axios error", err);
    onError(err);
  }
};

export { apiPost, apiGet, apiPut };
