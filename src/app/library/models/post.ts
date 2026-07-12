export type postObj = {
  id: string;
  timestamp: number;
  author: string;
  text: string;
};

export type Post = {
  [key: string]: string | number | undefined;
  id: string;
  timestamp: number;
  author: string;
  text: string;

  // public: shown on GET /api/post, and main PostList
  // hidden: not shown on GET /api/post, or main PostList, but still can be got via its ID (GET /api/post/[id])
  // private: same as hidden, but cant be got even by ID
  privacy?: "public" | "hidden" | "private";
  // images: base64[]; // idk how to add this one
};

// post render settings object type
// just extra stuff we dont want to be in the normal post object
export type PostRenderSettings = {
  clickable?: true;
};
