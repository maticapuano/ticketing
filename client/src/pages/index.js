import buildClient from "../api/build-client";

const HelloWord = ({ data }) => {
  console.log(data);
  return <h1>Hello word</h1>;
};

HelloWord.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get("/api/users/me");

  return data;
};

export default HelloWord;
