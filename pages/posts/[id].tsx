import {
  GetStaticPropsContext,
  InferGetStaticPropsType,
  GetStaticPaths,
} from 'next';

import { Article } from '@components/Article';
import type { Post } from '../index';
import { useRouter } from 'next/router';

export default function BlogPost({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();

  return (
    <Article>
      <h1> Post title: {post.title}</h1>
      <p>{post.body}</p>
    </Article>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts`);
  const posts: Post[] = await res.json();

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;
  console.log(context);

  const emptyPost: Post = {
    title: 'Post Not Found',
    body: '',
    id: 0,
    userId: 0,
  };

  if (!params?.id) {
    return {
      props: {
        post: emptyPost,
      },
    };
  }

  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${params.id}`
  );

  const post: Post = await res.json();

  return {
    props: {
      post,
    },
  };
};
