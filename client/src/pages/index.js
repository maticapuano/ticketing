import buildClient from "../api/build-client";

const HelloWord = ({ data }) => {
  return data ? <h1>You are signed in</h1> : <h1>You are not signed in</h1>;
};

HelloWord.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get("/api/users/me");

  return data;
};

export default HelloWord;
