// post object type
export interface postObj {
  id: string;
  timestamp: number;
  author: string;
  text: string;
}

// post render settings object type
// just extra stuff we dont want to be in the normal post object
export interface postRenderSettings {
  clickable?: true;
}
