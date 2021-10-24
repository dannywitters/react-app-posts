export const GET_MOKA_POST = `
  query GetPost($id: String!) {
    post(id: $id) {
      id
      upvotes
      timestamp
      user {
        id
      }
      post
      tags
      payouts {
        id
        type
        rank
        reward
      }
      upvotedUsers {
        id
        voterId
      }
    }
  }
`;

export const GET_USER_UPVOTES_IDS = `
  query GetUserUpvotesIds($id: String!) {
    user(id: $id) {
      id
      upvotes {
        id
        postId
      }
    }
  }
`;