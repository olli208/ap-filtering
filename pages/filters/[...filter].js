import { useRouter } from "next/router";

const Post = () => {
  const router = useRouter();
  const { filter } = router.query;

  return <p>filter: {filter}</p>;
};

export default Post;
